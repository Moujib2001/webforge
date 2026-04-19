const { Order, Service, User } = require('../models');
const { sendMail, orderConfirmationEmail, statusUpdateEmail } = require('../config/mailer');

const create = async (req, res, next) => {
  try {
    const { service_id, description, budget } = req.body;
    const files_path = req.files ? req.files.map((f) => `/uploads/${f.filename}`) : [];

    const service = await Service.findByPk(service_id);
    if (!service) return res.status(404).json({ success: false, message: 'Service introuvable', data: null });

    const order = await Order.create({
      user_id: req.user.id,
      service_id,
      description,
      budget: budget || null,
      files_path,
    });

    // Send confirmation email (non-blocking)
    const tpl = orderConfirmationEmail(req.user.name, service.title, order.id);
    sendMail({ to: req.user.email, ...tpl }).catch(console.error);

    res.status(201).json({ success: true, message: 'Commande créée', data: order });
  } catch (err) { next(err); }
};

const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.findAll({
      where: { user_id: req.user.id },
      include: [{ model: Service, as: 'service', attributes: ['title', 'category', 'price'] }],
      order: [['created_at', 'DESC']],
    });
    res.json({ success: true, message: 'Commandes récupérées', data: orders });
  } catch (err) { next(err); }
};

const getOne = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      where: { id: req.params.id, user_id: req.user.id },
      include: [
        { model: Service, as: 'service' },
        { model: User, as: 'client', attributes: ['id', 'name', 'email'] },
      ],
    });
    if (!order) return res.status(404).json({ success: false, message: 'Commande introuvable', data: null });
    res.json({ success: true, message: 'Commande récupérée', data: order });
  } catch (err) { next(err); }
};

// Admin: list all orders
const getAll = async (req, res, next) => {
  try {
    const where = {};
    if (req.query.status) where.status = req.query.status;
    const orders = await Order.findAll({
      where,
      include: [
        { model: Service, as: 'service', attributes: ['title', 'category'] },
        { model: User, as: 'client', attributes: ['id', 'name', 'email'] },
      ],
      order: [['created_at', 'DESC']],
    });
    res.json({ success: true, message: 'Toutes les commandes', data: orders });
  } catch (err) { next(err); }
};

// Admin: update order status
const updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await Order.findByPk(req.params.id, {
      include: [
        { model: User, as: 'client' },
        { model: Service, as: 'service' },
      ],
    });
    if (!order) return res.status(404).json({ success: false, message: 'Commande introuvable', data: null });
    await order.update({ status });

    const tpl = statusUpdateEmail(order.client.name, order.service.title, order.id, status);
    sendMail({ to: order.client.email, ...tpl }).catch(console.error);

    res.json({ success: true, message: 'Statut mis à jour', data: order });
  } catch (err) { next(err); }
};

module.exports = { create, getMyOrders, getOne, getAll, updateStatus };
