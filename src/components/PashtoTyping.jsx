// HomeRowSteps.jsx
import React, { useState } from "react";

// ==========================================
// LESSON DATA - Pashto Version with Pashto Letters
// ==========================================

const LESSONS = [
  { id: 1, title: "د ټایپنګ پیژندنه", subtitle: "توري: ب, پ, ت" },
  { id: 2, title: "توري: ب, پ, ت", subtitle: "توري: ث, ج, چ" },
  { id: 3, title: "توري: ث, ج, چ", subtitle: "بیاکتنه: ب, پ, ت, ث, ج, چ" },
  { id: 4, title: "بیاکتنه: ب, پ, ت, ث, ج, چ", subtitle: "توري: ح, خ, د" },
  { id: 5, title: "توري: ح, خ, د", subtitle: "توري: ذ, ر, ز" },
  { id: 6, title: "توري: ذ, ر, ز", subtitle: "بیاکتنه: ح, خ, د, ذ, ر, ز" },
  { id: 7, title: "بیاکتنه: ح, خ, د, ذ, ر, ز", subtitle: "توري: ژ, س, ش" },
  { id: 8, title: "توري: ژ, س, ش", subtitle: "توري: ص, ض, ط" },
  { id: 9, title: "توري: ص, ض, ط", subtitle: "بیاکتنه: ژ, س, ش, ص, ض, ط" },
  { id: 10, title: "بیاکتنه: ژ, س, ش, ص, ض, ط", subtitle: "توري: ظ, ع, غ" },
  { id: 11, title: "توري: ظ, ع, غ", subtitle: "توري: ف, ق, ک" },
  { id: 12, title: "توري: ف, ق, ک", subtitle: "بیاکتنه: ظ, ع, غ, ف, ق, ک" },
  { id: 13, title: "بیاکتنه: ظ, ع, غ, ف, ق, ک", subtitle: "توري: گ, ل, م" },
  { id: 14, title: "توري: گ, ل, م", subtitle: "توري: ن, و, ه" },
  { id: 15, title: "توري: ن, و, ه", subtitle: "بیاکتنه: گ, ل, م, ن, و, ه" },
  { id: 16, title: "بیاکتنه: گ, ل, م, ن, و, ه", subtitle: "د پښتو ټول توري" },
];

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function HomeRowSteps() {
  const [selectedId, setSelectedId] = useState(1);
  const [isTyping, setIsTyping] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [errors, setErrors] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [wpm, setWpm] = useState(0);

  const completedLessons = selectedId - 1;
  const progress = Math.round(
    (completedLessons / LESSONS.length) * 100
  );

  // Sample practice texts with Pashto letters
  const practiceTexts = {
    1: "ب پ ت",
    2: "ث ج چ",
    3: "ب پ ت ث ج چ",
    4: "ح خ د",
    5: "ذ ر ز",
    6: "ح خ د ذ ر ز",
    7: "ژ س ش",
    8: "ص ض ط",
    9: "ژ س ش ص ض ط",
    10: "ظ ع غ",
    11: "ف ق ک",
    12: "ظ ع غ ف ق ک",
    13: "گ ل م",
    14: "ن و ه",
    15: "گ ل م ن و ه",
    16: "ب پ ت ث ج چ ح خ د ذ ر ز ژ س ش ص ض ط ظ ع غ ف ق ک گ ل م ن و ه",
  };

  // Pashto keyboard layout mapping (simplified)
  const pashtoKeys = {
    'ب': 'ب',
    'پ': 'پ',
    'ت': 'ت',
    'ث': 'ث',
    'ج': 'ج',
    'چ': 'چ',
    'ح': 'ح',
    'خ': 'خ',
    'د': 'د',
    'ذ': 'ذ',
    'ر': 'ر',
    'ز': 'ز',
    'ژ': 'ژ',
    'س': 'س',
    'ش': 'ش',
    'ص': 'ص',
    'ض': 'ض',
    'ط': 'ط',
    'ظ': 'ظ',
    'ع': 'ع',
    'غ': 'غ',
    'ف': 'ف',
    'ق': 'ق',
    'ک': 'ک',
    'گ': 'گ',
    'ل': 'ل',
    'م': 'م',
    'ن': 'ن',
    'و': 'و',
    'ه': 'ه',
    'ی': 'ی',
    'ء': 'ء',
    'آ': 'آ',
    'أ': 'أ',
    'إ': 'إ',
    'ة': 'ة',
  };

  const getCurrentText = () => {
    return practiceTexts[selectedId] || "پښتو ټایپنګ تمرین";
  };

  const handleStartLesson = () => {
    setIsTyping(true);
    setTypedText("");
    setCurrentCharIndex(0);
    setErrors(0);
    setStartTime(Date.now());
    setWpm(0);
  };

  const handleKeyPress = (e) => {
    if (!isTyping) return;

    const currentText = getCurrentText();
    const key = e.key;

    // Handle space
    if (key === " ") {
      e.preventDefault();
      if (currentCharIndex < currentText.length) {
        const expectedChar = currentText[currentCharIndex];
        if (key === expectedChar) {
          setTypedText(typedText + key);
          setCurrentCharIndex(currentCharIndex + 1);
          
          if (startTime) {
            const elapsed = (Date.now() - startTime) / 60000;
            const wordsTyped = (currentCharIndex + 1) / 5;
            setWpm(Math.round(wordsTyped / elapsed));
          }
        } else {
          setErrors(errors + 1);
          const input = document.getElementById("type-input");
          if (input) {
            input.style.borderColor = "#e74c3c";
            setTimeout(() => {
              input.style.borderColor = "#d5dadd";
            }, 300);
          }
        }
      }
    }

    // Handle Pashto characters
    if (key in pashtoKeys) {
      e.preventDefault();
      if (currentCharIndex < currentText.length) {
        const expectedChar = currentText[currentCharIndex];
        if (pashtoKeys[key] === expectedChar) {
          setTypedText(typedText + key);
          setCurrentCharIndex(currentCharIndex + 1);
          
          if (startTime) {
            const elapsed = (Date.now() - startTime) / 60000;
            const wordsTyped = (currentCharIndex + 1) / 5;
            setWpm(Math.round(wordsTyped / elapsed));
          }
        } else {
          setErrors(errors + 1);
          const input = document.getElementById("type-input");
          if (input) {
            input.style.borderColor = "#e74c3c";
            setTimeout(() => {
              input.style.borderColor = "#d5dadd";
            }, 300);
          }
        }
      }
    }

    // Check if lesson is complete
    if (currentCharIndex + 1 >= currentText.length) {
      setIsTyping(false);
      if (selectedId < LESSONS.length) {
        setTimeout(() => {
          setSelectedId(selectedId + 1);
          setIsTyping(false);
          setTypedText("");
          setCurrentCharIndex(0);
        }, 1500);
      }
    }
  };

  // Get color for typed characters
  const getCharColor = (index) => {
    if (index < typedText.length) {
      const currentText = getCurrentText();
      if (index < typedText.length && typedText[index] === currentText[index]) {
        return "text-green-600";
      } else if (index < typedText.length) {
        return "text-red-600";
      }
    }
    return "text-gray-400";
  };

  return (
    <div className="min-h-screen bg-[#f5f7fa] text-gray-700" dir="rtl">

      {/* =====================================
          TOP HEADER
      ===================================== */}

      <div className="bg-white border-b border-gray-200">

        <div className="max-w-6xl mx-auto px-5 py-5">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            {/* Course Title */}

            <div>
              <h1 className="text-2xl font-semibold text-[#34495e]">
                د پښتو توري
              </h1>

              <p className="text-sm text-gray-500 mt-1">
                د پښتو ټول توري زده کړئ
              </p>
            </div>

            {/* Statistics */}

            <div className="flex items-center gap-6">

              <div className="text-center">
                <div className="text-lg font-semibold text-[#3498db]">
                  {progress}%
                </div>
                <div className="text-xs text-gray-400">
                  پرمختګ
                </div>
              </div>

              <div className="h-8 w-px bg-gray-200" />

              <div className="text-center">
                <div className="text-lg font-semibold text-[#f1c40f]">
                  ⭐ {Math.floor(completedLessons / 3)}
                </div>
                <div className="text-xs text-gray-400">
                  ستوري
                </div>
              </div>

              <div className="h-8 w-px bg-gray-200" />

              <div className="text-center">
                <div className="text-lg font-semibold text-[#2ecc71]">
                  {completedLessons * 10}
                </div>
                <div className="text-xs text-gray-400">
                  نمرې
                </div>
              </div>

              {isTyping && (
                <>
                  <div className="h-8 w-px bg-gray-200" />
                  <div className="text-center">
                    <div className="text-lg font-semibold text-[#9b59b6]">
                      {wpm}
                    </div>
                    <div className="text-xs text-gray-400">
                      WPM
                    </div>
                  </div>
                </>
              )}

            </div>

          </div>

          {/* Progress */}

          <div className="mt-5">

            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">

              <div
                className="h-full bg-[#2ecc71] transition-all duration-500"
                style={{
                  width: `${progress}%`,
                }}
              />

            </div>

          </div>

        </div>

      </div>

      {/* =====================================
          COURSE AREA
      ===================================== */}

      <main className="max-w-6xl mx-auto px-5 py-10">

        {/* Section Header */}

        <div className="text-center mb-10">

          <h2 className="text-xl font-semibold text-[#34495e]">
            د پښتو توري درسونه
          </h2>

          <p className="text-sm text-gray-400 mt-2">
            د پښتو توري د ټایپنګ لپاره زده کړئ
          </p>

        </div>

        {/* =====================================
            LESSON PATH
        ===================================== */}

        <div className="relative max-w-5xl mx-auto">

          {/* Desktop Path Line */}
          <div className="hidden md:block absolute top-[38px] left-[5%] right-[5%] h-[5px] bg-[#dfe6e9] rounded-full" />

          {/* Progress Path */}
          <div
            className="hidden md:block absolute top-[38px] left-[5%] h-[5px] bg-[#2ecc71] rounded-full transition-all duration-500"
            style={{
              width:
                LESSONS.length > 1
                  ? `${(completedLessons / (LESSONS.length - 1)) * 90}%`
                  : "0%",
            }}
          />

          {/* Lessons Grid - 5 per row */}
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-y-12 md:gap-y-16">
            
            {LESSONS.map((lesson) => {
              const isCompleted = lesson.id < selectedId;
              const isCurrent = lesson.id === selectedId;
              const isLocked = lesson.id > selectedId + 1;

              return (
                <div
                  key={lesson.id}
                  className="relative flex flex-col items-center"
                >
                  {/* =================================
                      LESSON CIRCLE
                  ================================= */}
                  
                  <button
                    onClick={() => {
                      if (!isLocked && !isTyping) {
                        setSelectedId(lesson.id);
                        setIsTyping(false);
                        setTypedText("");
                        setCurrentCharIndex(0);
                      }
                    }}
                    disabled={isLocked || isTyping}
                    className={`
                      relative z-10
                      w-[72px] h-[72px]
                      rounded-full
                      flex items-center justify-center
                      transition-all duration-200
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
                          `
                          : isCurrent
                          ? `
                            bg-[#3498db]
                            border-[#2980b9]
                            text-white
                            scale-110
                            shadow-lg
                            shadow-blue-200
                          `
                          : `
                            bg-[#ecf0f1]
                            border-[#d5dadd]
                            text-[#95a5a6]
                          `
                      }
                    `}
                  >
                    {/* Completed */}
                    {isCompleted ? (
                      <svg
                        className="w-8 h-8"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : isLocked ? (
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <rect
                          x="5"
                          y="10"
                          width="14"
                          height="11"
                          rx="2"
                        />
                        <path
                          strokeLinecap="round"
                          d="M8 10V7a4 4 0 018 0v3"
                        />
                      </svg>
                    ) : (
                      <span className="text-xl font-bold">
                        {lesson.id}
                      </span>
                    )}

                    {/* Current indicator */}
                    {isCurrent && (
                      <span className="absolute -top-3 bg-[#3498db] text-white text-[9px] uppercase font-bold px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap">
                        اوسنی
                      </span>
                    )}
                  </button>

                  {/* =================================
                      LESSON TEXT
                  ================================= */}
                  
                  <div className="text-center mt-3 px-1 max-w-[90px]">
                    <h3
                      className={`
                        text-xs font-semibold leading-tight
                        ${
                          isCurrent
                            ? "text-[#2980b9]"
                            : isCompleted
                            ? "text-[#34495e]"
                            : "text-gray-400"
                        }
                      `}
                    >
                      {lesson.title}
                    </h3>
                    <p
                      className={`
                        text-[10px] mt-0.5
                        ${
                          isCurrent
                            ? "text-[#3498db]"
                            : "text-gray-400"
                        }
                      `}
                    >
                      {lesson.subtitle}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* =====================================
            SELECTED LESSON PANEL WITH TYPETONE
        ===================================== */}

        <div className="mt-14 max-w-3xl mx-auto">

          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">

            {/* Panel Header */}

            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">

              <div>

                <div className="text-xs uppercase tracking-wide text-gray-400 font-semibold">
                  غوره شوی درس
                </div>

                <h3 className="text-lg font-semibold text-[#34495e] mt-1">
                  درس {selectedId}:{" "}
                  {LESSONS[selectedId - 1]?.title}
                </h3>

              </div>

              <div className="w-12 h-12 rounded-full bg-[#3498db] text-white flex items-center justify-center font-bold">
                {selectedId}
              </div>

            </div>

            {/* Panel Body - TypeTone Area */}

            <div className="px-6 py-6">

              {!isTyping ? (
                // Lesson Info & Start Button
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">

                  <div>

                    <p className="text-sm text-gray-500">
                      راتلونکی ګام
                    </p>

                    <p className="font-semibold text-[#34495e] mt-1">
                      {LESSONS[selectedId - 1]?.subtitle}
                    </p>

                    {selectedId <= LESSONS.length && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-400">
                          د تمرین توري:
                        </p>
                        <p className="text-xl font-bold text-[#34495e] mt-1">
                          {getCurrentText()}
                        </p>
                      </div>
                    )}

                  </div>

                  <button
                    onClick={handleStartLesson}
                    disabled={selectedId > LESSONS.length}
                    className="px-7 py-3 bg-[#3498db] hover:bg-[#2980b9] text-white rounded-md font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    درس پیل کړئ
                  </button>

                </div>
              ) : (
                // TypeTone Practice Area
                <div>
                  {/* Progress bar for current lesson */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>پرمختګ</span>
                      <span>{Math.round((currentCharIndex / getCurrentText().length) * 100)}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#3498db] transition-all duration-300"
                        style={{
                          width: `${(currentCharIndex / getCurrentText().length) * 100}%`
                        }}
                      />
                    </div>
                  </div>

                  {/* Typing display with Pashto letters */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4 min-h-[100px] flex items-center justify-center">
                    <div className="text-3xl leading-relaxed font-bold" dir="rtl">
                      {getCurrentText().split("").map((char, index) => (
                        <span
                          key={index}
                          className={`
                            ${index < typedText.length ? 
                              typedText[index] === char ? "text-green-600" : "text-red-600 bg-red-100"
                              : "text-gray-400"
                            }
                            ${index === currentCharIndex && index === typedText.length ? "bg-blue-200 animate-pulse" : ""}
                            transition-colors duration-150
                            inline-block px-1
                          `}
                        >
                          {char === " " ? "␣" : char}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Keyboard hint */}
                  <div className="bg-blue-50 rounded-lg p-3 mb-4 border border-blue-200">
                    <p className="text-sm text-blue-700 text-center">
                      💡 لارښود: د پښتو توري د کیبورډ په منځنۍ کرښه کې موقعیت لري
                    </p>
                    <div className="flex justify-center gap-1 mt-2 flex-wrap">
                      {getCurrentText().replace(/\s/g, '').split('').slice(0, 10).map((char, idx) => (
                        <span key={idx} className="bg-white px-2 py-1 rounded border border-blue-200 text-sm font-bold">
                          {char}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Typing input (hidden) */}
                  <input
                    id="type-input"
                    type="text"
                    className="absolute opacity-0 w-0 h-0"
                    autoFocus
                    onKeyDown={handleKeyPress}
                    value={typedText}
                    onChange={() => {}}
                  />

                  {/* Stats and controls */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex gap-4">
                      <span>غلطۍ: <span className="text-red-600 font-semibold">{errors}</span></span>
                      <span>WPM: <span className="text-purple-600 font-semibold">{wpm}</span></span>
                      <span>د توري شمېر: <span className="text-blue-600 font-semibold">{getCurrentText().replace(/\s/g, '').length}</span></span>
                    </div>
                    <button
                      onClick={() => {
                        setIsTyping(false);
                        setTypedText("");
                        setCurrentCharIndex(0);
                        setErrors(0);
                      }}
                      className="text-red-500 hover:text-red-700 text-sm font-semibold"
                    >
                      بندول
                    </button>
                  </div>

                  {/* Completion message */}
                  {currentCharIndex >= getCurrentText().length && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-center">
                      <p className="text-green-700 font-semibold text-lg">
                        ✅ مبارک شه! درس بشپړ شو! 🎉
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        غلطۍ: {errors} | WPM: {wpm} | ټول توري: {getCurrentText().replace(/\s/g, '').length}
                      </p>
                    </div>
                  )}
                </div>
              )}

            </div>

          </div>

        </div>

        {/* =====================================
            LEGEND
        ===================================== */}

        <div className="flex justify-center items-center gap-6 mt-8 text-xs text-gray-400">

          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#2ecc71]" />
            بشپړ شوی
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#3498db]" />
            اوسنی
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#d5dadd]" />
            تړل شوی
          </div>

        </div>

        {/* =====================================
            PASHTO ALPHABET REFERENCE
        ===================================== */}

        <div className="mt-10 max-w-3xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
            <h4 className="text-center text-sm font-semibold text-gray-600 mb-3">
              د پښتو الفبا ټول توري
            </h4>
            <div className="flex flex-wrap justify-center gap-2">
              {['ب', 'پ', 'ت', 'ث', 'ج', 'چ', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'ژ', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ک', 'گ', 'ل', 'م', 'ن', 'و', 'ه', 'ی', 'ء', 'آ', 'أ', 'إ', 'ة'].map((char, idx) => (
                <span key={idx} className="inline-block w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl font-bold hover:bg-blue-100 transition-colors cursor-default">
                  {char}
                </span>
              ))}
            </div>
          </div>
        </div>

      </main>

    </div>
  );
}