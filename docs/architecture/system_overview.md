# System Overview: Event Reminder Frontend
> **Date**: 2026-04-06
> **Status**: MVP Architecture (API-first phase)

---

## High-Level Data Flow

```mermaid
graph TD
    User["👤 User"]

    subgraph Browser ["Browser (React SPA)"]
        Router["React Router\n(Route Switching)"]
    Login["Login Page\n(/login)"]
        Dashboard["Dashboard View\n(Upcoming Events)"]
        Calendar["Calendar View\n(Monthly Grid)"]
    ReminderForm["Reminder Form\n(Create / Edit)"]
    UsersPage["Users Page\n(List / Create)"]
    ReminderUsers["Reminder Users\n(Assignments)"]

        subgraph State ["Global State (Context + useReducer)"]
      AuthStore["Auth Store\n🔐 token + session"]
      ReminderStore["Reminder Store\n📋 reminders[]"]
      UserStore["User Store\n👥 users[]"]
      AssignmentStore["Assignment Store\n🔗 reminder-user links"]
            ReminderEngine["Reminder Engine\n⏰ daysUntil()"]
        end
    end

  BackendAPI["🌐 REST API\n(Existing)"]

    User -->|navigates| Router
  Router --> Login
    Router --> Dashboard
    Router --> Calendar
  Router --> ReminderForm
  Router --> UsersPage
  Router --> ReminderUsers

  Login -->|POST /auth/login| AuthStore
  AuthStore -->|Bearer JWT| BackendAPI

    Dashboard -->|reads| ReminderEngine
  ReminderEngine -->|reads| ReminderStore
  Calendar -->|reads| ReminderStore
  ReminderForm -->|POST/PATCH| ReminderStore
  UsersPage -->|GET/POST| UserStore
  ReminderUsers -->|POST/GET/DELETE| AssignmentStore

  ReminderStore <-->|/reminders| BackendAPI
  UserStore <-->|/users| BackendAPI
  AssignmentStore <-->|/reminders/{id}/users| BackendAPI
```

---

## Component Hierarchy

```
App
├── AppRouter (React Router)
│   ├── /login → LoginPage
│   ├── / → DashboardPage (Protected)
│   │   ├── UpcomingEventsList
│   │   │   └── EventCard (× n)
│   │   └── AddEventFAB
│   │
│   ├── /calendar → CalendarPage (Protected)
│   │   ├── MonthGrid
│   │   │   └── DayCell (× 28-31)
│   │   │       └── EventDot (× n)
│   │   └── MonthNavigator
│   │
│   ├── /reminders/new → ReminderFormPage (create mode, Protected)
│   │   └── ReminderForm
│   │       ├── TitleInput
│   │       ├── DatePicker
│   │       ├── TypeSelector (birthday / anniversary / custom)
│   │       ├── RemindDaysBeforeInput
│   │       └── NotesTextarea
│   │
│   ├── /reminders/:id/edit → ReminderFormPage (edit mode, Protected)
│   │   └── ReminderForm (pre-populated)
│   │
│   ├── /users → UsersPage (Protected)
│   │   ├── UsersList
│   │   │   └── UserCard (× n)
│   │   └── AddUserForm
│   │
│   └── /reminders/:id/users → ReminderUsersPage (Protected)
│       ├── AssignedUsersList
│       ├── AssignUserForm
│       └── UnassignUserAction
│
└── AppContextProviders
  ├── AuthProvider
  ├── ReminderStoreProvider
  ├── UserStoreProvider
  └── AssignmentStoreProvider
```

---

## State Shape

### Auth Store
```json
{
  "token": "jwt-access-token",
  "isAuthenticated": true,
  "user": {
    "id": "uuid-v4",
    "email": "user@example.com"
  }
}
```

### Reminder Store
```json
{
  "reminders": [
    {
      "id": "uuid-v4",
      "title": "Mum's Birthday",
      "event_type": "birthday",
      "event_date": "2026-07-15",
      "remind_days_before": 3,
      "notes": "Loves tulips",
      "is_active": true,
      "created_at": "2026-04-04T12:00:00Z",
      "updated_at": "2026-04-04T12:00:00Z"
    }
  ]
}
```

### User Store
```json
{
  "users": [
    {
      "id": "uuid-v4",
      "full_name": "Jane Doe",
      "email": "jane@example.com",
      "phone_number": "+1555000111",
      "timezone": "UTC",
      "is_active": true,
      "created_at": "2026-04-04T12:00:00Z",
      "updated_at": "2026-04-04T12:00:00Z"
    }
  ]
}
```

### Assignment Store
```json
{
  "assignments": [
    {
      "id": "uuid-v4",
      "reminder_id": "uuid-v4",
      "user_id": "uuid-v4",
      "notify_time": "09:00:00",
      "last_notified_on": null,
      "created_at": "2026-04-04T12:00:00Z"
    }
  ]
}
```

---

## Reminder Engine Logic

The Reminder Engine is a pure utility (no side effects):

```
daysUntil(dateString: "YYYY-MM-DD") → number
  - Takes reminder event_date from API
  - Computes next occurrence from today
  - Handles year-wrap (e.g. today is Dec 28, event is Jan 5 → 8 days)
  - Returns 0 for today

upcomingReminders(reminders[], days = 30) → Reminder[]
  - Filters reminders where daysUntil ≤ days and is_active=true
  - Sorts ascending by daysUntil

authHeader(token) → { Authorization: `Bearer ${token}` }
  - Used for all protected API endpoints
```

## API Contract Mapping

1. Auth
   - POST `/auth/register`
   - POST `/auth/login` (form-urlencoded)
   - POST `/auth/logout`
2. Users
   - GET `/users`
   - POST `/users` (admin create)
   - GET `/users/{user_id}`
3. Reminders
   - GET `/reminders`
   - POST `/reminders`
   - GET `/reminders/{reminder_id}`
   - PATCH `/reminders/{reminder_id}`
   - DELETE `/reminders/{reminder_id}`
4. Reminder Assignments
   - GET `/reminders/{reminder_id}/users`
   - POST `/reminders/{reminder_id}/users`
   - DELETE `/reminders/{reminder_id}/users/{user_id}`

---

[→ View PRD](../prd/00_vision.md) | [→ View Stack Decision](./stack_decision.md) | [→ View Soul](../../.resonance/.resonance/00_soul.md)
