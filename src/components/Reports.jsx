// src/components/Reports.jsx
import React, { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useTheme } from "../context/ThemeContext"; // ✅ pakai hook, bukan ThemeContext
import FinanceChart from "../components/FinanceChart";

export default function Reports() {
  const { theme } = useTheme(); // ✅ ambil theme dari context
  const [transactions, setTransactions] = useState([]);

  // 🔹 Template Excel sesuai struktur database
  const templateData = [
    {
      Tanggal: "2025-10-01",
      Kategori: "Gaji",
      Tipe: "income",
      Nominal: 5000000,
      Catatan: "Gaji Bulan Oktober",
    },
    {
      Tanggal: "2025-10-02",
      Kategori: "Makan",
      Tipe: "expense",
      Nominal: 25000,
      Catatan: "Sarapan di warung",
    },
  ];

  // 🔹 Download Template Excel
  const handleDownloadTemplate = () => {
    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "Template_Laporan_Transaksi.xlsx");
  };

  // 🔹 Format angka jadi Rupiah
  const formatCurrency = (num) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(num);

  // 🔹 Import data Excel
  const handleImportExcel = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet);

      const validData = json.map((row, index) => ({
        id: index + 1,
        date: row["Tanggal"] || "",
        category: row["Kategori"] || "",
        type: row["Tipe"] || "",
        amount: row["Nominal"] || 0,
        note: row["Catatan"] || "",
      }));

      setTransactions(validData);
    };

    reader.readAsArrayBuffer(file);
  };

  // 🔹 Export data laporan ke Excel
  const handleExportExcel = () => {
    if (transactions.length === 0) {
      alert("Tidak ada data untuk diexport!");
      return;
    }

    const exportData = transactions.map((t) => ({
      Tanggal: t.date,
      Kategori: t.category,
      Tipe: t.type,
      Nominal: t.amount,
      Catatan: t.note,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan_Transaksi");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "Laporan_Transaksi.xlsx");
  };

  // 🔹 Upload data hasil import ke backend
  const handleUploadToServer = async () => {
    if (transactions.length === 0) {
      alert("Tidak ada data untuk diupload!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/transactions/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ transactions }),
      });

      const result = await response.json();
      if (response.ok) {
        alert(`✅ ${result.message}`);
      } else {
        alert(`❌ Upload gagal: ${result.error || "Terjadi kesalahan."}`);
      }
    } catch (error) {
      console.error("❌ Upload Error:", error);
      alert("Terjadi kesalahan saat upload data.");
    }
  };

  return (
    <div
      className={`p-6 transition-colors duration-500 ${
        theme === "dark"
          ? "bg-darkBg text-neonGreen"
          : "bg-lightBg text-gray-800"
      }`}
    >
      <h2 className="text-2xl font-bold mb-4">📑 Laporan Transaksi</h2>
      <p className="mb-6 text-gray-600 dark:text-gray-400">
        Unduh template Excel, isi datanya, lalu import kembali untuk melihat laporanmu.  
        Kamu juga bisa upload ke server dan export hasil laporan ke Excel.
      </p>

      {/* Tombol Aksi */}
      <div className="flex flex-wrap gap-4 mb-6">
        <button
          onClick={handleDownloadTemplate}
          className="bg-brightBlue hover:bg-blue-600 dark:bg-neonGreen dark:hover:bg-green-400
                     text-white dark:text-black px-4 py-2 rounded-lg font-semibold transition-all"
        >
          📥 Download Template
        </button>

        <label
          className="bg-gray-300 hover:bg-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700
                     text-gray-800 dark:text-white px-4 py-2 rounded-lg font-semibold cursor-pointer"
        >
          📤 Import Excel
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleImportExcel}
            className="hidden"
          />
        </label>

        <button
          onClick={handleUploadToServer}
          className="bg-purple-500 hover:bg-purple-600 text-white dark:text-black
                     px-4 py-2 rounded-lg font-semibold transition-all"
        >
          ☁️ Upload ke Server
        </button>

        <button
          onClick={handleExportExcel}
          className="bg-green-500 hover:bg-green-600 text-white dark:text-black
                     px-4 py-2 rounded-lg font-semibold transition-all"
        >
          💾 Export Excel
        </button>
      </div>

      {/* Tabel + Chart */}
      {transactions.length > 0 ? (
        <>
          <div className="overflow-x-auto rounded-xl shadow-md border dark:border-gray-700">
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-200 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-2 border dark:border-gray-700">#</th>
                  <th className="px-4 py-2 border dark:border-gray-700">Tanggal</th>
                  <th className="px-4 py-2 border dark:border-gray-700">Kategori</th>
                  <th className="px-4 py-2 border dark:border-gray-700">Tipe</th>
                  <th className="px-4 py-2 border dark:border-gray-700">Nominal</th>
                  <th className="px-4 py-2 border dark:border-gray-700">Catatan</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t, i) => (
                  <tr
                    key={i}
                    className={`text-center ${
                      t.type === "income"
                        ? "bg-green-50 dark:bg-green-900/30"
                        : "bg-red-50 dark:bg-red-900/30"
                    }`}
                  >
                    <td className="border px-4 py-2 dark:border-gray-700">{i + 1}</td>
                    <td className="border px-4 py-2 dark:border-gray-700">{t.date}</td>
                    <td className="border px-4 py-2 dark:border-gray-700">{t.category}</td>
                    <td className="border px-4 py-2 dark:border-gray-700 font-semibold">
                      {t.type === "income" ? "Pemasukan 💰" : "Pengeluaran 💸"}
                    </td>
                    <td className="border px-4 py-2 dark:border-gray-700">
                      {formatCurrency(t.amount)}
                    </td>
                    <td className="border px-4 py-2 dark:border-gray-700">{t.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Chart */}
          <div className="mt-10">
            <h3 className="text-xl font-bold mb-4 text-brightBlue dark:text-neonGreen">
              📊 Analisis Visual
            </h3>
            <FinanceChart transactions={transactions} />
          </div>
        </>
      ) : (
        <p className="text-gray-600 dark:text-gray-400 mt-4 italic">
          Belum ada data laporan. Silakan import file Excel terlebih dahulu.
        </p>
      )}
    </div>
  );
}
