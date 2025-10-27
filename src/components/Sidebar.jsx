// src/components/Sidebar.jsx
import React, { useEffect, useState } from "react";

export default function Sidebar({ setActivePage, activePage, onClose }) {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUsername(storedUser.username);
    }
  }, []);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Yakin ingin logout?");
    if (confirmLogout) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
  };

  const menuItems = [
    { key: "dashboard", label: "📊 Dashboard" },
    { key: "transactions", label: "💸 Transaksi" },
    { key: "reports", label: "📑 Laporan" },
    { key: "budget", label: "💰 Anggaran" },
    { key: "savings", label: "🏦 Tabungan" },
    { key: "goals", label: "🎯 Tujuan" },
  ];

  return (
    <div
      className="fixed md:static left-0 top-0 h-full w-64 bg-white dark:bg-gray-900 shadow-lg z-50
                 flex flex-col justify-between transition-transform duration-300"
    >
      {/* Bagian Atas: Profil dan Menu */}
      <div>
        {/* Header Sidebar */}
        <div className="flex items-center justify-between p-4 border-b border-gray-300 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-800 dark:text-neonGreen">Menu</h2>
          <button
            className="md:hidden text-gray-600 dark:text-gray-300 text-xl"
            onClick={onClose}
          >
            ✖
          </button>
        </div>

        {/* Profil Pengguna */}
        <div className="p-4 border-b border-gray-300 dark:border-gray-700">
          <p className="text-gray-700 dark:text-gray-300 text-sm">
            Halo,{" "}
            <span className="font-bold text-brightBlue dark:text-neonGreen">
              {username}
            </span>
          </p>
        </div>

        {/* Daftar Menu */}
        <ul className="p-4 space-y-2">
          {menuItems.map((item) => (
            <li key={item.key}>
              <button
                onClick={() => {
                  setActivePage(item.key);
                  if (onClose) onClose();
                }}
                className={`w-full text-left px-4 py-2 rounded-lg font-medium transition-colors duration-300 flex items-center gap-2 ${
                  activePage === item.key
                    ? "bg-brightBlue text-white dark:bg-neonGreen dark:text-black"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
                }`}
              >
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Bagian Bawah: Tombol Logout */}
      <div className="p-4 border-t border-gray-300 dark:border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-semibold transition"
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );
}
