const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Portfolio = sequelize.define(
  'Portfolio',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING(150), allowNull: false },
    description: { type: DataTypes.TEXT, defaultValue: null },
    category: {
      type: DataTypes.ENUM('website', 'mobile', 'redesign'),
      allowNull: false,
    },
    image: { type: DataTypes.STRING(255), defaultValue: null },
    url: { type: DataTypes.STRING(255), defaultValue: null },
  },
  {
    tableName: 'portfolio',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  }
);

module.exports = Portfolio;
