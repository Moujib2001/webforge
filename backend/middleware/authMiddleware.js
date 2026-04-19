const jwt = require('jsonwebtoken');
const { User } = require('../models');

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Non authentifié', data: null });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] },
    });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Utilisateur introuvable', data: null });
    }
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Token invalide', data: null });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Accès refusé — admin uniquement', data: null });
  }
  next();
};

module.exports = { protect, adminOnly };
