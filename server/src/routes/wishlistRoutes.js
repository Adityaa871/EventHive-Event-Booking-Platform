const { Router } = require('express');
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} = require('../controllers/wishlistController');
const { protect } = require('../middleware/authMiddleware');

const router = Router();

router.use(protect);

router.get('/', getWishlist);
router.post('/:packageId', addToWishlist);
router.delete('/:packageId', removeFromWishlist);

module.exports = router;
