const router = require('express').Router();
const { getDashboard, getClients, getClientById } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.use(protect, adminOnly);

router.get('/dashboard',      getDashboard);
router.get('/clients',        getClients);
router.get('/clients/:id',    getClientById);

module.exports = router;
