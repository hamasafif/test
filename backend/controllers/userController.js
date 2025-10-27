// backend/controllers/userController.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sequelize, connectDB } from "../config/database.js";

// Pastikan model di-load dari instance sequelize yang aktif
let User;
(async () => {
  const models = await connectDB();
  User = models.User;
})();

// 🔐 REGISTER
export const registerUser = async (req, res) => {
  try {
    if (!User) {
      return res.status(500).json({ message: "Database not ready yet!" });
    }

    const { username, email, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Username dan password wajib diisi!" });
    }

    const existing = await User.findOne({ where: { username } });
    if (existing) {
      return res.status(400).json({ message: "Username sudah digunakan!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, email, password: hashedPassword });

    res.status(201).json({ message: "✅ Registrasi berhasil", user: newUser });
  } catch (error) {
    console.error("❌ Error registering user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔑 LOGIN
export const loginUser = async (req, res) => {
  try {
    if (!User) {
      return res.status(500).json({ message: "Database not ready yet!" });
    }

    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });

    if (!user) return res.status(404).json({ message: "User tidak ditemukan!" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Password salah!" });

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      "secretkey",
      { expiresIn: "7d" }
    );

    res.json({
      message: "✅ Login berhasil",
      token,
      user: { id: user.id, username: user.username, role: user.role },
    });
  } catch (error) {
    console.error("❌ Error logging in:", error);
    res.status(500).json({ message: "Server error" });
  }
};
