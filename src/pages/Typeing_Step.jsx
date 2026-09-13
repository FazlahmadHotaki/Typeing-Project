import React, {
  useEffect,
  useRef,
  useState,
} from "react";

/* =========================================================
   API
========================================================= */

const API_BASE_URL =
  "https://the-typetone-api.onrender.com";

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

  const [correctCharacters, setCorrectCharacters] =
    useState(0);

  const [isFinished, setIsFinished] = useState(false);
  const [isPaused, setIsPaused] = useState(true);

  /* =======================================================
     UI
  ======================================================= */

  const [isMuted, setIsMuted] = useState(false);

  const [isKeyboardVisible, setIsKeyboardVisible] =
    useState(true);

  const [activeKey, setActiveKey] = useState(null);

  const [showMenu, setShowMenu] = useState(false);

  /* =======================================================
     REFS
  ======================================================= */

  const typingAreaRef = useRef(null);

  const keyboardTimer = useRef(null);

  const audioContextRef = useRef(null);

  /* =======================================================
     AUDIO
  ======================================================= */

  const initAudio = () => {
    if (!audioContextRef.current) {
      const AudioContext =
        window.AudioContext ||
        window.webkitAudioContext;

      if (AudioContext) {
        audioContextRef.current =
          new AudioContext();
      }
    }

    if (
      audioContextRef.current &&
      audioContextRef.current.state ===
        "suspended"
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

    const ctx =
      audioContextRef.current;

    if (!ctx) return;

    const now =
      ctx.currentTime;

    const oscillator =
      ctx.createOscillator();

    const gain =
      ctx.createGain();

    oscillator.type = "sine";

    oscillator.frequency.setValueAtTime(
      900,
      now
    );

    oscillator.frequency.exponentialRampToValueAtTime(
      550,
      now + 0.06
    );

    gain.gain.setValueAtTime(
      0.09,
      now
    );

    gain.gain.exponentialRampToValueAtTime(
      0.001,
      now + 0.06
    );

    oscillator.connect(gain);

    gain.connect(
      ctx.destination
    );

    oscillator.start(now);

    oscillator.stop(
      now + 0.06
    );
  };

  /* =======================================================
     INCORRECT SOUND
  ======================================================= */

  const playIncorrectSound = () => {
    if (isMuted) return;

    initAudio();

    const ctx =
      audioContextRef.current;

    if (!ctx) return;

    const now =
      ctx.currentTime;

    const master =
      ctx.createGain();

    master.gain.setValueAtTime(
      0.14,
      now
    );

    master.gain.exponentialRampToValueAtTime(
      0.001,
      now + 0.18
    );

    master.connect(
      ctx.destination
    );

    const osc1 =
      ctx.createOscillator();

    const osc2 =
      ctx.createOscillator();

    osc1.type = "sawtooth";
    osc2.type = "sawtooth";

    osc1.frequency.setValueAtTime(
      220,
      now
    );

    osc2.frequency.setValueAtTime(
      227,
      now
    );

    osc1.frequency.exponentialRampToValueAtTime(
      110,
      now + 0.15
    );

    osc2.frequency.exponentialRampToValueAtTime(
      113,
      now + 0.15
    );

    const oscGain =
      ctx.createGain();

    oscGain.gain.setValueAtTime(
      0.35,
      now
    );

    oscGain.gain.exponentialRampToValueAtTime(
      0.001,
      now + 0.16
    );

    osc1.connect(oscGain);
    osc2.connect(oscGain);

    oscGain.connect(master);

    osc1.start(now);
    osc2.start(now);

    osc1.stop(
      now + 0.18
    );

    osc2.stop(
      now + 0.18
    );
  };

  /* =======================================================
     BACKSPACE SOUND
  ======================================================= */

  const playBackspaceSound = () => {
    if (isMuted) return;

    initAudio();

    const ctx =
      audioContextRef.current;

    if (!ctx) return;

    const now =
      ctx.currentTime;

    const oscillator =
      ctx.createOscillator();

    const gain =
      ctx.createGain();

    oscillator.type = "sine";

    oscillator.frequency.setValueAtTime(
      300,
      now
    );

    oscillator.frequency.exponentialRampToValueAtTime(
      500,
      now + 0.08
    );

    gain.gain.setValueAtTime(
      0.08,
      now
    );

    gain.gain.exponentialRampToValueAtTime(
      0.001,
      now + 0.08
    );

    oscillator.connect(gain);

    gain.connect(
      ctx.destination
    );

    oscillator.start(now);

    oscillator.stop(
      now + 0.08
    );
  };

  /* =======================================================
     COMPLETE SOUND
  ======================================================= */

  const playCompleteSound = () => {
    if (isMuted) return;

    initAudio();

    const ctx =
      audioContextRef.current;

    if (!ctx) return;

    const notes = [
      523.25,
      659.25,
      784,
      1046.5,
    ];

    notes.forEach(
      (
        frequency,
        index
      ) => {
        setTimeout(() => {
          const now =
            ctx.currentTime;

          const oscillator =
            ctx.createOscillator();

          const gain =
            ctx.createGain();

          oscillator.type =
            "triangle";

          oscillator.frequency.setValueAtTime(
            frequency,
            now
          );

          gain.gain.setValueAtTime(
            0.12,
            now
          );

          gain.gain.exponentialRampToValueAtTime(
            0.001,
            now + 0.35
          );

          oscillator.connect(gain);

          gain.connect(
            ctx.destination
          );

          oscillator.start(now);

          oscillator.stop(
            now + 0.35
          );
        }, index * 100);
      }
    );
  };

  /* =======================================================
     GET LESSON ID
  ======================================================= */

  const getLessonId = () => {
    try {
      const params =
        new URLSearchParams(
          window.location.search
        );

      const urlLesson =
        params.get("lesson");

      if (urlLesson) {
        return String(
          urlLesson
        );
      }

      const saved =
        localStorage.getItem(
          "selectedLessonId"
        );

      return saved
        ? String(saved)
        : null;
    } catch {
      return null;
    }
  };

  /* =======================================================
     FETCH LESSON
  ======================================================= */

  const fetchLesson =
    async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response =
          await fetch(
            `${API_BASE_URL}/api/lessons`
          );

        if (!response.ok) {
          throw new Error(
            `HTTP Error: ${response.status}`
          );
        }

        const data =
          await response.json();

        const lessons =
          Array.isArray(data)
            ? data
            : Array.isArray(
                data.lessons
              )
            ? data.lessons
            : [];

        if (!lessons.length) {
          throw new Error(
            "درسونه پیدا نه شول."
          );
        }

        const lessonId =
          getLessonId();

        let selectedLesson =
          null;

        if (lessonId) {
          selectedLesson =
            lessons.find(
              (item) =>
                String(
                  item.id
                ) ===
                String(
                  lessonId
                )
            );
        }

        if (!selectedLesson) {
          selectedLesson =
            lessons[0];
        }

        localStorage.setItem(
          "selectedLessonId",
          String(
            selectedLesson.id
          )
        );

        setLesson(
          selectedLesson
        );

        setTypedText("");
        setStartTime(null);
        setElapsedTime(0);
        setCorrectCharacters(0);

        setIsFinished(false);
        setIsPaused(true);
        setActiveKey(null);
      } catch (err) {
        console.error(err);

        setError(
          err.message ||
            "د درس په ترلاسه کولو کې ستونزه رامنځته شوه."
        );
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
      if (
        keyboardTimer.current
      ) {
        clearTimeout(
          keyboardTimer.current
        );
      }
    };
  }, []);

  /* =======================================================
     TIMER
  ======================================================= */

  useEffect(() => {
    if (
      !startTime ||
      isFinished ||
      isPaused
    ) {
      return;
    }

    const timer =
      setInterval(() => {
        setElapsedTime(
          Math.floor(
            (Date.now() -
              startTime) /
              1000
          )
        );
      }, 1000);

    return () =>
      clearInterval(
        timer
      );
  }, [
    startTime,
    isFinished,
    isPaused,
  ]);

  /* =======================================================
     LESSON DATA
  ======================================================= */

  const targetText =
    lesson?.text || "";

  const totalCharacters =
    targetText.length;

  const currentCharacter =
    targetText[
      typedText.length
    ] || "";

  /* =======================================================
     PROGRESS
  ======================================================= */

  const progress =
    totalCharacters > 0
      ? Math.min(
          100,
          Math.round(
            (typedText.length /
              totalCharacters) *
              100
          )
        )
      : 0;

  /* =======================================================
     ACCURACY
  ======================================================= */

  const accuracy =
    typedText.length > 0
      ? Math.round(
          (correctCharacters /
            typedText.length) *
            100
        )
      : 100;

  /* =======================================================
     WPM
  ======================================================= */

  const words =
    typedText.trim().length > 0
      ? typedText
          .trim()
          .split(/\s+/)
          .filter(Boolean)
          .length
      : 0;

  const minutes =
    elapsedTime / 60;

  const wpm =
    minutes > 0
      ? Math.round(
          words / minutes
        )
      : 0;

  /* =======================================================
     TIME FORMAT
  ======================================================= */

  const formatTime = (
    seconds
  ) => {
    const mins =
      Math.floor(
        seconds / 60
      );

    const secs =
      seconds % 60;

    return `${String(
      mins
    ).padStart(
      2,
      "0"
    )}:${String(
      secs
    ).padStart(
      2,
      "0"
    )}`;
  };

  /* =======================================================
     ACTIVE KEY
  ======================================================= */

  const isKeyActive = (
    key
  ) => {
    if (
      !currentCharacter
    ) {
      return false;
    }

    if (
      currentCharacter ===
      " "
    ) {
      return false;
    }

    return [
      key.en,
      key.en.toLowerCase(),
      key.ps,
      key.da,
    ].includes(
      currentCharacter
    );
  };

  const isSpaceActive =
    currentCharacter ===
    " ";

  /* =======================================================
     KEY ANIMATION
  ======================================================= */

  const animateKey = (
    char
  ) => {
    setActiveKey(char);

    if (
      keyboardTimer.current
    ) {
      clearTimeout(
        keyboardTimer.current
      );
    }

    keyboardTimer.current =
      setTimeout(() => {
        setActiveKey(null);
      }, 180);
  };

  /* =======================================================
     HANDLE KEYBOARD
  ======================================================= */

  const handleKeyDown = (
    event
  ) => {
    if (
      !lesson ||
      isFinished
    ) {
      return;
    }

    /* Ignore modifiers */

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

    if (
      event.key ===
      "Backspace"
    ) {
      if (
        typedText.length > 0
      ) {
        playBackspaceSound();

        setTypedText(
          (prev) =>
            prev.slice(
              0,
              -1
            )
        );
      }

      return;
    }

    /* =====================================
       ONLY CHARACTERS
    ===================================== */

    if (
      event.key.length !== 1
    ) {
      return;
    }

    const newChar =
      event.key;

    const currentIndex =
      typedText.length;

    const expected =
      targetText[
        currentIndex
      ];

    /* =====================================
       START TIMER
    ===================================== */

    if (isPaused) {
      setIsPaused(false);

      if (!startTime) {
        setStartTime(
          Date.now()
        );
      }
    }

    /* =====================================
       KEY ANIMATION
    ===================================== */

    animateKey(
      newChar
    );

    /* =====================================
       CORRECT / WRONG SOUND
    ===================================== */

    if (
      newChar ===
      expected
    ) {
      playCorrectSound();
    } else {
      playIncorrectSound();
    }

    /* =====================================
       NEW TEXT
    ===================================== */

    const newTypedText =
      typedText +
      newChar;

    /* =====================================
       CORRECT CHARACTERS
    ===================================== */

    let newCorrectCount = 0;

    for (
      let i = 0;
      i <
      newTypedText.length;
      i++
    ) {
      if (
        newTypedText[i] ===
        targetText[i]
      ) {
        newCorrectCount++;
      }
    }

    setCorrectCharacters(
      newCorrectCount
    );

    setTypedText(
      newTypedText
    );

    /* =====================================
       FINISHED
    ===================================== */

    if (
      newTypedText.length >=
        targetText.length &&
      targetText.length > 0
    ) {
      const finishTime =
        Date.now();

      const finalStartTime =
        startTime ||
        finishTime;

      const finalElapsedTime =
        Math.max(
          0,
          Math.floor(
            (finishTime -
              finalStartTime) /
              1000
          )
        );

      const finalAccuracy =
        targetText.length > 0
          ? Math.round(
              (newCorrectCount /
                targetText.length) *
                100
            )
          : 100;

      const finalWords =
        newTypedText
          .trim()
          .split(/\s+/)
          .filter(Boolean)
          .length;

      const finalMinutes =
        finalElapsedTime /
        60;

      const finalWpm =
        finalMinutes > 0
          ? Math.round(
              finalWords /
                finalMinutes
            )
          : 0;

      /* Update state */

      setElapsedTime(
        finalElapsedTime
      );

      setCorrectCharacters(
        newCorrectCount
      );

      setIsPaused(true);

      setIsFinished(true);

      playCompleteSound();

      /* ===================================
         SAVE COMPLETED LESSON
      =================================== */

      const lessonId =
        String(
          lesson.id
        );

      try {
        let completedLessons =
          [];

        try {
          completedLessons =
            JSON.parse(
              localStorage.getItem(
                "completedLessons"
              ) || "[]"
            );
        } catch {
          completedLessons =
            [];
        }

        if (
          !Array.isArray(
            completedLessons
          )
        ) {
          completedLessons =
            [];
        }

        if (
          !completedLessons.includes(
            lessonId
          )
        ) {
          completedLessons.push(
            lessonId
          );
        }

        localStorage.setItem(
          "completedLessons",
          JSON.stringify(
            completedLessons
          )
        );

        let lessonResults =
          {};

        try {
          lessonResults =
            JSON.parse(
              localStorage.getItem(
                "lessonResults"
              ) || "{}"
            );
        } catch {
          lessonResults =
            {};
        }

        const finalResult = {
          lessonId:
            lesson.id,

          title:
            lesson.title ||
            "",

          level:
            lesson.level ||
            "",

          text:
            lesson.text ||
            "",

          completed:
            true,

          progress:
            100,

          typedCharacters:
            newTypedText.length,

          totalCharacters:
            targetText.length,

          correctCharacters:
            newCorrectCount,

          accuracy:
            finalAccuracy,

          wpm:
            finalWpm,

          elapsedTime:
            finalElapsedTime,

          score:
            10,

          completedAt:
            new Date().toISOString(),
        };

        lessonResults[
          lessonId
        ] = finalResult;

        localStorage.setItem(
          "lessonResults",
          JSON.stringify(
            lessonResults
          )
        );

        localStorage.setItem(
          "lastCompletedLesson",
          JSON.stringify(
            finalResult
          )
        );
      } catch (saveError) {
        console.error(
          "Could not save lesson:",
          saveError
        );
      }
    }
  };

  /* =======================================================
     GLOBAL KEYBOARD EVENT
  ======================================================= */

  useEffect(() => {
    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [
    lesson,
    isFinished,
    isPaused,
    typedText,
    targetText,
    startTime,
    isMuted,
  ]);

  /* =======================================================
     RESTART
  ======================================================= */

  const restartLesson =
    () => {
      setTypedText("");
      setStartTime(null);
      setElapsedTime(0);
      setCorrectCharacters(0);

      setIsFinished(false);
      setIsPaused(true);

      setActiveKey(null);

      setTimeout(() => {
        typingAreaRef.current?.focus();
      }, 100);
    };

  /* =======================================================
     GO BACK
  ======================================================= */

  const goBack =
    () => {
      window.location.href =
        "/dashboard/steps-pashto";
    };

  /* =======================================================
     NEXT LESSON
  ======================================================= */

  const nextLesson =
    async () => {
      if (!lesson) return;

      try {
        const response =
          await fetch(
            `${API_BASE_URL}/api/lessons`
          );

        if (!response.ok) {
          throw new Error(
            "Could not load lessons"
          );
        }

        const data =
          await response.json();

        const lessons =
          Array.isArray(data)
            ? data
            : Array.isArray(
                data.lessons
              )
            ? data.lessons
            : [];

        const index =
          lessons.findIndex(
            (item) =>
              String(
                item.id
              ) ===
              String(
                lesson.id
              )
          );

        if (
          index >= 0 &&
          index <
            lessons.length - 1
        ) {
          const next =
            lessons[
              index + 1
            ];

          localStorage.setItem(
            "selectedLessonId",
            String(
              next.id
            )
          );

          window.location.href =
            `/Typeing_Step?lesson=${next.id}`;
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

          <div className="text-5xl mb-5">
            ⚠️
          </div>

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

          <p className="text-gray-500 mt-3">
            {error}
          </p>

          <div className="flex gap-3 justify-center mt-6">

            <button
              onClick={
                fetchLesson
              }
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
    return (
      <div
        className="
          min-h-screen
          bg-[#fdf4c7]
          relative
          overflow-hidden
          flex
          items-center
          justify-center
          px-5
          py-10
        "
      >

        {/* CLOUDS */}

        <div
          className="
            absolute
            top-[10%]
            left-[7%]
            w-36
            h-14
            bg-white/60
            rounded-full
          "
        />

        <div
          className="
            absolute
            top-[6%]
            left-[11%]
            w-20
            h-20
            bg-white/60
            rounded-full
          "
        />

        <div
          className="
            absolute
            top-[16%]
            right-[8%]
            w-44
            h-14
            bg-white/60
            rounded-full
          "
        />

        <div
          className="
            absolute
            top-[10%]
            right-[15%]
            w-20
            h-20
            bg-white/60
            rounded-full
          "
        />

        {/* DECORATIONS */}

        <div
          className="
            absolute
            top-[18%]
            left-[18%]
            text-3xl
            animate-bounce
          "
        >
          ⭐
        </div>

        <div
          className="
            absolute
            top-[25%]
            right-[20%]
            text-3xl
            animate-pulse
          "
        >
          ✨
        </div>

        <div
          className="
            absolute
            bottom-[18%]
            left-[12%]
            text-3xl
            animate-pulse
          "
        >
          🎈
        </div>

        <div
          className="
            absolute
            bottom-[22%]
            right-[12%]
            text-3xl
            animate-bounce
          "
        >
          ⭐
        </div>

        {/* CARD */}

        <div
          className="
            relative
            z-20
            w-full
            max-w-[760px]
            bg-white/95
            backdrop-blur-xl
            rounded-[30px]
            shadow-[0_25px_80px_rgba(0,0,0,0.15)]
            border
            border-white
            p-6
            sm:p-10
          "
        >

          {/* SUCCESS ICON */}

          <div className="flex justify-center">

            <div
              className="
                w-24
                h-24
                sm:w-28
                sm:h-28
                rounded-full
                bg-green-100
                border-8
                border-green-200
                flex
                items-center
                justify-center
                text-5xl
                sm:text-6xl
                shadow-lg
              "
            >
              🎉
            </div>

          </div>

          {/* TITLE */}

          <div
            dir="rtl"
            className="
              text-center
              mt-5
            "
          >

            <p
              className="
                text-green-500
                font-bold
                text-lg
                mb-1
              "
            >
              ډېر ښه! 👏
            </p>

            <h1
              className="
                text-3xl
                sm:text-4xl
                font-extrabold
                text-gray-700
              "
            >
              درس بشپړ شو!
            </h1>

            <p
              dir="ltr"
              className="
                text-gray-400
                mt-2
                font-medium
              "
            >
              Lesson {lesson?.id}:{" "}
              {lesson?.title ||
                "Pashto Typing"}
            </p>

          </div>

          {/* PROGRESS */}

          <div className="mt-7">

            <div
              className="
                flex
                justify-between
                text-sm
                font-bold
                text-gray-500
                mb-2
              "
            >
              <span>
                Progress
              </span>

              <span className="text-green-500">
                100%
              </span>
            </div>

            <div
              className="
                h-4
                bg-gray-100
                rounded-full
                overflow-hidden
              "
            >

              <div
                className="
                  h-full
                  w-full
                  bg-gradient-to-r
                  from-pink-400
                  to-green-400
                  rounded-full
                "
              />

            </div>

          </div>

          {/* RESULTS */}

          <div
            className="
              grid
              grid-cols-2
              md:grid-cols-4
              gap-3
              mt-7
            "
          >

            {/* WPM */}

            <div
              className="
                bg-pink-50
                rounded-2xl
                p-4
                text-center
                border
                border-pink-100
              "
            >

              <div className="text-2xl">
                ⚡
              </div>

              <div
                className="
                  text-2xl
                  font-extrabold
                  text-pink-500
                  mt-1
                "
              >
                {wpm}
              </div>

              <div className="text-xs font-bold text-gray-400">
                WPM
              </div>

            </div>

            {/* ACCURACY */}

            <div
              className="
                bg-green-50
                rounded-2xl
                p-4
                text-center
                border
                border-green-100
              "
            >

              <div className="text-2xl">
                🎯
              </div>

              <div
                className="
                  text-2xl
                  font-extrabold
                  text-green-500
                  mt-1
                "
              >
                {accuracy}%
              </div>

              <div className="text-xs font-bold text-gray-400">
                Accuracy
              </div>

            </div>

            {/* TIME */}

            <div
              className="
                bg-blue-50
                rounded-2xl
                p-4
                text-center
                border
                border-blue-100
              "
            >

              <div className="text-2xl">
                ⏱️
              </div>

              <div
                className="
                  text-2xl
                  font-extrabold
                  text-blue-500
                  mt-1
                "
              >
                {formatTime(
                  elapsedTime
                )}
              </div>

              <div className="text-xs font-bold text-gray-400">
                Time
              </div>

            </div>

            {/* CORRECT */}

            <div
              className="
                bg-yellow-50
                rounded-2xl
                p-4
                text-center
                border
                border-yellow-100
              "
            >

              <div className="text-2xl">
                ⌨️
              </div>

              <div
                className="
                  text-2xl
                  font-extrabold
                  text-yellow-500
                  mt-1
                "
              >
                {correctCharacters}
              </div>

              <div className="text-xs font-bold text-gray-400">
                Correct
              </div>

            </div>

          </div>

          {/* EXTRA RESULTS */}

          <div
            className="
              mt-5
              bg-gray-50
              rounded-2xl
              p-4
              flex
              flex-wrap
              justify-center
              gap-x-7
              gap-y-2
              text-sm
              font-bold
              text-gray-500
            "
          >

            <span>
              Characters:{" "}
              {totalCharacters}
            </span>

            <span>
              Correct:{" "}
              {correctCharacters}
            </span>

            <span>
              Score:{" "}
              <span className="text-pink-500">
                10/10
              </span>
            </span>

          </div>

          {/* BUTTONS */}

          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-3
              gap-3
              mt-7
            "
          >

            <button
              onClick={
                restartLesson
              }
              className="
                py-3.5
                px-5
                rounded-xl
                bg-gray-100
                hover:bg-gray-200
                text-gray-600
                font-bold
                transition
                active:scale-95
              "
            >
              🔄 بیا تمرین
            </button>

            <button
              onClick={goBack}
              className="
                py-3.5
                px-5
                rounded-xl
                bg-blue-500
                hover:bg-blue-600
                text-white
                font-bold
                transition
                shadow-md
                active:scale-95
              "
            >
              📚 ټول درسونه
            </button>

            <button
              onClick={
                nextLesson
              }
              className="
                py-3.5
                px-5
                rounded-xl
                bg-pink-500
                hover:bg-pink-600
                text-white
                font-bold
                transition
                shadow-md
                active:scale-95
              "
            >
              بل درس →
            </button>

          </div>

          <div
            dir="rtl"
            className="
              text-center
              mt-6
              text-sm
              text-gray-400
              font-medium
            "
          >
            ستا پایله په اوتومات ډول خوندي شوه. 💾
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
            onClick={() =>
              setShowMenu(
                !showMenu
              )
            }
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
            Lesson {lesson?.id}:{" "}
            {lesson?.title ||
              "Pashto Typing"}
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

                  setShowMenu(
                    false
                  );
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
                <img className="inline" width={20} src="https://img.icons8.com/?size=100&id=bDkQlpOV2TWB&format=png&color=000000" alt="" /> له سره پیل کړه
              </button>

              <button
                onClick={() => {
                  setIsMuted(
                    !isMuted
                  );

                  setShowMenu(
                    false
                  );
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
                
                 {isMuted
                  ? (
                    <>
<img className="inline" width={20} src="https://img.icons8.com/?size=100&id=NbXdDWS68ggb&format=png&color=000000" alt="" />
          غږ بند کړه
       </> )
                  : (
                    <>
<img className="inline " width={20} src="https://img.icons8.com/?size=100&id=FV0C4YFGl7TK&format=png&color=000000" alt="" />
                                                   غږ فعال کړه
      </>
                )}
                 
              </button>

              <button
                onClick={() => {
                  setIsKeyboardVisible(
                    !isKeyboardVisible
                  );

                  setShowMenu(
                    false
                  );
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
                <img width={25} className=" inline" src="https://img.icons8.com/?size=100&id=mnLsovgnDgTt&format=png&color=000000" alt="" /> کیبورډ چالان/بند کړه
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
                "
              >
                ← Lessons
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
                setIsPaused(
                  false
                );

                if (!startTime) {
                  setStartTime(
                    Date.now()
                  );
                }
              } else {
                setIsPaused(
                  true
                );
              }

              typingAreaRef.current?.focus();
            }}
            className="
              text-gray-500
              hover:text-gray-800
              text-lg
            "
          >
            {isPaused
              ? (
                <img width={23} src="https://img.icons8.com/?size=100&id=TB4ZgJum4Woc&format=png&color=000000" alt="" />
              )
              : (
                <img width={23} src="https://img.icons8.com/?size=100&id=Z2aInWmsldJ6&format=png&color=000000" alt="" />
              )}
          </button>

          <button
            onClick={
              restartLesson
            }
            className="
              text-gray-500
              hover:text-gray-800
              text-xl
            "
          >
            <img width={23} src="https://img.icons8.com/?size=100&id=t7r2A42vsY6O&format=png&color=000000" alt="" />
          </button>

          <button
            onClick={() =>
              setIsKeyboardVisible(
                !isKeyboardVisible
              )
            }
            className="
              text-gray-500
              hover:text-gray-800
              text-xl
            "
          >
            <img width={25} src="https://img.icons8.com/?size=100&id=58RG2mzbDIPX&format=png&color=000000" alt="" />
          </button>

          <button 
            onClick={() => {
              initAudio();

              setIsMuted(
                !isMuted
              );
            }}
            className="
              text-gray-500
              hover:text-gray-800

            "
          >
            {isMuted
              ? (
                <img width={23} src="https://img.icons8.com/?size=100&id=ZaGj3ZYdtFZX&format=png&color=000000"></img>
              )
              : (
                <img width={23} src="https://img.icons8.com/?size=100&id=tAby2g2M-Yna&format=png&color=000000" alt="" />
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

      <div
        className="
          absolute
          top-[9%]
          left-[9%]
          w-16
          h-16
          bg-white/60
          rounded-full
        "
      />

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
                setIsPaused(
                  false
                );

                if (!startTime) {
                  setStartTime(
                    Date.now()
                  );
                }
              } else {
                setIsPaused(
                  true
                );
              }

              typingAreaRef.current?.focus();
            }}
            className="
              self-start
              ml-[7%]
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
            "
          >
            {isPaused
              ? "▶ Start Typing"
              : "⏸ Typing..."}
          </button>

          {/* =================================================
              TEXT
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
              className="
                font-['Fredoka']
                text-[34px]
                sm:text-[43px]
                md:text-[52px]
                leading-[1.5]
                tracking-wide
                text-gray-700
                text-left
                break-words
                w-full
              "
            >

              {targetText
                .split("")
                .map(
                  (
                    char,
                    index
                  ) => {

                    let className =
                      "text-gray-400";

                    /* Already typed */

                    if (
                      index <
                      typedText.length
                    ) {
                      className =
                        typedText[
                          index
                        ] === char
                          ? "text-gray-700"
                          : "text-red-500 bg-red-100 rounded-md";
                    }

                    /* Current character */

                    if (
                      index ===
                      typedText.length
                    ) {
                      className =
                        "text-pink-500 border-b-4 border-blue-400";
                    }

                    return (
                      <span
                        key={index}
                        className={`
                          transition-all
                          duration-100
                          ${className}
                        `}
                      >
                        {char === " "
                          ? "\u00A0"
                          : char}
                      </span>
                    );
                  }
                )}

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
                  width:
                    `${progress}%`,
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
              {formatTime(
                elapsedTime
              )}
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

              {keyboardLayout.map(
                (row) => (
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

                    {row.keys.map(
                      (key) => {

                        const active =
                          isKeyActive(
                            key
                          );

                        const pressed =
                          activeKey ===
                            key.en ||
                          activeKey ===
                            key.ps;

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

                              ${
                                pressed
                                  ? "scale-110"
                                  : ""
                              }
                            `}
                          >
                            {key.ps}
                          </div>
                        );
                      }
                    )}

                  </div>
                )
              )}

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