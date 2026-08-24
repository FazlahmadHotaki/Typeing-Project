import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";

const TypingTestFirstStep = () => {
  // =====================================================
  // FIRST STEP TEXT
  // F = ب
  // J = ت
  // =====================================================

  const TEXT = "بتتب تبتت تتبت تببت بتتب تبتب تتب";

  // =====================================================
  // STATES
  // =====================================================

  const [typed, setTyped] = useState([]);

  const [active, setActive] = useState(false);

  const [isFinished, setIsFinished] = useState(false);

  const [startTime, setStartTime] = useState(null);

  const [mistakeCount, setMistakeCount] = useState(0);

  const [showIntroduction, setShowIntroduction] =
    useState(true);

  const [showResult, setShowResult] =
    useState(false);

  const [status, setStatus] = useState("");

  const [stats, setStats] = useState({
    wpm: 0,
    accuracy: 100,
    time: "0:00",
    progress: 0,
    total: TEXT.length,
    mistakes: 0,
  });

  // =====================================================
  // REFS
  // =====================================================

  const inputRef = useRef(null);

  const timerRef = useRef(null);

  // =====================================================
  // RENDER TEXT
  // =====================================================

  const renderText = useCallback(() => {
    return TEXT.split("").map((char, index) => {
      let className =
        "text-gray-400";

      // Typed character
      if (index < typed.length) {
        className = typed[index].correct
          ? "text-green-600 bg-green-50"
          : "text-red-600 bg-red-50";
      }

      // Current character
      else if (
        index === typed.length &&
        !isFinished
      ) {
        className =
          "text-[#1B2430] bg-yellow-100 border-b-4 border-[#C9A15E]";
      }

      return (
        <span
          key={index}
          className={`
            inline-block
            px-1
            mx-[1px]
            rounded
            transition-all
            duration-150
            ${className}
          `}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      );
    });
  }, [typed, isFinished]);

  // =====================================================
  // UPDATE STATISTICS
  // =====================================================

  const updateStats = useCallback(() => {
    const correctCharacters =
      typed.filter(
        (item) => item.correct
      ).length;

    const totalTyped = typed.length;

    const accuracy =
      totalTyped === 0
        ? 100
        : Math.round(
            (correctCharacters /
              totalTyped) *
              100
          );

    let wpm = 0;

    let time = "0:00";

    if (startTime) {
      const elapsed =
        (Date.now() - startTime) /
        1000;

      const minutes = elapsed / 60;

      if (minutes > 0) {
        wpm = Math.round(
          (correctCharacters / 5) /
            minutes
        );
      }

      const mins = Math.floor(
        elapsed / 60
      );

      const secs = Math.floor(
        elapsed % 60
      );

      time = `${mins}:${String(
        secs
      ).padStart(2, "0")}`;
    }

    setStats({
      wpm,
      accuracy,
      time,
      progress: totalTyped,
      total: TEXT.length,
      mistakes: mistakeCount,
    });
  }, [
    typed,
    startTime,
    mistakeCount,
  ]);

  // =====================================================
  // START TEST
  // =====================================================

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
      clearInterval(
        timerRef.current
      );
    }

    timerRef.current = setInterval(() => {
      updateStats();
    }, 400);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  }, [updateStats]);

  // =====================================================
  // RESTART
  // =====================================================

  const restartTest = useCallback(() => {
    if (timerRef.current) {
      clearInterval(
        timerRef.current
      );
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
  }, []);

  // =====================================================
  // FINISH TEST
  // =====================================================

  const finishTest = useCallback(() => {
    setIsFinished(true);

    setActive(false);

    if (timerRef.current) {
      clearInterval(
        timerRef.current
      );
    }

    setShowResult(true);

    setStatus(
      "🎉 تمرین په بریالیتوب بشپړ شو!"
    );

    setTimeout(() => {
      updateStats();
    }, 100);
  }, [updateStats]);

  // =====================================================
  // TYPE CHARACTER
  // =====================================================

  const typeOneChar = useCallback(
    (key) => {
      if (!active || isFinished) {
        return;
      }

      const expected =
        TEXT[typed.length];

      if (expected === undefined) {
        return;
      }

      const correct =
        key === expected;

      const newTyped = [
        ...typed,
        {
          char: key,
          correct,
        },
      ];

      setTyped(newTyped);

      if (!correct) {
        setMistakeCount(
          (previous) =>
            previous + 1
        );
      }

      if (
        newTyped.length ===
        TEXT.length
      ) {
        finishTest();
      }
    },
    [
      active,
      isFinished,
      typed,
      finishTest,
    ]
  );

  // =====================================================
  // KEYBOARD HANDLER
  // =====================================================

  const handleKeyDown = useCallback(
    (event) => {
      // ---------------------------------------------
      // START WITH SPACE
      // ---------------------------------------------

      if (!active) {
        if (
          event.key === " " &&
          !isFinished
        ) {
          event.preventDefault();

          startTest();
        }

        return;
      }

      // ---------------------------------------------
      // BACKSPACE
      // ---------------------------------------------

      if (
        event.key === "Backspace"
      ) {
        event.preventDefault();

        if (typed.length > 0) {
          const lastCharacter =
            typed[typed.length - 1];

          setTyped((previous) =>
            previous.slice(0, -1)
          );

          if (
            !lastCharacter.correct
          ) {
            setMistakeCount(
              (previous) =>
                Math.max(
                  0,
                  previous - 1
                )
            );
          }
        }
      }
    },
    [
      active,
      isFinished,
      typed,
      startTest,
    ]
  );

  // =====================================================
  // INPUT HANDLER
  // =====================================================

  const handleInput = useCallback(
    (event) => {
      if (!active) {
        event.target.value = "";

        return;
      }

      const characters =
        event.target.value.split("");

      characters.forEach(
        (character) => {
          typeOneChar(character);
        }
      );

      event.target.value = "";
    },
    [active, typeOneChar]
  );

  // =====================================================
  // FOCUS
  // =====================================================

  const handleFocus = () => {
    setStatus("");
  };

  // =====================================================
  // BLUR
  // =====================================================

  const handleBlur = () => {
    if (active) {
      setStatus(
        "⏸️ د ټایپنګ د دوام لپاره دلته کلیک وکړئ."
      );
    }
  };

  // =====================================================
  // CTRL + SHIFT + R
  // =====================================================

  useEffect(() => {
    const handleShortcut = (event) => {
      if (
        (event.ctrlKey ||
          event.metaKey) &&
        event.shiftKey &&
        event.key.toLowerCase() ===
          "r"
      ) {
        event.preventDefault();

        restartTest();
      }
    };

    document.addEventListener(
      "keydown",
      handleShortcut
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleShortcut
      );
    };
  }, [restartTest]);

  // =====================================================
  // UPDATE STATS
  // =====================================================

  useEffect(() => {
    if (active || isFinished) {
      updateStats();
    }
  }, [
    typed,
    active,
    isFinished,
    updateStats,
  ]);

  // =====================================================
  // CLEAN TIMER
  // =====================================================

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(
          timerRef.current
        );
      }
    };
  }, []);

  // =====================================================
  // FOCUS
  // =====================================================

  useEffect(() => {
    if (!showIntroduction) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [showIntroduction]);

  // =====================================================
  // RESULT MESSAGE
  // =====================================================

  const getResultMessage = () => {
    if (stats.accuracy >= 95) {
      return {
        emoji: "🏆",
        title:
          "ډېر ښه!",
        message:
          "ستاسو د ټایپنګ دقت ډېر ښه دی.",
      };
    }

    if (stats.accuracy >= 85) {
      return {
        emoji: "🌟",
        title:
          "ښه کار!",
        message:
          "تاسو ښه پرمختګ کړی، تمرین ته دوام ورکړئ.",
      };
    }

    if (stats.accuracy >= 70) {
      return {
        emoji: "👍",
        title:
          "ښه پیل!",
        message:
          "خپل دقت لوړولو لپاره بیا تمرین وکړئ.",
      };
    }

    return {
      emoji: "💪",
      title:
        "تمرین ته دوام ورکړئ!",
      message:
        "لومړی دقت زده کړئ، وروسته سرعت زیات کړئ.",
    };
  };

  const result =
    getResultMessage();

  // =====================================================
  // MOBILE KEY
  // =====================================================

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

  // =====================================================
  // MOBILE BACKSPACE
  // =====================================================

  const mobileBackspace = () => {
    if (!active || typed.length === 0) {
      return;
    }

    const last =
      typed[typed.length - 1];

    setTyped((previous) =>
      previous.slice(0, -1)
    );

    if (!last.correct) {
      setMistakeCount(
        (previous) =>
          Math.max(
            0,
            previous - 1
          )
      );
    }

    inputRef.current?.focus();
  };

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <main
      dir="rtl"
      className="
        min-h-screen
        bg-gradient-to-br
        from-[#F8FAFC]
        via-white
        to-[#FBF6E3]
        px-4
        py-6
        sm:py-10
      "
    >
      <div
        className="
          max-w-5xl
          mx-auto
        "
      >

        {/* =================================================
            INTRODUCTION
        ================================================= */}

        {showIntroduction && (
          <section
            className="
              bg-white
              rounded-3xl
              border
              border-gray-200
              shadow-xl
              p-5
              sm:p-8
            "
          >

            {/* Step Header */}

            <div
              className="
                flex
                items-center
                gap-4
                mb-7
              "
            >
              <div
                className="
                  w-14
                  h-14
                  rounded-2xl
                  bg-[#1B2430]
                  text-white
                  flex
                  items-center
                  justify-center
                  text-2xl
                  font-bold
                  shadow-lg
                "
              >
                ۱
              </div>

              <div>
                <p
                  className="
                    text-sm
                    font-semibold
                    text-[#C9A15E]
                    mb-1
                  "
                >
                  د پښتو ټایپنګ کورس
                </p>

                <h1
                  className="
                    text-2xl
                    sm:text-3xl
                    font-bold
                    text-[#1B2430]
                  "
                >
                  لومړی ګام
                </h1>
              </div>
            </div>

            {/* Title */}

            <h2
              className="
                text-2xl
                sm:text-3xl
                font-bold
                text-[#1B2430]
                mb-5
              "
            >
              د پښتو ټایپنګ پېژندنه ⌨️
            </h2>

            {/* Introduction */}

            <div
              className="
                space-y-4
                text-gray-600
                text-sm
                sm:text-base
                leading-8
              "
            >
              <p>
                پښتو ټایپنګ هغه مهارت دی چې
                تاسو پرې د کمپیوټر کیبورډ
                له لارې پښتو توري، کلمې او
                جملې لیکلی شئ.
              </p>

              <p>
                په دې لومړي ګام کې به موږ
                د پښتو کیبورډ له دوو
                بنسټیزو تورو څخه پیل وکړو:
                <strong className="text-[#1B2430]">
                  {" "}ب
                </strong>
                {" "}او
                <strong className="text-[#1B2430]">
                  {" "}ت
                </strong>.
              </p>

              <p>
                هدف دا دی چې تاسو د کیبورډ
                تڼۍ په یاد زده کړئ او پرته
                له دې چې کیبورډ ته وګورئ،
                په سمه توګه ټایپ کول پیل کړئ.
              </p>
            </div>

            {/* Keyboard Mapping */}

            <div className="mt-7">

              <h3
                className="
                  text-lg
                  sm:text-xl
                  font-bold
                  text-[#1B2430]
                  mb-4
                "
              >
                د کیبورډ تڼۍ وپېژنئ
              </h3>

              <div
                className="
                  grid
                  grid-cols-2
                  gap-4
                "
                dir="ltr"
              >

                {/* F */}

                <div
                  className="
                    bg-[#FBF6E3]
                    border
                    border-[#E6DCA9]
                    rounded-2xl
                    p-5
                    text-center
                  "
                >
                  <div
                    className="
                      text-sm
                      text-gray-500
                      mb-3
                    "
                  >
                    F Key
                  </div>

                  <div
                    className="
                      inline-flex
                      items-center
                      justify-center
                      w-16
                      h-16
                      rounded-xl
                      bg-white
                      border-2
                      border-[#C9A15E]
                      text-3xl
                      font-bold
                      text-[#1B2430]
                      shadow
                    "
                  >
                    F
                  </div>

                  <div
                    className="
                      text-3xl
                      font-bold
                      text-[#1B2430]
                      mt-3
                    "
                    dir="rtl"
                  >
                    ب
                  </div>
                </div>

                {/* J */}

                <div
                  className="
                    bg-[#FBF6E3]
                    border
                    border-[#E6DCA9]
                    rounded-2xl
                    p-5
                    text-center
                  "
                >
                  <div
                    className="
                      text-sm
                      text-gray-500
                      mb-3
                    "
                  >
                    J Key
                  </div>

                  <div
                    className="
                      inline-flex
                      items-center
                      justify-center
                      w-16
                      h-16
                      rounded-xl
                      bg-white
                      border-2
                      border-[#C9A15E]
                      text-3xl
                      font-bold
                      text-[#1B2430]
                      shadow
                    "
                  >
                    J
                  </div>

                  <div
                    className="
                      text-3xl
                      font-bold
                      text-[#1B2430]
                      mt-3
                    "
                    dir="rtl"
                  >
                    ت
                  </div>
                </div>

              </div>
            </div>

            {/* Important Tip */}

            <div
              className="
                mt-6
                bg-[#1B2430]
                rounded-2xl
                p-5
                text-white
              "
            >
              <div
                className="
                  flex
                  items-start
                  gap-3
                "
              >
                <span className="text-2xl">
                  💡
                </span>

                <div>
                  <h3
                    className="
                      font-bold
                      mb-2
                    "
                  >
                    مهمه مشوره
                  </h3>

                  <p
                    className="
                      text-sm
                      text-gray-300
                      leading-7
                    "
                  >
                    په دې مرحله کې خپل
                    تمرکز پر دقت وکړئ.
                    که تاسو ورو ټایپ کوئ،
                    ستونزه نه ده. کله چې
                    ستاسو دقت ښه شي، سرعت
                    به هم زیات شي.
                  </p>
                </div>
              </div>
            </div>

            {/* Start Button */}

            <div
              className="
                flex
                justify-center
                mt-7
              "
            >
              <button
                type="button"
                onClick={() =>
                  setShowIntroduction(
                    false
                  )
                }
                className="
                  px-8
                  py-3.5
                  rounded-xl
                  bg-[#C9A15E]
                  hover:bg-[#B58D4B]
                  text-white
                  font-bold
                  shadow-lg
                  transition
                  duration-200
                  active:scale-95
                "
              >
                تمرین پیل کړئ ←
              </button>
            </div>
          </section>
        )}

        {/* =================================================
            TYPING TEST
        ================================================= */}

        {!showIntroduction && (
          <section
            className="
              bg-white
              rounded-3xl
              border
              border-gray-200
              shadow-xl
              p-5
              sm:p-8
            "
          >

            {/* Header */}

            <div
              className="
                flex
                flex-col
                sm:flex-row
                sm:items-center
                sm:justify-between
                gap-4
                mb-6
              "
            >
              <div>
                <p
                  className="
                    text-sm
                    font-semibold
                    text-[#C9A15E]
                  "
                >
                  لومړی ګام
                </p>

                <h1
                  className="
                    text-2xl
                    sm:text-3xl
                    font-bold
                    text-[#1B2430]
                    mt-1
                  "
                >
                  د ب او ت تورو تمرین
                </h1>
              </div>

              <div
                className="
                  px-4
                  py-2
                  rounded-xl
                  bg-[#FBF6E3]
                  border
                  border-[#E6DCA9]
                  text-sm
                  font-bold
                  text-[#1B2430]
                  self-start
                "
              >
                لومړی تمرین
              </div>
            </div>

            {/* Explanation */}

            <div
              className="
                bg-gray-50
                border
                border-gray-200
                rounded-2xl
                p-4
                mb-6
              "
            >
              <p
                className="
                  text-sm
                  text-gray-600
                  leading-7
                "
              >
                د
                <strong className="text-[#1B2430]">
                  {" "}F
                </strong>
                {" "}تڼۍ په وهلو سره
                <strong className="text-[#C9A15E]">
                  {" "}ب
                </strong>
                {" "}او د
                <strong className="text-[#1B2430]">
                  {" "}J
                </strong>
                {" "}تڼۍ په وهلو سره
                <strong className="text-[#C9A15E]">
                  {" "}ت
                </strong>
                {" "}لیکل کېږي.
              </p>
            </div>

            {/* Stats */}

            <div
              dir="ltr"
              className="
                grid
                grid-cols-2
                sm:grid-cols-5
                gap-2
                mb-5
              "
            >
              <Stat
                label="WPM"
                value={stats.wpm}
              />

              <Stat
                label="Accuracy"
                value={`${stats.accuracy}%`}
              />

              <Stat
                label="Time"
                value={stats.time}
              />

              <Stat
                label="Progress"
                value={`${stats.progress}/${stats.total}`}
              />

              <Stat
                label="Mistakes"
                value={stats.mistakes}
              />
            </div>

            {/* Progress */}

            <div className="mb-5">

              <div
                className="
                  flex
                  justify-between
                  text-xs
                  text-gray-500
                  mb-2
                "
              >
                <span>
                  پرمختګ
                </span>

                <span dir="ltr">
                  {Math.round(
                    (stats.progress /
                      stats.total) *
                      100
                  ) || 0}
                  %
                </span>
              </div>

              <div
                className="
                  h-2
                  bg-gray-100
                  rounded-full
                  overflow-hidden
                "
              >
                <div
                  className="
                    h-full
                    bg-[#C9A15E]
                    rounded-full
                    transition-all
                    duration-300
                  "
                  style={{
                    width: `${
                      Math.min(
                        100,
                        (stats.progress /
                          stats.total) *
                          100
                      )
                    }%`,
                  }}
                />
              </div>

            </div>

            {/* Status */}

            <div
              className="
                flex
                items-center
                justify-center
                gap-2
                px-4
                py-3
                rounded-xl
                bg-green-50
                border
                border-green-200
                text-green-700
                text-sm
                mb-5
              "
            >
              {active
                ? "🟢 ټایپنګ روان دی..."
                : isFinished
                ? "🎉 تمرین بشپړ شو!"
                : "⌨️ د پیل لپاره چمتو"}
            </div>

            {/* Typing Text */}

            <div
              onClick={() =>
                active &&
                inputRef.current?.focus()
              }
              dir="rtl"
              className="
                min-h-[190px]
                sm:min-h-[230px]
                flex
                items-center
                justify-center
                flex-wrap
                content-center
                text-center
                px-5
                sm:px-10
                py-10
                rounded-2xl
                border-2
                border-gray-200
                bg-gray-50
                font-sans
                text-3xl
                sm:text-4xl
                font-bold
                leading-[2]
                cursor-text
                select-none
              "
            >
              {renderText()}
            </div>

            {/* Status Message */}

            <div
              className="
                min-h-[35px]
                flex
                items-center
                justify-center
                text-sm
                text-orange-600
                text-center
                mt-2
              "
            >
              {status}
            </div>

            {/* Buttons */}

            <div
              className="
                flex
                flex-col
                sm:flex-row
                gap-3
                mt-2
              "
            >
              <button
                type="button"
                onClick={
                  active
                    ? () =>
                        inputRef.current?.focus()
                    : startTest
                }
                className="
                  flex-1
                  px-6
                  py-3.5
                  rounded-xl
                  bg-[#1B2430]
                  hover:bg-[#273444]
                  text-white
                  font-bold
                  shadow-md
                  transition
                  active:scale-[0.98]
                "
              >
                {active
                  ? "⏳ ټایپنګ روان دی..."
                  : isFinished
                  ? "▶ بیا هڅه وکړئ"
                  : "▶ ټایپنګ پیل کړئ"}
              </button>

              <button
                type="button"
                onClick={restartTest}
                className="
                  px-6
                  py-3.5
                  rounded-xl
                  bg-white
                  border-2
                  border-gray-200
                  hover:bg-gray-50
                  text-[#1B2430]
                  font-bold
                  transition
                  active:scale-[0.98]
                "
              >
                ↻ بیا پیل
              </button>
            </div>

            {/* Result */}

            {showResult && (
              <div
                className="
                  mt-7
                  bg-gradient-to-br
                  from-green-50
                  to-white
                  border
                  border-green-200
                  rounded-2xl
                  p-6
                  text-center
                "
              >

                <div className="text-5xl mb-3">
                  {result.emoji}
                </div>

                <h2
                  className="
                    text-2xl
                    font-bold
                    text-[#1B2430]
                    mb-2
                  "
                >
                  {result.title}
                </h2>

                <p
                  className="
                    text-gray-600
                    text-sm
                    mb-6
                  "
                >
                  {result.message}
                </p>

                <div
                  dir="ltr"
                  className="
                    grid
                    grid-cols-2
                    sm:grid-cols-4
                    gap-3
                  "
                >
                  <ResultStat
                    label="WPM"
                    value={stats.wpm}
                  />

                  <ResultStat
                    label="Accuracy"
                    value={`${stats.accuracy}%`}
                  />

                  <ResultStat
                    label="Time"
                    value={stats.time}
                  />

                  <ResultStat
                    label="Mistakes"
                    value={
                      stats.mistakes
                    }
                  />
                </div>

              </div>
            )}

            {/* Keyboard Information */}

            <div
              className="
                mt-7
                pt-6
                border-t
                border-gray-100
              "
            >

              <h3
                className="
                  text-center
                  font-bold
                  text-[#1B2430]
                  mb-4
                "
              >
                د کیبورډ تمرین
              </h3>

              <div
                dir="ltr"
                className="
                  flex
                  items-center
                  justify-center
                  gap-4
                "
              >

                <div
                  className="
                    text-center
                  "
                >
                  <div
                    className="
                      w-16
                      h-16
                      rounded-xl
                      bg-gray-100
                      border-2
                      border-gray-300
                      flex
                      items-center
                      justify-center
                      text-2xl
                      font-bold
                    "
                  >
                    F
                  </div>

                  <div
                    dir="rtl"
                    className="
                      mt-2
                      text-xl
                      font-bold
                      text-[#C9A15E]
                    "
                  >
                    ب
                  </div>
                </div>

                <div
                  className="
                    text-gray-400
                    text-2xl
                  "
                >
                  →
                </div>

                <div
                  className="
                    text-center
                  "
                >
                  <div
                    className="
                      w-16
                      h-16
                      rounded-xl
                      bg-gray-100
                      border-2
                      border-gray-300
                      flex
                      items-center
                      justify-center
                      text-2xl
                      font-bold
                    "
                  >
                    J
                  </div>

                  <div
                    dir="rtl"
                    className="
                      mt-2
                      text-xl
                      font-bold
                      text-[#C9A15E]
                    "
                  >
                    ت
                  </div>
                </div>

              </div>

            </div>

            {/* Keyboard Shortcuts */}

            <div
              className="
                flex
                flex-wrap
                justify-center
                gap-3
                mt-6
                text-xs
                text-gray-500
              "
            >

              <span>
                <kbd
                  className="
                    px-2
                    py-1
                    rounded
                    bg-gray-100
                    border
                    border-gray-200
                    font-mono
                  "
                >
                  Space
                </kbd>
                {" "}
                د پیل لپاره
              </span>

              <span>
                <kbd
                  className="
                    px-2
                    py-1
                    rounded
                    bg-gray-100
                    border
                    border-gray-200
                    font-mono
                  "
                >
                  Backspace
                </kbd>
                {" "}
                د بېرته تګ لپاره
              </span>

              <span>
                <kbd
                  className="
                    px-2
                    py-1
                    rounded
                    bg-gray-100
                    border
                    border-gray-200
                    font-mono
                  "
                >
                  Ctrl
                </kbd>
                {" + "}
                <kbd
                  className="
                    px-2
                    py-1
                    rounded
                    bg-gray-100
                    border
                    border-gray-200
                    font-mono
                  "
                >
                  Shift
                </kbd>
                {" + "}
                <kbd
                  className="
                    px-2
                    py-1
                    rounded
                    bg-gray-100
                    border
                    border-gray-200
                    font-mono
                  "
                >
                  R
                </kbd>
              </span>

            </div>

            {/* Mobile Keyboard */}

            <div
              className="
                grid
                grid-cols-3
                gap-3
                mt-7
                sm:hidden
              "
              dir="ltr"
            >

              {/* ب */}

              <button
                type="button"
                onClick={() =>
                  pressPashtoKey("ب")
                }
                className="
                  h-16
                  rounded-xl
                  bg-white
                  border-2
                  border-gray-200
                  text-3xl
                  font-bold
                  text-[#1B2430]
                  hover:border-[#C9A15E]
                  active:scale-95
                  transition
                "
              >
                ب
              </button>

              {/* ت */}

              <button
                type="button"
                onClick={() =>
                  pressPashtoKey("ت")
                }
                className="
                  h-16
                  rounded-xl
                  bg-white
                  border-2
                  border-gray-200
                  text-3xl
                  font-bold
                  text-[#1B2430]
                  hover:border-[#C9A15E]
                  active:scale-95
                  transition
                "
              >
                ت
              </button>

              {/* Backspace */}

              <button
                type="button"
                onClick={
                  mobileBackspace
                }
                className="
                  h-16
                  rounded-xl
                  bg-gray-100
                  border-2
                  border-gray-200
                  text-2xl
                  font-bold
                  text-[#1B2430]
                  active:scale-95
                  transition
                "
              >
                ⌫
              </button>

            </div>

            {/* Hidden Input */}

            <input
              ref={inputRef}
              type="text"
              className="
                fixed
                left-[-9999px]
                top-0
                w-px
                h-px
                opacity-0
              "
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

// =========================================================
// STAT COMPONENT
// =========================================================

const Stat = ({
  label,
  value,
}) => {
  return (
    <div
      className="
        bg-[#FBF6E3]
        border
        border-[#E6DCA9]
        rounded-xl
        px-3
        py-3
        text-center
      "
    >
      <div
        className="
          text-[10px]
          sm:text-xs
          text-gray-500
          mb-1
        "
      >
        {label}
      </div>

      <div
        className="
          text-sm
          sm:text-base
          font-bold
          text-[#1B2430]
        "
      >
        {value}
      </div>
    </div>
  );
};

// =========================================================
// RESULT STAT
// =========================================================

const ResultStat = ({
  label,
  value,
}) => {
  return (
    <div
      className="
        bg-white
        border
        border-gray-200
        rounded-xl
        p-3
      "
    >
      <div
        className="
          text-xs
          text-gray-500
          mb-1
        "
      >
        {label}
      </div>

      <div
        className="
          text-lg
          font-bold
          text-[#1B2430]
        "
      >
        {value}
      </div>
    </div>
  );
};

export default TypingTestFirstStep;