# ADR-001: Frontend Stack Decision
> **Date**: 2026-04-04
> **Status**: Accepted
> **Deciders**: Engineering Team

---

## Context

Event Reminder is a personal/social event calendar web app. We need to choose a frontend stack that:
- Allows rapid prototyping
- Supports a warm, delightful UI
- Is maintainable by a small team
- Has a clear path to scale (auth, shared state, API integration)

---

## Decision

| Concern | Choice | Alternatives Considered | Rationale |
| :--- | :--- | :--- | :--- |
| **Framework** | React 19 (CRA) | Next.js, Vue.js | CRA already scaffolded. No SSR needed for MVP. Migrate to Vite/Next.js if SSR or perf demands it. |
| **Language** | JavaScript (ES2022+) | TypeScript | Speed of iteration at this stage. Migrate to TS when the codebase stabilises. |
| **Styling** | CSS Modules ✅ | Tailwind CSS, Styled Components | Zero config, built into CRA, co-located styles. Avoids global CSS conflicts. |
| **State** | React Context + useReducer ✅ | Redux Toolkit, Zustand, Jotai | Sufficient for MVP scope. No external dep. Migrate to Zustand if state grows complex. |
| **Routing** | React Router v6 | TanStack Router | Industry standard, well-documented, CRA-compatible out of the box. |
| **Persistence** | Custom REST API (existing) ✅ | Supabase, Firebase | API already built — connect directly. localStorage used only during initial UI prototyping. |
| **Auth** | Simple JWT (Bearer token) ✅ | JWT + Refresh Token, Session cookies, OAuth | Token returned on login, stored in `localStorage`, sent as `Authorization: Bearer <token>`. Stateless and simple. Accepted tradeoff: `localStorage` is XSS-accessible, mitigated by ensuring no unescaped user HTML is rendered. |

---

## Consequences

**Positive**:
- Zero additional setup — start coding immediately
- All dependencies are battle-tested and well-supported
- Clear upgrade path: CRA → Vite, JS → TS, localStorage → REST API

**Negative / Risks**:
- CRA is in maintenance mode. Should migrate to Vite for long-term performance.
- No TypeScript means type errors are caught at runtime, not compile time. Acceptable for now.
- Context + useReducer can become unwieldy if global state exceeds 3–4 slices.

**Mitigations**:
- Add JSDoc types to critical utility functions for minimal type safety
- Set a threshold: if state exceeds 3 Context providers, adopt Zustand
- Plan CRA → Vite migration as a standalone refactor ticket before v1.0

---

## Future ADRs Needed

- ADR-002: Auth strategy (Supabase Auth vs custom JWT)
- ADR-003: Backend: Build vs Buy (custom NestJS vs Supabase)
- ADR-004: CRA → Vite migration
- ADR-005: Notification strategy (browser push vs email vs in-app)

---

[→ View System Overview](./system_overview.md) | [→ View PRD](../prd/00_vision.md)
