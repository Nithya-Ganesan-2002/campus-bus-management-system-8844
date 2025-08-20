//
// Client-side data services for the College Bus Management System.
// PUBLIC_INTERFACE: Provides CRUD operations for routes, drivers, buses, schedules, seats, and bookings,
// backed by localStorage persistence with simple versioning.
// No external API: this is a self-contained mock data layer for the Astro demo.
//

import { getMockData, MOCK_DATA_VERSION } from './mockData';
import type {
  DataEnvelope,
  Route,
  Driver,
  Bus,
  Schedule,
  Seat,
  Booking,
  ID,
  PagedResult,
  Pagination,
  CollectionKey,
  EntityKind,
} from './types';

// Storage keys
const STORAGE_KEY = 'cbms_data';
const STORAGE_VER_KEY = 'cbms_data_version';

// Utility: generate a pseudo-UUID (sufficient for mock/demo)
function uuid(): ID {
  // Not cryptographically secure; good for local mock data
  return 'id-' + Math.random().toString(36).slice(2) + '-' + Date.now().toString(36);
}

function isoNow(): string {
  return new Date().toISOString();
}

// Load current data, initializing if needed
function ensureData(): DataEnvelope {
  try {
    const verRaw = localStorage.getItem(STORAGE_VER_KEY);
    const dataRaw = localStorage.getItem(STORAGE_KEY);
    const storedVersion = verRaw ? parseInt(verRaw, 10) : 0;

    if (!dataRaw || !storedVersion || storedVersion < MOCK_DATA_VERSION) {
      // Initialize or migrate (simple reset for demo)
      const mock = getMockData();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mock));
      localStorage.setItem(STORAGE_VER_KEY, String(MOCK_DATA_VERSION));
      return mock;
    }

    const parsed: DataEnvelope = JSON.parse(dataRaw);
    // Very basic structural check
    if (!parsed || !parsed.version) {
      const mock = getMockData();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mock));
      localStorage.setItem(STORAGE_VER_KEY, String(MOCK_DATA_VERSION));
      return mock;
    }
    return parsed;
  } catch {
    // Storage not available or data corrupted: fall back to in-memory mock (non-persistent)
    return getMockData();
  }
}

function saveData(next: DataEnvelope) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    localStorage.setItem(STORAGE_VER_KEY, String(next.version));
  } catch {
    // Ignore storage issues (e.g., private mode)
  }
}

// Mutate helper
function withUpdate(mutator: (data: DataEnvelope) => void): DataEnvelope {
  const data = ensureData();
  mutator(data);
  data.lastUpdated = isoNow();
  // Keep same version number here; only bump when migration/schema changes
  saveData(data);
  return data;
}

// Generic helpers
function findById<T extends { id: ID }>(arr: T[], id: ID): T | undefined {
  return arr.find((x) => x.id === id);
}

function removeById<T extends { id: ID }>(arr: T[], id: ID): boolean {
  const idx = arr.findIndex((x) => x.id === id);
  if (idx >= 0) {
    arr.splice(idx, 1);
    return true;
  }
  return false;
}

function paginate<T>(items: T[], pagination?: Partial<Pagination>): PagedResult<T> {
  const page = Math.max(1, pagination?.page ?? 1);
  const pageSize = Math.max(1, Math.min(1000, pagination?.pageSize ?? 20));
  const start = (page - 1) * pageSize;
  const sliced = items.slice(start, start + pageSize);
  return {
    items: sliced,
    total: items.length,
    page,
    pageSize,
  };
}

// PUBLIC_INTERFACE
export function resetToMock(): DataEnvelope {
  const mock = getMockData();
  saveData(mock);
  return mock;
}

// PUBLIC_INTERFACE
export function getEnvelope(): DataEnvelope {
  return ensureData();
}

// PUBLIC_INTERFACE
export function listAll<K extends CollectionKey>(collection: K): DataEnvelope[K] {
  const env = ensureData();
  return env[collection];
}

// PUBLIC_INTERFACE
export function listPaged<K extends CollectionKey>(
  collection: K,
  pagination?: Partial<Pagination>,
): PagedResult<DataEnvelope[K][number]> {
  const env = ensureData();
  return paginate(env[collection], pagination);
}

// PUBLIC_INTERFACE
export function getById(kind: EntityKind, id: ID): Route | Driver | Bus | Schedule | Seat | Booking | undefined {
  const env = ensureData();
  switch (kind) {
    case 'route':
      return findById(env.routes, id);
    case 'driver':
      return findById(env.drivers, id);
    case 'bus':
      return findById(env.buses, id);
    case 'schedule':
      return findById(env.schedules, id);
    case 'seat':
      return findById(env.seats, id);
    case 'booking':
      return findById(env.bookings, id);
  }
}

