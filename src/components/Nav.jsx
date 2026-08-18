// components/Nav.js
import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

const Nav = ({ onStartTyping ,  showGetStarted = true}) => {
  const { lang, changeLanguage, langNames } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const viewportHeight = window.innerHeight;
      const  viewportHeight3=viewportHeight* 0.6;
      setIsScrolled(scrollPosition > viewportHeight3);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

const getBrandName = () => {
    const translations = {
      en: "TypeTone",
      ps: "ټایپټون",
      da: "تایپ تون"
    };
    return translations[lang] || "TypeTone";
  };  

  return (
    <header className={`fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-night/70 border-b border-white/5  ${
      isScrolled ? 'bg-white/90 border shaddow-[#f4f1de] shadow-sm border-[#f4f1de] text-black' : 'bg-night/70 text-white'
    }`}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2 font-display font-extrabold text-lg tracking-tight">
        <span><img src="/LogoTypeTone.png" className='rounded-3xl w-6 h-6' alt="" /></span>
          <span>{getBrandName()}</span>
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm text-slateink font-medium">
          <a href="#how" className="hover:text-cloudwhite transition" data-i18n="nav.how">How it works</a>
          <a href="#techniques" className="hidden lg:inline-block hover:text-cloudwhite transition"   data-i18n="nav.techniques"> Typing Techniques</a>
          <a href="#lessons" className="hidden lg:inline-block hover:text-cloudwhite transition" data-i18n="nav.lessons"> Lesson plans</a>
          <a href="#features" className="hover:text-cloudwhite transition" data-i18n="nav.features">Features</a>
          <a href="#contact" className="hover:text-cloudwhite transition" data-i18n="nav.contact">Contact</a>
          <a href="https://fazlahmadhotaki.github.io/Type-Speed-Project/" className="hover:text-cloudwhite transition" data-i18n="nav.TypeTest_TypeTone">TypeTest</a>
        </nav>
        <div className="flex items-center gap-3">
          <div className="relative" ref={menuRef}>
            <button 
              id="langBtn" 
              onClick={() => setMenuOpen(!menuOpen)}
              className={`flex items-center gap-2 text-sm font-medium border border-gray-50 hover:bg-gray-50 hover:text-gray-700 rounded-full px-3 py-1.5 transition
                    ${isScrolled ? "border-gray-200 hover:bg-[#f4f1de]" : "hover:bg-goldsoft"}      `}            >
              <span id="langBtnLabel">{langNames[lang]}</span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            {menuOpen && (
              <div className="lang-dropdown absolute right-0 mt-2 w-40 rounded-xl bg-night3 border border-white/10 shadow-xl overflow-hidden">
                <button onClick={() => { changeLanguage('en'); setMenuOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm hover:bg-white/5 flex items-center justify-between">English <span className="text-xs text-slateink">EN</span></button>
                <button onClick={() => { changeLanguage('ps'); setMenuOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm hover:bg-white/5 flex items-center justify-between font-arabic">پښتو <span className="text-xs text-slateink">PS</span></button>
                <button onClick={() => { changeLanguage('da'); setMenuOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm hover:bg-white/5 flex items-center justify-between font-arabic">دری <span className="text-xs text-slateink">DA</span></button>
              </div>
            )}
          </div>

          {showGetStarted && (
  <button
    onClick={onStartTyping}
    className={`hidden sm:inline-block bg-gold hover:bg-goldsoft text-night font-semibold text-sm px-4 py-2 rounded-full transition border bodder-gray-700 hover:bg-white hover:text-gray-800
      ${isScrolled ? "hover:bg-[#f4f1de]" : "hover:bg-goldsoft"}`}
    data-i18n="nav.getStarted"
  >
    Get started
  </button>
)}   
  </div>
      </div>
    </header>
  );
};

export default Nav;