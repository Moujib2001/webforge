const router = require('express').Router();
const { create, getMyOrders, getOne, getAll, updateStatus } = require('../controllers/ordersController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Client routes
router.post('/',     protect, upload.array('files', 5), create);
router.get('/mine',  protect, getMyOrders);
router.get('/:id',   protect, getOne);

// Admin routes
router.get('/',            protect, adminOnly, getAll);
router.patch('/:id/status', protect, adminOnly, updateStatus);

module.exports = router;
