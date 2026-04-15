import { useState } from "react";
import { Bell, Plus, Sun, Moon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";
import useThemeStore from "../../store/useThemeStore";
import useNotifStore from "../../store/useNotifStore";
import NotificationsPanel from "./NotificationsPanel";

export default function Topbar({ title, onAddJob }) {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { mode, toggleMode } = useThemeStore();
  const notifications = useNotifStore((s) => s.notifications);
  const [showNotifs, setShowNotifs] = useState(false);
  const unread = notifications.filter((n) => !n.read).length;
  const initials = user?.name ? user.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) : "U";
  const colors = ["from-sky-400 to-blue-500","from-violet-400 to-purple-500","from-emerald-400 to-teal-500","from-rose-400 to-pink-500","from-amber-400 to-orange-500"];
  const avatarColor = colors[initials.charCodeAt(0) % colors.length];

  return (
    <header className="h-16 bg-[var(--color-surface)] border-b border-[var(--color-border)] flex items-center justify-between px-6 sticky top-0 z-20">
      <h1 className="font-sora font-bold text-xl text-[var(--color-text-primary)]">{title}</h1>
      <div className="flex items-center gap-2">
        {onAddJob && (
          <button onClick={onAddJob} className="flex items-center gap-2 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all shadow-sm hover:shadow-md active:scale-95">
            <Plus size={16} /><span className="hidden sm:inline">Add Application</span>
          </button>
        )}
        <button onClick={toggleMode} title={mode === "dark" ? "Light mode" : "Dark mode"}
          className="w-9 h-9 rounded-xl border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-muted)] hover:bg-[var(--color-bg)] hover:text-[var(--color-text-primary)] transition-all">
          {mode === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        </button>
        <div className="relative">
          <button onClick={() => setShowNotifs((s) => !s)}
            className="w-9 h-9 rounded-xl border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-muted)] hover:bg-[var(--color-bg)] transition-all relative">
            <Bell size={16} />
            {unread > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-[var(--color-accent)] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 leading-none">
                {unread > 9 ? "9+" : unread}
              </span>
            )}
          </button>
          {showNotifs && <NotificationsPanel onClose={() => setShowNotifs(false)} />}
        </div>
        <button onClick={() => navigate("/profile")} title="Profile"
          className={`w-9 h-9 rounded-xl bg-gradient-to-br ${avatarColor} flex items-center justify-center text-white font-sora font-bold text-xs shadow-sm hover:shadow-md hover:scale-105 transition-all`}>
          {initials}
        </button>
      </div>
    </header>
  );
}
