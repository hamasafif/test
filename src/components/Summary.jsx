import React from "react";
import FinanceChart from "./FinanceChart";

export default function Summary({ transactions = [] }) {
  const income = transactions.filter((t) => t.type === "income");
  const expense = transactions.filter((t) => t.type === "expense");

  const totalIncome = income.reduce((sum, t) => sum + (t.amount || 0), 0);
  const totalExpense = expense.reduce((sum, t) => sum + (t.amount || 0), 0);
  const balance = totalIncome - totalExpense;

  return (
    <div className="space-y-10">
      {/* Summary Cards */}
      <div className="grid gap-6 sm:grid-cols-3">
        <div className="p-4 rounded-xl shadow-lg bg-white dark:bg-gray-900 transition-all">
          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">
            Pemasukan
          </h3>
          <p className="text-2xl font-bold text-green-500 dark:text-neonGreen mt-2">
            Rp {totalIncome.toLocaleString("id-ID")}
          </p>
        </div>

        <div className="p-4 rounded-xl shadow-lg bg-white dark:bg-gray-900 transition-all">
          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">
            Pengeluaran
          </h3>
          <p className="text-2xl font-bold text-red-500 dark:text-pink-400 mt-2">
            Rp {totalExpense.toLocaleString("id-ID")}
          </p>
        </div>

        <div className="p-4 rounded-xl shadow-lg bg-white dark:bg-gray-900 transition-all">
          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">
            Saldo
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
      </div>

      {/* Charts */}
      <FinanceChart transactions={transactions} />
    </div>
  );
}
