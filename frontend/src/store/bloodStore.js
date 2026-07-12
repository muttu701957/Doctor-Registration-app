import { create } from 'zustand';
import axios from 'axios';

const BASE = import.meta.env.VITE_BACKEND_URL;

export const useBloodStore = create((set, get) => ({
  donorProfile:    null,
  myRequests:      [],
  notifications:   [],
  unreadCount:     0,
  searchResults:   [],
  isLoading:       false,
  error:           null,

  clearError: () => set({ error: null }),

  // ── Donor ─────────────────────────────────────────────────────────────────
  registerDonor: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.post(`${BASE}/api/blood/donor/register`, data, { withCredentials: true });
      set({ donorProfile: res.data.donor, isLoading: false });
      return res.data;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Registration failed', isLoading: false });
      throw err;
    }
  },

  getMyDonorProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.get(`${BASE}/api/blood/donor/me`, { withCredentials: true });
      set({ donorProfile: res.data.donor, isLoading: false });
      return res.data;
    } catch (err) {
      // 404 means not yet registered — not an error to surface
      if (err.response?.status === 404) {
        set({ donorProfile: null, isLoading: false });
        return { success: false };
      }
      set({ error: err.response?.data?.message || 'Failed to fetch profile', isLoading: false });
      throw err;
    }
  },

  updateDonorProfile: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.put(`${BASE}/api/blood/donor/update`, data, { withCredentials: true });
      set({ donorProfile: res.data.donor, isLoading: false });
      return res.data;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Update failed', isLoading: false });
      throw err;
    }
  },

  toggleAvailability: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.put(`${BASE}/api/blood/donor/toggle-availability`, {}, { withCredentials: true });
      set((state) => ({
        donorProfile: state.donorProfile
          ? { ...state.donorProfile, availabilityStatus: res.data.availabilityStatus }
          : state.donorProfile,
        isLoading: false,
      }));
      return res.data;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Toggle failed', isLoading: false });
      throw err;
    }
  },

  getDonorHistory: async () => {
    set({ isLoading: true });
    try {
      const res = await axios.get(`${BASE}/api/blood/donor/history`, { withCredentials: true });
      set({ isLoading: false });
      return res.data;
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  // ── Blood Requests ────────────────────────────────────────────────────────
  createBloodRequest: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.post(`${BASE}/api/blood/request/create`, data, { withCredentials: true });
      set({ isLoading: false });
      return res.data;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Request failed', isLoading: false });
      throw err;
    }
  },

  getMyBloodRequests: async (page = 1) => {
    set({ isLoading: true });
    try {
      const res = await axios.get(`${BASE}/api/blood/request/my-requests?page=${page}`, { withCredentials: true });
      set({ myRequests: res.data.requests, isLoading: false });
      return res.data;
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  cancelBloodRequest: async (requestId) => {
    set({ isLoading: true });
    try {
      const res = await axios.put(`${BASE}/api/blood/request/cancel`, { requestId }, { withCredentials: true });
      set((state) => ({
        myRequests: state.myRequests.map((r) =>
          r._id === requestId ? { ...r, status: 'cancelled' } : r
        ),
        isLoading: false,
      }));
      return res.data;
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  closeBloodRequest: async (requestId) => {
    set({ isLoading: true });
    try {
      const res = await axios.put(`${BASE}/api/blood/request/close`, { requestId }, { withCredentials: true });
      set((state) => ({
        myRequests: state.myRequests.map((r) =>
          r._id === requestId ? { ...r, status: 'fulfilled' } : r
        ),
        isLoading: false,
      }));
      return res.data;
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  // ── Search ────────────────────────────────────────────────────────────────
  searchDonors: async (params) => {
    set({ isLoading: true, searchResults: [] });
    try {
      const res = await axios.post(`${BASE}/api/blood/search/donors`, params, { withCredentials: true });
      set({ searchResults: res.data.donors, isLoading: false });
      return res.data;
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  clearSearchResults: () => set({ searchResults: [] }),

  // ── Active Requests (public feed) ────────────────────────────────────────
  getActiveBloodRequests: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await axios.get(`${BASE}/api/blood/requests/active${query ? `?${query}` : ''}`);
    return res.data;
  },

  // ── Request Donors (visibility-first) ────────────────────────────────────
  getRequestDonors: async (requestId) => {
    set({ isLoading: true });
    try {
      const res = await axios.get(`${BASE}/api/blood/request/${requestId}/donors`, { withCredentials: true });
      set({ isLoading: false });
      return res.data;
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  // ── Notifications ─────────────────────────────────────────────────────────
  getMyNotifications: async (page = 1) => {
    set({ isLoading: true });
    try {
      const res = await axios.get(`${BASE}/api/blood/notifications?page=${page}`, { withCredentials: true });
      set({ notifications: res.data.notifications, unreadCount: res.data.unreadCount, isLoading: false });
      return res.data;
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  getUnreadCount: async () => {
    try {
      const res = await axios.get(`${BASE}/api/blood/notifications/unread-count`, { withCredentials: true });
      set({ unreadCount: res.data.unreadCount });
    } catch (_) {}
  },

  markNotificationsRead: async (notificationIds) => {
    try {
      await axios.put(`${BASE}/api/blood/notifications/mark-read`, { notificationIds }, { withCredentials: true });
      set((state) => ({
        notifications: state.notifications.map((n) =>
          notificationIds.includes(n._id) ? { ...n, isRead: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - notificationIds.length),
      }));
    } catch (_) {}
  },

  markAllNotificationsRead: async () => {
    try {
      await axios.put(`${BASE}/api/blood/notifications/mark-all-read`, {}, { withCredentials: true });
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        unreadCount: 0,
      }));
    } catch (_) {}
  },

  // Called by socket.io listener to push incoming notification
  pushIncomingNotification: (notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  },

  // ── Donor Response ────────────────────────────────────────────────────────
  respondToRequest: async (requestId, responseStatus, notes = '') => {
    set({ isLoading: true });
    try {
      const res = await axios.post(
        `${BASE}/api/blood/response`,
        { requestId, responseStatus, notes },
        { withCredentials: true }
      );
      set({ isLoading: false });
      return res.data;
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },
}));
