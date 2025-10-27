import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext.jsx";
import { Sun, Moon, Menu } from "lucide-react";

export default function Navbar({ onMenuClick }) {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <nav
      className="flex items-center justify-between px-6 py-4 
      bg-white/90 backdrop-blur-sm shadow-soft
      dark:bg-darkBg dark:text-neonGreen text-brightBlue
      transition-all duration-300"
    >
      <div className="flex items-center gap-3">
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          onClick={onMenuClick}
        >
          <Menu size={22} />
        </button>
        <h1 className="text-xl font-semibold tracking-wide">
          💰 Pengelola Keuangan
        </h1>
      </div>

      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-brightBlue text-white 
        dark:bg-neonGreen dark:text-black transition-all duration-300 hover:opacity-90"
      >
        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        <span className="hidden sm:inline">
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </span>
      </button>
    </nav>
  );
}
