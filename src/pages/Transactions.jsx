import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { useTransactionUpdate } from "../context/TransactionContext";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({
    type: "income",
    category: "",
    amount: "",
    note: "",
    date: "",
  });

  const { theme } = useTheme();
  const { triggerRefresh } = useTransactionUpdate();

  const formatCurrency = (value) => {
    const number = value.replace(/\D/g, "");
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(number ? parseInt(number) : 0);
  };

  const parseCurrency = (formattedValue) =>
    parseInt(formattedValue.replace(/[^\d]/g, "")) || 0;

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      if (!token || !user) return;

      const res = await fetch(
        `http://localhost:5000/api/transactions?userId=${user.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setTransactions(data);
    } catch (err) {
      console.error("❌ Gagal mengambil transaksi:", err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      if (!token || !user) return alert("Login dulu bro!");

      const payload = {
        userId: user.id,
        type: form.type,
        category: form.category,
        amount: parseCurrency(form.amount),
        note: form.note,
        date: form.date || new Date().toISOString().split("T")[0],
      };

      const res = await fetch("http://localhost:5000/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("✅ Transaksi berhasil ditambahkan!");
        setForm({
          type: "income",
          category: "",
          amount: "",
          note: "",
          date: "",
        });
        await fetchTransactions();
        triggerRefresh();
      } else {
        const err = await res.json();
        alert("❌ Gagal menambahkan transaksi: " + err.error);
      }
    } catch (error) {
      console.error("❌ Error menambah transaksi:", error);
      alert("Terjadi kesalahan internal.");
    }
  };

  return (
    <div
      className={`p-6 min-h-screen transition-colors duration-500 ${
        theme === "dark"
          ? "bg-darkBg text-neonGreen"
          : "bg-gradient-to-br from-blue-50 via-white to-lightBg text-gray-800"
      }`}
    >
      <h2 className="text-2xl font-bold mb-6">💰 Transaksi</h2>

      <motion.form
        onSubmit={handleSubmit}
        className={`grid md:grid-cols-2 gap-4 mb-8 p-6 rounded-2xl shadow-lg border ${
          theme === "dark"
            ? "bg-darkCard border-neonGreen/30"
            : "bg-white border-gray-200"
        }`}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Fields */}
        <div>
          <label className="block mb-1 font-semibold">Jenis Transaksi</label>
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className={`w-full p-2 rounded-md border focus:ring-2 ${
              theme === "dark"
                ? "bg-darkBg border-neonGreen text-neonGreen"
                : "bg-white border-gray-300 text-gray-800"
            }`}
          >
            <option value="income">Pemasukan</option>
            <option value="expense">Pengeluaran</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-semibold">Kategori</label>
          <input
            type="text"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className={`w-full p-2 rounded-md border focus:ring-2 ${
              theme === "dark"
                ? "bg-darkBg border-neonGreen text-neonGreen"
                : "bg-white border-gray-300 text-gray-800"
            }`}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Nominal (Rp)</label>
          <input
            type="text"
            value={form.amount}
            onChange={(e) =>
              setForm({ ...form, amount: formatCurrency(e.target.value) })
            }
            className={`w-full p-2 rounded-md border focus:ring-2 ${
              theme === "dark"
                ? "bg-darkBg border-neonGreen text-neonGreen"
                : "bg-white border-gray-300 text-gray-800"
            }`}
            placeholder="Rp 0"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Tanggal</label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className={`w-full p-2 rounded-md border focus:ring-2 ${
              theme === "dark"
                ? "bg-darkBg border-neonGreen text-neonGreen"
                : "bg-white border-gray-300 text-gray-800"
            }`}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block mb-1 font-semibold">Catatan</label>
          <textarea
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
            className={`w-full p-2 rounded-md border focus:ring-2 ${
              theme === "dark"
                ? "bg-darkBg border-neonGreen text-neonGreen"
                : "bg-white border-gray-300 text-gray-800"
            }`}
            placeholder="Deskripsi transaksi..."
          ></textarea>
        </div>

        <div className="md:col-span-2 text-center mt-4">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md font-semibold shadow-md transition-all"
          >
            💾 Simpan Transaksi
          </button>
        </div>
      </motion.form>

      {/* Tabel Transaksi */}
      <div
        className={`p-6 rounded-2xl shadow-lg border ${
          theme === "dark"
            ? "bg-darkCard border-neonGreen/30"
            : "bg-white border-gray-200"
        }`}
      >
        <h3 className="text-xl font-bold mb-4">📋 Riwayat Transaksi</h3>
        {transactions.length === 0 ? (
          <p className="italic">Belum ada transaksi.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left border-b border-gray-300 dark:border-gray-700">
                <th className="py-2">Tanggal</th>
                <th>Kategori</th>
                <th>Jenis</th>
                <th>Nominal</th>
                <th>Catatan</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr
                  key={t.id}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-darkBg transition"
                >
                  <td className="py-2">{t.date}</td>
                  <td>{t.category}</td>
                  <td
                    className={
                      t.type === "income"
                        ? "text-green-400 font-semibold"
                        : "text-pink-400 font-semibold"
                    }
                  >
                    {t.type === "income" ? "Pemasukan" : "Pengeluaran"}
                  </td>
                  <td>{formatCurrency(t.amount.toString())}</td>
                  <td>{t.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
