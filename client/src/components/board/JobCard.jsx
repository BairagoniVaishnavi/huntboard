import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useNavigate } from "react-router-dom";
import { ExternalLink, GripVertical, MapPin, Calendar } from "lucide-react";
import { PriorityBadge } from "../shared/Badge";

const columnBorderColors = {
  applied: "border-l-blue-400",
  interview: "border-l-amber-400",
  offer: "border-l-emerald-400",
  rejected: "border-l-rose-400",
};

export default function JobCard({ job }) {
  const navigate = useNavigate();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: job.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const borderColor = columnBorderColors[job.status] || "border-l-gray-300";

  const formatDate = (d) => {
    if (!d) return "";
    const date = new Date(d);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-xl border border-gray-100 border-l-4 ${borderColor} shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-150 cursor-pointer group select-none`}
      onClick={() => navigate(`/job/${job.id}`)}
    >
      <div className="p-3.5">
        {/* Top row */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <p className="font-sora font-bold text-sm text-gray-900 truncate leading-tight">
              {job.company}
            </p>
            <p className="text-xs text-gray-500 mt-0.5 truncate font-dm">{job.role}</p>
          </div>
          <div
            {...attributes}
            {...listeners}
            onClick={(e) => e.stopPropagation()}
            className="flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-gray-300 hover:text-gray-500 hover:bg-gray-100 transition-all cursor-grab active:cursor-grabbing"
          >
            <GripVertical size={14} />
          </div>
        </div>

        {/* Location */}
        {job.location && (
          <div className="flex items-center gap-1 mb-2.5">
            <MapPin size={11} className="text-gray-300 flex-shrink-0" />
            <span className="text-xs text-gray-400 truncate">{job.location}</span>
          </div>
        )}

        {/* Bottom row */}
        <div className="flex items-center justify-between gap-2">
          <PriorityBadge priority={job.priority} />
          <div className="flex items-center gap-2">
            {job.url && (
              <a
                href={job.url}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-gray-300 hover:text-sky-500 transition-colors"
              >
                <ExternalLink size={13} />
              </a>
            )}
            <div className="flex items-center gap-1 text-gray-400">
              <Calendar size={11} />
              <span className="text-xs">{formatDate(job.dateApplied)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
