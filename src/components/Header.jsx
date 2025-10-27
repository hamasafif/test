import { motion } from 'framer-motion';

const Header = ({ toggleDarkMode, isDarkMode }) => {
  return (
    <motion.header
      className="bg-white dark:bg-gray-800 shadow-md p-4 flex justify-between items-center transition-colors duration-300"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Pengelola Keuangan</h1>
      <div className="flex items-center space-x-4">
        <span className="text-gray-600 dark:text-gray-300">Selamat datang!</span>
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? '☀️' : '🌙'} {/* ☀️ untuk light mode, 🌙 untuk dark mode */}
        </button>
      </div>
    </motion.header>
  );
};

export default Header;
