// context/LanguageContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import translations from '../data/translations';

const LanguageContext = createContext();

const langNames = { en: "EN", ps: "پښتو", da: "دری" };
const langDir   = { en: "ltr", ps: "rtl",  da: "rtl" };

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('ps');
  const location = useLocation();

  const applyLanguage = (language) => {
    const dict = translations[language];

    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (dict[key]) el.textContent = dict[key];
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (dict[key]) el.placeholder = dict[key];
    });

    document.documentElement.setAttribute("lang", language);
    document.documentElement.setAttribute("dir", langDir[language]);
    document.body.classList.remove("lang-en", "lang-ps", "lang-da");
    document.body.classList.add("lang-" + language);

    const stats = {
      en: ["12,000+", "40+", "3"],
      ps: ["۱۲,۰۰۰+", "۴۰+", "۳"],
      da: ["۱۲,۰۰۰+", "۴۰+", "۳"]
    };
    const statEls = document.querySelectorAll('.stat-number');
    if (statEls.length >= 3) {
      statEls[0].textContent = stats[language][0];
      statEls[1].textContent = stats[language][1];
      statEls[2].textContent = stats[language][2];
    }

    localStorage.setItem("typetone_lang", language);
  };

  // Re-run on mount AND on every route change
  useEffect(() => {
    const saved = localStorage.getItem('typetone_lang') || 'ps';
    setLang(saved);
    applyLanguage(saved);
  }, [location.pathname]);

  // Translation helper
  const t = (key) =>
    translations[lang]?.[key] ??
    translations.en?.[key] ??
    key;

  const changeLanguage = (language) => {
    setLang(language);
    applyLanguage(language);
  };

  return (
    <LanguageContext.Provider
      value={{ lang, changeLanguage, langNames, langDir, t }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);