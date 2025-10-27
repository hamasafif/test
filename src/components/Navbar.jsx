// Navbar.jsx
import React from "react";
import { useTheme } from "../context/ThemeContext"; // ✅ perbaikan di sini

export default function Navbar({ onMenuClick }) {
  const { theme, toggleTheme } = useTheme(); // ✅ gunakan hook
  
  return (
    <nav
      className={`flex justify-between items-center px-6 py-3 shadow-md transition-colors duration-500 ${
        theme === "dark"
          ? "bg-darkCard text-neonGreen"
          : "bg-white text-gray-800"
      }`}
    >
      <button
        onClick={onMenuClick}
        className="md:hidden text-2xl focus:outline-none"
      >
        ☰
      </button>
      <h1 className="text-xl font-bold tracking-wide">Finance Manager 💸</h1>
      <button
        onClick={toggleTheme}
        className={`rounded-full px-4 py-1 font-semibold transition-all duration-300 ${
          theme === "dark"
            ? "bg-neonGreen text-darkBg hover:bg-green-400"
            : "bg-gray-800 text-white hover:bg-gray-700"
        }`}
      >
        {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
      </button>
    </nav>
  );
}
