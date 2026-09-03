// components/KeyboardActivity.jsx
// Technology: The Keyboard Activity

import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import translations from '../data/translations';

/* =========================================================
   NATIVE KEYBOARD LAYOUT
========================================================= */

const keyboardLayout = [
  {
    id: 'numbers',
    keys: [
      { en: '`', ps: '`', da: '`' },
      { en: '1', ps: '۱', da: '۱' },
      { en: '2', ps: '۲', da: '۲' },
      { en: '3', ps: '۳', da: '۳' },
      { en: '4', ps: '۴', da: '۴' },
      { en: '5', ps: '۵', da: '۵' },
      { en: '6', ps: '۶', da: '۶' },
      { en: '7', ps: '۷', da: '۷' },
      { en: '8', ps: '۸', da: '۸' },
      { en: '9', ps: '۹', da: '۹' },
      { en: '0', ps: '۰', da: '۰' },
      { en: '-', ps: '-', da: '-' },
      { en: '=', ps: '=', da: '=' },
    ],
  },

  {
    id: 'top',
    keys: [
      { en: 'Q', ps: 'ض', da: 'ض' },
      { en: 'W', ps: 'ص', da: 'ص' },
      { en: 'E', ps: 'ث', da: 'ث' },
      { en: 'R', ps: 'ق', da: 'ق' },
      { en: 'T', ps: 'ف', da: 'ف' },
      { en: 'Y', ps: 'غ', da: 'غ' },
      { en: 'U', ps: 'ع', da: 'ع' },
      { en: 'I', ps: 'ه', da: 'ه' },
      { en: 'O', ps: 'خ', da: 'خ' },
      { en: 'P', ps: 'ح', da: 'ح' },
      { en: '[', ps: 'ج', da: 'ج' },
      { en: ']', ps: 'چ', da: 'چ' },
      { en: '\\', ps: '\\', da: '\\' },
    ],
  },

  {
    id: 'middle',
    keys: [
      { en: 'A', ps: 'ا', da: 'ا' },
      { en: 'S', ps: 'س', da: 'س' },
      { en: 'D', ps: 'د', da: 'د' },
      { en: 'F', ps: 'ر', da: 'ر' },
      { en: 'G', ps: 'ت', da: 'ت' },
      { en: 'H', ps: 'ې', da: 'ی' },
      { en: 'J', ps: 'ی', da: 'ج' },
      { en: 'K', ps: 'ک', da: 'ک' },
      { en: 'L', ps: 'ل', da: 'ل' },
      { en: ';', ps: '؛', da: '؛' },
      { en: "'", ps: "'", da: "'" },
    ],
  },

  {
    id: 'bottom',
    keys: [
      { en: 'Z', ps: 'ظ', da: 'ظ' },
      { en: 'X', ps: 'ط', da: 'ط' },
      { en: 'C', ps: 'ز', da: 'ز' },
      { en: 'V', ps: 'ژ', da: 'ژ' },
      { en: 'B', ps: 'ب', da: 'ب' },
      { en: 'N', ps: 'ن', da: 'ن' },
      { en: 'M', ps: 'م', da: 'م' },
      { en: ',', ps: '،', da: '،' },
      { en: '.', ps: '.', da: '.' },
      { en: '/', ps: '/', da: '/' },
    ],
  },
];

/* =========================================================
   LANGUAGE DETECTION
========================================================= */

const pashtoChars =
  'اټثجځڅحخدډذرړزژسښږشصضطظعغفقکګلمنڼوؤهءیۍې';

const dariChars =
  'اآبپتثجچحخدذرزژسشصضطظعغفقکگلمنهوی';

const isEnglishChar = (char) => /^[A-Za-z]$/.test(char);

const isPashtoChar = (char) => pashtoChars.includes(char);

const isDariChar = (char) => dariChars.includes(char);

/* =========================================================
   COMPONENT
========================================================= */