// PUBLIC_INTERFACE
export function createRoute(input: Omit<Route, 'id' | 'createdAt' | 'updatedAt' | 'kind'>): Route {
  const entity: Route = {
    ...input,
    id: uuid(),
    kind: 'route',
    createdAt: isoNow(),
    updatedAt: isoNow(),
  };
  withUpdate((d) => d.routes.push(entity));
  return entity;
}

// PUBLIC_INTERFACE
export function updateRoute(id: ID, patch: Partial<Route>): Route | undefined {
  let updated: Route | undefined;
  withUpdate((d) => {
    const current = findById(d.routes, id);
    if (!current) return;
    updated = { ...current, ...patch, id: current.id, updatedAt: isoNow(), kind: 'route' };
    Object.assign(current, updated);
  });
  return updated;
}

// PUBLIC_INTERFACE
export function deleteRoute(id: ID): boolean {
  let removed = false;
  withUpdate((d) => {
    removed = removeById(d.routes, id);
    // Optional cascading clean-up: disassociate buses/schedules referencing this route
    if (removed) {
      d.buses = d.buses.map((b) => (b.routeId === id ? { ...b, routeId: null, updatedAt: isoNow() } : b));
      d.schedules = d.schedules.filter((s) => s.routeId !== id);
      d.bookings = d.bookings.filter((b) => b.routeId !== id);
    }
  });
  return removed;
}

// Drivers
// PUBLIC_INTERFACE
export function createDriver(input: Omit<Driver, 'id' | 'createdAt' | 'updatedAt' | 'kind'>): Driver {
  const entity: Driver = {
    ...input,
    id: uuid(),
    kind: 'driver',
    createdAt: isoNow(),
    updatedAt: isoNow(),
  };
  withUpdate((d) => d.drivers.push(entity));
  return entity;
}

// PUBLIC_INTERFACE
export function updateDriver(id: ID, patch: Partial<Driver>): Driver | undefined {
  let updated: Driver | undefined;
  withUpdate((d) => {
    const current = findById(d.drivers, id);
    if (!current) return;
    updated = { ...current, ...patch, id: current.id, updatedAt: isoNow(), kind: 'driver' };
    Object.assign(current, updated);
  });
  return updated;
}

// PUBLIC_INTERFACE
export function deleteDriver(id: ID): boolean {
  let removed = false;
  withUpdate((d) => {
    removed = removeById(d.drivers, id);
    if (removed) {
      // Unassign from buses
      d.buses = d.buses.map((b) => (b.driverId === id ? { ...b, driverId: null, updatedAt: isoNow() } : b));
    }
  });
  return removed;
}

// Buses
// PUBLIC_INTERFACE
export function createBus(input: Omit<Bus, 'id' | 'createdAt' | 'updatedAt' | 'kind'>): Bus {
  const entity: Bus = {
    ...input,
    id: uuid(),
    kind: 'bus',
    createdAt: isoNow(),
    updatedAt: isoNow(),
  };
  withUpdate((d) => d.buses.push(entity));
  return entity;
}

// PUBLIC_INTERFACE
export function updateBus(id: ID, patch: Partial<Bus>): Bus | undefined {
  let updated: Bus | undefined;
  withUpdate((d) => {
    const current = findById(d.buses, id);
    if (!current) return;
    updated = { ...current, ...patch, id: current.id, updatedAt: isoNow(), kind: 'bus' };
    Object.assign(current, updated);
  });
  return updated;
}

// PUBLIC_INTERFACE
export function deleteBus(id: ID): boolean {
  let removed = false;
  withUpdate((d) => {
    removed = removeById(d.buses, id);
    if (removed) {
      // Remove schedules and seats for this bus, cascade bookings referencing it
      d.schedules = d.schedules.filter((s) => s.busId !== id);
      d.seats = d.seats.filter((s) => s.busId !== id);
      d.bookings = d.bookings.filter((b) => b.busId !== id);
    }
  });
  return removed;
}

// Schedules
// PUBLIC_INTERFACE
export function createSchedule(input: Omit<Schedule, 'id' | 'createdAt' | 'updatedAt' | 'kind'>): Schedule {
  const entity: Schedule = {
    ...input,
    id: uuid(),
    kind: 'schedule',
    createdAt: isoNow(),
    updatedAt: isoNow(),
  };
  withUpdate((d) => d.schedules.push(entity));
  return entity;
}

// PUBLIC_INTERFACE
export function updateSchedule(id: ID, patch: Partial<Schedule>): Schedule | undefined {
  let updated: Schedule | undefined;
  withUpdate((d) => {
    const current = findById(d.schedules, id);
    if (!current) return;
    updated = { ...current, ...patch, id: current.id, updatedAt: isoNow(), kind: 'schedule' };
    Object.assign(current, updated);
  });
  return updated;
}

// PUBLIC_INTERFACE
export function deleteSchedule(id: ID): boolean {
  let removed = false;
  withUpdate((d) => {
    removed = removeById(d.schedules, id);
    if (removed) {
      // Release seats locked to this schedule, remove bookings on this schedule
      d.seats = d.seats.map((s) =>
        s.scheduleId === id ? { ...s, scheduleId: null, status: 'available', updatedAt: isoNow() } : s,
      );
      d.bookings = d.bookings.filter((b) => b.scheduleId !== id);
    }
  });
  return removed;
}

