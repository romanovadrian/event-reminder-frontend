import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useReminders } from "../context/ReminderContext";
import { useUsers } from "../context/UserContext";
import {
  assignUserToReminder,
  listReminderUsers,
  unassignUserFromReminder,
} from "../services/reminderService";
import {
  daysUntil,
  daysUntilLabel,
  eventTypeIcon,
  eventTypeLabel,
} from "../utils/reminderEngine";

function ReminderDetailPage() {
  const { reminderId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { reminders, removeReminder } = useReminders();
  const { users } = useUsers();

  const [assignments, setAssignments] = useState([]);
  const [loadingAssignments, setLoadingAssignments] = useState(true);
  const [assignError, setAssignError] = useState(null);
  const [busy, setBusy] = useState(false);

  const reminder = reminders.find((r) => r.id === reminderId);

  const fetchAssignments = useCallback(async () => {
    if (!token || !reminderId) return;
    setLoadingAssignments(true);
    setAssignError(null);
    try {
      const data = await listReminderUsers(token, reminderId);
      setAssignments(Array.isArray(data) ? data : []);
    } catch (err) {
      setAssignError(err.message);
    } finally {
      setLoadingAssignments(false);
    }
  }, [token, reminderId]);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  if (!reminder) {
    return (
      <div className="detail">
        <div className="detail-empty">
          <span className="material-symbols-outlined detail-empty-icon">
            search_off
          </span>
          <p className="detail-empty-title">Reminder not found</p>
          <Link to="/" className="button-block">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const days = daysUntil(reminder.event_date);
  const assignedUserIds = new Set(assignments.map((a) => a.user_id));
  const availableUsers = users.filter((u) => !assignedUserIds.has(u.id));

  async function handleAssign(userId) {
    setBusy(true);
    setAssignError(null);
    try {
      await assignUserToReminder(token, reminderId, userId);
      await fetchAssignments();
    } catch (err) {
      setAssignError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleUnassign(userId) {
    setBusy(true);
    setAssignError(null);
    try {
      await unassignUserFromReminder(token, reminderId, userId);
      await fetchAssignments();
    } catch (err) {
      setAssignError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm(`Delete "${reminder.title}"? This cannot be undone.`))
      return;
    setBusy(true);
    try {
      await removeReminder(reminderId);
      navigate("/");
    } catch (err) {
      setAssignError(err.message);
      setBusy(false);
    }
  }

  return (
    <div className="detail">
      {/* ── Header ── */}
      <div className="detail-header">
        <Link to="/" className="detail-back" aria-label="Back to dashboard">
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <div className="detail-header-body">
          <span className="detail-badge">
            <span className="material-symbols-outlined">
              {eventTypeIcon(reminder.event_type)}
            </span>
            {eventTypeLabel(reminder.event_type)}
          </span>
          <h2 className="detail-title">{reminder.title}</h2>
        </div>
        <span
          className={`detail-countdown${days <= 3 ? " detail-countdown--urgent" : ""}`}
        >
          {daysUntilLabel(days)}
        </span>
      </div>

      {/* ── Info card ── */}
      <div className="detail-info">
        <div className="detail-info-row">
          <span className="material-symbols-outlined detail-info-icon">
            calendar_month
          </span>
          <div>
            <p className="detail-info-label">Event Date</p>
            <p className="detail-info-value">
              {new Date(reminder.event_date).toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
        <div className="detail-info-row">
          <span className="material-symbols-outlined detail-info-icon">
            notifications
          </span>
          <div>
            <p className="detail-info-label">Remind</p>
            <p className="detail-info-value">
              {reminder.remind_days_before === 0
                ? "On the day"
                : `${reminder.remind_days_before} day${reminder.remind_days_before > 1 ? "s" : ""} before`}
            </p>
          </div>
        </div>
        {reminder.notes && (
          <div className="detail-info-row">
            <span className="material-symbols-outlined detail-info-icon">
              sticky_note_2
            </span>
            <div>
              <p className="detail-info-label">Notes</p>
              <p className="detail-info-value">{reminder.notes}</p>
            </div>
          </div>
        )}
      </div>

      {/* ── Assigned users ── */}
      <section className="detail-section" aria-label="Assigned users">
        <div className="detail-section-header">
          <h3 className="detail-section-title">
            <span className="material-symbols-outlined">group</span>
            Assigned Users
          </h3>
          <span className="detail-section-count">{assignments.length}</span>
        </div>

        {assignError && (
          <div className="status-message status-error">{assignError}</div>
        )}

        {loadingAssignments ? (
          <p className="detail-hint">Loading assignments…</p>
        ) : assignments.length === 0 ? (
          <div className="detail-assign-empty">
            <p>
              No users assigned yet. Assign a user below to notify them about
              this event.
            </p>
          </div>
        ) : (
          <ul className="detail-assign-list">
            {assignments.map((a) => (
              <li key={a.id} className="detail-assign-card">
                <div className="detail-assign-avatar">
                  <span className="material-symbols-outlined">person</span>
                </div>
                <div className="detail-assign-body">
                  <p className="detail-assign-name">
                    {a.user?.full_name || a.user?.email || "Unknown user"}
                  </p>
                  <p className="detail-assign-meta">
                    Notify at {a.notify_time?.slice(0, 5) || "09:00"}
                  </p>
                </div>
                <button
                  className="detail-assign-remove"
                  onClick={() => handleUnassign(a.user_id)}
                  disabled={busy}
                  aria-label={`Remove ${a.user?.full_name || "user"}`}
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* ── Add user picker ── */}
        {!loadingAssignments && availableUsers.length > 0 && (
          <div className="detail-assign-picker">
            <p className="detail-assign-picker-label">Add a user</p>
            <ul className="detail-assign-picker-list">
              {availableUsers.map((user) => (
                <li key={user.id}>
                  <button
                    className="detail-assign-picker-btn"
                    onClick={() => handleAssign(user.id)}
                    disabled={busy}
                  >
                    <span className="material-symbols-outlined">
                      person_add
                    </span>
                    {user.full_name || user.email}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* ── Actions ── */}
      <div className="detail-actions">
        <button
          className="button-secondary detail-action-delete"
          onClick={handleDelete}
          disabled={busy}
        >
          <span className="material-symbols-outlined">delete</span>
          Delete Reminder
        </button>
      </div>
    </div>
  );
}

export default ReminderDetailPage;
