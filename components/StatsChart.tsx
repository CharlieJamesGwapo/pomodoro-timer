'use client';

import React from 'react';
import { DailyStats } from '@/types';

interface StatsChartProps {
  stats: DailyStats[];
  period: 'daily' | 'weekly' | 'monthly';
}

export function StatsChart({ stats, period }: StatsChartProps) {
  if (stats.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="text-gray-400 dark:text-gray-500">
          <svg className="w-16 h-16 mx-auto mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="text-sm">No data yet. Start a session to see your stats!</p>
        </div>
      </div>
    );
  }

  const totalSessions = stats.reduce((sum, s) => sum + s.sessionsCompleted, 0);
  const totalMinutes = stats.reduce((sum, s) => sum + s.totalFocusMinutes, 0);
  const maxMinutes = Math.max(...stats.map((s) => s.totalFocusMinutes), 1);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalSessions}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider mt-1">
            Sessions
          </div>
        </div>
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{totalMinutes}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider mt-1">
            Focus Mins
          </div>
        </div>
        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {stats[stats.length - 1]?.streakDays || 0}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider mt-1">
            Streak Days
          </div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Focus Time by Day</h3>
        <div className="space-y-3">
          {stats.slice(-7).map((stat) => (
            <div key={stat.date} className="flex items-end gap-3">
              <div className="text-xs font-medium text-gray-600 dark:text-gray-400 w-16">
                {new Date(stat.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </div>
              <div className="flex-1 flex items-end gap-2">
                <div className="flex-1 h-8 bg-gradient-to-r from-blue-400 to-blue-600 rounded transition-all"
                  style={{
                    width: '100%',
                    opacity: Math.max(0.3, stat.totalFocusMinutes / maxMinutes),
                  }}
                />
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 w-12 text-right">
                  {stat.totalFocusMinutes}m
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sessions breakdown */}
      <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Daily Sessions</h3>
        <div className="space-y-2">
          {stats.slice(-7).map((stat) => (
            <div key={stat.date} className="flex justify-between items-center text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                {new Date(stat.date).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
              <span className="font-semibold text-gray-700 dark:text-gray-300">
                {stat.sessionsCompleted} sessions
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
