import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <main className="auth-status">
        <section className="status-card" role="status" aria-live="polite">
          <div className="status-orb" aria-hidden="true" />
          <div className="status-copy">
            <span className="surface-badge">Secure session</span>
            <p className="section-kicker">Checking session</p>
            <h1 className="page-title">Restoring your reminder space</h1>
            <p className="page-copy">
              Hang tight — we're confirming your session and loading your
              reminders.
            </p>
          </div>
        </section>
      </main>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
