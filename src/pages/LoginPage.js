import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const { login, isAuthenticated, isLoading, error } = useAuth();
  const [form, setForm] = useState({ username: "", password: "" });
  const [submitError, setSubmitError] = useState("");

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  async function onSubmit(event) {
    event.preventDefault();
    setSubmitError("");

    try {
      await login(form);
    } catch (err) {
      setSubmitError(err.message || "Login failed.");
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="brand-lockup">
          <span className="surface-badge">Warm, human reminders</span>
          <p className="section-kicker">Event Reminder</p>
          <h1 className="page-title">
            Never miss the next moment that matters.
          </h1>
          <p className="page-copy">
            Sign in to access your reminder space and keep upcoming celebrations
            within reach.
          </p>
        </div>

        <form onSubmit={onSubmit} className="auth-form">
          <div className="field-group">
            <label className="field-label" htmlFor="username">
              Username or email
            </label>
            <input
              id="username"
              name="username"
              autoComplete="username"
              value={form.username}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, username: event.target.value }))
              }
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={form.password}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, password: event.target.value }))
              }
              placeholder="Enter your password"
              required
            />
          </div>

          <button className="button-block" type="submit" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in"}
          </button>

          <p className="supporting-note">
            Don't have an account yet? Contact your administrator to get
            started.
          </p>
        </form>

        {(submitError || error) && (
          <p className="status-message status-error" role="alert">
            {submitError || error}
          </p>
        )}
      </section>
    </main>
  );
}

export default LoginPage;
