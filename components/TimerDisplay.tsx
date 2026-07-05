'use client';

import React from 'react';

interface TimerDisplayProps {
  timeRemaining: number; // in seconds
  isRunning: boolean;
  sessionType: 'work' | 'break';
  progress: number; // 0-100
}

export function TimerDisplay({
  timeRemaining,
  isRunning,
  sessionType,
  progress,
}: TimerDisplayProps) {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const displayTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const bgColor = sessionType === 'work' ? 'from-blue-500 to-blue-600' : 'from-green-500 to-green-600';
  const glowColor = sessionType === 'work' ? 'bg-blue-500/20' : 'bg-green-500/20';
  const textColor = sessionType === 'work' ? 'text-blue-600 dark:text-blue-400' : 'text-green-600 dark:text-green-400';

  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <div className="relative w-80 h-80">
        {/* Glow effect */}
        <div
          className={`absolute inset-0 rounded-full ${glowColor} blur-2xl transition-all duration-300`}
        />

        {/* Progress circle */}
        <svg
          className="absolute inset-0 w-full h-full -rotate-90"
          viewBox="0 0 200 200"
        >
          {/* Background circle */}
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-gray-200 dark:text-gray-700"
          />

          {/* Progress circle */}
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="8"
            strokeLinecap="round"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset,
              transition: 'stroke-dashoffset 1s linear',
            }}
          />

          <defs>
            <linearGradient
              id="gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop
                offset="0%"
                stopColor={sessionType === 'work' ? '#3b82f6' : '#10b981'}
              />
              <stop
                offset="100%"
                stopColor={sessionType === 'work' ? '#1d4ed8' : '#059669'}
              />
            </linearGradient>
          </defs>
        </svg>

        {/* Timer display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={`text-7xl font-bold ${textColor} font-mono`}>
            {displayTime}
          </div>
          <div className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
            {sessionType === 'work' ? 'Focus Time' : 'Break Time'}
          </div>
          {isRunning && (
            <div className="mt-4 flex gap-1">
              <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse" />
              <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse delay-100" />
              <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse delay-200" />
            </div>
          )}
        </div>
      </div>

      {/* Session info */}
      <div className="text-center">
        <p className="text-gray-600 dark:text-gray-400">
          {sessionType === 'work'
            ? 'Time to focus and accomplish your goals'
            : 'Take a moment to rest and recharge'}
        </p>
      </div>
    </div>
  );
}
