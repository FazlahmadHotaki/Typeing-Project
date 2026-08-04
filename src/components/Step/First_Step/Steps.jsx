import React, { useState } from 'react';
import './App.css'; // We'll create this file for styles
const App = () => {
  const STATUS = { DONE: 'done', ACTIVE: 'active', LOCKED: 'locked' };

  const lessons = [
    { n: 1, glyph: 'INTRO', label: 'Introduction to Typing', stars: 0, status: STATUS.DONE, intro: true },
    { n: 2, glyph: 'fj', label: 'Keys f & j', stars: 0, status: STATUS.DONE },
    { n: 3, glyph: 'fj', label: 'Space Bar', stars: 0, status: STATUS.DONE },
    { n: 4, glyph: 'fj', label: 'Review: f & j', stars: 5, status: STATUS.DONE },
    { n: 5, glyph: 'dk', label: 'Keys d & k', stars: 0, status: STATUS.DONE },
    { n: 6, glyph: 'dk', label: 'Review: d & k', stars: 5, status: STATUS.DONE },
    { n: 7, glyph: '⏱', label: 'Practice: d & k', stars: 5, status: STATUS.DONE },
    { n: 8, glyph: 'fjkd', label: 'Play: fjkd', stars: 4, status: STATUS.LOCKED },
  ];
// Hi
  const CheckSVG = () => (
    <svg width="22" height="22" viewBox="0 0 22 22">
      <circle cx="11" cy="11" r="11" fill="#D98A3D" />
      <path d="M6 11.5l3 3 7-7.5" stroke="#1F150F" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  const LockSVG = () => (
    <svg className="lock-icon" width="18" height="18" viewBox="0 0 18 18">
      <rect x="4" y="8" width="10" height="8" rx="1.5" fill="none" stroke="#8A7C6E" strokeWidth="1.6" />
      <path d="M6 8V6a3 3 0 0 1 6 0v2" fill="none" stroke="#8A7C6E" strokeWidth="1.6" />
    </svg>
  );

  const StarRow = ({ count }) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        i < count ? (
          <svg key={i} className="star on" viewBox="0 0 20 20">
            <path d="M10 1l2.7 6.2 6.7.6-5.1 4.4 1.6 6.6L10 15.8 4.1 18.8l1.6-6.6L.6 7.8l6.7-.6z" />
          </svg>
        ) : (
          <svg key={i} className="star off" viewBox="0 0 20 20">
            <path d="M10 1l2.7 6.2 6.7.6-5.1 4.4 1.6 6.6L10 15.8 4.1 18.8l1.6-6.6L.6 7.8l6.7-.6z" />
          </svg>
        )
      );
    }
    return <div className="key-stars">{stars}</div>;
  };

  const Glyph = ({ lesson }) => {
    if (lesson.intro) {
      return (
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="5" width="18" height="12" rx="2" stroke="#EFE7DA" strokeWidth="1.6" />
          <circle cx="8" cy="11" r="1.1" fill="#EFE7DA" />
          <circle cx="12" cy="11" r="1.1" fill="#EFE7DA" />
          <circle cx="16" cy="11" r="1.1" fill="#EFE7DA" />
          <path d="M9 15h6" stroke="#D98A3D" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    }
    if (lesson.glyph === '⏱') {
      return (
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="13" r="8" stroke="#EFE7DA" strokeWidth="1.6" />
          <path d="M12 9v4l3 2" stroke="#EFE7DA" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M9 2h6M12 2v2" stroke="#EFE7DA" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    }
    const showBumps = lesson.glyph === 'fj';
    return (
      <>
        {lesson.glyph}
        {showBumps && (
          <>
            <span className="bump" style={{ left: '34%' }}></span>
            <span className="bump" style={{ right: '34%' }}></span>
          </>
        )}
      </>
    );
  };

  const Key = ({ lesson }) => {
    const isLocked = lesson.status === STATUS.LOCKED;
    const isDone = lesson.status === STATUS.DONE;
    const cls = ['key'];
    if (lesson.intro) cls.push('intro');
    if (isDone) cls.push('done');
    if (isLocked) cls.push('locked');

    const handleClick = (e) => {
      if (isLocked) return;
      const el = e.currentTarget;
      el.animate(
        [{ transform: 'translateY(3px)' }, { transform: 'translateY(6px)' }, { transform: 'translateY(3px)' }],
        { duration: 180, easing: 'ease-out' }
      );
    };

    return (
      <button
        className={cls.join(' ')}
        disabled={isLocked}
        aria-label={`${lesson.label}${isLocked ? ', locked' : isDone ? ', completed' : ''}`}
        onClick={handleClick}
      >
        <div className="key-top">
          <span className="key-index">{lesson.n}</span>
          <span className="key-status">
            {isLocked ? <LockSVG /> : isDone ? <CheckSVG /> : null}
          </span>
        </div>
        <div className="key-glyph">
          <Glyph lesson={lesson} />
        </div>
        {lesson.stars > 0 ? <StarRow count={lesson.stars} /> : <div style={{ height: '23px' }}></div>}
        <div className="key-foot">{lesson.label}</div>
      </button>
    );
  };

  return (
    <>
      <header>
        <div className="brand">
          <span className="keydot">⌨</span>KeyPath
        </div>
        <nav>
          <a href="#" className="active">Home</a>
          <a href="#">Stats</a>
          <a href="#">Badges</a>
          <a href="#">Typing Jungle</a>
        </nav>
        <div className="header-right">
          <span>English</span>
          <span>Fazlahmad</span>
        </div>
      </header>

      <main>
        <div className="stats">
          <div className="stat-chip">
            <span className="n">68%</span>
            <span className="l">complete</span>
          </div>
          <div className="stat-chip">
            <span className="n">1,636</span>
            <span className="l">stars</span>
          </div>
          <div className="stat-chip">
            <span className="n">634,115</span>
            <span className="l">points</span>
          </div>
        </div>

        <div className="roast-gauge">
          <div className="roast-gauge-label">
            <span>Light roast</span>
            <span><strong>Your progress</strong></span>
            <span>Dark roast</span>
          </div>
          <div className="roast-bar">
            <div className="roast-bar-mask"></div>
            <div className="roast-bar-tick"></div>
          </div>
        </div>

        <div className="section-head">
          <h1>Home Row</h1>
          <span className="sub">8 lessons</span>
        </div>

        <div className="grid">
          {lessons.map((lesson) => (
            <Key key={lesson.n} lesson={lesson} />
          ))}
        </div>
      </main>

      <footer>
        Keep your fingers on <strong>f</strong> and <strong>j</strong>
        <span className="cursor"></span>
      </footer>
    </>
  );
};

export default App;