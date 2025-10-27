// backend/controllers/transactionController.js
import { Transaction } from "../models/Transaction.js";

/** ✅ CREATE TRANSACTION */
export const createTransaction = async (req, res) => {
  try {
    const { userId, category, type, amount, note, date } = req.body;

    if (!userId || !category || !type || !amount || !date)
      return res.status(400).json({ message: "Missing required fields." });

    const transaction = await Transaction.create({
      userId,
      category,
      type,
      amount,
      note,
      date,
    });

    res.status(201).json(transaction);
  } catch (error) {
    console.error("❌ Error creating transaction:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/** 📦 GET ALL TRANSACTIONS (per user) */
export const getTransactions = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId)
      return res.status(400).json({ message: "Missing userId in query." });

    const transactions = await Transaction.findAll({
      where: { userId },
      order: [["date", "DESC"]],
    });

    res.status(200).json(transactions);
  } catch (error) {
    console.error("❌ Error fetching transactions:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/** ✏️ UPDATE TRANSACTION */
export const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { category, type, amount, note, date } = req.body;

    const transaction = await Transaction.findByPk(id);
    if (!transaction)
      return res.status(404).json({ message: "Transaction not found" });

    await transaction.update({ category, type, amount, note, date });
    res.status(200).json(transaction);
  } catch (error) {
    console.error("❌ Error updating transaction:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/** 🗑️ DELETE TRANSACTION */
export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findByPk(id);

    if (!transaction)
      return res.status(404).json({ message: "Transaction not found" });

    await transaction.destroy();
    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting transaction:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/** ☁️ UPLOAD MULTIPLE TRANSACTIONS FROM EXCEL */
export const uploadTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    const { transactions } = req.body;

    if (!transactions || transactions.length === 0) {
      return res.status(400).json({ error: "Data transaksi kosong!" });
    }

    const formatted = transactions.map((t) => ({
      userId,
      category: t.category,
      type: t.type,
      amount: t.amount,
      note: t.note || "",
      date: t.date,
    }));

    await Transaction.bulkCreate(formatted);

    res.status(200).json({ message: "✅ Semua transaksi berhasil diupload ke database!" });
  } catch (error) {
    console.error("❌ Upload error:", error);
    res.status(500).json({ error: "Gagal mengupload data transaksi!" });
  }
};
