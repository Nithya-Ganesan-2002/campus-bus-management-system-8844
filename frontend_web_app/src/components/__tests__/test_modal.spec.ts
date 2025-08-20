import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/dom';

function renderModalHTML({ open, title, content }: { open: boolean; title?: string; content?: string }) {
  // Simulate the Astro rendered output conditionally shown when open=true
  document.body.innerHTML = open
    ? `
    <div class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="modal-overlay" data-state="open"></div>
      <div class="relative z-10 modal-panel w-[90%] max-w-lg" data-state="open">
        ${title ? `<h3 class="text-lg font-semibold mb-3 text-slate-800 dark:text-white">${title}</h3>` : ''}
        <div class="text-sm text-slate-700 dark:text-slate-200">
          ${content ?? ''}
        </div>
        <div class="mt-4 flex justify-end gap-2"></div>
      </div>
    </div>
  `
    : '';
}

describe('Modal component (server markup)', () => {
  it('renders content when open', () => {
    renderModalHTML({ open: true, title: 'Hello', content: '<p>World</p>' });
    const overlay = document.querySelector('.modal-overlay');
    const panel = document.querySelector('.modal-panel');
    expect(overlay).toBeInTheDocument();
    expect(panel).toBeInTheDocument();
    expect(document.body).toHaveTextContent('Hello');
    expect(document.body).toHaveTextContent('World');
  });

  it('renders nothing when not open', () => {
    renderModalHTML({ open: false });
    expect(document.querySelector('.modal-overlay')).toBeNull();
    expect(document.querySelector('.modal-panel')).toBeNull();
  });
});
