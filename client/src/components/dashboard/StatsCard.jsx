export default function StatsCard({ label, value, icon, color, sub }) {
  const colorMap = {
    blue: "from-blue-500 to-sky-400",
    amber: "from-amber-500 to-orange-400",
    green: "from-emerald-500 to-teal-400",
    rose: "from-rose-500 to-pink-400",
  };
  const bgMap = {
    blue: "bg-blue-50",
    amber: "bg-amber-50",
    green: "bg-emerald-50",
    rose: "bg-rose-50",
  };
  const textMap = {
    blue: "text-blue-600",
    amber: "text-amber-600",
    green: "text-emerald-600",
    rose: "text-rose-500",
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-all duration-200 group">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl ${bgMap[color]} flex items-center justify-center text-xl group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        {sub && (
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${bgMap[color]} ${textMap[color]}`}>
            {sub}
          </span>
        )}
      </div>
      <p className="font-sora font-extrabold text-3xl text-gray-900 leading-none mb-1">
        {value}
      </p>
      <p className="text-sm text-gray-400 font-dm">{label}</p>
    </div>
  );
}
