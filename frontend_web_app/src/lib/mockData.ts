//
// Mock data for the College Bus Management System.
// PUBLIC_INTERFACE: Provides initial seed data used by services when no data is present.
//

import type { DataEnvelope, Route, Driver, Bus, Schedule, Seat, Booking, ID } from './types';

// Helpers
function isoNow(): string {
  return new Date().toISOString();
}

function base<T extends { id: ID }>(obj: T): T & { createdAt: string; updatedAt: string } {
  const now = isoNow();
  return { ...obj, createdAt: now, updatedAt: now };
}

// Predefined IDs to make relations easy in mock data
const routeIds = {
  mainLoop: 'route-main-loop',
  northLine: 'route-north-line',
  southExpress: 'route-south-express',
} as const;

const driverIds = {
  kumar: 'driver-kumar',
  rao: 'driver-rao',
  singh: 'driver-singh',
} as const;

const busIds = {
  bus12: 'bus-12',
  bus7: 'bus-7',
  bus22: 'bus-22',
} as const;

const scheduleIds = {
  s1: 'schedule-1',
  s2: 'schedule-2',
  s3: 'schedule-3',
} as const;



// Routes
const routes: Route[] = [
  base<Route>({
    id: routeIds.mainLoop,
    kind: 'route',
    name: 'Main Campus Loop',
    stops: ['Gate A', 'Library', 'Lab Complex', 'Dorms'],
    firstBusTime: '07:30',
    lastBusTime: '18:30',
    status: 'active',
    description: 'Frequent loop around main campus points.',
  }),
  base<Route>({
    id: routeIds.northLine,
    kind: 'route',
    name: 'North Line',
    stops: ['North Gate', 'Auditorium', 'Research Block'],
    firstBusTime: '07:15',
    lastBusTime: '17:45',
    status: 'active',
  }),
  base<Route>({
    id: routeIds.southExpress,
    kind: 'route',
    name: 'South Express',
    stops: ['South Gate', 'Sports Complex'],
    firstBusTime: '07:00',
    lastBusTime: '19:00',
    status: 'inactive',
    description: 'Runs based on demand.',
  }),
];

// Drivers
const drivers: Driver[] = [
  base<Driver>({
    id: driverIds.kumar,
    kind: 'driver',
    fullName: 'A. Kumar',
    phone: '+91 99999 10001',
    licenseNumber: 'DL-IND-1234',
    active: true,
  }),
  base<Driver>({
    id: driverIds.rao,
    kind: 'driver',
    fullName: 'S. Rao',
    phone: '+91 99999 10002',
    licenseNumber: 'DL-IND-5678',
    active: true,
  }),
  base<Driver>({
    id: driverIds.singh,
    kind: 'driver',
    fullName: 'P. Singh',
    phone: '+91 99999 10003',
    licenseNumber: 'DL-IND-9012',
    active: false,
  }),
];

// Buses
const buses: Bus[] = [
  base<Bus>({
    id: busIds.bus12,
    kind: 'bus',
    code: 'Bus 12',
    capacity: 40,
    driverId: driverIds.kumar,
    routeId: routeIds.mainLoop,
    status: 'active',
  }),
  base<Bus>({
    id: busIds.bus7,
    kind: 'bus',
    code: 'Bus 7',
    capacity: 40,
    driverId: driverIds.rao,
    routeId: routeIds.northLine,
    status: 'active',
  }),
  base<Bus>({
    id: busIds.bus22,
    kind: 'bus',
    code: 'Bus 22',
    capacity: 32,
    driverId: null,
    routeId: routeIds.southExpress,
    status: 'maintenance',
  }),
];

// Schedules
const todayISO = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
const schedules: Schedule[] = [
  base<Schedule>({
    id: scheduleIds.s1,
    kind: 'schedule',
    busId: busIds.bus12,
    routeId: routeIds.mainLoop,
    serviceDate: todayISO,
    startTime: '08:00',
    endTime: '18:00',
    recurrence: 'weekday',
  }),
  base<Schedule>({
    id: scheduleIds.s2,
    kind: 'schedule',
    busId: busIds.bus7,
    routeId: routeIds.northLine,
    serviceDate: todayISO,
    startTime: '07:30',
    endTime: '17:30',
    recurrence: 'weekday',
  }),
  base<Schedule>({
    id: scheduleIds.s3,
    kind: 'schedule',
    busId: busIds.bus22,
    routeId: routeIds.southExpress,
    serviceDate: todayISO,
    startTime: '07:00',
    endTime: '19:00',
    recurrence: 'none',
  }),
];

// Seats (generate a subset for demo)
function makeSeats(busId: ID, count: number): Seat[] {
  const seats: Seat[] = [];
  for (let i = 1; i <= count; i++) {
    seats.push(
      base<Seat>({
        id: `${busId}-seat-${i}`,
        kind: 'seat',
        busId,
        number: `${i}`,
        status: 'available',
        scheduleId: null,
      }),
    );
  }
  return seats;
}

const seats: Seat[] = [
  ...makeSeats(busIds.bus12, 10),
  ...makeSeats(busIds.bus7, 8),
  ...makeSeats(busIds.bus22, 6),
];

// Bookings (a couple of example records)
const bookings: Booking[] = [
  base<Booking>({
    id: 'booking-1',
    kind: 'booking',
    studentId: 'STU12345',
    routeId: routeIds.mainLoop,
    busId: busIds.bus12,
    seatId: `${busIds.bus12}-seat-1`,
    scheduleId: scheduleIds.s1,
    travelDate: todayISO,
    status: 'confirmed',
    notes: 'Registered from student portal',
  }),
  base<Booking>({
    id: 'booking-2',
    kind: 'booking',
    studentId: 'STU88888',
    routeId: routeIds.northLine,
    busId: busIds.bus7,
    seatId: null,
    scheduleId: scheduleIds.s2,
    travelDate: todayISO,
    status: 'pending',
  }),
];

// PUBLIC_INTERFACE
export const MOCK_DATA_VERSION = 1;

// PUBLIC_INTERFACE
export function getMockData(): DataEnvelope {
  return {
    version: MOCK_DATA_VERSION,
    lastUpdated: isoNow(),
    routes,
    drivers,
    buses,
    schedules,
    seats,
    bookings,
  };
}
