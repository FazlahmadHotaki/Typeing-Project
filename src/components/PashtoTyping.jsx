// HomeRowSteps.jsx

import React, { useState, useEffect } from "react";

// ==========================================
// API CONFIGURATION
// ==========================================

const API_BASE_URL =
  "https://the-typetone-api.onrender.com";

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function HomeRowSteps() {
  const [selectedId, setSelectedId] = useState(1);

  const [showLockMessage, setShowLockMessage] =
    useState(false);

  const [lockedLessonId, setLockedLessonId] =
    useState(null);

  // ==========================================
  // API STATE
  // ==========================================

  const [lessons, setLessons] =
    useState([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [apiError, setApiError] =
    useState(null);

  // ==========================================
  // COMPLETED LESSONS
  // ==========================================

  const [completedLessonIds, setCompletedLessonIds] =
    useState([]);

  // ==========================================
  // LESSON RESULTS
  // ==========================================

  const [lessonResults, setLessonResults] =
    useState({});

  // ==========================================
  // LOAD COMPLETED LESSONS + RESULTS
  // ==========================================

  const loadCompletedLessons = () => {
    try {
      // ========================================
      // LOAD COMPLETED LESSONS
      // ========================================

      const saved =
        JSON.parse(
          localStorage.getItem(
            "completedLessons"
          ) || "[]"
        );

      if (Array.isArray(saved)) {
        setCompletedLessonIds(
          saved.map((id) =>
            String(id)
          )
        );
      } else {
        setCompletedLessonIds([]);
      }

      // ========================================
      // LOAD LESSON RESULTS
      // ========================================

      const savedResults =
        JSON.parse(
          localStorage.getItem(
            "lessonResults"
          ) || "{}"
        );

      if (
        savedResults &&
        typeof savedResults === "object" &&
        !Array.isArray(savedResults)
      ) {
        setLessonResults(
          savedResults
        );
      } else {
        setLessonResults({});
      }
    } catch (error) {
      console.error(
        "Error loading completed lessons:",
        error
      );

      setCompletedLessonIds([]);
      setLessonResults({});
    }
  };

  // ==========================================
  // LOAD SAVED COMPLETION
  // ==========================================

  useEffect(() => {
    loadCompletedLessons();

    const handleFocus = () => {
      loadCompletedLessons();
    };

    const handleStorage = () => {
      loadCompletedLessons();
    };

    window.addEventListener(
      "focus",
      handleFocus
    );

    window.addEventListener(
      "storage",
      handleStorage
    );

    return () => {
      window.removeEventListener(
        "focus",
        handleFocus
      );

      window.removeEventListener(
        "storage",
        handleStorage
      );
    };
  }, []);

  // ==========================================
  // PROGRESS
  // ==========================================

  const completedLessons =
    completedLessonIds.length;

  const progress =
    lessons.length > 0
      ? Math.min(
          100,
          Math.round(
            (completedLessons /
              lessons.length) *
              100
          )
        )
      : 0;

  const remainingLessons =
    Math.max(
      0,
      lessons.length -
        completedLessons
    );

  const totalScore =
    completedLessons * 10;

  const stars =
    Math.floor(
      completedLessons / 10
    );

  // ==========================================
  // FETCH LESSONS
  // ==========================================

  useEffect(() => {
    fetchAllLessons();
  }, []);

  // ==========================================
  // FETCH ALL LESSONS
  // ==========================================

  const fetchAllLessons = async () => {
    setIsLoading(true);
    setApiError(null);

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

      // ========================================
      // SUPPORT API RESPONSE
      // ========================================

      const apiLessons =
        Array.isArray(data)
          ? data
          : data &&
            Array.isArray(
              data.lessons
            )
          ? data.lessons
          : [];

      if (
        apiLessons.length > 0
      ) {
        const formattedLessons =
          apiLessons.map(
            (lesson, index) => ({
              id: index + 1,

              apiId:
                lesson.id,

              title:
                lesson.title,

              subtitle:
                getLessonSubtitle(
                  lesson
                ),

              text:
                lesson.text || "",

              type:
                lesson.type,

              level:
                lesson.level,

              difficulty:
                lesson.difficulty,
            })
          );

        setLessons(
          formattedLessons
        );

        console.log(
          `Total lessons loaded: ${formattedLessons.length}`
        );
      } else {
        throw new Error(
          "No lessons found in API response"
        );
      }
    } catch (error) {
      console.error(
        "Error fetching lessons:",
        error
      );

      setApiError(
        error.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ==========================================
  // SET CURRENT LESSON
  // FIRST INCOMPLETE LESSON
  // ==========================================

  useEffect(() => {
    if (
      lessons.length === 0
    ) {
      return;
    }

    const nextLesson =
      lessons.find(
        (lesson) =>
          !completedLessonIds.includes(
            String(lesson.apiId)
          )
      );

    if (nextLesson) {
      setSelectedId(
        nextLesson.id
      );
    } else {
      // All lessons completed
      setSelectedId(
        lessons.length
      );
    }
  }, [
    lessons,
    completedLessonIds,
  ]);

  // ==========================================
  // LESSON SUBTITLE
  // ==========================================

  const getLessonSubtitle = (
    lesson
  ) => {
    if (!lesson.text) {
      return "";
    }

    if (
      lesson.type ===
      "letter"
    ) {
      const uniqueChars = [
        ...new Set(
          lesson.text.replace(
            /\s/g,
            ""
          )
        ),
      ];

      return `توري: ${uniqueChars.join(
        "، "
      )}`;
    }

    if (
      lesson.type ===
      "combination"
    ) {
      const words =
        lesson.text
          .trim()
          .split(/\s+/)
          .slice(0, 3);

      return words.join(" ");
    }

    const words =
      lesson.text
        .trim()
        .split(/\s+/)
        .slice(0, 5);

    return words.length > 0
      ? words.join(" ") + "..."
      : "";
  };

  // ==========================================
  // CHECK LESSON COMPLETION
  // ==========================================

  const isLessonCompleted = (
    lesson
  ) => {
    if (!lesson) {
      return false;
    }

    return completedLessonIds.includes(
      String(lesson.apiId)
    );
  };

  // ==========================================
  // GET LESSON RESULT
  // ==========================================

  const getLessonResult = (
    lesson
  ) => {
    if (!lesson) {
      return null;
    }

    return (
      lessonResults[
        String(lesson.apiId)
      ] || null
    );
  };

  // ==========================================
  // CHECK LESSON LOCK
  // ==========================================

  const isLessonLocked = (
    lessonNumber
  ) => {
    // First lesson is always unlocked
    if (
      lessonNumber === 1
    ) {
      return false;
    }

    const previousLesson =
      lessons[
        lessonNumber - 2
      ];

    if (!previousLesson) {
      return true;
    }

    return !completedLessonIds.includes(
      String(
        previousLesson.apiId
      )
    );
  };

  // ==========================================
  // LOCKED LESSON
  // ==========================================

  const handleLockedLessonClick = (
    lessonId
  ) => {
    setLockedLessonId(
      lessonId
    );

    setShowLockMessage(
      true
    );

    setTimeout(() => {
      setShowLockMessage(
        false
      );

      setLockedLessonId(
        null
      );
    }, 3000);
  };

  // ==========================================
  // START LESSON
  // ==========================================

  const handleStartLesson = (
    lesson
  ) => {
    if (!lesson) {
      return;
    }

    if (
      isLessonLocked(
        lesson.id
      )
    ) {
      handleLockedLessonClick(
        lesson.id
      );

      return;
    }

    setSelectedId(
      lesson.id
    );

    window.location.href =
      `/Typeing_Step?lesson=${
        lesson.apiId ||
        lesson.id
      }`;
  };

  // ==========================================
  // LESSON CLICK
  // ==========================================

  const handleLessonClick = (
    lessonNumber
  ) => {
    const lesson =
      lessons[
        lessonNumber - 1
      ];

    if (!lesson) {
      return;
    }

    // ========================================
    // CHECK LOCK
    // ========================================

    if (
      isLessonLocked(
        lessonNumber
      )
    ) {
      handleLockedLessonClick(
        lessonNumber
      );

      return;
    }

    setSelectedId(
      lessonNumber
    );

    window.location.href =
      `/Typeing_Step?lesson=${
        lesson.apiId ||
        lesson.id
      }`;
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (isLoading){
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#0A1424] z-50">
        <div className="loader">
          <svg
            className="container"
            width="100"
            height="100"
            viewBox="0 0 64 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="2"
              y="2"
              width="60"
              height="36"
              rx="4"
              ry="4"
              pathLength="100"
              className="track"
              stroke="#C9A15E"
              strokeWidth="2"
            ></rect>

            <rect
              x="2"
              y="2"
              width="60"
              height="36"
              rx="4"
              ry="4"
              pathLength="100"
              className="car"
              stroke="#C9A15E"
              strokeWidth="2"
              strokeDasharray="100"
              strokeDashoffset="94"
            ></rect>

            <g className="keys" fill="#C9A15E">
              <rect x="8" y="8" width="6" height="5" rx="1"></rect>
              <rect x="16" y="8" width="6" height="5" rx="1"></rect>
              <rect x="24" y="8" width="6" height="5" rx="1"></rect>
              <rect x="32" y="8" width="6" height="5" rx="1"></rect>
              <rect x="40" y="8" width="6" height="5" rx="1"></rect>
              <rect x="48" y="8" width="8" height="5" rx="1"></rect>

              <rect x="8" y="16" width="6" height="5" rx="1"></rect>
              <rect x="16" y="16" width="6" height="5" rx="1"></rect>
              <rect x="24" y="16" width="6" height="5" rx="1"></rect>
              <rect x="32" y="16" width="6" height="5" rx="1"></rect>
              <rect x="40" y="16" width="6" height="5" rx="1"></rect>
              <rect x="48" y="16" width="8" height="5" rx="1"></rect>

              <rect x="8" y="24" width="8" height="5" rx="1"></rect>
              <rect x="18" y="24" width="6" height="5" rx="1"></rect>
              <rect x="26" y="24" width="18" height="5" rx="1"></rect>
              <rect x="46" y="24" width="10" height="5" rx="1"></rect>
            </g>
          </svg>
        </div>
        <p id="loadingText" className="text-xl font-semibold text-gold leading-tight mt-4">
          <span className="dots"></span> بارېږي
        </p>
        <p className="text-sm text-slateink leading-relaxed mt-1">
         ... مهرباني وکړئ انتظار وکړئ، موږ ستاسو مینځپانګه چمتو کوو
        </p>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (
    apiError &&
    lessons.length === 0
  ) {
    return (
      <div
        className="
          min-h-screen
          bg-[#f5f7fa]
          flex
          items-center
          justify-center
        "
        dir="rtl"
      >
        <div
          className="
            text-center
            bg-white
            p-8
            rounded-xl
            shadow-sm
          "
        >

          <div className="text-4xl mb-4">
            ⚠️
          </div>

          <p
            className="
              text-lg
              font-semibold
              text-red-600
              mb-2
            "
          >
            د API سره ستونزه
          </p>

          <p
            className="
              text-sm
              text-gray-500
              mb-4
            "
          >
            {apiError}
          </p>

          <button
            onClick={
              fetchAllLessons
            }
            className="
              px-6
              py-2
              bg-[#3498db]
              text-white
              rounded-md
              hover:bg-[#2980b9]
              transition-colors
            "
          >
            بیا هڅه وکړئ
          </button>

        </div>
      </div>
    );
  }

  // ==========================================
  // GROUP LESSONS
  // ==========================================

  const lessonsPerRow = 5;
  const rows = [];

  for (
    let i = 0;
    i < lessons.length;
    i += lessonsPerRow
  ) {
    rows.push(
      lessons.slice(
        i,
        i + lessonsPerRow
      )
    );
  }

  // ==========================================
  // GRAPH DATA
  // ==========================================

  const graphData = [
    10,
    20,
    30,
    40,
    50,
    60,
    70,
    80,
  ];

  // ==========================================
  // CURRENT LEVEL
  // ==========================================

  const getCurrentLevel = () => {
    if (
      completedLessons < 20
    ) {
      return "پیل کونکی";
    }

    if (
      completedLessons < 50
    ) {
      return "منځنۍ کچه";
    }

    if (
      completedLessons < 100
    ) {
      return "پرمختللی";
    }

    return "ماهر";
  };

  // ==========================================
  // NEXT GOAL
  // ==========================================

  const getNextGoal = () => {
    if (
      lessons.length === 0
    ) {
      return 0;
    }

    const next =
      Math.ceil(
        (selectedId + 1) /
          10
      ) * 10;

    return Math.min(
      lessons.length,
      next
    );
  };

  // ==========================================
  // RETURN
  // ==========================================

  return (
    <div
      className="
        min-h-screen
        bg-[#f5f7fa]
        text-gray-700
      "
      dir="rtl"
    >

      {/* =====================================
          LOCK MESSAGE
      ===================================== */}

      {showLockMessage && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
          "
        >

          <div
            className="
              absolute
              inset-0
              bg-black
              bg-opacity-50
            "
            onClick={() =>
              setShowLockMessage(
                false
              )
            }
          />

          <div
            className="
              relative
              bg-white
              rounded-xl
              shadow-xl
              p-6
              max-w-sm
              w-full
              mx-4
              animate-bounce-in
            "
          >

            <div className="text-center">

              <div className="text-4xl mb-4">
                🔒
              </div>

              <h3
                className="
                  text-lg
                  font-bold
                  text-[#34495e]
                  mb-2
                "
              >
                دا درس تړل شوی دی
              </h3>

              <p
                className="
                  text-sm
                  text-gray-500
                  mb-4
                "
              >
                درس {lockedLessonId} لا تر اوسه
                تړلی دی. مهرباني وکړئ لومړی
                مخکني درسونه بشپړ کړئ.
              </p>

              <button
                onClick={() =>
                  setShowLockMessage(
                    false
                  )
                }
                className="
                  px-6
                  py-2
                  bg-[#3498db]
                  text-white
                  rounded-md
                  hover:bg-[#2980b9]
                  transition-colors
                "
              >
                ښه
              </button>

            </div>

          </div>

        </div>
      )}

      {/* =====================================
          HEADER
      ===================================== */}

      <header
        className="
          bg-white
          border-b
          border-gray-200
        "
      >

        <div
          className="
            max-w-6xl
            mx-auto
            px-5
            py-5
          "
        >

          <div
            className="
              flex
              flex-col
              md:flex-row
              md:items-center
              md:justify-between
              gap-5
            "
          >

            {/* TITLE */}

            <div>

              <h1
                className="
                  text-2xl
                  font-semibold
                  text-[#34495e]
                "
              >
                د پښتو ټایپنګ زده کړه
              </h1>

              <p
                className="
                  text-sm
                  text-gray-500
                  mt-1
                "
              >
                ټول درسونه: {lessons.length}
              </p>

            </div>


            {/* STATISTICS */}

            <div
              className="
                flex
                items-center
                gap-6
              "
            >

              {/* PROGRESS */}

              <div className="text-center">

                <div
                  className="
                    text-lg
                    font-semibold
                    text-[#3498db]
                  "
                >
                  {progress}%
                </div>

                <div
                  className="
                    text-xs
                    text-gray-400
                  "
                >
                  پرمختګ
                </div>

              </div>


              <div
                className="
                  h-8
                  w-px
                  bg-gray-200
                "
              />


              {/* STARS */}

              <div className="text-center">

                <div
                  className="
                    text-lg
                    font-semibold
                    text-[#f1c40f]
                  "
                >
                  ⭐ {stars}
                </div>

                <div
                  className="
                    text-xs
                    text-gray-400
                  "
                >
                  ستوري
                </div>

              </div>


              <div
                className="
                  h-8
                  w-px
                  bg-gray-200
                "
              />


              {/* SCORE */}

              <div className="text-center">

                <div
                  className="
                    text-lg
                    font-semibold
                    text-[#2ecc71]
                  "
                >
                  {totalScore}
                </div>

                <div
                  className="
                    text-xs
                    text-gray-400
                  "
                >
                  نمرې
                </div>

              </div>

            </div>

          </div>


          {/* PROGRESS BAR */}

          <div className="mt-5">

            <div
              className="
                h-2
                bg-gray-200
                rounded-full
                overflow-hidden
              "
            >

              <div
                className="
                  h-full
                  bg-[#2ecc71]
                  transition-all
                  duration-500
                "
                style={{
                  width: `${progress}%`,
                }}
              />

            </div>

          </div>

        </div>

      </header>


      {/* =====================================
          MAIN
      ===================================== */}

      <main
        className="
          max-w-6xl
          mx-auto
          px-5
          py-10
        "
      >

        {/* =====================================
            SECTION TITLE
        ===================================== */}

        <div
          className="
            text-center
            mb-12
          "
        >

          <h2
            className="
              text-xl
              font-semibold
              text-[#34495e]
            "
          >
            د پښتو ټایپنګ ټول درسونه
          </h2>

          <p
            className="
              text-sm
              text-gray-400
              mt-2
            "
          >
            له ۱ څخه تر {lessons.length} پورې درسونه
          </p>

        </div>


        {/* =====================================
            LESSON PATH
        ===================================== */}

        <div
          className="
            relative
            max-w-5xl
            mx-auto
          "
        >

          <div
            className="
              space-y-16
              md:space-y-20
            "
          >

            {rows.map(
              (
                row,
                rowIndex
              ) => {

                const rowStartIndex =
                  rowIndex *
                  lessonsPerRow;

                return (
                  <div
                    key={
                      rowIndex
                    }
                    className="relative"
                  >

                    <div
                      className="
                        grid
                        grid-cols-5
                        gap-6
                        md:gap-6
                        lg:gap-14
                      "
                      dir="rtl"
                    >

                      {row.map(
                        (
                          lesson,
                          colIndex
                        ) => {

                          const lessonNumber =
                            rowStartIndex +
                            colIndex +
                            1;

                          // =================================
                          // SAVED COMPLETION
                          // =================================

                          const isCompleted =
                            isLessonCompleted(
                              lesson
                            );

                          // =================================
                          // CURRENT LESSON
                          // =================================

                          const isCurrent =
                            lessonNumber ===
                            selectedId &&
                            !isCompleted;

                          // =================================
                          // LOCK
                          // =================================

                          const isLocked =
                            isLessonLocked(
                              lessonNumber
                            );

                          const hasNextLesson =
                            colIndex <
                            row.length -
                              1;

                          return (
                            <div
                              key={
                                lesson.apiId ||
                                colIndex
                              }
                              className="
                                relative
                                flex
                                flex-col
                                items-center
                              "
                            >

                              {/* CONNECTOR */}

                              {hasNextLesson && (
                                <div
                                  className={` 
                                    absolute
                                    z-0

                                    top-[30px]
                                    sm:top-[37px]
                                    md:top-[45px]
                                    lg:top-[50px]

                                    right-[50%]

                                    w-[calc(100%+1.5rem)]
                                    lg:w-[calc(100%+3.5rem)]

                                    h-[5px]

                                    rounded-full

                                    hidden
                                    md:block

                                    transition-all
                                    duration-500

                                    ${
                                      isCompleted
                                        ? "bg-[#2ecc71]"
                                        : "bg-[#dfe6e9]"
                                    }
                                  `}
                                />
                              )}


                              {/* LESSON CIRCLE */}

                              <button
                                onClick={() => {

                                  if (
                                    isLocked
                                  ) {

                                    handleLockedLessonClick(
                                      lessonNumber
                                    );

                                  } else {

                                    handleLessonClick(
                                      lessonNumber
                                    );

                                  }

                                }}
                                className={` 
                                  relative 
                                  z-10 

                                  w-[60px] 
                                  h-[60px] 

                                  sm:w-[75px] 
                                  sm:h-[75px] 

                                  md:w-[90px] 
                                  md:h-[90px] 

                                  lg:w-[100px] 
                                  lg:h-[100px] 

                                  rounded-full 

                                  flex 
                                  items-center 
                                  justify-center 

                                  transition-all 
                                  duration-200 

                                  border-[4px] 

                                  shadow-sm 

                                  ${
                                    isCompleted
                                      ? ` 
                                        bg-[#2ecc71] 
                                        border-[#27ae60] 
                                        text-white 
                                        hover:scale-105 
                                        hover:shadow-md 
                                        cursor-pointer 
                                      `
                                      : isCurrent
                                      ? ` 
                                        bg-[#3498db] 
                                        border-[#2980b9] 
                                        text-white 
                                        scale-110 
                                        shadow-lg 
                                        shadow-blue-200 
                                        cursor-pointer 
                                      `
                                      : isLocked
                                      ? ` 
                                        bg-[#ecf0f1] 
                                        border-[#d5dadd] 
                                        text-[#95a5a6] 
                                        cursor-not-allowed 
                                      `
                                      : ` 
                                        bg-[#ecf0f1] 
                                        border-[#d5dadd] 
                                        text-[#95a5a6] 
                                        cursor-pointer 
                                      `
                                  } 
                                `}
                              >

                                {isCompleted ? (

                                  <svg
                                    className="
                                      w-7
                                      h-7
                                      md:w-9
                                      md:h-9
                                      lg:w-10
                                      lg:h-10
                                    "
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    viewBox="0 0 24 24"
                                  >

                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="
                                        M5 13l4 4L19 7
                                      "
                                    />

                                  </svg>

                                ) : (

                                  <span
                                    className="
                                      text-lg
                                      md:text-xl
                                      lg:text-2xl
                                      font-bold
                                    "
                                  >
                                    {lessonNumber}
                                  </span>

                                )}

                                {/* CURRENT */}

                                {isCurrent && (
                                  <span
                                    className="
                                      absolute
                                      -top-3
                                      bg-[#3498db]
                                      text-white
                                      text-[8px]
                                      md:text-[9px]
                                      lg:text-[10px]
                                      font-bold
                                      px-2
                                      md:px-2.5
                                      py-0.5
                                      rounded-full
                                      shadow-sm
                                      whitespace-nowrap
                                    "
                                  >
                                    اوسنی
                                  </span>
                                )}

                              </button>


                              {/* LESSON INFORMATION */}

                              <div
                                className="
                                  text-center
                                  mt-3
                                  px-1
                                  max-w-[80px]
                                  md:max-w-[100px]
                                  lg:max-w-[120px]
                                "
                              >

                                <h3
                                  className={` 
                                    text-[10px]
                                    md:text-[13px]
                                    lg:text-[15px]

                                    font-semibold
                                    leading-tight

                                    truncate

                                    ${
                                      isCurrent
                                        ? "text-[#2980b9]"
                                        : isCompleted
                                        ? "text-[#34495e]"
                                        : "text-gray-400"
                                    }
                                  `}
                                >
                                  درس {lessonNumber}
                                </h3>

                                <p
                                  className={` 
                                    text-[9px]
                                    md:text-[11px]
                                    lg:text-[13px]

                                    mt-1

                                    truncate

                                    ${
                                      isCurrent
                                        ? "text-[#3498db]"
                                        : "text-gray-400"
                                    }
                                  `}
                                  title={
                                    lesson.subtitle
                                  }
                                >
                                  {lesson.subtitle}
                                </p>

                              </div>

                            </div>
                          );
                        }
                      )}

                    </div>

                  </div>
                );
              }
            )}

          </div>

        </div>


        {/* ==========================================
            LEARNING DASHBOARD
        ========================================== */}

        <section
          className="
            max-w-6xl
            mx-auto
            mt-20
          "
        >

          {/* DASHBOARD HEADER */}

          <div
            className="
              text-center
              mb-10
            "
          >

            <h2
              className="
                text-2xl
                font-bold
                text-[#34495e]
              "
            >
              📊 د زده کړې پرمختګ
            </h2>

            <p
              className="
                text-sm
                text-gray-400
                mt-2
              "
            >
              ستاسو د پښتو ټایپنګ د زده کړې عمومي وضعیت
            </p>

          </div>


          {/* ==========================================
              STAT CARDS
          ========================================== */}

          <div
            className="
              grid
              grid-cols-2
              md:grid-cols-4
              gap-4
              mb-8
            "
          >

            {/* COMPLETED */}

            <div
              className="
                bg-white
                border
                border-gray-200
                rounded-2xl
                p-5
                shadow-sm
                hover:shadow-md
                transition
              "
            >

              <div
                className="
                  w-11
                  h-11
                  rounded-xl
                  bg-green-100
                  flex
                  items-center
                  justify-center
                  text-xl
                  mb-4
                "
              >
                ✓
              </div>

              <p
                className="
                  text-xs
                  text-gray-400
                "
              >
                بشپړ شوي درسونه
              </p>

              <h3
                className="
                  text-2xl
                  font-bold
                  text-[#2ecc71]
                  mt-1
                "
              >
                {completedLessons}
              </h3>

              <p
                className="
                  text-xs
                  text-gray-400
                  mt-1
                "
              >
                له {lessons.length} درسونو څخه
              </p>

            </div>


            {/* REMAINING */}

            <div
              className="
                bg-white
                border
                border-gray-200
                rounded-2xl
                p-5
                shadow-sm
                hover:shadow-md
                transition
              "
            >

              <div
                className="
                  w-11
                  h-11
                  rounded-xl
                  bg-blue-100
                  flex
                  items-center
                  justify-center
                  text-xl
                  mb-4
                "
              >
                📚
              </div>

              <p
                className="
                  text-xs
                  text-gray-400
                "
              >
                پاتې درسونه
              </p>

              <h3
                className="
                  text-2xl
                  font-bold
                  text-[#3498db]
                  mt-1
                "
              >
                {remainingLessons}
              </h3>

              <p
                className="
                  text-xs
                  text-gray-400
                  mt-1
                "
              >
                د زده کړې لپاره
              </p>

            </div>


            {/* SCORE */}

            <div
              className="
                bg-white
                border
                border-gray-200
                rounded-2xl
                p-5
                shadow-sm
                hover:shadow-md
                transition
              "
            >

              <div
                className="
                  w-11
                  h-11
                  rounded-xl
                  bg-yellow-100
                  flex
                  items-center
                  justify-center
                  text-xl
                  mb-4
                "
              >
                🏆
              </div>

              <p
                className="
                  text-xs
                  text-gray-400
                "
              >
                ټولې نمرې
              </p>

              <h3
                className="
                  text-2xl
                  font-bold
                  text-[#f1c40f]
                  mt-1
                "
              >
                {totalScore}
              </h3>

              <p
                className="
                  text-xs
                  text-gray-400
                  mt-1
                "
              >
                ترلاسه شوې نمرې
              </p>

            </div>


            {/* STARS */}

            <div
              className="
                bg-white
                border
                border-gray-200
                rounded-2xl
                p-5
                shadow-sm
                hover:shadow-md
                transition
              "
            >

              <div
                className="
                  w-11
                  h-11
                  rounded-xl
                  bg-orange-100
                  flex
                  items-center
                  justify-center
                  text-xl
                  mb-4
                "
              >
                ⭐
              </div>

              <p
                className="
                  text-xs
                  text-gray-400
                "
              >
                ستوري
              </p>

              <h3
                className="
                  text-2xl
                  font-bold
                  text-orange-500
                  mt-1
                "
              >
                {stars}
              </h3>

              <p
                className="
                  text-xs
                  text-gray-400
                  mt-1
                "
              >
                ترلاسه شوي ستوري
              </p>

            </div>

          </div>


          {/* ==========================================
              GRAPH + PROGRESS
          ========================================== */}

          <div
            className="
              grid
              grid-cols-1
              lg:grid-cols-2
              gap-6
            "
          >

            {/* ========================================
                LEARNING GRAPH
            ======================================== */}

            <div
              className="
                bg-white
                border
                border-gray-200
                rounded-2xl
                p-6
                shadow-sm
              "
            >

              <div
                className="
                  flex
                  items-center
                  justify-between
                  mb-6
                "
              >

                <div>

                  <h3
                    className="
                      text-lg
                      font-bold
                      text-[#34495e]
                    "
                  >
                    📈 د زده کړې ګراف
                  </h3>

                  <p
                    className="
                      text-xs
                      text-gray-400
                      mt-1
                    "
                  >
                    د بشپړو شوو درسونو پرمختګ
                  </p>

                </div>

                <div
                  className="
                    px-3
                    py-1.5
                    bg-green-50
                    text-green-600
                    rounded-lg
                    text-xs
                    font-semibold
                  "
                >
                  {progress}% بشپړ
                </div>

              </div>


              {/* GRAPH */}

              <div
                className="
                  h-64
                  flex
                  items-end
                  gap-2
                  border-b
                  border-gray-200
                  relative
                  px-2
                "
              >

                {/* GRID LINE 1 */}

                <div
                  className="
                    absolute
                    left-0
                    right-0
                    top-0
                    border-t
                    border-dashed
                    border-gray-100
                  "
                />


                {/* GRID LINE 2 */}

                <div
                  className="
                    absolute
                    left-0
                    right-0
                    top-1/4
                    border-t
                    border-dashed
                    border-gray-100
                  "
                />


                {/* GRID LINE 3 */}

                <div
                  className="
                    absolute
                    left-0
                    right-0
                    top-2/4
                    border-t
                    border-dashed
                    border-gray-100
                  "
                />


                {/* GRID LINE 4 */}

                <div
                  className="
                    absolute
                    left-0
                    right-0
                    top-3/4
                    border-t
                    border-dashed
                    border-gray-100
                  "
                />


                {/* GRAPH BARS */}

                {graphData.map(
                  (
                    value,
                    index
                  ) => {

                    const lessonProgress =
                      Math.min(
                        progress,
                        value
                      );

                    return (
                      <div
                        key={index}
                        className="
                          flex-1
                          h-full
                          flex
                          items-end
                          justify-center
                          relative
                          z-10
                        "
                      >

                        <div
                          className="
                            w-full
                            max-w-[28px]
                            bg-[#3498db]
                            rounded-t-lg
                            transition-all
                            duration-500
                            hover:bg-[#2980b9]
                          "
                          style={{
                            height: `${Math.max(
                              8,
                              lessonProgress
                            )}%`,
                          }}
                        />

                      </div>
                    );
                  }
                )}

              </div>


              {/* GRAPH LABELS */}

              <div
                className="
                  flex
                  justify-between
                  text-[10px]
                  text-gray-400
                  mt-3
                "
              >

                <span>۱</span>
                <span>۱۰</span>
                <span>۲۰</span>
                <span>۳۰</span>
                <span>۴۰</span>
                <span>۵۰</span>
                <span>۶۰</span>
                <span>۷۰</span>

              </div>

            </div>


            {/* ========================================
                OVERALL PROGRESS
            ======================================== */}

            <div
              className="
                bg-white
                border
                border-gray-200
                rounded-2xl
                p-6
                shadow-sm
              "
            >

              <div className="mb-6">

                <h3
                  className="
                    text-lg
                    font-bold
                    text-[#34495e]
                  "
                >
                  🎯 د زده کړې حالت
                </h3>

                <p
                  className="
                    text-xs
                    text-gray-400
                    mt-1
                  "
                >
                  ستاسو د کورس عمومي پرمختګ
                </p>

              </div>


              {/* CIRCLE */}

              <div
                className="
                  flex
                  justify-center
                  mb-8
                "
              >

                <div
                  className="
                    w-40
                    h-40
                    rounded-full
                    flex
                    items-center
                    justify-center
                    relative
                  "
                  style={{
                    background: `
                      conic-gradient(
                        #2ecc71 ${progress}%,
                        #ecf0f1 ${progress}% 100%
                      )
                    `,
                  }}
                >

                  <div
                    className="
                      w-32
                      h-32
                      bg-white
                      rounded-full
                      flex
                      flex-col
                      items-center
                      justify-center
                    "
                  >

                    <span
                      className="
                        text-3xl
                        font-bold
                        text-[#34495e]
                      "
                    >
                      {progress}%
                    </span>

                    <span
                      className="
                        text-xs
                        text-gray-400
                        mt-1
                      "
                    >
                      بشپړ شوی
                    </span>

                  </div>

                </div>

              </div>


              {/* PROGRESS ITEMS */}

              <div className="space-y-5">

                {/* LESSON PROGRESS */}

                <div>

                  <div
                    className="
                      flex
                      justify-between
                      text-xs
                      mb-2
                    "
                  >

                    <span className="text-gray-500">
                      د درسونو پرمختګ
                    </span>

                    <span
                      className="
                        font-semibold
                        text-[#2ecc71]
                      "
                    >
                      {completedLessons}/
                      {lessons.length}
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
                        bg-[#2ecc71]
                        rounded-full
                        transition-all
                        duration-500
                      "
                      style={{
                        width: `${progress}%`,
                      }}
                    />

                  </div>

                </div>


                {/* SCORE PROGRESS */}

                <div>

                  <div
                    className="
                      flex
                      justify-between
                      text-xs
                      mb-2
                    "
                  >

                    <span className="text-gray-500">
                      د نمرې هدف
                    </span>

                    <span
                      className="
                        font-semibold
                        text-[#3498db]
                      "
                    >
                      {Math.min(
                        100,
                        completedLessons *
                          10
                      )}%
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
                        bg-[#3498db]
                        rounded-full
                        transition-all
                        duration-500
                      "
                      style={{
                        width: `${Math.min(
                          100,
                          completedLessons *
                            10
                        )}%`,
                      }}
                    />

                  </div>

                </div>


                {/* STAR PROGRESS */}

                <div>

                  <div
                    className="
                      flex
                      justify-between
                      text-xs
                      mb-2
                    "
                  >

                    <span className="text-gray-500">
                      د ستورو پرمختګ
                    </span>

                    <span
                      className="
                        font-semibold
                        text-yellow-500
                      "
                    >
                      {stars}
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
                        bg-yellow-400
                        rounded-full
                        transition-all
                        duration-500
                      "
                      style={{
                        width: `${Math.min(
                          100,
                          (completedLessons %
                            10) *
                            10
                        )}%`,
                      }}
                    />

                  </div>

                </div>

              </div>

            </div>

          </div>


          {/* ==========================================
              LEARNING INFORMATION
          ========================================== */}

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-3
              gap-6
              mt-6
            "
          >

            {/* CURRENT LEVEL */}

            <div
              className="
                bg-white
                border
                border-gray-200
                rounded-2xl
                p-6
                shadow-sm
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-4
                "
              >

                <div
                  className="
                    w-12
                    h-12
                    rounded-xl
                    bg-blue-50
                    flex
                    items-center
                    justify-center
                    text-xl
                  "
                >
                  🎓
                </div>

                <div>

                  <p
                    className="
                      text-xs
                      text-gray-400
                    "
                  >
                    اوسنی پړاو
                  </p>

                  <h3
                    className="
                      font-bold
                      text-[#34495e]
                      mt-1
                    "
                  >
                    {getCurrentLevel()}
                  </h3>

                </div>

              </div>

            </div>


            {/* STREAK */}

            <div
              className="
                bg-white
                border
                border-gray-200
                rounded-2xl
                p-6
                shadow-sm
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-4
                "
              >

                <div
                  className="
                    w-12
                    h-12
                    rounded-xl
                    bg-orange-50
                    flex
                    items-center
                    justify-center
                    text-xl
                  "
                >
                  🔥
                </div>

                <div>

                  <p
                    className="
                      text-xs
                      text-gray-400
                    "
                  >
                    د زده کړې لړۍ
                  </p>

                  <h3
                    className="
                      font-bold
                      text-[#34495e]
                      mt-1
                    "
                  >
                    {completedLessons > 0
                      ? `${Math.min(
                          completedLessons,
                          30
                        )} ورځې`
                      : "لا پیل نه دی شوی"}
                  </h3>

                </div>

              </div>

            </div>


            {/* GOAL */}

            <div
              className="
                bg-white
                border
                border-gray-200
                rounded-2xl
                p-6
                shadow-sm
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-4
                "
              >

                <div
                  className="
                    w-12
                    h-12
                    rounded-xl
                    bg-green-50
                    flex
                    items-center
                    justify-center
                    text-xl
                  "
                >
                  🚀
                </div>

                <div>

                  <p
                    className="
                      text-xs
                      text-gray-400
                    "
                  >
                    راتلونکی هدف
                  </p>

                  <h3
                    className="
                      font-bold
                      text-[#34495e]
                      mt-1
                    "
                  >
                    درس {getNextGoal()}
                  </h3>

                  <p
                    className="
                      text-[11px]
                      text-gray-400
                      mt-1
                    "
                  >
                    دې درس ته ځان ورسوه
                  </p>

                </div>

              </div>

            </div>

          </div>


          {/* ==========================================
              MOTIVATION
          ========================================== */}

          <div
            className="
              mt-8
              bg-[#34495e]
              rounded-2xl
              p-6
              md:p-8
              text-white
              flex
              flex-col
              md:flex-row
              items-center
              justify-between
              gap-6
            "
          >

            <div>

              <h3
                className="
                  text-xl
                  font-bold
                "
              >
                💪 خپل تمرین ته دوام ورکړئ!
              </h3>

              <p
                className="
                  text-sm
                  text-gray-300
                  mt-2
                "
              >
                هره ورځ لږ تمرین کول ستاسو د ټایپنګ
                سرعت او دقت زیاتوي.
              </p>

            </div>


            <div
              className="
                text-center
                min-w-[120px]
              "
            >

              <div
                className="
                  text-3xl
                  font-bold
                  text-[#2ecc71]
                "
              >
                {completedLessons}
              </div>

              <div
                className="
                  text-xs
                  text-gray-300
                  mt-1
                "
              >
                درسونه بشپړ شوي
              </div>

            </div>

          </div>

        </section>

      </main>


      {/* =====================================
          ANIMATION
      ===================================== */}

      <style jsx>{`

        @keyframes bounce-in {

          0% {
            transform: scale(0.3);
            opacity: 0;
          }

          50% {
            transform: scale(1.05);
          }

          70% {
            transform: scale(0.9);
          }

          100% {
            transform: scale(1);
            opacity: 1;
          }

        }

        .animate-bounce-in {
          animation: bounce-in 0.5s ease-out;
        }

      `}</style>

    </div>
  );
}