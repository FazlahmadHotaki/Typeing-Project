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
     LESSON STATE
  ======================================================= */

  const [lesson, setLesson] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  /* =======================================================
     TYPING STATE
  ======================================================= */

  const [typedText, setTypedText] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  const [correctCharacters, setCorrectCharacters] =
    useState(0);

  const [isFinished, setIsFinished] = useState(false);
  const [isPaused, setIsPaused] = useState(true);

  /* =======================================================
     UI STATE
  ======================================================= */

  const [isMuted, setIsMuted] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] =
    useState(true);

  const [activeKey, setActiveKey] = useState(null);

  const [showMenu, setShowMenu] = useState(false);

  /* =======================================================
     REFS
  ======================================================= */

  const inputRef = useRef(null);
  const keyboardTimer = useRef(null);
  const completionHandledRef = useRef(false);

  /* =======================================================
     AUDIO
  ======================================================= */

  const audioContextRef = useRef(null);

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

    const ctx = audioContextRef.current;

    if (!ctx) return;

    const now = ctx.currentTime;

    const oscillator =
      ctx.createOscillator();

    const gain = ctx.createGain();

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
    gain.connect(ctx.destination);

    oscillator.start(now);
    oscillator.stop(now + 0.06);
  };

  /* =======================================================
     INCORRECT / BITTER SOUND
  ======================================================= */

  const playIncorrectSound = () => {
    if (isMuted) return;

    initAudio();

    const ctx = audioContextRef.current;

    if (!ctx) return;

    const now = ctx.currentTime;

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

    master.connect(ctx.destination);

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

    const notes = [
      523.25,
      659.25,
      784,
      1046.5,
    ];

    notes.forEach((frequency, index) => {
      setTimeout(() => {
        const now = ctx.currentTime;

        const oscillator =
          ctx.createOscillator();

        const gain =
          ctx.createGain();

        oscillator.type = "triangle";

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
      const params =
        new URLSearchParams(
          window.location.search
        );

      const urlLesson =
        params.get("lesson");

      if (urlLesson) {
        return String(urlLesson);
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

  const fetchLesson = async () => {
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

      let selectedLesson = null;

      if (lessonId) {
        selectedLesson =
          lessons.find(
            (item) =>
              String(item.id) ===
              String(lessonId)
          );
      }

      if (!selectedLesson) {
        selectedLesson =
          lessons[0];
      }

      localStorage.setItem(
        "selectedLessonId",
        String(selectedLesson.id)
      );

      setLesson(selectedLesson);

      setTypedText("");
      setStartTime(null);
      setElapsedTime(0);
      setCorrectCharacters(0);
      setIsFinished(false);
      setIsPaused(true);

      completionHandledRef.current =
        false;
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
      if (keyboardTimer.current) {
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
      clearInterval(timer);
  }, [
    startTime,
    isFinished,
    isPaused,
  ]);

  /* =======================================================
     DATA
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
    typedText.trim().length
      ? typedText
          .trim()
          .split(/\s+/).length
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
     KEYBOARD ACTIVE
  ======================================================= */

  const isKeyActive = (
    key
  ) => {
    if (!currentCharacter) {
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
    currentCharacter === " ";

  /* =======================================================
     ANIMATE KEY
  ======================================================= */

  const animateKey = (
    char
  ) => {
    setActiveKey(char);

    if (keyboardTimer.current) {
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
     TYPING
  ======================================================= */

  const handleTyping = (
    event
  ) => {
    if (
      !lesson ||
      isFinished
    ) {
      return;
    }

    initAudio();

    const value =
      event.target.value;

    const target =
      lesson.text || "";

    /* START */

    if (
      value.length === 1 &&
      !startTime
    ) {
      setStartTime(
        Date.now()
      );

      setIsPaused(false);
    }

    /* DETECT LAST CHARACTER */

    if (
      value.length >
      typedText.length
    ) {
      const newChar =
        value[value.length - 1];

      animateKey(
        newChar
      );

      const expected =
        target[
          value.length - 1
        ];

      if (
        newChar === expected
      ) {
        playCorrectSound();
      } else {
        playIncorrectSound();
      }
    }

    /* BACKSPACE */

    if (
      value.length <
      typedText.length
    ) {
      playBackspaceSound();
    }

    /* COUNT CORRECT */

    let correct = 0;

    for (
      let i = 0;
      i < value.length;
      i++
    ) {
      if (
        value[i] ===
        target[i]
      ) {
        correct++;
      }
    }

    setCorrectCharacters(
      correct
    );

    setTypedText(value);

    /* COMPLETE */

    if (
      value === target &&
      target.length > 0
    ) {
      const finishTime =
        Date.now();

      const finalStart =
        startTime ||
        finishTime;

      const finalElapsed =
        Math.floor(
          (finishTime -
            finalStart) /
            1000
        );

      setElapsedTime(
        finalElapsed
      );

      setIsFinished(true);
      setIsPaused(true);

      playCompleteSound();
    }
  };

  /* =======================================================
     KEYBOARD PHYSICAL KEY
  ======================================================= */

  useEffect(() => {
    const handleKeyDown =
      (event) => {
        if (
          isFinished
        ) {
          return;
        }

        if (
          event.key ===
          " "
        ) {
          event.preventDefault();
        }

        initAudio();

        if (
          event.key ===
          "Backspace"
        ) {
          return;
        }

        if (
          event.key.length ===
          1
        ) {
          animateKey(
            event.key
          );
        }
      };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
  }, [
    isFinished,
  ]);

  /* =======================================================
     SAVE COMPLETED LESSON
  ======================================================= */

  const saveCompletedLesson =
    () => {
      if (!lesson) return;

      const id =
        String(lesson.id);

      try {
        let completed = [];

        try {
          const saved =
            JSON.parse(
              localStorage.getItem(
                "completedLessons"
              ) || "[]"
            );

          if (
            Array.isArray(saved)
          ) {
            completed =
              saved.map(String);
          }
        } catch {
          completed = [];
        }

        if (
          !completed.includes(id)
        ) {
          completed.push(id);
        }

        localStorage.setItem(
          "completedLessons",
          JSON.stringify(
            completed
          )
        );

        let results = {};

        try {
          const saved =
            JSON.parse(
              localStorage.getItem(
                "lessonResults"
              ) || "{}"
            );

          if (
            saved &&
            typeof saved ===
              "object" &&
            !Array.isArray(saved)
          ) {
            results = saved;
          }
        } catch {
          results = {};
        }

        results[id] = {
          lessonId:
            lesson.id,

          title:
            lesson.title || "",

          level:
            lesson.level || "",

          type:
            lesson.type || "",

          difficulty:
            lesson.difficulty ||
            "",

          text:
            lesson.text || "",

          completed:
            true,

          progress: 100,

          typedCharacters:
            typedText.length,

          totalCharacters:
            targetText.length,

          correctCharacters:
            correctCharacters,

          accuracy,

          wpm,

          elapsedTime,

          score: 10,

          completedAt:
            new Date().toISOString(),
        };

        localStorage.setItem(
          "lessonResults",
          JSON.stringify(
            results
          )
        );

        localStorage.setItem(
          "lastCompletedLesson",
          JSON.stringify(
            results[id]
          )
        );
      } catch (err) {
        console.error(
          "Could not save:",
          err
        );
      }
    };

  /* =======================================================
     SAVE WHEN FINISHED
  ======================================================= */

  useEffect(() => {
    if (
      !isFinished ||
      !lesson ||
      completionHandledRef.current
    ) {
      return;
    }

    completionHandledRef.current =
      true;

    saveCompletedLesson();
  }, [isFinished]);

  /* =======================================================
     RESTART
  ======================================================= */

  const restartLesson =
    () => {
      completionHandledRef.current =
        false;

      setTypedText("");
      setStartTime(null);
      setElapsedTime(0);
      setCorrectCharacters(0);
      setIsFinished(false);
      setIsPaused(true);
      setActiveKey(null);

      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    };

  /* =======================================================
     BACK
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

        const data =
          await response.json();

        const lessons =
          Array.isArray(data)
            ? data
            : data.lessons || [];

        const index =
          lessons.findIndex(
            (item) =>
              String(item.id) ===
              String(lesson.id)
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
            String(next.id)
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
     LOADING
  ======================================================= */

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fdf4c7] flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-pink-300 border-t-pink-600 rounded-full animate-spin mx-auto" />

          <p className="mt-5 text-gray-600 font-bold">
            درس بارول کېږي...
          </p>
        </div>
      </div>
    );
  }

  /* =======================================================
     ERROR
  ======================================================= */

  if (error) {
    return (
      <div className="min-h-screen bg-[#fdf4c7] flex items-center justify-center p-5">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full">
          <div className="text-5xl mb-5">
            ⚠️
          </div>

          <h2 className="text-2xl font-bold text-red-500">
            ستونزه رامنځته شوه
          </h2>

          <p className="text-gray-500 mt-3">
            {error}
          </p>

          <div className="flex gap-3 justify-center mt-6">
            <button
              onClick={fetchLesson}
              className="px-5 py-3 bg-pink-500 text-white rounded-xl font-bold"
            >
              بیا هڅه
            </button>

            <button
              onClick={goBack}
              className="px-5 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold"
            >
              بېرته
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* =======================================================
     MAIN
  ======================================================= */

  return (
    <div
      className="
        relative
        h-screen
        overflow-hidden
        bg-[#fdf4c7]
        text-gray-700
        font-sans
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

        <div className="relative flex items-center gap-4">
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
              text-sm
            "
          >
            Lesson {lesson?.id}:{" "}
            {lesson?.title ||
              "Pashto Typing"}
          </div>

          {/* DROPDOWN */}

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
                "
              >
                🔄 Restart Lesson
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
                "
              >
                {isMuted
                  ? "🔇 Enable Sound"
                  : "🔊 Mute Sound"}
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
                "
              >
                ⌨️ Toggle Keyboard
              </button>

              <button
                onClick={goBack}
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

        {/* CENTER */}

        <div className="flex items-center gap-5">
          <button
            onClick={() => {
              initAudio();

              if (isFinished) {
                restartLesson();
                return;
              }

              setIsPaused(
                !isPaused
              );

              if (
                isPaused &&
                !startTime
              ) {
                setStartTime(
                  Date.now()
                );
              }

              setTimeout(() => {
                inputRef.current?.focus();
              }, 50);
            }}
            className="text-gray-500 hover:text-gray-800 text-lg"
          >
            {isPaused
              ? "▶"
              : "⏸"}
          </button>

          <button
            onClick={restartLesson}
            className="text-gray-500 hover:text-gray-800 text-xl"
          >
            ⟳
          </button>

          <button
            onClick={() =>
              setIsKeyboardVisible(
                !isKeyboardVisible
              )
            }
            className="text-gray-500 hover:text-gray-800 text-xl"
          >
            ⌨
          </button>

          <button
            onClick={() =>
              alert(
                "Finger guide will be added here."
              )
            }
            className="hidden sm:block text-gray-500 hover:text-gray-800"
          >
            👆
          </button>

          <button
            onClick={() => {
              initAudio();
              setIsMuted(
                !isMuted
              );
            }}
            className="text-gray-500 hover:text-gray-800"
          >
            {isMuted
              ? "🔇"
              : "🔊"}
          </button>

          <button
            onClick={() =>
              alert(
                "Settings panel will be added here."
              )
            }
            className="text-gray-500 hover:text-gray-800"
          >
            ⚙
          </button>
        </div>

        {/* USER */}

        <div className="font-bold text-gray-500 text-sm">
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
          z-0
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
          SIGNPOST
      ===================================================== */}

      <div
        className="
          hidden
          lg:flex
          absolute
          left-10
          bottom-14
          flex-col
          items-center
          z-10
        "
      >
        <div className="relative w-2.5 h-48 bg-gray-400 rounded-full">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 bg-gray-400 rounded-full" />

          <div
            className="
              absolute
              top-7
              -left-16
              bg-pink-300
              px-4
              py-2
              rounded-md
              text-xs
              font-bold
              shadow-md
              -rotate-3
              whitespace-nowrap
            "
          >
            Keyboard
          </div>

          <div
            className="
              absolute
              top-20
              -left-12
              bg-yellow-200
              px-4
              py-2
              rounded-md
              text-xs
              font-bold
              shadow-md
              rotate-2
              whitespace-nowrap
            "
          >
            Home Row
          </div>

          <div
            className="
              absolute
              top-32
              -left-20
              bg-blue-300
              px-4
              py-2
              rounded-md
              text-xs
              font-bold
              shadow-md
              -rotate-2
              whitespace-nowrap
            "
          >
            Typing City
          </div>
        </div>
      </div>

      {/* =====================================================
          TAXI
      ===================================================== */}

      <div
        className="
          hidden
          lg:block
          absolute
          right-12
          bottom-10
          w-40
          h-20
          z-10
        "
      >
        <div
          className="
            absolute
            bottom-0
            w-full
            h-14
            bg-yellow-400
            rounded-[25px_35px_8px_8px]
            shadow-inner
          "
        />

        <div
          className="
            absolute
            -top-5
            right-5
            w-20
            h-8
            bg-sky-300
            rounded-t-[20px]
            border-4
            border-yellow-400
          "
        />

        <div
          className="
            absolute
            -top-3
            left-5
            bg-yellow-400
            rounded-t
            px-2
            text-[7px]
            font-bold
          "
        >
          TAXI
        </div>

        <div className="absolute bottom-[-7px] left-5 w-6 h-6 bg-gray-800 rounded-full border-4 border-gray-500" />

        <div className="absolute bottom-[-7px] right-5 w-6 h-6 bg-gray-800 rounded-full border-4 border-gray-500" />
      </div>

      {/* =====================================================
          MAIN APPLICATION
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
          {/* =================================================
              START TOOLTIP
          ================================================= */}

          <button
            onClick={() => {
              initAudio();

              if (isFinished) {
                restartLesson();
                return;
              }

              setIsPaused(
                !isPaused
              );

              if (
                isPaused &&
                !startTime
              ) {
                setStartTime(
                  Date.now()
                );
              }

              setTimeout(() => {
                inputRef.current?.focus();
              }, 50);
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
            {isFinished
              ? "🎉 Lesson Complete!"
              : isPaused
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
              min-h-[145px]
              px-[7%]
              flex
              items-center
              justify-center
            "
          >
            <div
              className="
                font-['Fredoka']
                text-[32px]
                sm:text-[40px]
                md:text-[46px]
                leading-[1.45]
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
                      "text-gray-500";

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

                    if (
                      index ===
                      typedText.length
                    ) {
                      className =
                        "text-pink-500 border-b-4 border-blue-400";
                    }

                    return (
                      <span
                        key={
                          index
                        }
                        className={`
                          transition-all
                          duration-100
                          ${className}
                        `}
                      >
                        {char ===
                        " "
                          ? "\u00A0"
                          : char}
                      </span>
                    );
                  }
                )}
            </div>
          </div>

          {/* =================================================
              INPUT
          ================================================= */}

          <div
            className="
              w-[86%]
              mt-1
              mb-2
            "
          >
            <textarea
              ref={
                inputRef
              }
              value={
                typedText
              }
              onChange={
                handleTyping
              }
              disabled={
                isFinished ||
                isPaused
              }
              spellCheck={
                false
              }
              autoFocus
              dir="ltr"
              placeholder={
                isPaused
                  ? "▶ Start typing..."
                  : ""
              }
              className="
                w-full
                h-[100px]
                resize-none
                outline-none
                bg-white/60
                border-2
                border-white
                focus:border-blue-300
                rounded-xl
                px-6
                py-4
                text-[26px]
                sm:text-[32px]
                font-['Fredoka']
                text-gray-700
                shadow-inner
                text-left
                transition
              "
            />
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
            <div className="flex-1 h-2 bg-white/50 rounded-full overflow-hidden">
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

            <span className="text-xs font-bold text-gray-500">
              {progress}%
            </span>

            <span className="text-xs font-bold text-gray-500">
              {formatTime(
                elapsedTime
              )}
            </span>
          </div>

          {/* =================================================
              KEYBOARD
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
                    key={
                      row.id
                    }
                    className="
                      flex
                      justify-center
                      gap-1
                      sm:gap-1.5
                      mb-1.5
                    "
                  >
                    {row.keys.map(
                      (
                        key
                      ) => {
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
                            {
                              key.ps
                            }
                          </div>
                        );
                      }
                    )}
                  </div>
                )
              )}

              {/* SPACE */}

              <div className="flex justify-center mt-1">
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
              FINISHED MESSAGE
          ================================================= */}

          {isFinished && (
            <div
              className="
                absolute
                bottom-2
                bg-yellow-200
                border
                border-yellow-300
                px-6
                py-2
                rounded-xl
                shadow-md
                text-sm
                font-bold
                text-gray-600
                flex
                items-center
                gap-5
              "
            >
              <span>
                🎉 درس بشپړ شو!
              </span>

              <span>
                {wpm} WPM
              </span>

              <span>
                {accuracy}%
              </span>

              <button
                onClick={
                  nextLesson
                }
                className="
                  bg-pink-500
                  hover:bg-pink-600
                  text-white
                  px-4
                  py-1.5
                  rounded-lg
                "
              >
                بل درس →
              </button>
            </div>
          )}

          {/* =================================================
              SMALL STATS
          ================================================= */}

          {!isFinished && (
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
              <div className="bg-white/70 px-3 py-1 rounded-lg text-xs font-bold text-gray-500">
                🎯 {accuracy}%
              </div>

              <div className="bg-white/70 px-3 py-1 rounded-lg text-xs font-bold text-gray-500">
                ⚡ {wpm} WPM
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}