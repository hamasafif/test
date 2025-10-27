import { motion } from 'framer-motion';

const TransactionList = ({ transactions, onDelete }) => {
  return (
    <motion.div
      className="bg-white p-6 rounded-lg shadow-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
      {transactions.length === 0 ? (
        <p className="text-gray-500">No transactions yet. Add one above!</p>
      ) : (
        transactions.map((t) => (
          <motion.div
            key={t.id}
            className="flex justify-between items-center p-3 border-b hover:bg-gray-50 transition"
            whileHover={{ scale: 1.02 }}
          >
            <div>
              <p className={`font-semibold ${t.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                {t.type.charAt(0).toUpperCase() + t.type.slice(1)}: ${parseFloat(t.amount).toFixed(2)}
              </p>
              <p className="text-sm text-gray-500">{t.category} - {t.date}</p>
            </div>
            <button
              onClick={() => onDelete(t.id)}
              className="text-red-500 hover:text-red-700 transition"
            >
              Delete
            </button>
          </motion.div>
        ))
      )}
    </motion.div>
  );
};

export default TransactionList;