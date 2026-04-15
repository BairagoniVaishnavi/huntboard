export default function Avatar({ name, size = "md" }) {
  const initials = name
    ? name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  const colors = [
    "bg-sky-500", "bg-violet-500", "bg-emerald-500",
    "bg-amber-500", "bg-rose-500", "bg-indigo-500",
  ];
  const color = colors[initials.charCodeAt(0) % colors.length];
  const sz = size === "sm" ? "w-7 h-7 text-xs" : "w-9 h-9 text-sm";

  return (
    <div className={`${sz} ${color} rounded-full flex items-center justify-center text-white font-bold font-sora`}>
      {initials}
    </div>
  );
}
