// components/Stats.js
import React from 'react';
import { useEffect } from "react";

const Stats = () => {
useEffect(() => {
    function animateCounter(id, target, duration = 4000) {
      const element = document.getElementById(id);
      let start = 0;
      const increment = target / (duration / 16);

      function updateCounter() {
        start += increment;

        if (start < target) {
          element.textContent = Math.floor(start).toLocaleString() + "+";
          requestAnimationFrame(updateCounter);
        } else {
          element.textContent = target.toLocaleString() + "+";
        }
      }

      updateCounter();
    }

    animateCounter("stat1Num", 12000, 8000);
    animateCounter("stat2Num", 40, 3000);
    animateCounter("stat3Num", 3, 1000);

  }, []);

  return (
    <section className="bg-night3 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 grid grid-cols-3 gap-6 text-center">
        <div><p className="font-mono text-3xl sm:text-4xl font-bold text-gold stat-number" id='stat1Num'>12,000+</p><p className="text-slateink text-sm mt-1" data-i18n="stats.learners">Learners</p></div>
        <div><p className="font-mono text-3xl sm:text-4xl font-bold text-gold stat-number" id='stat2Num'>40+</p><p className="text-slateink text-sm mt-1" data-i18n="stats.schools">Schools</p></div>
        <div><p className="font-mono text-3xl sm:text-4xl font-bold text-gold stat-number" id='stat3Num'>3</p><p className="text-slateink text-sm mt-1" data-i18n="stats.languages">Languages</p></div>
      </div>
    </section>
  );
};

export default Stats;