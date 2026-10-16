const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const cloudinary = require('../config/cloudinary');
const ApiError = require('../utils/ApiError');

// @desc    Create a new product listing
// @route   POST /api/products
// @access  Private
const createProduct = asyncHandler(async (req, res) => {
  const { title, description, price, category, condition, location } = req.body;

  if (!req.files || req.files.length === 0) {
    throw new ApiError(400, 'At least one product image is required');
  }

  const images = req.files.map((f) => ({ url: f.path, publicId: f.filename }));

  const product = await Product.create({
    title,
    description,
    price,
    category,
    condition,
    location,
    images,
    seller: req.user._id,
  });

  const populated = await product.populate('seller', 'name profileImage');

  res.status(201).json({ success: true, data: { product: populated } });
});

// @desc    Get products with search/filter/sort/pagination
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const {
    search,
    category,
    minPrice,
    maxPrice,
    condition,
    sort = 'newest',
    page = 1,
    limit = 12,
  } = req.query;

  const query = { status: 'available' };

  if (search) {
    query.$text = { $search: search };
  }
  if (category) {
    query.category = category;
  }
  if (condition) {
    query.condition = condition;
  }
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  const sortMap = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    price_asc: { price: 1 },
    price_desc: { price: -1 },
  };
  const sortOption = sortMap[sort] || sortMap.newest;

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 12));
  const skip = (pageNum - 1) * limitNum;

  const [products, total] = await Promise.all([
    Product.find(query)
      .populate('seller', 'name profileImage')
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum),
    Product.countDocuments(query),
  ]);

  res.json({
    success: true,
    data: {
      products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    },
  });
});

// @desc    Get a single product by id
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate(
    'seller',
    'name profileImage createdAt'
  );
  if (!product) throw new ApiError(404, 'Product not found');

  res.json({ success: true, data: { product } });
});

// Helper: only owner or admin
const assertCanModify = (product, user) => {
  const isOwner = product.seller.toString() === user._id.toString();
  if (!isOwner && user.role !== 'admin') {
    throw new ApiError(403, 'You are not authorized to modify this listing');
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private (owner or admin)
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError(404, 'Product not found');
  assertCanModify(product, req.user);

  const editableFields = ['title', 'description', 'price', 'category', 'condition', 'location', 'status'];
  editableFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      product[field] = req.body[field];
    }
  });

  // Optionally append new images
  if (req.files && req.files.length > 0) {
    const newImages = req.files.map((f) => ({ url: f.path, publicId: f.filename }));
    product.images.push(...newImages);
  }

  await product.save();
  const populated = await product.populate('seller', 'name profileImage');

  res.json({ success: true, data: { product: populated } });
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private (owner or admin)
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError(404, 'Product not found');
  assertCanModify(product, req.user);

  // Clean up Cloudinary images
  await Promise.all(
    product.images.map((img) => cloudinary.uploader.destroy(img.publicId).catch(() => {}))
  );

  await product.deleteOne();

  res.json({ success: true, message: 'Product deleted successfully' });
});

// @desc    Remove a single image from a product
// @route   DELETE /api/products/:id/images/:publicId
// @access  Private (owner or admin)
const deleteProductImage = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError(404, 'Product not found');
  assertCanModify(product, req.user);

  if (product.images.length <= 1) {
    throw new ApiError(400, 'A product must have at least one image');
  }

  const { publicId } = req.params;
  const exists = product.images.some((img) => img.publicId === publicId);
  if (!exists) throw new ApiError(404, 'Image not found on this product');

  await cloudinary.uploader.destroy(publicId).catch(() => {});
  product.images = product.images.filter((img) => img.publicId !== publicId);
  await product.save();

  res.json({ success: true, data: { product } });
});

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  deleteProductImage,
};
