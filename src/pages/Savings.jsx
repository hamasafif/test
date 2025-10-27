import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatCurrency, parseCurrency } from "../utils/currency";

export default function Savings() {
  const [savings, setSavings] = useState(() => {
    const saved = localStorage.getItem("savings");
    return saved ? JSON.parse(saved) : [];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", goal: "", current: "" });
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    localStorage.setItem("savings", JSON.stringify(savings));
  }, [savings]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.goal) {
      alert("Harap isi semua data!");
      return;
    }

    const newData = {
      ...form,
      goal: parseCurrency(form.goal),
      current: parseCurrency(form.current),
    };

    if (editingIndex !== null) {
      const updated = [...savings];
      updated[editingIndex] = newData;
      setSavings(updated);
      setEditingIndex(null);
    } else {
      setSavings((prev) => [...prev, newData]);
    }

    setForm({ name: "", goal: "", current: "" });
    setIsModalOpen(false);
  };

  const handleEdit = (index) => {
    const item = savings[index];
    setForm({
      name: item.name,
      goal: item.goal,
      current: item.current,
    });
    setEditingIndex(index);
    setIsModalOpen(true);
  };

  const handleDelete = (index) => {
    if (confirm("Yakin ingin menghapus data ini?")) {
      setSavings((prev) => prev.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="p-6 text-gray-700 dark:text-neonGreen space-y-6 relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">💰 Tabungan & Investasi</h2>
        <button
          onClick={() => {
            setForm({ name: "", goal: "", current: "" });
            setEditingIndex(null);
            setIsModalOpen(true);
          }}
          className="bg-brightBlue dark:bg-neonGreen text-white dark:text-black px-4 py-2 rounded-lg shadow hover:opacity-90 transition"
        >
          + Tambah Data
        </button>
      </div>

      {savings.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          Belum ada tabungan. Klik <strong>Tambah Data</strong> untuk mulai.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savings.map((item, index) => {
            const progress = Math.min((item.current / item.goal) * 100, 100);
            return (
              <div
                key={index}
                className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-5 relative group"
              >
                <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  Target: Rp {item.goal.toLocaleString("id-ID")}
                </p>

                <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-3 mb-2">
                  <div
                    className="h-3 rounded-full bg-green-500 dark:bg-neonGreen transition-all"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-sm">
                  Terkumpul: Rp {item.current.toLocaleString("id-ID")} (
                  {progress.toFixed(0)}%)
                </p>

                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                  <button
                    onClick={() => handleEdit(index)}
                    className="text-sm bg-yellow-400 dark:bg-yellow-500 text-black px-2 py-1 rounded-md hover:opacity-80"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className="text-sm bg-red-500 text-white px-2 py-1 rounded-md hover:opacity-80"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Input */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-xl w-full max-w-md"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h3 className="text-xl font-semibold mb-4 text-brightBlue dark:text-neonGreen">
                {editingIndex !== null ? "Edit Tabungan" : "Tambah Tabungan"}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm mb-1">Nama Tabungan</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="w-full p-2 rounded-md border dark:border-gray-700 dark:bg-gray-800
                               focus:ring-2 focus:ring-brightBlue dark:focus:ring-neonGreen outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Target (Rp)</label>
                  <input
                    type="text"
                    name="goal"
                    value={formatCurrency(form.goal)}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        goal: parseCurrency(e.target.value),
                      }))
                    }
                    className="w-full p-2 rounded-md border dark:border-gray-700 dark:bg-gray-800
                               focus:ring-2 focus:ring-brightBlue dark:focus:ring-neonGreen outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Saldo Saat Ini (Rp)</label>
                  <input
                    type="text"
                    name="current"
                    value={formatCurrency(form.current)}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        current: parseCurrency(e.target.value),
                      }))
                    }
                    className="w-full p-2 rounded-md border dark:border-gray-700 dark:bg-gray-800
                               focus:ring-2 focus:ring-brightBlue dark:focus:ring-neonGreen outline-none"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-300 hover:opacity-80 transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-brightBlue dark:bg-neonGreen text-white dark:text-black hover:opacity-90 transition"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
