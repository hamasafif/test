import React, { useEffect, useState } from "react";
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
  Legend,
} from "recharts";
import { useTheme } from "../context/ThemeContext";

export default function FinanceChart() {
  const [transactions, setTransactions] = useState([]);
  const { theme } = useTheme();

  useEffect(() => {
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
        console.error("❌ Gagal mengambil data transaksi:", err);
      }
    };

    fetchTransactions();
  }, []);

  // Tema & warna
  const COLORS = theme === "dark" ? ["#39FF14", "#FF4D6D"] : ["#16a34a", "#dc2626"];
  const lineColorIncome = theme === "dark" ? "#39FF14" : "#16a34a";
  const lineColorExpense = theme === "dark" ? "#FF4D6D" : "#dc2626";
  const textColor = theme === "dark" ? "#a3e635" : "#111827";
  const gridColor = theme === "dark" ? "#374151" : "#e5e7eb";

  // Data bulanan
  const monthlyData = Array.from({ length: 12 }, (_, i) => ({
    month: new Date(0, i).toLocaleString("id-ID", { month: "short" }),
    income: 0,
    expense: 0,
  }));

  transactions.forEach((t) => {
    const month = new Date(t.date).getMonth();
    const amount = Number(t.amount);
    if (t.type === "income") monthlyData[month].income += amount;
    if (t.type === "expense") monthlyData[month].expense += amount;
  });

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const pieData = [
    { name: "Pemasukan", value: totalIncome },
    { name: "Pengeluaran", value: totalExpense },
  ];

  return (
    <div className="grid md:grid-cols-2 gap-6 mt-6">
      {/* LINE CHART */}
      <div
        className={`p-5 rounded-2xl shadow-lg transition-all ${
          theme === "dark"
            ? "bg-darkCard text-neonGreen"
            : "bg-white text-gray-800"
        }`}
      >
        <h3
          className={`text-lg font-bold mb-4 ${
            theme === "dark" ? "text-neonGreen" : "text-blue-700"
          }`}
        >
          📈 Tren Keuangan Bulanan
        </h3>

        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={monthlyData}>
            <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
            <XAxis dataKey="month" stroke={textColor} />
            <YAxis stroke={textColor} />
            <Tooltip
              contentStyle={{
                backgroundColor: theme === "dark" ? "#0f172a" : "#fff",
                border: "none",
                borderRadius: "8px",
                color: textColor,
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="income"
              stroke={lineColorIncome}
              strokeWidth={2}
              dot={{ fill: lineColorIncome }}
              name="Pemasukan"
            />
            <Line
              type="monotone"
              dataKey="expense"
              stroke={lineColorExpense}
              strokeWidth={2}
              dot={{ fill: lineColorExpense }}
              name="Pengeluaran"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* PIE CHART */}
      <div
        className={`p-5 rounded-2xl shadow-lg transition-all ${
          theme === "dark"
            ? "bg-darkCard text-neonGreen"
            : "bg-white text-gray-800"
        }`}
      >
        <h3
          className={`text-lg font-bold mb-4 ${
            theme === "dark" ? "text-neonGreen" : "text-blue-700"
          }`}
        >
          📊 Proporsi Keuangan
        </h3>

        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={90}
              label
            >
              {pieData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: theme === "dark" ? "#0f172a" : "#fff",
                border: "none",
                borderRadius: "8px",
                color: textColor,
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
