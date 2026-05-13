import { apiGet, apiPost, apiWithAuth } from './apiClient';

export async function listReminders(token) {
  return apiGet('/reminders', token);
}

export async function getReminder(token, reminderId) {
  return apiGet(`/reminders/${reminderId}`, token);
}

export async function createReminder(token, reminderData) {
  return apiPost('/reminders', token, reminderData);
}

export async function updateReminder(token, reminderId, reminderData) {
  return apiWithAuth(`/reminders/${reminderId}`, token, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reminderData),
  });
}

export async function deleteReminder(token, reminderId) {
  return apiWithAuth(`/reminders/${reminderId}`, token, {
    method: 'DELETE',
  });
}

// ── Reminder ↔ User assignments ──

export async function listReminderUsers(token, reminderId) {
  return apiGet(`/reminders/${reminderId}/users`, token);
}

export async function assignUserToReminder(token, reminderId, userId, notifyTime = '09:00:00') {
  return apiPost(`/reminders/${reminderId}/users`, token, {
    user_id: userId,
    notify_time: notifyTime,
  });
}

export async function unassignUserFromReminder(token, reminderId, userId) {
  return apiWithAuth(`/reminders/${reminderId}/users/${userId}`, token, {
    method: 'DELETE',
  });
}
