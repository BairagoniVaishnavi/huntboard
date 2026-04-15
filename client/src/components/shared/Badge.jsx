export function PriorityBadge({ priority }) {
  const map = {
    hot: { label: "🔴 Hot", bg: "bg-red-100", text: "text-red-700", border: "border-red-200" },
    warm: { label: "🟡 Warm", bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-200" },
    longshot: { label: "🔵 Long Shot", bg: "bg-slate-100", text: "text-slate-600", border: "border-slate-200" },
  };
  const s = map[priority] || map.warm;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${s.bg} ${s.text} ${s.border}`}>
      {s.label}
    </span>
  );
}

export function StatusBadge({ status }) {
  const map = {
    applied: { label: "Applied", bg: "bg-blue-100", text: "text-blue-700" },
    interview: { label: "Interview", bg: "bg-amber-100", text: "text-amber-700" },
    offer: { label: "Offer", bg: "bg-green-100", text: "text-green-700" },
    rejected: { label: "Rejected", bg: "bg-rose-100", text: "text-rose-600" },
  };
  const s = map[status] || map.applied;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${s.bg} ${s.text}`}>
      {s.label}
    </span>
  );
}
