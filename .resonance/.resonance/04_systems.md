# 04 Systems: The Machinery

## 1. External Systems & Integrations

- **Backend REST API** *(TBD — not yet built)*: Will handle event persistence, user accounts, and reminders
    - *Auth*: JWT Bearer tokens (planned)
    - *Key Endpoints* (planned): `GET /events`, `POST /events`, `DELETE /events/:id`, `GET /people`
- **Browser Notification API** *(future)*: Native browser push for day-of reminders
- **localStorage** *(current)*: Temporary data persistence for prototyping phase

## 2. Internal Subsystems

- **Event Store (Context)**: Global state for all events — CRUD operations, filtering, sorting
    - *Input*: User actions (add, edit, delete event)
    - *Output*: Updated event list consumed by all views
    - *Dependencies*: localStorage adapter (now), REST API adapter (later)

- **People Store (Context)**: Contacts/people associated with events
    - *Input*: User-defined people (name, relationship)
    - *Output*: People list for event association

- **Reminder Engine**: Computes days-until for each event, surfaces "upcoming" events
    - *Input*: Event list with dates
    - *Output*: Sorted upcoming events, overdue flags

- **Calendar View**: Monthly grid rendering events on their dates
    - *Input*: Event list
    - *Output*: Visual monthly calendar with event dots/chips

- **Dashboard View**: Shows the next 30 days of events sorted by proximity
    - *Input*: Reminder Engine output
    - *Output*: Prioritised event cards

- **Event Form**: Registration/editing UI for a single event
    - *Input*: Optional existing event (for edit mode)
    - *Output*: New or updated event object

## 3. Data Infrastructure

- **Primary Store (now)**: `localStorage` — JSON serialised event + people arrays
- **Primary Store (future)**: REST API with Postgres (or Supabase)
- **Schema (Event)**:
  ```json
  {
    "id": "uuid",
    "title": "string",
    "date": "MM-DD",
    "type": "birthday | anniversary | custom",
    "people": ["person_id"],
    "notes": "string",
    "createdAt": "ISO8601"
  }
  ```
- **Schema (Person)**:
  ```json
  {
    "id": "uuid",
    "name": "string",
    "relationship": "string"
  }
  ```

## 4. Key Workflows

1. **Register New Event**
    - Step 1: User opens Event Form (via FAB or "Add Event" CTA)
    - Step 2: Fills title, date (MM-DD), type, optional people & notes
    - Step 3: Form validates + dispatches `ADD_EVENT` to Event Store
    - Step 4: localStorage persists. Dashboard re-renders with new event.

2. **View Upcoming Events**
    - Step 1: App loads → Reminder Engine reads Event Store
    - Step 2: Computes days-until for each event (handling year-wrap)
    - Step 3: Dashboard renders sorted list, highlights events in next 7 days

3. **Share Event (future)**
    - Step 1: User selects event → clicks "Share"
    - Step 2: App generates shareable link (`/event/:id`)
    - Step 3: Recipient opens link → prompted to add to their own account

## 5. Development Environment

- **Build System**: Create React App (Webpack under the hood)
- **Dev Server**: `npm start` → `localhost:3000`
- **Test Runner**: `npm test` → Jest + React Testing Library
- **Env Variables**: None required for local dev (localStorage phase)

---

[→ Back to State (Active Context)](01_state.md)
