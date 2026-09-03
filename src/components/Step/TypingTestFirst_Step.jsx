import React, { useState, useEffect, useRef, useCallback } from "react";
import typingData from "./file.json";

const TypingTestFirstStep = ({ stepId = 1 }) => {
  // Get current step data from JSON
  const stepData = typingData.steps.find(step => step.id === stepId) || typingData.steps[0];
  const TEXT = stepData.practiceText;
  
  // Get other data from JSON
  const resultMessages = typingData.resultMessages;
  const statusMessages = typingData.statusMessages;
  const buttonTexts = typingData.buttonTexts;
  const keyboardShortcuts = typingData.keyboardShortcuts;
  const statLabels = typingData.statLabels;

  // State management
  const [typed, setTyped] = useState([]);
  const [active, setActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [mistakeCount, setMistakeCount] = useState(0);
  const [showIntroduction, setShowIntroduction] = useState(true);
  const [showResult, setShowResult] = useState(false);
  const [status, setStatus] = useState("");
  const [stats, setStats] = useState({
    wpm: 0,
    accuracy: 100,
    time: "0:00",
    progress: 0,
    total: TEXT.length,
    mistakes: 0,
  });

  // Refs
  const inputRef = useRef(null);
  const timerRef = useRef(null);

  
  // Render text with visual feedback
  const renderText = useCallback(() => {
    return TEXT.split("").map((char, index) => {
      let className = "text-gray-400";

      if (index < typed.length) {
        className = typed[index].correct
          ? "text-green-600 bg-green-50"
          : "text-red-600 bg-red-50";
      } else if (index === typed.length && !isFinished) {
        className = "text-[#1B2430] bg-yellow-100 border-b-4 border-[#C9A15E]";
      }

      return (
        <span
          key={index}
          className={`inline-block px-1 mx-[1px] rounded transition-all duration-150 ${className}`}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      );
    });
  }, [typed, isFinished, TEXT]);

  // Update live statistics
  const updateStats = useCallback(() => {
    const correctCharacters = typed.filter((item) => item.correct).length;
    const totalTyped = typed.length;
    
    const accuracy = totalTyped === 0
      ? 100
      : Math.round((correctCharacters / totalTyped) * 100);

    let wpm = 0;
    let time = "0:00";

    if (startTime) {
      const elapsed = (Date.now() - startTime) / 1000;
      const minutes = elapsed / 60;
      
      if (minutes > 0) {
        wpm = Math.round((correctCharacters / 5) / minutes);
      }

      const mins = Math.floor(elapsed / 60);
      const secs = Math.floor(elapsed % 60);
      time = `${mins}:${String(secs).padStart(2, "0")}`;
    }

    setStats({
      wpm,
      accuracy,
      time,
      progress: totalTyped,
      total: TEXT.length,
      mistakes: mistakeCount,
    });
  }, [typed, startTime, mistakeCount, TEXT.length]);

  // Start the typing test
  const startTest = useCallback(() => {
    setActive(true);
    setIsFinished(false);
    setTyped([]);
    setMistakeCount(0);
    setStartTime(Date.now());
    setShowResult(false);
    setStatus("");

    setStats({
      wpm: 0,
      accuracy: 100,
      time: "0:00",
      progress: 0,
      total: TEXT.length,
      mistakes: 0,
    });

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      updateStats();
    }, 400);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  }, [updateStats, TEXT.length]);

  // Reset everything
  const restartTest = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setActive(false);
    setIsFinished(false);
    setTyped([]);
    setMistakeCount(0);
    setStartTime(null);
    setShowResult(false);
    setStatus("");

    setStats({
      wpm: 0,
      accuracy: 100,
      time: "0:00",
      progress: 0,
      total: TEXT.length,
      mistakes: 0,
    });

    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, [TEXT.length]);

  // Mark test as complete
  const finishTest = useCallback(() => {
    setIsFinished(true);
    setActive(false);

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setShowResult(true);
    setStatus(statusMessages.completed);

    setTimeout(() => {
      updateStats();
    }, 100);
  }, [updateStats, statusMessages.completed]);

  // Process a single typed character
  const typeOneChar = useCallback(
    (key) => {
      if (!active || isFinished) return;

      const expected = TEXT[typed.length];
      if (expected === undefined) return;

      const correct = key === expected;
      const newTyped = [...typed, { char: key, correct }];

      setTyped(newTyped);

      if (!correct) {
        setMistakeCount((previous) => previous + 1);
      }

      if (newTyped.length === TEXT.length) {
        finishTest();
      }
    },
    [active, isFinished, typed, finishTest, TEXT]
  );

  // Handle keyboard events
  const handleKeyDown = useCallback(
    (event) => {
      if (!active) {
        if (event.key === " " && !isFinished) {
          event.preventDefault();
          startTest();
        }
        return;
      }

      if (event.key === "Backspace") {
        event.preventDefault();

        if (typed.length > 0) {
          const lastCharacter = typed[typed.length - 1];
          setTyped((previous) => previous.slice(0, -1));
          
          if (!lastCharacter.correct) {
            setMistakeCount((previous) => Math.max(0, previous - 1));
          }
        }
      }
    },
    [active, isFinished, typed, startTest]
  );

  // Handle input from hidden input field
  const handleInput = useCallback(
    (event) => {
      if (!active) {
        event.target.value = "";
        return;
      }

      const characters = event.target.value.split("");
      characters.forEach((character) => {
        typeOneChar(character);
      });

      event.target.value = "";
    },
    [active, typeOneChar]
  );

  // Focus and blur handlers
  const handleFocus = () => {
    setStatus("");
  };

  const handleBlur = () => {
    if (active) {
      setStatus(statusMessages.paused);
    }
  };

  // Keyboard shortcut: Ctrl+Shift+R to restart
  useEffect(() => {
    const handleShortcut = (event) => {
      if (
        (event.ctrlKey || event.metaKey) &&
        event.shiftKey &&
        event.key.toLowerCase() === "r"
      ) {
        event.preventDefault();
        restartTest();
      }
    };

    document.addEventListener("keydown", handleShortcut);
    return () => {
      document.removeEventListener("keydown", handleShortcut);
    };
  }, [restartTest]);

  // Update stats on typing changes
  useEffect(() => {
    if (active || isFinished) {
      updateStats();
    }
  }, [typed, active, isFinished, updateStats]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Focus input when intro is hidden
  useEffect(() => {
    if (!showIntroduction) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [showIntroduction]);

  // Generate result message based on accuracy
  const getResultMessage = () => {
    const message = resultMessages.find(msg => stats.accuracy >= msg.minAccuracy);
    return message || resultMessages[resultMessages.length - 1];
  };

  const result = getResultMessage();

  // Mobile keyboard handlers
  const pressPashtoKey = (letter) => {
    if (!active && !isFinished) {
      startTest();
      setTimeout(() => {
        typeOneChar(letter);
      }, 80);
    } else {
      typeOneChar(letter);
    }
    inputRef.current?.focus();
  };

  const mobileBackspace = () => {
    if (!active || typed.length === 0) return;

    const last = typed[typed.length - 1];
    setTyped((previous) => previous.slice(0, -1));

    if (!last.correct) {
      setMistakeCount((previous) => Math.max(0, previous - 1));
    }

    inputRef.current?.focus();
  };

  return (
    <main dir="rtl" className="min-h-screen bg-gradient-to-br from-[#F8FAFC] via-white to-[#FBF6E3] px-4 py-6 sm:py-10">
      <div className="max-w-5xl mx-auto">
        {/* Introduction Screen */}
        {showIntroduction && (
          <section className="bg-white rounded-3xl border border-gray-200 shadow-xl p-5 sm:p-8">
            {/* Eye Guide - Look Straight Ahead - Image Design */}
            <div className="flex items-center justify-center gap-4 mb-8 bg-[#1B2430] text-white rounded-2xl py-5 px-8 shadow-xl border-2 border-[#C9A15E]/40">
              <span className="text-4xl">👁️</span>
              <span className="text-xl font-bold tracking-wide text-center">
                مخکې وګورئ · لکه څنګه چې تاسو یو چا ته ګورئ
              </span>
              <span className="text-4xl">👁️</span>
            </div>

            <div className="flex items-center gap-4 mb-7">
              <div className="w-14 h-14 rounded-2xl bg-[#1B2430] text-white flex items-center justify-center text-2xl font-bold shadow-lg">
                {() => {
                  return (
                    <div>
                      <h1>My name Lorem ipsum dolor sit amet consectetur, adipisicing elit. Deserunt ducimus possimus modi voluptates nobis unde sed ullam vero labore, dolorum libero assumenda suscipit blanditiis pariatur illum nisi consectetur aliquid dolores dolore error, voluptatem veritatis repellat atque est. Quos, illo iure voluptas aliquam dolorum, tempora minus sint ad inventore vero possimus nobis. Vel tempore obcaecati sint totam eum, deserunt, doloremque esse illo eligendi eaque iure odit neque cumque porro asperiores nostrum sequi. Possimus nobis unde ducimus aut inventore nesciunt nihil totam, in fugit quas minus fuga, quos deleniti architecto explicabo facere ab nostrum laboriosam ea! Ratione, laborum iure. Quaerat, saepe nisi. ifjalskdjdsals Ahmad hotaki</h1>
                    </div>
                  );
                }}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#C9A15E] mb-1">د پښتو ټایپنګ کورس</p>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#1B2430]">{stepData.title}</h1>
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-[#1B2430] mb-5">
              {stepData.instructions.title}
            </h2>

            <div className="space-y-4 text-gray-600 text-sm sm:text-base leading-8">
              {stepData.instructions.paragraphs.map((para, index) => (
                <p key={index}>{para}</p>
              ))}
            </div>

            <div className="mt-7">
              <h3 className="text-lg sm:text-xl font-bold text-[#1B2430] mb-4">


                د کیبورډ تڼۍ وپېژنئ
              </h3>
              <div className="grid grid-cols-2 gap-4" dir="ltr">
                {stepData.keys.map((key, index) => (
                  <div key={index} className="bg-[#FBF6E3] border border-[#E6DCA9] rounded-2xl p-5 text-center">
                    <div className="text-sm text-gray-500 mb-3">{key.description}</div>
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-white border-2 border-[#C9A15E] text-3xl font-bold text-[#1B2430] shadow">
                      {key.englishKey}
                    </div>
                    <div className="text-3xl font-bold text-[#1B2430] mt-3" dir="rtl">
                      {key.pashtoLetter}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 bg-[#1B2430] rounded-2xl p-5 text-white">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{stepData.tip.emoji}</span>
                <div>
                  <h3 className="font-bold mb-2">{stepData.tip.title}</h3>
                  <p className="text-sm text-gray-300 leading-7">{stepData.tip.message}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-7">
              <button
                type="button"
                onClick={() => setShowIntroduction(false)}
                className="px-8 py-3.5 rounded-xl bg-[#C9A15E] hover:bg-[#B58D4B] text-white font-bold shadow-lg transition duration-200 active:scale-95"
              >
                {buttonTexts.startPractice}
              </button>
            </div>
          </section>
        )}

        {/* Typing Test Screen */}
        {!showIntroduction && (
          <section className="bg-white rounded-3xl border border-gray-200 shadow-xl p-5 sm:p-8">
            {/* Eye Guide - Look Straight Ahead - Image Design */}
            <div className="flex items-center justify-center gap-3 mb-6 bg-[#1B2430] text-white rounded-2xl py-3 px-6 shadow-xl border-2 border-[#C9A15E]/40">
              <span className="text-3xl">👁️</span>
              <span className="text-lg font-bold tracking-wide text-center">
                مخکې وګورئ · لکه څنګه چې تاسو یو چا ته ګورئ
              </span>
              <span className="text-3xl">👁️</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <p className="text-sm font-semibold text-[#C9A15E]">{stepData.title}</p>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#1B2430] mt-1">
                  {stepData.subtitle}
                </h1>
              </div>
              <div className="px-4 py-2 rounded-xl bg-[#FBF6E3] border border-[#E6DCA9] text-sm font-bold text-[#1B2430] self-start">
                لومړی تمرین
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 mb-6">
              <p className="text-sm text-gray-600 leading-7">{stepData.instruction}</p>
            </div>

            <div dir="ltr" className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-5">
              <Stat label={statLabels.wpm} value={stats.wpm} />
              <Stat label={statLabels.accuracy} value={`${stats.accuracy}%`} />
              <Stat label={statLabels.time} value={stats.time} />
              <Stat label={statLabels.progress} value={`${stats.progress}/${stats.total}`} />
              <Stat label={statLabels.mistakes} value={stats.mistakes} />
            </div>

            <div className="mb-5">
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>پرمختګ</span>
                <span dir="ltr">
                  {Math.round((stats.progress / stats.total) * 100) || 0}%
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#C9A15E] rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(100, (stats.progress / stats.total) * 100)}%`,
                  }}
                />
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm mb-5">
              {active
                ? statusMessages.active
                : isFinished
                ? statusMessages.finished
                : statusMessages.ready}
            </div>

            <div
              onClick={() => active && inputRef.current?.focus()}
              dir="rtl"
              className="min-h-[190px] sm:min-h-[230px] flex items-center justify-center flex-wrap content-center text-center px-5 sm:px-10 py-10 rounded-2xl border-2 border-gray-200 bg-gray-50 font-sans text-3xl sm:text-4xl font-bold leading-[2] cursor-text select-none"
            >
              {renderText()}
            </div>

            <div className="min-h-[35px] flex items-center justify-center text-sm text-orange-600 text-center mt-2">
              {status}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <button
                type="button"
                onClick={active ? () => inputRef.current?.focus() : startTest}
                className="flex-1 px-6 py-3.5 rounded-xl bg-[#1B2430] hover:bg-[#273444] text-white font-bold shadow-md transition active:scale-[0.98]"
              >
                {active ? buttonTexts.running : isFinished ? buttonTexts.retry : buttonTexts.start}
              </button>
              <button
                type="button"
                onClick={restartTest}
                className="px-6 py-3.5 rounded-xl bg-white border-2 border-gray-200 hover:bg-gray-50 text-[#1B2430] font-bold transition active:scale-[0.98]"
              >
                {buttonTexts.restart}
              </button>
            </div>

            {showResult && (
              <div className="mt-7 bg-gradient-to-br from-green-50 to-white border border-green-200 rounded-2xl p-6 text-center">
                <div className="text-5xl mb-3">{result.emoji}</div>
                <h2 className="text-2xl font-bold text-[#1B2430] mb-2">{result.title}</h2>
                <p className="text-gray-600 text-sm mb-6">{result.message}</p>
                <div dir="ltr" className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <ResultStat label={statLabels.wpm} value={stats.wpm} />
                  <ResultStat label={statLabels.accuracy} value={`${stats.accuracy}%`} />
                  <ResultStat label={statLabels.time} value={stats.time} />
                  <ResultStat label={statLabels.mistakes} value={stats.mistakes} />
                </div>
              </div>
            )}

            <div className="mt-7 pt-6 border-t border-gray-100">
              <h3 className="text-center font-bold text-[#1B2430] mb-4">د کیبورډ تمرین</h3>
              <div dir="ltr" className="flex items-center justify-center gap-4">
                {stepData.keys.map((key, index) => (
                  <React.Fragment key={index}>
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-xl bg-gray-100 border-2 border-gray-300 flex items-center justify-center text-2xl font-bold">
                        {key.englishKey}
                      </div>
                      <div dir="rtl" className="mt-2 text-xl font-bold text-[#C9A15E]">
                        {key.pashtoLetter}
                      </div>
                    </div>
                    {index < stepData.keys.length - 1 && (
                      <div className="text-gray-400 text-2xl">→</div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3 mt-6 text-xs text-gray-500">
              {keyboardShortcuts.map((shortcut, index) => (
                <span key={index}>
                  {shortcut.keys.map((key, keyIndex) => (
                    <React.Fragment key={keyIndex}>
                      <kbd className="px-2 py-1 rounded bg-gray-100 border border-gray-200 font-mono">
                        {key}
                      </kbd>
                      {keyIndex < shortcut.keys.length - 1 && " + "}
                    </React.Fragment>
                  ))}
                  {" "}{shortcut.action}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-3 mt-7 sm:hidden" dir="ltr">
              {stepData.keys.map((key, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => pressPashtoKey(key.pashtoLetter)}
                  className="h-16 rounded-xl bg-white border-2 border-gray-200 text-3xl font-bold text-[#1B2430] hover:border-[#C9A15E] active:scale-95 transition"
                >
                  {key.pashtoLetter}
                </button>
              ))}
              <button
                type="button"
                onClick={mobileBackspace}
                className="h-16 rounded-xl bg-gray-100 border-2 border-gray-200 text-2xl font-bold text-[#1B2430] active:scale-95 transition"
              >
                ⌫
              </button>
            </div>

            <input
              ref={inputRef}
              type="text"
              className="fixed left-[-9999px] top-0 w-px h-px opacity-0"
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck="false"
              onKeyDown={handleKeyDown}
              onInput={handleInput}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </section>
        )}
      </div>
    </main>
  );
};

// Stat component for displaying individual statistics
const Stat = ({ label, value }) => {
  return (
    <div className="bg-[#FBF6E3] border border-[#E6DCA9] rounded-xl px-3 py-3 text-center">
      <div className="text-[10px] sm:text-xs text-gray-500 mb-1">{label}</div>
      <div className="text-sm sm:text-base font-bold text-[#1B2430]">{value}</div>
    </div>
  );
};

// ResultStat component for displaying statistics in results panel
const ResultStat = ({ label, value }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-3">
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className="text-lg font-bold text-[#1B2430]">{value}</div>
    </div>
  );
};

export default TypingTestFirstStep;