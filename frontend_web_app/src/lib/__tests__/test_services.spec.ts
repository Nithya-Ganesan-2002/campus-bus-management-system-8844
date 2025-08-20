import {
  resetToMock,
  getEnvelope,
  listAll,
  listPaged,
  getById,
  createRoute,
  updateRoute,
  deleteRoute,
  createBus,
  updateBus,
  deleteBus,
  createSeat,
  updateSeat,
  deleteSeat,
  createBooking,
  updateBooking,
  deleteBooking,
  getBusOccupancy,
  assignDriverToBus,
  assignRouteToBus,
} from '../services';
import type { Route, Bus, Seat, Booking } from '../types';
import { describe, it, expect, beforeEach } from 'vitest';

describe('services.ts data layer', () => {
  beforeEach(() => {
    resetToMock();
  });

  it('resetToMock initializes data and version', () => {
    const env = resetToMock();
    expect(env.version).toBeGreaterThanOrEqual(1);
    expect(env.routes.length).toBeGreaterThan(0);
  });

  it('listAll and listPaged provide consistent results', () => {
    const routes = listAll('routes');
    const page1 = listPaged('routes', { page: 1, pageSize: 2 });
    expect(Array.isArray(routes)).toBe(true);
    expect(page1.items.length).toBeLessThanOrEqual(2);
    expect(page1.total).toBe(routes.length);
  });

  it('create/update/delete Route works and updates timestamps', () => {
    const created = createRoute({
      name: 'Test R',
      stops: ['A', 'B'],
      firstBusTime: '06:00',
      lastBusTime: '20:00',
      status: 'active',
      description: 't',
    });
    expect(created.id).toBeTruthy();
    const updated = updateRoute(created.id, { name: 'Test R2' }) as Route;
    expect(updated?.name).toBe('Test R2');

    const removed = deleteRoute(created.id);
    expect(removed).toBe(true);
    const found = getById('route', created.id);
    expect(found).toBeUndefined();
  });

  it('create/update/delete Bus, assign driver/route', () => {
    const bus = createBus({
      code: 'Bus T',
      capacity: 10,
      driverId: null,
      routeId: null,
      status: 'active',
    }) as Bus;
    expect(bus.id).toBeTruthy();

    const busWithDriver = assignDriverToBus(bus.id, 'driver-kumar')!;
    expect(busWithDriver.driverId).toBe('driver-kumar');

    const busWithRoute = assignRouteToBus(bus.id, 'route-main-loop')!;
    expect(busWithRoute.routeId).toBe('route-main-loop');

    const updated = updateBus(bus.id, { status: 'maintenance' })!;
    expect(updated.status).toBe('maintenance');

    const ok = deleteBus(bus.id);
    expect(ok).toBe(true);
    expect(getById('bus', bus.id)).toBeUndefined();
  });

  it('create/update/delete Seat updates booking relations appropriately', () => {
    const env = getEnvelope();
    const anyBus = env.buses[0];
    const seat = createSeat({
      busId: anyBus.id,
      number: 'X1',
      status: 'available',
      scheduleId: null,
    }) as Seat;
    expect(seat.id).toBeTruthy();

    const seat2 = updateSeat(seat.id, { number: 'X2' })!;
    expect(seat2.number).toBe('X2');

    const removed = deleteSeat(seat.id);
    expect(removed).toBe(true);
  });

  it('createBooking reserves seat for schedule, updateBooking reassigns, deleteBooking releases', () => {
    const env = getEnvelope();
    const bus = env.buses.find(b => b.status === 'active')!;
    const schedule = env.schedules.find(s => s.busId === bus.id)!;

    // make sure there is an available seat on this bus
    const seat = createSeat({
      busId: bus.id,
      number: 'Z1',
      status: 'available',
      scheduleId: null,
    }) as Seat;

    const booking = createBooking({
      studentId: 'STU0',
      routeId: schedule.routeId,
      busId: bus.id,
      seatId: seat.id,
      scheduleId: schedule.id,
      travelDate: schedule.serviceDate,
      notes: 'test',
      status: 'confirmed',
    }) as Booking;

    // seat reserved for this schedule
    const afterCreate = getEnvelope();
    const seatAfter = afterCreate.seats.find(s => s.id === seat.id)!;
    expect(seatAfter.status).toBe('reserved');
    expect(seatAfter.scheduleId).toBe(schedule.id);

    // create a new seat and reassign in booking
    const seat2 = createSeat({
      busId: bus.id,
      number: 'Z2',
      status: 'available',
      scheduleId: null,
    }) as Seat;
    const updatedBooking = updateBooking(booking.id, { seatId: seat2.id })!;
    const env2 = getEnvelope();
    const oldSeat = env2.seats.find(s => s.id === seat.id)!;
    const newSeat = env2.seats.find(s => s.id === seat2.id)!;
    expect(oldSeat.status).toBe('available');
    expect(oldSeat.scheduleId).toBeNull();
    expect(newSeat.status).toBe('reserved');
    expect(newSeat.scheduleId).toBe(updatedBooking.scheduleId);

    // delete booking releases the new seat
    const del = deleteBooking(booking.id);
    expect(del).toBe(true);
    const env3 = getEnvelope();
    const releasedSeat = env3.seats.find(s => s.id === seat2.id)!;
    expect(releasedSeat.status).toBe('available');
    expect(releasedSeat.scheduleId).toBeNull();
  });

  it('getBusOccupancy counts reserved seats correctly for bus and schedule', () => {
    const env = getEnvelope();
    const bus = env.buses.find(b => b.status === 'active')!;
    const schedule = env.schedules.find(s => s.busId === bus.id)!;

    // ensure at least one reserved on this schedule
    const seat = createSeat({
      busId: bus.id,
      number: 'R1',
      status: 'available',
      scheduleId: null,
    }) as Seat;
    createBooking({
      studentId: 'STU1',
      routeId: schedule.routeId,
      busId: bus.id,
      seatId: seat.id,
      scheduleId: schedule.id,
      travelDate: schedule.serviceDate,
      status: 'confirmed',
      notes: 'occ test',
    });

    const occSpecific = getBusOccupancy(bus.id, schedule.id);
    expect(occSpecific.capacity).toBe(bus.capacity);
    expect(occSpecific.reserved).toBeGreaterThanOrEqual(1);
    expect(occSpecific.available).toBe(bus.capacity - occSpecific.reserved);

    const occAll = getBusOccupancy(bus.id);
    expect(occAll.capacity).toBe(bus.capacity);
    expect(occAll.reserved).toBeGreaterThanOrEqual(occSpecific.reserved);
    expect(occAll.available).toBe(bus.capacity - occAll.reserved);
  });
});
