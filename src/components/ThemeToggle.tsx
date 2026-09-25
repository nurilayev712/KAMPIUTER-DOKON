"use client";

import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className="flex items-center bg-gray-800 hover:bg-gray-700 border border-gray-700 px-3 py-1.5 rounded-full text-sm transition-all"
      title={theme === "dark" ? "Yorug' rejim" : "Qorong'i rejim"}
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4 text-yellow-400" />
      ) : (
        <Moon className="w-4 h-4 text-blue-400" />
      )}
    </button>
  );
}
