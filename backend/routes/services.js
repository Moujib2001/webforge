const router = require('express').Router();
const { getAll, getOne, create, update, remove } = require('../controllers/servicesController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/',     getAll);
router.get('/:id',  getOne);
router.post('/',    protect, adminOnly, upload.single('image'), create);
router.put('/:id',  protect, adminOnly, upload.single('image'), update);
router.delete('/:id', protect, adminOnly, remove);

module.exports = router;
