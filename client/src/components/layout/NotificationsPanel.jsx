import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { X, CheckCheck, Trash2, Bell, Calendar, Lightbulb, Briefcase, ChevronRight } from "lucide-react";
import useNotifStore from "../../store/useNotifStore";

const TYPE_CONFIG = {
  followup:  { icon: Calendar,   color: "text-amber-500",   bg: "bg-amber-50",   border: "border-amber-200"  },
  interview: { icon: Briefcase,  color: "text-blue-500",    bg: "bg-blue-50",    border: "border-blue-200"   },
  offer:     { icon: Bell,       color: "text-emerald-500", bg: "bg-emerald-50", border: "border-emerald-200" },
  tip:       { icon: Lightbulb,  color: "text-violet-500",  bg: "bg-violet-50",  border: "border-violet-200"  },
};

function timeAgo(ts) {
  const diff = Date.now() - new Date(ts).getTime();
  const m = Math.floor(diff / 60000);
  const h = Math.floor(m / 60);
  const d = Math.floor(h / 24);
  if (m < 1)  return "Just now";
  if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`;
  return `${d}d ago`;
}

export default function NotificationsPanel({ onClose }) {
  const navigate = useNavigate();
  const { notifications, markRead, markAllRead, deleteNotif, clearAll } = useNotifStore();
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    setTimeout(() => document.addEventListener("mousedown", handler), 50);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const unread = notifications.filter((n) => !n.read).length;

  const handleClick = (notif) => {
    markRead(notif.id);
    if (notif.jobId) { navigate(`/job/${notif.jobId}`); onClose(); }
  };

  return (
    <div ref={ref}
      className="absolute right-0 top-12 w-96 max-w-[calc(100vw-2rem)] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl z-50 overflow-hidden"
      style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-2">
          <h3 className="font-sora font-bold text-sm text-[var(--color-text-primary)]">Notifications</h3>
          {unread > 0 && (
            <span className="px-2 py-0.5 bg-[var(--color-accent)] text-white text-xs font-bold rounded-full">{unread}</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {unread > 0 && (
            <button onClick={markAllRead}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[var(--color-text-muted)] hover:bg-[var(--color-bg)] transition-all">
              <CheckCheck size={13} /> All read
            </button>
          )}
          {notifications.length > 0 && (
            <button onClick={clearAll}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-[var(--color-text-muted)] hover:bg-[var(--color-bg)] transition-all">
              <Trash2 size={13} />
            </button>
          )}
          <button onClick={onClose}
            className="w-7 h-7 rounded-lg hover:bg-[var(--color-bg)] flex items-center justify-center text-[var(--color-text-muted)] transition-all">
            <X size={15} />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="max-h-[420px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div className="w-12 h-12 rounded-full bg-[var(--color-bg)] flex items-center justify-center text-2xl">🎉</div>
            <p className="text-sm font-semibold text-[var(--color-text-muted)]">All caught up!</p>
            <p className="text-xs text-[var(--color-text-muted)]">No new notifications</p>
          </div>
        ) : (
          notifications.map((notif) => {
            const cfg = TYPE_CONFIG[notif.type] || TYPE_CONFIG.tip;
            const Icon = cfg.icon;
            return (
              <div key={notif.id} onClick={() => handleClick(notif)}
                className={`flex items-start gap-3 px-4 py-3.5 border-b border-[var(--color-border)] last:border-0 cursor-pointer hover:bg-[var(--color-bg)] transition-colors ${!notif.read ? "bg-[var(--color-accent-light,#F0F9FF)]" : ""}`}>
                <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${cfg.bg} ${cfg.border} border`}>
                  <Icon size={15} className={cfg.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-semibold leading-tight ${!notif.read ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-muted)]"}`}>{notif.title}</p>
                    <button onClick={(e) => { e.stopPropagation(); deleteNotif(notif.id); }}
                      className="flex-shrink-0 hover:text-rose-400 text-[var(--color-text-muted)] transition-all">
                      <X size={13} />
                    </button>
                  </div>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5 leading-relaxed line-clamp-2">{notif.message}</p>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-xs text-[var(--color-text-muted)]">{timeAgo(notif.timestamp)}</span>
                    {notif.jobId && (
                      <span className="text-xs text-[var(--color-accent)] flex items-center gap-0.5 font-medium">
                        View <ChevronRight size={11} />
                      </span>
                    )}
                  </div>
                </div>
                {!notif.read && <div className="w-2 h-2 rounded-full bg-[var(--color-accent)] flex-shrink-0 mt-1.5" />}
              </div>
            );
          })
        )}
      </div>

      {notifications.length > 0 && (
        <div className="px-4 py-3 border-t border-[var(--color-border)] bg-[var(--color-bg)]">
          <p className="text-xs text-center text-[var(--color-text-muted)]">
            {unread > 0 ? `${unread} unread notification${unread > 1 ? "s" : ""}` : "All notifications read"}
          </p>
        </div>
      )}
    </div>
  );
}
