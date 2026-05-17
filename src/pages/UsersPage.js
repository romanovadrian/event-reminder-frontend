import { useUsers } from "../context/UserContext";

function UsersPage() {
  const { users, isLoading, error } = useUsers();

  return (
    <div className="users-page">
      <div className="users-header">
        <div>
          <h2 className="users-title">Users</h2>
          <p className="users-subtitle">
            Manage the people connected to your reminders.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="users-empty">
          <span className="material-symbols-outlined users-empty-icon">
            hourglass_top
          </span>
          <p className="users-empty-title">Loading users…</p>
        </div>
      ) : error ? (
        <div className="users-empty">
          <span className="material-symbols-outlined users-empty-icon">
            error_outline
          </span>
          <p className="users-empty-title">Could not load users</p>
          <p className="users-empty-copy">{error}</p>
        </div>
      ) : users.length === 0 ? (
        <div className="users-empty">
          <span className="material-symbols-outlined users-empty-icon">
            group
          </span>
          <p className="users-empty-title">No users yet</p>
          <p className="users-empty-copy">
            Users you create or invite will appear here. Connect them to
            reminders so the right people get notified at the right time.
          </p>
        </div>
      ) : (
        <ul className="users-list">
          {users.map((user) => (
            <li key={user.id} className="users-card">
              <div className="users-card-avatar">
                <span className="material-symbols-outlined">person</span>
              </div>
              <div className="users-card-body">
                <h3 className="users-card-name">
                  {user.full_name || user.email}
                </h3>
                <p className="users-card-email">{user.email}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default UsersPage;
