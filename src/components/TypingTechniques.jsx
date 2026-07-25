// components/TypingTechniques.js
import React from 'react';

const TypingTechniques = () => {
  return (
    <section id="techniques" className="max-w-7xl mx-auto px-5 sm:px-8 py-24">
      <div className="max-w-2xl mb-14">
        <p className="font-mono text-gold text-xs tracking-[0.25em] uppercase mb-3" data-i18n="techniques.eyebrow">Know your typing style</p>
        <h2 className="font-display font-semibold text-3xl sm:text-4xl" data-i18n="techniques.title">Hunt and Peck vs. 10-Finger Method</h2>
      </div>

      <div className="comparison-grid">
        <div className="tech-card rounded-2xl bg-night3 border border-white/5 p-8 hover:border-gold/40">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🔍</span>
            <h3 className="font-display font-semibold text-2xl text-gold" data-i18n="techniques.hunt.title">Hunt and Peck</h3>
          </div>
          <div className="mb-6 rounded-xl overflow-hidden border border-white/10">
            <img src="https://typing.academy/app/source/public/images/intro/en/ergonomics.png" alt="Hunt and Peck vs 10-Finger Method comparison" className="w-full h-auto" loading="lazy" />
          </div>
          <div className="space-y-3 text-sm leading-relaxed">
            <p className="text-slateink" data-i18n="techniques.hunt.desc1">A typing method where you look at the keyboard and type with one or two fingers.</p>
            <p className="text-slateink" data-i18n="techniques.hunt.desc2">It is slower and less accurate than touch typing.</p>
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/5">
              <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-medium" data-i18n="techniques.hunt.tag">Slower · Less accurate</span>
            </div>
          </div>
        </div>

        <div className="tech-card rounded-2xl bg-night3 border border-white/5 p-8 hover:border-gold/40">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">⌨️</span>
            <h3 className="font-display font-semibold text-2xl text-gold" data-i18n="techniques.touch.title">10-Finger Method</h3>
          </div>
          <div className="mb-6 rounded-xl overflow-hidden border border-white/10 bg-white/5">
            <img src="https://lh3.googleusercontent.com/c4mig8q4zECaYgahS4dUwnRkEYbcXQBfsWYxi2XzQHY7OwayJDu7m0T5yHurDqzgVo7YhdarDk9ZczKuGRdeMZustTi79emNQCXQyvg5R6yznQYgvrRr9paB9PY5q7ONil_slMA" alt="10-Finger touch typing technique on a keyboard" className="w-full h-auto" loading="lazy" />
          </div>
          <div className="space-y-3 text-sm leading-relaxed">
            <p className="text-slateink" data-i18n="techniques.touch.desc1">A typing method where you type without looking at the keyboard, using all ten fingers.</p>
            <p className="text-slateink" data-i18n="techniques.touch.desc2">It is faster, more accurate, and reduces strain on your hands and eyes.</p>
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/5">
              <span className="px-3 py-1 rounded-full bg-gold/10 text-gold text-xs font-medium" data-i18n="techniques.touch.tag">Faster · More accurate · Ergonomic</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 rounded-2xl bg-night3 border border-white/5 overflow-hidden">
        <div className="grid grid-cols-3 gap-px bg-white/5">
          <div className="bg-night p-5 text-center font-display font-semibold text-gold text-sm" data-i18n="techniques.compare.feature">Feature</div>
          <div className="bg-night p-5 text-center font-display font-semibold text-gold text-sm" data-i18n="techniques.compare.hunt">Hunt and Peck</div>
          <div className="bg-night p-5 text-center font-display font-semibold text-gold text-sm" data-i18n="techniques.compare.touch">10-Finger Method</div>
          
          <div className="bg-night/50 p-5 text-center text-sm text-slateink" data-i18n="techniques.compare.speed">Speed</div>
          <div className="bg-night/50 p-5 text-center text-sm text-red-400">20–40 WPM</div>
          <div className="bg-night/50 p-5 text-center text-sm text-green-400">60–120+ WPM</div>
          
          <div className="bg-night/50 p-5 text-center text-sm text-slateink" data-i18n="techniques.compare.accuracy">Accuracy</div>
          <div className="bg-night/50 p-5 text-center text-sm text-red-400">Low (80–90%)</div>
          <div className="bg-night/50 p-5 text-center text-sm text-green-400">High (95–99%)</div>
          
          <div className="bg-night/50 p-5 text-center text-sm text-slateink" data-i18n="techniques.compare.eyeStrain">Eye Strain</div>
          <div className="bg-night/50 p-5 text-center text-sm text-red-400" data-i18n="techniques.compare.high">High (looking at keyboard)</div>
          <div className="bg-night/50 p-5 text-center text-sm text-green-400" data-i18n="techniques.compare.low">Low (looking at screen)</div>
          
          <div className="bg-night/50 p-5 text-center text-sm text-slateink" data-i18n="techniques.compare.learning">Learning Curve</div>
          <div className="bg-night/50 p-5 text-center text-sm text-green-400" data-i18n="techniques.compare.easy">Easy to start</div>
          <div className="bg-night/50 p-5 text-center text-sm text-yellow-400" data-i18n="techniques.compare.steep">Steeper but rewarding</div>
        </div>
      </div>
    </section>
  );
};

export default TypingTechniques;