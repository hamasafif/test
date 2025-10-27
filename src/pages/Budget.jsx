import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatCurrency, parseCurrency } from "../utils/currency";


export default function Budget() {
  const [budgets, setBudgets] = useState(() => {
    const saved = localStorage.getItem("budgets");
    return saved ? JSON.parse(saved) : [];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [form, setForm] = useState({ category: "", limit: "", used: 0 });

  // 💾 Simpan otomatis ke localStorage
  useEffect(() => {
    localStorage.setItem("budgets", JSON.stringify(budgets));
  }, [budgets]);

  // 🧩 Handler Input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 🧩 Simpan data baru / edit data
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.category || !form.limit) {
      alert("Harap isi semua data!");
      return;
    }

    if (editingIndex !== null) {
      // mode edit
      const updated = [...budgets];
      updated[editingIndex] = {
        ...form,
        limit: parseInt(form.limit),
        used: parseInt(form.used || 0),
      };
      setBudgets(updated);
      setEditingIndex(null);
    } else {
      // mode tambah
      setBudgets((prev) => [
        ...prev,
        { ...form, limit: parseInt(form.limit), used: parseInt(form.used || 0) },
      ]);
    }

    setForm({ category: "", limit: "", used: 0 });
    setIsModalOpen(false);
  };

  // 🗑️ Hapus data
  const handleDelete = (index) => {
    if (confirm("Yakin ingin menghapus data ini?")) {
      setBudgets((prev) => prev.filter((_, i) => i !== index));
    }
  };

  // ✏️ Edit data
  const handleEdit = (index) => {
    setEditingIndex(index);
    setForm(budgets[index]);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 text-gray-700 dark:text-neonGreen space-y-6 relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">🧾 Rencana Anggaran</h2>
        <button
          onClick={() => {
            setForm({ category: "", limit: "", used: 0 });
            setEditingIndex(null);
            setIsModalOpen(true);
          }}
          className="bg-brightBlue dark:bg-neonGreen text-white dark:text-black px-4 py-2 rounded-lg shadow hover:opacity-90 transition"
        >
          + Tambah Data
        </button>
      </div>

      {budgets.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          Belum ada data anggaran. Klik <strong>Tambah Data</strong> untuk mulai.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgets.map((item, index) => {
            const percent = Math.min((item.used / item.limit) * 100, 100);
            return (
              <div
                key={index}
                className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-5 transition-all relative group"
              >
                <h3 className="text-lg font-semibold mb-2">{item.category}</h3>
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  Batas: Rp {item.limit.toLocaleString("id-ID")}
                </div>

                <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-3 mb-2">
                  <div
                    className={`h-3 rounded-full ${
                      percent >= 90
                        ? "bg-red-500"
                        : percent >= 70
                        ? "bg-yellow-500"
                        : "bg-brightBlue dark:bg-neonGreen"
                    }`}
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>
                <p className="text-sm">
                  Terpakai: Rp {item.used.toLocaleString("id-ID")} (
                  {percent.toFixed(0)}%)
                </p>

                {/* Tombol Edit & Hapus */}
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

      {/* MODAL INPUT */}
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
                {editingIndex !== null ? "Edit Anggaran" : "Tambah Anggaran"}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Kategori</label>
                  <input
                    type="text"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full p-2 rounded-md border dark:border-gray-700 dark:bg-gray-800 focus:ring-2 focus:ring-brightBlue dark:focus:ring-neonGreen outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Batas Anggaran (Rp)
                  </label>
                  <input
  type="text"
  name="limit"
  value={formatCurrency(form.limit)}
  onChange={(e) =>
    setForm((prev) => ({ ...prev, limit: parseCurrency(e.target.value) }))
  }
  className="w-full p-2 rounded-md border dark:border-gray-700 dark:bg-gray-800
             focus:ring-2 focus:ring-brightBlue dark:focus:ring-neonGreen outline-none"
/>

                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Terpakai (Rp)</label>
                  <input
  type="text"
  name="used"
  value={formatCurrency(form.used)}
  onChange={(e) =>
    setForm((prev) => ({ ...prev, used: parseCurrency(e.target.value) }))
  }
  className="w-full p-2 rounded-md border dark:border-gray-700 dark:bg-gray-800
             focus:ring-2 focus:ring-brightBlue dark:focus:ring-neonGreen outline-none"
/>

                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingIndex(null);
                    }}
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
