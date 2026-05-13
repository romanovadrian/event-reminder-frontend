# Soul - The Vision & Constitution

## 1. Identity & North Star
**Vision**: Be the person who never forgets — a beautiful, social event calendar that keeps you present in the lives of the people you care about.
**Mission**: Make registering and being reminded of life's important moments effortless and delightful, for yourself and the people you share them with.
**North Star Metric**: Events registered per active user / Reminder engagement rate

**Core Purpose**:
*   **What**: A web app to register, visualise, and be reminded of important recurring events (birthdays, anniversaries, custom milestones) for yourself and shared contacts.
*   **Why**: People forget important dates. Existing calendar tools are impersonal and tedious. There is no delightful, social-first experience for life's meaningful moments.
*   **Who**: Anyone who wants to stay present and thoughtful in the lives of others — from individuals tracking personal dates to groups sharing family milestones.

---

## 2. The Constitution (Immutable Laws)
> *These are hard constraints that cannot be broken without a formal Amendment.*

**Technical Laws**:
1.  **Functional Components Only**: No class components. React hooks exclusively.
2.  **Mobile-First**: Every component is designed at 375px first, then scaled up.
3.  **No Prop Drilling Beyond 2 Levels**: Use Context or state management for shared state.

**UX Laws**:
1.  **Zero-Friction Registration**: Adding a new event must take fewer than 10 seconds.
2.  **At-a-Glance Readability**: Upcoming events must be visible without any interaction on load.
3.  **Accessible by Default**: All interactive elements must be keyboard-navigable and ARIA-labelled.

**Business Laws**:
1.  **Privacy First**: No user data is ever shared without explicit opt-in.

---

## 3. Strategic Goals
**Immediate Objectives (Current Sprint)**:
*   [ ] Set up project architecture, routing, and component structure
*   [ ] Build Event Registration form (name, date, type, people)
*   [ ] Build Event List / Dashboard view (upcoming events sorted by proximity)
*   [ ] Build a Calendar view for visualising events by month
*   [ ] Implement local notification / reminder system

**Long-Term Strategy**:
*   Multi-user support: share event groups with friends and family
*   Backend integration: persist events, send email/push reminders
*   Social layer: see friends' upcoming events they've flagged as shareable

**Success Definitions**:
*   **User Success**: User never misses a birthday or anniversary again
*   **Technical Success**: < 2s load time on 3G, 0 accessibility violations (axe)
*   **Business Success**: Users return at least weekly to check upcoming events

---

## 4. Design Philosophy & Vibe
**The "Vibe"**: Warm, Minimalist, Personal — like a beautifully designed notebook, not a corporate calendar.
**Brand Voice**:
*   **Tone**: Friendly and encouraging. Celebrate the moments, not the tool.
*   **Terminology**: Use "events" not "tasks", "people" not "contacts", "remind" not "alert".

**UX Principles**:
1.  **Delight in the Details**: Subtle animations and micro-interactions make the experience feel alive.
2.  **Show, Don't Sort**: Surface what matters now — next 30 days — before showing everything.
3.  **Progressive Disclosure**: Advanced options (recurrence, notifications, sharing) are hidden until needed.

---

## 5. Technical Philosophy
**Stack**:
*   **Framework**: React 19 (Create React App base)
*   **Language**: JavaScript (ES2022+)
*   **Styling**: CSS Modules ✅
*   **State**: React Context + useReducer ✅
*   **Data**: Custom REST API (already exists) — localStorage for initial prototyping only ✅
*   **Auth**: JWT (Bearer token) stored in `localStorage` ✅ — simple, stateless. Token sent as `Authorization: Bearer <token>` on every request. Accepted tradeoff: XSS exposure mitigated by keeping the app free of user-generated HTML rendering.

**Architecture Drivers**:
*   Simplicity over Scalability at this stage — no premature abstraction
*   Buy vs Build: prefer well-maintained UI libraries for date pickers, not custom builds

**Decision Framework**:
*   *When in doubt, choose the option that keeps the user in flow.*

---

## 6. Open Questions & Pending Decisions
*   [x] Styling approach → **CSS Modules** ✅
*   [x] State management → **React Context + useReducer** ✅
*   [x] Backend → **Custom REST API (already built)** ✅
*   [x] Auth strategy → **Simple JWT, stored in localStorage** ✅
*   [ ] Notifications: In-app only, or browser push notifications + email?
*   [ ] API base URL / environment config: How does the frontend discover the REST API?

---

**Note**: This file is the **Constitution**. It is the highest authority in the system. All Code, Specs, and Plans must align with The Laws defined here.

---

[→ View State (Active Context)](01_state.md) | [→ View Memory (Logs)](02_memory.md)
