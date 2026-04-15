import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import useAuthStore from "./store/useAuthStore";
import useThemeStore from "./store/useThemeStore";
import useNotifStore from "./store/useNotifStore";
import useAppStore from "./store/useAppStore";
import Sidebar from "./components/layout/Sidebar";
import Dashboard from "./pages/Dashboard";
import Board from "./pages/Board";
import ListView from "./pages/ListView";
import JobDetail from "./pages/JobDetail";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function Layout({ children }) {
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "var(--color-bg)" }}>
      <Sidebar />
      <main className="flex-1 min-h-screen" style={{ marginLeft: "var(--sidebar-width)" }}>
        {children}
      </main>
    </div>
  );
}

function RequireAuth({ children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

function RedirectIfAuth({ children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (isAuthenticated) return <Navigate to="/board" replace />;
  return children;
}

export default function App() {
  const init        = useThemeStore((s) => s.init);
  const checkAuth   = useAuthStore((s) => s.checkAuth);
  const isAuth      = useAuthStore((s) => s.isAuthenticated);
  const fetchJobs   = useAppStore((s) => s.fetchJobs);
  const initNotifs  = useNotifStore((s) => s.init);
  const resetNotifs = useNotifStore((s) => s.reset);

  useEffect(() => { init(); }, []);
  useEffect(() => { checkAuth(); }, []);

  useEffect(() => {
    if (isAuth) { fetchJobs(); initNotifs(); }
    else resetNotifs();
  }, [isAuth]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/board" replace />} />
        <Route path="/login"     element={<RedirectIfAuth><Login /></RedirectIfAuth>} />
        <Route path="/signup"    element={<RedirectIfAuth><Signup /></RedirectIfAuth>} />
        <Route path="/dashboard" element={<RequireAuth><Layout><Dashboard /></Layout></RequireAuth>} />
        <Route path="/board"     element={<RequireAuth><Layout><Board /></Layout></RequireAuth>} />
        <Route path="/list"      element={<RequireAuth><Layout><ListView /></Layout></RequireAuth>} />
        <Route path="/job/:id"   element={<RequireAuth><Layout><JobDetail /></Layout></RequireAuth>} />
        <Route path="/profile"   element={<RequireAuth><Layout><Profile /></Layout></RequireAuth>} />
        <Route path="/settings"  element={<RequireAuth><Layout><Settings /></Layout></RequireAuth>} />
      </Routes>
    </BrowserRouter>
  );
}
