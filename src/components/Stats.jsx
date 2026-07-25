// components/Stats.js
import React from 'react';

const Stats = () => {
  return (
    <section className="bg-night3 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 grid grid-cols-3 gap-6 text-center">
        <div><p className="font-mono text-3xl sm:text-4xl font-bold text-gold stat-number" id="stat1Num">12,000+</p><p className="text-slateink text-sm mt-1" data-i18n="stats.learners">Learners</p></div>
        <div><p className="font-mono text-3xl sm:text-4xl font-bold text-gold stat-number" id="stat2Num">40+</p><p className="text-slateink text-sm mt-1" data-i18n="stats.schools">Schools</p></div>
        <div><p className="font-mono text-3xl sm:text-4xl font-bold text-gold stat-number" id="stat3Num">3</p><p className="text-slateink text-sm mt-1" data-i18n="stats.languages">Languages</p></div>
      </div>
    </section>
  );
};

export default Stats;