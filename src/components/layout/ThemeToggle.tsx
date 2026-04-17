"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

const STORAGE_KEY = "hirefy-theme";

function getInitialTheme(): Theme {
  if (typeof document === "undefined") return "light";
  const attr = document.documentElement.getAttribute("data-theme");
  if (attr === "dark" || attr === "light") return attr;
  return "light";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  // Initialize from the DOM (the inline no-flash script already set it)
  useEffect(() => {
    setTheme(getInitialTheme());
    setMounted(true);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  };

  // Render a neutral placeholder until mounted to avoid icon-swap flash
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Schakel naar licht thema" : "Schakel naar donker thema"}
      title={isDark ? "Licht thema" : "Donker thema"}
      className="relative h-9 w-9 inline-flex items-center justify-center rounded-full bg-cream-100 hover:bg-cream-200 ring-1 ring-ink-200 transition-all hover:scale-105"
    >
      <span className="sr-only">
        {isDark ? "Licht thema" : "Donker thema"}
      </span>
      <Sun
        className={`h-4 w-4 text-ochre absolute transition-all duration-300 ${
          mounted && isDark
            ? "opacity-0 rotate-90 scale-50"
            : "opacity-100 rotate-0 scale-100"
        }`}
      />
      <Moon
        className={`h-4 w-4 text-violet absolute transition-all duration-300 ${
          mounted && isDark
            ? "opacity-100 rotate-0 scale-100"
            : "opacity-0 -rotate-90 scale-50"
        }`}
      />
    </button>
  );
}
