import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpDown, ArrowUp, ArrowDown, Trash2, ExternalLink, ChevronRight } from "lucide-react";
import useAppStore from "../store/useAppStore";
import Topbar from "../components/layout/Topbar";
import { StatusBadge, PriorityBadge } from "../components/shared/Badge";
import AddJobModal from "../components/modals/AddJobModal";
import ConfirmDeleteModal from "../components/modals/ConfirmDeleteModal";
import EmptyState from "../components/shared/EmptyState";

const STATUSES = ["applied", "interview", "offer", "rejected"];

export default function ListView() {
  const navigate = useNavigate();
  const jobs = useAppStore((s) => s.jobs);
  const updateJob = useAppStore((s) => s.updateJob);
  const deleteManyJobs = useAppStore((s) => s.deleteManyJobs);

  const [showModal, setShowModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selected, setSelected] = useState([]);
  const [sortKey, setSortKey] = useState("dateApplied");
  const [sortDir, setSortDir] = useState("desc");
  const [search, setSearch] = useState("");

  const handleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };

  const SortIcon = ({ col }) => {
    if (sortKey !== col) return <ArrowUpDown size={13} className="text-gray-300" />;
    return sortDir === "asc"
      ? <ArrowUp size={13} className="text-sky-500" />
      : <ArrowDown size={13} className="text-sky-500" />;
  };

  const filtered = jobs.filter(
    (j) =>
      j.company.toLowerCase().includes(search.toLowerCase()) ||
      j.role.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    let av = a[sortKey] ?? "";
    let bv = b[sortKey] ?? "";
    if (sortKey === "dateApplied") {
      av = new Date(av); bv = new Date(bv);
    } else {
      av = av.toLowerCase(); bv = bv.toLowerCase();
    }
    if (av < bv) return sortDir === "asc" ? -1 : 1;
    if (av > bv) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  const toggleSelect = (id) =>
    setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);

  const toggleAll = () =>
    setSelected(selected.length === sorted.length ? [] : sorted.map((j) => j.id));

  const handleBulkDelete = () => {
    deleteManyJobs(selected);
    setSelected([]);
  };

  const formatDate = (d) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="page-enter">
      <Topbar title="List View" onAddJob={() => setShowModal(true)} />

      <div className="p-6">
        {/* Toolbar */}
        <div className="flex items-center gap-3 mb-5">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search applications..."
            className="flex-1 max-w-xs px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 transition"
          />
          {selected.length > 0 && (
            <button
              onClick={() => setDeleteModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-sm font-semibold rounded-xl transition-all"
            >
              <Trash2 size={15} />
              Delete {selected.length} selected
            </button>
          )}
          <span className="ml-auto text-sm text-gray-400">
            {sorted.length} application{sorted.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          {sorted.length === 0 ? (
            <EmptyState title="No applications yet" subtitle="Click 'Add Application' to get started" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="w-10 px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selected.length === sorted.length && sorted.length > 0}
                        onChange={toggleAll}
                        className="w-4 h-4 rounded border-gray-300 text-sky-500 focus:ring-sky-300"
                      />
                    </th>
                    {[
                      { key: "company", label: "Company" },
                      { key: "role", label: "Role" },
                      { key: "status", label: "Status" },
                      { key: "priority", label: "Priority" },
                      { key: "dateApplied", label: "Date Applied" },
                    ].map(({ key, label }) => (
                      <th
                        key={key}
                        onClick={() => handleSort(key)}
                        className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide cursor-pointer hover:text-gray-700 select-none"
                      >
                        <div className="flex items-center gap-1.5">
                          {label}
                          <SortIcon col={key} />
                        </div>
                      </th>
                    ))}
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((job) => (
                    <tr
                      key={job.id}
                      onClick={() => navigate(`/job/${job.id}`)}
                      className={`border-b border-gray-50 last:border-0 hover:bg-sky-50/40 transition-colors cursor-pointer group ${
                        selected.includes(job.id) ? "bg-sky-50" : ""
                      }`}
                    >
                      <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selected.includes(job.id)}
                          onChange={() => toggleSelect(job.id)}
                          className="w-4 h-4 rounded border-gray-300 text-sky-500 focus:ring-sky-300"
                        />
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 bg-gradient-to-br from-sky-400 to-blue-500 rounded-lg flex items-center justify-center text-white text-xs font-bold font-sora flex-shrink-0">
                            {job.company[0]}
                          </div>
                          <span className="font-semibold text-sm text-gray-900">{job.company}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-gray-500">{job.role}</td>
                      <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={job.status}
                          onChange={(e) => updateJob(job.id, { status: e.target.value })}
                          className="text-xs rounded-lg border border-gray-200 px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-sky-300 capitalize font-medium text-gray-600"
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s} className="capitalize">
                              {s.charAt(0).toUpperCase() + s.slice(1)}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3.5">
                        <PriorityBadge priority={job.priority} />
                      </td>
                      <td className="px-4 py-3.5 text-sm text-gray-400">{formatDate(job.dateApplied)}</td>
                      <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {job.url && (
                            <a
                              href={job.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-gray-400 hover:text-sky-500 transition-colors"
                            >
                              <ExternalLink size={14} />
                            </a>
                          )}
                          <button
                            onClick={() => navigate(`/job/${job.id}`)}
                            className="text-gray-400 hover:text-sky-500 transition-colors"
                          >
                            <ChevronRight size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showModal && <AddJobModal onClose={() => setShowModal(false)} />}
      {deleteModal && (
        <ConfirmDeleteModal
          message={`Delete ${selected.length} selected application${selected.length > 1 ? "s" : ""}? This cannot be undone.`}
          onConfirm={handleBulkDelete}
          onClose={() => setDeleteModal(false)}
        />
      )}
    </div>
  );
}
