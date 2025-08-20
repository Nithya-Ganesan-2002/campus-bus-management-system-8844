import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent } from '@testing-library/dom';

type Seat = {
  id: string;
  busId: string;
  number: string;
  status: 'available' | 'reserved' | 'blocked';
  scheduleId: string | null;
};

function renderSeatMap({ seats, scheduleId }: { seats: Seat[]; scheduleId: string | null }) {
  const buttons = seats.map((s) => {
    const isAvailable = s.status === 'available' || (s.status === 'reserved' && s.scheduleId !== scheduleId);
    const disabledAttr = isAvailable ? '' : 'disabled';
    const cls = isAvailable
      ? 'px-2 py-2 rounded-md text-xs font-semibold ring-1 bg-green-100'
      : 'px-2 py-2 rounded-md text-xs font-semibold ring-1 bg-slate-200 cursor-not-allowed';
    return `<button class="${cls}" ${disabledAttr} data-seat-id="${s.id}">${s.number}</button>`;
  }).join('');
  document.body.innerHTML = `<div id="seat-map">${buttons}</div>`;

  // bind click handlers mimicking SeatMap client script
  const container = document.getElementById('seat-map')!;
  Array.from(container.querySelectorAll('button[data-seat-id]')).forEach((btn) => {
    btn.addEventListener('click', () => {
      const seatId = btn.getAttribute('data-seat-id');
      if (!seatId) return;
      window.dispatchEvent(new CustomEvent('seat:selected', { detail: { seatId } }));
      container.querySelectorAll('button').forEach((el) => el.classList.remove('ring-2', 'ring-accent'));
      btn.classList.add('ring-2', 'ring-accent');
    });
  });
}

describe('SeatMap behavior (DOM simulation)', () => {
  const busId = 'bus-1';
  const schedA = 'sched-A';

  let seats: Seat[];
  beforeEach(() => {
    seats = [
      { id: 's1', busId, number: '1', status: 'available', scheduleId: null },
      { id: 's2', busId, number: '2', status: 'reserved', scheduleId: schedA }, // reserved for same schedule -> disabled
      { id: 's3', busId, number: '3', status: 'reserved', scheduleId: 'sched-B' }, // reserved other schedule -> enabled
    ];
  });

  it('disables seats reserved for current schedule and enables available/other-schedule ones', () => {
    renderSeatMap({ seats, scheduleId: schedA });

    const s1 = document.querySelector('button[data-seat-id="s1"]') as HTMLButtonElement;
    const s2 = document.querySelector('button[data-seat-id="s2"]') as HTMLButtonElement;
    const s3 = document.querySelector('button[data-seat-id="s3"]') as HTMLButtonElement;

    expect(s1.disabled).toBe(false);
    expect(s2.disabled).toBe(true);
    expect(s3.disabled).toBe(false);
  });

  it('dispatches seat:selected on click and adds visual feedback class', async () => {
    renderSeatMap({ seats, scheduleId: schedA });

    const s1 = document.querySelector('button[data-seat-id="s1"]') as HTMLButtonElement;

    const listener = vi.fn();
    window.addEventListener('seat:selected', (e: Event) => {
      const detail = (e as CustomEvent).detail;
      listener(detail?.seatId);
    });

    await fireEvent.click(s1);

    expect(listener).toHaveBeenCalledWith('s1');
    expect(s1.classList.contains('ring-2')).toBe(true);
  });
});
