import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Moon, Sun, Palette, Bell, Shield, Trash2, LogOut, ChevronRight, Monitor, Check } from "lucide-react";
import useThemeStore, { ACCENTS } from "../store/useThemeStore";
import useAuthStore from "../store/useAuthStore";
import useAppStore from "../store/useAppStore";
import useNotifStore from "../store/useNotifStore";
import Topbar from "../components/layout/Topbar";
import ConfirmDeleteModal from "../components/modals/ConfirmDeleteModal";

function Section({ title, children }) {
  return (
    <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden">
      <div className="px-5 py-4 border-b border-[var(--color-border)]">
        <h3 className="font-sora font-bold text-sm text-[var(--color-text-primary)]">{title}</h3>
      </div>
      <div className="divide-y divide-[var(--color-border)]">{children}</div>
    </div>
  );
}

function Row({ icon: Icon, label, description, children, danger }) {
  return (
    <div className={`flex items-center justify-between gap-4 px-5 py-4 ${danger ? "hover:bg-rose-50/50" : "hover:bg-[var(--color-bg)]"} transition-colors`}>
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${danger ? "bg-rose-100 text-rose-500" : "bg-[var(--color-bg)] text-[var(--color-text-muted)]"}`}>
          <Icon size={16} />
        </div>
        <div>
          <p className={`text-sm font-semibold ${danger ? "text-rose-500" : "text-[var(--color-text-primary)]"}`}>{label}</p>
          {description && <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{description}</p>}
        </div>
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <button onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-all duration-200 ${checked ? "bg-[var(--color-accent)]" : "bg-gray-200"}`}>
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${checked ? "translate-x-5" : "translate-x-0"}`} />
    </button>
  );
}

export default function Settings() {
  const navigate = useNavigate();
  const { mode, accent, toggleMode, setAccent, setMode } = useThemeStore();
  const { user, logout, updateProfile } = useAuthStore();
  const { clearAll: clearNotifs } = useNotifStore();
  const jobs = useAppStore((s) => s.jobs);
  const [deleteModal, setDeleteModal] = useState(null);

  const notifPrefs = user?.notifications || { followUpReminders: true, statusAlerts: true, weeklyDigest: false, tips: true };

  const updateNotif = (key, val) => updateProfile({ notifications: { ...notifPrefs, [key]: val } });

  const handleClearData = () => {
    useAppStore.setState({ jobs: [], activities: [] });
    clearNotifs();
  };

  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <div className="page-enter">
      <Topbar title="Settings" />
      <div className="p-6 max-w-2xl mx-auto space-y-6">

        <Section title="🎨 Appearance">
          <Row icon={mode === "dark" ? Moon : Sun} label="Color Mode" description="Choose light, dark, or system theme">
            <div className="flex items-center gap-1 p-1 bg-[var(--color-bg)] rounded-xl border border-[var(--color-border)]">
              {[
                { val: "light", icon: Sun, label: "Light" },
                { val: "dark",  icon: Moon, label: "Dark" },
                { val: "system",icon: Monitor, label: "System" },
              ].map(({ val, icon: Icon, label }) => (
                <button key={val}
                  onClick={() => {
                    if (val === "system") {
                      const sysDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
                      setMode(sysDark ? "dark" : "light");
                    } else setMode(val);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${mode === val ? "bg-[var(--color-surface)] text-[var(--color-accent)] shadow-sm" : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"}`}>
                  <Icon size={13} />{label}
                </button>
              ))}
            </div>
          </Row>

          <div className="px-5 py-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--color-bg)] flex items-center justify-center">
                <Palette size={16} className="text-[var(--color-text-muted)]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--color-text-primary)]">Accent Color</p>
                <p className="text-xs text-[var(--color-text-muted)]">Choose your primary brand color</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 ml-11">
              {ACCENTS.map((a) => (
                <button key={a.id} onClick={() => setAccent(a.id)} title={a.label}
                  className="w-8 h-8 rounded-full transition-transform hover:scale-110 active:scale-95 flex items-center justify-center"
                  style={{ backgroundColor: a.primary }}>
                  {accent === a.id && <Check size={14} className="text-white drop-shadow" strokeWidth={3} />}
                </button>
              ))}
            </div>
          </div>
        </Section>

        <Section title="🔔 Notifications">
          {[
            { key: "followUpReminders", label: "Follow-up Reminders",  desc: "Remind me when to follow up on applications" },
            { key: "statusAlerts",      label: "Status Alerts",         desc: "Notify when application status changes" },
            { key: "weeklyDigest",      label: "Weekly Digest",         desc: "Weekly summary of your job hunt progress" },
            { key: "tips",              label: "Tips & Suggestions",    desc: "Helpful tips to improve your applications" },
          ].map(({ key, label, desc }) => (
            <Row key={key} icon={Bell} label={label} description={desc}>
              <Toggle checked={notifPrefs[key] ?? true} onChange={(v) => updateNotif(key, v)} />
            </Row>
          ))}
        </Section>

        <Section title="🔐 Privacy & Security">
          <Row icon={Shield} label="Password" description="Change your account password">
            <button className="flex items-center gap-1 text-xs text-[var(--color-accent)] font-semibold hover:underline">
              Update <ChevronRight size={13} />
            </button>
          </Row>
          <Row icon={Shield} label="Account Email" description={user?.email || "Not set"}>
            <button className="flex items-center gap-1 text-xs text-[var(--color-accent)] font-semibold hover:underline">
              Change <ChevronRight size={13} />
            </button>
          </Row>
        </Section>

        <Section title="💾 Data">
          <Row icon={Trash2} label="Clear All Applications"
            description={`Permanently delete all ${jobs.length} application${jobs.length !== 1 ? "s" : ""}`} danger>
            <button onClick={() => setDeleteModal("data")}
              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-500 text-xs font-semibold rounded-lg transition-all">
              Clear Data
            </button>
          </Row>
        </Section>

        <Section title="👤 Account">
          <Row icon={LogOut} label="Sign Out" description="Sign out of your account" danger>
            <button onClick={handleLogout}
              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-500 text-xs font-semibold rounded-lg transition-all">
              Sign Out
            </button>
          </Row>
          <Row icon={Trash2} label="Delete Account" description="Permanently delete your account and all data" danger>
            <button onClick={() => setDeleteModal("account")}
              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-500 text-xs font-semibold rounded-lg transition-all">
              Delete
            </button>
          </Row>
        </Section>

        <p className="text-center text-xs text-[var(--color-text-muted)] pb-4">
          HuntBoard v2.0 MERN · MongoDB + Express + React + Node.js
        </p>
      </div>

      {deleteModal === "data" && (
        <ConfirmDeleteModal
          message="This will permanently delete all your job applications and activity. This cannot be undone."
          onConfirm={handleClearData}
          onClose={() => setDeleteModal(null)}
        />
      )}
      {deleteModal === "account" && (
        <ConfirmDeleteModal
          message="This will permanently delete your account and all data. You will be signed out immediately."
          onConfirm={() => { handleClearData(); handleLogout(); }}
          onClose={() => setDeleteModal(null)}
        />
      )}
    </div>
  );
}
