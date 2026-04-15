import { create } from "zustand";
import api from "../lib/api";

const useAppStore = create((set, get) => ({
  jobs: [],
  activities: [],
  loading: false,
  error: null,

  fetchJobs: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.get("/api/jobs");
      const jobs = data.jobs;
      set({
        jobs,
        loading: false,
        activities: jobs.slice(0, 5).map((j) => ({
          id: j.id, type: "added", company: j.company,
          role: j.role, status: j.status, date: j.dateApplied,
        })),
      });
    } catch (err) {
      set({ loading: false, error: err.response?.data?.message || "Failed to load jobs" });
    }
  },

  addJob: async (job) => {
    const tempId = `temp-${Date.now()}`;
    const optimistic = { ...job, id: tempId, dateApplied: job.dateApplied || new Date().toISOString().split("T")[0] };
    set((s) => ({
      jobs: [...s.jobs, optimistic],
      activities: [{ id: tempId, type: "added", company: job.company, role: job.role, status: job.status, date: new Date().toISOString().split("T")[0] }, ...s.activities.slice(0, 19)],
    }));
    try {
      const { data } = await api.post("/api/jobs", job);
      set((s) => ({
        jobs: s.jobs.map((j) => (j.id === tempId ? data.job : j)),
        activities: s.activities.map((a) => a.id === tempId ? { ...a, id: data.job.id } : a),
      }));
    } catch {
      set((s) => ({ jobs: s.jobs.filter((j) => j.id !== tempId), activities: s.activities.filter((a) => a.id !== tempId) }));
    }
  },

  updateJob: (id, updates) => {
    set((s) => ({
      jobs: s.jobs.map((j) => (j.id === id ? { ...j, ...updates } : j)),
      activities: [{ id, type: "updated", company: s.jobs.find((j) => j.id === id)?.company, role: s.jobs.find((j) => j.id === id)?.role, status: updates.status || s.jobs.find((j) => j.id === id)?.status, date: new Date().toISOString().split("T")[0] }, ...s.activities.slice(0, 19)],
    }));
    api.put(`/api/jobs/${id}`, updates).catch(console.error);
  },

  deleteJob: (id) => {
    const snapshot = get().jobs;
    set((s) => ({ jobs: s.jobs.filter((j) => j.id !== id), activities: s.activities.filter((a) => a.id !== id) }));
    api.delete(`/api/jobs/${id}`).catch(() => set({ jobs: snapshot }));
  },

  moveJob: (id, newStatus) => {
    set((s) => ({
      jobs: s.jobs.map((j) => (j.id === id ? { ...j, status: newStatus } : j)),
      activities: [{ id, type: "moved", company: s.jobs.find((j) => j.id === id)?.company, role: s.jobs.find((j) => j.id === id)?.role, status: newStatus, date: new Date().toISOString().split("T")[0] }, ...s.activities.slice(0, 19)],
    }));
    api.patch(`/api/jobs/${id}/move`, { status: newStatus }).catch(console.error);
  },

  deleteManyJobs: (ids) => {
    const snapshot = get().jobs;
    set((s) => ({ jobs: s.jobs.filter((j) => !ids.includes(j.id)), activities: s.activities.filter((a) => !ids.includes(a.id)) }));
    api.delete("/api/jobs/bulk", { data: { ids } }).catch(() => set({ jobs: snapshot }));
  },
}));

export default useAppStore;
