// backend/config/database.js
import mysql from "mysql2/promise";
import { Sequelize, DataTypes } from "sequelize";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

const { DB_URL, DB_USER, DB_PASS, DB_NAME } = process.env;

// ============================================================
// 1️⃣ Membuat database jika belum ada
// ============================================================
export const initDatabase = async () => {
  try {
    console.log("🔄 Checking MySQL server...");
    const connection = await mysql.createConnection({
      host: DB_URL,
      user: DB_USER,
      password: DB_PASS,
    });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
    console.log(`✅ Database '${DB_NAME}' is ready.`);
    await connection.end();
  } catch (err) {
    console.error("❌ Failed to initialize database!");
    console.error(err.message);
    process.exit(1);
  }
};

// ============================================================
// 2️⃣ Koneksi Sequelize ke MySQL
// ============================================================
export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_URL,
  dialect: "mysql",
  port: 3306,
  logging: false,
  timezone: "+07:00",
});

// ============================================================
// 3️⃣ Definisi Semua Model (Lengkap: User, Transaction, Budget, Savings, Goals)
// ============================================================
export const defineModels = () => {
  // 🧍 User Table
  const User = sequelize.define(
    "User",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      username: { type: DataTypes.STRING(100), allowNull: false, unique: true },
      email: { type: DataTypes.STRING(255), allowNull: true }, // opsional
      password: { type: DataTypes.STRING(255), allowNull: false },
      role: { type: DataTypes.ENUM("user", "admin"), defaultValue: "user" },
      theme: { type: DataTypes.ENUM("light", "dark"), defaultValue: "light" },
    },
    { tableName: "users", timestamps: true }
  );

  // 💵 Transactions Table
  const Transaction = sequelize.define(
    "Transaction",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      userId: { type: DataTypes.INTEGER, allowNull: false },
      category: { type: DataTypes.STRING(100), allowNull: false },
      type: { type: DataTypes.ENUM("income", "expense"), allowNull: false },
      amount: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
      note: { type: DataTypes.TEXT },
      date: { type: DataTypes.DATEONLY, allowNull: false },
    },
    { tableName: "transactions", timestamps: true }
  );

  // 📊 Budgets Table
  const Budget = sequelize.define(
    "Budget",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      userId: { type: DataTypes.INTEGER, allowNull: false },
      category: { type: DataTypes.STRING(100), allowNull: false },
      limit: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
      used: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0 },
      month: { type: DataTypes.STRING(7), allowNull: false }, // YYYY-MM
    },
    { tableName: "budgets", timestamps: true }
  );

  // 💰 Savings Table
  const Savings = sequelize.define(
    "Savings",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      userId: { type: DataTypes.INTEGER, allowNull: false },
      name: { type: DataTypes.STRING(100), allowNull: false },
      goal: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
      current: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0 },
    },
    { tableName: "savings", timestamps: true }
  );

  // 🎯 Goals Table
  const Goals = sequelize.define(
    "Goals",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      userId: { type: DataTypes.INTEGER, allowNull: false },
      name: { type: DataTypes.STRING(100), allowNull: false },
      target: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
      saved: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0 },
      deadline: { type: DataTypes.STRING(10) },
    },
    { tableName: "goals", timestamps: true }
  );

  // ============================================================
  // 4️⃣ Relasi antar tabel (semua terkait user)
  // ============================================================
  User.hasMany(Transaction, { foreignKey: "userId", onDelete: "CASCADE" });
  Transaction.belongsTo(User, { foreignKey: "userId" });

  User.hasMany(Budget, { foreignKey: "userId", onDelete: "CASCADE" });
  Budget.belongsTo(User, { foreignKey: "userId" });

  User.hasMany(Savings, { foreignKey: "userId", onDelete: "CASCADE" });
  Savings.belongsTo(User, { foreignKey: "userId" });

  User.hasMany(Goals, { foreignKey: "userId", onDelete: "CASCADE" });
  Goals.belongsTo(User, { foreignKey: "userId" });

  return { User, Transaction, Budget, Savings, Goals };
};

// ============================================================
// 5️⃣ Buat Admin Default (wrjunior / Hamas@fif13)
// ============================================================
export const ensureAdminUser = async (User) => {
  const adminUsername = "wrjunior";
  const adminPassword = "Hamas@fif13";

  try {
    const existingAdmin = await User.findOne({ where: { username: adminUsername } });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await User.create({
        username: adminUsername,
        password: hashedPassword,
        role: "admin",
        theme: "dark",
      });
      console.log("🧑‍💼 Default admin user created successfully!");
    } else {
      console.log("🧑‍💼 Admin user already exists.");
    }
  } catch (err) {
    console.error("❌ Failed to ensure admin user:", err.message);
  }
};

// ============================================================
// 6️⃣ Koneksi dan Sinkronisasi
// ============================================================
export const connectDB = async () => {
  await initDatabase();

  try {
    await sequelize.authenticate();
    console.log("✅ MySQL connection established!");

    const models = defineModels();
await sequelize.sync();
    console.log("✅ All tables synchronized successfully!");

    await ensureAdminUser(models.User);
    console.log("🧩 Database ready with admin account and full schema.");

    return models;
  } catch (err) {
    console.error("❌ Database connection or model sync failed!");
    console.error(err.message);
    process.exit(1);
  }
};
