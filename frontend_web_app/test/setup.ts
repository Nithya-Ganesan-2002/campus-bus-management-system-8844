import '@testing-library/jest-dom';
import { beforeEach, vi } from 'vitest';

// Ensure a clean localStorage and DOM for each test.
beforeEach(() => {
  // Clear DOM nodes between tests to avoid leakage
  document.body.innerHTML = '';
  document.head.innerHTML = '';

  // Reset localStorage keys used by the app
  try {
    localStorage.clear();
  } catch {
    // ignore
  }
});

// Provide a minimal Astro-like global (only what some scripts might check)
(globalThis as any).Astro = { props: {} };

// Mock scroll/animation methods sometimes used by DOM
// to avoid jsdom errors if any code calls them
Element.prototype.scrollIntoView = Element.prototype.scrollIntoView || vi.fn();
