import { useState } from 'react';
import { motion } from 'framer-motion';

const TransactionForm = ({ onAdd }) => {
  const [form, setForm] = useState({ type: 'income', amount: '', category: 'Food', date: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.amount || !form.date) return;
    onAdd(form);
    setForm({ ...form, amount: '', date: '' });
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md mb-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-semibold mb-4">Add Transaction</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <input
          type="number"
          placeholder="Amount (e.g., 100.00)"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option>Food</option>
          <option>Transport</option>
          <option>Salary</option>
          <option>Entertainment</option>
          <option>Utilities</option>
          <option>Other</option>
        </select>
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white p-2 rounded w-full mt-4 hover:bg-blue-600 transition duration-200"
      >
        Add Transaction
      </button>
    </motion.form>
  );
};

export default TransactionForm;