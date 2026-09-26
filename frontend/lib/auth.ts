const TOKEN_KEY = 'anime-record-token';

export const API_BASE_URL = 'http://localhost:3001';

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem(TOKEN_KEY);
}

export function setAccessToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAccessToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function redirectToLogin() {
  clearAccessToken();
  window.location.href = '/login';
}

export async function apiFetch(path: string, init: RequestInit = {}) {
  const token = getAccessToken();
  const headers = new Headers(init.headers);
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  if (init.body instanceof FormData) {
    headers.delete('Content-Type');
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  });

  if (response.status === 401) {
    redirectToLogin();
    throw new Error('Unauthorized');
  }

  return response;
}
