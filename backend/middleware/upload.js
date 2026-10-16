const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const makeStorage = (folder) =>
  new CloudinaryStorage({
    cloudinary,
    params: {
      folder: `campus-mart/${folder}`,
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [{ width: 1200, height: 1200, crop: 'limit' }],
    },
  });

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, and WEBP images are allowed'), false);
  }
};

const uploadProductImages = multer({
  storage: makeStorage('products'),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024, files: 6 },
});

const uploadProfileImage = multer({
  storage: makeStorage('profiles'),
  fileFilter,
  limits: { fileSize: 3 * 1024 * 1024, files: 1 },
});

module.exports = { uploadProductImages, uploadProfileImage };
