import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Trello, List, Settings, Rocket, UserCircle, LogOut } from "lucide-react";
import useAuthStore from "../../store/useAuthStore";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/board",     icon: Trello,          label: "Board"     },
  { to: "/list",      icon: List,            label: "List View" },
  { to: "/profile",   icon: UserCircle,      label: "Profile"   },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const initials = user?.name
    ? user.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "U";
  const colors = ["from-sky-400 to-blue-500","from-violet-400 to-purple-500","from-emerald-400 to-teal-500","from-rose-400 to-pink-500","from-amber-400 to-orange-500"];
  const avatarColor = colors[initials.charCodeAt(0) % colors.length];
  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <>
      <aside className="fixed left-0 top-0 h-screen bg-[var(--color-surface)] border-r border-[var(--color-border)] z-30 flex flex-col transition-colors"
        style={{ width: "var(--sidebar-width)" }}>
        <div className="px-5 py-5 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[var(--color-accent)] rounded-lg flex items-center justify-center shadow-sm">
              <Rocket size={16} className="text-white" />
            </div>
            <span className="font-sora font-bold text-lg tracking-tight text-[var(--color-text-primary)]">HuntBoard</span>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${isActive ? "bg-[var(--color-accent-light,#EFF6FF)] text-[var(--color-accent)] border-l-4 border-[var(--color-accent)] pl-2" : "text-[var(--color-text-muted)] hover:bg-[var(--color-bg)] hover:text-[var(--color-text-primary)]"}`}>
              <Icon size={18} /><span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="px-3 py-3 border-t border-[var(--color-border)] space-y-1">
          <NavLink to="/settings"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive ? "bg-[var(--color-accent-light,#EFF6FF)] text-[var(--color-accent)]" : "text-[var(--color-text-muted)] hover:bg-[var(--color-bg)] hover:text-[var(--color-text-primary)]"}`}>
            <Settings size={18} /><span>Settings</span>
          </NavLink>
          {user && (
            <div className="flex items-center gap-2.5 px-3 py-2.5 mt-1">
              <div className={`w-8 h-8 flex-shrink-0 rounded-lg bg-gradient-to-br ${avatarColor} flex items-center justify-center text-white font-sora font-bold text-xs`}>{initials}</div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[var(--color-text-primary)] truncate">{user.name}</p>
                <p className="text-xs text-[var(--color-text-muted)] truncate">{user.email}</p>
              </div>
              <button onClick={handleLogout} title="Sign out"
                className="flex-shrink-0 w-7 h-7 rounded-lg hover:bg-rose-50 flex items-center justify-center text-[var(--color-text-muted)] hover:text-rose-500 transition-all">
                <LogOut size={14} />
              </button>
            </div>
          )}
        </div>
      </aside>
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[var(--color-surface)] border-t border-[var(--color-border)] z-30 flex justify-around py-2">
        {[...navItems, { to: "/settings", icon: Settings, label: "Settings" }].map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to}
            className={({ isActive }) => `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${isActive ? "text-[var(--color-accent)]" : "text-[var(--color-text-muted)]"}`}>
            <Icon size={20} /><span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
}
