// backend/routes/transactionRoutes.js
import express from "express";
import {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
  uploadTransactions,
} from "../controllers/transactionController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// CREATE
router.post("/", createTransaction);

// READ (per user)
router.get("/", getTransactions);

// UPDATE
router.put("/:id", updateTransaction);

// DELETE
router.delete("/:id", deleteTransaction);

// UPLOAD MULTIPLE
router.post("/upload", verifyToken, uploadTransactions);

export default router;
