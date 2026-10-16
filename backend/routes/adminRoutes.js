const express = require('express');
const { protect } = require('../middleware/auth');
const requireAdmin = require('../middleware/admin');
const {
  getStats,
  getAllUsers,
  setUserStatus,
  setUserRole,
  getAllProducts,
  removeProduct,
} = require('../controllers/adminController');

const router = express.Router();

router.use(protect, requireAdmin);

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.put('/users/:id/status', setUserStatus);
router.put('/users/:id/role', setUserRole);
router.get('/products', getAllProducts);
router.delete('/products/:id', removeProduct);

module.exports = router;
