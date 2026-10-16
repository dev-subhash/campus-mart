const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Product = require('../models/Product');
const cloudinary = require('../config/cloudinary');
const ApiError = require('../utils/ApiError');

// @desc    Get a user's public profile
// @route   GET /api/users/:id
// @access  Public
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'User not found');

  res.json({
    success: true,
    data: {
      user: {
        _id: user._id,
        name: user.name,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
      },
    },
  });
});

// @desc    Update own profile (name)
// @route   PUT /api/users/me
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone } = req.body;

  if (name !== undefined) {
    if (!name.trim()) throw new ApiError(400, 'Name cannot be empty');
    req.user.name = name.trim();
  }
  if (phone !== undefined) {
    const normalizedPhone = phone.replace(/[\s()-]/g, '');
    if (!/^\+?[1-9]\d{9,14}$/.test(normalizedPhone)) {
      throw new ApiError(400, 'Please enter a valid mobile number');
    }
    req.user.phone = normalizedPhone;
  }

  await req.user.save();
  res.json({ success: true, data: { user: req.user.toSafeObject() } });
});

// @desc    Upload/replace profile image
// @route   PUT /api/users/me/avatar
// @access  Private
const updateProfileImage = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, 'No image file provided');

  // Remove old image from Cloudinary if it exists
  if (req.user.profileImage && req.user.profileImage.publicId) {
    await cloudinary.uploader.destroy(req.user.profileImage.publicId).catch(() => {});
  }

  req.user.profileImage = {
    url: req.file.path,
    publicId: req.file.filename,
  };
  await req.user.save();

  res.json({ success: true, data: { user: req.user.toSafeObject() } });
});

// @desc    Get the logged-in user's own listings
// @route   GET /api/users/me/listings
// @access  Private
const getMyListings = asyncHandler(async (req, res) => {
  const products = await Product.find({ seller: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, data: { products } });
});

module.exports = { getUserById, updateProfile, updateProfileImage, getMyListings };
