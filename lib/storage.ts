import { AppSettings, DailyStats, FocusSession } from '@/types';

const KEYS = {
  SESSIONS: 'pomodoro:sessions',
  SETTINGS: 'pomodoro:settings',
  DAILY_STATS: 'pomodoro:daily-stats',
  TIMER_STATE: 'pomodoro:timer-state',
};

const DEFAULT_SETTINGS: AppSettings = {
  workDuration: 25,
  breakDuration: 5,
  soundEnabled: true,
  notificationsEnabled: true,
  ambientSound: 'none',
  theme: 'system',
  autoStartBreak: false,
  autoStartWork: false,
};

// Session storage
export const sessionStorage = {
  getAll: (): FocusSession[] => {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(KEYS.SESSIONS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  add: (session: FocusSession): void => {
    if (typeof window === 'undefined') return;
    try {
      const sessions = sessionStorage.getAll();
      sessions.push(session);
      localStorage.setItem(KEYS.SESSIONS, JSON.stringify(sessions));
    } catch {
      console.error('Failed to save session');
    }
  },

  getByDate: (date: string): FocusSession[] => {
    if (typeof window === 'undefined') return [];
    const sessions = sessionStorage.getAll();
    return sessions.filter((s) => s.completedAt.startsWith(date));
  },

  clear: (): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(KEYS.SESSIONS);
    } catch {
      console.error('Failed to clear sessions');
    }
  },
};

// Settings storage
export const settingsStorage = {
  get: (): AppSettings => {
    if (typeof window === 'undefined') return DEFAULT_SETTINGS;
    try {
      const data = localStorage.getItem(KEYS.SETTINGS);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  set: (settings: Partial<AppSettings>): void => {
    if (typeof window === 'undefined') return;
    try {
      const current = settingsStorage.get();
      const updated = { ...current, ...settings };
      localStorage.setItem(KEYS.SETTINGS, JSON.stringify(updated));
    } catch {
      console.error('Failed to save settings');
    }
  },

  reset: (): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(KEYS.SETTINGS);
    } catch {
      console.error('Failed to reset settings');
    }
  },
};

// Daily stats storage
export const statsStorage = {
  getAll: (): DailyStats[] => {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(KEYS.DAILY_STATS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  getByDate: (date: string): DailyStats | null => {
    if (typeof window === 'undefined') return null;
    const stats = statsStorage.getAll();
    return stats.find((s) => s.date === date) || null;
  },

  getOrCreate: (date: string): DailyStats => {
    if (typeof window === 'undefined') {
      return {
        date,
        sessionsCompleted: 0,
        totalFocusMinutes: 0,
        streakDays: 0,
      };
    }
    return (
      statsStorage.getByDate(date) || {
        date,
        sessionsCompleted: 0,
        totalFocusMinutes: 0,
        streakDays: 0,
      }
    );
  },

  update: (date: string, stats: Partial<DailyStats>): void => {
    if (typeof window === 'undefined') return;
    try {
      const all = statsStorage.getAll();
      const index = all.findIndex((s) => s.date === date);
      const existing = statsStorage.getOrCreate(date);
      const updated = { ...existing, ...stats, date };

      if (index >= 0) {
        all[index] = updated;
      } else {
        all.push(updated);
      }

      localStorage.setItem(KEYS.DAILY_STATS, JSON.stringify(all));
    } catch {
      console.error('Failed to update stats');
    }
  },

  getDateRange: (startDate: string, endDate: string): DailyStats[] => {
    if (typeof window === 'undefined') return [];
    const stats = statsStorage.getAll();
    return stats.filter((s) => s.date >= startDate && s.date <= endDate);
  },
};

// Helper to get today's date string
export const getTodayDate = (): string => {
  const now = new Date();
  return now.toISOString().split('T')[0];
};

// Helper to add session and update daily stats
export const addSessionAndUpdateStats = (session: FocusSession): void => {
  if (typeof window === 'undefined') return;
  sessionStorage.add(session);

  const date = session.completedAt.split('T')[0];
  const today = statsStorage.getOrCreate(date);

  statsStorage.update(date, {
    sessionsCompleted: today.sessionsCompleted + 1,
    totalFocusMinutes:
      today.totalFocusMinutes + (session.type === 'work' ? session.duration : 0),
  });
};
