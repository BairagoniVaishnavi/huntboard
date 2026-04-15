const STATUS_CONFIG = [
  { key: "applied", label: "Applied", color: "#60A5FA", bg: "bg-blue-400" },
  { key: "interview", label: "Interview", color: "#FBBF24", bg: "bg-amber-400" },
  { key: "offer", label: "Offer", color: "#34D399", bg: "bg-emerald-400" },
  { key: "rejected", label: "Rejected", color: "#FB7185", bg: "bg-rose-400" },
];

export default function ProgressChart({ jobs }) {
  const total = jobs.length || 1;
  const counts = STATUS_CONFIG.map((s) => ({
    ...s,
    count: jobs.filter((j) => j.status === s.key).length,
  }));

  // Build conic-gradient
  let cumulative = 0;
  const segments = counts.map((s) => {
    const pct = (s.count / total) * 100;
    const start = cumulative;
    cumulative += pct;
    return { ...s, pct, start, end: cumulative };
  });

  const gradientParts = segments
    .filter((s) => s.pct > 0)
    .map((s) => `${s.color} ${s.start.toFixed(1)}% ${s.end.toFixed(1)}%`);

  const conicGradient = gradientParts.length > 0
    ? `conic-gradient(${gradientParts.join(", ")})`
    : `conic-gradient(#E5E7EB 0% 100%)`;

  return (
    <div className="flex items-center gap-8">
      {/* Donut */}
      <div className="relative flex-shrink-0" style={{ width: 120, height: 120 }}>
        <div
          className="w-full h-full rounded-full"
          style={{ background: conicGradient }}
        />
        {/* Hole */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
            <span className="font-sora font-extrabold text-xl text-gray-900 leading-none">
              {jobs.length}
            </span>
            <span className="text-xs text-gray-400 mt-0.5">total</span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex-1 space-y-3">
        {counts.map((s) => (
          <div key={s.key} className="flex items-center gap-3">
            <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${s.bg}`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-xs font-medium text-gray-600">{s.label}</span>
                <span className="text-xs font-bold text-gray-800">{s.count}</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${s.bg} transition-all duration-700`}
                  style={{ width: `${(s.count / total) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
