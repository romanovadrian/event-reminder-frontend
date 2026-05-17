import { apiGet, apiPost, apiPostForm } from "./apiClient";

export const TOKEN_STORAGE_KEY = "eventReminderToken";

export function getStoredToken() {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setStoredToken(token) {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export function clearStoredToken() {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}

export async function login({ username, password }) {
  const tokenResponse = await apiPostForm("/auth/login", {
    username,
    password,
    grant_type: "password",
  });

  if (!tokenResponse?.access_token) {
    throw new Error("Login did not return an access token.");
  }

  setStoredToken(tokenResponse.access_token);
  return tokenResponse;
}

export async function register(userPayload) {
  return apiPost("/auth/register", null, userPayload);
}

export async function logout(token) {
  try {
    if (token) {
      await apiPost("/auth/logout", token, {});
    }
  } finally {
    clearStoredToken();
  }
}

export async function fetchUsers(token) {
  return apiGet("/users", token);
}
