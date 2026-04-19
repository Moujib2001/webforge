const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Tous les champs sont requis', data: null });
    }
    const exists = await User.findOne({ where: { email } });
    if (exists) {
      return res.status(409).json({ success: false, message: 'Email déjà utilisé', data: null });
    }
    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hashed });
    const token = generateToken(user.id);
    return res.status(201).json({
      success: true,
      message: 'Compte créé avec succès',
      data: { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } },
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email et mot de passe requis', data: null });
    }
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, message: 'Identifiants incorrects', data: null });
    }
    const token = generateToken(user.id);
    return res.json({
      success: true,
      message: 'Connexion réussie',
      data: { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } },
    });
  } catch (err) {
    next(err);
  }
};

const getMe = async (req, res) => {
  res.json({ success: true, message: 'Profil récupéré', data: req.user });
};

module.exports = { register, login, getMe };
