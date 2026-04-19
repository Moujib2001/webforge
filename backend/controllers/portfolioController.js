const { Portfolio } = require('../models');

const getAll = async (req, res, next) => {
  try {
    const where = {};
    if (req.query.category) where.category = req.query.category;
    const items = await Portfolio.findAll({ where, order: [['created_at', 'DESC']] });
    res.json({ success: true, message: 'Portfolio récupéré', data: items });
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const { title, description, category, url } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;
    const item = await Portfolio.create({ title, description, category, url, image });
    res.status(201).json({ success: true, message: 'Projet ajouté', data: item });
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const item = await Portfolio.findByPk(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Projet introuvable', data: null });
    const image = req.file ? `/uploads/${req.file.filename}` : item.image;
    await item.update({ ...req.body, image });
    res.json({ success: true, message: 'Projet mis à jour', data: item });
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    const item = await Portfolio.findByPk(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Projet introuvable', data: null });
    await item.destroy();
    res.json({ success: true, message: 'Projet supprimé', data: null });
  } catch (err) { next(err); }
};

module.exports = { getAll, create, update, remove };
