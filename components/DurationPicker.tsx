'use client';

import React from 'react';

interface DurationPickerProps {
  workDuration: number;
  breakDuration: number;
  onWorkDurationChange: (duration: number) => void;
  onBreakDurationChange: (duration: number) => void;
}

export function DurationPicker({
  workDuration,
  breakDuration,
  onWorkDurationChange,
  onBreakDurationChange,
}: DurationPickerProps) {
  const presets = {
    work: [15, 20, 25, 30, 45, 60],
    break: [3, 5, 10, 15, 30],
  };

  return (
    <div className="grid grid-cols-2 gap-6 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
      {/* Work Duration */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Work Duration (min)
        </label>
        <input
          type="number"
          value={workDuration}
          onChange={(e) => onWorkDurationChange(Math.max(1, parseInt(e.target.value) || 0))}
          min="1"
          max="120"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <div className="flex flex-wrap gap-2 mt-3">
          {presets.work.map((preset) => (
            <button
              key={preset}
              onClick={() => onWorkDurationChange(preset)}
              className={`px-3 py-1 text-sm rounded-md font-medium transition-colors ${
                workDuration === preset
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {/* Break Duration */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Break Duration (min)
        </label>
        <input
          type="number"
          value={breakDuration}
          onChange={(e) => onBreakDurationChange(Math.max(1, parseInt(e.target.value) || 0))}
          min="1"
          max="60"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
        <div className="flex flex-wrap gap-2 mt-3">
          {presets.break.map((preset) => (
            <button
              key={preset}
              onClick={() => onBreakDurationChange(preset)}
              className={`px-3 py-1 text-sm rounded-md font-medium transition-colors ${
                breakDuration === preset
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
