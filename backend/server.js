// Backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/database.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// 🔹 Koneksi ke database
connectDB();

// 🔹 Route testing
app.get("/", (req, res) => {
  res.send("🚀 Finance Manager Backend Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
