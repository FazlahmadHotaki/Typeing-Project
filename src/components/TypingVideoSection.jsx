// components/KeyboardActivity.jsx
// Technology: The Keyboard Activity
// Color the keys that make up your name
// Uses central translations from data/translations.js

import React, { useState, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import translations from '../data/translations';

// ============================================
// PASHTO KEYBOARD LAYOUT
// ============================================
const keyboardLayout = [
  {
    id: 'row1',
    keys: [
      { en: '`', ps: '`' },
      { en: '1', ps: '۱' },
      { en: '2', ps: '۲' },
      { en: '3', ps: '۳' },
      { en: '4', ps: '۴' },
      { en: '5', ps: '۵' },
      { en: '6', ps: '۶' },
      { en: '7', ps: '۷' },
      { en: '8', ps: '۸' },
      { en: '9', ps: '۹' },
      { en: '0', ps: '۰' },
      { en: '-', ps: '-' },
      { en: '=', ps: '=' },
    ]
  },
  {
    id: 'row2',
    keys: [
      { en: 'Q', ps: 'ض' },
      { en: 'W', ps: 'ص' },
      { en: 'E', ps: 'ث' },
      { en: 'R', ps: 'ق' },
      { en: 'T', ps: 'ف' },
      { en: 'Y', ps: 'غ' },
      { en: 'U', ps: 'ع' },
      { en: 'I', ps: 'ه' },
      { en: 'O', ps: 'خ' },
      { en: 'P', ps: 'ح' },
      { en: '[', ps: 'ج' },
      { en: ']', ps: 'چ' },
      { en: '\\', ps: '\\' },
    ]
  },
  {
    id: 'row3',
    keys: [
      { en: 'A', ps: 'ق' },
      { en: 'S', ps: 'و' },
      { en: 'D', ps: 'ع' },
      { en: 'F', ps: 'ر' },
      { en: 'G', ps: 'ت' },
      { en: 'H', ps: 'ې' },
      { en: 'J', ps: 'ی' },
      { en: 'K', ps: 'ړ' },
      { en: 'L', ps: 'و' },
      { en: ';', ps: 'پ' },
      { en: "'", ps: "'" },
    ]
  },
  {
    id: 'row4',
    keys: [
      { en: 'Z', ps: 'ظ' },
      { en: 'X', ps: 'ط' },
      { en: 'C', ps: 'ز' },
      { en: 'V', ps: 'ژ' },
      { en: 'B', ps: 'ب' },
      { en: 'N', ps: 'ن' },
      { en: 'M', ps: 'م' },
      { en: ',', ps: '،' },
      { en: '.', ps: '.' },
      { en: '/', ps: '/' },
    ]
  },
];

// ============================================
// LANGUAGE DETECTION HELPERS
// ============================================
const isPashtoChar = (char) => {
  const code = char.charCodeAt(0);
  return (code >= 0x0600 && code <= 0x06FF) ||
    ['ډ', 'ړ', 'ږ', 'ښ', 'ګ', 'ڼ', 'ې', 'ۍ', 'ژ', 'چ', 'پ', 'ټ', 'ک', 'ی', 'و', 'ه', 'ن', 'م'].includes(char);
};

const isEnglishChar = (char) => {
  const code = char.charCodeAt(0);
  return (code >= 0x0041 && code <= 0x005A) || (code >= 0x0061 && code <= 0x007A);
};

// ============================================
// MAIN COMPONENT
// ============================================
const KeyboardActivity = () => {
  // Use LanguageContext
  const { lang } = useLanguage();

  // Translation function (same pattern as Signup.jsx)
  const t = (key) => {
    return translations[lang]?.[key] || key;
  };

  // RTL detection
  const isRTL = lang === 'ps' || lang === 'da';

  // State
  const [userName, setUserName] = useState('');
  const [coloredKeys, setColoredKeys] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showLangWarning, setShowLangWarning] = useState(false);
  const [hasEnglishChars, setHasEnglishChars] = useState(false);
  const [hasPashtoChars, setHasPashtoChars] = useState(false);
  const inputRef = useRef(null);

  // Handle name change with language detection
  const handleNameChange = (e) => {
    const name = e.target.value;
    setUserName(name);

    // Detect if name contains English or Pashto characters
    let hasEnglish = false;
    let hasPashto = false;

    for (let char of name) {
      if (isEnglishChar(char)) hasEnglish = true;
      if (isPashtoChar(char)) hasPashto = true;
    }

    setHasEnglishChars(hasEnglish);
    setHasPashtoChars(hasPashto);

    // Show warning if user is typing English but keyboard is set to Pashto/Dari
    if (hasEnglish && !hasPashto && (lang === 'ps' || lang === 'da')) {
      setShowLangWarning(true);
    } else {
      setShowLangWarning(false);
    }

    updateColoredKeys(name);
  };

  // Update colored keys based on name
  const updateColoredKeys = (name) => {
    if (!name) {
      setColoredKeys([]);
      setIsAnimating(false);
      return;
    }

    const chars = name.split('');
    const uniqueKeys = [...new Set(chars)];
    setColoredKeys(uniqueKeys);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 2000);
  };

  // Check if a key should be colored
  const isKeyColored = (keyObj) => {
    if (!userName) return false;
    const nameChars = userName.split('');
    return nameChars.some(char => {
      return char === keyObj.en || char === keyObj.ps ||
        char.toUpperCase() === keyObj.en ||
        char === keyObj.en.toLowerCase();
    });
  };

  // Get display text for a key based on language
  const getKeyDisplay = (keyObj) => {
    if (lang === 'ps' || lang === 'da') {
      return keyObj.ps;
    }
    return keyObj.en;
  };

  // Reset everything
  const handleReset = () => {
    setUserName('');
    setColoredKeys([]);
    setIsAnimating(false);
    setShowLangWarning(false);
    setHasEnglishChars(false);
    setHasPashtoChars(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Dismiss language warning
  const dismissWarning = () => {
    setShowLangWarning(false);
  };

  return (
    <section
      className="keyboard-activity min-h-screen py-12 px-4"
      style={{
        background: '#f5f7fa',
        fontFamily: isRTL ? '"Noto Sans Arabic", "Vazirmatn", sans-serif' : 'inherit'
      }}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="container mx-auto max-w-5xl">

        {/* ===== HEADER ===== */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
            {t('keyboard.title')}
          </h1>
          <p className="text-lg text-[#C9A15E] font-medium">
            {t('keyboard.subtitle')}
          </p>
          <p className="text-gray-500 mt-2 max-w-lg mx-auto">
            {t('keyboard.description')}
          </p>
        </div>

        {/* ===== LANGUAGE WARNING BANNER ===== */}
        {showLangWarning && (
          <div className="max-w-2xl mx-auto mb-6 animate-fadeIn">
            <div className="bg-amber-50 border-l-4 border-amber-500 rounded-xl p-5 shadow-md">
              <div className="flex items-start gap-3">
                <div className="text-2xl">⚠️</div>
                <div className="flex-1">
                  <h4 className="text-amber-800 font-bold text-sm uppercase tracking-wider">
                    {t('keyboard.langWarningTitle')}
                  </h4>
                  <p className="text-amber-700 text-sm mt-1">
                    {t('keyboard.langWarningMessage')}
                  </p>

                  <div className="mt-3 bg-amber-100/50 rounded-lg p-3">
                    <p className="text-amber-800 text-xs font-semibold">
                      {t('keyboard.langWarningAction')}
                    </p>
                    <ul className="mt-1 space-y-1">
                      <li className="text-amber-700 text-xs flex items-center gap-2">
                        <span className="text-amber-500">•</span>
                        {t('keyboard.langWarningStep1')}
                      </li>
                      <li className="text-amber-700 text-xs flex items-center gap-2">
                        <span className="text-amber-500">•</span>
                        {t('keyboard.langWarningStep2')}
                      </li>
                      <li className="text-amber-700 text-xs flex items-center gap-2">
                        <span className="text-amber-500">•</span>
                        {t('keyboard.langWarningStep3')}
                      </li>
                    </ul>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      onClick={dismissWarning}
                      className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium rounded-lg transition-all duration-300"
                    >
                      {t('keyboard.langDismiss')}
                    </button>
                    <button
                      onClick={dismissWarning}
                      className="px-4 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-700 text-xs font-medium rounded-lg transition-all duration-300"
                    >
                      {t('keyboard.langIgnore')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===== INPUT SECTION ===== */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <label className="text-gray-700 font-semibold text-sm uppercase tracking-wider">
                {t('keyboard.namePrompt')}
              </label>
              {/* Language indicator */}
              {userName && (
                <span className={`text-xs px-3 py-1 rounded-full ${hasPashtoChars && !hasEnglishChars
                    ? 'bg-green-100 text-green-700'
                    : hasEnglishChars && !hasPashtoChars
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                  {hasPashtoChars && !hasEnglishChars
                    ? t('keyboard.typingInPashto')
                    : hasEnglishChars && !hasPashtoChars
                      ? '🔤 ' + t('keyboard.typingInEnglish')
                      : hasEnglishChars && hasPashtoChars
                        ? '🌍 ' + t('keyboard.mixed')
                        : ''}
                </span>
              )}
            </div>

            <div className="flex gap-3">
              <input
                ref={inputRef}
                type="text"
                value={userName}
                onChange={handleNameChange}
                placeholder={t('keyboard.placeholder')}
                className={`flex-1 px-6 py-3 rounded-xl bg-gray-50 border-2 text-gray-800 text-lg focus:outline-none transition-all duration-300 ${showLangWarning
                    ? 'border-amber-400 focus:border-amber-500 shadow-[0_0_0_4px_rgba(251,191,36,0.1)]'
                    : 'border-gray-200 focus:border-[#C9A15E]'
                  }`}
                dir={isRTL ? 'rtl' : 'ltr'}
                autoFocus
              />
              <button
                onClick={handleReset}
                className="px-5 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition-all duration-300"
                title={t('keyboard.reset')}
              >
                🔄
              </button>
            </div>

            {/* Stats */}
            {userName && (
              <div className="mt-4 flex flex-wrap items-center justify-between text-sm gap-2">
                <span className="text-gray-600">
                  {t('keyboard.stats')}: <span className="text-[#C9A15E] font-bold text-lg">{coloredKeys.length}</span>
                </span>
                <span className="text-gray-600">
                  {t('keyboard.coloredKeysLabel')}:
                  <span className="ml-2 text-gray-800 font-mono">
                    {coloredKeys.join(' ') || '—'}
                  </span>
                </span>
              </div>
            )}

            {/* Empty state message */}
            {!userName && (
              <div className="mt-4 text-center text-gray-400 text-sm animate-pulse">
                {t('keyboard.startTyping')}
              </div>
            )}
          </div>
        </div>

        {/* ===== KEYBOARD ===== */}
        <div className="relative max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-gray-100">
            {/* Keyboard Label */}
            <div className="text-center mb-4">
              <span className="text-xs text-gray-400 uppercase tracking-widest">
                {t('keyboard.keyboardLabel')} — {t('keyboard.fillPrompt')}
              </span>
            </div>

            {/* Keyboard Rows */}
            {keyboardLayout.map((row, rowIndex) => (
              <div
                key={row.id}
                className="flex justify-center gap-1 md:gap-1.5 mb-1 md:mb-1.5"
              >
                {/* Row offset */}
                <div style={{ width: rowIndex === 0 ? 0 : rowIndex === 1 ? 12 : rowIndex === 2 ? 24 : 36 }} />

                {row.keys.map((keyObj) => {
                  const colored = isKeyColored(keyObj);
                  const displayText = getKeyDisplay(keyObj);

                  return (
                    <div
                      key={keyObj.en}
                      className={`
                        relative w-10 h-10 md:w-14 md:h-14 rounded-xl flex flex-col items-center justify-center 
                        text-xs md:text-sm font-mono font-bold transition-all duration-300
                        ${colored
                          ? 'bg-[#C9A15E] text-white shadow-md shadow-[#C9A15E]/30 scale-105'
                          : 'bg-gray-50 text-gray-400 hover:bg-gray-100 border border-gray-200'
                        }
                      `}
                      style={{
                        transform: colored ? 'translateY(-2px)' : 'none',
                        transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      }}
                    >
                      {/* Show both English and Pashto */}
                      {lang === 'ps' || lang === 'da' ? (
                        <>
                          <span className="text-[8px] md:text-[10px] text-gray-400/60">{keyObj.en}</span>
                          <span className="text-sm md:text-lg font-bold">{displayText}</span>
                        </>
                      ) : (
                        <span className="text-sm md:text-lg font-bold">{displayText}</span>
                      )}

                      {/* Sparkle on colored keys */}
                      {colored && isAnimating && (
                        <div className="absolute -top-1 -right-1 text-xs animate-bounce">
                          ✨
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}

            {/* ===== LEGEND ===== */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-lg bg-[#C9A15E] shadow-md shadow-[#C9A15E]/30" />
                <span className="text-gray-600">{t('keyboard.colored')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-lg bg-gray-50 border border-gray-200" />
                <span className="text-gray-400">{t('keyboard.uncolored')}</span>
              </div>
              {userName && (
                <div className="flex items-center gap-2 text-gray-600 border-l border-gray-200 pl-6">
                  <span>🎯</span>
                  <span className="font-mono text-[#C9A15E] font-bold">{coloredKeys.length}</span>
                  <span className="text-gray-400">{t('keyboard.stats')}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ===== FOOTER ===== */}
        <div className="text-center mt-10">
          <span className="text-gray-400 text-xs tracking-wider">
            {t('keyboard.footer')}
          </span>
        </div>

      </div>

      {/* ===== INLINE STYLES ===== */}
      <style jsx>{`
        /* RTL support */
        [dir="rtl"] .keyboard-activity .flex {
          flex-direction: row-reverse;
        }
        [dir="rtl"] .keyboard-activity .flex.gap-3 {
          flex-direction: row-reverse;
        }

        /* Animations */
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.4s ease forwards;
        }

        /* Responsive */
        @media (max-width: 640px) {
          .keyboard-activity .w-10 {
            width: 32px !important;
            height: 32px !important;
          }
          .keyboard-activity .w-10 span:last-child {
            font-size: 11px !important;
          }
          .keyboard-activity .w-10 span:first-child {
            font-size: 6px !important;
          }
          .keyboard-activity .gap-1 {
            gap: 2px;
          }
          .keyboard-activity .p-6 {
            padding: 12px;
          }
          .keyboard-activity h1 {
            font-size: 1.8rem;
          }
        }

        @media (max-width: 480px) {
          .keyboard-activity .w-10 {
            width: 26px !important;
            height: 26px !important;
            border-radius: 6px;
          }
          .keyboard-activity .w-10 span:last-child {
            font-size: 9px !important;
          }
          .keyboard-activity .w-10 span:first-child {
            font-size: 5px !important;
          }
          .keyboard-activity .gap-1 {
            gap: 1.5px;
          }
          .keyboard-activity .p-6 {
            padding: 8px;
          }
          .keyboard-activity input {
            font-size: 13px;
            padding: 8px 12px;
          }
        }

        ::selection {
          background: #C9A15E;
          color: #fff;
        }
      `}</style>
    </section>
  );
};

export default KeyboardActivity;