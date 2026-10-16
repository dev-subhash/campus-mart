const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Product = require('../models/Product');
const cloudinary = require('../config/cloudinary');
const ApiError = require('../utils/ApiError');

// @desc    Get marketplace-wide statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getStats = asyncHandler(async (req, res) => {
  const [totalUsers, totalProducts, availableProducts, soldProducts, admins] = await Promise.all([
    User.countDocuments(),
    Product.countDocuments(),
    Product.countDocuments({ status: 'available' }),
    Product.countDocuments({ status: 'sold' }),
    User.countDocuments({ role: 'admin' }),
  ]);

  const categoryBreakdown = await Product.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  res.json({
    success: true,
    data: {
      totalUsers,
      totalProducts,
      availableProducts,
      soldProducts,
      admins,
      categoryBreakdown,
    },
  });
});

// @desc    List all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json({ success: true, data: { users: users.map((u) => u.toSafeObject()) } });
});

// @desc    Deactivate/reactivate a user
// @route   PUT /api/admin/users/:id/status
// @access  Private/Admin
const setUserStatus = asyncHandler(async (req, res) => {
  const { isActive } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'User not found');

  if (user._id.toString() === req.user._id.toString()) {
    throw new ApiError(400, 'You cannot change your own account status');
  }

  user.isActive = !!isActive;
  await user.save();

  res.json({ success: true, data: { user: user.toSafeObject() } });
});

// @desc    Promote/demote a user's role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
const setUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  if (!['user', 'admin'].includes(role)) {
    throw new ApiError(400, 'Role must be either "user" or "admin"');
  }

  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'User not found');

  user.role = role;
  await user.save();

  res.json({ success: true, data: { user: user.toSafeObject() } });
});

// @desc    List all products (admin view, includes all statuses)
// @route   GET /api/admin/products
// @access  Private/Admin
const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find()
    .populate('seller', 'name email')
    .sort({ createdAt: -1 });
  res.json({ success: true, data: { products } });
});

// @desc    Remove an inappropriate product
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
const removeProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError(404, 'Product not found');

  await Promise.all(
    product.images.map((img) => cloudinary.uploader.destroy(img.publicId).catch(() => {}))
  );
  await product.deleteOne();

  res.json({ success: true, message: 'Product removed successfully' });
});

module.exports = {
  getStats,
  getAllUsers,
  setUserStatus,
  setUserRole,
  getAllProducts,
  removeProduct,
};
