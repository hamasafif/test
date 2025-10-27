import React, { useContext } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { ThemeContext } from "../context/ThemeContext";

export default function FinanceChart({ transactions = [] }) {
  const { theme } = useContext(ThemeContext);

  // Contoh data sementara (kalau belum ada transaksi)
  const sampleData =
    transactions.length > 0
      ? transactions
      : [
          { date: "Jan", income: 5000000, expense: 2000000 },
          { date: "Feb", income: 7000000, expense: 3000000 },
          { date: "Mar", income: 6000000, expense: 3500000 },
          { date: "Apr", income: 8000000, expense: 4000000 },
          { date: "Mei", income: 7500000, expense: 2500000 },
        ];

  const totalIncome = sampleData.reduce((sum, t) => sum + t.income, 0);
  const totalExpense = sampleData.reduce((sum, t) => sum + t.expense, 0);

  const pieData = [
    { name: "Pemasukan", value: totalIncome },
    { name: "Pengeluaran", value: totalExpense },
  ];

  const colors =
    theme === "dark"
      ? ["#39FF14", "#FF6B6B"]
      : ["#00AEEF", "#FF9F40"];

  return (
    <div className="grid md:grid-cols-2 gap-8 mt-10">
      {/* Line Chart */}
      <div className="bg-white dark:bg-gray-900 shadow-md rounded-xl p-6 transition-all">
        <h3 className="text-lg font-semibold mb-4 text-brightBlue dark:text-neonGreen">
          Tren Keuangan Bulanan
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={sampleData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={theme === "dark" ? "#333" : "#ddd"}
            />
            <XAxis dataKey="date" stroke={theme === "dark" ? "#aaa" : "#333"} />
            <YAxis stroke={theme === "dark" ? "#aaa" : "#333"} />
            <Tooltip
              contentStyle={{
                backgroundColor: theme === "dark" ? "#111" : "#fff",
                border: "none",
                color: theme === "dark" ? "#39FF14" : "#00AEEF",
              }}
            />
            <Line
              type="monotone"
              dataKey="income"
              stroke={colors[0]}
              strokeWidth={3}
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="expense"
              stroke={colors[1]}
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart */}
      <div className="bg-white dark:bg-gray-900 shadow-md rounded-xl p-6 transition-all">
        <h3 className="text-lg font-semibold mb-4 text-brightBlue dark:text-neonGreen">
          Proporsi Keuangan
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
      </div>
    </div>
  );
}
