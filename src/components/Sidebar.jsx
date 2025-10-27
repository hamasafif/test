import { motion } from "framer-motion";

const Sidebar = ({ setActivePage, activePage, onClose }) => {
  // 🔹 Struktur menu modular
  const menuSections = [
    {
      title: "Main",
      items: [
        { name: "Dashboard", key: "dashboard", icon: "📊" },
        { name: "Transaksi", key: "transactions", icon: "💸" },
        { name: "Laporan", key: "reports", icon: "📈" },
      ],
    },
    {
      title: "Keuangan",
      items: [
        { name: "Anggaran", key: "budget", icon: "🧾" },
        { name: "Tabungan", key: "savings", icon: "💰" },
        { name: "Tujuan", key: "goals", icon: "🎯" },
      ],
    },
  ];

  return (
    <motion.aside
      className="
        bg-white dark:bg-gray-900 
        shadow-xl md:shadow-md 
        border-r border-gray-200 dark:border-gray-700
        flex flex-col
        p-6
        transition-all duration-300

        fixed md:relative top-0 left-0 z-50 md:z-0
        w-3/4 sm:w-2/3 md:w-64
        h-full md:h-screen
      "
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {/* Header Sidebar (mobile only) */}
      <div className="flex justify-between items-center mb-6 md:hidden">
        <h2 className="text-xl font-bold text-brightBlue dark:text-neonGreen">
          Menu
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 dark:text-gray-300 text-2xl font-bold"
        >
          ✕
        </button>
      </div>

      {/* Menu Sections */}
      <nav className="flex-1 overflow-y-auto space-y-6">
        {menuSections.map((section, idx) => (
          <div key={idx}>
            <p className="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 mb-2">
              {section.title}
            </p>
            <ul className="space-y-2">
              {section.items.map((item) => (
                <li key={item.key}>
                  <button
                    onClick={() => {
                      setActivePage(item.key);
                      if (onClose) onClose();
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg text-base transition-all duration-200 ${
                      activePage === item.key
                        ? "bg-brightBlue text-white dark:bg-neonGreen dark:text-black shadow-md"
                        : "text-gray-700 dark:text-gray-300 hover:bg-softYellow dark:hover:bg-gray-800"
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>

            {/* Divider antara section */}
            {idx === 0 && (
              <hr className="my-4 border-gray-200 dark:border-gray-700" />
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="pt-4 mt-auto border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
        <p>v1.0 — Keuangan App</p>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
