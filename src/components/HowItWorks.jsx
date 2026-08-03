// components/HowItWorks.js
import React from 'react';

const HowItWorks = () => {
  return (
    <section id="how" className="max-w-7xl mx-auto px-5 sm:px-8 py-24">
      <div className="max-w-2xl mb-14">
        <p className="font-mono text-gold text-xs tracking-[0.25em] uppercase mb-3" data-i18n="how.eyebrow">The learning path</p>
        <h2 className="font-display font-semibold text-3xl sm:text-4xl mb-4" data-i18n="how.title">Four rows, one keyboard, at your pace.</h2>
        <p className="text-slateink leading-relaxed" data-i18n="how.subtitle">Lessons follow the natural shape of the keyboard itself — you master one row before moving to the next, in whichever language you choose.</p>
      </div>
      <div className="grid md:grid-cols-4 gap-5">
        <div className="rounded-2xl bg-night3 border border-white/5 p-6 hover:border-gold/40 transition">
          <div className="flex gap-1.5 mb-5"><span className="keycap lit h-8 w-8 text-xs">A</span><span className="keycap lit h-8 w-8 text-xs">S</span><span className="keycap lit h-8 w-8 text-xs ">D</span><span className="keycap lit h-8 w-8 text-xs">F</span></div>
          <h3 className="font-display font-semibold text-lg mb-2" data-i18n="how.row1.title">Home row</h3>
          <p className="text-slateink text-sm leading-relaxed" data-i18n="how.row1.desc">Anchor your fingers on A S D F · J K L ; and learn the resting position every lesson returns to.</p>
        </div>
        <div className="rounded-2xl bg-night3 border border-white/5 p-6 hover:border-gold/40 transition">
          <div className="flex gap-1.5 mb-5"><span className="keycap blik h-8 w-8 text-xs">Q</span><span className="keycap blik h-8 w-8 text-xs">W</span><span className="keycap blik h-8 w-8 text-xs border border-gray-600">E</span><span className="keycap blik h-8 w-8 text-xs">R</span></div>
          <h3 className="font-display font-semibold text-lg mb-2" data-i18n="how.row2.title">Top row</h3>
          <p className="text-slateink text-sm leading-relaxed" data-i18n="how.row2.desc">Reach upward without looking down, building the muscle memory that makes typing automatic.</p>
        </div>
        <div className="rounded-2xl bg-night3 border border-white/5 p-6 hover:border-gold/40 transition">
          <div className="flex gap-1.5 mb-5"><span className="keycap blik h-8 w-8 text-xs">Z</span><span className="keycap blik h-8 w-8 text-xs">X</span><span className="keycap blik h-8 w-8 text-xs">C</span><span className="keycap blik h-8 w-8 text-xs">V</span></div>
          <h3 className="font-display font-semibold text-lg mb-2" data-i18n="how.row3.title">Bottom row</h3>
          <p className="text-slateink text-sm leading-relaxed" data-i18n="how.row3.desc">Round out full-alphabet fluency with the lowest reach, then start combining full words.</p>
        </div>
        <div className="rounded-2xl bg-night3 border border-white/5 p-6 hover:border-gold/40 transition">
          <div className="flex gap-1.5 mb-5"><span className="keycap blik h-8 w-8 text-xs">1</span><span className="keycap blik h-8 w-8 text-xs">2</span><span className="keycap blik h-8 w-8 text-xs">#</span><span className="keycap blik h-8 w-8 text-xs">@</span></div>
          <h3 className="font-display font-semibold text-lg mb-2" data-i18n="how.row4.title">Numbers &amp; symbols</h3>
          <p className="text-slateink text-sm leading-relaxed" data-i18n="how.row4.desc">Finish with digits and punctuation, so real sentences and numbers flow without a pause.</p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;