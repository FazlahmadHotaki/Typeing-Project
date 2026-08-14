// KeyTrackDashboard.jsx
import React, { useState, useMemo } from "react";
import translations from "../data/translations";
import { LESSONS } from "../data/lessons";
import MouseCursor from "./MouseCursor";
import Nav from "./Nav";
import ChartComponent from "../chart-JS/ChartComponent";
import { useLanguage } from "../context/LanguageContext";

function Ring({ pct, label, value }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[70px] h-[70px]">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 70 70">
          {/* Background circle */}
          <circle
            cx="35"
            cy="35"
            r={r}
            fill="none"
            stroke="#0f1218"
            strokeWidth="5"
          />
          {/* Progress circle */}
          <circle
            cx="35"
            cy="35"
            r={r}
            fill="none"
            stroke="#4FC38A"
            strokeWidth="5"
            strokeDasharray={c}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.5s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-white">{pct}%</span>
        </div>
      </div>
      <span className="text-[10px] text-[#9AA1B4] mt-1.5 text-center leading-tight">{label}</span>
      <span className="text-[11px] font-bold text-white mt-0.5">{value}</span>
    </div>
  );
}

export default function KeyTrackDashboard({ user = "Fazl Ahmad", onLogout }) {
  const { lang } = useLanguage();
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
    [t]
  );

  return (
    <div className="min-h-screen bg-[#e7bc91] text-white p-5 sm:p-8 " dir={isRtl ? "rtl" : "ltr"}>
      
      {/* Header */}
      <Nav showGetStarted={false} /> 
      <MouseCursor />

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] mt-10 gap-5">
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
      <div className="bg-gray-800">
              <ChartComponent />
      </div>
    </div>
  );
}