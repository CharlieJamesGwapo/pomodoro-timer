export const requestNotificationPermission = async (): Promise<boolean> => {
  if (typeof window === 'undefined') return false;

  if (!('Notification' in window)) {
    console.log('This browser does not support desktop notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch {
      return false;
    }
  }

  return false;
};

export const sendNotification = (
  title: string,
  options?: NotificationOptions
): void => {
  if (typeof window === 'undefined') return;

  if (Notification.permission === 'granted') {
    try {
      new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options,
      });
    } catch {
      console.error('Failed to send notification');
    }
  }
};

export const sendSessionEndedNotification = (type: 'work' | 'break'): void => {
  const title = type === 'work' ? 'Work Session Complete!' : 'Break Over!';
  const body =
    type === 'work'
      ? 'Great work! Time for a break.'
      : "Ready to dive back in? Let's go!";

  sendNotification(title, {
    body,
    tag: 'session-complete',
    requireInteraction: false,
  });
};

export const playNotificationSound = (): void => {
  if (typeof window === 'undefined') return;

  try {
    // Use Web Audio API to create a simple beep sound
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    // Double beep pattern
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gain.gain.setValueAtTime(0.3, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);

    // Second beep
    const osc2 = audioContext.createOscillator();
    osc2.connect(gain);
    osc2.frequency.value = 1000;
    osc2.type = 'sine';

    gain.gain.setValueAtTime(0.3, audioContext.currentTime + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.25);

    osc2.start(audioContext.currentTime + 0.15);
    osc2.stop(audioContext.currentTime + 0.25);
  } catch (error) {
    console.error('Failed to play notification sound:', error);
  }
};
