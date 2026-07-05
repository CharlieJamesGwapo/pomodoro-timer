'use client';

import React, { useEffect, useState } from 'react';
import { DarkModeToggle } from '@/components/DarkModeToggle';
import { DurationPicker } from '@/components/DurationPicker';
import { AmbientSoundSelector } from '@/components/AmbientSoundSelector';
import { AppSettings } from '@/types';
import { settingsStorage, sessionStorage, statsStorage } from '@/lib/storage';

export default function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings>(settingsStorage.get());
  const [saveMessage, setSaveMessage] = useState('');

  const handleWorkDurationChange = (duration: number) => {
    setSettings((prev) => ({ ...prev, workDuration: duration }));
    settingsStorage.set({ workDuration: duration });
    showSaveMessage();
  };

  const handleBreakDurationChange = (duration: number) => {
    setSettings((prev) => ({ ...prev, breakDuration: duration }));
    settingsStorage.set({ breakDuration: duration });
    showSaveMessage();
  };

  const handleSoundChange = (sound: string) => {
    setSettings((prev) => ({ ...prev, ambientSound: sound }));
    settingsStorage.set({ ambientSound: sound });
    showSaveMessage();
  };

  const handleSoundEnabledChange = (enabled: boolean) => {
    setSettings((prev) => ({ ...prev, soundEnabled: enabled }));
    settingsStorage.set({ soundEnabled: enabled });
    showSaveMessage();
  };

  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    setSettings((prev) => ({ ...prev, theme }));
    settingsStorage.set({ theme });
    showSaveMessage();
  };

  const handleNotificationsChange = (enabled: boolean) => {
    setSettings((prev) => ({ ...prev, notificationsEnabled: enabled }));
    settingsStorage.set({ notificationsEnabled: enabled });
    showSaveMessage();
  };

  const handleAutoStartBreakChange = (enabled: boolean) => {
    setSettings((prev) => ({ ...prev, autoStartBreak: enabled }));
    settingsStorage.set({ autoStartBreak: enabled });
    showSaveMessage();
  };

  const handleAutoStartWorkChange = (enabled: boolean) => {
    setSettings((prev) => ({ ...prev, autoStartWork: enabled }));
    settingsStorage.set({ autoStartWork: enabled });
    showSaveMessage();
  };

  const showSaveMessage = () => {
    setSaveMessage('✓ Settings saved');
    setTimeout(() => setSaveMessage(''), 2000);
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      sessionStorage.clear();
      statsStorage.getAll(); // Clear by creating new storage
      alert('All data cleared');
    }
  };

  const handleResetSettings = () => {
    if (window.confirm('Are you sure you want to reset settings to defaults?')) {
      settingsStorage.reset();
      setSettings(settingsStorage.get());
      showSaveMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Customize your Pomodoro timer experience
          </p>
        </div>

        {/* Save message */}
        {saveMessage && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 rounded-lg">
            {saveMessage}
          </div>
        )}

        {/* Theme Settings */}
        <div className="mb-8 p-6 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Theme
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-gray-700 dark:text-gray-300">Appearance:</span>
            <DarkModeToggle theme={settings.theme} onChange={handleThemeChange} />
          </div>
        </div>

        {/* Timer Durations */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Timer Durations
          </h2>
          <DurationPicker
            workDuration={settings.workDuration}
            breakDuration={settings.breakDuration}
            onWorkDurationChange={handleWorkDurationChange}
            onBreakDurationChange={handleBreakDurationChange}
          />
        </div>

        {/* Ambient Sounds */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Ambient Sounds
          </h2>
          <AmbientSoundSelector
            selectedSound={settings.ambientSound}
            onSoundChange={handleSoundChange}
            soundEnabled={settings.soundEnabled}
            onSoundEnabledChange={handleSoundEnabledChange}
          />
        </div>

        {/* Notifications */}
        <div className="mb-8 p-6 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Notifications
          </h2>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.notificationsEnabled}
              onChange={(e) => handleNotificationsChange(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-700 dark:text-gray-300">
              Enable browser notifications for session reminders
            </span>
          </label>
        </div>

        {/* Auto-start Settings */}
        <div className="mb-8 p-6 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Auto-Start Sessions
          </h2>
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoStartBreak}
                onChange={(e) => handleAutoStartBreakChange(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-700 dark:text-gray-300">
                Automatically start break after work session
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoStartWork}
                onChange={(e) => handleAutoStartWorkChange(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-700 dark:text-gray-300">
                Automatically start next work session after break
              </span>
            </label>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
          <h2 className="text-xl font-bold text-red-900 dark:text-red-300 mb-4">
            Danger Zone
          </h2>
          <p className="text-sm text-red-800 dark:text-red-200 mb-4">
            These actions cannot be undone. Use with caution.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleResetSettings}
              className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium transition-colors"
            >
              Reset Settings to Defaults
            </button>
            <button
              onClick={handleClearData}
              className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
            >
              Clear All Data
            </button>
          </div>
        </div>

        {/* About */}
        <div className="mt-8 p-6 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            About
          </h2>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Pomodoro Timer v1.0 • A focus tool by Charlie James
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            All data is stored locally in your browser. No information is sent to any server.
          </p>
        </div>
      </div>
    </div>
  );
}
