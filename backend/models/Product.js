const mongoose = require('mongoose');

const CATEGORIES = [
  'Books',
  'Electronics',
  'Furniture',
  'Notes',
  'Stationery',
  'Hostel Items',
  'Other',
];

const CONDITIONS = ['New', 'Like New', 'Good', 'Fair', 'Used'];

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: 120,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: 2000,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    category: {
      type: String,
      enum: CATEGORIES,
      required: [true, 'Category is required'],
    },
    condition: {
      type: String,
      enum: CONDITIONS,
      default: 'Good',
    },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
      },
    ],
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    location: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['available', 'sold', 'removed'],
      default: 'available',
    },
  },
  { timestamps: true }
);

productSchema.index({ title: 'text', description: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ seller: 1 });
productSchema.index({ createdAt: -1 });

productSchema.statics.CATEGORIES = CATEGORIES;
productSchema.statics.CONDITIONS = CONDITIONS;

module.exports = mongoose.model('Product', productSchema);
