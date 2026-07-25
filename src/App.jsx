// App.js
import React, { useState, useEffect } from 'react';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Stats from './components/Stats';
import HowItWorks from './components/HowItWorks';
import Features from './components/Features';
import TypingTechniques from './components/TypingTechniques'; // ADD THIS LINE
import LessonPlans from './components/LessonPlans';
import CTABand from './components/CTABand';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { LanguageProvider } from './context/LanguageContext';
import './styles/globals.css';

function App() {
  const [loading, setLoading] = useState(true);
   useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false),500);
    return () => clearTimeout(timer);
  }, []);
 if (loading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
       <div class="loader">
  <svg
    class="container"
    width="100"
    height="100"
    viewBox="0 0 64 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="2"
      y="2"
      width="60"
      height="36"
      rx="4"
      ry="4"
      pathLength="100"
      class="track"
    ></rect>

    <rect
      x="2"
      y="2"
      width="60"
      height="36"
      rx="4"
      ry="4"
      pathLength="100"
      class="car"
    ></rect>

    <g class="keys">
      <rect x="8" y="8" width="6" height="5" rx="1"></rect>
      <rect x="16" y="8" width="6" height="5" rx="1"></rect>
      <rect x="24" y="8" width="6" height="5" rx="1"></rect>
      <rect x="32" y="8" width="6" height="5" rx="1"></rect>
      <rect x="40" y="8" width="6" height="5" rx="1"></rect>
      <rect x="48" y="8" width="8" height="5" rx="1"></rect>

      <rect x="8" y="16" width="6" height="5" rx="1"></rect>
      <rect x="16" y="16" width="6" height="5" rx="1"></rect>
      <rect x="24" y="16" width="6" height="5" rx="1"></rect>
      <rect x="32" y="16" width="6" height="5" rx="1"></rect>
      <rect x="40" y="16" width="6" height="5" rx="1"></rect>
      <rect x="48" y="16" width="8" height="5" rx="1"></rect>

      <rect x="8" y="24" width="8" height="5" rx="1"></rect>
      <rect x="18" y="24" width="6" height="5" rx="1"></rect>
      <rect x="26" y="24" width="18" height="5" rx="1"></rect>
      <rect x="46" y="24" width="10" height="5" rx="1"></rect>
    </g>
  </svg>
</div>
<p id="loadingText" class="text-xl font-semibold text-gray-800 leading-tight">
      <span class="dots"></span> بارېږي
    </p>
    <p class="text-sm text-gray-500 leading-relaxed mt-1">
      مهرباني وکړئ انتظار وکړئ، موږ ستاسو مینځپانګه چمتو کوو
    </p>
      </div>
    );
  }





  return (
    <LanguageProvider>
      <div className="app">
        <Nav />
        <Hero />
        <Stats />
        <TypingTechniques />
        <HowItWorks />
        <Features />
        <LessonPlans />
        <CTABand />
        <Contact />
        <Footer />
      </div>
    </LanguageProvider>
  );
}

export default App;