const { Message, User, Order } = require('../models');

const getByOrder = async (req, res, next) => {
  try {
    const { order_id } = req.params;

    // Client can only access messages for their own orders
    if (req.user.role === 'client') {
      const order = await Order.findOne({ where: { id: order_id, user_id: req.user.id } });
      if (!order) return res.status(403).json({ success: false, message: 'Accès refusé', data: null });
    }

    const messages = await Message.findAll({
      where: { order_id },
      include: [{ model: User, as: 'sender', attributes: ['id', 'name', 'role'] }],
      order: [['created_at', 'ASC']],
    });
    res.json({ success: true, message: 'Messages récupérés', data: messages });
  } catch (err) { next(err); }
};

const send = async (req, res, next) => {
  try {
    const { order_id, content } = req.body;
    if (!content?.trim()) {
      return res.status(400).json({ success: false, message: 'Message vide', data: null });
    }

    // Client can only message on their own orders
    if (req.user.role === 'client') {
      const order = await Order.findOne({ where: { id: order_id, user_id: req.user.id } });
      if (!order) return res.status(403).json({ success: false, message: 'Accès refusé', data: null });
    }

    const message = await Message.create({ order_id, sender_id: req.user.id, content });
    const full = await Message.findByPk(message.id, {
      include: [{ model: User, as: 'sender', attributes: ['id', 'name', 'role'] }],
    });
    res.status(201).json({ success: true, message: 'Message envoyé', data: full });
  } catch (err) { next(err); }
};

module.exports = { getByOrder, send };
