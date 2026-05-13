import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

const routerFuture = {
  v7_relativeSplatPath: true,
  v7_startTransition: true,
};

function renderAppAt(route) {
  window.localStorage.clear();
  return render(
    <MemoryRouter future={routerFuture} initialEntries={[route]}>
      <App />
    </MemoryRouter>
  );
}

function mockAuthenticatedFetch() {
  const original = global.fetch;
  global.fetch = jest.fn((url) => {
    const urlStr = typeof url === 'string' ? url : '';
    // Reminder-user assignments
    if (/\/reminders\/[^/]+\/users/.test(urlStr)) {
      return Promise.resolve({
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        json: () => Promise.resolve([]),
      });
    }
    // Reminders list or single reminder
    if (urlStr.includes('/reminders')) {
      return Promise.resolve({
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        json: () =>
          Promise.resolve([
            {
              id: 'r1',
              title: "Mum's Birthday",
              event_type: 'birthday',
              event_date: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
              remind_days_before: 3,
              notes: 'Loves tulips',
              is_active: true,
              created_at: '2026-01-01T00:00:00Z',
              updated_at: '2026-01-01T00:00:00Z',
            },
          ]),
      });
    }
    // Default: /users (auth bootstrap + user list)
    return Promise.resolve({
      ok: true,
      status: 200,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve([{ id: 1, email: 'test@example.com' }]),
    });
  });
  window.localStorage.clear();
  window.localStorage.setItem('eventReminderToken', 'fake-token');
  return () => {
    window.localStorage.clear();
    global.fetch = original;
  };
}

function renderAuthenticatedAt(route) {
  return render(
    <MemoryRouter future={routerFuture} initialEntries={[route]}>
      <App />
    </MemoryRouter>
  );
}

test('renders the login route', async () => {
  renderAppAt('/login');

  expect(
    await screen.findByRole('heading', { name: /never miss the next moment that matters/i })
  ).toBeInTheDocument();
});

test('redirects signed-out users to login from protected routes', async () => {
  renderAppAt('/');

  expect(
    await screen.findByRole('heading', { name: /never miss the next moment that matters/i })
  ).toBeInTheDocument();
});

test('renders shell navigation for authenticated layout', async () => {
  const cleanup = mockAuthenticatedFetch();
  renderAuthenticatedAt('/');

  const nav = await screen.findByRole('navigation', { name: /main navigation/i });
  expect(nav).toBeInTheDocument();

  const navLinks = within(nav).getAllByRole('link');
  expect(navLinks).toHaveLength(4);
  expect(screen.getByText('test@example.com')).toBeInTheDocument();

  // Verify dashboard renders with reminder content (async from context)
  expect(await screen.findByLabelText(/next upcoming event/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/upcoming reminders/i)).toBeInTheDocument();

  cleanup();
});

test('renders the calendar page', async () => {
  const cleanup = mockAuthenticatedFetch();
  renderAuthenticatedAt('/calendar');

  expect(
    await screen.findByRole('heading', { name: /this month/i })
  ).toBeInTheDocument();

  cleanup();
});

test('renders the reminder form page', async () => {
  const cleanup = mockAuthenticatedFetch();
  renderAuthenticatedAt('/reminders/new');

  expect(
    await screen.findByRole('heading', { name: /new reminder/i })
  ).toBeInTheDocument();
  expect(screen.getByLabelText(/event name/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/date/i)).toBeInTheDocument();

  cleanup();
});

test('renders the users page', async () => {
  const cleanup = mockAuthenticatedFetch();
  renderAuthenticatedAt('/users');

  expect(
    await screen.findByText(/manage the people connected to your reminders/i)
  ).toBeInTheDocument();

  cleanup();
});

test('renders the reminder detail page with assignment section', async () => {
  const cleanup = mockAuthenticatedFetch();
  renderAuthenticatedAt('/reminders/r1');

  expect(
    await screen.findByRole('heading', { name: /mum's birthday/i })
  ).toBeInTheDocument();
  expect(screen.getByLabelText(/assigned users/i)).toBeInTheDocument();

  cleanup();
});
