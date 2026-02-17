/// <reference types="vite/client" />

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// トークン管理
let authToken: string | null = localStorage.getItem('authToken');
let refreshToken: string | null = localStorage.getItem('refreshToken');

export const setAuthToken = (token: string | null) => {
  authToken = token;
  if (token) {
    localStorage.setItem('authToken', token);
  } else {
    localStorage.removeItem('authToken');
  }
};

export const setRefreshToken = (token: string | null) => {
  refreshToken = token;
  if (token) {
    localStorage.setItem('refreshToken', token);
  } else {
    localStorage.removeItem('refreshToken');
  }
};

export const getAuthToken = () => authToken;
export const getRefreshToken = () => refreshToken;

const getHeaders = () => ({
  'Content-Type': 'application/json',
  ...(authToken && { Authorization: `Bearer ${authToken}` }),
});

export const api = {
  // ==================
  // Authentication
  // ==================
  async register(username: string, email: string, password: string) {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Registration failed');
    }
    if (data.token) {
      setAuthToken(data.token);
    }
    if (data.refreshToken) {
      setRefreshToken(data.refreshToken);
    }
    return data;
  },

  async login(username: string, password: string) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }
    if (data.token) {
      setAuthToken(data.token);
    }
    if (data.refreshToken) {
      setRefreshToken(data.refreshToken);
    }
    return data;
  },

  async refreshAccessToken() {
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Token refresh failed');
    }
    if (data.token) {
      setAuthToken(data.token);
    }
    return data;
  },

  logout() {
    setAuthToken(null);
    setRefreshToken(null);
  },

  // ==================
  // Academic Info
  // ==================
  async getAcademicInfo() {
    const response = await fetch(`${API_URL}/academic-info`, {
      headers: getHeaders(),
    });
    return response.json();
  },

  async updateAcademicInfo(id: number, data: any) {
    const response = await fetch(`${API_URL}/academic-info/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async createAcademicInfo(data: any) {
    const response = await fetch(`${API_URL}/academic-info`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // ==================
  // Grade History
  // ==================
  async getGradeHistory() {
    const response = await fetch(`${API_URL}/grade-history`, {
      headers: getHeaders(),
    });
    return response.json();
  },

  // ==================
  // Upcoming Events
  // ==================
  async getUpcomingEvents() {
    const response = await fetch(`${API_URL}/upcoming-events`, {
      headers: getHeaders(),
    });
    return response.json();
  },

  async createUpcomingEvent(data: any) {
    const response = await fetch(`${API_URL}/upcoming-events`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async updateUpcomingEvent(id: number, data: any) {
    const response = await fetch(`${API_URL}/upcoming-events/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async deleteUpcomingEvent(id: number) {
    const response = await fetch(`${API_URL}/upcoming-events/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return response.json();
  },

  // ==================
  // Career Support
  // ==================
  async getCareerSupport() {
    const response = await fetch(`${API_URL}/career-support`, {
      headers: getHeaders(),
    });
    return response.json();
  },

  async createCareerSupport(data: any) {
    const response = await fetch(`${API_URL}/career-support`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async updateCareerSupport(id: number, data: any) {
    const response = await fetch(`${API_URL}/career-support/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // ==================
  // Schedule
  // ==================
  async getSchedule() {
    const response = await fetch(`${API_URL}/schedule`, {
      headers: getHeaders(),
    });
    return response.json();
  },

  async createScheduleRow(data: any) {
    const response = await fetch(`${API_URL}/schedule`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async updateScheduleRow(id: number, data: any) {
    const response = await fetch(`${API_URL}/schedule/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async deleteScheduleRow(id: number) {
    const response = await fetch(`${API_URL}/schedule/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return response.json();
  },

  // ==================
  // Notes
  // ==================
  async getNotes() {
    const response = await fetch(`${API_URL}/notes`, {
      headers: getHeaders(),
    });
    return response.json();
  },

  async createNote(data: any) {
    const response = await fetch(`${API_URL}/notes`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async updateNote(id: number, data: any) {
    const response = await fetch(`${API_URL}/notes/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async deleteNote(id: number) {
    const response = await fetch(`${API_URL}/notes/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return response.json();
  },

  // ==================
  // Reminders
  // ==================
  async getReminders() {
    const response = await fetch(`${API_URL}/reminders`, {
      headers: getHeaders(),
    });
    return response.json();
  },

  async createReminder(data: any) {
    const response = await fetch(`${API_URL}/reminders`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async updateReminder(id: number, data: any) {
    const response = await fetch(`${API_URL}/reminders/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async deleteReminder(id: number) {
    const response = await fetch(`${API_URL}/reminders/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return response.json();
  },
};
