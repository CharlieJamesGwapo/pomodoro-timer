export type SessionType = 'work' | 'break';

export interface FocusSession {
  id: string;
  type: SessionType;
  duration: number; // in minutes
  completedAt: string; // ISO date
  focusQuality?: number; // 1-5 scale
}

export interface DailyStats {
  date: string; // YYYY-MM-DD
  sessionsCompleted: number;
  totalFocusMinutes: number;
  streakDays: number;
}

export interface AppSettings {
  workDuration: number; // in minutes
  breakDuration: number; // in minutes
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  ambientSound: string; // 'none' | 'rain' | 'cafe' | 'forest' | 'ocean'
  theme: 'light' | 'dark' | 'system';
  autoStartBreak: boolean;
  autoStartWork: boolean;
}

export interface TimerState {
  isRunning: boolean;
  timeRemaining: number; // in seconds
  sessionType: SessionType;
  workDuration: number;
  breakDuration: number;
  sessionsCompleted: number;
  currentSessionStartTime?: number;
}
