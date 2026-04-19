const router = require('express').Router();
const { getByOrder, send } = require('../controllers/messagesController');
const { protect } = require('../middleware/authMiddleware');

router.get('/order/:order_id', protect, getByOrder);
router.post('/', protect, send);

module.exports = router;
