import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { Search, SlidersHorizontal } from "lucide-react";
import useAppStore from "../store/useAppStore";
import Topbar from "../components/layout/Topbar";
import KanbanColumn from "../components/board/KanbanColumn";
import AddJobModal from "../components/modals/AddJobModal";
import { PriorityBadge } from "../components/shared/Badge";

const STATUSES = ["applied", "interview", "offer", "rejected"];

export default function Board() {
  const jobs = useAppStore((s) => s.jobs);
  const moveJob = useAppStore((s) => s.moveJob);
  const [showModal, setShowModal] = useState(false);
  const [defaultStatus, setDefaultStatus] = useState("applied");
  const [activeId, setActiveId] = useState(null);
  const [search, setSearch] = useState("");
  const [filterPriority, setFilterPriority] = useState("all");
  const [sortDir, setSortDir] = useState("desc");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const activeJob = jobs.find((j) => j.id === activeId);

  const filtered = jobs.filter((j) => {
    const matchSearch =
      !search ||
      j.company.toLowerCase().includes(search.toLowerCase()) ||
      j.role.toLowerCase().includes(search.toLowerCase());
    const matchPriority = filterPriority === "all" || j.priority === filterPriority;
    return matchSearch && matchPriority;
  });

  const sorted = [...filtered].sort((a, b) => {
    const da = new Date(a.dateApplied);
    const db = new Date(b.dateApplied);
    return sortDir === "desc" ? db - da : da - db;
  });

  const getJobsByStatus = (status) => sorted.filter((j) => j.status === status);

  const handleDragStart = ({ active }) => setActiveId(active.id);

  const handleDragEnd = ({ active, over }) => {
    setActiveId(null);
    if (!over) return;

    const activeJob = jobs.find((j) => j.id === active.id);
    if (!activeJob) return;

    // If dropped on a column droppable
    if (STATUSES.includes(over.id)) {
      if (activeJob.status !== over.id) {
        moveJob(active.id, over.id);
      }
      return;
    }

    // If dropped on another card
    const overJob = jobs.find((j) => j.id === over.id);
    if (overJob && overJob.status !== activeJob.status) {
      moveJob(active.id, overJob.status);
    }
  };

  const handleDragOver = ({ active, over }) => {
    if (!over) return;
    const activeJob = jobs.find((j) => j.id === active.id);
    if (!activeJob) return;

    const overStatus = STATUSES.includes(over.id)
      ? over.id
      : jobs.find((j) => j.id === over.id)?.status;

    if (overStatus && overStatus !== activeJob.status) {
      moveJob(active.id, overStatus);
    }
  };

  const handleAddCard = (status) => {
    setDefaultStatus(status);
    setShowModal(true);
  };

  return (
    <div className="page-enter flex flex-col h-screen overflow-hidden">
      <Topbar title="Board" onAddJob={() => setShowModal(true)} />

      {/* Filter bar */}
      <div className="bg-white border-b border-gray-100 px-6 py-3 flex items-center gap-3 flex-shrink-0">
        <div className="relative flex-1 max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search companies or roles..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 transition"
          />
        </div>
        <div className="flex items-center gap-1">
          <SlidersHorizontal size={14} className="text-gray-400" />
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 bg-white text-gray-600"
          >
            <option value="all">All priorities</option>
            <option value="hot">🔴 Hot</option>
            <option value="warm">🟡 Warm</option>
            <option value="longshot">🔵 Long Shot</option>
          </select>
        </div>
        <select
          value={sortDir}
          onChange={(e) => setSortDir(e.target.value)}
          className="px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 bg-white text-gray-600"
        >
          <option value="desc">Newest first</option>
          <option value="asc">Oldest first</option>
        </select>
        <span className="text-xs text-gray-400 ml-auto">
          {filtered.length} application{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Board */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-5 p-6 h-full" style={{ minWidth: "max-content" }}>
            {STATUSES.map((status) => (
              <KanbanColumn
                key={status}
                status={status}
                jobs={getJobsByStatus(status)}
                onAddCard={handleAddCard}
              />
            ))}
          </div>

          <DragOverlay>
            {activeJob ? (
              <div className="bg-white rounded-xl border border-gray-100 shadow-2xl p-3.5 w-72 rotate-2 scale-105">
                <p className="font-sora font-bold text-sm text-gray-900">{activeJob.company}</p>
                <p className="text-xs text-gray-500 mt-0.5">{activeJob.role}</p>
                <div className="mt-2">
                  <PriorityBadge priority={activeJob.priority} />
                </div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {showModal && (
        <AddJobModal
          onClose={() => setShowModal(false)}
          defaultStatus={defaultStatus}
        />
      )}
    </div>
  );
}
