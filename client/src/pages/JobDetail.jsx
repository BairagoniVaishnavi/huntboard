import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ExternalLink, Save, Trash2, MapPin, DollarSign, Calendar, Link as LinkIcon } from "lucide-react";
import useAppStore from "../store/useAppStore";
import { StatusBadge, PriorityBadge } from "../components/shared/Badge";
import ConfirmDeleteModal from "../components/modals/ConfirmDeleteModal";

const STATUSES = [
  { key: "applied", label: "Applied", icon: "📤" },
  { key: "interview", label: "Interview", icon: "🗣" },
  { key: "offer", label: "Offer", icon: "🎉" },
  { key: "rejected", label: "Rejected", icon: "❌" },
];

const PRIORITIES = ["hot", "warm", "longshot"];

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const jobs = useAppStore((s) => s.jobs);
  const updateJob = useAppStore((s) => s.updateJob);
  const deleteJob = useAppStore((s) => s.deleteJob);

  const job = jobs.find((j) => j.id === id);
  const [form, setForm] = useState(job || {});
  const [saved, setSaved] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  if (!job) {
    return (
      <div className="flex items-center justify-center h-screen flex-col gap-4">
        <div className="text-5xl">🔍</div>
        <p className="font-sora font-bold text-xl text-gray-700">Application not found</p>
        <button onClick={() => navigate("/board")} className="text-sky-500 hover:underline text-sm">
          ← Back to Board
        </button>
      </div>
    );
  }

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = () => {
    updateJob(id, form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDelete = () => {
    deleteJob(id);
    navigate("/board");
  };

  const statusIndex = STATUSES.findIndex((s) => s.key === form.status);

  const formatDate = (d) => {
    if (!d) return "Not set";
    return new Date(d).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  };

  return (
    <div className="page-enter min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDeleteModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-rose-500 hover:bg-rose-50 text-sm font-medium transition-all"
            >
              <Trash2 size={15} />
              Delete
            </button>
            <button
              onClick={handleSave}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                saved
                  ? "bg-emerald-500 text-white"
                  : "bg-sky-500 hover:bg-sky-600 text-white shadow-sm hover:shadow-md"
              }`}
            >
              <Save size={15} />
              {saved ? "Saved!" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {/* Hero */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-sky-400 to-blue-600 rounded-2xl flex items-center justify-center text-white font-sora font-extrabold text-xl shadow-sm">
                {form.company?.[0] || "?"}
              </div>
              <div>
                <input
                  value={form.company || ""}
                  onChange={(e) => set("company", e.target.value)}
                  className="font-sora font-extrabold text-2xl text-gray-900 bg-transparent border-0 focus:outline-none focus:ring-0 w-full p-0 leading-tight"
                  placeholder="Company name"
                />
                <input
                  value={form.role || ""}
                  onChange={(e) => set("role", e.target.value)}
                  className="text-gray-500 bg-transparent border-0 focus:outline-none focus:ring-0 w-full p-0 mt-1 text-base"
                  placeholder="Role / Position"
                />
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <PriorityBadge priority={form.priority} />
              <StatusBadge status={form.status} />
            </div>
          </div>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-4 mt-5 pt-5 border-t border-gray-100">
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <MapPin size={14} className="text-gray-400" />
              <input
                value={form.location || ""}
                onChange={(e) => set("location", e.target.value)}
                placeholder="Location"
                className="bg-transparent border-0 focus:outline-none text-sm text-gray-500 p-0 w-36"
              />
            </div>
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <DollarSign size={14} className="text-gray-400" />
              <input
                value={form.salary || ""}
                onChange={(e) => set("salary", e.target.value)}
                placeholder="Salary"
                className="bg-transparent border-0 focus:outline-none text-sm text-gray-500 p-0 w-28"
              />
            </div>
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <Calendar size={14} className="text-gray-400" />
              <span>{formatDate(form.dateApplied)}</span>
            </div>
            {form.url && (
              <a
                href={form.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-sm text-sky-500 hover:text-sky-600 transition-colors"
              >
                <ExternalLink size={14} />
                View Job Posting
              </a>
            )}
          </div>
        </div>

        {/* Status Timeline */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-sora font-bold text-base text-gray-900 mb-5">Application Status</h3>
          <div className="flex items-center gap-0">
            {STATUSES.map((s, i) => {
              const isCompleted = i < statusIndex;
              const isActive = i === statusIndex;
              const isRejected = s.key === "rejected" && form.status === "rejected";
              return (
                <div key={s.key} className="flex items-center flex-1">
                  <button
                    onClick={() => set("status", s.key)}
                    className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all flex-shrink-0 ${
                      isActive ? "scale-110" : "hover:bg-gray-50"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all ${
                        isRejected
                          ? "bg-rose-100 ring-2 ring-rose-400"
                          : isCompleted
                          ? "bg-sky-100 ring-2 ring-sky-400"
                          : isActive && s.key !== "rejected"
                          ? "bg-sky-500 ring-2 ring-sky-400 shadow-lg"
                          : "bg-gray-100"
                      }`}
                    >
                      {s.icon}
                    </div>
                    <span
                      className={`text-xs font-semibold whitespace-nowrap ${
                        isActive ? "text-sky-600" : isCompleted ? "text-sky-500" : "text-gray-400"
                      }`}
                    >
                      {s.label}
                    </span>
                  </button>
                  {i < STATUSES.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-1 rounded-full transition-all ${
                        i < statusIndex ? "bg-sky-300" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority + URL */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="font-sora font-bold text-base text-gray-900 mb-4">Priority Level</h3>
            <div className="space-y-2">
              {PRIORITIES.map((p) => (
                <button
                  key={p}
                  onClick={() => set("priority", p)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all text-sm font-medium ${
                    form.priority === p
                      ? "border-sky-400 bg-sky-50 text-sky-700"
                      : "border-transparent hover:border-gray-200 text-gray-500"
                  }`}
                >
                  <PriorityBadge priority={p} />
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="font-sora font-bold text-base text-gray-900 mb-4">Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                  Date Applied
                </label>
                <input
                  type="date"
                  value={form.dateApplied || ""}
                  onChange={(e) => set("dateApplied", e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                  Job URL
                </label>
                <input
                  value={form.url || ""}
                  onChange={(e) => set("url", e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                  Salary Range
                </label>
                <input
                  value={form.salary || ""}
                  onChange={(e) => set("salary", e.target.value)}
                  placeholder="e.g. $8,000/mo"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-sora font-bold text-base text-gray-900 mb-4">📝 Notes & Journal</h3>
          <textarea
            value={form.notes || ""}
            onChange={(e) => set("notes", e.target.value)}
            placeholder="Add notes about this application — interview feedback, next steps, contacts, etc."
            rows={6}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 transition resize-none text-gray-600 leading-relaxed"
          />
          <div className="flex justify-end mt-3">
            <button
              onClick={handleSave}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all active:scale-95 ${
                saved ? "bg-emerald-500 text-white" : "bg-sky-500 hover:bg-sky-600 text-white shadow-sm"
              }`}
            >
              {saved ? "✓ Saved!" : "Save Notes"}
            </button>
          </div>
        </div>
      </div>

      {deleteModal && (
        <ConfirmDeleteModal
          message={`Delete ${job.company} — ${job.role}? This action cannot be undone.`}
          onConfirm={handleDelete}
          onClose={() => setDeleteModal(false)}
        />
      )}
    </div>
  );
}
