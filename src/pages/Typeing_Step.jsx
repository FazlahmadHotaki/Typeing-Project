// Typeing_Step.jsx

import React, {
  useEffect,
  useRef,
  useState,
} from "react";

const API_BASE_URL =
  "https://the-typetone-api.onrender.com";

export default function Typeing_Step() {
  // =========================================================
  // STATE
  // =========================================================

  const [lesson, setLesson] =
    useState(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState(null);

  const [typedText, setTypedText] =
    useState("");

  const [startTime, setStartTime] =
    useState(null);

  const [elapsedTime, setElapsedTime] =
    useState(0);

  const [isFinished, setIsFinished] =
    useState(false);

  const [correctCharacters, setCorrectCharacters] =
    useState(0);

  const [totalCharacters, setTotalCharacters] =
    useState(0);

  // =========================================================
  // PREVENT DUPLICATE COMPLETION
  // =========================================================

  const completionHandledRef =
    useRef(false);

  // =========================================================
  // GET LESSON ID
  // =========================================================

  const getLessonId = () => {
    const params =
      new URLSearchParams(
        window.location.search
      );

    return params.get("lesson");
  };

  const lessonId = getLessonId();

  // =========================================================
  // FETCH LESSON
  // =========================================================

  const fetchLesson = async () => {
    if (!lessonId) {
      setError(
        "د درس ID ونه موندل شو."
      );

      setIsLoading(false);

      return;
    }

    setIsLoading(true);
    setError(null);

    completionHandledRef.current = false;

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
          : Array.isArray(data.lessons)
          ? data.lessons
          : [];

      if (lessons.length === 0) {
        throw new Error(
          "درسونه پیدا نه شول."
        );
      }

      const foundLesson =
        lessons.find(
          (item) =>
            String(item.id) ===
            String(lessonId)
        );

      if (!foundLesson) {
        throw new Error(
          `درس ${lessonId} پیدا نه شو.`
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

  // =========================================================
  // LOAD
  // =========================================================

  useEffect(() => {
    fetchLesson();
  }, [lessonId]);

  // =========================================================
  // TIMER
  // =========================================================

  useEffect(() => {
    if (
      !startTime ||
      isFinished
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
  ]);

  // =========================================================
  // FORMAT TIME
  // =========================================================

  const formatTime = (
    seconds
  ) => {
    const minutes =
      Math.floor(
        seconds / 60
      );

    const remainingSeconds =
      seconds % 60;

    return `${String(
      minutes
    ).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  // =========================================================
  // SAVE COMPLETED LESSON + STATISTICS
  // =========================================================

  const saveCompletedLesson = () => {
    if (!lesson) {
      return;
    }

    try {
      const currentId =
        String(lesson.id);

      // =====================================================
      // 1. SAVE COMPLETED LESSON IDS
      // =====================================================

      let completed = [];

      try {
        const saved =
          JSON.parse(
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
        !completed.includes(
          currentId
        )
      ) {
        completed.push(
          currentId
        );
      }

      localStorage.setItem(
        "completedLessons",
        JSON.stringify(
          completed
        )
      );

      // =====================================================
      // 2. SAVE DETAILED LESSON RESULT
      // =====================================================

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
          !Array.isArray(savedResults)
        ) {
          results =
            savedResults;
        }
      } catch {
        results = {};
      }

      results[currentId] = {
        lessonId:
          lesson.id,

        title:
          lesson.title || "",

        level:
          lesson.level || "",

        type:
          lesson.type || "",

        difficulty:
          lesson.difficulty || "",

        text:
          lesson.text || "",

        completed:
          true,

        progress:
          100,

        typedCharacters:
          typedText.length,

        totalCharacters:
          targetText.length,

        correctCharacters:
          correctCharacters,

        accuracy:
          accuracy,

        wpm:
          wpm,

        elapsedTime:
          elapsedTime,

        score:
          10,

        completedAt:
          new Date().toISOString(),
      };

      localStorage.setItem(
        "lessonResults",
        JSON.stringify(
          results
        )
      );

      // =====================================================
      // 3. SAVE LATEST RESULT SEPARATELY
      // =====================================================

      localStorage.setItem(
        "lastCompletedLesson",
        JSON.stringify(
          results[currentId]
        )
      );

      console.log(
        "LESSON COMPLETED:",
        results[currentId]
      );

      console.log(
        "COMPLETED LESSONS:",
        completed
      );

    } catch (error) {
      console.error(
        "Could not save lesson result:",
        error
      );
    }
  };

  // =========================================================
  // AUTOMATIC COMPLETION
  //
  // THIS IS THE IMPORTANT PART
  // =========================================================

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

    // Save after React has updated:
    // typedText
    // accuracy
    // WPM
    // elapsedTime

    saveCompletedLesson();

    // Give the browser a short moment to
    // process localStorage before navigation.

    const redirectTimer =
      setTimeout(() => {
        window.location.href =
          "/dashboard/steps-pashto";
      }, 500);

    return () => {
      clearTimeout(
        redirectTimer
      );
    };

  }, [
    isFinished,
    lesson,
    typedText,
    elapsedTime,
    correctCharacters,
  ]);

  // =========================================================
  // HANDLE TYPING
  // =========================================================

  const handleTyping = (
    event
  ) => {
    if (
      !lesson ||
      isFinished ||
      completionHandledRef.current
    ) {
      return;
    }

    const value =
      event.target.value;

    const target =
      lesson.text || "";

    // =======================================================
    // START TIMER
    // =======================================================

    if (
      value.length === 1 &&
      !startTime
    ) {
      const now =
        Date.now();

      setStartTime(now);
    }

    // =======================================================
    // SAVE TYPED TEXT
    // =======================================================

    setTypedText(value);

    // =======================================================
    // CALCULATE CORRECT CHARACTERS
    // =======================================================

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

    // =======================================================
    // 100% COMPLETE
    // =======================================================

    if (
      value === target &&
      target.length > 0
    ) {
      let finalStartTime =
        startTime;

      if (!finalStartTime) {
        finalStartTime =
          Date.now();

        setStartTime(
          finalStartTime
        );
      }

      const finishTime =
        Date.now();

      const finalElapsedTime =
        Math.floor(
          (finishTime -
            finalStartTime) /
            1000
        );

      // Update final time BEFORE finishing.
      setElapsedTime(
        finalElapsedTime
      );

      // Mark lesson finished.
      //
      // The useEffect above will now:
      // 1. Read the updated React state
      // 2. Save everything
      // 3. Redirect
      setIsFinished(true);
    }
  };

  // =========================================================
  // PROGRESS
  // =========================================================

  const targetText =
    lesson?.text || "";

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

  // =========================================================
  // ACCURACY
  // =========================================================

  const accuracy =
    typedText.length > 0
      ? Math.round(
          (correctCharacters /
            typedText.length) *
            100
        )
      : 100;

  // =========================================================
  // WPM
  // =========================================================

  const wordsTyped =
    typedText.trim().length > 0
      ? typedText
          .trim()
          .split(/\s+/)
          .length
      : 0;

  const minutes =
    elapsedTime / 60;

  const wpm =
    minutes > 0
      ? Math.round(
          wordsTyped /
            minutes
        )
      : 0;

  // =========================================================
  // RESTART
  // =========================================================

  const restartLesson = () => {
    completionHandledRef.current =
      false;

    setTypedText("");
    setStartTime(null);
    setElapsedTime(0);
    setIsFinished(false);
    setCorrectCharacters(0);
  };

  // =========================================================
  // BACK
  // =========================================================

  const goBackToLessons = () => {
    window.location.href =
      "/dashboard/steps-pashto";
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (isLoading) {
    return (
      <div
        dir="rtl"
        className="min-h-screen bg-[#f5f7fa] flex items-center justify-center"
      >
        <div className="text-center">
          <div
            className="
              animate-spin
              rounded-full
              h-14
              w-14
              border-b-4
              border-[#3498db]
              mx-auto
              mb-5
            "
          />

          <h2 className="text-lg font-bold text-[#34495e]">
            درس بارول کېږي...
          </h2>

          <p className="text-sm text-gray-400 mt-2">
            مهرباني وکړئ صبر وکړئ
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error) {
    return (
      <div
        dir="rtl"
        className="min-h-screen bg-[#f5f7fa] flex items-center justify-center px-5"
      >
        <div className="bg-white rounded-2xl border border-gray-200 p-8 max-w-md w-full text-center">
          <div className="text-5xl mb-5">
            ⚠️
          </div>

          <h2 className="text-xl font-bold text-red-600">
            ستونزه رامنځته شوه
          </h2>

          <p className="text-sm text-gray-500 mt-3">
            {error}
          </p>

          <div className="flex gap-3 justify-center mt-6">
            <button
              onClick={
                fetchLesson
              }
              className="px-5 py-2.5 bg-[#3498db] text-white rounded-xl font-semibold"
            >
              بیا هڅه
            </button>

            <button
              onClick={
                goBackToLessons
              }
              className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-semibold"
            >
              بېرته
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // MAIN
  // =========================================================

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#f5f7fa] text-gray-700"
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-5 py-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <button
              onClick={
                goBackToLessons
              }
              className="self-start px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-semibold text-gray-600"
            >
              ← بېرته درسونو ته
            </button>

            <div className="text-center md:text-right">
              <p className="text-xs text-gray-400">
                د پښتو ټایپنګ تمرین
              </p>

              <h1 className="text-2xl font-bold text-[#34495e] mt-1">
                درس {lesson.id}
              </h1>

              <p className="text-sm text-[#3498db] mt-1">
                {lesson.title}
              </p>
            </div>

          </div>
        </div>
      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="max-w-5xl mx-auto px-5 py-8">

        {/* ===================================================
            LESSON INFO
        =================================================== */}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">

          <div className="info-card">
            <p>کچه</p>

            <strong>
              {lesson.level || "-"}
            </strong>
          </div>

          <div className="info-card">
            <p>ډول</p>

            <strong>
              {lesson.type || "-"}
            </strong>
          </div>

          <div className="info-card">
            <p>ستونزمنتیا</p>

            <strong>
              {lesson.difficulty || "-"}
            </strong>
          </div>

          <div className="info-card">
            <p>وخت</p>

            <strong className="text-[#3498db]">
              {formatTime(
                elapsedTime
              )}
            </strong>
          </div>

        </div>

        {/* ===================================================
            PROGRESS
        =================================================== */}

        <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-6">

          <div className="flex justify-between items-center mb-3">

            <span className="font-semibold text-[#34495e]">
              د ټایپنګ پرمختګ
            </span>

            <span className="font-bold text-[#3498db]">
              {typingProgress}%
            </span>

          </div>

          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">

            <div
              className="h-full bg-[#3498db] rounded-full transition-all duration-200"
              style={{
                width: `${typingProgress}%`,
              }}
            />

          </div>

        </div>

        {/* ===================================================
            TARGET TEXT
        =================================================== */}

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-8 mb-6">

          <div className="text-center mb-5">

            <p className="text-xs text-gray-400 mb-2">
              د تمرین متن
            </p>

            <h2 className="text-xl font-bold text-[#34495e]">
              {lesson.title}
            </h2>

          </div>

          <div className="bg-[#f8fafc] border border-gray-100 rounded-xl p-6 md:p-8 mb-6 text-center">

            <div className="text-2xl md:text-3xl lg:text-4xl font-bold leading-loose break-words">

              {targetText
                .split("")
                .map(
                  (
                    char,
                    index
                  ) => {

                    let className =
                      "text-gray-400";

                    if (
                      index <
                      typedText.length
                    ) {
                      className =
                        typedText[
                          index
                        ] === char
                          ? "text-[#2ecc71]"
                          : "text-red-500";
                    }

                    if (
                      index ===
                      typedText.length
                    ) {
                      className =
                        "text-[#3498db] underline decoration-2";
                    }

                    return (
                      <span
                        key={index}
                        className={
                          className
                        }
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

          <textarea
            value={typedText}
            onChange={
              handleTyping
            }
            disabled={isFinished}
            autoFocus
            dir="rtl"
            spellCheck={false}
            placeholder="دلته د پورته متن ټایپ کول پیل کړئ..."
            className="
              w-full
              min-h-[150px]
              resize-none
              border
              border-gray-200
              focus:border-[#3498db]
              focus:ring-2
              focus:ring-blue-100
              outline-none
              rounded-xl
              p-5
              text-xl
              leading-loose
              text-[#34495e]
            "
          />

        </div>

        {/* ===================================================
            STATISTICS
        =================================================== */}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">

          <div className="stat-box">
            <span>⏱️</span>

            <p>وخت</p>

            <strong>
              {formatTime(
                elapsedTime
              )}
            </strong>
          </div>

          <div className="stat-box">
            <span>🎯</span>

            <p>دقت</p>

            <strong className="text-[#2ecc71]">
              {accuracy}%
            </strong>
          </div>

          <div className="stat-box">
            <span>⚡</span>

            <p>سرعت</p>

            <strong className="text-[#3498db]">
              {wpm} WPM
            </strong>
          </div>

          <div className="stat-box">
            <span>⌨️</span>

            <p>توري</p>

            <strong>
              {typedText.length}/
              {targetText.length}
            </strong>
          </div>

        </div>

        {/* ===================================================
            FINISHED
        =================================================== */}

        {isFinished && (
          <div className="bg-white border border-green-200 rounded-2xl p-7 text-center shadow-sm mb-6">

            <div className="text-5xl mb-4">
              🎉
            </div>

            <h2 className="text-2xl font-bold text-[#2ecc71]">
              درس مو بشپړ کړ!
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              ډېر ښه! تاسو دا درس په بریالیتوب سره بشپړ کړ.
            </p>

            <div className="flex justify-center gap-10 mt-6">

              <div>
                <p className="text-2xl font-bold text-[#3498db]">
                  {wpm}
                </p>

                <p className="text-xs text-gray-400">
                  WPM
                </p>
              </div>

              <div>
                <p className="text-2xl font-bold text-[#2ecc71]">
                  {accuracy}%
                </p>

                <p className="text-xs text-gray-400">
                  دقت
                </p>
              </div>

              <div>
                <p className="text-2xl font-bold text-[#f1c40f]">
                  +10
                </p>

                <p className="text-xs text-gray-400">
                  نمرې
                </p>
              </div>

            </div>

          </div>
        )}

        {/* ===================================================
            BUTTONS
        =================================================== */}

        <div className="flex flex-col sm:flex-row justify-center gap-4">

          <button
            onClick={
              restartLesson
            }
            className="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-[#34495e] rounded-xl font-semibold"
          >
            🔄 بیا پیل
          </button>

        </div>

      </main>

      <style>{`

        .info-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 13px;
          padding: 16px;
          text-align: center;
        }

        .info-card p {
          margin: 0;
          color: #94a3b8;
          font-size: 11px;
        }

        .info-card strong {
          display: block;
          margin-top: 5px;
          color: #34495e;
          font-size: 15px;
        }

        .stat-box {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          padding: 18px;
          text-align: center;
        }

        .stat-box span {
          display: block;
          font-size: 24px;
          margin-bottom: 7px;
        }

        .stat-box p {
          margin: 0;
          color: #94a3b8;
          font-size: 11px;
        }

        .stat-box strong {
          display: block;
          margin-top: 4px;
          font-size: 19px;
          color: #34495e;
        }

      `}</style>

    </div>
  );
}