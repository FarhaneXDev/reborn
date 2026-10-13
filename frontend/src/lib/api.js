const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';

export function getTokens() {
  if (typeof window === 'undefined') return null;
  const access = localStorage.getItem('reborn_access_token');
  const refresh = localStorage.getItem('reborn_refresh_token');
  return { access, refresh };
}

export function setTokens(access, refresh) {
  if (typeof window === 'undefined') return;
  if (access) localStorage.setItem('reborn_access_token', access);
  if (refresh) localStorage.setItem('reborn_refresh_token', refresh);
}

export function clearTokens() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('reborn_access_token');
  localStorage.removeItem('reborn_refresh_token');
  localStorage.removeItem('reborn_user');
}

export async function apiFetch(endpoint, options = {}) {
  const separator = endpoint.includes('?') ? '&' : '?';
  const isGet = !options.method || options.method.toUpperCase() === 'GET';
  const cacheBuster = isGet ? `${separator}_t=${Date.now()}` : '';
  const url = `${API_BASE_URL}${endpoint}${cacheBuster}`;
  const tokens = getTokens();

  const headers = {
    'Content-Type': 'application/json',
    ...(tokens?.access ? { Authorization: `Bearer ${tokens.access}` } : {}),
    ...options.headers,
  };

  try {
    const res = await fetch(url, {
      cache: 'no-store',
      ...options,
      headers,
    });

    if (res.status === 401 && tokens?.refresh && !endpoint.includes('/auth/refresh/')) {
      // Tenter un rafraîchissement automatique
      try {
        const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh: tokens.refresh }),
        });
        if (refreshRes.ok) {
          const data = await refreshRes.json();
          setTokens(data.access, tokens.refresh);
          headers.Authorization = `Bearer ${data.access}`;
          const retryRes = await fetch(url, { ...options, headers });
          if (retryRes.status === 204) return null;
          return await retryRes.json();
        } else {
          clearTokens();
        }
      } catch {
        clearTokens();
      }
    }

    if (res.status === 204) return null;

    const data = await res.json().catch(() => null);
    if (!res.ok) {
      const errorMsg = data?.detail || data?.message || (typeof data === 'object' ? Object.values(data).flat().join(' ') : 'Erreur réseau');
      throw new Error(errorMsg || `Erreur ${res.status}`);
    }
    return data;
  } catch (err) {
    throw err;
  }
}

// Auth API
export const authApi = {
  login: async (email, password) => {
    const data = await apiFetch('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setTokens(data.access, data.refresh);
    return data;
  },
  register: async ({ email, username, password, timezone, no_contact_start_date }) => {
    const data = await apiFetch('/auth/register/', {
      method: 'POST',
      body: JSON.stringify({ email, username, password, timezone, no_contact_start_date }),
    });
    setTokens(data.tokens.access, data.tokens.refresh);
    return data;
  },
  getMe: () => apiFetch('/auth/me/'),
  updateProfile: (profileData) =>
    apiFetch('/auth/profile/', {
      method: 'PATCH',
      body: JSON.stringify(profileData),
    }),
};

// Journeys API
export const journeysApi = {
  getToday: () => apiFetch('/journeys/missions/today/'),
  getAllMissions: () => apiFetch('/journeys/missions/'),
  saveProgress: ({ local_date, mission_id, mood, mood_intensity, reflection, mission_status }) =>
    apiFetch('/journeys/progress/', {
      method: 'POST',
      body: JSON.stringify({ local_date, mission_id, mood, mood_intensity, reflection, mission_status }),
    }),
};

// Journal API
export const journalApi = {
  getAll: (tag, search) => {
    const params = new URLSearchParams();
    if (tag) params.set('tag', tag);
    if (search) params.set('search', search);
    const qs = params.toString() ? `?${params.toString()}` : '';
    return apiFetch(`/journal/${qs}`);
  },
  create: (entry) =>
    apiFetch('/journal/', {
      method: 'POST',
      body: JSON.stringify(entry),
    }),
  update: (id, entry) =>
    apiFetch(`/journal/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(entry),
    }),
  delete: (id) =>
    apiFetch(`/journal/${id}/`, {
      method: 'DELETE',
    }),
};

// Goals API
export const goalsApi = {
  getAll: () => apiFetch('/goals/'),
  create: (goal) =>
    apiFetch('/goals/', {
      method: 'POST',
      body: JSON.stringify(goal),
    }),
  update: (id, goal) =>
    apiFetch(`/goals/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(goal),
    }),
  delete: (id) =>
    apiFetch(`/goals/${id}/`, {
      method: 'DELETE',
    }),
  addAction: (goalId, action) =>
    apiFetch(`/goals/${goalId}/actions/`, {
      method: 'POST',
      body: JSON.stringify(action),
    }),
  updateAction: (goalId, actionId, updates) =>
    apiFetch(`/goals/${goalId}/actions/${actionId}/`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    }),
  deleteAction: (goalId, actionId) =>
    apiFetch(`/goals/${goalId}/actions/${actionId}/`, {
      method: 'DELETE',
    }),
};

// Analytics API
export const analyticsApi = {
  getSummary: (period = '7d') => apiFetch(`/analytics/summary/?period=${period}`),
  exportData: () => apiFetch('/analytics/export/'),
  resetData: () =>
    apiFetch('/analytics/reset/', {
      method: 'DELETE',
    }),
};
