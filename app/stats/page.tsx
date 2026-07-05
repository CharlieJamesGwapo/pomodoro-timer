'use client';

import React, { useEffect, useState } from 'react';
import { StatsChart } from '@/components/StatsChart';
import { DailyStats } from '@/types';
import { statsStorage, getTodayDate } from '@/lib/storage';

export default function StatsPage() {
  const [stats, setStats] = useState<DailyStats[]>([]);
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

  useEffect(() => {
    loadStats();
  }, [period]);

  const loadStats = () => {
    const today = getTodayDate();
    let startDate = today;

    if (period === 'weekly') {
      const date = new Date();
      date.setDate(date.getDate() - 7);
      startDate = date.toISOString().split('T')[0];
    } else if (period === 'monthly') {
      const date = new Date();
      date.setDate(date.getDate() - 30);
      startDate = date.toISOString().split('T')[0];
    } else {
      // Daily - just today
      startDate = today;
    }

    const allStats = statsStorage.getDateRange(startDate, today);
    setStats(allStats);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Your Focus Statistics
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your productivity and celebrate your progress
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex gap-4 mb-8">
          {(['daily', 'weekly', 'monthly'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                period === p
                  ? 'bg-blue-500 text-white'
                  : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>

        {/* Stats Chart */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <StatsChart stats={stats} period={period} />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="p-6 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {stats.reduce((sum, s) => sum + s.sessionsCompleted, 0)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Total Sessions
            </div>
          </div>

          <div className="p-6 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {stats.reduce((sum, s) => sum + s.totalFocusMinutes, 0)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Focus Minutes
            </div>
          </div>

          <div className="p-6 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {stats.filter((s) => s.sessionsCompleted > 0).length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Active Days
            </div>
          </div>
        </div>

        {/* Motivational Message */}
        <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-2">
            Keep Going! 💪
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            {stats.reduce((sum, s) => sum + s.sessionsCompleted, 0) > 0
              ? `You've completed ${stats.reduce((sum, s) => sum + s.sessionsCompleted, 0)} focused sessions. That's amazing progress!`
              : "Start a session to build your focus streak and track your productivity growth."}
          </p>
        </div>
      </div>
    </div>
  );
}
