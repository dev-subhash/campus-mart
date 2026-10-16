const ApiError = require('../utils/ApiError');

// Must run after `protect`
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    throw new ApiError(403, 'Admin access required');
  }
  next();
};

module.exports = requireAdmin;
