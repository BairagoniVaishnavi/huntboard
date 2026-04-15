import { create } from "zustand";
import api from "../lib/api";

const useNotifStore = create((set, get) => ({
  notifications: [],
  initialized: false,

  init: async () => {
    if (get().initialized) return;
    try {
      const { data } = await api.get("/api/notifications");
      set({ notifications: data.notifications, initialized: true });
    } catch {
      set({ initialized: true });
    }
  },

  markRead: async (id) => {
    set((s) => ({
      notifications: s.notifications.map((n) => n.id === id ? { ...n, read: true } : n),
    }));
    api.patch(`/api/notifications/${id}/read`).catch(console.error);
  },

  markAllRead: async () => {
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, read: true })),
    }));
    api.patch("/api/notifications/read-all").catch(console.error);
  },

  deleteNotif: async (id) => {
    set((s) => ({ notifications: s.notifications.filter((n) => n.id !== id) }));
    api.delete(`/api/notifications/${id}`).catch(console.error);
  },

  clearAll: async () => {
    set({ notifications: [] });
    api.delete("/api/notifications").catch(console.error);
  },

  addNotification: (notif) => {
    set((s) => ({
      notifications: [
        { ...notif, id: Date.now().toString(), read: false, timestamp: new Date().toISOString() },
        ...s.notifications,
      ],
    }));
  },

  unreadCount: () => get().notifications.filter((n) => !n.read).length,

  reset: () => set({ notifications: [], initialized: false }),
}));

export default useNotifStore;
