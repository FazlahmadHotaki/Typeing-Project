import React, { useState, useEffect, useRef, useCallback } from 'react';
import "./style.css"
const TypingTest = () => {
  const TEXT = "fjjf ffjj jfjf fjfj jjff fjjf jf fj";
  
  const [typed, setTyped] = useState([]);
  const [active, setActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [mistakeCount, setMistakeCount] = useState(0);
  const [stats, setStats] = useState({
    wpm: 0,
    accuracy: 100,
    time: '0:00',
    progress: 0,
    total: TEXT.length,
    mistakes: 0
  });
  const [status, setStatus] = useState('');
  const [showResult, setShowResult] = useState(false);
  
  const timerRef = useRef(null);
  const captureInputRef = useRef(null);
  const fieldRef = useRef(null);

  // Render text with characters
  const renderText = useCallback(() => {
    return TEXT.split('').map((ch, index) => {
      let className = 'ch pending';
      if (index < typed.length) {
        className = typed[index].correct ? 'ch correct' : 'ch incorrect';
      } else if (index === typed.length && !isFinished) {
        className = 'ch current';
      }
      return (
        <span key={index} className={className}>
          {ch}
        </span>
      );
    });
  }, [typed, isFinished]);

  // Update stats
  const updateStats = useCallback(() => {
    const correctCount = typed.filter(t => t.correct).length;
    const total = typed.length;
    const accuracy = total === 0 ? 100 : Math.round((correctCount / total) * 100);
    
    let wpm = 0;
    let time = '0:00';
    
    if (startTime && !isFinished) {
      const elapsed = (Date.now() - startTime) / 1000;
      const minutes = elapsed / 60;
      wpm = minutes > 0 ? Math.round((correctCount / 5) / minutes) : 0;
      const mins = Math.floor(elapsed / 60);
      const secs = Math.floor(elapsed % 60);
      time = `${mins}:${String(secs).padStart(2, '0')}`;
    }
    
    setStats({
      wpm,
      accuracy,
      time,
      progress: total,
      total: TEXT.length,
      mistakes: mistakeCount
    });
  }, [typed, startTime, isFinished, mistakeCount]);

  // Start test
  const startTest = useCallback(() => {
    setActive(true);
    setIsFinished(false);
    setTyped([]);
    setMistakeCount(0);
    setStartTime(Date.now());
    setShowResult(false);
    setStatus('');
    setStats(prev => ({ ...prev, progress: 0, mistakes: 0 }));
    
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(updateStats, 400);
    
    if (captureInputRef.current) {
      captureInputRef.current.value = '';
      captureInputRef.current.focus();
    }
  }, [updateStats]);

  // Restart test
  const restartTest = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setActive(false);
    setIsFinished(false);
    setTyped([]);
    setMistakeCount(0);
    setStartTime(null);
    setShowResult(false);
    setStatus('');
    setStats({
      wpm: 0,
      accuracy: 100,
      time: '0:00',
      progress: 0,
      total: TEXT.length,
      mistakes: 0
    });
  }, []);

  // Finish test
  const finishTest = useCallback(() => {
    setIsFinished(true);
    setActive(false);
    if (timerRef.current) clearInterval(timerRef.current);
    updateStats();
    setShowResult(true);
  }, [updateStats]);

  // Type a character
  const typeOneChar = useCallback((key) => {
    if (!active || isFinished) return;
    const expected = TEXT[typed.length];
    if (expected === undefined) return;
    
    const correct = key === expected;
    const newTyped = [...typed, { char: key, correct }];
    setTyped(newTyped);
    
    if (!correct) {
      setMistakeCount(prev => prev + 1);
    }
    
    if (newTyped.length === TEXT.length) {
      finishTest();
    }
  }, [active, isFinished, typed, finishTest]);

  // Handle keydown
  const handleKeyDown = useCallback((e) => {
    if (!active) {
      if (e.key === ' ' && !isFinished) {
        e.preventDefault();
        startTest();
      }
      return;
    }
    
    if (e.key === 'Backspace') {
      e.preventDefault();
      if (typed.length > 0) {
        const last = typed[typed.length - 1];
        setTyped(prev => prev.slice(0, -1));
        if (!last.correct) {
          setMistakeCount(prev => Math.max(0, prev - 1));
        }
      }
    }
  }, [active, isFinished, typed, startTest]);

  // Handle input
  const handleInput = useCallback((e) => {
    if (!active) {
      e.target.value = '';
      return;
    }
    const chars = e.target.value.split('');
    chars.forEach(ch => typeOneChar(ch));
    e.target.value = '';
  }, [active, typeOneChar]);

  // Handle blur/focus
  const handleBlur = useCallback(() => {
    if (active) setStatus('⏸️ Paused — click the text box to keep typing.');
  }, [active]);

  const handleFocus = useCallback(() => {
    setStatus('');
  }, []);

  // Keyboard shortcut: Cmd+Shift+R or Ctrl+Shift+R to restart
  useEffect(() => {
    const handleShortcut = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'R') {
        e.preventDefault();
        restartTest();
      }
    };
    document.addEventListener('keydown', handleShortcut);
    return () => document.removeEventListener('keydown', handleShortcut);
  }, [restartTest]);

  // Update stats on typed changes
  useEffect(() => {
    if (active || isFinished) {
      updateStats();
    }
  }, [typed, active, isFinished, updateStats]);

  // Focus input on mount
  useEffect(() => {
    if (captureInputRef.current) {
      captureInputRef.current.focus();
    }
  }, []);

  // Get result emoji based on performance
  const getResultEmoji = (wpm) => {
    if (wpm > 40) return { emoji: '🏆', message: 'Excellent speed!' };
    if (wpm > 25) return { emoji: '🌟', message: 'Good work!' };
    if (wpm > 15) return { emoji: '👍', message: 'Keep practicing!' };
    return { emoji: '💪', message: "You'll get faster!" };
  };

  const resultInfo = getResultEmoji(stats.wpm);

  return (
    <div className="card">
      <h1 className="text-xl sm:text-2xl font-bold mb-1">⌨️ KeyPath — typing test</h1>
      <p className="text-xs sm:text-sm text-gray-500 mb-5 leading-relaxed">
        Home row drill · f and j only · click Start, then just type. Backspace fixes mistakes.
      </p>

      {/* Stats row */}
      <div className="flex gap-2 flex-wrap mb-4">
        <div className="bg-[#FBF6E3] border border-[#E6DCA9] rounded-lg px-3 py-1.5 text-xs sm:text-sm text-gray-600 whitespace-nowrap">
          <strong className="text-[#1B2430]">{stats.wpm}</strong> wpm
        </div>
        <div className="bg-[#FBF6E3] border border-[#E6DCA9] rounded-lg px-3 py-1.5 text-xs sm:text-sm text-gray-600 whitespace-nowrap">
          <strong className="text-[#1B2430]">{stats.accuracy}</strong>% accuracy
        </div>
        <div className="bg-[#FBF6E3] border border-[#E6DCA9] rounded-lg px-3 py-1.5 text-xs sm:text-sm text-gray-600 whitespace-nowrap">
          <strong className="text-[#1B2430]">{stats.time}</strong>
        </div>
        <div className="bg-[#FBF6E3] border border-[#E6DCA9] rounded-lg px-3 py-1.5 text-xs sm:text-sm text-gray-600 whitespace-nowrap">
          <strong className="text-[#1B2430]">{stats.progress}</strong>/{stats.total} chars
        </div>
        <div className="bg-[#FBF6E3] border border-[#E6DCA9] rounded-lg px-3 py-1.5 text-xs sm:text-sm text-gray-600 whitespace-nowrap">
          <strong className="text-[#1B2430]">{stats.mistakes}</strong> errors
        </div>
      </div>

      {/* Typing indicator */}
      <div className={`typing-indicator ${active ? 'active' : ''}`}>
        <span className="dot"></span> Typing in progress...
      </div>

      {/* Type field */}
      <div 
        ref={fieldRef}
        className="type-field"
        onClick={() => active && captureInputRef.current?.focus()}
        style={{ cursor: active ? 'text' : 'default' }}
      >
        {renderText()}
      </div>

      {/* Status */}
      <div className="status">{status}</div>

      {/* Controls */}
      <div className="controls">
        <button 
          id="startBtn"
          onClick={active ? () => captureInputRef.current?.focus() : startTest}
        >
          {active ? '⏳ Typing…' : isFinished ? '▶ Try again' : '▶ Start typing test'}
        </button>
        <button id="restartBtn" onClick={restartTest}>
          ↻ Restart
        </button>
      </div>

      {/* Result */}
      {showResult && (
        <div className="result show">
          <div className="emoji">{resultInfo.emoji}</div>
          <strong>{resultInfo.message}</strong>
          <div className="result-stats">
            <span>
              <span className="label">Speed</span>
              <span className="value">{stats.wpm}</span> wpm
            </span>
            <span>
              <span className="label">Accuracy</span>
              <span className="value">{stats.accuracy}</span>%
            </span>
            <span>
              <span className="label">Time</span>
              <span className="value">{stats.time}</span>
            </span>
            <span>
              <span className="label">Mistakes</span>
              <span className="value">{stats.mistakes}</span>
            </span>
          </div>
        </div>
      )}

      {/* Shortcuts */}
      <div className="shortcuts">
        <span><kbd>⌘</kbd> + <kbd>Shift</kbd> + <kbd>R</kbd> restart</span>
        <span><kbd>Space</kbd> to start/continue</span>
        <span><kbd>Backspace</kbd> undo</span>
      </div>

      {/* Mobile keys */}
      <div className="mobile-keys">
        <button 
          type="button" 
          onClick={() => {
            if (!active && !isFinished) startTest();
            typeOneChar('f');
            captureInputRef.current?.focus();
          }}
        >
          f
        </button>
        <button 
          type="button"
          onClick={() => {
            if (!active && !isFinished) startTest();
            typeOneChar('j');
            captureInputRef.current?.focus();
          }}
        >
          j
        </button>
        <button 
          type="button"
          onClick={() => {
            if (!active && !isFinished) startTest();
            typeOneChar(' ');
            captureInputRef.current?.focus();
          }}
        >
          space
        </button>
        <button 
          type="button"
          onClick={() => {
            if (typed.length > 0) {
              const last = typed[typed.length - 1];
              setTyped(prev => prev.slice(0, -1));
              if (!last.correct) {
                setMistakeCount(prev => Math.max(0, prev - 1));
              }
            }
            captureInputRef.current?.focus();
          }}
        >
          ⌫
        </button>
      </div>

      {/* Hidden input for capturing keyboard events */}
      <input
        ref={captureInputRef}
        id="captureInput"
        className="opacity-0 h-px w-px pointer-events-none absolute"
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck="false"
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        onBlur={handleBlur}
        onFocus={handleFocus}
      />
    </div>
  );
};

export default TypingTest;