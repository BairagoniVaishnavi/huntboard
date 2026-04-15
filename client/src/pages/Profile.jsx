import { useState } from "react";
import { Camera, Save, Github, Linkedin, MapPin, Building2, CheckCircle2 } from "lucide-react";
import useAuthStore from "../store/useAuthStore";
import useAppStore from "../store/useAppStore";
import Topbar from "../components/layout/Topbar";

export default function Profile() {
  const { user, updateProfile } = useAuthStore();
  const jobs = useAppStore((s) => s.jobs);
  const [form, setForm] = useState({
    name:     user?.name     || "",
    email:    user?.email    || "",
    bio:      user?.bio      || "",
    location: user?.location || "",
    jobTitle: user?.jobTitle || "",
    company:  user?.company  || "",
    linkedin: user?.linkedin || "",
    github:   user?.github   || "",
  });
  const [saved, setSaved] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    await updateProfile(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const stats = {
    total:      jobs.length,
    applied:    jobs.filter((j) => j.status === "applied").length,
    interviews: jobs.filter((j) => j.status === "interview").length,
    offers:     jobs.filter((j) => j.status === "offer").length,
    rejected:   jobs.filter((j) => j.status === "rejected").length,
  };

  const initials = form.name
    ? form.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  const colors = ["from-sky-400 to-blue-600","from-violet-400 to-purple-600","from-emerald-400 to-teal-600","from-rose-400 to-pink-600","from-amber-400 to-orange-500"];
  const avatarColor = colors[initials.charCodeAt(0) % colors.length];
  const joinDate = user?.joinedAt
    ? new Date(user.joinedAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "Recently";

  return (
    <div className="page-enter">
      <Topbar title="Profile" />
      <div className="p-6 max-w-4xl mx-auto space-y-6">

        {/* Hero card */}
        <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden">
          <div className={`h-28 bg-gradient-to-r ${avatarColor} relative`}>
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "24px 24px" }} />
          </div>
          <div className="px-6 pb-6">
            <div className="flex items-end justify-between -mt-10 mb-4">
              <div className="relative group">
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${avatarColor} flex items-center justify-center text-white font-sora font-extrabold text-xl shadow-lg border-4 border-[var(--color-surface)]`}>
                  {initials}
                </div>
                <div className="absolute inset-0 rounded-2xl bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera size={20} className="text-white" />
                </div>
              </div>
              <button onClick={handleSave}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95 ${saved ? "bg-emerald-500 text-white" : "bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white shadow-sm"}`}>
                {saved ? <><CheckCircle2 size={15} /> Saved!</> : <><Save size={15} /> Save Changes</>}
              </button>
            </div>
            <div>
              <h2 className="font-sora font-extrabold text-xl text-[var(--color-text-primary)]">{form.name || "Your Name"}</h2>
              <p className="text-[var(--color-text-muted)] text-sm mt-0.5">{form.jobTitle || "Add your title"}</p>
              <div className="flex flex-wrap items-center gap-3 mt-2">
                {form.location && <span className="flex items-center gap-1 text-xs text-[var(--color-text-muted)]"><MapPin size={12} />{form.location}</span>}
                {form.company  && <span className="flex items-center gap-1 text-xs text-[var(--color-text-muted)]"><Building2 size={12} />{form.company}</span>}
                <span className="text-xs text-[var(--color-text-muted)]">Joined {joinDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { label: "Total",      val: stats.total,      color: "text-[var(--color-accent)]" },
            { label: "Applied",    val: stats.applied,    color: "text-blue-500" },
            { label: "Interviews", val: stats.interviews, color: "text-amber-500" },
            { label: "Offers",     val: stats.offers,     color: "text-emerald-500" },
            { label: "Rejected",   val: stats.rejected,   color: "text-rose-500" },
          ].map((s) => (
            <div key={s.label} className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-4 text-center">
              <p className={`font-sora font-extrabold text-2xl ${s.color}`}>{s.val}</p>
              <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Edit form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-5 space-y-4">
            <h3 className="font-sora font-bold text-base text-[var(--color-text-primary)]">Personal Info</h3>
            {[
              { key: "name",     label: "Full Name",        placeholder: "Jane Doe",             type: "text"  },
              { key: "email",    label: "Email",            placeholder: "you@example.com",       type: "email" },
              { key: "jobTitle", label: "Job Title",        placeholder: "SWE Intern / Student",  type: "text"  },
              { key: "company",  label: "School / Company", placeholder: "Stanford University",   type: "text"  },
              { key: "location", label: "Location",         placeholder: "San Francisco, CA",     type: "text"  },
            ].map(({ key, label, placeholder, type }) => (
              <div key={key}>
                <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mb-1.5">{label}</label>
                <input type={type} value={form[key]} onChange={(e) => set(key, e.target.value)} placeholder={placeholder}
                  className="w-full px-3 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition" />
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-5">
              <h3 className="font-sora font-bold text-base text-[var(--color-text-primary)] mb-4">Bio</h3>
              <textarea value={form.bio} onChange={(e) => set("bio", e.target.value)} placeholder="Your career goals and what you're looking for..." rows={5}
                className="w-full px-3 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition resize-none" />
            </div>

            <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-5 space-y-4">
              <h3 className="font-sora font-bold text-base text-[var(--color-text-primary)]">Social Links</h3>
              {[
                { key: "linkedin", label: "LinkedIn", ph: "linkedin.com/in/yourname", icon: <Linkedin size={15} className="text-blue-500" /> },
                { key: "github",   label: "GitHub",   ph: "github.com/yourname",      icon: <Github size={15} className="text-[var(--color-text-muted)]" /> },
              ].map(({ key, label, ph, icon }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mb-1.5">{label}</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">{icon}</div>
                    <input value={form[key]} onChange={(e) => set(key, e.target.value)} placeholder={ph}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
