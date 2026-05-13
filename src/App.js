import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ReminderProvider } from './context/ReminderContext';
import { UserProvider } from './context/UserContext';
import AuthenticatedShell from './layouts/AuthenticatedShell';
import CalendarPage from './pages/CalendarPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import ReminderDetailPage from './pages/ReminderDetailPage';
import ReminderFormPage from './pages/ReminderFormPage';
import UsersPage from './pages/UsersPage';
import ProtectedRoute from './routes/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <ReminderProvider>
                <UserProvider>
                  <AuthenticatedShell>
                    <Routes>
                      <Route path="/" element={<DashboardPage />} />
                      <Route path="/calendar" element={<CalendarPage />} />
                      <Route path="/reminders/new" element={<ReminderFormPage />} />
                      <Route path="/reminders/:reminderId" element={<ReminderDetailPage />} />
                      <Route path="/users" element={<UsersPage />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </AuthenticatedShell>
                </UserProvider>
              </ReminderProvider>
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
