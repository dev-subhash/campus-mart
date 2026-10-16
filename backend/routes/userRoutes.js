const express = require('express');
const { protect } = require('../middleware/auth');
const { uploadProfileImage } = require('../middleware/upload');
const {
  getUserById,
  updateProfile,
  updateProfileImage,
  getMyListings,
} = require('../controllers/userController');

const router = express.Router();

router.get('/me/listings', protect, getMyListings);
router.put('/me', protect, updateProfile);
router.put('/me/avatar', protect, uploadProfileImage.single('image'), updateProfileImage);
router.get('/:id', getUserById);

module.exports = router;
