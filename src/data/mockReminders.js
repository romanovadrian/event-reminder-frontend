/**
 * Mock reminder data for dashboard development.
 * Matches the ReminderRead schema from the backend API.
 * This module will be replaced by real API calls in Phase 6.
 */

// Helpers to generate dates relative to today
function daysFromNow(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().split('T')[0];
}

function pastDate(year, month, day) {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

const MOCK_REMINDERS = [
  {
    id: 'a1b2c3d4-0001-4000-8000-000000000001',
    title: "Mum's Birthday",
    event_type: 'birthday',
    event_date: daysFromNow(3),
    remind_days_before: 3,
    notes: 'Loves tulips and dark chocolate',
    is_active: true,
    created_at: pastDate(2026, 1, 15) + 'T10:00:00Z',
    updated_at: pastDate(2026, 1, 15) + 'T10:00:00Z',
  },
  {
    id: 'a1b2c3d4-0001-4000-8000-000000000002',
    title: 'Wedding Anniversary',
    event_type: 'anniversary',
    event_date: daysFromNow(12),
    remind_days_before: 7,
    notes: 'Book restaurant and flowers',
    is_active: true,
    created_at: pastDate(2026, 2, 1) + 'T09:00:00Z',
    updated_at: pastDate(2026, 2, 1) + 'T09:00:00Z',
  },
  {
    id: 'a1b2c3d4-0001-4000-8000-000000000003',
    title: "Dad's Retirement Party",
    event_type: 'custom',
    event_date: daysFromNow(21),
    remind_days_before: 5,
    notes: 'Venue booked at The Grand. Invite extended family.',
    is_active: true,
    created_at: pastDate(2026, 3, 10) + 'T14:00:00Z',
    updated_at: pastDate(2026, 3, 10) + 'T14:00:00Z',
  },
  {
    id: 'a1b2c3d4-0001-4000-8000-000000000004',
    title: "Best Friend's Birthday",
    event_type: 'birthday',
    event_date: daysFromNow(28),
    remind_days_before: 3,
    notes: 'Surprise party — coordinate with Alex',
    is_active: true,
    created_at: pastDate(2026, 3, 20) + 'T11:00:00Z',
    updated_at: pastDate(2026, 3, 20) + 'T11:00:00Z',
  },
  {
    id: 'a1b2c3d4-0001-4000-8000-000000000005',
    title: 'Work Anniversary',
    event_type: 'anniversary',
    event_date: daysFromNow(45),
    remind_days_before: 2,
    notes: '5 years at the company',
    is_active: true,
    created_at: pastDate(2026, 4, 1) + 'T08:00:00Z',
    updated_at: pastDate(2026, 4, 1) + 'T08:00:00Z',
  },
  {
    id: 'a1b2c3d4-0001-4000-8000-000000000006',
    title: 'Graduation Ceremony',
    event_type: 'custom',
    event_date: daysFromNow(60),
    remind_days_before: 7,
    notes: null,
    is_active: false,
    created_at: pastDate(2026, 4, 5) + 'T16:00:00Z',
    updated_at: pastDate(2026, 4, 5) + 'T16:00:00Z',
  },
];

export default MOCK_REMINDERS;
