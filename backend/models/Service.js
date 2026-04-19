const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Service = sequelize.define(
  'Service',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING(150), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    category: {
      type: DataTypes.ENUM('website', 'mobile', 'redesign'),
      allowNull: false,
    },
    image: { type: DataTypes.STRING(255), defaultValue: null },
    active: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  {
    tableName: 'services',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

module.exports = Service;
