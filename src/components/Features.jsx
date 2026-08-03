// components/Features.js
import React from 'react';
import TypingVideoSection from './TypingVideoSection';

const features = [
  { icon: 'M8 12V6a2 2 0 1 1 4 0v5M12 11V4a2 2 0 1 1 4 0v7M16 11V6a2 2 0 1 1 4 0v7c0 4-2 7-7 7s-7-3-7-6l-1.5-3a1.4 1.4 0 0 1 2.3-1.6L8 14', key: 'f1' },
  { icon: 'M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0 M3 12h18M12 3c2.5 2.5 3.8 5.7 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.7-3.8-9S9.5 5.5 12 3Z', key: 'f2' },
  { icon: 'M12 8m-5 0a5 5 0 1 0 10 0a5 5 0 1 0 -10 0 M8.5 12.5 7 21l5-3 5 3-1.5-8.5', key: 'f3' },
  { icon: 'M2.5 4.5h19v13h-19z M8 21h8M12 17.5V21', key: 'f4' },
  { icon: 'M2.5 7h19v11h-19z M8 12h.01M8 12H6m2 0v-2m0 2v2M16 11.5h.01M18.5 13.5h.01', key: 'f5' },
  { icon: 'M3 20h18M6 20V12M12 20V6M18 20v-9', key: 'f6' }
];

const Features = () => {
  return (
    <>
    <section id="features" className="bg-night2 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-24">
        <div className="max-w-2xl mb-14">
          <p className="font-mono text-gold text-xs tracking-[0.25em] uppercase mb-3 text-[#e57c04]" data-i18n="features.eyebrow">Inside TypeTone</p>
          <h2 className="font-display font-semibold text-3xl sm:text-4xl" data-i18n="features.title">Everything you need to build real typing speed.</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white border border-white/5 rounded-2xl overflow-hidden ">
          {features.map((f, idx) => (
            <div key={idx} className="bg-[#fbfff1] p-8 border">
              <svg className="mb-5" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C9A15E" strokeWidth="1.4">
                <path d={f.icon} />
              </svg>
              <h3 className="font-display font-medium mb-2" data-i18n={`features.${f.key}.title`}>Feature</h3>
              <p className="text-slateink text-sm leading-relaxed" data-i18n={`features.${f.key}.desc`}>Description</p>
            </div>
          ))}
        </div>
      </div>
    </section>
    <section>
          <TypingVideoSection />

    </section>
    </>
  );
};

export default Features;