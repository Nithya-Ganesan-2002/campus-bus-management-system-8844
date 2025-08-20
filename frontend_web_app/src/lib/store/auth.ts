//
// Simple client-side auth store using localStorage.
// PUBLIC_INTERFACE
// - getRole(): returns current role ('student' | 'admin' | null)
// - loginAs(role): sets role and dispatches 'auth:change' event
// - logout(): clears role and dispatches 'auth:change' event
// - subscribe(callback): listen to auth changes, returns unsubscribe
//
export type Role = 'student' | 'admin';
const STORAGE_KEY = 'cbms_role';

function readRole(): Role | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    if (raw === 'student' || raw === 'admin') return raw;
    return null;
  } catch {
    return null;
  }
}

function writeRole(role: Role | null) {
  try {
    if (role) {
      localStorage.setItem(STORAGE_KEY, role);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // ignore storage errors (private mode)
  }
}

function emitChange() {
  window.dispatchEvent(new CustomEvent('auth:change', { detail: { role: getRole() } }));
}

// PUBLIC_INTERFACE
export function getRole(): Role | null {
  return typeof window !== 'undefined' ? readRole() : null;
}

// PUBLIC_INTERFACE
export function loginAs(role: Role) {
  writeRole(role);
  emitChange();
}

// PUBLIC_INTERFACE
export function logout() {
  writeRole(null);
  emitChange();
}

// PUBLIC_INTERFACE
export function subscribe(callback: (role: Role | null) => void) {
  const handler = (e: Event) => {
    const detail = (e as CustomEvent).detail;
    callback(detail?.role ?? getRole());
  };
  window.addEventListener('auth:change', handler);
  // fire once with current value
  callback(getRole());
  return () => window.removeEventListener('auth:change', handler);
}
