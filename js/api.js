/* ======================================
   js/api.js — Shared API client
   ====================================== */
'use strict';

const API_BASE = 'http://localhost:4000/api';

const Api = {
  _token: () => localStorage.getItem('sp_token'),

  _headers(auth = false) {
    const h = { 'Content-Type': 'application/json' };
    if (auth) h['Authorization'] = `Bearer ${this._token()}`;
    return h;
  },

  async _request(method, path, body, auth = false) {
    const res = await fetch(`${API_BASE}${path}`, {
      method,
      headers: this._headers(auth),
      body: body ? JSON.stringify(body) : undefined
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw Object.assign(new Error(data.error || 'Ошибка сервера'), { status: res.status, data });
    return data;
  },

  // ── Auth ──────────────────────────────────────────────────
  register: (name, email, password) =>
    Api._request('POST', '/auth/register', { name, email, password }),

  login: (email, password) =>
    Api._request('POST', '/auth/login', { email, password }),

  logout: () =>
    Api._request('POST', '/auth/logout', null, true),

  me: () =>
    Api._request('GET', '/auth/me', null, true),

  // ── Courses ───────────────────────────────────────────────
  getCourses: (category) =>
    Api._request('GET', `/courses${category ? `?category=${category}` : ''}`, null, false),

  getCourse: (slug) =>
    Api._request('GET', `/courses/${slug}`, null, true),

  enroll: (slug) =>
    Api._request('POST', `/courses/${slug}/enroll`, null, true),

  saveProgress: (slug, progress) =>
    Api._request('PATCH', `/courses/${slug}/progress`, { progress }, true),

  // ── User ─────────────────────────────────────────────────
  getProfile: () =>
    Api._request('GET', '/users/me', null, true),

  updateProfile: (data) =>
    Api._request('PATCH', '/users/me', data, true),

  // ── Session helpers ───────────────────────────────────────
  isLoggedIn: () => !!localStorage.getItem('sp_token'),

  saveSession: (token, user) => {
    localStorage.setItem('sp_token', token);
    localStorage.setItem('sp_user', JSON.stringify(user));
  },

  clearSession: () => {
    localStorage.removeItem('sp_token');
    localStorage.removeItem('sp_user');
  },

  getUser: () => {
    try { return JSON.parse(localStorage.getItem('sp_user')); } catch { return null; }
  }
};

window.Api = Api;
