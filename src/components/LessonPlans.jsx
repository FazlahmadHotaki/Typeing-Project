// components/LessonPlans.js
import React from 'react';

const LessonPlans = () => {
  return (
    <section id="lessons" className="max-w-7xl mx-auto px-5 sm:px-8 py-24">
      <div className="max-w-2xl mb-14">
        <p className="font-mono text-gold text-[#fb8b24] text-xs tracking-[0.25em] uppercase mb-3" data-i18n="lessons.eyebrow">Choose your language</p>
        <h2 className="font-display font-semibold text-3xl sm:text-4xl " data-i18n="lessons.title">Learn on the keyboard you use every day.</h2>
      </div>
      <div className=" grid md:grid-cols-3 gap-6">
        <div className="rounded-2xl overflow-hidden border border-white/5 bg-[#fbfff1] shadow-md hover:-translate-y-1 hover:border-gold/40 transition"><div className="h-2 bg-gold"></div><div className="p-7"><h3 className="font-display font-semibold text-xl mb-2 text-[#e57c04]" data-i18n="lessons.en.title">English</h3><p className="text-slateink text-sm leading-relaxed mb-5" data-i18n="lessons.en.desc">The full QWERTY curriculum, from home row to full-speed prose, with games and progress tracking.</p><a href="#" className="text-gold text-sm font-semibold hover:underline" data-i18n="lessons.cta">Learn more →</a></div></div>
        <div className="rounded-2xl overflow-hidden border border-white/5 bg-[#fbfff1] shadow-md hover:-translate-y-1 hover:border-gold/40 transition"><div className="h-2 bg-sky"></div><div className="p-7"><h3 className="font-display font-semibold text-xl mb-2 font-arabic text-[#e57c04]" data-i18n="lessons.ps.title">Pashto</h3><p className="text-slateink text-sm leading-relaxed mb-5" data-i18n="lessons.ps.desc">A right-to-left lesson track built for the <strong>Pashto keyboard</strong>, from single letters to full sentences.</p><a href="#" className="text-gold text-sm font-semibold hover:underline" data-i18n="lessons.cta">Learn more →</a></div></div>
        <div className="rounded-2xl overflow-hidden border border-white/5 bg-[#fbfff1] shadow-md hover:-translate-y-1 hover:border-gold/40 transition"><div className="h-2 bg-goldsoft"></div><div className="p-7"><h3 className="font-display font-semibold text-xl mb-2 font-arabic text-[#e57c04]" data-i18n="lessons.da.title">Dari</h3><p className="text-slateink text-sm leading-relaxed mb-5" data-i18n="lessons.da.desc">Right-to-left lessons for the Dari keyboard, paired with the same posture guide and games.</p><a href="#" className="text-gold text-sm font-semibold hover:underline" data-i18n="lessons.cta">Learn more →</a></div></div>
      </div>
    </section>
  );
};

export default LessonPlans;