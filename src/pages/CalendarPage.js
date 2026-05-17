import { useState } from 'react';
import { useReminders } from '../context/ReminderContext';
import { daysUntil, eventTypeIcon } from '../utils/reminderEngine';
import ReminderItem  from './ReminderItem';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function getCalendarDays(year, month) {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  // Monday = 0 offset
  let startDay = first.getDay() - 1;
  if (startDay < 0) startDay = 6;

  const days = [];
  // Pad leading blanks
  for (let i = 0; i < startDay; i++) days.push(null);
  for (let d = 1; d <= last.getDate(); d++) days.push(d);
  return days;
}

function CalendarPage() {
  const { reminders, isLoading, error, refresh } = useReminders();
  const activeReminders = reminders.filter((r) => r.is_active);
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const todayDate = today.getDate();
  const days = getCalendarDays(year, month);
  const getMonthLabel = () => new Date(year, month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  function getRemindersForDay(day) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return activeReminders.filter((r) => r.event_date === dateStr);
  }

  function getRemindersForMonth() {
    const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`;
    return activeReminders.filter((r) => r.event_date.startsWith(monthStr));
  }

  function nextMonth() {
    setMonth((prev) => {
      if (prev === 11) {
        setYear((y) => y + 1);
        return 0;
      }
      return prev + 1;
    });
  }
  
  function prevMonth() {  
    setMonth((prev) => {
      if (prev === 0) {
        setYear((y) => y - 1);
        return 11;
      }
      return prev - 1;
    });
  }

  function Header() {
    return (
    <div className="cal-header">
      <button onClick={prevMonth}>Previous</button>
      <h2 className="cal-month">{getMonthLabel()}</h2>
      <button onClick={nextMonth}>Next</button>
    </div>
    );
  }

  if (isLoading) {
    return (
      <div className="cal">
        <Header />
        <p className="cal-hint">Loading…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cal">
        <Header />
        <p className="cal-hint">{error}</p>
        <button className="button-secondary" onClick={refresh}>Retry</button>
      </div>
    );
  }

  return (
    <div className="cal">
      <Header />

      <div className="cal-grid">
        {DAYS.map((d) => (
          <div key={d} className="cal-day-label">{d}</div>
        ))}
        {days.map((day, i) => {
          if (day === null) {
            return <div key={`blank-${i}`} className="cal-cell cal-cell--blank" />;
          }
          const reminders = getRemindersForDay(day);
          const isToday = day === todayDate;
          return (
            <div
              key={day}
              className={`cal-cell${isToday ? ' cal-cell--today' : ''}${reminders.length ? ' cal-cell--has-event' : ''}`}
            >
              <span className="cal-cell-num">{day}</span>
              {reminders.map((r) => (
                <span key={r.id} className="cal-dot" title={r.title}>
                  <span className="material-symbols-outlined cal-dot-icon">
                    {eventTypeIcon(r.event_type)}
                  </span>
                </span>
              ))}
            </div>
          );
        })}
      </div>

      {/* Upcoming sidebar */}
      <div className="cal-upcoming">
        <h3 className="cal-upcoming-title">This month</h3>
        {getRemindersForMonth().length === 0 ? (
          <p className="cal-upcoming-empty">No events this month.</p>
        ) : (
          <ul className="cal-upcoming-list">
            {getRemindersForMonth()
              .sort((a, b) => daysUntil(a.event_date) - daysUntil(b.event_date))
              .map((r) => (
                <li key={r.id} className="cal-upcoming-item">
                  <ReminderItem reminder={r} />
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default CalendarPage;
