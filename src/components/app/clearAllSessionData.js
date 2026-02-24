export function clearAllSessionData() {
  try {
    // 1) Clear storage
    localStorage.clear();

    // 2) Broadcast a reset event to all tabs
    const bc = new BroadcastChannel('session');
    bc.postMessage({ type: 'reset' });
    bc.close();

    // 3) Also trigger same-tab event (optional)
    window.dispatchEvent(new Event('session-reset'));
  } catch (e) {
    console.error('Failed to clear session data:', e);
  }
}
