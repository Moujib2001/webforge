const router = require('express').Router();
const { getAll, create, update, remove } = require('../controllers/portfolioController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/',       getAll);
router.post('/',      protect, adminOnly, upload.single('image'), create);
router.put('/:id',    protect, adminOnly, upload.single('image'), update);
router.delete('/:id', protect, adminOnly, remove);

module.exports = router;
