import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatCurrency, parseCurrency } from "../utils/currency";

export default function Goals() {
  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem("goals");
    return saved ? JSON.parse(saved) : [];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", target: "", saved: "", deadline: "" });
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    localStorage.setItem("goals", JSON.stringify(goals));
  }, [goals]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.target) return alert("Isi semua data dulu ya!");

    const newData = {
      ...form,
      target: parseCurrency(form.target),
      saved: parseCurrency(form.saved),
    };

    if (editingIndex !== null) {
      const updated = [...goals];
      updated[editingIndex] = newData;
      setGoals(updated);
      setEditingIndex(null);
    } else {
      setGoals((prev) => [...prev, newData]);
    }

    setForm({ name: "", target: "", saved: "", deadline: "" });
    setIsModalOpen(false);
  };

  const handleEdit = (index) => {
    const g = goals[index];
    setForm({
      name: g.name,
      target: g.target,
      saved: g.saved,
      deadline: g.deadline,
    });
    setEditingIndex(index);
    setIsModalOpen(true);
  };

  const handleDelete = (index) => {
    if (confirm("Yakin ingin menghapus tujuan ini?")) {
      setGoals((prev) => prev.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="p-6 text-gray-700 dark:text-neonGreen space-y-6 relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">🎯 Tujuan Keuangan</h2>
        <button
          onClick={() => {
            setForm({ name: "", target: "", saved: "", deadline: "" });
            setEditingIndex(null);
            setIsModalOpen(true);
          }}
          className="bg-brightBlue dark:bg-neonGreen text-white dark:text-black px-4 py-2 rounded-lg shadow hover:opacity-90 transition"
        >
          + Tambah Tujuan
        </button>
      </div>

      {goals.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          Belum ada tujuan keuangan. Klik <strong>Tambah Tujuan</strong> untuk mulai.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal, index) => {
            const progress = Math.min((goal.saved / goal.target) * 100, 100);
            return (
              <div
                key={index}
                className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-5 relative group"
              >
                <h3 className="text-lg font-semibold mb-2">{goal.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  Target: Rp {goal.target.toLocaleString("id-ID")} — Tahun {goal.deadline}
                </p>
                <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-3 mb-2">
                  <div
                    className={`h-3 rounded-full ${
                      progress >= 100 ? "bg-green-500" : "bg-brightBlue dark:bg-neonGreen"
                    }`}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-sm">
                  Terkumpul: Rp {goal.saved.toLocaleString("id-ID")} ({progress.toFixed(0)}%)
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

      {/* Modal */}
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
                {editingIndex !== null ? "Edit Tujuan" : "Tambah Tujuan Keuangan"}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm mb-1">Nama Tujuan</label>
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
                    name="target"
                    value={formatCurrency(form.target)}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        target: parseCurrency(e.target.value),
                      }))
                    }
                    className="w-full p-2 rounded-md border dark:border-gray-700 dark:bg-gray-800
                               focus:ring-2 focus:ring-brightBlue dark:focus:ring-neonGreen outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Terkumpul (Rp)</label>
                  <input
                    type="text"
                    name="saved"
                    value={formatCurrency(form.saved)}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        saved: parseCurrency(e.target.value),
                      }))
                    }
                    className="w-full p-2 rounded-md border dark:border-gray-700 dark:bg-gray-800
                               focus:ring-2 focus:ring-brightBlue dark:focus:ring-neonGreen outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Deadline (Tahun)</label>
                  <input
                    type="number"
                    name="deadline"
                    value={form.deadline}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, deadline: e.target.value }))
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
