// KeyTrackDashboard.jsx
import React, { useState, useMemo } from "react";
import translations from "../data/translations";
import { LESSONS } from "../data/lessons";

function Ring({ pct, label, value }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  return (
    <div className="text-center">
      <svg viewBox="0 0 64 64" className="w-16 h-16 mx-auto">
        <circle cx="32" cy="32" r={r} fill="none" stroke="#0f1218" strokeWidth="6" />
        <circle
          cx="32"
          cy="32"
          r={r}
          fill="none"
          stroke="#E8A33D"
          strokeWidth="6"
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 32 32)"
        />
        <text
          x="32"
          y="37"
          textAnchor="middle"
          fontFamily="JetBrains Mono, monospace"
          fontSize="11"
          fill="#ECEEF3"
          fontWeight="700"
        >
          {pct}%
        </text>
      </svg>
      <div className="text-[11px] text-[#9AA1B4] mt-1.5">{label}</div>
      <div className="font-mono text-[11px] text-[#E8A33D] font-bold">{value}</div>
    </div>
  );
}

export default function KeyTrackDashboard({ user = "Fazl Ahmad", onLogout }) {
  const [lang, setLang] = useState("en");
  
  // Helper function to get translation with flat keys
  const t = (key) => {
    return translations[lang]?.[key] || key;
  };
  
  const isRtl = t("dir_Dashboard") === "rtl";

  const rings = useMemo(
    () => [
      { label: t("lastWeek_Dashboard"), value: `0 ${t("minutes_Dashboard")}`, pct: 0 },
      { label: t("thisWeek_Dashboard"), value: `42 ${t("minutes_Dashboard")}`, pct: 70 },
      { label: t("today_Dashboard"), value: `9 ${t("minutes_Dashboard")}`, pct: 60 },
    ],
    [lang]
  );

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className={`min-h-screen p-4 sm:p-7 ${isRtl ? "font-vazir" : "font-sans"}`}
      style={{
        background:
          "radial-gradient(1200px 600px at 85% -10%, #1c2130 0%, #14171F 55%)",
        color: "#ECEEF3",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700;800&family=Vazirmatn:wght@400;500;600;700;800&display=swap');
        .font-vazir { font-family: 'Vazirmatn', sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
      `}</style>

      {/* Header */}
      <header className="flex flex-wrap items-center justify-between gap-4 px-5 py-3.5 bg-[#1D212C] border border-[#2E3444] rounded-2xl mb-6">
        <div className="flex items-center gap-3">
          <div
            className="w-[38px] h-[38px] rounded-[9px] flex items-center justify-center font-mono font-extrabold text-[#1a1508]"
            style={{
              background: "linear-gradient(180deg, #E8A33D, #C9832A)",
              boxShadow: "0 3px 0 #C9832A, 0 6px 12px rgba(232,163,61,0.25)",
            }}
          >
            Tt
          </div>
          <div>
            <h1 className="text-lg font-extrabold tracking-tight leading-none">
              {t("brand_Dashboard")}
            </h1>
            <span className="block text-[11px] text-[#9AA1B4] font-medium mt-0.5">
              {t("tagline_Dashboard")}
            </span>
          </div>
        </div>

        <nav className="flex gap-6 order-3 sm:order-none w-full sm:w-auto justify-center sm:justify-start">
          {[
            t("nav_home_Dashboard"),
            t("nav_stats_Dashboard"),
            t("nav_badges_Dashboard"),
            t("nav_courses_Dashboard")
          ].map((item, i) => (
            <a
              key={item}
              href="#"
              className={`text-sm font-semibold transition-colors ${
                i === 0 ? "text-[#ECEEF3]" : "text-[#9AA1B4] hover:text-[#ECEEF3]"
              }`}
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {/* Language switcher */}
          <div className="flex items-center bg-[#242938] border border-[#2E3444] rounded-full p-1 text-xs font-semibold font-mono">
            {["en", "ps", "da"].map((code) => (
              <button
                key={code}
                onClick={() => setLang(code)}
                className={`px-2.5 py-1 rounded-full transition-colors ${
                  lang === code
                    ? "bg-[#E8A33D] text-[#1a1508]"
                    : "text-[#9AA1B4] hover:text-[#ECEEF3]"
                }`}
              >
                {code.toUpperCase()}
              </button>
            ))}
          </div>

          {/* User profile with logout button */}
          <div className="flex items-center gap-2.5 bg-[#242938] py-1.5 pe-3.5 ps-1.5 rounded-full border border-[#2E3444] text-[13px]">
            <span>{user}</span>
            <button
              onClick={onLogout}
              className="w-7 h-7 rounded-full bg-[#E8615A] flex items-center justify-center font-bold text-white text-xs font-mono hover:bg-[#d4534d] transition-colors"
              title="Logout"
            >
              ✕
            </button>
          </div>
        </div>
      </header>

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5">
        {/* Lesson list */}
        <div className="bg-[#1D212C] border border-[#2E3444] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-extrabold">{t("myPlans_Dashboard")}</h2>
            <button className="border border-[#2E3444] text-[#ECEEF3] px-3.5 py-2 rounded-[10px] text-[13px] font-semibold hover:border-[#E8A33D] hover:text-[#E8A33D] transition-colors">
              {t("addPlan_Dashboard")}
            </button>
          </div>

          <div>
            {LESSONS.map((l, idx) => (
              <div
                key={idx}
                className="grid grid-cols-[44px_1fr_auto_80px] sm:grid-cols-[46px_1fr_130px_90px] items-center gap-3 sm:gap-4 py-3.5 px-2 rounded-xl border-b border-[#2E3444] last:border-b-0 hover:bg-[#242938] transition-colors"
              >
                <div
                  className="w-11 h-11 rounded-[10px] flex items-center justify-center text-lg font-extrabold font-mono"
                  style={{
                    background: `${l.color}22`,
                    color: l.color,
                    border: `1px solid ${l.color}55`,
                  }}
                >
                  {l.icon}
                </div>
                <div className="min-w-0">
                  <div className="text-[14.5px] font-bold truncate">{l.title[lang]}</div>
                  <div className="text-xs text-[#9AA1B4] mt-0.5 truncate">{l.sub[lang]}</div>
                  <div className="h-1.5 bg-[#0f1218] rounded-full mt-1.5 overflow-hidden">
                    <span
                      className="block h-full rounded-full"
                      style={{
                        width: `${l.progress}%`,
                        background: "linear-gradient(90deg, #C9832A, #E8A33D)",
                      }}
                    />
                  </div>
                </div>
                <div className="text-xs text-[#9AA1B4] hidden sm:block">
                  {t("score_Dashboard")}: <b className="text-[#ECEEF3] font-mono font-semibold">{l.score}</b>
                  <br />
                  {t("stars_Dashboard")}: <b className="text-[#ECEEF3] font-mono font-semibold">{l.stars}</b>
                </div>
                <button className="bg-[#4FC38A] text-[#08281a] rounded-[10px] py-2 font-extrabold text-[13px] w-full active:translate-y-0.5 transition-transform shadow-[0_3px_0_#34946a] active:shadow-none">
                  {t("start_Dashboard")}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <div className="bg-[#1D212C] border border-[#2E3444] rounded-2xl p-5">
            <h2 className="text-base font-extrabold mb-4">{t("typingSpeed_Dashboard")}</h2>
            <div className="relative bg-[#0f1218] rounded-[10px] h-[34px] overflow-hidden mb-3.5">
              <div
                className="absolute inset-0 rounded-[10px] flex items-center justify-between px-3 font-mono font-bold text-xs text-[#08281a]"
                style={{
                  width: "62%",
                  background: "linear-gradient(90deg, rgba(79,195,138,0.16), #4FC38A)",
                }}
              >
                <span>{t("currentSpeed_Dashboard")}</span>
                <span>36 WPM</span>
              </div>
            </div>
            <div className="flex items-center justify-between py-2.5 border-b border-[#2E3444] text-[13px]">
              <span className="text-[#9AA1B4]">{t("lastWeek_Dashboard")}</span>
              <span className="font-mono font-bold">31 WPM</span>
            </div>
            <div className="flex items-center justify-between py-2.5 text-[13px]">
              <span className="text-[#9AA1B4]">{t("lastMonth_Dashboard")}</span>
              <span className="font-mono font-bold">27 WPM</span>
            </div>
          </div>

          <div className="bg-[#1D212C] border border-[#2E3444] rounded-2xl p-5">
            <h2 className="text-base font-extrabold mb-4">{t("practiceTime_Dashboard")}</h2>
            <div className="flex justify-between">
              {rings.map((r, i) => (
                <Ring key={i} pct={r.pct} label={r.label} value={r.value} />
              ))}
            </div>
          </div>

          <div className="bg-[#1D212C] border border-[#2E3444] rounded-2xl p-5">
            <h2 className="text-base font-extrabold mb-4">{t("overall_Dashboard")}</h2>
            <div className="grid grid-cols-2 gap-3.5">
              <div className="bg-[#242938] border border-[#2E3444] rounded-xl p-3.5 text-center">
                <div className="font-mono text-2xl font-extrabold text-[#E8A33D]">74%</div>
                <div className="text-[11.5px] text-[#9AA1B4] mt-1">{t("keyboardCoverage_Dashboard")}</div>
              </div>
              <div className="bg-[#242938] border border-[#2E3444] rounded-xl p-3.5 text-center">
                <div className="font-mono text-2xl font-extrabold text-[#4FC38A]">94%</div>
                <div className="text-[11.5px] text-[#9AA1B4] mt-1">{t("accuracy_Dashboard")}</div>
              </div>
            </div>
            <div className="flex items-center justify-between pt-3.5 mt-3.5 border-t border-[#2E3444] text-[13px]">
              <span className="text-[#9AA1B4]">{t("totalActive_Dashboard")}</span>
              <span className="font-mono font-bold">31h 40m</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}