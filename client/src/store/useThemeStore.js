import { create } from "zustand";
import { persist } from "zustand/middleware";

export const ACCENTS = [
  { id: "sky",    label: "Sky Blue", primary: "#0EA5E9", hover: "#0284C7", light: "#EFF6FF", text: "#0369A1" },
  { id: "violet", label: "Violet",   primary: "#8B5CF6", hover: "#7C3AED", light: "#F5F3FF", text: "#6D28D9" },
  { id: "emerald",label: "Emerald",  primary: "#10B981", hover: "#059669", light: "#ECFDF5", text: "#065F46" },
  { id: "rose",   label: "Rose",     primary: "#F43F5E", hover: "#E11D48", light: "#FFF1F2", text: "#BE123C" },
  { id: "amber",  label: "Amber",    primary: "#F59E0B", hover: "#D97706", light: "#FFFBEB", text: "#92400E" },
  { id: "indigo", label: "Indigo",   primary: "#6366F1", hover: "#4F46E5", light: "#EEF2FF", text: "#3730A3" },
];

const applyTheme = (mode, accent) => {
  const root = document.documentElement;
  const ac = ACCENTS.find((a) => a.id === accent) || ACCENTS[0];

  if (mode === "dark") {
    root.style.setProperty("--color-bg", "#0F1117");
    root.style.setProperty("--color-surface", "#1A1D27");
    root.style.setProperty("--color-border", "#2D3148");
    root.style.setProperty("--color-text-primary", "#F1F5F9");
    root.style.setProperty("--color-text-muted", "#94A3B8");
    root.style.setProperty("--column-applied", "#1E2333");
    root.style.setProperty("--column-interview", "#1F1E14");
    root.style.setProperty("--column-offer", "#141F1A");
    root.style.setProperty("--column-rejected", "#1F1419");
    root.setAttribute("data-theme", "dark");
  } else {
    root.style.setProperty("--color-bg", "#F7F8FA");
    root.style.setProperty("--color-surface", "#FFFFFF");
    root.style.setProperty("--color-border", "#E4E7EC");
    root.style.setProperty("--color-text-primary", "#111827");
    root.style.setProperty("--color-text-muted", "#6B7280");
    root.style.setProperty("--column-applied", "#EFF6FF");
    root.style.setProperty("--column-interview", "#FFFBEB");
    root.style.setProperty("--column-offer", "#F0FDF4");
    root.style.setProperty("--column-rejected", "#FFF1F2");
    root.removeAttribute("data-theme");
  }

  root.style.setProperty("--color-accent", ac.primary);
  root.style.setProperty("--color-accent-hover", ac.hover);
  root.style.setProperty("--color-accent-light", ac.light);
  root.style.setProperty("--color-accent-text", ac.text);
};

const useThemeStore = create(
  persist(
    (set, get) => ({
      mode: "light",
      accent: "sky",
      init: () => applyTheme(get().mode, get().accent),
      toggleMode: () => {
        const newMode = get().mode === "light" ? "dark" : "light";
        set({ mode: newMode });
        applyTheme(newMode, get().accent);
      },
      setAccent: (accent) => {
        set({ accent });
        applyTheme(get().mode, accent);
      },
      setMode: (mode) => {
        set({ mode });
        applyTheme(mode, get().accent);
      },
    }),
    { name: "huntboard-theme" }
  )
);

export default useThemeStore;
