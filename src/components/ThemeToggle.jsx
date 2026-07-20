import React, { useEffect, useState } from "react";
import { Sun, Moon, Sparkles } from "lucide-react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check local storage or system preference
    const storedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (storedTheme === "dark" || (!storedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  return (
    <button
      id="theme-toggle-button"
      onClick={toggleTheme}
      className="p-2 rounded-xl text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700/80 transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {isDark ? (
        <>
          <Sun className="h-4 w-4 text-amber-400 animate-pulse" />
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider hidden sm:inline text-amber-400">Light Mode</span>
        </>
      ) : (
        <>
          <Moon className="h-4 w-4 text-teal-400" />
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider hidden sm:inline text-teal-400">Dark Mode</span>
        </>
      )}
    </button>
  );
}
