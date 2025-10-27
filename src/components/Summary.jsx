import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Summary = ({ transactions }) => {
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
  const balance = income - expenses;

  // Data untuk pie chart (distribusi pengeluaran berdasarkan kategori)
  const expenseCategories = {};
  transactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      expenseCategories[t.category] = (expenseCategories[t.category] || 0) + parseFloat(t.amount || 0);
    });
  const pieData = Object.keys(expenseCategories).map(key => ({
    name: key,
    value: expenseCategories[key],
  }));
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  // Data untuk bar chart (income vs expense)
  const barData = [
    { name: 'Income', amount: income },
    { name: 'Expenses', amount: expenses },
  ];

  return (
    <motion.div
      className="bg-white p-6 rounded-lg shadow-md mb-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-semibold mb-4">Ringkasan Keuangan</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-green-500">Rp{income.toLocaleString()}</h3>
          <p className="text-gray-600">Total Pemasukan</p>
        </div>
        <div className="text-center">
          <h3 className="text-2xl font-bold text-red-500">Rp{expenses.toLocaleString()}</h3>
          <p className="text-gray-600">Total Pengeluaran</p>
        </div>
        <div className="text-center">
          <h3 className={`text-2xl font-bold ${balance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            Rp{balance.toLocaleString()}
          </h3>
          <p className="text-gray-600">Saldo</p>
        </div>
      </div>

      {/* Diagram */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Distribusi Pengeluaran</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `Rp${value.toLocaleString()}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Perbandingan Pemasukan vs Pengeluaran</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `Rp${value.toLocaleString()}`} />
              <Legend />
              <Bar dataKey="amount" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
};

export default Summary;