// Seats
// PUBLIC_INTERFACE
export function createSeat(input: Omit<Seat, 'id' | 'createdAt' | 'updatedAt' | 'kind'>): Seat {
  const entity: Seat = {
    ...input,
    id: uuid(),
    kind: 'seat',
    createdAt: isoNow(),
    updatedAt: isoNow(),
  };
  withUpdate((d) => d.seats.push(entity));
  return entity;
}

// PUBLIC_INTERFACE
export function updateSeat(id: ID, patch: Partial<Seat>): Seat | undefined {
  let updated: Seat | undefined;
  withUpdate((d) => {
    const current = findById(d.seats, id);
    if (!current) return;
    updated = { ...current, ...patch, id: current.id, updatedAt: isoNow(), kind: 'seat' };
    Object.assign(current, updated);
  });
  return updated;
}

// PUBLIC_INTERFACE
export function deleteSeat(id: ID): boolean {
  let removed = false;
  withUpdate((d) => {
    removed = removeById(d.seats, id);
    if (removed) {
      // Remove bookings that referenced this seat
      d.bookings = d.bookings.map((b) => (b.seatId === id ? { ...b, seatId: null, updatedAt: isoNow() } : b));
    }
  });
  return removed;
}

// Bookings
// PUBLIC_INTERFACE
export function createBooking(input: Omit<Booking, 'id' | 'createdAt' | 'updatedAt' | 'kind' | 'status'> & { status?: Booking['status'] }): Booking {
  const entity: Booking = {
    ...input,
    id: uuid(),
    kind: 'booking',
    status: input.status ?? 'pending',
    createdAt: isoNow(),
    updatedAt: isoNow(),
  };
  withUpdate((d) => {
    d.bookings.push(entity);
    // If a seat is selected, mark it reserved for this schedule
    if (entity.seatId) {
      const seat = findById(d.seats, entity.seatId);
      if (seat) {
        seat.status = 'reserved';
        seat.scheduleId = entity.scheduleId;
        seat.updatedAt = isoNow();
      }
    }
  });
  return entity;
}

// PUBLIC_INTERFACE
export function updateBooking(id: ID, patch: Partial<Booking>): Booking | undefined {
  let updated: Booking | undefined;
  withUpdate((d) => {
    const current = findById(d.bookings, id);
    if (!current) return;

    const beforeSeatId = current.seatId;
    updated = { ...current, ...patch, id: current.id, updatedAt: isoNow(), kind: 'booking' };
    Object.assign(current, updated);

    // Handle seat reassignments
    if (beforeSeatId !== current.seatId) {
      // Release previous seat
      if (beforeSeatId) {
        const prevSeat = findById(d.seats, beforeSeatId);
        if (prevSeat) {
          prevSeat.status = 'available';
          prevSeat.scheduleId = null;
          prevSeat.updatedAt = isoNow();
        }
      }
      // Reserve new seat
      if (current.seatId) {
        const newSeat = findById(d.seats, current.seatId);
        if (newSeat) {
          newSeat.status = 'reserved';
          newSeat.scheduleId = current.scheduleId;
          newSeat.updatedAt = isoNow();
        }
      }
    }
  });
  return updated;
}

// PUBLIC_INTERFACE
export function deleteBooking(id: ID): boolean {
  let removed = false;
  withUpdate((d) => {
    const current = findById(d.bookings, id);
    removed = removeById(d.bookings, id);
    if (removed && current?.seatId) {
      const seat = findById(d.seats, current.seatId);
      if (seat) {
        seat.status = 'available';
        seat.scheduleId = null;
        seat.updatedAt = isoNow();
      }
    }
  });
  return removed;
}

// Convenience queries
// PUBLIC_INTERFACE
export function getBusOccupancy(busId: ID, scheduleId?: ID): { capacity: number; reserved: number; available: number } {
  const env = ensureData();
  const bus = findById(env.buses, busId);
  const capacity = bus?.capacity ?? 0;

  // Count seats that are reserved (optionally for a specific schedule)
  const reserved = env.seats.filter((s) => s.busId === busId && s.status === 'reserved' && (!scheduleId || s.scheduleId === scheduleId)).length;
  const available = Math.max(0, capacity - reserved);
  return { capacity, reserved, available };
}

// PUBLIC_INTERFACE
export function listRoutesActive(): Route[] {
  return ensureData().routes.filter((r) => r.status === 'active');
}

// PUBLIC_INTERFACE
export function assignDriverToBus(busId: ID, driverId: ID | null): Bus | undefined {
  return updateBus(busId, { driverId });
}

// PUBLIC_INTERFACE
export function assignRouteToBus(busId: ID, routeId: ID | null): Bus | undefined {
  return updateBus(busId, { routeId });
}