const KeyboardActivity = () => {
  const { lang } = useLanguage();

  const t = (key) => {
    return (
      translations[lang]?.[key] ||
      translations.en?.[key] ||
      key
    );
  };

  const isRTL = lang === 'ps' || lang === 'da';

  const [userName, setUserName] = useState('');
  const [coloredKeys, setColoredKeys] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showLangWarning, setShowLangWarning] = useState(false);
  const [hasEnglishChars, setHasEnglishChars] = useState(false);
  const [hasPashtoChars, setHasPashtoChars] = useState(false);

  const inputRef = useRef(null);
  const animationTimer = useRef(null);

  /* =========================================================
     FOCUS + CLEANUP
  ========================================================= */

  useEffect(() => {
    inputRef.current?.focus();

    return () => {
      if (animationTimer.current) {
        clearTimeout(animationTimer.current);
      }
    };
  }, []);

  /* =========================================================
     UPDATE KEYBOARD
  ========================================================= */

  const updateColoredKeys = (value) => {
    if (!value) {
      setColoredKeys([]);
      setIsAnimating(false);
      return;
    }

    const uniqueCharacters = [...new Set([...value])];

    const matches = [];

    keyboardLayout.forEach((row) => {
      row.keys.forEach((key) => {
        const possibleCharacters = [
          key.en,
          key.en.toLowerCase(),
          key.ps,
          key.da,
        ];

        const found = uniqueCharacters.some((char) =>
          possibleCharacters.includes(char)
        );

        if (found) {
          matches.push(key.en);
        }
      });
    });

    setColoredKeys(matches);
    setIsAnimating(true);

    if (animationTimer.current) {
      clearTimeout(animationTimer.current);
    }

    animationTimer.current = setTimeout(() => {
      setIsAnimating(false);
    }, 600);
  };

  /* =========================================================
     INPUT
  ========================================================= */

  const handleNameChange = (event) => {
    const value = event.target.value;

    setUserName(value);

    const characters = [...value];

    const english = characters.some(isEnglishChar);

    const pashto =
      characters.some(isPashtoChar) ||
      characters.some(isDariChar);

    setHasEnglishChars(english);
    setHasPashtoChars(pashto);

    if (
      english &&
      (lang === 'ps' || lang === 'da')
    ) {
      setShowLangWarning(true);
    } else if (!english) {
      setShowLangWarning(false);
    }

    updateColoredKeys(value);
  };

  /* =========================================================
     RESET
  ========================================================= */

  const handleReset = () => {
    setUserName('');
    setColoredKeys([]);
    setHasEnglishChars(false);
    setHasPashtoChars(false);
    setShowLangWarning(false);
    setIsAnimating(false);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  /* =========================================================
     KEY DISPLAY
  ========================================================= */

  const getKeyDisplay = (key) => {
    if (lang === 'ps') return key.ps;

    if (lang === 'da') return key.da;

    return key.en;
  };

  /* =========================================================
     KEY CHECK
  ========================================================= */

  const isKeyColored = (key) => {
    return coloredKeys.includes(key.en);
  };

  /* =========================================================
     WARNING
  ========================================================= */

  const dismissWarning = () => {
    setShowLangWarning(false);
  };

  /* =========================================================
     STATUS
  ========================================================= */

  const getTypingStatus = () => {
    if (!userName) return null;

    if (hasEnglishChars && hasPashtoChars) {
      return `🌍 ${t('keyboard.mixed')}`;
    }

    if (hasEnglishChars) {
      return `🔤 ${t('keyboard.typingInEnglish')}`;
    }

    if (hasPashtoChars) {
      return `🎉 ${t('keyboard.typingInPashto')}`;
    }

    return null;
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <main
      className="keyboard-page"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <style>{`

        /* ================================================
           PAGE
        ================================================ */

        .keyboard-page {
          min-height: 100vh;
          padding: 50px 20px 35px;
          background:
            linear-gradient(
              180deg,
              #ffffff 0%,
              #f8f9fc 100%
            );
          color: #1f2937;
          overflow: hidden;
        }

        .keyboard-container {
          width: 100%;
          max-width: 1250px;
          margin: 0 auto;
        }

        /* ================================================
           HERO
        ================================================ */

        .keyboard-hero {
          text-align: center;
          margin-bottom: 40px;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 7px 14px;
          margin-bottom: 18px;
          border: 1px solid #e5e7eb;
          border-radius: 999px;
          background: #ffffff;
          color: #6366f1;
          font-size: 12px;
          font-weight: 800;
          box-shadow:
            0 5px 20px rgba(0, 0, 0, 0.04);
        }

        .hero-badge-icon {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 7px;
          background: #eef2ff;
        }

        .hero-title {
          margin: 0;
          color: #111827;
          font-size: clamp(38px, 6vw, 64px);
          line-height: 1.05;
          font-weight: 900;
          letter-spacing: -2.5px;
        }

        .hero-title-accent {
          color: #6366f1;
        }

        .hero-subtitle {
          max-width: 680px;
          margin: 16px auto 6px;
          color: #4b5563;
          font-size: 18px;
          line-height: 1.7;
        }

        .hero-description {
          margin: 0;
          color: #9ca3af;
          font-size: 13px;
        }

        /* ================================================
           GRID
        ================================================ */

        .keyboard-content {
          display: grid;
          grid-template-columns: 340px minmax(0, 1fr);
          gap: 22px;
          align-items: start;
        }

        /* ================================================
           CARD
        ================================================ */

        .keyboard-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 24px;
          box-shadow:
            0 15px 45px rgba(17, 24, 39, 0.06);
        }

        /* ================================================
           NAME CARD
        ================================================ */

        .name-card {
          padding: 24px;
        }

        .section-heading {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 22px;
        }

        .section-icon {
          width: 43px;
          height: 43px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 13px;
          background: #eef2ff;
          font-size: 19px;
        }

        .section-heading h2 {
          margin: 0;
          color: #1f2937;
          font-size: 15px;
          font-weight: 850;
        }

        .section-heading p {
          margin: 3px 0 0;
          color: #9ca3af;
          font-size: 11px;
        }

        /* ================================================
           INPUT
        ================================================ */

        .input-label {
          display: block;
          margin-bottom: 8px;
          color: #374151;
          font-size: 12px;
          font-weight: 800;
        }

        .input-wrapper {
          position: relative;
        }

        .name-input {
          width: 100%;
          height: 56px;
          box-sizing: border-box;
          padding: 0 52px 0 16px;
          border: 1px solid #dfe3ea;
          border-radius: 14px;
          outline: none;
          background: #f9fafb;
          color: #111827;
          font-size: 17px;
          font-weight: 650;
          transition: all .25s ease;
        }

        .name-input::placeholder {
          color: #a1a8b3;
          font-weight: 400;
        }

        .name-input:focus {
          background: #ffffff;
          border-color: #818cf8;
          box-shadow:
            0 0 0 4px rgba(99, 102, 241, .08);
        }

        .rtl-input {
          text-align: right;
          padding: 0 16px 0 52px;
        }

        .reset-button {
          position: absolute;
          top: 50%;
          right: 8px;
          transform: translateY(-50%);
          width: 39px;
          height: 39px;
          border: 0;
          border-radius: 10px;
          background: #eef2ff;
          color: #6366f1;
          cursor: pointer;
          font-size: 20px;
          transition: all .2s ease;
        }

        .reset-button:hover {
          background: #6366f1;
          color: white;
          transform:
            translateY(-50%)
            rotate(-30deg);
        }

        .rtl-reset {
          right: auto;
          left: 8px;
        }

        /* ================================================
           PREVIEW
        ================================================ */

        .name-preview {
          min-height: 135px;
          margin-top: 18px;
          padding: 18px;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          border: 1px solid #e5e7eb;
          border-radius: 18px;
          background:
            linear-gradient(
              135deg,
              #f5f7ff,
              #fafaff
            );
          overflow: hidden;
        }

        .preview-name {
          max-width: 100%;
          word-break: break-word;
          color: #4f46e5;
          font-size: clamp(27px, 4vw, 42px);
          line-height: 1.2;
          font-weight: 900;
        }

        .preview-empty {
          color: #a1a8b3;
          font-size: 12px;
        }

        /* ================================================
           STATUS
        ================================================ */

        .typing-status {
          margin-top: 12px;
          padding: 9px 12px;
          border: 1px solid #e0e7ff;
          border-radius: 10px;
          background: #f5f7ff;
          color: #5b5bd6;
          font-size: 11px;
          font-weight: 750;
          text-align: center;
        }

        /* ================================================
           STATS
        ================================================ */

        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 9px;
          margin-top: 14px;
        }

        .stat-box {
          padding: 14px;
          border: 1px solid #edf0f4;
          border-radius: 14px;
          background: #fafbfc;
        }

        .stat-icon {
          margin-bottom: 5px;
          font-size: 15px;
        }

        .stat-value {
          color: #111827;
          font-size: 23px;
          line-height: 1;
          font-weight: 900;
        }

        .stat-label {
          margin-top: 5px;
          color: #9ca3af;
          font-size: 9px;
          line-height: 1.4;
        }

        /* ================================================
           WARNING
        ================================================ */

        .warning-card {
          margin-bottom: 22px;
          padding: 18px;
          border: 1px solid #f2dfad;
          border-radius: 17px;
          background: #fffbf2;
          animation: warningIn .3s ease;
        }

        .warning-title {
          margin-bottom: 6px;
          color: #9a6700;
          font-size: 13px;
          font-weight: 900;
        }

        .warning-message {
          color: #77694e;
          font-size: 12px;
          line-height: 1.7;
        }

        .warning-action {
          margin-top: 11px;
          color: #9a6700;
          font-size: 11px;
          font-weight: 800;
        }

        .warning-list {
          margin: 7px 0 0;
          padding-inline-start: 20px;
          color: #77694e;
          font-size: 11px;
          line-height: 1.8;
        }

        .warning-buttons {
          display: flex;
          gap: 7px;
          flex-wrap: wrap;
          margin-top: 12px;
        }

        .warning-button {
          padding: 7px 12px;
          border: 1px solid #ead49a;
          border-radius: 8px;
          background: white;
          color: #8a6200;
          cursor: pointer;
          font-size: 10px;
          font-weight: 750;
          transition: .2s ease;
        }

        .warning-button:hover {
          background: #a56a00;
          border-color: #a56a00;
          color: white;
        }

        /* ================================================
           KEYBOARD CARD
        ================================================ */

        .keyboard-main {
          padding: 24px;
          min-width: 0;
        }

        .keyboard-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          margin-bottom: 20px;
        }

        .keyboard-title-area {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .keyboard-icon {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          background: #6366f1;
          color: white;
          font-size: 19px;
          box-shadow:
            0 8px 20px rgba(99, 102, 241, .22);
        }

        .keyboard-title {
          margin: 0;
          color: #1f2937;
          font-size: 16px;
          font-weight: 900;
        }

        .keyboard-subtitle {
          margin: 3px 0 0;
          color: #9ca3af;
          font-size: 10px;
        }

        .live-indicator {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 7px 10px;
          border-radius: 999px;
          background: #f0fdf4;
          color: #269956;
          font-size: 9px;
          font-weight: 850;
        }

        .live-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #34b768;
          box-shadow:
            0 0 0 4px rgba(52,183,104,.1);
        }

        /* ================================================
           KEYBOARD DECK
        ================================================ */

        .keyboard-deck {
          padding: 20px;
          border: 1px solid #dfe3e9;
          border-radius: 20px;
          background:
            linear-gradient(
              145deg,
              #eef1f5,
              #e4e8ee
            );
          box-shadow:
            inset 0 1px rgba(255,255,255,.9),
            0 10px 25px rgba(31,41,55,.07);
        }

        .keyboard-row {
          display: flex;
          justify-content: center;
          gap: 6px;
          margin-bottom: 8px;
        }

        /* ================================================
           KEY
        ================================================ */

        .keyboard-key {
          flex: 1;
          min-width: 0;
          max-width: 66px;
          height: 55px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #d1d6df;
          border-radius: 11px;
          background:
            linear-gradient(
              145deg,
              #ffffff,
              #f1f3f6
            );
          color: #596476;
          font-size: 14px;
          font-weight: 850;
          user-select: none;
          box-shadow:
            0 4px 0 #c5cad2,
            0 7px 13px rgba(31,41,55,.08);
          transition:
            transform .18s ease,
            background .25s ease,
            color .25s ease,
            box-shadow .25s ease;
        }

        .keyboard-key:hover {
          transform: translateY(-2px);
          border-color: #b9b8ed;
          color: #5b55c8;
        }

        .keyboard-key.active {
          color: white;
          border-color: #7770e9;
          background:
            linear-gradient(
              145deg,
              #7770e9,
              #554bc8
            );
          box-shadow:
            0 4px 0 #40389f,
            0 9px 22px rgba(99,102,241,.28);
        }

        .keyboard-key.active:hover {
          color: white;
        }

        .keyboard-key.animate {
          animation: keyPress .6s ease;
        }

        @keyframes keyPress {
          0% {
            transform: translateY(0);
          }

          30% {
            transform:
              translateY(-7px)
              scale(1.06);
          }

          55% {
            transform:
              translateY(1px)
              scale(.98);
          }

          100% {
            transform:
              translateY(0)
              scale(1);
          }
        }

        /* ================================================
           SPACE
        ================================================ */

        .space-bar-wrapper {
          display: flex;
          justify-content: center;
          margin-top: 8px;
        }

        .space-bar {
          width: 48%;
          height: 42px;
          border: 1px solid #d0d5dc;
          border-radius: 10px;
          background: #ffffff;
          box-shadow:
            0 4px 0 #c5cad2,
            0 7px 12px rgba(31,41,55,.07);
        }

        /* ================================================
           LEGEND
        ================================================ */

        .keyboard-legend {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 24px;
          flex-wrap: wrap;
          margin-top: 19px;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #8b95a5;
          font-size: 10px;
          font-weight: 700;
        }

        .legend-box {
          width: 11px;
          height: 11px;
          border-radius: 4px;
        }

        .legend-active {
          background: #6366f1;
          box-shadow:
            0 0 8px rgba(99,102,241,.3);
        }

        .legend-empty {
          border: 1px solid #d1d6df;
          background: #ffffff;
        }

        /* ================================================
           FOOTER
        ================================================ */

        .keyboard-footer {
          margin-top: 32px;
          text-align: center;
          color: #a1a8b3;
          font-size: 10px;
        }

        /* ================================================
           ANIMATION
        ================================================ */

        @keyframes warningIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* ================================================
           TABLET
        ================================================ */

        @media (max-width: 1000px) {

          .keyboard-content {
            grid-template-columns: 1fr;
          }

          .name-card {
            width: 100%;
            box-sizing: border-box;
          }

        }

        /* ================================================
           MOBILE
        ================================================ */

        @media (max-width: 700px) {

          .keyboard-page {
            padding: 35px 10px 25px;
          }

          .hero-title {
            font-size: 38px;
            letter-spacing: -1.5px;
          }

          .hero-subtitle {
            font-size: 15px;
          }

          .keyboard-main {
            padding: 14px;
          }

          .keyboard-deck {
            padding: 9px;
            border-radius: 15px;
          }

          .keyboard-row {
            gap: 3px;
            margin-bottom: 5px;
          }

          .keyboard-key {
            height: 43px;
            border-radius: 7px;
            font-size: 11px;
            box-shadow:
              0 3px 0 #c5cad2,
              0 5px 8px rgba(31,41,55,.07);
          }

          .space-bar {
            height: 35px;
          }

          .live-indicator {
            display: none;
          }

          .keyboard-title {
            font-size: 14px;
          }

          .keyboard-subtitle {
            font-size: 9px;
          }

          .keyboard-icon {
            width: 38px;
            height: 38px;
            font-size: 16px;
          }

        }

        /* ================================================
           SMALL MOBILE
        ================================================ */

        @media (max-width: 420px) {

          .keyboard-page {
            padding-left: 5px;
            padding-right: 5px;
          }

          .keyboard-key {
            height: 36px;
            border-radius: 6px;
            font-size: 9px;
          }

          .keyboard-deck {
            padding: 6px;
          }

          .keyboard-row {
            gap: 2px;
          }

          .space-bar {
            height: 30px;
          }

          .name-card {
            padding: 17px;
          }

          .keyboard-hero {
            margin-bottom: 25px;
          }

        }

        /* ================================================
           SELECTION
        ================================================ */

        .keyboard-page ::selection {
          background: #6366f1;
          color: white;
        }

      `}</style>

      <div className="keyboard-container">

        {/* =================================================
            HERO
        ================================================= */}

        <header className="keyboard-hero">

          <div className="hero-badge">
            <span className="hero-badge-icon">
              ⌨️
            </span>

            <span>
              {t('keyboard.keyboardLabel')}
            </span>
          </div>

          <h1 className="hero-title">
            {t('keyboard.title')}
          </h1>

          <p className="hero-subtitle">
            {t('keyboard.subtitle')}
          </p>

          <p className="hero-description">
            {t('keyboard.description')}
          </p>

        </header>

        {/* =================================================
            WARNING
        ================================================= */}

        {showLangWarning && (
          <div className="warning-card">

            <div className="warning-title">
              {t('keyboard.langWarningTitle')}
            </div>

            <div className="warning-message">
              {t('keyboard.langWarningMessage')}
            </div>

            <div className="warning-action">
              {t('keyboard.langWarningAction')}
            </div>

            <ol className="warning-list">

              <li>
                {t('keyboard.langWarningStep1')}
              </li>

              <li>
                {t('keyboard.langWarningStep2')}
              </li>

              <li>
                {t('keyboard.langWarningStep3')}
              </li>

            </ol>

            <div className="warning-buttons">

              <button
                type="button"
                className="warning-button"
                onClick={dismissWarning}
              >
                {t('keyboard.langDismiss')}
              </button>

              <button
                type="button"
                className="warning-button"
                onClick={dismissWarning}
              >
                {t('keyboard.langIgnore')}
              </button>

            </div>

          </div>
        )}

        {/* =================================================
            MAIN
        ================================================= */}

        <div className="keyboard-content">

          {/* ===============================================
              NAME / INPUT CARD
          =============================================== */}

          <section className="keyboard-card name-card">

            <div className="section-heading">

              <div className="section-icon">
                ✨
              </div>

              <div>

                <h2>
                  {t('keyboard.namePrompt')}
                </h2>

                <p>
                  {t('keyboard.subtitle')}
                </p>

              </div>

            </div>

            <label className="input-label">
              {t('keyboard.namePrompt')}
            </label>

            <div className="input-wrapper">

              <input
                ref={inputRef}
                type="text"
                value={userName}
                onChange={handleNameChange}
                placeholder={t('keyboard.placeholder')}
                autoComplete="off"
                className={`name-input ${
                  isRTL ? 'rtl-input' : ''
                }`}
              />

              <button
                type="button"
                className={`reset-button ${
                  isRTL ? 'rtl-reset' : ''
                }`}
                onClick={handleReset}
                title={t('keyboard.reset')}
                aria-label={t('keyboard.reset')}
              >
                ↻
              </button>

            </div>

            {/* ============================================
                PREVIEW
            ============================================ */}

            <div className="name-preview">

              {userName ? (
                <div className="preview-name">
                  {userName}
                </div>
              ) : (
                <div className="preview-empty">
                  {t('keyboard.startTyping')}
                </div>
              )}

            </div>

            {/* ============================================
                STATUS
            ============================================ */}

            {getTypingStatus() && (
              <div className="typing-status">
                {getTypingStatus()}
              </div>
            )}

            {/* ============================================
                STATS
            ============================================ */}

            <div className="stats-grid">

              <div className="stat-box">

                <div className="stat-icon">
                  🔑
                </div>

                <div className="stat-value">
                  {coloredKeys.length}
                </div>

                <div className="stat-label">
                  {t('keyboard.coloredKeysLabel')}
                </div>

              </div>

              <div className="stat-box">

                <div className="stat-icon">
                  🔤
                </div>

                <div className="stat-value">
                  {[...userName].length}
                </div>

                <div className="stat-label">
                  {t('keyboard.stats')}
                </div>

              </div>

            </div>

          </section>

          {/* ===============================================
              KEYBOARD
          =============================================== */}

          <section className="keyboard-card keyboard-main">

            <div className="keyboard-top">

              <div className="keyboard-title-area">

                <div className="keyboard-icon">
                  ⌨
                </div>

                <div>

                  <h2 className="keyboard-title">
                    {t('keyboard.keyboardLabel')}
                  </h2>

                  <p className="keyboard-subtitle">
                    {t('keyboard.fillPrompt')}
                  </p>

                </div>

              </div>

              <div className="live-indicator">

                <span className="live-dot"></span>

                <span>
                  {t('keyboard.live') || 'Live'}
                </span>

              </div>

            </div>

            {/* ============================================
                NATIVE KEYBOARD
            ============================================ */}

            <div className="keyboard-deck">

              {keyboardLayout.map((row) => (

                <div
                  className="keyboard-row"
                  key={row.id}
                >

                  {row.keys.map((key) => {

                    const active = isKeyColored(key);

                    return (

                      <div
                        key={`${row.id}-${key.en}`}
                        className={`
                          keyboard-key
                          ${active ? 'active' : ''}
                          ${
                            active && isAnimating
                              ? 'animate'
                              : ''
                          }
                        `}
                      >

                        {getKeyDisplay(key)}

                      </div>

                    );

                  })}

                </div>

              ))}

              {/* SPACE BAR */}

              <div className="space-bar-wrapper">
                <div className="space-bar"></div>
              </div>

            </div>

            {/* ============================================
                LEGEND
            ============================================ */}

            <div className="keyboard-legend">

              <div className="legend-item">

                <span
                  className="
                    legend-box
                    legend-active
                  "
                />

                <span>
                  {t('keyboard.colored')}
                </span>

              </div>

              <div className="legend-item">

                <span
                  className="
                    legend-box
                    legend-empty
                  "
                />

                <span>
                  {t('keyboard.uncolored')}
                </span>

              </div>

            </div>

          </section>

        </div>

        {/* =================================================
            FOOTER
        ================================================= */}

        <footer className="keyboard-footer">
          {t('keyboard.footer')}
        </footer>

      </div>

    </main>
  );
};

export default KeyboardActivity;