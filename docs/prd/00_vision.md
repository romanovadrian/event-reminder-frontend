# PRD: Event Reminder — Product Vision
> **Format**: Amazon "Working Backwards" (Press Release + FAQ)
> **Date**: 2026-04-04
> **Status**: Draft

---

## Press Release

**FOR IMMEDIATE RELEASE**

### Introducing Event Reminder: Never Miss a Moment That Matters

*The beautifully simple app that keeps you present in the lives of the people you love.*

**Today**, we are launching **Event Reminder** — a personal and social event calendar built around the moments that actually matter: birthdays, anniversaries, and the milestones that define your relationships.

**The problem** is painfully familiar. You love the people in your life. But between work, notifications, and the relentless pace of modern living, you forget. A birthday passes. An anniversary slips by. And in that moment, the relationship quietly erodes. Generic calendar apps don't help — they're impersonal productivity tools, not relationship tools.

**Event Reminder is different.** It is designed with one purpose: make it effortless to register the important dates for every person you care about, visualise them beautifully, and receive reminders so timely and contextual that acting on them feels natural.

With Event Reminder, you can:
- **Register events in under 10 seconds** — name, date, type (birthday, anniversary, or custom), and the people involved.
- **See what's coming up at a glance** — a warm, prioritised dashboard that surfaces the next 30 days so you're never caught off guard.
- **Browse by month** — a visual calendar view that shows every event plotted on its date.
- **Share events** *(coming soon)* — invite others to track and celebrate moments together.

This is not a productivity app. It is a *relationship* app. And it is built with the care and craft that relationships deserve.

---

## Frequently Asked Questions

### Customer FAQs

**Q: How is this different from Google Calendar?**
A: Google Calendar is a scheduling tool. Event Reminder is a relationship tool. It focuses specifically on recurring personal events — birthdays, anniversaries — and is optimised for that single job: never miss a moment that matters to someone you care about.

**Q: Do I need an account to use it?**
A: Not initially. In the first version, all events are stored locally on your device. Account creation will be introduced when multi-device sync and sharing features are added.

**Q: Can I add events for other people and have them receive reminders too?**
A: Sharing and collaborative reminders are on the roadmap. The first version focuses on personal event management with a beautiful UI.

**Q: What types of events can I track?**
A: Birthdays, anniversaries, and any custom event type you define (e.g., "work anniversary", "first date", "graduation").

---

### Internal FAQs

**Q: Why build this as a frontend-first project?**
A: De-risking the user experience before investing in backend infrastructure. We validate the core interaction model (registration, visualisation, reminders) with localStorage before building a REST API.

**Q: What is the MVP scope?**
A:
1. Event Registration Form
2. Dashboard (upcoming events, next 30 days)
3. Calendar View (monthly grid)
4. Local Storage persistence
5. Basic reminder logic (days-until computation)

**Q: What is explicitly out of scope for MVP?**
A: Authentication, backend API, push notifications, sharing, mobile app.

**Q: What does success look like for MVP?**
A: A user can open the app, add 5 events for people in their life, see them visualised, and feel genuinely delighted by the experience.

---

## Customer Persona

**Primary User — "The Thoughtful Friend"**
- Age: 25–45
- Context: Has a busy life; cares deeply about the people in their circle but struggles to keep track of dates across different contacts.
- Pain: Uses their phone's contacts or a sticky note to track birthdays. Often forgets until the day-of or after.
- Goal: A single, beautiful place to see all upcoming events for all the people they care about.
- Behaviour: Checks the app weekly (Sunday evening). Adds new events whenever they learn a new date from a friend.

---

[→ View Architecture](../architecture/system_overview.md) | [→ View Soul](../../.resonance/00_soul.md)
