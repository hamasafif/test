// backend/models/Transaction.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Transaction = sequelize.define(
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
  {
    tableName: "transactions",
    timestamps: true,
  }
);
