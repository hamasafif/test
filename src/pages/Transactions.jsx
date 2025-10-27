import React, { useState } from "react";
import { motion } from "framer-motion";

export default function Transactions() {
  const [form, setForm] = useState({
    title: "",
    amount: "",
    type: "income",
    date: "",
  });

  // 🧮 Format input ke currency IDR (dengan Rp dan pemisah ribuan)
  const formatCurrency = (value) => {
    if (!value) return "";
    // Hapus semua karakter non-angka
    const number = value.replace(/[^\d]/g, "");
    // Ubah ke format Rp
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  // 🧩 Handler perubahan input
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "amount") {
      // Saat mengetik, simpan angka mentah dan tampilkan format currency
      const rawValue = value.replace(/[^\d]/g, "");
      setForm({
        ...form,
        amount: rawValue ? formatCurrency(rawValue) : "",
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // 🧩 Handler submit form
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.title || !form.amount || !form.date) {
      alert("Mohon isi semua field sebelum menyimpan transaksi!");
      return;
    }

    const rawAmount = parseInt(form.amount.replace(/[^\d]/g, ""), 10);

    const newTransaction = {
      id: Date.now(),
      title: form.title,
      amount: rawAmount,
      type: form.type,
      date: form.date,
    };

    console.log("Transaksi Baru:", newTransaction);

    // Reset form
    setForm({
      title: "",
      amount: "",
      type: "income",
      date: "",
    });

    alert("✅ Transaksi berhasil ditambahkan (frontend mode)");
  };

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl transition-colors"
      >
        <h2 className="text-2xl font-bold mb-6 text-brightBlue dark:text-neonGreen">
          Tambah Transaksi
        </h2>

        {/* FORM INPUT */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Judul Transaksi */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Judul Transaksi
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Contoh: Gaji Bulanan"
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 
                         dark:bg-gray-800 focus:ring-2 focus:ring-brightBlue dark:focus:ring-neonGreen transition"
            />
          </div>

          {/* Nominal Transaksi */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Nominal
            </label>
            <input
              type="text"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              placeholder="Rp 0"
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 
                         dark:bg-gray-800 focus:ring-2 focus:ring-brightBlue dark:focus:ring-neonGreen transition"
            />
          </div>

          {/* Jenis Transaksi */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Jenis Transaksi
            </label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 
                         dark:bg-gray-800 focus:ring-2 focus:ring-brightBlue dark:focus:ring-neonGreen transition"
            >
              <option value="income">Pemasukan</option>
              <option value="expense">Pengeluaran</option>
            </select>
          </div>

          {/* Tanggal */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Tanggal
            </label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 
                         dark:bg-gray-800 focus:ring-2 focus:ring-brightBlue dark:focus:ring-neonGreen transition"
            />
          </div>

          {/* Tombol Simpan */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-brightBlue dark:bg-neonGreen 
                         text-white dark:text-black font-semibold py-3 rounded-lg 
                         hover:opacity-90 transition"
            >
              Simpan Transaksi
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
