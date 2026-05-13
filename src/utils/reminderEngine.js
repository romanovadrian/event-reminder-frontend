/**
 * Pure utility functions for reminder date computations.
 * No side effects — operates on reminder objects matching the ReminderRead schema.
 */

/**
 * Calculate the number of days from today until the next occurrence of an event date.
 * Handles year-wrap for recurring annual events.
 * Returns 0 for today.
 */
export function daysUntil(dateString) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [, month, day] = dateString.split('-').map(Number);

  // Try this year first
  let next = new Date(today.getFullYear(), month - 1, day);
  next.setHours(0, 0, 0, 0);

  // If already passed this year, try next year
  if (next < today) {
    next = new Date(today.getFullYear() + 1, month - 1, day);
    next.setHours(0, 0, 0, 0);
  }

  return Math.round((next - today) / (1000 * 60 * 60 * 24));
}

/**
 * Filter and sort reminders that occur within the next `days` days.
 * Only includes active reminders.
 */
export function upcomingReminders(reminders, days = 30) {
  return reminders
    .filter((r) => r.is_active && daysUntil(r.event_date) <= days)
    .sort((a, b) => daysUntil(a.event_date) - daysUntil(b.event_date));
}

/**
 * Format a days-until value into a human-friendly label.
 */
export function daysUntilLabel(n) {
  if (n === 0) return 'Today';
  if (n === 1) return 'Tomorrow';
  return `${n} days`;
}

/**
 * Map event_type to a display label.
 */
export function eventTypeLabel(eventType) {
  const labels = {
    birthday: 'Birthday',
    anniversary: 'Anniversary',
    custom: 'Event',
  };
  return labels[eventType] || 'Event';
}

/**
 * Map event_type to a Material Symbols icon name.
 */
export function eventTypeIcon(eventType) {
  const icons = {
    birthday: 'cake',
    anniversary: 'favorite',
    custom: 'celebration',
  };
  return icons[eventType] || 'event';
}
