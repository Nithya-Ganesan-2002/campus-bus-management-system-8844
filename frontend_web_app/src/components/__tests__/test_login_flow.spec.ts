import { describe, it, expect, beforeEach } from 'vitest';
import { getRole, loginAs, logout, subscribe } from '../../lib/store/auth';

function mountHeaderLikeDOM() {
  document.body.innerHTML = `
    <span id="role-pill" class="hidden"></span>
    <span id="role-text">Guest</span>
    <span id="role-emoji">👤</span>
    <button id="login-btn">Login</button>
    <button id="logout-btn" class="hidden">Logout</button>
  `;

  function updateHeader(role: ReturnType<typeof getRole>) {
    const pill = document.getElementById('role-pill')!;
    const text = document.getElementById('role-text')!;
    const emoji = document.getElementById('role-emoji')!;
    const loginBtn = document.getElementById('login-btn')!;
    const logoutBtn = document.getElementById('logout-btn')!;
    if (role) {
      pill.classList.remove('hidden');
      text.textContent = role === 'student' ? 'Student' : 'Admin';
      emoji.textContent = role === 'student' ? '🎓' : '🛠️';
      loginBtn.classList.add('hidden');
      logoutBtn.classList.remove('hidden');
    } else {
      pill.classList.remove('hidden');
      text.textContent = 'Guest';
      emoji.textContent = '👤';
      loginBtn.classList.remove('hidden');
      logoutBtn.classList.add('hidden');
    }
  }

  updateHeader(getRole());
  subscribe(updateHeader);
}

describe('Auth store basic flow', () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.innerHTML = '';
  });

  it('defaults to no role (Guest), then updates to Student/Admin and back to Guest', () => {
    mountHeaderLikeDOM();

    // initial state
    expect(getRole()).toBeNull();
    expect(document.getElementById('role-text')!.textContent).toBe('Guest');

    // login as student
    loginAs('student');
    expect(getRole()).toBe('student');
    expect(document.getElementById('role-text')!.textContent).toBe('Student');
    expect(document.getElementById('role-emoji')!.textContent).toBe('🎓');

    // switch to admin
    loginAs('admin');
    expect(getRole()).toBe('admin');
    expect(document.getElementById('role-text')!.textContent).toBe('Admin');
    expect(document.getElementById('role-emoji')!.textContent).toBe('🛠️');

    // logout back to guest
    logout();
    expect(getRole()).toBeNull();
    expect(document.getElementById('role-text')!.textContent).toBe('Guest');
    expect(document.getElementById('role-emoji')!.textContent).toBe('👤');
  });
});
