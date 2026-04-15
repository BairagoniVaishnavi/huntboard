import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Rocket, ArrowRight, AlertCircle, ShieldCheck } from "lucide-react";
import useAuthStore from "../store/useAuthStore";

const TURNSTILE_SITE_KEY = "1x00000000000000000000AA"; // replace with real key

export default function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated, authError, authLoading, clearError } = useAuthStore();
  const [form, setForm]                   = useState({ email: "", password: "" });
  const [show, setShow]                   = useState(false);
  const [turnstileToken, setTurnstileToken] = useState(null);
  const [turnstileStatus, setTurnstileStatus] = useState("idle");

  useEffect(() => { if (isAuthenticated) navigate("/board"); }, [isAuthenticated]);
  useEffect(() => { clearError(); }, []);

  // Mount Turnstile widget via JS API
  useEffect(() => {
    window.onTurnstileSuccess = (token) => { setTurnstileToken(token); setTurnstileStatus("success"); };
    window.onTurnstileExpire  = ()      => { setTurnstileToken(null);  setTurnstileStatus("idle"); };
    window.onTurnstileError   = ()      => { setTurnstileToken(null);  setTurnstileStatus("error"); };

    const render = () => {
      const container = document.getElementById("turnstile-container");
      if (!container || !window.turnstile) return false;
      if (container.children.length > 0) return true;
      window.turnstile.render(container, {
        sitekey: TURNSTILE_SITE_KEY,
        theme: "auto",
        callback:          (t) => { setTurnstileToken(t);  setTurnstileStatus("success"); },
        "expired-callback": ()  => { setTurnstileToken(null); setTurnstileStatus("idle"); },
        "error-callback":   ()  => { setTurnstileToken(null); setTurnstileStatus("error"); },
      });
      return true;
    };

    if (!render()) {
      const interval = setInterval(() => { if (render()) clearInterval(interval); }, 100);
      return () => clearInterval(interval);
    }
  }, []);

  const set = (k, v) => { setForm((f) => ({ ...f, [k]: v })); clearError(); };
  const canSubmit = form.email && form.password && turnstileToken && !authLoading;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    // Pass turnstileToken to backend for server-side verification
    const ok = await login({ ...form, turnstileToken });
    if (!ok) {
      window.turnstile?.reset();
      setTurnstileToken(null);
      setTurnstileStatus("idle");
    }
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") handleSubmit(); };
  const fillDemo = () => { setForm({ email: "demo@huntboard.app", password: "demo1234" }); clearError(); };

  return (
    <div className="min-h-screen flex auth-bg">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-48 translate-x-48 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-sky-400/30 rounded-full translate-y-40 -translate-x-20 blur-3xl" />
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <Rocket size={20} className="text-white" />
          </div>
          <span className="font-sora font-bold text-2xl text-white">HuntBoard</span>
        </div>
        <div className="relative z-10 space-y-6">
          <h1 className="font-sora font-extrabold text-5xl text-white leading-tight">
            Land your<br />dream job<br /><span className="text-sky-200">faster.</span>
          </h1>
          <p className="text-sky-100 text-lg leading-relaxed max-w-sm">
            Track every application, stay organized, and never miss a follow-up again.
          </p>
          <div className="flex flex-wrap gap-3">
            {["Kanban Board", "Smart Tracking", "Follow-up Alerts", "Analytics"].map((f) => (
              <span key={f} className="px-3 py-1.5 bg-white/20 backdrop-blur-sm text-white text-sm font-medium rounded-full border border-white/20">{f}</span>
            ))}
          </div>
        </div>
        <div className="relative z-10 flex items-center gap-4 flex-wrap">
          {[{ emoji: "🎉", text: "2 offers received" }, { emoji: "🗣", text: "3 interviews" }, { emoji: "📋", text: "10 apps tracked" }].map((s) => (
            <div key={s.text} className="bg-white/15 backdrop-blur-sm rounded-xl px-3 py-2 border border-white/20">
              <span className="text-sm text-white font-medium">{s.emoji} {s.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-[var(--color-bg)]">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 bg-[var(--color-accent)] rounded-xl flex items-center justify-center">
              <Rocket size={18} className="text-white" />
            </div>
            <span className="font-sora font-bold text-xl text-[var(--color-text-primary)]">HuntBoard</span>
          </div>

          <div className="mb-8">
            <h2 className="font-sora font-extrabold text-3xl text-[var(--color-text-primary)]">Welcome back</h2>
            <p className="text-[var(--color-text-muted)] mt-2">Sign in to continue your job hunt</p>
          </div>

          <button onClick={fillDemo} className="w-full mb-6 px-4 py-3 rounded-xl border-2 border-dashed border-sky-200 bg-sky-50 hover:bg-sky-100 text-sm text-sky-600 font-medium transition-all text-left flex items-center justify-between group">
            <span>🎯 Try demo — <span className="font-semibold">demo@huntboard.app</span></span>
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="space-y-4">
            {authError && (
              <div className="flex items-center gap-2.5 px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-600">
                <AlertCircle size={16} />{authError}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mb-1.5">Email</label>
              <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} onKeyDown={handleKeyDown} placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mb-1.5">Password</label>
              <div className="relative">
                <input type={show ? "text" : "password"} value={form.password} onChange={(e) => set("password", e.target.value)} onKeyDown={handleKeyDown} placeholder="••••••••"
                  className="w-full px-4 py-3 pr-11 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition" />
                <button onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
                  {show ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Cloudflare Turnstile */}
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mb-2">Human Verification</label>
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3 flex flex-col gap-2">
                <div className="flex items-center justify-center">
                  <div id="turnstile-container" />
                </div>
                <div className="flex items-center justify-center gap-2 px-1">
                  {turnstileStatus === "success" && <><ShieldCheck size={14} className="text-emerald-500" /><span className="text-xs text-emerald-600 font-medium">Verified — you're human ✓</span></>}
                  {turnstileStatus === "error"   && <><AlertCircle size={14} className="text-rose-500" /><span className="text-xs text-rose-500">Verification failed. <button onClick={() => { window.turnstile?.reset(); setTurnstileStatus("idle"); setTurnstileToken(null); }} className="underline">Try again</button></span></>}
                  {(turnstileStatus === "idle" || turnstileStatus === "solving") && <span className="text-xs text-[var(--color-text-muted)]">Complete the challenge above to continue</span>}
                </div>
              </div>
            </div>

            <button onClick={handleSubmit} disabled={!canSubmit}
              className="w-full py-3.5 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] disabled:opacity-40 disabled:cursor-not-allowed text-white font-sora font-bold text-sm rounded-xl transition-all shadow-sm hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2">
              {authLoading
                ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <>Sign In <ArrowRight size={16} /></>}
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-[var(--color-text-muted)]">
            Don't have an account?{" "}
            <Link to="/signup" className="text-[var(--color-accent)] font-semibold hover:underline">Sign up free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
