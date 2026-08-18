// App.js
import React, { useState, useEffect } from 'react';
import Nav from './components/Nav';
// import MouseCursor from "./components/MouseCursor";
// import "./styles/MouseCursor.css";
import Hero from './components/Hero';
import PashtoTyping from "./components/PashtoTyping"
import Stats from './components/Stats';
import HowItWorks from './components/HowItWorks';
import Features from './components/Features';
import TypingTechniques from './components/TypingTechniques';
import LessonPlans from './components/LessonPlans';
import CTABand from './components/CTABand';
import Contact from './components/Contact';
import Login from './components/Login';
import Signup from './components/Signup';
import Footer from './components/Footer';
import KeyTrackDashboard from './components/KeyTrackDashboard'; // ADD THIS
import { LanguageProvider } from './context/LanguageContext';
import './styles/globals.css';

function App() {
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
 const [isAuthenticated, setIsAuthenticated] = useState(false);
const [userData, setUserData] = useState(null);
const [page, setPage] = useState("dashboard");
  const handleStartTyping = () => {
    setShowLogin(true);
  };

  const handleCloseLogin = () => {
    setShowLogin(false);
    setShowSignup(false);
  };

  const handleSwitchToSignup = () => {
    setShowLogin(false);
    setShowSignup(true);
  };

  const handleSwitchToLogin = () => {
    setShowSignup(false);
    setShowLogin(true);
  };

  // ADD THIS: Handle successful signup
  const handleSignupSuccess = (user) => {
    setUserData(user);
    setIsAuthenticated(true);
    setShowSignup(false);
  };
 const handleLoginSuccess = (user) => {
  setUserData(user);
  setIsAuthenticated(true);
  setShowLogin(false);
  setShowSignup(false);
};

  // ADD THIS: Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserData(null);
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 10);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#0A1424] z-50">
        <div className="loader">
          <svg
            className="container"
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
              className="track"
              stroke="#C9A15E"
              strokeWidth="2"
            ></rect>

            <rect
              x="2"
              y="2"
              width="60"
              height="36"
              rx="4"
              ry="4"
              pathLength="100"
              className="car"
              stroke="#C9A15E"
              strokeWidth="2"
              strokeDasharray="100"
              strokeDashoffset="94"
            ></rect>

            <g className="keys" fill="#C9A15E">
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
        <p id="loadingText" className="text-xl font-semibold text-gold leading-tight mt-4">
          <span className="dots"></span> بارېږي
        </p>
        <p className="text-sm text-slateink leading-relaxed mt-1">
         ... مهرباني وکړئ انتظار وکړئ، موږ ستاسو مینځپانګه چمتو کوو
        </p>
      </div>
    );
  }

  // ADD THIS: If authenticated, show Dashboard
  if (isAuthenticated) {
  return (
    <LanguageProvider>

      {page === "dashboard" && (
        <KeyTrackDashboard
          user={userData?.name || userData?.username || "Fazl Ahmad"}
          onLogout={handleLogout}
          openToPahshto={() => setPage("pashtoTyping")}
        />
      )}

      {page === "pashtoTyping" && (
        <PashtoTyping />
      )}

    </LanguageProvider>
  );
}

  return (
    <LanguageProvider>
      {/* <MouseCursor /> */}
      <div className="app">
        <Nav onStartTyping={handleStartTyping} />
        <Hero onStartTyping={handleStartTyping} />
        <Stats />
        <TypingTechniques />
        <HowItWorks />
        <Features />
        <LessonPlans />
        <CTABand onStartTyping={handleStartTyping} />
        <Contact />
        <Footer />

        {/* Login Modal */}
        {showLogin && (
          <Login 
            onClose={handleCloseLogin}
            onSwitchToSignup={handleSwitchToSignup}
            onSignupSuccess={handleLoginSuccess} // ADD THIS
          />
        )}

        {/* Signup Modal */}
        {showSignup && (
          <Signup 
            onClose={handleCloseLogin}
            onSwitchToLogin={handleSwitchToLogin}
            onSignupSuccess={handleSignupSuccess} // ADD THIS
          />
        )}
      </div>
    </LanguageProvider>
  );
}

export default App;