import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import JobCard from "./JobCard";
import EmptyState from "../shared/EmptyState";

const columnConfig = {
  applied: {
    label: "📤 Applied",
    bg: "bg-[#EFF6FF]",
    badge: "bg-blue-100 text-blue-600",
    headerColor: "text-blue-700",
  },
  interview: {
    label: "🗣 Interview",
    bg: "bg-[#FFFBEB]",
    badge: "bg-amber-100 text-amber-600",
    headerColor: "text-amber-700",
  },
  offer: {
    label: "🎉 Offer",
    bg: "bg-[#F0FDF4]",
    badge: "bg-green-100 text-green-600",
    headerColor: "text-green-700",
  },
  rejected: {
    label: "❌ Rejected",
    bg: "bg-[#FFF1F2]",
    badge: "bg-rose-100 text-rose-500",
    headerColor: "text-rose-600",
  },
};

export default function KanbanColumn({ status, jobs, onAddCard }) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  const cfg = columnConfig[status];

  return (
    <div className="kanban-col flex flex-col" style={{ minWidth: 280, maxWidth: 310 }}>
      {/* Column header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className={`font-sora font-bold text-sm ${cfg.headerColor}`}>
            {cfg.label}
          </span>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${cfg.badge}`}>
            {jobs.length}
          </span>
        </div>
        <button
          onClick={() => onAddCard(status)}
          className="w-7 h-7 rounded-lg hover:bg-white hover:shadow-sm flex items-center justify-center text-gray-400 hover:text-gray-600 transition-all"
        >
          <Plus size={15} />
        </button>
      </div>

      {/* Drop zone */}
      <div
        ref={setNodeRef}
        className={`flex-1 rounded-2xl p-3 transition-all duration-150 ${cfg.bg} ${
          isOver ? "ring-2 ring-sky-400 ring-offset-1 brightness-95" : ""
        }`}
        style={{ minHeight: 120 }}
      >
        <SortableContext
          items={jobs.map((j) => j.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2.5">
            {jobs.length === 0 ? (
              <EmptyState
                icon={status === "offer" ? "🎯" : status === "rejected" ? "😔" : "📋"}
                title="No applications"
                subtitle="Drag cards here or click +"
              />
            ) : (
              jobs.map((job) => <JobCard key={job.id} job={job} />)
            )}
          </div>
        </SortableContext>
      </div>
    </div>
  );
}
