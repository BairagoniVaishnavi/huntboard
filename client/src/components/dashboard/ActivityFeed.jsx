import { StatusBadge } from "../shared/Badge";
import Avatar from "../shared/Avatar";

const actionLabels = {
  added: "Added",
  updated: "Updated",
  moved: "Moved to",
};

export default function ActivityFeed({ activities }) {
  if (!activities || activities.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400 text-sm">No recent activity</div>
    );
  }

  return (
    <div className="space-y-3">
      {activities.slice(0, 8).map((a, i) => (
        <div key={`${a.id}-${i}`} className="flex items-start gap-3 py-2.5 border-b border-gray-50 last:border-0">
          <Avatar name={a.company} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-800">
              <span className="font-semibold">{a.company}</span>
              <span className="text-gray-400 mx-1">—</span>
              <span className="text-gray-500">{a.role}</span>
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              {actionLabels[a.type] || "Updated"}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            <StatusBadge status={a.status} />
            <span className="text-xs text-gray-300">{a.date}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
