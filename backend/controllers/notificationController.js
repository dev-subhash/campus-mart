const asyncHandler = require('express-async-handler');
const Notification = require('../models/Notification');
const ApiError = require('../utils/ApiError');

// @desc    Get the logged-in user's notifications
// @route   GET /api/notifications
// @access  Private
const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .limit(50);

  const unreadCount = await Notification.countDocuments({ user: req.user._id, read: false });

  res.json({ success: true, data: { notifications, unreadCount } });
});

// @desc    Mark a single notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);
  if (!notification) throw new ApiError(404, 'Notification not found');
  if (notification.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Not authorized');
  }

  notification.read = true;
  await notification.save();

  res.json({ success: true, data: { notification } });
});

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ user: req.user._id, read: false }, { $set: { read: true } });
  res.json({ success: true, message: 'All notifications marked as read' });
});

module.exports = { getNotifications, markAsRead, markAllAsRead };
