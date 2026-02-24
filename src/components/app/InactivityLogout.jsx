'use client';

import { useEffect, useRef } from 'react';

const DEFAULT_IDLE_MS = 15 * 60 * 1000;
const KEY = 'SESSION_TIMEOUT_SIGNAL';

export default function InactivityLogout({ idleMs = DEFAULT_IDLE_MS }) {
  const timerRef = useRef(null);
  const bcRef = useRef(null);

  const schedule = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const last = Number(localStorage.getItem('lastActivityAt') || 0);
      const idleFor = Date.now() - last;
      if (idleFor >= idleMs) {
        // 1) localStorage (fires "storage" in other tabs)
        localStorage.setItem(KEY, String(Date.now()));
        // 2) BroadcastChannel (reliable same-tab & cross-tab)
        bcRef.current?.postMessage({ type: 'timeout', at: Date.now() });
        // 3) Same-tab fallback custom event
        window.dispatchEvent(new Event('session-timeout'));
      } else {
        schedule();
      }
    }, idleMs);
  };

  const stampAndSchedule = () => {
    if (document.visibilityState === 'visible') {
      localStorage.setItem('lastActivityAt', String(Date.now()));
      schedule();
    }
  };

  useEffect(() => {
    bcRef.current = new BroadcastChannel('session');
    if (!localStorage.getItem('lastActivityAt')) {
      localStorage.setItem('lastActivityAt', String(Date.now()));
    }
    schedule();

    const activityEvents = [
      'mousemove',
      'mousedown',
      'keydown',
      'scroll',
      'touchstart',
      'focus',
      'visibilitychange',
    ];
    const onActivity = () => stampAndSchedule();

    activityEvents.forEach((evt) =>
      window.addEventListener(evt, onActivity, { passive: true })
    );

    // Keep timers in sync if another tab updates lastActivityAt
    const onStorage = (e) => {
      if (e.key === 'lastActivityAt') schedule();
    };
    window.addEventListener('storage', onStorage);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      activityEvents.forEach((evt) =>
        window.removeEventListener(evt, onActivity)
      );
      window.removeEventListener('storage', onStorage);
      bcRef.current?.close();
    };
  }, [idleMs]);

  return null;
}
