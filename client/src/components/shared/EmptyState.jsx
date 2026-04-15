export default function EmptyState({ icon = "📭", title = "Nothing here yet", subtitle = "Add a new application to get started" }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 text-center opacity-60">
      <div className="text-4xl mb-3">{icon}</div>
      <p className="font-semibold text-sm text-gray-500">{title}</p>
      <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
    </div>
  );
}
