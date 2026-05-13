import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { to: '/', icon: 'dashboard', label: 'Dashboard' },
  { to: '/calendar', icon: 'calendar_month', label: 'Calendar' },
  { to: '/reminders/new', icon: 'add_circle', label: 'New Event' },
  { to: '/users', icon: 'person', label: 'Users' },
];

function AuthenticatedShell({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="shell">
      <aside className="shell-sidebar">
        <div className="shell-brand">
          <h1 className="shell-brand-name">Event Reminder</h1>
          <p className="shell-brand-tagline">Never miss a moment</p>
        </div>

        <nav className="shell-nav" aria-label="Main navigation">
          {NAV_ITEMS.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `shell-nav-link${isActive ? ' shell-nav-link--active' : ''}`
              }
            >
              <span className="shell-nav-icon material-symbols-outlined">{icon}</span>
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <NavLink to="/reminders/new" className="shell-cta">
          Create Event
        </NavLink>
      </aside>

      <div className="shell-main">
        <header className="shell-topbar">
          <div className="shell-topbar-left">
            <h2 className="shell-topbar-title">
              {NAV_ITEMS.find((item) => item.to === location.pathname)?.label || 'Event Reminder'}
            </h2>
          </div>

          <div className="shell-topbar-right">
            <span className="shell-user-email">{user?.email || 'User'}</span>
            <button className="shell-logout" type="button" onClick={logout}>
              Logout
            </button>
          </div>
        </header>

        <main className="shell-content">{children}</main>
      </div>
    </div>
  );
}

export default AuthenticatedShell;
