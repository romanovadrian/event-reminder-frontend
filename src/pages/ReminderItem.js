import { Link } from "react-router-dom";
import {
  eventTypeIcon,
  eventTypeLabel,
  daysUntilLabel,
  daysUntil,
} from "../utils/reminderEngine";

export default function ReminderItem({ reminder }) {
  const days = daysUntil(reminder.event_date);
  return (
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
            {new Date(reminder.event_date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
        </p>
      </div>
      <span
        className={`dash-reminder-countdown${days <= 3 ? " dash-reminder-countdown--urgent" : ""}`}
      >
        {daysUntilLabel(days)}
      </span>
    </Link>
  );
}
