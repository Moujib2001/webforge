const sequelize = require('../config/db');
const User      = require('./User');
const Service   = require('./Service');
const Order     = require('./Order');
const Message   = require('./Message');
const Portfolio = require('./Portfolio');

// Associations
User.hasMany(Order,    { foreignKey: 'user_id', as: 'orders' });
Order.belongsTo(User,  { foreignKey: 'user_id', as: 'client' });

Service.hasMany(Order,   { foreignKey: 'service_id', as: 'orders' });
Order.belongsTo(Service, { foreignKey: 'service_id', as: 'service' });

Order.hasMany(Message,   { foreignKey: 'order_id', as: 'messages' });
Message.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

User.hasMany(Message,    { foreignKey: 'sender_id', as: 'sentMessages' });
Message.belongsTo(User,  { foreignKey: 'sender_id', as: 'sender' });

module.exports = { sequelize, User, Service, Order, Message, Portfolio };
