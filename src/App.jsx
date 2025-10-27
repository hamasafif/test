import { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Summary from './components/Summary';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import Reports from './components/Reports'; // Import komponen baru

function App() {
  const [transactions, setTransactions] = useState([]);
  const [activePage, setActivePage] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [filteredTransactions, setFilteredTransactions] = useState([]); // Untuk filter di laporan

  useEffect(() => {
    const saved = localStorage.getItem('transactions');
    if (saved) setTransactions(JSON.parse(saved));

    const savedMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedMode);
    if (savedMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('darkMode', newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const addTransaction = (transaction) => {
    setTransactions([...transactions, { ...transaction, id: Date.now() }]);
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const renderContent = () => {
    if (activePage === 'dashboard') {
      return (
        <div className="p-6">
          <Summary transactions={transactions} />
        </div>
      );
    } else if (activePage === 'transactions') {
      return (
        <div className="p-6">
          <TransactionForm onAdd={addTransaction} />
          <TransactionList transactions={transactions} onDelete={deleteTransaction} />
        </div>
      );
    } else if (activePage === 'reports') {
      return (
        <div className="p-6">
          <Reports transactions={transactions} setFilteredTransactions={setFilteredTransactions} filteredTransactions={filteredTransactions} />
        </div>
      );
    }
    return <div className="p-6">Halaman tidak ditemukan.</div>;
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex transition-colors duration-300">
      <Sidebar setActivePage={setActivePage} activePage={activePage} />
      <div className="flex-1 flex flex-col">
        <Header toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
        <main className="flex-1">{renderContent()}</main>
      </div>
    </div>
  );
}

export default App;