import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useReminders } from "../context/ReminderContext";

const EVENT_TYPES = [
  { value: "birthday", label: "Birthday", icon: "cake" },
  { value: "anniversary", label: "Anniversary", icon: "favorite" },
  { value: "custom", label: "Custom", icon: "celebration" },
];

function ReminderFormPage() {
  const navigate = useNavigate();
  const { addReminder } = useReminders();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [touched, setTouched] = useState({});
  const [form, setForm] = useState({
    title: "",
    event_type: "birthday",
    event_date: "",
    remind_days_before: 3,
    notes: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleBlur(e) {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  }

  function getFieldError(name) {
    if (!touched[name]) return null;
    if (name === "title" && !form.title.trim())
      return "Event name is required.";
    if (name === "title" && form.title.trim().length > 160)
      return "Max 160 characters.";
    if (name === "event_date" && !form.event_date) return "Date is required.";
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    // Mark all fields as touched for validation
    setTouched({ title: true, event_date: true });

    if (!form.title.trim() || !form.event_date) {
      setError("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await addReminder({
        ...form,
        title: form.title.trim(),
        remind_days_before: Number(form.remind_days_before),
        notes: form.notes.trim() || null,
      });
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="reminder-form-page">
      <div className="reminder-form-header">
        <h2 className="reminder-form-title">New Reminder</h2>
        <p className="reminder-form-subtitle">
          Track the moments that matter to the people you care about.
        </p>
      </div>

      <form className="reminder-form" onSubmit={handleSubmit}>
        <div className="field-group">
          <label className="field-label" htmlFor="title">
            Event name
          </label>
          <input
            id="title"
            name="title"
            placeholder="e.g. Mum's Birthday"
            required
            maxLength={160}
            value={form.title}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={!!getFieldError("title")}
          />
          {getFieldError("title") && (
            <span className="field-error">{getFieldError("title")}</span>
          )}
        </div>

        <div className="field-group">
          <label className="field-label">Event type</label>
          <div className="reminder-type-picker">
            {EVENT_TYPES.map(({ value, label, icon }) => (
              <label
                key={value}
                className={`reminder-type-chip${form.event_type === value ? " reminder-type-chip--active" : ""}`}
              >
                <input
                  type="radio"
                  name="event_type"
                  value={value}
                  checked={form.event_type === value}
                  onChange={handleChange}
                  className="sr-only"
                />
                <span className="material-symbols-outlined">{icon}</span>
                {label}
              </label>
            ))}
          </div>
        </div>

        <div className="reminder-form-row">
          <div className="field-group">
            <label className="field-label" htmlFor="event_date">
              Date
            </label>
            <input
              id="event_date"
              name="event_date"
              type="date"
              required
              value={form.event_date}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={!!getFieldError("event_date")}
            />
            {getFieldError("event_date") && (
              <span className="field-error">{getFieldError("event_date")}</span>
            )}
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="remind_days_before">
              Remind me
            </label>
            <select
              id="remind_days_before"
              name="remind_days_before"
              value={form.remind_days_before}
              onChange={handleChange}
            >
              <option value={0}>On the day</option>
              <option value={1}>1 day before</option>
              <option value={3}>3 days before</option>
              <option value={7}>1 week before</option>
              <option value={14}>2 weeks before</option>
              <option value={30}>1 month before</option>
            </select>
          </div>
        </div>

        <div className="field-group">
          <label className="field-label" htmlFor="notes">
            Notes (optional)
          </label>
          <textarea
            id="notes"
            name="notes"
            placeholder="Gift ideas, venue details, anything you want to remember..."
            rows={3}
            maxLength={500}
            value={form.notes}
            onChange={handleChange}
          />
        </div>

        {error && <div className="status-message status-error">{error}</div>}

        <div className="reminder-form-actions">
          <button type="submit" className="button-block" disabled={submitting}>
            {submitting ? "Saving…" : "Save Reminder"}
          </button>
          <button
            type="button"
            className="button-secondary"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default ReminderFormPage;
