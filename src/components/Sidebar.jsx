import { motion } from 'framer-motion';

const Sidebar = ({ setActivePage, activePage }) => {
  const menuItems = [
    { name: 'Dashboard', key: 'dashboard' },
    { name: 'Transaksi', key: 'transactions' },
    { name: 'Laporan', key: 'reports' }, // Menu baru
  ];

  return (
    <motion.aside
      className="w-64 bg-white dark:bg-gray-800 shadow-md min-h-screen p-4 transition-colors duration-300"
      initial={{ x: -250, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-100">Menu</h2>
      <ul className="space-y-2">
        {menuItems.map((item) => (
          <li key={item.key}>
            <button
              onClick={() => setActivePage(item.key)}
              className={`w-full text-left p-3 rounded-lg transition ${
                activePage === item.key
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {item.name}
            </button>
          </li>
        ))}
      </ul>
    </motion.aside>
  );
};

export default Sidebar;