import React, {
  useEffect,
  useRef,
  useState,
} from "react";

const API_BASE_URL =
  "https://the-typetone-api.onrender.com";

/* =========================================================
   KEYBOARD LAYOUT
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
   MAIN COMPONENT
========================================================= */

export default function Typeing_Step() {
  const [lesson, setLesson] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [typedText, setTypedText] = useState("");

  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  const [isFinished, setIsFinished] = useState(false);

  const [correctCharacters, setCorrectCharacters] =
    useState(0);

  const [totalCharacters, setTotalCharacters] =
    useState(0);

  const [isKeyboardAnimating, setIsKeyboardAnimating] =
    useState(false);

  const completionHandledRef = useRef(false);
  const inputRef = useRef(null);
  const keyboardAnimationTimer = useRef(null);

  /* =========================================================
     GET LESSON ID
  ========================================================= */

  const getLessonId = () => {
    try {
      const urlParams = new URLSearchParams(
        window.location.search
      );

      const urlLessonId = urlParams.get("lesson");

      if (urlLessonId) {
        return String(urlLessonId);
      }

      const savedId =
        localStorage.getItem("selectedLessonId");

      return savedId ? String(savedId) : null;
    } catch (error) {
      console.error(
        "Could not read lesson ID:",
        error
      );

      return null;
    }
  };

  const lessonId = getLessonId();

  /* =========================================================
     FETCH LESSON
  ========================================================= */

  const fetchLesson = async () => {
    setIsLoading(true);
    setError(null);

    completionHandledRef.current = false;

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/lessons`
      );

      if (!response.ok) {
        throw new Error(
          `HTTP Error: ${response.status}`
        );
      }

      const data = await response.json();

      const lessons = Array.isArray(data)
        ? data
        : Array.isArray(data.lessons)
        ? data.lessons
        : [];

      if (lessons.length === 0) {
        throw new Error("درسونه پیدا نه شول.");
      }

      let foundLesson = null;

      if (lessonId) {
        foundLesson = lessons.find(
          (item) =>
            String(item.id) === String(lessonId)
        );
      }

      if (!foundLesson) {
        foundLesson = lessons[0];
      }

      if (!foundLesson) {
        throw new Error("درس پیدا نه شو.");
      }

      try {
        localStorage.setItem(
          "selectedLessonId",
          String(foundLesson.id)
        );
      } catch (storageError) {
        console.error(
          "Could not save selected lesson ID:",
          storageError
        );
      }

      setLesson(foundLesson);

      setTypedText("");
      setStartTime(null);
      setElapsedTime(0);
      setIsFinished(false);
      setCorrectCharacters(0);

      setTotalCharacters(
        (foundLesson.text || "").length
      );
    } catch (err) {
      console.error(
        "Error fetching lesson:",
        err
      );

      setError(
        err.message ||
          "د درس په ترلاسه کولو کې ستونزه رامنځته شوه."
      );
    } finally {
      setIsLoading(false);
    }
  };

  /* =========================================================
     LOAD LESSON
  ========================================================= */

  useEffect(() => {
    fetchLesson();

    return () => {
      if (keyboardAnimationTimer.current) {
        clearTimeout(
          keyboardAnimationTimer.current
        );
      }
    };
  }, []);

  /* =========================================================
     TIMER
     NO TIME LIMIT
  ========================================================= */

  useEffect(() => {
    if (!startTime || isFinished) {
      return;
    }

    const timer = setInterval(() => {
      const currentTime = Math.floor(
        (Date.now() - startTime) / 1000
      );

      setElapsedTime(currentTime);
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime, isFinished]);

  /* =========================================================
     FORMAT TIME
  ========================================================= */

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);

    const remainingSeconds =
      seconds % 60;

    return `${String(minutes).padStart(
      2,
      "0"
    )}:${String(remainingSeconds).padStart(
      2,
      "0"
    )}`;
  };

  /* =========================================================
     TARGET TEXT
  ========================================================= */

  const targetText = lesson?.text || "";

  /* =========================================================
     PROGRESS
  ========================================================= */

  const typingProgress =
    targetText.length > 0
      ? Math.min(
          100,
          Math.round(
            (typedText.length /
              targetText.length) *
              100
          )
        )
      : 0;

  /* =========================================================
     ACCURACY
  ========================================================= */

  const accuracy =
    typedText.length > 0
      ? Math.round(
          (correctCharacters /
            typedText.length) *
            100
        )
      : 100;

  /* =========================================================
     WPM
  ========================================================= */

  const wordsTyped =
    typedText.trim().length > 0
      ? typedText
          .trim()
          .split(/\s+/).length
      : 0;

  const minutes = elapsedTime / 60;

  const wpm =
    minutes > 0
      ? Math.round(wordsTyped / minutes)
      : 0;

  /* =========================================================
     CURRENT CHARACTER
  ========================================================= */

  const currentCharacter =
    targetText[typedText.length] || "";

  /* =========================================================
     KEYBOARD MATCH
  ========================================================= */

  const isKeyActive = (key) => {
    if (!currentCharacter) {
      return false;
    }

    if (currentCharacter === " ") {
      return false;
    }

    const possibleCharacters = [
      key.en,
      key.en.toLowerCase(),
      key.ps,
      key.da,
    ];

    return possibleCharacters.includes(
      currentCharacter
    );
  };

  /* =========================================================
     SPACE
  ========================================================= */

  const isSpaceActive =
    currentCharacter === " ";

  /* =========================================================
     KEY DISPLAY
  ========================================================= */

  const getKeyDisplay = (key) => {
    return key.ps;
  };

  /* =========================================================
     HANDLE TYPING
  ========================================================= */

  const handleTyping = (event) => {
    if (
      !lesson ||
      isFinished ||
      completionHandledRef.current
    ) {
      return;
    }

    const value = event.target.value;
    const target = lesson.text || "";

    if (value.length === 1 && !startTime) {
      setStartTime(Date.now());
    }

    setTypedText(value);

    let correct = 0;

    for (
      let i = 0;
      i < value.length;
      i++
    ) {
      if (value[i] === target[i]) {
        correct++;
      }
    }

    setCorrectCharacters(correct);

    setIsKeyboardAnimating(true);

    if (keyboardAnimationTimer.current) {
      clearTimeout(
        keyboardAnimationTimer.current
      );
    }

    keyboardAnimationTimer.current =
      setTimeout(() => {
        setIsKeyboardAnimating(false);
      }, 300);

    if (
      value === target &&
      target.length > 0
    ) {
      let finalStartTime = startTime;

      if (!finalStartTime) {
        finalStartTime = Date.now();
        setStartTime(finalStartTime);
      }

      const finishTime = Date.now();

      const finalElapsedTime =
        Math.floor(
          (finishTime -
            finalStartTime) /
            1000
        );

      setElapsedTime(
        finalElapsedTime
      );

      setIsFinished(true);
    }
  };

  /* =========================================================
     SAVE COMPLETED LESSON
  ========================================================= */

  const saveCompletedLesson = () => {
    if (!lesson) {
      return;
    }

    try {
      const currentId =
        String(lesson.id);

      let completed = [];

      try {
        const saved = JSON.parse(
          localStorage.getItem(
            "completedLessons"
          ) || "[]"
        );

        if (Array.isArray(saved)) {
          completed =
            saved.map(String);
        }
      } catch {
        completed = [];
      }

      if (
        !completed.includes(currentId)
      ) {
        completed.push(currentId);
      }

      localStorage.setItem(
        "completedLessons",
        JSON.stringify(completed)
      );

      let results = {};

      try {
        const savedResults =
          JSON.parse(
            localStorage.getItem(
              "lessonResults"
            ) || "{}"
          );

        if (
          savedResults &&
          typeof savedResults ===
            "object" &&
          !Array.isArray(
            savedResults
          )
        ) {
          results = savedResults;
        }
      } catch {
        results = {};
      }

      results[currentId] = {
        lessonId: lesson.id,
        title: lesson.title || "",
        level: lesson.level || "",
        type: lesson.type || "",
        difficulty:
          lesson.difficulty || "",
        text: lesson.text || "",
        completed: true,
        progress: 100,
        typedCharacters:
          typedText.length,
        totalCharacters:
          targetText.length,
        correctCharacters:
          correctCharacters,
        accuracy: accuracy,
        wpm: wpm,
        elapsedTime: elapsedTime,
        score: 10,
        completedAt:
          new Date().toISOString(),
      };

      localStorage.setItem(
        "lessonResults",
        JSON.stringify(results)
      );

      localStorage.setItem(
        "lastCompletedLesson",
        JSON.stringify(
          results[currentId]
        )
      );
    } catch (error) {
      console.error(
        "Could not save lesson result:",
        error
      );
    }
  };

  /* =========================================================
     COMPLETION
  ========================================================= */

  useEffect(() => {
    if (
      !isFinished ||
      !lesson ||
      completionHandledRef.current
    ) {
      return;
    }

    completionHandledRef.current = true;

    saveCompletedLesson();
  }, [
    isFinished,
    lesson,
    typedText,
    elapsedTime,
    correctCharacters,
  ]);

  /* =========================================================
     RESTART
  ========================================================= */

  const restartLesson = () => {
    completionHandledRef.current = false;

    setTypedText("");
    setStartTime(null);
    setElapsedTime(0);
    setIsFinished(false);
    setCorrectCharacters(0);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  /* =========================================================
     BACK
  ========================================================= */

  const goBackToLessons = () => {
    window.location.href =
      "/dashboard/steps-pashto";
  };

  /* =========================================================
     NEXT LESSON
  ========================================================= */

  const goToNextLesson = async () => {
    if (!lesson) {
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/lessons`
      );

      if (!response.ok) {
        throw new Error(
          `HTTP Error: ${response.status}`
        );
      }

      const data =
        await response.json();

      const lessons = Array.isArray(data)
        ? data
        : Array.isArray(data.lessons)
        ? data.lessons
        : [];

      if (lessons.length === 0) {
        goBackToLessons();
        return;
      }

      const currentIndex =
        lessons.findIndex(
          (item) =>
            String(item.id) ===
            String(lesson.id)
        );

      if (
        currentIndex >= 0 &&
        currentIndex <
          lessons.length - 1
      ) {
        const nextLesson =
          lessons[currentIndex + 1];

        localStorage.setItem(
          "selectedLessonId",
          String(nextLesson.id)
        );

        window.location.href =
          "/Typeing_Step?lesson=" +
          nextLesson.id;
      } else {
        goBackToLessons();
      }
    } catch (error) {
      console.error(
        "Error fetching next lesson:",
        error
      );

      goBackToLessons();
    }
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (isLoading) {
    return (
      <div
        dir="rtl"
        className="
          min-h-screen
          bg-gray-50
          dark:bg-gray-900
          flex
          items-center
          justify-center
        "
      >
        <div className="text-center">
          <div
            className="
              animate-spin
              rounded-full
              h-14
              w-14
              border-b-4
              border-blue-500
              mx-auto
              mb-5
            "
          />

          <h2
            className="
              text-lg
              font-bold
              text-gray-800
              dark:text-white
            "
          >
            درس بارول کېږي...
          </h2>

          <p
            className="
              text-sm
              text-gray-500
              dark:text-gray-400
              mt-2
            "
          >
            مهرباني وکړئ صبر وکړئ
          </p>
        </div>
      </div>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (error) {
    return (
      <div
        dir="rtl"
        className="
          min-h-screen
          bg-gray-50
          dark:bg-gray-900
          flex
          items-center
          justify-center
          px-5
        "
      >
        <div
          className="
            bg-white
            dark:bg-gray-800
            rounded-2xl
            border
            border-gray-200
            dark:border-gray-700
            p-8
            max-w-md
            w-full
            text-center
            shadow-lg
          "
        >
          <div className="text-5xl mb-5">
            ⚠️
          </div>

          <h2
            className="
              text-xl
              font-bold
              text-red-600
              dark:text-red-400
            "
          >
            ستونزه رامنځته شوه
          </h2>

          <p
            className="
              text-sm
              text-gray-500
              dark:text-gray-400
              mt-3
            "
          >
            {error}
          </p>

          <div className="flex gap-3 justify-center mt-6">
            <button
              onClick={fetchLesson}
              className="
                px-5
                py-2.5
                bg-blue-500
                hover:bg-blue-600
                text-white
                rounded-xl
                font-semibold
              "
            >
              بیا هڅه
            </button>

            <button
              onClick={goBackToLessons}
              className="
                px-5
                py-2.5
                bg-gray-100
                dark:bg-gray-700
                hover:bg-gray-200
                dark:hover:bg-gray-600
                text-gray-700
                dark:text-gray-300
                rounded-xl
                font-semibold
              "
            >
              بېرته
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================
     MAIN UI
  ========================================================= */

  return (
    <div
      dir="rtl"
      className="
        min-h-screen
        bg-gray-50
        dark:bg-gray-900
        text-gray-800
        dark:text-gray-200
      "
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <header
        className="
          bg-white
          dark:bg-gray-800
          border-b
          border-gray-200
          dark:border-gray-700
          shadow-sm
        "
      >
        <div
          className="
            max-w-5xl
            mx-auto
            px-5
            py-4
          "
        >
          <div
            className="
              flex
              flex-col
              md:flex-row
              md:items-center
              md:justify-between
              gap-4
            "
          >
            <button
              onClick={goBackToLessons}
              className="
                px-4
                py-2
                bg-gray-100
                dark:bg-gray-700
                hover:bg-gray-200
                dark:hover:bg-gray-600
                rounded-xl
                text-sm
                font-semibold
                text-gray-600
                dark:text-gray-300
              "
            >
              ← بېرته
            </button>

            <div className="text-center">
              <p
                className="
                  text-xs
                  text-gray-400
                  dark:text-gray-500
                "
              >
                د پښتو ټایپنګ تمرین
              </p>

              <h1
                className="
                  text-2xl
                  font-bold
                  text-gray-800
                  dark:text-white
                  mt-1
                "
              >
                درس {lesson.id}
              </h1>

              <p
                className="
                  text-sm
                  text-blue-500
                  dark:text-blue-400
                  mt-1
                "
              >
                {lesson.title}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main
        className="
          max-w-5xl
          mx-auto
          px-5
          py-8
        "
      >
        {/* ===================================================
            STATISTICS
        =================================================== */}

        <div
          className="
            grid
            grid-cols-2
            md:grid-cols-4
            gap-4
            mb-6
          "
        >
          <div
            className="
              bg-white
              dark:bg-gray-800
              border
              border-gray-200
              dark:border-gray-700
              rounded-2xl
              p-5
              text-center
              shadow-sm
            "
          >
            <span className="block text-2xl mb-2">
              ⏱️
            </span>

            <p
              className="
                text-xs
                text-gray-400
                dark:text-gray-500
              "
            >
              تېر شوی وخت
            </p>

            <strong
              className="
                block
                text-lg
                text-gray-800
                dark:text-white
                mt-1
              "
            >
              {formatTime(elapsedTime)}
            </strong>
          </div>

          <div
            className="
              bg-white
              dark:bg-gray-800
              border
              border-gray-200
              dark:border-gray-700
              rounded-2xl
              p-5
              text-center
              shadow-sm
            "
          >
            <span className="block text-2xl mb-2">
              🎯
            </span>

            <p
              className="
                text-xs
                text-gray-400
                dark:text-gray-500
              "
            >
              دقت
            </p>

            <strong
              className="
                block
                text-lg
                text-green-500
                dark:text-green-400
                mt-1
              "
            >
              {accuracy}%
            </strong>
          </div>

          <div
            className="
              bg-white
              dark:bg-gray-800
              border
              border-gray-200
              dark:border-gray-700
              rounded-2xl
              p-5
              text-center
              shadow-sm
            "
          >
            <span className="block text-2xl mb-2">
              ⚡
            </span>

            <p
              className="
                text-xs
                text-gray-400
                dark:text-gray-500
              "
            >
              سرعت
            </p>

            <strong
              className="
                block
                text-lg
                text-blue-500
                dark:text-blue-400
                mt-1
              "
            >
              {wpm} WPM
            </strong>
          </div>

          <div
            className="
              bg-white
              dark:bg-gray-800
              border
              border-gray-200
              dark:border-gray-700
              rounded-2xl
              p-5
              text-center
              shadow-sm
            "
          >
            <span className="block text-2xl mb-2">
              ⌨️
            </span>

            <p
              className="
                text-xs
                text-gray-400
                dark:text-gray-500
              "
            >
              توري
            </p>

            <strong
              className="
                block
                text-lg
                text-gray-800
                dark:text-white
                mt-1
              "
            >
              {typedText.length}/
              {targetText.length}
            </strong>
          </div>
        </div>

        {/* ===================================================
            PROGRESS
        =================================================== */}

        <div
          className="
            bg-white
            dark:bg-gray-800
            border
            border-gray-200
            dark:border-gray-700
            rounded-2xl
            p-5
            mb-6
            shadow-sm
          "
        >
          <div
            className="
              flex
              justify-between
              items-center
              mb-3
            "
          >
            <span
              className="
                font-semibold
                text-gray-800
                dark:text-white
              "
            >
              د ټایپنګ پرمختګ
            </span>

            <span
              className="
                font-bold
                text-blue-500
                dark:text-blue-400
              "
            >
              {typingProgress}%
            </span>
          </div>

          <div
            className="
              h-3
              bg-gray-100
              dark:bg-gray-700
              rounded-full
              overflow-hidden
            "
          >
            <div
              className={` 
                h-full
                rounded-full
                transition-all
                duration-200
                ${
                  typingProgress === 100
                    ? "bg-green-500"
                    : "bg-blue-500"
                }
              `}
              style={{
                width: `${typingProgress}%`,
              }}
            />
          </div>
        </div>

        {/* ===================================================
            WRITING CARD
        =================================================== */}

        <div
          className="
            bg-white
            dark:bg-gray-800
            border
            border-gray-200
            dark:border-gray-700
            rounded-2xl
            shadow-sm
            p-6
            md:p-8
            mb-6
          "
        >
          {/* Lesson title */}

          <div className="text-center mb-5">
            <h2
              className="
                text-xl
                font-bold
                text-gray-800
                dark:text-white
              "
            >
              {lesson.title}
            </h2>
          </div>

          {/* =================================================
              LESSON TEXT INSIDE WRITING AREA
          ================================================= */}

          <div
            className="
              w-full
              min-h-[180px]
              border
              border-gray-200
              dark:border-gray-700
              bg-gray-50
              dark:bg-gray-900
              rounded-xl
              p-6
              mb-5
            "
          >
            <div
              dir="rtl"
              className="
                text-2xl
                md:text-3xl
                lg:text-4xl
                font-bold
                leading-loose
                text-center
                break-words
              "
            >
              {targetText
                .split("")
                .map((char, index) => {
                  let className =
                    "text-gray-400 dark:text-gray-600";

                  if (
                    index <
                    typedText.length
                  ) {
                    className =
                      typedText[index] ===
                      char
                        ? "text-green-500 dark:text-green-400"
                        : "text-red-500 dark:text-red-400";
                  }

                  if (
                    index ===
                    typedText.length
                  ) {
                    className =
                      "text-blue-500 dark:text-blue-400 underline decoration-2";
                  }

                  return (
                    <span
                      key={index}
                      className={className}
                    >
                      {char === " "
                        ? "\u00A0"
                        : char}
                    </span>
                  );
                })}
            </div>
          </div>

          {/* =================================================
              INPUT BOX
          ================================================= */}

          <textarea
            ref={inputRef}
            value={typedText}
            onChange={handleTyping}
            disabled={isFinished}
            autoFocus
            dir="rtl"
            spellCheck={false}
            placeholder="دلته ټایپ کول پیل کړئ..."
            className="
              w-full
              min-h-[120px]
              resize-none
              border
              border-gray-200
              dark:border-gray-700
              bg-white
              dark:bg-gray-900
              text-gray-800
              dark:text-gray-200
              focus:border-blue-500
              focus:ring-2
              focus:ring-blue-100
              dark:focus:ring-blue-900
              outline-none
              rounded-xl
              p-5
              text-2xl
              leading-loose
              transition-colors
              text-right
            "
          />

          {/* =================================================
              PASHTO KEYBOARD
          ================================================= */}

          {!isFinished && (
            <div
              className="
                mt-6
                pt-6
                border-t
                border-gray-200
                dark:border-gray-700
              "
            >
              {/* Keyboard body */}
              <div
                className="
                  p-4
                  border
                  border-gray-200
                  dark:border-gray-700
                  rounded-2xl
                  bg-gray-100
                  dark:bg-gray-900
                  overflow-x-auto
                "
              >
                {keyboardLayout.map(
                  (row) => (
                    <div
                      key={row.id}
                      className="
                        flex
                        justify-center
                        gap-1.5
                        mb-2
                        min-w-[650px]
                      "
                    >
                      {row.keys.map(
                        (key) => {
                          const active =
                            isKeyActive(
                              key
                            );

                          return (
                            <div
                              key={`${row.id}-${key.en}`}
                              className={`
                                flex
                                items-center
                                justify-center
                                min-w-[42px]
                                h-[50px]
                                flex-1
                                max-w-[65px]
                                rounded-xl
                                border
                                text-sm
                                font-bold
                                select-none
                                transition-all
                                duration-200

                                ${
                                  active
                                    ? `
                                      text-white
                                      border-blue-500
                                      bg-blue-500
                                      shadow-lg
                                      shadow-blue-500/30
                                      -translate-y-1
                                    `
                                    : `
                                      text-gray-600
                                      dark:text-gray-300
                                      border-gray-300
                                      dark:border-gray-600
                                      bg-white
                                      dark:bg-gray-800
                                      shadow-[0_4px_0_rgba(0,0,0,0.12)]
                                    `
                                }

                                ${
                                  active &&
                                  isKeyboardAnimating
                                    ? "scale-105"
                                    : ""
                                }
                              `}
                            >
                              {getKeyDisplay(
                                key
                              )}
                            </div>
                          );
                        }
                      )}
                    </div>
                  )
                )}

                {/* Space */}

                <div
                  className="
                    flex
                    justify-center
                    mt-2
                    min-w-[650px]
                  "
                >
                  <div
                    className={`
                      w-[48%]
                      h-[45px]
                      flex
                      items-center
                      justify-center
                      rounded-xl
                      border
                      font-bold
                      text-sm
                      select-none
                      transition-all
                      duration-200

                      ${
                        isSpaceActive
                          ? `
                            text-white
                            border-blue-500
                            bg-blue-500
                            shadow-lg
                            shadow-blue-500/30
                            -translate-y-1
                          `
                          : `
                            text-gray-500
                            dark:text-gray-400
                            border-gray-300
                            dark:border-gray-600
                            bg-white
                            dark:bg-gray-800
                            shadow-[0_4px_0_rgba(0,0,0,0.12)]
                          `
                      }

                      ${
                        isSpaceActive &&
                        isKeyboardAnimating
                          ? "scale-105"
                          : ""
                      }
                    `}
                  >
                    SPACE
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ===================================================
            FINISHED
        =================================================== */}

        {isFinished && (
          <div
            className="
              bg-white
              dark:bg-gray-800
              border
              border-green-200
              dark:border-green-700
              rounded-2xl
              p-7
              text-center
              shadow-sm
              mb-6
            "
          >
            <div className="text-5xl mb-4">
              🎉
            </div>

            <h2
              className="
                text-2xl
                font-bold
                text-green-600
                dark:text-green-400
              "
            >
              درس مو بشپړ کړ!
            </h2>

            <p
              className="
                text-sm
                text-gray-500
                dark:text-gray-400
                mt-2
              "
            >
              ډېر ښه! تاسو دا درس په بریالیتوب سره بشپړ کړ.
            </p>

            <div
              className="
                flex
                justify-center
                gap-10
                mt-6
                mb-8
              "
            >
              <div>
                <p
                  className="
                    text-2xl
                    font-bold
                    text-blue-500
                    dark:text-blue-400
                  "
                >
                  {wpm}
                </p>

                <p
                  className="
                    text-xs
                    text-gray-400
                    dark:text-gray-500
                  "
                >
                  WPM
                </p>
              </div>

              <div>
                <p
                  className="
                    text-2xl
                    font-bold
                    text-green-500
                    dark:text-green-400
                  "
                >
                  {accuracy}%
                </p>

                <p
                  className="
                    text-xs
                    text-gray-400
                    dark:text-gray-500
                  "
                >
                  دقت
                </p>
              </div>

              <div>
                <p
                  className="
                    text-2xl
                    font-bold
                    text-yellow-500
                    dark:text-yellow-400
                  "
                >
                  +10
                </p>

                <p
                  className="
                    text-xs
                    text-gray-400
                    dark:text-gray-500
                  "
                >
                  نمرې
                </p>
              </div>
            </div>

            <button
              onClick={goToNextLesson}
              className="
                px-8
                py-3
                bg-blue-500
                hover:bg-blue-600
                text-white
                rounded-xl
                font-semibold
                transition-colors
              "
            >
              بل درس ته لاړ شئ ←
            </button>
          </div>
        )}

        {/* ===================================================
            RESTART
        =================================================== */}

        {!isFinished && (
          <div className="flex justify-center">
            <button
              onClick={restartLesson}
              className="
                px-8
                py-3
                bg-gray-100
                dark:bg-gray-700
                hover:bg-gray-200
                dark:hover:bg-gray-600
                text-gray-700
                dark:text-gray-300
                rounded-xl
                font-semibold
                transition-colors
              "
            >
              🔄 بیا پیل
            </button>
          </div>
        )}
      </main>
    </div>
  );
}