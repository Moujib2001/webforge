const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Order = sequelize.define(
  'Order',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    service_id: { type: DataTypes.INTEGER, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    budget: { type: DataTypes.DECIMAL(10, 2), defaultValue: null },
    status: {
      type: DataTypes.ENUM('pending', 'in_progress', 'delivered', 'cancelled'),
      defaultValue: 'pending',
    },
    files_path: {
      type: DataTypes.JSON,
      defaultValue: [],
      comment: 'Array of uploaded file paths',
    },
  },
  {
    tableName: 'orders',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

module.exports = Order;
