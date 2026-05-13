import { apiGet, apiPost } from './apiClient';

export async function listUsers(token) {
  return apiGet('/users', token);
}

export async function getUser(token, userId) {
  return apiGet(`/users/${userId}`, token);
}

export async function createUser(token, userData) {
  return apiPost('/users', token, userData);
}
