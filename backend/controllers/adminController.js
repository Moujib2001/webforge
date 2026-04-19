const { User, Order, Service } = require('../models');
const { sequelize } = require('../models');
const { Op } = require('sequelize');

const getDashboard = async (req, res, next) => {
  try {
    const [totalOrders, totalClients, revenue, ordersByStatus] = await Promise.all([
      Order.count(),
      User.count({ where: { role: 'client' } }),
      Order.sum('budget', { where: { status: 'delivered' } }),
      Order.findAll({
        attributes: ['status', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
        group: ['status'],
        raw: true,
      }),
    ]);

    res.json({
      success: true,
      message: 'Statistiques admin',
      data: { totalOrders, totalClients, revenue: revenue || 0, ordersByStatus },
    });
  } catch (err) { next(err); }
};

const getClients = async (req, res, next) => {
  try {
    const clients = await User.findAll({
      where: { role: 'client' },
      attributes: { exclude: ['password'] },
      include: [{ model: Order, as: 'orders', attributes: ['id', 'status', 'created_at'] }],
      order: [['created_at', 'DESC']],
    });
    res.json({ success: true, message: 'Clients récupérés', data: clients });
  } catch (err) { next(err); }
};

const getClientById = async (req, res, next) => {
  try {
    const client = await User.findOne({
      where: { id: req.params.id, role: 'client' },
      attributes: { exclude: ['password'] },
      include: [{ model: Order, as: 'orders', include: [{ model: Service, as: 'service', attributes: ['title'] }] }],
    });
    if (!client) return res.status(404).json({ success: false, message: 'Client introuvable', data: null });
    res.json({ success: true, message: 'Client récupéré', data: client });
  } catch (err) { next(err); }
};

module.exports = { getDashboard, getClients, getClientById };
