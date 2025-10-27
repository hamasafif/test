import React, { useState, useContext } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import * as XLSX from "xlsx";
import { ThemeContext } from "../context/ThemeContext";
import { motion } from "framer-motion";

export default function Reports() {
  const { theme } = useContext(ThemeContext);
  const [reportData, setReportData] = useState([
    { month: "Jan", income: 5000000, expense: 3000000 },
    { month: "Feb", income: 7000000, expense: 3500000 },
    { month: "Mar", income: 6500000, expense: 4000000 },
    { month: "Apr", income: 8000000, expense: 5000000 },
    { month: "Mei", income: 7500000, expense: 3000000 },
  ]);

  const [selectedMonth, setSelectedMonth] = useState("2025-05");

  // 📥 IMPORT EXCEL
  const handleImportExcel = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = evt.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet);

      const formatted = json.map((r) => ({
        month: r.Bulan || r.Month || "-",
        income: parseInt(r.Pemasukan || r.Income || 0),
        expense: parseInt(r.Pengeluaran || r.Expense || 0),
      }));

      setReportData(formatted);
    };

    reader.readAsBinaryString(file);
  };

  // 📤 EXPORT EXCEL
  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(reportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Laporan Keuangan");
    XLSX.writeFile(wb, "laporan_keuangan.xlsx");
  };

  // 💰 Hitung total
  const totalIncome = reportData.reduce((sum, d) => sum + d.income, 0);
  const totalExpense = reportData.reduce((sum, d) => sum + d.expense, 0);
  const balance = totalIncome - totalExpense;

  const pieData = [
    { name: "Pemasukan", value: totalIncome },
    { name: "Pengeluaran", value: totalExpense },
  ];

  const colors =
    theme === "dark"
      ? ["#39FF14", "#FF6B6B"]
      : ["#00AEEF", "#FF9F40"];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-brightBlue dark:text-neonGreen">
          Laporan Keuangan
        </h2>

        {/* Filter + Import/Export */}
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="p-3 rounded-lg border dark:border-gray-700 dark:bg-gray-800 
                       focus:outline-none focus:ring-2 focus:ring-brightBlue dark:focus:ring-neonGreen transition"
          />

          {/* Import */}
          <label
            htmlFor="fileInput"
            className="cursor-pointer bg-brightBlue dark:bg-neonGreen 
                       text-white dark:text-black font-semibold px-4 py-2 rounded-lg 
                       hover:opacity-90 transition"
          >
            📂 Import Excel
          </label>
          <input
            id="fileInput"
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleImportExcel}
            className="hidden"
          />

          {/* Export */}
          <button
            onClick={handleExportExcel}
            className="bg-green-500 dark:bg-[#39FF14] text-white dark:text-black 
                       font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition"
          >
            💾 Export Excel
          </button>
          {/* Download Template */}
<button
  onClick={() => {
    const template = [
      {
        Bulan: "Jan",
        Tanggal: "2025-01-10",
        Kategori: "Gaji",
        Deskripsi: "Gaji Bulanan",
        Pemasukan: 5000000,
        Pengeluaran: 0,
      },
      {
        Bulan: "Jan",
        Tanggal: "2025-01-12",
        Kategori: "Makanan",
        Deskripsi: "Sarapan & makan siang",
        Pemasukan: 0,
        Pengeluaran: 85000,
      },
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template Laporan");
    XLSX.writeFile(wb, "template_laporan_keuangan.xlsx");
  }}
  className="bg-yellow-500 dark:bg-yellow-400 text-white dark:text-black 
             font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition"
>
  📄 Template Excel
</button>

        </div>
      </div>

      {/* Ringkasan */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="grid sm:grid-cols-3 gap-6"
      >
        <div className="p-5 rounded-xl shadow-lg bg-white dark:bg-gray-900 transition">
          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">
            Total Pemasukan
          </h3>
          <p className="text-2xl font-bold text-green-600 dark:text-neonGreen mt-2">
            Rp {totalIncome.toLocaleString("id-ID")}
          </p>
        </div>

        <div className="p-5 rounded-xl shadow-lg bg-white dark:bg-gray-900 transition">
          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">
            Total Pengeluaran
          </h3>
          <p className="text-2xl font-bold text-red-500 dark:text-pink-400 mt-2">
            Rp {totalExpense.toLocaleString("id-ID")}
          </p>
        </div>

        <div className="p-5 rounded-xl shadow-lg bg-white dark:bg-gray-900 transition">
          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">
            Saldo Bersih
          </h3>
          <p
            className={`text-2xl font-bold mt-2 ${
              balance >= 0
                ? "text-green-600 dark:text-neonGreen"
                : "text-red-500 dark:text-pink-400"
            }`}
          >
            Rp {balance.toLocaleString("id-ID")}
          </p>
        </div>
      </motion.div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-10">
        {/* Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6"
        >
          <h3 className="text-lg font-semibold mb-4 text-brightBlue dark:text-neonGreen">
            Perbandingan Bulanan
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reportData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={theme === "dark" ? "#333" : "#ddd"}
              />
              <XAxis
                dataKey="month"
                stroke={theme === "dark" ? "#aaa" : "#333"}
              />
              <YAxis stroke={theme === "dark" ? "#aaa" : "#333"} />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme === "dark" ? "#111" : "#fff",
                  border: "none",
                  color: theme === "dark" ? "#39FF14" : "#00AEEF",
                }}
              />
              <Legend />
              <Bar dataKey="income" fill={colors[0]} name="Pemasukan" />
              <Bar dataKey="expense" fill={colors[1]} name="Pengeluaran" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6"
        >
          <h3 className="text-lg font-semibold mb-4 text-brightBlue dark:text-neonGreen">
            Komposisi Keuangan
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: theme === "dark" ? "#111" : "#fff",
                  border: "none",
                  color: theme === "dark" ? "#39FF14" : "#00AEEF",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}
