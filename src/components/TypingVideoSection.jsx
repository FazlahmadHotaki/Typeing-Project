// TypingVideoSection.jsx - Main Component File
import React, { useRef, useEffect, useState } from 'react';
import translations from '../data/translations';
import { useLanguage } from '../context/LanguageContext';

const TypingVideoSection = () => {
  const videoRef_TypeTone = useRef(null);
  const [language_TypeTone, setLanguage_TypeTone] = useState('ps'); // 'en', 'ps', 'da'

  const { lang } = useLanguage();
  useEffect(() => {
    setLanguage_TypeTone(lang);
  }, [lang]);

  useEffect(() => {
    if (videoRef_TypeTone.current) {
      videoRef_TypeTone.current.play();
    }
  }, []);

  const t_TypeTone = translations[language_TypeTone];

  const languageNames_TypeTone = {
    en: 'English',
    ps: 'پښتو',
    da: 'دری'
  };

  return (
    <section className="typing-video-section_TypeTone py-20 px-4" style={{ background: 'inherit' }}>
      <div className="container_TypeTone mx-auto max-w-6xl">
        {/* Language Switcher */}
        <div className="flex justify-end bg-[#00a8970c] mb-8 gap-2">
          {['en', 'ps', 'da'].map((lang_TypeTone) => (
            <button
              key={lang_TypeTone}
              onClick={() => setLanguage_TypeTone(lang_TypeTone)}
              className={`px-4 py-2 rounded-lg  text-black text-sm font-medium transition-all ${
                language_TypeTone === lang_TypeTone
                  ? 'bg-[#f6aa1c] text-black'
                  : 'bg-[#d3d3d3] text-white hover:bg-white/20'
              }`}
            >
              {languageNames_TypeTone[lang_TypeTone]}
            </button>
          ))}
        </div>

        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            {t_TypeTone['title_TypeTone']}
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            {t_TypeTone['subtitle_TypeTone']}
          </p>
        </div>

        {/* Video Container */}
        <div className="relative rounded-xl overflow-hidden ">
          <div className="relative" style={{ paddingBottom: '56.25%' }}>
            <video
              ref={videoRef_TypeTone}
              className="absolute top-0 left-0 w-full h-full object-cover"
              poster="https://as2.ftcdn.net/v2/jpg/12/45/25/85/1000_F_1245258533_LNJ0xTx9wecgNb1deYRKVsi8KVDbjVT6.jpg"
              autoPlay
              loop
              muted
              playsInline
              controls
              controlsList="nodownload"
              preload="none"
              aria-label="Typing Hands Explainer Motion Graphics__TypeTone"
            >
              <source 
                type="video/mp4" 
                src="https://v.ftcdn.net/20/40/46/14/700_F_2040461476_3fIM8a1tYsA6QIS8bfTtE7NaNXIsX67U_ST.mp4" 
              />
              {t_TypeTone['videoFallback_TypeTone'] || 'Your browser does not support the video tag.'}
            </video>

            {/* Overlay Badges */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold px-3 py-1.5 bg-white/10 text-white rounded-full backdrop-blur-sm border border-white/20">
                  {t_TypeTone['hd_TypeTone']}
                </span>
                <span className="text-xs font-bold px-3 py-1.5 bg-white/10 text-white rounded-full backdrop-blur-sm border border-white/20">
                  {t_TypeTone['fullHd_TypeTone']}
                </span>
              </div>
              <div className="flex items-center gap-2 text-white/60">
                <svg className="w-4 h-4 fill-white/60" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <span className="text-xs">{t_TypeTone['seconds_TypeTone']}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Video Info Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 p-5 rounded-xl border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">⌨️</span>
              <h4 className="text-sm font-semibold text-white">{t_TypeTone['card1Title_TypeTone']}</h4>
            </div>
            <p className="text-sm text-gray-400">{t_TypeTone['card1Desc_TypeTone']}</p>
          </div>
          
          <div className="bg-white/5 p-5 rounded-xl border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">📱</span>
              <h4 className="text-sm font-semibold text-white">{t_TypeTone['card2Title_TypeTone']}</h4>
            </div>
            <p className="text-sm text-gray-400">{t_TypeTone['card2Desc_TypeTone']}</p>
          </div>
          
          <div className="bg-white/5 p-5 rounded-xl border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🎨</span>
              <h4 className="text-sm font-semibold text-white">{t_TypeTone['card3Title_TypeTone']}</h4>
            </div>
            <p className="text-sm text-gray-400">{t_TypeTone['card3Desc_TypeTone']}</p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <button 
            className="px-8 py-3 rounded-full font-bold transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, #C9A15E, #DDBD87)',
              color: '#0A1424'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.05)';
              e.target.style.boxShadow = '0 8px 30px rgba(201,161,94,0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = 'none';
            }}
          >
            {t_TypeTone['cta_TypeTone']}
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <span className="text-gray-500 text-sm">{t_TypeTone['footer_TypeTone']}</span>
        </div>
      </div>

      <style jsx>{`
        .typing-video-section_TypeTone {
          background: inherit;
        }
        /* RTL support for Pashto and Dari */
        [dir="rtl"] .typing-video-section_TypeTone {
          direction: rtl;
        }
      `}</style>
    </section>
  );
};

export default TypingVideoSection;