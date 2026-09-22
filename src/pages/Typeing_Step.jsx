import React, { useEffect, useRef, useState } from "react";

/* =========================================================
   API
========================================================= */

const API_BASE_URL = "https://the-typetone-api.onrender.com";

/* =========================================================
   PASHTO KEYBOARD
========================================================= */

const keyboardLayout = [
  {
    id: "numbers",
    keys: [
      { en: "`", ps: "`", da: "`" },
      { en: "1", ps: "۱", da: "۱" },
      { en: "2", ps: "۲", da: "۲" },
      { en: "3", ps: "۳", da: "۳" },
      { en: "4", ps: "۴", da: "۴" },
      { en: "5", ps: "۵", da: "۵" },
      { en: "6", ps: "۶", da: "۶" },
      { en: "7", ps: "۷", da: "۷" },
      { en: "8", ps: "۸", da: "۸" },
      { en: "9", ps: "۹", da: "۹" },
      { en: "0", ps: "۰", da: "۰" },
      { en: "-", ps: "-", da: "-" },
      { en: "=", ps: "=", da: "=" },
    ],
  },

  {
    id: "top",
    keys: [
      { en: "Q", ps: "ض", da: "ض" },
      { en: "W", ps: "ص", da: "ص" },
      { en: "E", ps: "ث", da: "ث" },
      { en: "R", ps: "ق", da: "ق" },
      { en: "T", ps: "ف", da: "ف" },
      { en: "Y", ps: "غ", da: "غ" },
      { en: "U", ps: "ع", da: "ع" },
      { en: "I", ps: "ه", da: "ه" },
      { en: "O", ps: "خ", da: "خ" },
      { en: "P", ps: "ح", da: "ح" },
      { en: "[", ps: "ج", da: "ج" },
      { en: "]", ps: "چ", da: "چ" },
      { en: "\\", ps: "\\", da: "\\" },
    ],
  },

  {
    id: "middle",
    keys: [
      { en: "A", ps: "ا", da: "ا" },
      { en: "S", ps: "س", da: "س" },
      { en: "D", ps: "د", da: "د" },
      { en: "F", ps: "ر", da: "ر" },
      { en: "G", ps: "ت", da: "ت" },
      { en: "H", ps: "ې", da: "ی" },
      { en: "J", ps: "ی", da: "ج" },
      { en: "K", ps: "ک", da: "ک" },
      { en: "L", ps: "ل", da: "ل" },
      { en: ";", ps: "؛", da: "؛" },
      { en: "'", ps: "'", da: "'" },
    ],
  },

  {
    id: "bottom",
    keys: [
      { en: "Z", ps: "ظ", da: "ظ" },
      { en: "X", ps: "ط", da: "ط" },
      { en: "C", ps: "ز", da: "ز" },
      { en: "V", ps: "ژ", da: "ژ" },
      { en: "B", ps: "ب", da: "ب" },
      { en: "N", ps: "ن", da: "ن" },
      { en: "M", ps: "م", da: "م" },
      { en: ",", ps: "،", da: "،" },
      { en: ".", ps: ".", da: "." },
      { en: "/", ps: "/", da: "/" },
    ],
  },
];

/* =========================================================
   COMPONENT
========================================================= */

