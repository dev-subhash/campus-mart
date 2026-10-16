const express = require('express');
const { body } = require('express-validator');
const { protect } = require('../middleware/auth');
const { uploadProductImages } = require('../middleware/upload');
const validate = require('../middleware/validate');
const Product = require('../models/Product');
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  deleteProductImage,
} = require('../controllers/productController');

const router = express.Router();

const productValidators = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category')
    .isIn(Product.CATEGORIES)
    .withMessage(`Category must be one of: ${Product.CATEGORIES.join(', ')}`),
];

router.get('/', getProducts);
router.get('/:id', getProductById);

router.post(
  '/',
  protect,
  uploadProductImages.array('images', 6),
  productValidators,
  validate,
  createProduct
);

router.put('/:id', protect, uploadProductImages.array('images', 6), updateProduct);
router.delete('/:id', protect, deleteProduct);
router.delete('/:id/images/:publicId', protect, deleteProductImage);

module.exports = router;
