import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/database.js"; // ✅ tambahkan .js
import transactionRoutes from "./routes/transactionRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/users", userRoutes);

await connectDB();

app.use("/api/transactions", transactionRoutes);

app.get("/", (req, res) => res.send("🚀 Finance Manager Backend Running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
