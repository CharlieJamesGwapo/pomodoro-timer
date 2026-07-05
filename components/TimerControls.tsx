'use client';

import React from 'react';

interface TimerControlsProps {
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onNext?: () => void;
}

export function TimerControls({
  isRunning,
  onStart,
  onPause,
  onReset,
  onNext,
}: TimerControlsProps) {
  return (
    <div className="flex gap-4 justify-center flex-wrap">
      {!isRunning ? (
        <button
          onClick={onStart}
          className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
        >
          <span className="flex items-center gap-2">
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
            Start
          </span>
        </button>
      ) : (
        <button
          onClick={onPause}
          className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
        >
          <span className="flex items-center gap-2">
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M5.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75a.75.75 0 00-.75-.75h-1.5zm8 0a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75a.75.75 0 00-.75-.75h-1.5z" />
            </svg>
            Pause
          </span>
        </button>
      )}

      <button
        onClick={onReset}
        className="px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
      >
        <span className="flex items-center gap-2">
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path fillRule="evenodd"
              d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 1119.414 9.414 1 1 0 11-1.414-1.414 5 5 0 10-7.778 7.778 1 1 0 01-1.414 1.414A7.002 7.002 0 013 5.101V3a1 1 0 011-1h2.101a1 1 0 011 1V4a1 1 0 11-2 0V3a1 1 0 00-1-1zm.464 9.536a1 1 0 011.414 0L7 12.05l1.121-1.121a1 1 0 011.414 1.414L8.414 13.464l1.121 1.121a1 1 0 11-1.414 1.414L7 14.878l-1.121 1.121a1 1 0 11-1.414-1.414L5.586 13.464l-1.121-1.121a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
          Reset
        </span>
      </button>

      {onNext && (
        <button
          onClick={onNext}
          className="px-8 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
        >
          <span className="flex items-center gap-2">
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd"
                d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            Next
          </span>
        </button>
      )}
    </div>
  );
}
