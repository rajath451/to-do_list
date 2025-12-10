import React, { useState, useEffect, useCallback } from 'react';
import { TimerMode } from '../types';

const TIMER_SETTINGS = {
  [TimerMode.FOCUS]: 25 * 60,
  [TimerMode.SHORT_BREAK]: 5 * 60,
  [TimerMode.LONG_BREAK]: 15 * 60,
};

export const PomodoroTimer: React.FC = () => {
  const [mode, setMode] = useState<TimerMode>(TimerMode.FOCUS);
  const [timeLeft, setTimeLeft] = useState(TIMER_SETTINGS[TimerMode.FOCUS]);
  const [isActive, setIsActive] = useState(false);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = useCallback(() => {
    setIsActive(false);
    setTimeLeft(TIMER_SETTINGS[mode]);
  }, [mode]);

  useEffect(() => {
    resetTimer();
  }, [mode, resetTimer]);

  useEffect(() => {
    let interval: number | undefined;

    if (isActive && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Optional: Play a sound here
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const total = TIMER_SETTINGS[mode];
    return ((total - timeLeft) / total) * 100;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Progress Bar (Subtle) */}
      <div 
        className="absolute bottom-0 left-0 h-1 bg-primary-500 transition-all duration-1000 ease-linear"
        style={{ width: `${getProgress()}%` }}
      />

      <div className="flex gap-2 mb-6 bg-slate-100 p-1 rounded-lg">
        {Object.values(TimerMode).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              mode === m 
                ? 'bg-white text-primary-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {m === TimerMode.FOCUS ? 'Focus' : m === TimerMode.SHORT_BREAK ? 'Short Break' : 'Long Break'}
          </button>
        ))}
      </div>

      <div className="text-6xl font-bold text-slate-800 tracking-tight font-mono mb-6">
        {formatTime(timeLeft)}
      </div>

      <div className="flex gap-4">
        <button
          onClick={toggleTimer}
          className={`px-8 py-2 rounded-full font-semibold transition-colors ${
            isActive
              ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              : 'bg-primary-600 text-white hover:bg-primary-700'
          }`}
        >
          {isActive ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={resetTimer}
          className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
          aria-label="Reset Timer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 12" />
            <path d="M3 3v9h9" />
          </svg>
        </button>
      </div>
    </div>
  );
};