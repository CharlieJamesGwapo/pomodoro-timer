'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { TimerDisplay } from '@/components/TimerDisplay';
import { TimerControls } from '@/components/TimerControls';
import { AmbientSoundSelector } from '@/components/AmbientSoundSelector';
import { DurationPicker } from '@/components/DurationPicker';
import { SessionType } from '@/types';
import {
  sessionStorage,
  settingsStorage,
  getTodayDate,
  addSessionAndUpdateStats,
} from '@/lib/storage';
import {
  requestNotificationPermission,
  sendSessionEndedNotification,
  playNotificationSound,
} from '@/lib/notifications';
import { ambientSoundManager } from '@/lib/sounds';

interface TimerState {
  isRunning: boolean;
  timeRemaining: number;
  sessionType: SessionType;
  workDuration: number;
  breakDuration: number;
  sessionsCompleted: number;
}

export default function Home() {
  const [timer, setTimer] = useState<TimerState>({
    isRunning: false,
    timeRemaining: 25 * 60,
    sessionType: 'work',
    workDuration: 25,
    breakDuration: 5,
    sessionsCompleted: 0,
  });

  const [settings, setSettings] = useState(settingsStorage.get());
  const [showDurationPicker, setShowDurationPicker] = useState(false);
  const [notificationsPermission, setNotificationsPermission] = useState(false);

  // Request notification permission on mount
  useEffect(() => {
    requestNotificationPermission().then(setNotificationsPermission);
  }, []);

  // Load settings and update timer
  useEffect(() => {
    const savedSettings = settingsStorage.get();
    setSettings(savedSettings);
    setTimer((prev) => ({
      ...prev,
      workDuration: savedSettings.workDuration,
      breakDuration: savedSettings.breakDuration,
      timeRemaining:
        prev.sessionType === 'work'
          ? savedSettings.workDuration * 60
          : savedSettings.breakDuration * 60,
    }));
  }, []);

  // Main timer effect
  useEffect(() => {
    if (!timer.isRunning) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        const newTimeRemaining = prev.timeRemaining - 1;

        if (newTimeRemaining <= 0) {
          // Session complete
          const completedSession = {
            id: `${Date.now()}`,
            type: prev.sessionType,
            duration: prev.sessionType === 'work' ? prev.workDuration : prev.breakDuration,
            completedAt: new Date().toISOString(),
          };

          addSessionAndUpdateStats(completedSession);

          // Play notifications
          if (settings.soundEnabled) {
            playNotificationSound();
          }
          if (notificationsPermission) {
            sendSessionEndedNotification(prev.sessionType);
          }

          // Switch to next session
          const nextSessionType = prev.sessionType === 'work' ? 'break' : 'work';
          const nextDuration =
            nextSessionType === 'work' ? prev.workDuration : prev.breakDuration;

          // Auto-start if enabled
          const shouldAutoStart =
            (nextSessionType === 'work' && settings.autoStartWork) ||
            (nextSessionType === 'break' && settings.autoStartBreak);

          return {
            ...prev,
            sessionType: nextSessionType,
            timeRemaining: nextDuration * 60,
            sessionsCompleted:
              nextSessionType === 'work' ? prev.sessionsCompleted + 1 : prev.sessionsCompleted,
            isRunning: shouldAutoStart,
          };
        }

        return {
          ...prev,
          timeRemaining: newTimeRemaining,
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timer.isRunning, settings, notificationsPermission]);

  // Calculate progress percentage
  const totalDuration = timer.sessionType === 'work' ? timer.workDuration : timer.breakDuration;
  const progress = ((totalDuration * 60 - timer.timeRemaining) / (totalDuration * 60)) * 100;

  const handleStart = useCallback(() => {
    setTimer((prev) => ({ ...prev, isRunning: true }));
    if (settings.soundEnabled && settings.ambientSound !== 'none') {
      ambientSoundManager.play(settings.ambientSound);
    }
  }, [settings]);

  const handlePause = useCallback(() => {
    setTimer((prev) => ({ ...prev, isRunning: false }));
  }, []);

  const handleReset = useCallback(() => {
    const duration =
      timer.sessionType === 'work' ? timer.workDuration : timer.breakDuration;
    setTimer((prev) => ({
      ...prev,
      isRunning: false,
      timeRemaining: duration * 60,
    }));
  }, [timer.sessionType, timer.workDuration, timer.breakDuration]);

  const handleNext = useCallback(() => {
    const nextSessionType = timer.sessionType === 'work' ? 'break' : 'work';
    const nextDuration = nextSessionType === 'work' ? timer.workDuration : timer.breakDuration;

    setTimer((prev) => ({
      ...prev,
      isRunning: false,
      sessionType: nextSessionType,
      timeRemaining: nextDuration * 60,
      sessionsCompleted:
        nextSessionType === 'work' ? prev.sessionsCompleted + 1 : prev.sessionsCompleted,
    }));
  }, [timer.sessionType, timer.workDuration, timer.breakDuration]);

  const handleWorkDurationChange = useCallback((duration: number) => {
    setTimer((prev) => ({
      ...prev,
      workDuration: duration,
      timeRemaining: prev.sessionType === 'work' ? duration * 60 : prev.timeRemaining,
    }));
    settingsStorage.set({ workDuration: duration });
  }, []);

  const handleBreakDurationChange = useCallback((duration: number) => {
    setTimer((prev) => ({
      ...prev,
      breakDuration: duration,
      timeRemaining: prev.sessionType === 'break' ? duration * 60 : prev.timeRemaining,
    }));
    settingsStorage.set({ breakDuration: duration });
  }, []);

  const handleSoundChange = useCallback((soundKey: string) => {
    setSettings((prev) => ({ ...prev, ambientSound: soundKey }));
    settingsStorage.set({ ambientSound: soundKey });
    if (timer.isRunning && soundKey !== 'none') {
      ambientSoundManager.play(soundKey);
    }
  }, [timer.isRunning]);

  const handleSoundEnabledChange = useCallback((enabled: boolean) => {
    setSettings((prev) => ({ ...prev, soundEnabled: enabled }));
    settingsStorage.set({ soundEnabled: enabled });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Session counter */}
        <div className="text-center mb-8">
          <p className="text-gray-600 dark:text-gray-400">
            Sessions Completed Today
          </p>
          <p className="text-4xl font-bold text-gray-900 dark:text-white">
            {timer.sessionsCompleted}
          </p>
        </div>

        {/* Main Timer */}
        <div className="mb-12">
          <TimerDisplay
            timeRemaining={timer.timeRemaining}
            isRunning={timer.isRunning}
            sessionType={timer.sessionType}
            progress={progress}
          />
        </div>

        {/* Controls */}
        <div className="mb-12">
          <TimerControls
            isRunning={timer.isRunning}
            onStart={handleStart}
            onPause={handlePause}
            onReset={handleReset}
            onNext={handleNext}
          />
        </div>

        {/* Ambient Sounds */}
        <div className="mb-8">
          <AmbientSoundSelector
            selectedSound={settings.ambientSound}
            onSoundChange={handleSoundChange}
            soundEnabled={settings.soundEnabled}
            onSoundEnabledChange={handleSoundEnabledChange}
          />
        </div>

        {/* Duration Picker Toggle */}
        <div className="text-center">
          <button
            onClick={() => setShowDurationPicker(!showDurationPicker)}
            className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
          >
            {showDurationPicker ? 'Hide' : 'Show'} Duration Settings
          </button>
        </div>

        {/* Duration Picker */}
        {showDurationPicker && (
          <div className="mt-8">
            <DurationPicker
              workDuration={timer.workDuration}
              breakDuration={timer.breakDuration}
              onWorkDurationChange={handleWorkDurationChange}
              onBreakDurationChange={handleBreakDurationChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}
