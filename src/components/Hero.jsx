// components/Hero.js
import React, { useEffect } from 'react';

const Hero = ({ onStartTyping }) => {
  useEffect(() => {
    const container = document.getElementById('stars');
    if (!container) return;
    for (let i = 0; i < 60; i++) {
      const s = document.createElement('div');
      s.className = 'star';
      const size = Math.random() * 2 + 1;
      s.style.width = size + 'px';
      s.style.height = size + 'px';
      s.style.top = Math.random() * 65 + '%';
      s.style.left = Math.random() * 100 + '%';
      s.style.animationDelay = (Math.random() * 4) + 's';
      s.style.animationDuration = (2.5 + Math.random() * 3) + 's';
      container.appendChild(s);
    }
  }, []);

  return (
    <section id="top" className="hero-sky pt-16">
      <div id="stars" className="absolute inset-0 overflow-hidden pointer-events-none"></div>
      <div className="moon"></div>

      <div className="absolute inset-x-0 bottom-0 h-[42%] overflow-hidden pointer-events-none">
        <div className="cloud-layer cloud-back">
          <svg viewBox="0 0 600 140" width="600" height="140" xmlns="http://www.w3.org/2000/svg"><path fill="#5A6B8C" d="M0,120 Q40,60 100,90 Q120,40 190,55 Q230,10 300,40 Q350,15 410,45 Q470,25 520,60 Q580,55 600,90 L600,140 L0,140 Z"/></svg>
          <svg viewBox="0 0 600 140" width="600" height="140" xmlns="http://www.w3.org/2000/svg"><path fill="#5A6B8C" d="M0,120 Q40,60 100,90 Q120,40 190,55 Q230,10 300,40 Q350,15 410,45 Q470,25 520,60 Q580,55 600,90 L600,140 L0,140 Z"/></svg>
        </div>
        <div className="cloud-layer cloud-mid">
          <svg viewBox="0 0 700 160" width="700" height="160" xmlns="http://www.w3.org/2000/svg"><path fill="#7284A6" d="M0,140 Q50,70 120,100 Q150,45 220,60 Q260,15 340,45 Q400,15 470,50 Q530,25 590,65 Q660,55 700,100 L700,160 L0,160 Z"/></svg>
          <svg viewBox="0 0 700 160" width="700" height="160" xmlns="http://www.w3.org/2000/svg"><path fill="#7284A6" d="M0,140 Q50,70 120,100 Q150,45 220,60 Q260,15 340,45 Q400,15 470,50 Q530,25 590,65 Q660,55 700,100 L700,160 L0,160 Z"/></svg>
        </div>
        <div className="cloud-layer cloud-front">
          <svg viewBox="0 0 800 180" width="800" height="180" xmlns="http://www.w3.org/2000/svg"><path fill="#93A2BF" d="M0,160 Q60,80 140,115 Q170,50 250,70 Q300,15 390,50 Q460,15 540,55 Q610,25 680,70 Q750,60 800,110 L800,180 L0,180 Z"/></svg>
          <svg viewBox="0 0 800 180" width="800" height="180" xmlns="http://www.w3.org/2000/svg"><path fill="#93A2BF" d="M0,160 Q60,80 140,115 Q170,50 250,70 Q300,15 390,50 Q460,15 540,55 Q610,25 680,70 Q750,60 800,110 L800,180 L0,180 Z"/></svg>
        </div>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-5 sm:px-8 w-full text-center py-24">
        <div className="fade-up">
          <p className="font-mono text-gold text-xs tracking-[0.3em] uppercase gap-2 mb-6 text-[#ccd5ae]" data-i18n="hero.eyebrow">spa · Interactive · Three Languages</p>
          <h1 className="font-display titleofthe-page font-semibold leading-24 text-4xl sm:text-5xl lg:text-6xl mb-6 tracking-tight " data-i18n="hero.title">Type with confidence, in your own language.</h1>
          <p className="text-slateink text-lg leading-20 max-w-xl mx-auto mb-10" data-i18n="hero.subtitle">Free, interactive touch-typing lessons in English, Pashto, and Dari. Practice a few minutes a day and watch your speed and accuracy grow.</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
          <button  onClick={onStartTyping} className="border border-white/15 hover:border-white/30 text-cloudwhite font-medium px-7 py-3.5 hover:bg-white rounded-full transition hover:text-gray-600 hover:font-bold" data-i18n="hero.ctaPrimary">Start typing free
</button>
            <a href="#how" className="border border-white/15 hover:border-white/30 text-cloudwhite font-medium px-7 py-3.5 hover:bg-white rounded-full transition hover:text-gray-600 hover:font-bold" data-i18n="hero.ctaSecondary">See how it works</a>
          </div>
        </div>
      </div>
      <div className="scroll-down">
        <img className='mt-10' src="https://img.icons8.com/?size=100&id=pHQmM2cgTzW2&format=png&color=000000" alt="" />
      </div>
    </section>
    
  );
};

export default Hero;