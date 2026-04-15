import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Rocket, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";
import useAuthStore from "../store/useAuthStore";

const requirements = [
  { test: (p) => p.length >= 8,   label: "At least 8 characters" },
  { test: (p) => /[A-Z]/.test(p), label: "One uppercase letter" },
  { test: (p) => /[0-9]/.test(p), label: "One number" },
];

export default function Signup() {
  const navigate = useNavigate();
  const { signup, isAuthenticated, authError, authLoading, clearError } = useAuthStore();
  const [form, setForm] = useState({ name: "", email: "", password: "", jobTitle: "", company: "" });
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => { if (isAuthenticated) navigate("/board"); }, [isAuthenticated]);
  useEffect(() => { clearError(); }, []);

  const set = (k, v) => { setForm((f) => ({ ...f, [k]: v })); clearError(); };
  const metReqs = requirements.filter((r) => r.test(form.password));
  const canProceed = form.name.trim() && form.email.trim() && metReqs.length === 3;

  const handleSubmit = async () => {
    if (!canProceed) return;
    const ok = await signup(form);
    if (ok) navigate("/board");
  };

  const strengthColors = ["bg-gray-200", "bg-rose-400", "bg-amber-400", "bg-emerald-400"];
  const strengthLabels = ["", "Weak", "Fair", "Strong"];

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] p-6">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-9 h-9 bg-[var(--color-accent)] rounded-xl flex items-center justify-center shadow-lg">
            <Rocket size={18} className="text-white" />
          </div>
          <span className="font-sora font-bold text-xl text-[var(--color-text-primary)]">HuntBoard</span>
        </div>

        <div className="mb-8">
          <h2 className="font-sora font-extrabold text-3xl text-[var(--color-text-primary)]">Create your account</h2>
          <p className="text-[var(--color-text-muted)] mt-2">Start tracking your job hunt for free</p>
        </div>

        <div className="flex items-center gap-2 mb-6">
          {[1, 2].map((s) => (
            <div key={s} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${s <= step ? "bg-[var(--color-accent)]" : "bg-[var(--color-border)]"}`} />
          ))}
        </div>

        <div className="space-y-4">
          {authError && (
            <div className="flex items-center gap-2.5 px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-600">
              <AlertCircle size={16} />{authError}
            </div>
          )}

          {step === 1 && (
            <>
              {[{ k: "name", label: "Full Name", ph: "Jane Doe", type: "text" }, { k: "email", label: "Email", ph: "you@example.com", type: "email" }].map(({ k, label, ph, type }) => (
                <div key={k}>
                  <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mb-1.5">{label}</label>
                  <input type={type} value={form[k]} onChange={(e) => set(k, e.target.value)} placeholder={ph}
                    className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition" />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mb-1.5">Password</label>
                <div className="relative">
                  <input type={show ? "text" : "password"} value={form.password} onChange={(e) => set("password", e.target.value)} placeholder="••••••••"
                    className="w-full px-4 py-3 pr-11 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition" />
                  <button onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
                    {show ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
                {form.password && (
                  <div className="mt-2 space-y-2">
                    <div className="flex gap-1 items-center">
                      {[1,2,3].map((i) => (
                        <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= metReqs.length ? strengthColors[metReqs.length] : "bg-gray-200"}`} />
                      ))}
                      <span className="text-xs text-[var(--color-text-muted)] ml-2">{strengthLabels[metReqs.length]}</span>
                    </div>
                    {requirements.map((r) => (
                      <div key={r.label} className={`flex items-center gap-1.5 text-xs ${r.test(form.password) ? "text-emerald-500" : "text-[var(--color-text-muted)]"}`}>
                        <CheckCircle2 size={12} />{r.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button onClick={() => canProceed && setStep(2)} disabled={!canProceed}
                className="w-full py-3.5 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] disabled:opacity-40 text-white font-sora font-bold text-sm rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                Continue <ArrowRight size={16} />
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <p className="text-sm text-[var(--color-text-muted)] -mt-1 mb-2">Tell us a bit about yourself (optional)</p>
              {[{ k: "jobTitle", label: "Job Title", ph: "CS Student / Engineer" }, { k: "company", label: "School / Company", ph: "Stanford University" }].map(({ k, label, ph }) => (
                <div key={k}>
                  <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mb-1.5">{label}</label>
                  <input value={form[k]} onChange={(e) => set(k, e.target.value)} placeholder={ph}
                    className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition" />
                </div>
              ))}
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 py-3.5 border border-[var(--color-border)] text-[var(--color-text-muted)] font-semibold text-sm rounded-xl hover:bg-[var(--color-surface)] transition-all">Back</button>
                <button onClick={handleSubmit} disabled={authLoading}
                  className="flex-[2] py-3.5 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] disabled:opacity-50 text-white font-sora font-bold text-sm rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                  {authLoading
                    ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : <>Create Account <ArrowRight size={16} /></>}
                </button>
              </div>
            </>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-[var(--color-text-muted)]">
          Already have an account?{" "}
          <Link to="/login" className="text-[var(--color-accent)] font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
