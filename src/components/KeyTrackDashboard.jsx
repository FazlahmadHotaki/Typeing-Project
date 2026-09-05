// KeyTrackDashboard.jsx

import React, { useState, useEffect } from "react";
import translations from "../data/translations";
import { LESSONS } from "../data/lessons";
import { useNavigate } from "react-router-dom";
import Nav from "./Nav";
import ChartComponent from "../chart-JS/ChartComponent";
import { useLanguage } from "../context/LanguageContext";

// ======================================================
// RING COMPONENT
// ======================================================

function Ring({
  pct,
  label,
  value,
  color = "#8B5CF6",
}) {
  const r = 30;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;

  return (
    <div className="flex flex-col items-center group">
      <div className="relative w-[80px] h-[80px] transition-transform group-hover:scale-105">
        <svg
          className="w-full h-full -rotate-90"
          viewBox="0 0 80 80"
        >
          <circle
            cx="40"
            cy="40"
            r={r}
            fill="none"
            stroke="#F3F4F6"
            strokeWidth="6"
          />

          <circle
            cx="40"
            cy="40"
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeDasharray={c}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{
              transition:
                "stroke-dashoffset 0.8s ease, stroke 0.3s ease",
              filter: `drop-shadow(0 0 6px ${color}80)`,
            }}
          />
        </svg>

        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="text-lg font-bold"
            style={{ color }}
          >
            {pct}%
          </span>
        </div>
      </div>

      <span className="text-xs text-gray-600 mt-2 text-center font-medium">
        {label}
      </span>

      <span className="text-sm font-bold text-gray-800 mt-1">
        {value}
      </span>
    </div>
  );
}

// ======================================================
// ADD LESSON MODAL
// ======================================================

