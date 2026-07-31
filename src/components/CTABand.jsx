// components/CTABand.js
import React from 'react';

const CTABand = ({ onStartTyping }) => {
  return (
    <section className="bg-gradient-to-b from-night3 to-night2 border-y border-white/5">
      <div className="max-w-4xl mx-auto px-5 sm:px-8 py-20 text-center">
        <h2 className="font-display font-semibold text-3xl sm:text-4xl mb-4" data-i18n="cta.title">Your fingers already know where they belong.</h2>
        <p className="text-slateink mb-8" data-i18n="cta.subtitle">No account required to start — create a free profile only when you want to save your progress.</p>
        <button   onClick={onStartTyping}  className="inline-block bg-gold hover:bg-goldsoft text-night font-semibold px-8 py-3.5 rounded-full transition">Start typing free</button>
      </div>
    </section>
  );
};

export default CTABand;