'use client';

import React, { useState, useEffect } from 'react';
import { AMBIENT_SOUNDS, ambientSoundManager } from '@/lib/sounds';

interface AmbientSoundSelectorProps {
  selectedSound: string;
  onSoundChange: (sound: string) => void;
  soundEnabled: boolean;
  onSoundEnabledChange: (enabled: boolean) => void;
}

export function AmbientSoundSelector({
  selectedSound,
  onSoundChange,
  soundEnabled,
  onSoundEnabledChange,
}: AmbientSoundSelectorProps) {
  const [volume, setVolume] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    ambientSoundManager.setVolume(volume / 100);
  }, [volume]);

  const handleSoundSelect = (soundKey: string) => {
    onSoundChange(soundKey);
    if (soundEnabled) {
      ambientSoundManager.play(soundKey);
      setIsPlaying(true);
    }
  };

  const togglePlayback = () => {
    if (isPlaying) {
      ambientSoundManager.stop();
      setIsPlaying(false);
    } else {
      if (selectedSound !== 'none') {
        ambientSoundManager.play(selectedSound);
        setIsPlaying(true);
      }
    }
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Ambient Sounds
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={soundEnabled}
            onChange={(e) => {
              onSoundEnabledChange(e.target.checked);
              if (!e.target.checked) {
                ambientSoundManager.stop();
                setIsPlaying(false);
              } else if (selectedSound !== 'none') {
                ambientSoundManager.play(selectedSound);
                setIsPlaying(true);
              }
            }}
            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-600 dark:text-gray-400">Enable</span>
        </label>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-4">
        {Object.entries(AMBIENT_SOUNDS).map(([key, sound]) => (
          <button
            key={key}
            onClick={() => handleSoundSelect(key)}
            disabled={!soundEnabled}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedSound === key && soundEnabled
                ? 'bg-purple-500 text-white ring-2 ring-purple-600'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed'
            }`}
          >
            {sound.name}
          </button>
        ))}
      </div>

      {soundEnabled && selectedSound !== 'none' && (
        <div className="space-y-3">
          <button
            onClick={togglePlayback}
            className="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg font-medium transition-all"
          >
            {isPlaying ? 'Stop Preview' : 'Play Preview'}
          </button>

          <div>
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-2">
              Volume: {volume}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      )}
    </div>
  );
}
