const { Service } = require('../models');

const getAll = async (req, res, next) => {
  try {
    const where = { active: true };
    if (req.query.category) where.category = req.query.category;
    const services = await Service.findAll({ where, order: [['created_at', 'DESC']] });
    res.json({ success: true, message: 'Services récupérés', data: services });
  } catch (err) { next(err); }
};

const getOne = async (req, res, next) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: 'Service introuvable', data: null });
    res.json({ success: true, message: 'Service récupéré', data: service });
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const { title, description, price, category } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;
    const service = await Service.create({ title, description, price, category, image });
    res.status(201).json({ success: true, message: 'Service créé', data: service });
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: 'Service introuvable', data: null });
    const image = req.file ? `/uploads/${req.file.filename}` : service.image;
    await service.update({ ...req.body, image });
    res.json({ success: true, message: 'Service mis à jour', data: service });
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: 'Service introuvable', data: null });
    await service.update({ active: false });
    res.json({ success: true, message: 'Service désactivé', data: null });
  } catch (err) { next(err); }
};

module.exports = { getAll, getOne, create, update, remove };