function AddLessonModal({
  isOpen,
  onClose,
  onAdd,
  lang,
}) {
  const [formData, setFormData] = useState({
    icon: "⌨️",
    title: "",
    sub: "",
    progress: 50,
    score: 0,
    stars: 0,
    color: "#8B5CF6",
  });

  // ====================================================
  // LOCK BODY SCROLL
  // ====================================================

  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;

      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.body.style.overflow = "";

        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  // ====================================================
  // PREVENT BACKGROUND SCROLL
  // ====================================================

  useEffect(() => {
    const preventScroll = (e) => {
      if (isOpen) {
        e.preventDefault();
      }
    };

    if (isOpen) {
      document.addEventListener(
        "wheel",
        preventScroll,
        { passive: false }
      );

      document.addEventListener(
        "touchmove",
        preventScroll,
        { passive: false }
      );
    }

    return () => {
      document.removeEventListener(
        "wheel",
        preventScroll
      );

      document.removeEventListener(
        "touchmove",
        preventScroll
      );
    };
  }, [isOpen]);

  // ====================================================
  // ESCAPE KEY
  // ====================================================

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener(
        "keydown",
        handleEscape
      );
    }

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [isOpen, onClose]);

  // ====================================================
  // TRANSLATIONS
  // ====================================================

  const modalTranslations = {
    en: {
      addNewLesson: "Add New Lesson",
      lessonIcon: "Lesson Icon (Emoji)",
      lessonTitle: "Lesson Title",
      lessonSubtitle: "Lesson Subtitle",
      progress: "Progress (%)",
      score: "Score",
      stars: "Stars",
      color: "Color",
      cancel: "Cancel",
      add: "Add Lesson",
      titlePlaceholder: "Enter lesson title",
      subPlaceholder: "Enter lesson subtitle",
      iconPlaceholder: "Enter emoji icon",
    },

    ps: {
      addNewLesson: "نوی درس زیات کړئ",
      lessonIcon: "د درس آیکون (ایموجي)",
      lessonTitle: "د درس عنوان",
      lessonSubtitle: "د درس فرعي عنوان",
      progress: "پرمختګ (٪)",
      score: "امتیاز",
      stars: "ستوري",
      color: "رنګ",
      cancel: "لغوه",
      add: "درس زیات کړئ",
      titlePlaceholder: "د درس عنوان ولیکئ",
      subPlaceholder: "د درس فرعي عنوان ولیکئ",
      iconPlaceholder: "ایموجي آیکون ولیکئ",
    },

    fa: {
      addNewLesson: "افزودن درس جدید",
      lessonIcon: "آیکون درس (ایموجی)",
      lessonTitle: "عنوان درس",
      lessonSubtitle: "زیرعنوان درس",
      progress: "پیشرفت (٪)",
      score: "امتیاز",
      stars: "ستاره‌ها",
      color: "رنگ",
      cancel: "لغو",
      add: "افزودن درس",
      titlePlaceholder: "عنوان درس را وارد کنید",
      subPlaceholder: "زیرعنوان درس را وارد کنید",
      iconPlaceholder: "آیکون ایموجی را وارد کنید",
    },

    dr: {
      addNewLesson: "افزودن درس جدید",
      lessonIcon: "آیکون درس (ایموجی)",
      lessonTitle: "عنوان درس",
      lessonSubtitle: "زیرعنوان درس",
      progress: "پیشرفت (٪)",
      score: "امتیاز",
      stars: "ستاره‌ها",
      color: "رنگ",
      cancel: "لغو",
      add: "افزودن درس",
      titlePlaceholder: "عنوان درس را وارد کنید",
      subPlaceholder: "زیرعنوان درس را وارد کنید",
      iconPlaceholder: "آیکون ایموجی را وارد کنید",
    },

    prs: {
      addNewLesson: "افزودن درس جدید",
      lessonIcon: "آیکون درس (ایموجی)",
      lessonTitle: "عنوان درس",
      lessonSubtitle: "زیرعنوان درس",
      progress: "پیشرفت (٪)",
      score: "امتیاز",
      stars: "ستاره‌ها",
      color: "رنگ",
      cancel: "لغو",
      add: "افزودن درس",
      titlePlaceholder: "عنوان درس را وارد کنید",
      subPlaceholder: "زیرعنوان درس را وارد کنید",
      iconPlaceholder: "آیکون ایموجی را وارد کنید",
    },
  };

  const mt =
    modalTranslations[lang] ||
    modalTranslations.en;

  // ====================================================
  // SUBMIT LESSON
  // ====================================================

  const handleSubmit = (e) => {
    e.preventDefault();

    const newLesson = {
      icon: formData.icon || "📚",

      title: {
        en: formData.title,
        ps: formData.title,
        fa: formData.title,
        dr: formData.title,
        prs: formData.title,
      },

      sub: {
        en: formData.sub,
        ps: formData.sub,
        fa: formData.sub,
        dr: formData.sub,
        prs: formData.sub,
      },

      progress:
        parseInt(formData.progress) || 0,

      score:
        parseInt(formData.score) || 0,

      stars:
        parseInt(formData.stars) || 0,

      color:
        formData.color || "#8B5CF6",
    };

    onAdd(newLesson);

    setFormData({
      icon: "⌨️",
      title: "",
      sub: "",
      progress: 50,
      score: 0,
      stars: 0,
      color: "#8B5CF6",
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col animate-scale-up">

        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100 flex-shrink-0">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800">
            {mt.addNewLesson}
          </h3>

          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 overscroll-contain">

          <form
            onSubmit={handleSubmit}
            className="space-y-3 sm:space-y-4"
          >

            {/* Icon */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                {mt.lessonIcon}
              </label>

              <input
                type="text"
                value={formData.icon}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    icon: e.target.value,
                  })
                }
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-purple-400 focus:outline-none text-xl sm:text-2xl text-center"
                maxLength="4"
                placeholder={mt.iconPlaceholder}
              />
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                {mt.lessonTitle}
              </label>

              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    title: e.target.value,
                  })
                }
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-purple-400 focus:outline-none text-sm sm:text-base"
                placeholder={mt.titlePlaceholder}
                required
              />
            </div>

            {/* Subtitle */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                {mt.lessonSubtitle}
              </label>

              <input
                type="text"
                value={formData.sub}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    sub: e.target.value,
                  })
                }
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-purple-400 focus:outline-none text-sm sm:text-base"
                placeholder={mt.subPlaceholder}
                required
              />
            </div>

            {/* Progress */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                {mt.progress}
              </label>

              <input
                type="range"
                min="0"
                max="100"
                value={formData.progress}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    progress: e.target.value,
                  })
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />

              <div className="text-center text-xs sm:text-sm text-gray-600 mt-1">
                {formData.progress}%
              </div>
            </div>

            {/* Score / Stars */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                  {mt.score}
                </label>

                <input
                  type="number"
                  value={formData.score}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      score: e.target.value,
                    })
                  }
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-purple-400 focus:outline-none text-sm sm:text-base"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                  {mt.stars}
                </label>

                <input
                  type="number"
                  value={formData.stars}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      stars: e.target.value,
                    })
                  }
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-purple-400 focus:outline-none text-sm sm:text-base"
                  min="0"
                  required
                />
              </div>

            </div>

            {/* Colors */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                {mt.color}
              </label>

              <div className="flex flex-wrap gap-2 sm:gap-3">
                {[
                  "#8B5CF6",
                  "#3B82F6",
                  "#EC4899",
                  "#06B6D4",
                  "#F59E0B",
                  "#10B981",
                  "#EF4444",
                  "#6366F1",
                ].map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        color,
                      })
                    }
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full transition-transform ${
                      formData.color === color
                        ? "scale-110 ring-2 ring-offset-2 ring-gray-400"
                        : "hover:scale-110"
                    }`}
                    style={{
                      background: color,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2 sm:pt-4">

              <button
                type="button"
                onClick={onClose}
                className="w-full px-4 py-2.5 sm:py-3 border-2 border-gray-200 text-gray-700 rounded-lg sm:rounded-xl font-semibold hover:bg-gray-50 transition-colors text-sm sm:text-base"
              >
                {mt.cancel}
              </button>

              <button
                type="submit"
                className="w-full px-4 py-2.5 sm:py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg sm:rounded-xl font-semibold hover:shadow-lg transition-all text-sm sm:text-base"
              >
                {mt.add}
              </button>

            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

// ======================================================
// COLUMN CHART
// ======================================================

function ColumnChart({ lang }) {
  const [hoveredBar, setHoveredBar] =
    useState(null);

  const chartTranslations = {
    en: {
      weeklyActivity: "Weekly Activity",
      hoursSpent: "Hours spent this week",
      days7: "7 Days",
      total: "Total: 23.3h",
      practiceTime: "Practice Time",
      lessons: "Lessons",
      exercises: "Exercises",

      days: {
        Mon: "Mon",
        Tue: "Tue",
        Wed: "Wed",
        Thu: "Thu",
        Fri: "Fri",
        Sat: "Sat",
        Sun: "Sun",
      },
    },

    ps: {
      weeklyActivity: "اوونیز فعالیت",
      hoursSpent:
        "پدې اونۍ کې مصرف شوي ساعتونه",
      days7: "۷ ورځې",
      total: "ټول: ۲۳.۳ ساعته",
      practiceTime: "د تمرین وخت",
      lessons: "درسونه",
      exercises: "تمرینونه",

      days: {
        Mon: "دوشنبه",
        Tue: "سه شنبه",
        Wed: "چهارشنبه",
        Thu: "پنجشنبه",
        Fri: "جمعه",
        Sat: "شنبه",
        Sun: "یکشنبه",
      },
    },

    fa: {
      weeklyActivity: "فعالیت هفتگی",
      hoursSpent:
        "ساعات سپری شده در این هفته",
      days7: "۷ روز",
      total: "مجموع: ۲۳.۳ ساعت",
      practiceTime: "زمان تمرین",
      lessons: "درس‌ها",
      exercises: "تمرین‌ها",

      days: {
        Mon: "دوشنبه",
        Tue: "سه‌شنبه",
        Wed: "چهارشنبه",
        Thu: "پنجشنبه",
        Fri: "جمعه",
        Sat: "شنبه",
        Sun: "یکشنبه",
      },
    },

    dr: {
      weeklyActivity: "فعالیت هفتگی",
      hoursSpent:
        "ساعات سپری شده در این هفته",
      days7: "۷ روز",
      total: "مجموع: ۲۳.۳ ساعت",
      practiceTime: "زمان تمرین",
      lessons: "درس‌ها",
      exercises: "تمرین‌ها",

      days: {
        Mon: "دوشنبه",
        Tue: "سه شنبه",
        Wed: "چهارشنبه",
        Thu: "پنجشنبه",
        Fri: "جمعه",
        Sat: "شنبه",
        Sun: "یکشنبه",
      },
    },

    prs: {
      weeklyActivity: "فعالیت هفتگی",
      hoursSpent:
        "ساعات سپری شده در این هفته",
      days7: "۷ روز",
      total: "مجموع: ۲۳.۳ ساعت",
      practiceTime: "زمان تمرین",
      lessons: "درس‌ها",
      exercises: "تمرین‌ها",

      days: {
        Mon: "دوشنبه",
        Tue: "سه شنبه",
        Wed: "چهارشنبه",
        Thu: "پنجشنبه",
        Fri: "جمعه",
        Sat: "شنبه",
        Sun: "یکشنبه",
      },
    },
  };

  const ct =
    chartTranslations[lang] ||
    chartTranslations.en;

  const weeklyData = [
    {
      day: ct.days.Mon,
      hours: 2.5,
      color: "#8B5CF6",
    },
    {
      day: ct.days.Tue,
      hours: 3.8,
      color: "#3B82F6",
    },
    {
      day: ct.days.Wed,
      hours: 1.9,
      color: "#EC4899",
    },
    {
      day: ct.days.Thu,
      hours: 4.2,
      color: "#06B6D4",
    },
    {
      day: ct.days.Fri,
      hours: 3.1,
      color: "#F59E0B",
    },
    {
      day: ct.days.Sat,
      hours: 5.0,
      color: "#10B981",
    },
    {
      day: ct.days.Sun,
      hours: 2.8,
      color: "#6366F1",
    },
  ];

  const maxHours = Math.max(
    ...weeklyData.map(
      (d) => d.hours
    )
  );

  const chartHeight = 200;

  return (
    <div className="w-full">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">

        <div>
          <h3 className="text-base sm:text-lg font-bold text-gray-800">
            {ct.weeklyActivity}
          </h3>

          <p className="text-xs sm:text-sm text-gray-500">
            {ct.hoursSpent}
          </p>
        </div>

        <div className="flex gap-2">

          <span className="text-[10px] sm:text-xs bg-purple-100 text-purple-600 px-2 sm:px-3 py-1 rounded-full font-semibold">
            {ct.days7}
          </span>

          <span className="text-[10px] sm:text-xs bg-gray-100 text-gray-600 px-2 sm:px-3 py-1 rounded-full font-semibold">
            {ct.total}
          </span>

        </div>
      </div>

      <div
        className="flex items-end justify-between gap-1 sm:gap-3 md:gap-4"
        style={{
          height: `${chartHeight + 40}px`,
        }}
      >

        {weeklyData.map(
          (data, index) => {
            const barHeight =
              (data.hours /
                maxHours) *
              chartHeight;

            const isHovered =
              hoveredBar === index;

            return (
              <div
                key={index}
                className="flex-1 flex flex-col items-center justify-end h-full group cursor-pointer"
                onMouseEnter={() =>
                  setHoveredBar(index)
                }
                onMouseLeave={() =>
                  setHoveredBar(null)
                }
              >

                <div
                  className={`mb-1 sm:mb-2 transition-all duration-200 ${
                    isHovered
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-2"
                  }`}
                >
                  <div className="bg-gray-800 text-white text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg shadow-lg whitespace-nowrap">
                    {data.hours}h
                  </div>
                </div>

                <div
                  className="w-full max-w-[30px] sm:max-w-[40px] md:max-w-[50px] rounded-t-lg sm:rounded-t-xl transition-all duration-300 cursor-pointer relative"
                  style={{
                    height: `${barHeight}px`,

                    background: isHovered
                      ? `linear-gradient(180deg, ${data.color}, ${data.color}CC)`
                      : `linear-gradient(180deg, ${data.color}CC, ${data.color}80)`,

                    boxShadow: isHovered
                      ? `0 8px 20px ${data.color}40, 0 0 20px ${data.color}20`
                      : `0 4px 10px ${data.color}20`,

                    transform: isHovered
                      ? "scaleY(1.05)"
                      : "scaleY(1)",

                    transformOrigin:
                      "bottom",
                  }}
                >
                  <div className="absolute top-0 left-0 right-0 h-1/3 bg-white/20 rounded-t-lg sm:rounded-t-xl" />
                </div>

                <div
                  className={`mt-1 sm:mt-2 text-[10px] sm:text-xs font-semibold transition-colors ${
                    isHovered
                      ? "text-gray-800"
                      : "text-gray-500"
                  }`}
                >
                  {data.day}
                </div>

              </div>
            );
          }
        )}

      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-100">

        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-purple-500" />

          <span className="text-[10px] sm:text-xs text-gray-600">
            {ct.practiceTime}
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-blue-500" />

          <span className="text-[10px] sm:text-xs text-gray-600">
            {ct.lessons}
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-pink-500" />

          <span className="text-[10px] sm:text-xs text-gray-600">
            {ct.exercises}
          </span>
        </div>

      </div>
    </div>
  );
}

// ======================================================
// KEYTRACK DASHBOARD
// ======================================================

export default function KeyTrackDashboard({
  usersing = "",
  openToPahshto,
  formData = {},
}) {
  const { lang } = useLanguage();
  const navigate = useNavigate();

  // ====================================================
  // USER NAME
  // ====================================================

  const [displayName, setDisplayName] =
    useState("");

  // ====================================================
  // LOAD USER DATA
  // ====================================================

  useEffect(() => {
    let signupName = "";
    let loginName = "";

    // ----------------------------------------------
    // 1. CURRENT SIGNUP DATA
    // ----------------------------------------------

    if (
      typeof usersing === "string" &&
      usersing.trim()
    ) {
      signupName =
        usersing.trim();

      localStorage.setItem(
        "usersing",
        signupName
      );
    }

    // ----------------------------------------------
    // 2. CURRENT LOGIN DATA
    // ----------------------------------------------

    if (
      formData &&
      typeof formData === "object" &&
      Object.keys(formData).length > 0
    ) {
      try {
        localStorage.setItem(
          "formData",
          JSON.stringify(formData)
        );
      } catch (error) {
        console.error(
          "Could not save formData:",
          error
        );
      }

      loginName =
        formData.name ||
        formData.username ||
        formData.fullName ||
        "";
    }

    // ----------------------------------------------
    // 3. GET SAVED SIGNUP DATA
    // ----------------------------------------------

    if (!signupName) {
      const savedSignup =
        localStorage.getItem(
          "usersing"
        );

      if (savedSignup) {
        signupName =
          savedSignup;
      }
    }

    // ----------------------------------------------
    // 4. GET SAVED LOGIN DATA
    // ----------------------------------------------

    if (!loginName) {
      const savedLogin =
        localStorage.getItem(
          "formData"
        );

      if (savedLogin) {
        try {
          const parsedLogin =
            JSON.parse(savedLogin);

          loginName =
            parsedLogin?.name ||
            parsedLogin?.username ||
            parsedLogin?.fullName ||
            "";
        } catch (error) {
          console.error(
            "Could not read formData:",
            error
          );
        }
      }
    }

    // ----------------------------------------------
    // 5. FINAL USER NAME
    // ----------------------------------------------

    const finalName =
      loginName ||
      signupName ||
      "Hotak";

    setDisplayName(
      String(finalName)
    );

    // Debug
    console.log(
      "================================"
    );

    console.log(
      "Signup usersing:",
      usersing
    );

    console.log(
      "Login formData:",
      formData
    );

    console.log(
      "Signup localStorage:",
      localStorage.getItem(
        "usersing"
      )
    );

    console.log(
      "Login localStorage:",
      localStorage.getItem(
        "formData"
      )
    );

    console.log(
      "Final Dashboard Name:",
      finalName
    );

    console.log(
      "================================"
    );
  }, [usersing, formData]);

  // ====================================================
  // TRANSLATION FUNCTION
  // ====================================================

  const t = (key) => {
    return (
      translations[lang]?.[key] ||
      translations.en?.[key] ||
      key
    );
  };

  const isRtl =
    t("dir_Dashboard") ===
    "rtl";

  // ====================================================
  // MODAL
  // ====================================================

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  // ====================================================
  // LESSONS
  // ====================================================

  const [lessons, setLessons] =
    useState(() => {
      const initialLessons = [];

      if (
        LESSONS &&
        LESSONS.length > 0
      ) {
        initialLessons.push(
          LESSONS[0]
        );
      }

      if (
        LESSONS &&
        LESSONS.length > 1
      ) {
        initialLessons.push(
          LESSONS[1]
        );
      }

      if (
        LESSONS &&
        LESSONS.length > 2
      ) {
        initialLessons.push(
          LESSONS[2]
        );
      }

      return initialLessons;
    });

  // ====================================================
  // ADD LESSON
  // ====================================================

  const handleAddLesson = (
    newLesson
  ) => {
    setLessons([
      ...lessons,
      newLesson,
    ]);

    setIsModalOpen(false);
  };

  // ====================================================
  // TRANSLATIONS
  // ====================================================

  const performanceTranslations = {
    en: "Performance Overview",
    ps: "د فعالیت کتنه",
    fa: "نمای عملکرد",
    dr: "نمای عملکرد",
    prs: "نمای عملکرد",
  };

  const welcomeTranslations = {
    en: "Welcome back",
    ps: "ښه راغلاست",
    fa: "خوش آمدید",
    dr: "خوش آمدید",
    prs: "خوش آمدید",
  };

  const questionTranslations = {
    en: "What would you like to learn today?",
    ps: "نن مو څه زده کول غواړئ؟",
    fa: "امروز چه چیزی می‌خواهید یاد بگیرید؟",
    dr: "امروز چه چیزی می‌خواهید یاد بگیرید؟",
    prs: "امروز چه چیزی می‌خواهید یاد بگیرید؟",
  };

  const logoutTranslations = {
    en: "Logout",
    ps: "وتل",
    fa: "خروج",
    dr: "خروج",
    prs: "خروج",
  };

  const addPlanTranslations = {
    en: "Add Plan +",
    ps: "پلان زیاته کړئ +",
    fa: "افزودن برنامه +",
    dr: "افزودن برنامه +",
    prs: "افزودن برنامه +",
  };

  const activeLessonsTranslations = {
    en: "Your active lessons",
    ps: "ستاسو فعال درسونه",
    fa: "درس‌های فعال شما",
    dr: "درس‌های فعال شما",
    prs: "درس‌های فعال شما",
  };

  // ====================================================
  // LOGOUT
  // ====================================================

  const handleLogout = () => {
    localStorage.removeItem(
      "usersing"
    );

    localStorage.removeItem(
      "formData"
    );

    localStorage.removeItem(
      "keytrackUser"
    );

    navigate("/");
  };

  // ====================================================
  // RETURN
  // ====================================================

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-3 sm:p-6 lg:p-8"
      dir={
        isRtl
          ? "rtl"
          : "ltr"
      }
    >

      {/* =================================================
          STYLE
      ================================================= */}

      <style jsx>{`
        @keyframes scale-up {
          from {
            transform: scale(0.9);
            opacity: 0;
          }

          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-scale-up {
          animation: scale-up 0.2s ease-out;
        }

        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }

        .overflow-y-auto::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #c4b5fd;
          border-radius: 10px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #8b5cf6;
        }
      `}</style>

      {/* =================================================
          NAV
      ================================================= */}

      <Nav
        showGetStarted={false}
          darkText={true}
      />

      {/* =================================================
          DEBUG
      ================================================= */}

      {console.log(
        "KeyTrackDashboard.jsx:",
        {
          usersing,
          formData,
          displayName,
          lang,
        }
      )}

      {/* =================================================
          USER WELCOME BAR
      ================================================= */}

      <div className="max-w-7xl mx-auto mt-4 sm:mt-6 mb-6 sm:mb-8">

        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg shadow-purple-100 p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border border-purple-100">

          <div className="flex items-center gap-3 sm:gap-4 w-full">

            {/* Avatar */}

            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-lg sm:text-xl font-bold shadow-lg flex-shrink-0">

              {displayName
                ? displayName
                    .charAt(0)
                    .toUpperCase()
                : "H"}

            </div>

            {/* User information */}

            <div className="flex-1 min-w-0">

              <h1 className="text-lg sm:text-2xl font-bold text-gray-800 truncate">

                {welcomeTranslations[
                  lang
                ] ||
                  welcomeTranslations.en}

                ,{" "}

                {displayName ||
                  "Hotak"}

                !

              </h1>

              <p className="text-gray-500 text-xs sm:text-sm mt-0.5 sm:mt-1">

                {questionTranslations[
                  lang
                ] ||
                  questionTranslations.en}

              </p>


            </div>

          </div>

          {/* Logout */}

          <button
            onClick={
              handleLogout
            }
            className="w-full sm:w-auto px-4 sm:px-5 py-2 sm:py-2.5 bg-white border-2 border-gray-200 text-gray-700 rounded-lg sm:rounded-xl font-semibold hover:border-red-300 hover:text-red-500 hover:bg-red-50 transition-all duration-300 shadow-sm text-sm sm:text-base"
          >
            {logoutTranslations[
              lang
            ] ||
              logoutTranslations.en}
          </button>

        </div>
      </div>

      {/* =================================================
          MAIN GRID
      ================================================= */}

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-4 sm:gap-6">

        {/* =================================================
            LESSON LIST
        ================================================= */}

        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl shadow-purple-100 p-4 sm:p-6 border border-purple-50">

          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">

            <div>

              <h2 className="text-lg sm:text-xl font-bold text-gray-800">

                {t(
                  "myPlans_Dashboard"
                )}

              </h2>

              <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">

                {activeLessonsTranslations[
                  lang
                ] ||
                  activeLessonsTranslations.en}

              </p>

            </div>

            <button
              onClick={() =>
                setIsModalOpen(
                  true
                )
              }
              className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-200 transition-all duration-300 transform hover:-translate-y-0.5 text-sm sm:text-base"
            >
              {addPlanTranslations[
                lang
              ] ||
                addPlanTranslations.en}
            </button>

          </div>

          {/* Lesson cards */}

          <div className="space-y-2 sm:space-y-3">

            {lessons.map(
              (
                lesson,
                index
              ) => {

                const gradientColors =
                  [
                    "from-white to-purple-50 border-purple-100 hover:border-purple-300",
                    "from-white to-blue-50 border-blue-100 hover:border-blue-300",
                    "from-white to-pink-50 border-pink-100 hover:border-pink-300",
                    "from-white to-green-50 border-green-100 hover:border-green-300",
                    "from-white to-yellow-50 border-yellow-100 hover:border-yellow-300",
                    "from-white to-red-50 border-red-100 hover:border-red-300",
                  ];

                const gradientIndex =
                  index %
                  gradientColors.length;

                return (
                  <div
                    key={index}
                    className={`group bg-gradient-to-r ${gradientColors[gradientIndex]} rounded-xl sm:rounded-2xl p-3 sm:p-4 border hover:shadow-lg transition-all duration-300`}
                  >

                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">

                      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">

                        {/* Icon */}

                        <div
                          className="w-10 h-10 sm:w-14 sm:h-14 rounded-lg sm:rounded-2xl flex items-center justify-center text-xl sm:text-2xl font-bold shadow-md group-hover:scale-110 transition-transform flex-shrink-0"
                          style={{
                            background: `${lesson.color}20`,
                            color: lesson.color,
                            border: `2px solid ${lesson.color}40`,
                          }}
                        >
                          {lesson.icon}
                        </div>

                        {/* Lesson information */}

                        <div className="flex-1 min-w-0">

                          <div className="flex items-center justify-between gap-2">

                            <h3 className="text-sm sm:text-lg font-bold text-gray-800 truncate">

                              {lesson.title?.[
                                lang
                              ] ||
                                lesson.title?.en ||
                                lesson.title}

                            </h3>

                            <span className="text-[10px] sm:text-xs font-semibold text-gray-500 bg-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border border-gray-200 flex-shrink-0">

                              {lesson.progress ||
                                0}
                              %

                            </span>

                          </div>

                          <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1 truncate">

                            {lesson.sub?.[
                              lang
                            ] ||
                              lesson.sub?.en ||
                              lesson.sub}

                          </p>

                          {/* Progress */}

                          <div className="mt-2 sm:mt-3 bg-white rounded-full h-1.5 sm:h-2 overflow-hidden shadow-inner">

                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${
                                  lesson.progress ||
                                  0
                                }%`,

                                background: `linear-gradient(90deg, ${lesson.color}, #EC4899)`,
                              }}
                            />

                          </div>

                        </div>
                      </div>

                      {/* Score / Stars / Start */}

                      <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2 sm:gap-2 pl-13 sm:pl-0">

                        <div className="flex gap-4 sm:flex-col sm:gap-2 sm:text-right">

                          <div>

                            <div className="text-[10px] sm:text-xs text-gray-500">

                              {t(
                                "score_Dashboard"
                              )}

                            </div>

                            <div className="font-bold text-gray-800 text-sm sm:text-base">

                              {lesson.score ||
                                0}

                            </div>

                          </div>

                          <div>

                            <div className="text-[10px] sm:text-xs text-gray-500">

                              {t(
                                "stars_Dashboard"
                              )}

                            </div>

                            <div className="font-bold text-yellow-500 text-sm sm:text-base">

                              ★{" "}

                              {lesson.stars ||
                                0}

                            </div>

                          </div>

                        </div>

                        {/* Start */}

                        <button
                          type="button"
                          onClick={() => {

                            console.log(
                              "Clicked lesson:",
                              lesson
                            );

                            const title =
                              lesson.title?.[
                                lang
                              ] ||
                              lesson.title?.en ||
                              lesson.title ||
                              "";

                            if (
                              title
                                .toLowerCase()
                                .includes(
                                  "pashto"
                                ) ||
                              title.includes(
                                "پښتو"
                              )
                            ) {

                              console.log(
                                "Opening Pashto Typing..."
                              );

                              openToPahshto?.();

                              navigate(
                                "/dashboard/steps-pashto"
                              );
                            }

                          }}
                          className="w-full sm:w-auto bg-gradient-to-r from-green-400 to-emerald-500 text-white px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl font-bold hover:shadow-lg hover:shadow-green-200 transition-all duration-300 transform hover:-translate-y-0.5 text-xs sm:text-sm"
                        >
                          {t(
                            "start_Dashboard"
                          )}
                        </button>

                      </div>

                    </div>
                  </div>
                );
              }
            )}

          </div>
        </div>

        {/* =================================================
            SIDEBAR
        ================================================= */}

        <div className="space-y-4 sm:space-y-6">

          {/* =================================================
              TYPING SPEED
          ================================================= */}

          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl shadow-purple-100 p-4 sm:p-6 border border-purple-50">

            <div className="flex items-center justify-between mb-3 sm:mb-4">

              <h2 className="text-base sm:text-lg font-bold text-gray-800">

                {t(
                  "typingSpeed_Dashboard"
                )}

              </h2>

              <span className="text-xl sm:text-2xl">
                ⚡
              </span>

            </div>

            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-3 sm:mb-4">

              <div className="text-white text-xs sm:text-sm mb-0.5 sm:mb-1">

                {t(
                  "currentSpeed_Dashboard"
                )}

              </div>

              <div className="text-white text-2xl sm:text-3xl font-bold">

                36{" "}

                <span className="text-base sm:text-lg">
                  WPM
                </span>

              </div>

            </div>

            <div className="space-y-2 sm:space-y-3">

              <div className="flex items-center justify-between py-2 sm:py-3 border-b border-gray-100">

                <span className="text-xs sm:text-sm text-gray-600">

                  {t(
                    "lastWeek_Dashboard"
                  )}

                </span>

                <span className="font-bold text-gray-800 bg-gray-100 px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg text-xs sm:text-sm">
                  31 WPM
                </span>

              </div>

              <div className="flex items-center justify-between py-2 sm:py-3">

                <span className="text-xs sm:text-sm text-gray-600">

                  {t(
                    "lastMonth_Dashboard"
                  )}

                </span>

                <span className="font-bold text-gray-800 bg-gray-100 px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg text-xs sm:text-sm">
                  27 WPM
                </span>

              </div>

            </div>
          </div>

          {/* =================================================
              PRACTICE TIME
          ================================================= */}

          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl shadow-purple-100 p-4 sm:p-6 border border-purple-50">

            <div className="flex items-center justify-between mb-4 sm:mb-6">

              <h2 className="text-base sm:text-lg font-bold text-gray-800">

                {t(
                  "practiceTime_Dashboard"
                )}

              </h2>

              <span className="text-xl sm:text-2xl">
                ⏱️
              </span>

            </div>

            <div className="flex justify-between gap-1 sm:gap-2">

              <Ring
                pct={0}
                label={t(
                  "lastWeek_Dashboard"
                )}
                value={`0 ${t(
                  "minutes_Dashboard"
                )}`}
                color="#8B5CF6"
              />

              <Ring
                pct={70}
                label={t(
                  "thisWeek_Dashboard"
                )}
                value={`42 ${t(
                  "minutes_Dashboard"
                )}`}
                color="#3B82F6"
              />

              <Ring
                pct={60}
                label={t(
                  "today_Dashboard"
                )}
                value={`9 ${t(
                  "minutes_Dashboard"
                )}`}
                color="#EC4899"
              />

            </div>
          </div>

          {/* =================================================
              OVERALL
          ================================================= */}

          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl shadow-purple-100 p-4 sm:p-6 border border-purple-50">

            <div className="flex items-center justify-between mb-3 sm:mb-4">

              <h2 className="text-base sm:text-lg font-bold text-gray-800">

                {t(
                  "overall_Dashboard"
                )}

              </h2>

              <span className="text-xl sm:text-2xl">
                📊
              </span>

            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">

              <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center border border-orange-100">

                <div className="text-2xl sm:text-3xl font-bold text-orange-500">
                  74%
                </div>

                <div className="text-[10px] sm:text-xs text-gray-600 mt-0.5 sm:mt-1">

                  {t(
                    "keyboardCoverage_Dashboard"
                  )}

                </div>

              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center border border-green-100">

                <div className="text-2xl sm:text-3xl font-bold text-green-500">
                  94%
                </div>

                <div className="text-[10px] sm:text-xs text-gray-600 mt-0.5 sm:mt-1">

                  {t(
                    "accuracy_Dashboard"
                  )}

                </div>

              </div>

            </div>

            <div className="flex items-center justify-between mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100">

              <span className="text-xs sm:text-sm text-gray-600">

                {t(
                  "totalActive_Dashboard"
                )}

              </span>

              <span className="font-bold text-gray-800 bg-purple-100 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-purple-600 text-xs sm:text-sm">
                31h 40m
              </span>

            </div>
          </div>

        </div>
      </div>

      {/* =================================================
          CHARTS SECTION
      ================================================= */}

      <div className="max-w-7xl mx-auto mt-4 sm:mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">

        {/* Performance */}

        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl shadow-purple-100 p-4 sm:p-6 border border-purple-50">

          <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4">

            {performanceTranslations[
              lang
            ] ||
              performanceTranslations.en}

          </h3>

          <ChartComponent />

        </div>

        {/* Weekly */}

        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl shadow-purple-100 p-4 sm:p-6 border border-purple-50">

          <ColumnChart
            lang={lang}
          />

        </div>

      </div>

      {/* =================================================
          ADD LESSON MODAL
      ================================================= */}

      <AddLessonModal
        isOpen={
          isModalOpen
        }
        onClose={() =>
          setIsModalOpen(
            false
          )
        }
        onAdd={
          handleAddLesson
        }
        lang={lang}
      />

    </div>
  );
}