import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Reports = ({ transactions, setFilteredTransactions, filteredTransactions }) => {
  const [categoryFilter, setCategoryFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    let filtered = transactions;
    if (categoryFilter) {
      filtered = filtered.filter(t => t.category === categoryFilter);
    }
    if (startDate) {
      filtered = filtered.filter(t => new Date(t.date) >= new Date(startDate));
    }
    if (endDate) {
      filtered = filtered.filter(t => new Date(t.date) <= new Date(endDate));
    }
    setFilteredTransactions(filtered);
  }, [transactions, categoryFilter, startDate, endDate, setFilteredTransactions]);

  const exportToCSV = () => {
    const csvContent = [
      ['ID', 'Tipe', 'Jumlah', 'Kategori', 'Tanggal'],
      ...filteredTransactions.map(t => [t.id, t.type, t.amount, t.category, t.date])
    ].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'laporan_transaksi.csv';
    a.click();
  };

  const totalIncome = filteredTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
  const totalExpenses = filteredTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
  const balance = totalIncome - totalExpenses;

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-colors duration-300"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Laporan Transaksi</h2>

      {/* Filter */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border p-2 rounded w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        >
          <option value="">Semua Kategori</option>
          <option>Food</option>
          <option>Transport</option>
          <option>Salary</option>
          <option>Entertainment</option>
          <option>Utilities</option>
          <option>Other</option>
        </select>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border p-2 rounded w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          placeholder="Tanggal Mulai"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border p-2 rounded w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          placeholder="Tanggal Akhir"
        />
      </div>

      {/* Ringkasan Terfilter */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-green-500">Rp{totalIncome.toLocaleString()}</h3>
          <p className="text-gray-600 dark:text-gray-300">Pemasukan Terfilter</p>
        </div>
        <div className="text-center">
          <h3 className="text-2xl font-bold text-red-500">Rp{totalExpenses.toLocaleString()}</h3>
          <p className="text-gray-600 dark:text-gray-300">Pengeluaran Terfilter</p>
        </div>
        <div className="text-center">
          <h3 className={`text-2xl font-bold ${balance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            Rp{balance.toLocaleString()}
          </h3>
          <p className="text-gray-600 dark:text-gray-300">Saldo Terfilter</p>
        </div>
      </div>

      {/* Tombol Export */}
      <button
        onClick={exportToCSV}
        className="bg-blue-500 text-white p-2 rounded mb-4 hover:bg-blue-600 transition"
      >
        Ekspor ke CSV
      </button>

      {/* Daftar Transaksi Terfilter */}
      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded">
        <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">Transaksi Terfilter</h3>
        {filteredTransactions.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">Tidak ada transaksi yang cocok dengan filter.</p>
        ) : (
          <ul className="space-y-2">
            {filteredTransactions.map((t) => (
              <li key={t.id} className="flex justify-between p-2 bg-white dark:bg-gray-600 rounded">
                <span className={`font-semibold ${t.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                  {t.type}: Rp{t.amount}
                </span>
                <span className="text-gray-600 dark:text-gray-300">{t.category} - {t.date}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
};

export default Reports;