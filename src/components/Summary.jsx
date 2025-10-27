import React, { useEffect, useState } from "react";
import FinanceChart from "./FinanceChart";
import { useTheme } from "../context/ThemeContext";

export default function Summary() {
  const [transactions, setTransactions] = useState([]);
  const [totals, setTotals] = useState({ income: 0, expense: 0, balance: 0 });
  const { theme } = useTheme();
  const [isVertical, setIsVertical] = useState(false);

  // ===== Ambil data transaksi =====
  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      if (!token || !user) return;

      const res = await fetch(
        `http://localhost:5000/api/transactions?userId=${user.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error("Gagal mengambil data transaksi");
      const data = await res.json();

      if (Array.isArray(data)) {
        setTransactions(data);

        const totalIncome = data
          .filter((t) => t.type === "income")
          .reduce((acc, cur) => acc + Number(cur.amount || 0), 0);
        const totalExpense = data
          .filter((t) => t.type === "expense")
          .reduce((acc, cur) => acc + Number(cur.amount || 0), 0);

        setTotals({
          income: totalIncome,
          expense: totalExpense,
          balance: totalIncome - totalExpense,
        });
      }
    } catch (err) {
      console.error("❌ Gagal ambil data:", err);
    }
  };

  useEffect(() => {
    fetchTransactions();
    const refreshListener = () => fetchTransactions();
    window.addEventListener("transactionsUpdated", refreshListener);
    return () => window.removeEventListener("transactionsUpdated", refreshListener);
  }, []);

  // ===== Deteksi ruang sempit / overflow =====
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 950) setIsVertical(true);
      else setIsVertical(false);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const formatCurrency = (num) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num || 0);

  return (
    <div
      className={`p-6 transition-all duration-500 ${
        theme === "dark"
          ? "bg-darkBg text-neonGreen"
          : "bg-gradient-to-br from-blue-50 via-white to-lightBg text-gray-800"
      }`}
    >
      {/* ==== CARD RINGKASAN ==== */}
      <div
        className={`flex flex-wrap gap-6 mb-8 justify-center ${
          isVertical ? "flex-col items-stretch" : "flex-row"
        }`}
      >
        {/* Pemasukan */}
        <div
          className={`flex-1 min-w-[250px] p-6 rounded-2xl shadow-lg text-center transition-all ${
            theme === "dark"
              ? "bg-darkCard border border-neonGreen/30"
              : "bg-white border border-gray-200"
          }`}
        >
          <h3
            className={`text-lg font-semibold flex items-center justify-center gap-2 mb-1 ${
              theme === "dark" ? "text-neonGreen" : "text-gray-600"
            }`}
          >
            💰 Pemasukan
          </h3>
          <p
            className={`text-2xl sm:text-3xl font-extrabold ${
              theme === "dark" ? "text-neonGreen" : "text-green-600"
            } ${isVertical ? "truncate-none" : "truncate"}`}
          >
            {formatCurrency(totals.income)}
          </p>
        </div>

        {/* Pengeluaran */}
        <div
          className={`flex-1 min-w-[250px] p-6 rounded-2xl shadow-lg text-center transition-all ${
            theme === "dark"
              ? "bg-darkCard border border-pink-500/30"
              : "bg-white border border-gray-200"
          }`}
        >
          <h3
            className={`text-lg font-semibold flex items-center justify-center gap-2 mb-1 ${
              theme === "dark" ? "text-pink-400" : "text-gray-600"
            }`}
          >
            💸 Pengeluaran
          </h3>
          <p
            className={`text-2xl sm:text-3xl font-extrabold ${
              theme === "dark" ? "text-pink-400" : "text-pink-500"
            } ${isVertical ? "truncate-none" : "truncate"}`}
          >
            {formatCurrency(totals.expense)}
          </p>
        </div>

        {/* Saldo */}
        <div
          className={`flex-1 min-w-[250px] p-6 rounded-2xl shadow-lg text-center transition-all ${
            theme === "dark"
              ? "bg-darkCard border border-neonGreen/30"
              : "bg-white border border-gray-200"
          }`}
        >
          <h3
            className={`text-lg font-semibold flex items-center justify-center gap-2 mb-1 ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            🏦 Saldo
          </h3>
          <p
            className={`text-2xl sm:text-3xl font-extrabold ${
              theme === "dark" ? "text-neonGreen" : "text-emerald-500"
            } ${isVertical ? "truncate-none" : "truncate"}`}
          >
            {formatCurrency(totals.balance)}
          </p>
        </div>
      </div>

      {/* ==== CHART ==== */}
      <div
        className={`rounded-2xl shadow-xl p-4 transition-all ${
          theme === "dark"
            ? "bg-darkCard border border-neonGreen/20"
            : "bg-white border border-gray-200"
        }`}
      >
        <FinanceChart transactions={transactions} />
      </div>
    </div>
  );
}
