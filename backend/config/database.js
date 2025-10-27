// Backend/config/database.js
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const { DB_URL, DB_USER, DB_PASS, DB_NAME } = process.env;

// 🔹 Buat connection string MongoDB
// Contoh hasil akhir: mongodb+srv://user:pass@cluster.mongodb.net/finance
const mongoURI = `mongodb+srv://${DB_USER}:${encodeURIComponent(DB_PASS)}@${DB_URL}/${DB_NAME}?retryWrites=true&w=majority`;

// 🔹 Fungsi koneksi ke database
export const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ MongoDB Connected Successfully!");
    console.log(`📦 Database: ${DB_NAME}`);
  } catch (error) {
    console.error("❌ MongoDB Connection Failed!");
    console.error(`Reason: ${error.message}`);
    process.exit(1); // stop server jika gagal
  }
};