export default function Typeing_Step() {
  /* =======================================================
     LESSON
  ======================================================= */

  const [lesson, setLesson] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  /* =======================================================
     TYPING
  ======================================================= */

  const [typedText, setTypedText] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  const [correctCharacters, setCorrectCharacters] = useState(0);

  const [isFinished, setIsFinished] = useState(false);
  const [isPaused, setIsPaused] = useState(true);

  /* =======================================================
     UI
  ======================================================= */

  const [isMuted, setIsMuted] = useState(false);

  const [isKeyboardVisible, setIsKeyboardVisible] = useState(true);

  const [activeKey, setActiveKey] = useState(null);

  const [showMenu, setShowMenu] = useState(false);

  /* =======================================================
     REFS
  ======================================================= */

  const typingAreaRef = useRef(null);

  const keyboardTimer = useRef(null);

  const audioContextRef = useRef(null);

  /* 👇 NEW: text container ref for auto-scroll */
  const textContainerRef = useRef(null);

  /* =======================================================
     AUDIO
  ======================================================= */

  const initAudio = () => {
    if (!audioContextRef.current) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;

      if (AudioContext) {
        audioContextRef.current = new AudioContext();
      }
    }

    if (
      audioContextRef.current &&
      audioContextRef.current.state === "suspended"
    ) {
      audioContextRef.current.resume();
    }
  };

  /* =======================================================
     CORRECT SOUND
  ======================================================= */

  const playCorrectSound = () => {
    if (isMuted) return;

    initAudio();

    const ctx = audioContextRef.current;

    if (!ctx) return;

    const now = ctx.currentTime;

    const oscillator = ctx.createOscillator();

    const gain = ctx.createGain();

    oscillator.type = "sine";

    oscillator.frequency.setValueAtTime(900, now);

    oscillator.frequency.exponentialRampToValueAtTime(550, now + 0.06);

    gain.gain.setValueAtTime(0.09, now);

    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    oscillator.connect(gain);

    gain.connect(ctx.destination);

    oscillator.start(now);

    oscillator.stop(now + 0.06);
  };

  /* =======================================================
     INCORRECT SOUND
  ======================================================= */

  const playIncorrectSound = () => {
    if (isMuted) return;

    initAudio();

    const ctx = audioContextRef.current;

    if (!ctx) return;

    const now = ctx.currentTime;

    const master = ctx.createGain();

    master.gain.setValueAtTime(0.14, now);

    master.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    master.connect(ctx.destination);

    const osc1 = ctx.createOscillator();

    const osc2 = ctx.createOscillator();

    osc1.type = "sawtooth";
    osc2.type = "sawtooth";

    osc1.frequency.setValueAtTime(220, now);

    osc2.frequency.setValueAtTime(227, now);

    osc1.frequency.exponentialRampToValueAtTime(110, now + 0.15);

    osc2.frequency.exponentialRampToValueAtTime(113, now + 0.15);

    const oscGain = ctx.createGain();

    oscGain.gain.setValueAtTime(0.35, now);

    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

    osc1.connect(oscGain);
    osc2.connect(oscGain);

    oscGain.connect(master);

    osc1.start(now);
    osc2.start(now);

    osc1.stop(now + 0.18);
    osc2.stop(now + 0.18);
  };

  /* =======================================================
     BACKSPACE SOUND
  ======================================================= */

  const playBackspaceSound = () => {
    if (isMuted) return;

    initAudio();

    const ctx = audioContextRef.current;

    if (!ctx) return;

    const now = ctx.currentTime;

    const oscillator = ctx.createOscillator();

    const gain = ctx.createGain();

    oscillator.type = "sine";

    oscillator.frequency.setValueAtTime(300, now);

    oscillator.frequency.exponentialRampToValueAtTime(500, now + 0.08);

    gain.gain.setValueAtTime(0.08, now);

    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    oscillator.connect(gain);

    gain.connect(ctx.destination);

    oscillator.start(now);

    oscillator.stop(now + 0.08);
  };

  /* =======================================================
     COMPLETE SOUND
  ======================================================= */

  const playCompleteSound = () => {
    if (isMuted) return;

    initAudio();

    const ctx = audioContextRef.current;

    if (!ctx) return;

    const notes = [523.25, 659.25, 784, 1046.5];

    notes.forEach((frequency, index) => {
      setTimeout(() => {
        const now = ctx.currentTime;

        const oscillator = ctx.createOscillator();

        const gain = ctx.createGain();

        oscillator.type = "triangle";

        oscillator.frequency.setValueAtTime(frequency, now);

        gain.gain.setValueAtTime(0.12, now);

        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        oscillator.connect(gain);

        gain.connect(ctx.destination);

        oscillator.start(now);

        oscillator.stop(now + 0.35);
      }, index * 100);
    });
  };

  /* =======================================================
     GET LESSON ID
  ======================================================= */

  const getLessonId = () => {
    try {
      const params = new URLSearchParams(window.location.search);

      const urlLesson = params.get("lesson");

      if (urlLesson) {
        return String(urlLesson);
      }

      const saved = localStorage.getItem("selectedLessonId");

      return saved ? String(saved) : null;
    } catch {
      return null;
    }
  };

  /* =======================================================
     FETCH LESSON
  ======================================================= */

  const fetchLesson = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/lessons`);

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();

      const lessons = Array.isArray(data)
        ? data
        : Array.isArray(data.lessons)
          ? data.lessons
          : [];

      if (!lessons.length) {
        throw new Error("درسونه پیدا نه شول.");
      }

      const lessonId = getLessonId();

      let selectedLesson = null;

      if (lessonId) {
        selectedLesson = lessons.find(
          (item) => String(item.id) === String(lessonId),
        );
      }

      if (!selectedLesson) {
        selectedLesson = lessons[0];
      }

      localStorage.setItem("selectedLessonId", String(selectedLesson.id));

      setLesson(selectedLesson);

      setTypedText("");
      setStartTime(null);
      setElapsedTime(0);
      setCorrectCharacters(0);

      setIsFinished(false);
      setIsPaused(true);
      setActiveKey(null);

      /* 👇 NEW: reset text scroll */
      if (textContainerRef.current) {
        textContainerRef.current.scrollTop = 0;
      }
    } catch (err) {
      console.error(err);

      setError(err.message || "د درس په ترلاسه کولو کې ستونزه رامنځته شوه.");
    } finally {
      setIsLoading(false);
    }
  };

  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  useEffect(() => {
    fetchLesson();

    return () => {
      if (keyboardTimer.current) {
        clearTimeout(keyboardTimer.current);
      }
    };
  }, []);

  /* =======================================================
     TIMER
  ======================================================= */

  useEffect(() => {
    if (!startTime || isFinished || isPaused) {
      return;
    }

    const timer = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime, isFinished, isPaused]);

  /* =======================================================
     LESSON DATA
  ======================================================= */

  const targetText = lesson?.text || "";

  const totalCharacters = targetText.length;

  const currentCharacter = targetText[typedText.length] || "";

  /* =======================================================
     PROGRESS
  ======================================================= */

  const progress =
    totalCharacters > 0
      ? Math.min(100, Math.round((typedText.length / totalCharacters) * 100))
      : 0;

  /* =======================================================
     ACCURACY
  ======================================================= */

  const accuracy =
    typedText.length > 0
      ? Math.round((correctCharacters / typedText.length) * 100)
      : 100;

  /* =======================================================
     WPM
  ======================================================= */

  const words =
    typedText.trim().length > 0
      ? typedText.trim().split(/\s+/).filter(Boolean).length
      : 0;

  const minutes = elapsedTime / 60;

  const wpm = minutes > 0 ? Math.round(words / minutes) : 0;

  /* =======================================================
     TIME FORMAT
  ======================================================= */

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);

    const secs = seconds % 60;

    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  /* =======================================================
     ACTIVE KEY
  ======================================================= */

  const isKeyActive = (key) => {
    if (!currentCharacter) {
      return false;
    }

    if (currentCharacter === " ") {
      return false;
    }

    return [key.en, key.en.toLowerCase(), key.ps, key.da].includes(
      currentCharacter,
    );
  };

  const isSpaceActive = currentCharacter === " ";

  /* =======================================================
     KEY ANIMATION
  ======================================================= */

  const animateKey = (char) => {
    setActiveKey(char);

    if (keyboardTimer.current) {
      clearTimeout(keyboardTimer.current);
    }

    keyboardTimer.current = setTimeout(() => {
      setActiveKey(null);
    }, 180);
  };

  /* =======================================================
     AUTO SCROLL TEXT  (pin current line to top)
  ======================================================= */

  useEffect(() => {
    const container = textContainerRef.current;

    if (!container) return;

    /* Nothing typed yet -> back to the very top */
    if (!typedText.length) {
      container.scrollTo({ top: 0, behavior: "auto" });
      return;
    }

    /* The character the user is about to type */
    const activeChar =
      container.querySelector(`[data-char-index="${typedText.length}"]`) ||
      container.querySelector(`[data-char-index="${typedText.length - 1}"]`);

    if (!activeChar) return;

    const containerRect = container.getBoundingClientRect();
    const charRect = activeChar.getBoundingClientRect();

    const computed = window.getComputedStyle(container);

    const lineHeight =
      parseFloat(computed.lineHeight) || charRect.height || 1;

    /* Distance of the active character from the top of the CONTENT */
    const offsetInContent =
      charRect.top - containerRect.top + container.scrollTop;

    /* Which line is it on? */
    const lineIndex = Math.max(0, Math.round(offsetInContent / lineHeight));

    const targetScroll = lineIndex * lineHeight;

    if (Math.abs(container.scrollTop - targetScroll) > 1) {
      container.scrollTo({ top: targetScroll, behavior: "smooth" });
    }
  }, [typedText, targetText]);

  /* =======================================================
     HANDLE KEYBOARD
  ======================================================= */

  const handleKeyDown = (event) => {
    if (!lesson) {
      return;
    }

    // Press Enter on the completion screen = Next Lesson
    if (event.key === "Enter" && isFinished) {
      event.preventDefault();
      nextLesson();
      return;
    }

    // Don't type after the lesson is finished
    if (isFinished) {
      return;
    }

    if (
      event.key === "Shift" ||
      event.key === "Control" ||
      event.key === "Alt" ||
      event.key === "Meta" ||
      event.key === "CapsLock" ||
      event.key === "Tab" ||
      event.key === "Escape"
    ) {
      return;
    }

    event.preventDefault();

    initAudio();

    /* =====================================
       BACKSPACE
    ===================================== */

    if (event.key === "Backspace") {
      if (typedText.length > 0) {
        playBackspaceSound();

        setTypedText((prev) => prev.slice(0, -1));
      }

      return;
    }

    /* =====================================
       ONLY CHARACTERS
    ===================================== */

    if (event.key.length !== 1) {
      return;
    }

    const newChar = event.key;

    const currentIndex = typedText.length;

    const expected = targetText[currentIndex];

    /* =====================================
       START TIMER
    ===================================== */

    if (isPaused) {
      setIsPaused(false);

      if (!startTime) {
        setStartTime(Date.now());
      }
    }

    /* =====================================
       KEY ANIMATION
    ===================================== */

    animateKey(newChar);

    /* =====================================
       CORRECT / WRONG SOUND
    ===================================== */

    if (newChar === expected) {
      playCorrectSound();
    } else {
      playIncorrectSound();
    }

    /* =====================================
       NEW TEXT
    ===================================== */

    const newTypedText = typedText + newChar;

    /* =====================================
       CORRECT CHARACTERS
    ===================================== */

    let newCorrectCount = 0;

    for (let i = 0; i < newTypedText.length; i++) {
      if (newTypedText[i] === targetText[i]) {
        newCorrectCount++;
      }
    }

    setCorrectCharacters(newCorrectCount);

    setTypedText(newTypedText);

    /* =====================================
       FINISHED
    ===================================== */

    if (newTypedText.length >= targetText.length && targetText.length > 0) {
      const finishTime = Date.now();

      const finalStartTime = startTime || finishTime;

      const finalElapsedTime = Math.max(
        0,
        Math.floor((finishTime - finalStartTime) / 1000),
      );

      const finalAccuracy =
        targetText.length > 0
          ? Math.round((newCorrectCount / targetText.length) * 100)
          : 100;

      const finalWords = newTypedText
        .trim()
        .split(/\s+/)
        .filter(Boolean).length;

      const finalMinutes = finalElapsedTime / 60;

      const finalWpm =
        finalMinutes > 0 ? Math.round(finalWords / finalMinutes) : 0;

      /* Update state */

      setElapsedTime(finalElapsedTime);

      setCorrectCharacters(newCorrectCount);

      setIsPaused(true);

      setIsFinished(true);

      playCompleteSound();

      /* ===================================
         SAVE COMPLETED LESSON
      =================================== */

      const lessonId = String(lesson.id);

      try {
        let completedLessons = [];

        try {
          completedLessons = JSON.parse(
            localStorage.getItem("completedLessons") || "[]",
          );
        } catch {
          completedLessons = [];
        }

        if (!Array.isArray(completedLessons)) {
          completedLessons = [];
        }

        if (!completedLessons.includes(lessonId)) {
          completedLessons.push(lessonId);
        }

        localStorage.setItem(
          "completedLessons",
          JSON.stringify(completedLessons),
        );

        let lessonResults = {};

        try {
          lessonResults = JSON.parse(
            localStorage.getItem("lessonResults") || "{}",
          );
        } catch {
          lessonResults = {};
        }

        const finalResult = {
          lessonId: lesson.id,

          title: lesson.title || "",

          level: lesson.level || "",

          text: lesson.text || "",

          completed: true,

          progress: 100,

          typedCharacters: newTypedText.length,

          totalCharacters: targetText.length,

          correctCharacters: newCorrectCount,

          accuracy: finalAccuracy,

          wpm: finalWpm,

          elapsedTime: finalElapsedTime,

          score: 10,

          completedAt: new Date().toISOString(),
        };

        lessonResults[lessonId] = finalResult;

        localStorage.setItem("lessonResults", JSON.stringify(lessonResults));

        localStorage.setItem(
          "lastCompletedLesson",
          JSON.stringify(finalResult),
        );
      } catch (saveError) {
        console.error("Could not save lesson:", saveError);
      }
    }
  };

  /* =======================================================
     GLOBAL KEYBOARD EVENT
  ======================================================= */

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [lesson, isFinished, isPaused, typedText, targetText, startTime, isMuted]);

  /* =======================================================
     RESTART
  ======================================================= */

  const restartLesson = () => {
    setTypedText("");
    setStartTime(null);
    setElapsedTime(0);
    setCorrectCharacters(0);

    setIsFinished(false);
    setIsPaused(true);

    setActiveKey(null);

    /* 👇 NEW: jump the text back to line 1 */
    if (textContainerRef.current) {
      textContainerRef.current.scrollTop = 0;
    }

    setTimeout(() => {
      typingAreaRef.current?.focus();
    }, 100);
  };

  /* =======================================================
     GO BACK
  ======================================================= */

  const goBack = () => {
    window.location.href = "/dashboard/steps-pashto";
  };

  /* =======================================================
     NEXT LESSON
  ======================================================= */

  const nextLesson = async () => {
    if (!lesson) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/lessons`);

      if (!response.ok) {
        throw new Error("Could not load lessons");
      }

      const data = await response.json();

      const lessons = Array.isArray(data)
        ? data
        : Array.isArray(data.lessons)
          ? data.lessons
          : [];

      const index = lessons.findIndex(
        (item) => String(item.id) === String(lesson.id),
      );

      if (index >= 0 && index < lessons.length - 1) {
        const next = lessons[index + 1];

        localStorage.setItem("selectedLessonId", String(next.id));

        window.location.href = `/Typeing_Step?lesson=${next.id}`;
      } else {
        goBack();
      }
    } catch (err) {
      console.error(err);

      goBack();
    }
  };

  /* =======================================================
     LOADING PAGE
  ======================================================= */

  if (isLoading) {
    return (
      <div
        className="
          min-h-screen
          bg-[#fdf4c7]
          flex
          items-center
          justify-center
        "
      >
        <div className="text-center">
          <div
            className="
              w-14
              h-14
              border-4
              border-pink-300
              border-t-pink-600
              rounded-full
              animate-spin
              mx-auto
            "
          />

          <p
            dir="rtl"
            className="
              mt-5
              text-gray-600
              font-bold
            "
          >
            درس بارول کېږي...
          </p>
        </div>
      </div>
    );
  }

  /* =======================================================
     ERROR PAGE
  ======================================================= */

  if (error) {
    return (
      <div
        className="
          min-h-screen
          bg-[#fdf4c7]
          flex
          items-center
          justify-center
          p-5
        "
      >
        <div
          className="
            bg-white
            rounded-2xl
            shadow-xl
            p-8
            text-center
            max-w-md
            w-full
          "
        >
          <div className="text-5xl mb-5">⚠️</div>

          <h2
            dir="rtl"
            className="
              text-2xl
              font-bold
              text-red-500
            "
          >
            ستونزه رامنځته شوه
          </h2>

          <p className="text-gray-500 mt-3">{error}</p>

          <div className="flex gap-3 justify-center mt-6">
            <button
              onClick={fetchLesson}
              className="
                px-5
                py-3
                bg-pink-500
                text-white
                rounded-xl
                font-bold
              "
            >
              بیا هڅه
            </button>

            <button
              onClick={goBack}
              className="
                px-5
                py-3
                bg-gray-100
                text-gray-600
                rounded-xl
                font-bold
              "
            >
              بېرته
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* =======================================================
     COMPLETION PAGE
  ======================================================= */

  if (isFinished) {
    const scoreOutOfTen = Math.max(
      0,
      Math.min(10, Math.round((accuracy / 100) * 10)),
    );

    const requiredAccuracy = 80;
    const passed = accuracy >= requiredAccuracy;

    const r = 45;
    const circ = 2 * Math.PI * r;

    return (
      <div
        dir="rtl"
        className="relative flex h-screen w-full flex-col overflow-hidden bg-[#3B5B88] font-sans"
      >
        {/* ================= TOP BAR ================= */}
        <div className="z-10 flex items-center justify-between px-6 py-5 text-white/90">
          <div className="flex items-center gap-4">
            <button
              onClick={goBack}
              className="rounded-lg p-1 transition hover:bg-white/10 active:scale-95"
              aria-label="بېرته"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <span className="text-sm font-bold tracking-wide">
              درس {lesson?.id}: {lesson?.title || "پښتو ټایپینګ"}
            </span>
          </div>
        </div>

        {/* ================= MAIN CONTENT ================= */}
        <div className="z-10 flex flex-1 flex-col items-center justify-center pb-56">
          {/* STARS */}
          <div className="flex gap-2.5">
            {[...Array(5)].map((_, i) => {
              const filled = i < Math.round(scoreOutOfTen / 2);
              return (
                <svg
                  key={i}
                  className={`h-14 w-14 sm:h-16 sm:w-16 ${
                    filled ? "text-yellow-400" : "text-[#4a6fa5]"
                  }`}
                  fill={filled ? "currentColor" : "none"}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                  />
                </svg>
              );
            })}
          </div>

          {/* SCORE */}
          <div className="mt-5 flex flex-col items-center">
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#a3c2f0]">
              ستاسو نمره
            </span>
            <span className="mt-1 text-6xl font-black text-white">
              {scoreOutOfTen}
            </span>
          </div>

          {/* GAUGES */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-14 sm:gap-20">
            {/* ── ACCURACY ── */}
            <div className="relative flex flex-col items-center">
              <div className="relative h-36 w-36">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r={r}
                    stroke="#2d4b73"
                    strokeWidth="7"
                    fill="none"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r={r}
                    stroke={passed ? "#4ade80" : "#f87171"}
                    strokeWidth="7"
                    fill="none"
                    strokeDasharray={circ}
                    strokeDashoffset={circ * (1 - accuracy / 100)}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-white">
                    {accuracy}%
                  </span>
                  <span className="mt-0.5 text-[9px] font-bold uppercase tracking-wider text-[#a3c2f0]">
                    ریښتینې دقت
                  </span>
                </div>
              </div>
              <div className="absolute top-1/2 -left-8 -translate-y-1/2 text-[10px] font-bold text-[#a3c2f0]">
                {requiredAccuracy}%
              </div>
              <span className="mt-3 text-[11px] font-black uppercase tracking-[0.15em] text-[#a3c2f0]">
                دقت
              </span>
            </div>

            {/* ── DURATION ── */}
            <div className="relative flex flex-col items-center">
              <div className="relative h-36 w-36">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r={r}
                    stroke="#a3c2f0"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="5 5"
                    opacity={0.4}
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    stroke="#2d4b73"
                    strokeWidth="4"
                    fill="none"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-white">
                    {formatTime(elapsedTime)}
                  </span>
                  <span className="mt-0.5 text-[9px] font-bold uppercase tracking-wider text-[#a3c2f0]">
                    دقیقه ثانیه
                  </span>
                </div>
              </div>
              <span className="mt-3 text-[11px] font-black uppercase tracking-[0.15em] text-[#a3c2f0]">
                موده
              </span>
            </div>

            {/* ── SPEED ── */}
            <div className="relative flex flex-col items-center">
              <div className="relative h-36 w-36">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r={r}
                    stroke="#2d4b73"
                    strokeWidth="7"
                    fill="none"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r={r}
                    stroke="#facc15"
                    strokeWidth="7"
                    fill="none"
                    strokeDasharray={circ}
                    strokeDashoffset={circ * (1 - Math.min(100, wpm) / 100)}
                    strokeLinecap="round"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="52"
                    stroke="#a3c2f0"
                    strokeWidth="1"
                    fill="none"
                    strokeDasharray="3 4"
                    opacity={0.5}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-white">{wpm}</span>
                  <span className="mt-0.5 text-[9px] font-bold uppercase tracking-wider text-[#a3c2f0]">
                    WPM
                  </span>
                </div>
              </div>
              <div className="absolute top-1/2 -right-14 -translate-y-1/2 flex flex-col gap-0.5 text-[9px] font-bold leading-tight">
                <span className="text-[#a3c2f0]">{wpm} wpm</span>
                <span className="text-white/50">اړتیا ۱۰ wpm</span>
              </div>
              <span className="mt-3 text-[11px] font-black uppercase tracking-[0.15em] text-[#a3c2f0]">
                سرعت
              </span>
            </div>
          </div>
        </div>

        {/* ================= BOTTOM CARD ================= */}
        <div className="absolute bottom-0 left-1/2 z-20 w-full max-w-6xl -translate-x-1/2">
          <div className="flex flex-col overflow-hidden rounded-t-[2rem] bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.18)]">
            {/* SAVE BANNER */}
            <div className="flex items-center justify-center gap-2 border-b border-[#FDE047]/40 bg-[#FEF9C3] px-6 py-2.5 text-sm text-[#854D0E]">
              <span className="font-bold text-[#166534]">✓</span>
              <span className="font-semibold">
                ستا پایله په اوتومات ډول خوندي شوه.
              </span>
            </div>

            {/* ACTION BAR */}
            <div className="flex flex-wrap items-center justify-center gap-3 p-5 sm:gap-4 sm:p-6">
              {/* All Lessons */}
              <button
                onClick={goBack}
                className="group flex items-center justify-center gap-2.5 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-black text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800 hover:shadow-md active:scale-95"
              >
                <svg
                  className="h-4 w-4 transition-transform group-hover:scale-110"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2.2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
                ټول درسونه
              </button>

              {/* Try Again */}
              <button
                onClick={restartLesson}
                className="group flex items-center justify-center gap-2.5 rounded-full bg-emerald-500 px-6 py-3 text-sm font-black text-white shadow-md shadow-emerald-300/40 transition hover:-translate-y-0.5 hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-400/50 active:scale-95"
              >
                <svg
                  className="h-4 w-4 transition-transform duration-500 group-hover:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2.4}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                  <path d="M21 3v5h-5" />
                  <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                  <path d="M3 21v-5h5" />
                </svg>
                بیا هڅه وکړه
              </button>

              {/* Next Lesson */}
              <button
                onClick={nextLesson}
                className="group flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 text-sm font-black text-white shadow-md shadow-indigo-300/40 transition hover:-translate-y-0.5 hover:from-violet-700 hover:to-indigo-700 hover:shadow-lg hover:shadow-indigo-400/50 active:scale-95"
              >
                بل درس
                <svg
                  className="h-4 w-4 transition-transform group-hover:-translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2.4}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 12H5" />
                  <path d="m12 19-7-7 7-7" />
                </svg>
              </button>
            </div>

            {/* FEEDBACK */}
            <p className="border-t border-gray-100 px-6 py-3 text-center text-xs font-medium text-gray-500">
              {passed ? (
                <>
                  ډېر ښه! تاسو لږ تر لږه {requiredAccuracy}٪ دقت ترلاسه کړ.
                  راتلونکي درس ته لاړ شئ.
                </>
              ) : (
                <>
                  دا درس لږ تر لږه {requiredAccuracy}٪ دقت لري. په راتلونکې هڅه
                  کې هڅه وکړه چې ۱۰۰٪ دقت ترلاسه کړې.
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* =======================================================
     MAIN TYPING PAGE
  ======================================================= */

  return (
    <div
      ref={typingAreaRef}
      tabIndex={0}
      className="
        relative
        h-screen
        overflow-hidden
        bg-[#fdf4c7]
        text-gray-700
        font-sans
        outline-none
      "
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <header
        className="
          absolute
          top-0
          left-0
          right-0
          h-[48px]
          bg-white/85
          backdrop-blur-md
          border-b
          border-black/5
          flex
          items-center
          justify-between
          px-5
          z-50
        "
      >
        {/* LEFT */}

        <div
          className="
            relative
            flex
            items-center
            gap-4
          "
        >
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="
              text-gray-500
              text-xl
              hover:text-gray-800
              transition
            "
          >
            ☰
          </button>

          <div
            className="
              hidden
              sm:block
              font-extrabold
              text-gray-600
              text-sm rtl:text-right
            "
          >
            Lesson {lesson?.id}: {lesson?.title || "Pashto Typing"}
          </div>

          {/* MENU */}

          {showMenu && (
            <div
              className="
                absolute
                top-9
                left-0
                bg-white
                rounded-xl
                shadow-xl
                border
                border-black/5
                py-2
                w-48
                z-[100]
              "
            >
              <button
                onClick={() => {
                  restartLesson();

                  setShowMenu(false);
                }}
                className="
                  w-full
                  text-left
                  px-4
                  py-2
                  hover:bg-[#fdf4c7]
                  text-sm
                  rtl:text-right

                  
                "
              >
                <img
                  className="inline"
                  width={20}
                  src="https://img.icons8.com/?size=100&id=bDkQlpOV2TWB&format=png&color=000000"
                  alt=""
                />{" "}
                له سره پیل کړه
              </button>

              <button
                onClick={() => {
                  setIsMuted(!isMuted);

                  setShowMenu(false);
                }}
                className="
                  w-full
                  text-left
                  px-4
                  py-2
                  hover:bg-[#fdf4c7]
                  text-sm
                  rtl:text-right
                "
              >
                {isMuted ? (
                  <>
                    <img
                      className="inline"
                      width={20}
                      src="https://img.icons8.com/?size=100&id=NbXdDWS68ggb&format=png&color=000000"
                      alt=""
                    />
                    غږ بند کړه
                  </>
                ) : (
                  <>
                    <img
                      className="inline "
                      width={20}
                      src="https://img.icons8.com/?size=100&id=FV0C4YFGl7TK&format=png&color=000000"
                      alt=""
                    />
                    غږ فعال کړه
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  setIsKeyboardVisible(!isKeyboardVisible);

                  setShowMenu(false);
                }}
                className="
                  w-full
                  text-left
                  px-4
                  py-2
                  hover:bg-[#fdf4c7]
                  text-sm
                  rtl:text-right
                "
              >
                <img
                  width={25}
                  className=" inline"
                  src="https://img.icons8.com/?size=100&id=mnLsovgnDgTt&format=png&color=000000"
                  alt=""
                />{" "}
                کیبورډ چالان/بند کړه
              </button>

              <button
                onClick={() => {
                  goBack();
                }}
                className="
                  w-full
                  text-left
                  px-4
                  py-2
                  hover:bg-[#fdf4c7]
                  text-sm
                  rtl:text-right
                "
              >
                <img
                  className="inline"
                  width={20}
                  src="https://img.icons8.com/?size=100&id=qa0dQBGXMZfO&format=png&color=000000"
                  alt=""
                />
                درسونه
              </button>
            </div>
          )}
        </div>

        {/* CENTER CONTROLS */}

        <div
          className="
            flex
            items-center
            gap-5
          "
        >
          <button
            onClick={() => {
              initAudio();

              if (isPaused) {
                setIsPaused(false);

                if (!startTime) {
                  setStartTime(Date.now());
                }
              } else {
                setIsPaused(true);
              }

              typingAreaRef.current?.focus();
            }}
            className="
              text-gray-500
              hover:text-gray-800
              text-lg
            "
          >
            {isPaused ? (
              <img
                width={23}
                src="https://img.icons8.com/?size=100&id=TB4ZgJum4Woc&format=png&color=000000"
                alt=""
              />
            ) : (
              <img
                width={23}
                src="https://img.icons8.com/?size=100&id=Z2aInWmsldJ6&format=png&color=000000"
                alt=""
              />
            )}
          </button>

          <button
            onClick={restartLesson}
            className="
              text-gray-500
              hover:text-gray-800
              text-xl
            "
          >
            <img
              width={23}
              src="https://img.icons8.com/?size=100&id=t7r2A42vsY6O&format=png&color=000000"
              alt=""
            />
          </button>

          <button
            onClick={() => setIsKeyboardVisible(!isKeyboardVisible)}
            className="
              text-gray-500
              hover:text-gray-800
              text-xl
            "
          >
            <img
              width={25}
              src="https://img.icons8.com/?size=100&id=58RG2mzbDIPX&format=png&color=000000"
              alt=""
            />
          </button>

          <button
            onClick={() => {
              initAudio();

              setIsMuted(!isMuted);
            }}
            className="
              text-gray-500
              hover:text-gray-800

            "
          >
            {isMuted ? (
              <img
                width={23}
                src="https://img.icons8.com/?size=100&id=ZaGj3ZYdtFZX&format=png&color=000000"
              ></img>
            ) : (
              <img
                width={23}
                src="https://img.icons8.com/?size=100&id=tAby2g2M-Yna&format=png&color=000000"
                alt=""
              />
            )}
          </button>
        </div>

        {/* USER */}

        <div
          className="
            font-bold
            text-gray-500
            text-sm
          "
        >
          Fazlahmad
        </div>
      </header>

      {/* =====================================================
          CLOUDS
      ===================================================== */}

      <div
        className="
          absolute
          top-[13%]
          left-[7%]
          w-32
          h-12
          bg-white/60
          rounded-full
        "
      />

      <div className="
          absolute
          top-[9%]
          left-[9%]
          w-16
          h-16
          bg-white/60
          rounded-full
        " />

      <div
        className="
          absolute
          top-[16%]
          left-[15%]
          w-12
          h-12
          bg-white/60
          rounded-full
        "
      />

      <div
        className="
          absolute
          top-[21%]
          right-[10%]
          w-44
          h-14
          bg-white/60
          rounded-full
        "
      />

      <div
        className="
          absolute
          top-[15%]
          right-[16%]
          w-20
          h-20
          bg-white/60
          rounded-full
        "
      />

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main
        className="
          relative
          z-20
          h-full
          flex
          items-center
          justify-center
          px-5
          pt-12
          pb-3
        "
      >
        <div
          className="
            w-full
            max-w-[1050px]
            flex
            flex-col
            items-center
          "
        >
          {/* START */}

          <button
            onClick={() => {
              initAudio();

              if (isPaused) {
                setIsPaused(false);

                if (!startTime) {
                  setStartTime(Date.now());
                }
              } else {
                setIsPaused(true);
              }

              typingAreaRef.current?.focus();
            }}
            dir="rtl"
            className="
             mr-[7%]
         mb-2
         bg-yellow-200
         border
         border-yellow-300
         px-5
         py-2
         rounded-lg
         text-gray-600
         font-bold
         text-sm
         shadow-sm
         hover:bg-yellow-300
         transition
         text-right
            "
          >
            {isPaused ? " Start Typing" : "⏸ Typing..."}
          </button>

          {/* =================================================
              TEXT  (auto-scroll, current line pinned to top)
          ================================================= */}

          <div
            dir="ltr"
            className="
              w-full
              min-h-[180px]
              px-[7%]
              flex
              items-center
              justify-center
              cursor-text
            "
            onClick={() => {
              typingAreaRef.current?.focus();
            }}
          >
            <div
              ref={textContainerRef}
              dir="rtl"
              className={`
                relative
                font-['Fredoka']
                text-[34px]
                sm:text-[43px]
                md:text-[52px]
                leading-[1.5]
                tracking-wide
                text-gray-700
                whitespace-normal
                p-4
                w-full
                max-w-[1050px]
                h-[320px]
                overflow-hidden
                text-right
                scroll-smooth
              `}
            >
              {(() => {
                const parts = targetText.split(/(\s+)/);
                let characterIndex = 0;

                return parts.map((part, partIndex) => {
                  // Keep spaces
                  if (/^\s+$/.test(part)) {
                    characterIndex += part.length;

                    return <span key={`space-${partIndex}`}>{part}</span>;
                  }

                  // Don't allow a word to split
                  const wordStart = characterIndex;

                  characterIndex += part.length;

                  return (
                    <span key={`word-${partIndex}`} className="whitespace-nowrap">
                     {part.split("").map((char, charIndex) => {
  const index = wordStart + charIndex;

  let color = "text-gray-400";
  let highlight = "";

  if (index < typedText.length) {
    /* Already typed */
    if (typedText[index] === targetText[index]) {
      color = "text-green-700";
    } else {
      color = "text-red-600";
    }
  } else if (index === typedText.length) {
    /* 👇 The NEXT character to type — highlight it */
highlight = "bg-amber-200/80 ring-2 ring-amber-500/70 rounded-md -mx-[0.5px] px-[0.5px]";  }

  return (
    <span
      key={`char-${partIndex}-${charIndex}`}
      data-char-index={index}
      className={`${color} ${highlight} transition-colors duration-100`}
    >
      {char}
    </span>
  );
})}
                    </span>
                  );
                });
              })()}
            </div>
          </div>

          {/* =================================================
              PROGRESS
          ================================================= */}

          <div
            className="
              w-[86%]
              flex
              items-center
              gap-3
              mb-2
            "
          >
            <div
              className="
                flex-1
                h-2
                bg-white/50
                rounded-full
                overflow-hidden
              "
            >
              <div
                className="
                  h-full
                  bg-pink-400
                  rounded-full
                  transition-all
                  duration-200
                "
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>

            <span
              className="
                text-xs
                font-bold
                text-gray-500
              "
            >
              {progress}%
            </span>

            <span
              className="
                text-xs
                font-bold
                text-gray-500
              "
            >
              {formatTime(elapsedTime)}
            </span>
          </div>

          {/* =================================================
              PASHTO KEYBOARD
          ================================================= */}

          {isKeyboardVisible && (
            <div
              className="
                w-[90%]
                max-w-[900px]
                bg-white/45
                border
                border-white/70
                rounded-xl
                px-4
                py-3
                shadow-lg
                backdrop-blur-sm
              "
            >
              {keyboardLayout.map((row) => (
                <div
                  key={row.id}
                  className="
                      flex
                      justify-center
                      gap-1
                      sm:gap-1.5
                      mb-1.5
                    "
                >
                  {row.keys.map((key) => {
                    const active = isKeyActive(key);

                    const pressed =
                      activeKey === key.en || activeKey === key.ps;

                    return (
                      <div
                        key={`${row.id}-${key.en}`}
                        className={`
                              flex
                              items-center
                              justify-center
                              w-[30px]
                              sm:w-[42px]
                              md:w-[50px]
                              h-[34px]
                              sm:h-[40px]
                              md:h-[44px]
                              rounded-md
                              border
                              font-bold
                              text-sm
                              sm:text-base
                              select-none
                              transition-all
                              duration-100

                              ${
                                active
                                  ? `
                                    bg-pink-500
                                    text-white
                                    border-pink-500
                                    -translate-y-1
                                    shadow-none
                                  `
                                  : `
                                    bg-white/90
                                    text-gray-500
                                    border-gray-300
                                    shadow-[0_3px_0_#bbb]
                                  `
                              }

                              ${pressed ? "scale-110" : ""}
                            `}
                      >
                        {key.ps}
                      </div>
                    );
                  })}
                </div>
              ))}

              {/* SPACE */}

              <div
                className="
                  flex
                  justify-center
                  mt-1
                "
              >
                <div
                  className={`
                    w-[45%]
                    h-[34px]
                    sm:h-[40px]
                    rounded-md
                    border
                    flex
                    items-center
                    justify-center
                    text-xs
                    font-bold
                    transition-all

                    ${
                      isSpaceActive
                        ? `
                          bg-pink-500
                          text-white
                          border-pink-500
                          -translate-y-1
                        `
                        : `
                          bg-white/90
                          text-gray-500
                          border-gray-300
                          shadow-[0_3px_0_#bbb]
                        `
                    }
                  `}
                >
                  SPACE
                </div>
              </div>
            </div>
          )}

          {/* =================================================
              STATS
          ================================================= */}

          <div
            className="
              absolute
              right-5
              top-[62px]
              hidden
              md:flex
              gap-3
            "
          >
            <div
              className="
                bg-white/70
                px-3
                py-1
                rounded-lg
                text-xs
                font-bold
                text-gray-500
              "
            >
              🎯 {accuracy}%
            </div>

            <div
              className="
                bg-white/70
                px-3
                py-1
                rounded-lg
                text-xs
                font-bold
                text-gray-500
              "
            >
              ⚡ {wpm} WPM
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}