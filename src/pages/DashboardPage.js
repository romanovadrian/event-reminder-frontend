import { Link } from 'react-router-dom';
import { useReminders } from '../context/ReminderContext';
import {
  daysUntil,
  daysUntilLabel,
  eventTypeIcon,
  eventTypeLabel,
  upcomingReminders,
} from '../utils/reminderEngine';

function DashboardPage() {
  const { reminders, isLoading, error, refresh } = useReminders();
  const upcoming = upcomingReminders(reminders, 30);
  const spotlight = upcoming[0] || null;

  if (isLoading) {
    return (
      <div className="dash">
        <div className="dash-empty">
          <span className="material-symbols-outlined dash-empty-icon">hourglass_top</span>
          <p className="dash-empty-title">Loading reminders…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dash">
        <div className="dash-empty">
          <span className="material-symbols-outlined dash-empty-icon">error_outline</span>
          <p className="dash-empty-title">Something went wrong</p>
          <p className="dash-empty-copy">{error}</p>
          <button className="dash-action-btn dash-action-btn--secondary" onClick={refresh}>
            <span className="material-symbols-outlined">refresh</span>
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dash">
      {/* ── Spotlight: next upcoming reminder ── */}
      {spotlight && (
        <section className="dash-spotlight" aria-label="Next upcoming event">
          <div className="dash-spotlight-body">
            <span className="dash-spotlight-badge">
              <span className="material-symbols-outlined dash-spotlight-badge-icon">
                {eventTypeIcon(spotlight.event_type)}
              </span>
              {eventTypeLabel(spotlight.event_type)}
            </span>
            <h2 className="dash-spotlight-title">{spotlight.title}</h2>
            {spotlight.notes && (
              <p className="dash-spotlight-notes">{spotlight.notes}</p>
            )}
            <p className="dash-spotlight-date">
              {new Date(spotlight.event_date).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <div className="dash-countdown" aria-label="Countdown">
            <span className="dash-countdown-value">{daysUntil(spotlight.event_date)}</span>
            <span className="dash-countdown-unit">
              {daysUntil(spotlight.event_date) === 1 ? 'day left' : 'days left'}
            </span>
          </div>
        </section>
      )}

      {/* ── Quick actions ── */}
      <div className="dash-actions">
        <Link to="/reminders/new" className="dash-action-btn dash-action-btn--primary">
          <span className="material-symbols-outlined">add</span>
          New Reminder
        </Link>
        <Link to="/calendar" className="dash-action-btn dash-action-btn--secondary">
          <span className="material-symbols-outlined">calendar_month</span>
          View Calendar
        </Link>
      </div>

      {/* ── Upcoming reminders list ── */}
      <section className="dash-upcoming" aria-label="Upcoming reminders">
        <div className="dash-section-header">
          <h3 className="dash-section-title">Upcoming Reminders</h3>
          <span className="dash-section-count">{upcoming.length} in next 30 days</span>
        </div>

        {upcoming.length === 0 ? (
          <div className="dash-empty">
            <span className="material-symbols-outlined dash-empty-icon">event_available</span>
            <p className="dash-empty-title">No upcoming reminders</p>
            <p className="dash-empty-copy">
              Add your first reminder to start tracking the moments that matter.
            </p>
            <Link to="/reminders/new" className="dash-action-btn dash-action-btn--primary">
              <span className="material-symbols-outlined">add</span>
              Create Reminder
            </Link>
          </div>
        ) : (
          <ul className="dash-reminder-list">
            {upcoming.map((reminder) => {
              const days = daysUntil(reminder.event_date);
              return (
                <li key={reminder.id} className="dash-reminder-card">
                  <Link to={`/reminders/${reminder.id}`} className="dash-reminder-link">
                    <div className="dash-reminder-icon-wrap">
                      <span className="material-symbols-outlined">
                        {eventTypeIcon(reminder.event_type)}
                      </span>
                    </div>
                    <div className="dash-reminder-body">
                      <h4 className="dash-reminder-title">{reminder.title}</h4>
                      <p className="dash-reminder-meta">
                        <span className="dash-reminder-type">
                          {eventTypeLabel(reminder.event_type)}
                        </span>
                        <span className="dash-reminder-date">
                          {new Date(reminder.event_date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </p>
                    </div>
                    <span
                      className={`dash-reminder-countdown${days <= 3 ? ' dash-reminder-countdown--urgent' : ''}`}
                    >
                      {daysUntilLabel(days)}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* ── Status summary ── */}
      <div className="dash-status-row">
        <div className="dash-status-card">
          <span className="material-symbols-outlined dash-status-icon">notifications_active</span>
          <div>
            <p className="dash-status-value">{upcoming.filter((r) => daysUntil(r.event_date) <= 7).length}</p>
            <p className="dash-status-label">This week</p>
          </div>
        </div>
        <div className="dash-status-card">
          <span className="material-symbols-outlined dash-status-icon">event</span>
          <div>
            <p className="dash-status-value">{upcoming.length}</p>
            <p className="dash-status-label">Next 30 days</p>
          </div>
        </div>
        <div className="dash-status-card">
          <span className="material-symbols-outlined dash-status-icon">check_circle</span>
          <div>
            <p className="dash-status-value">{reminders.filter((r) => r.is_active).length}</p>
            <p className="dash-status-label">Active reminders</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
