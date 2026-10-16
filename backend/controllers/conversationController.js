const asyncHandler = require('express-async-handler');
const Conversation = require('../models/Conversation');
const ApiError = require('../utils/ApiError');

// @desc    Find or create a conversation between the logged-in user and another user
// @route   POST /api/conversations
// @access  Private
const findOrCreateConversation = asyncHandler(async (req, res) => {
  const { recipientId, productId } = req.body;

  if (!recipientId) throw new ApiError(400, 'recipientId is required');
  if (recipientId === req.user._id.toString()) {
    throw new ApiError(400, 'You cannot start a conversation with yourself');
  }

  let conversation = await Conversation.findOne({
    participants: { $all: [req.user._id, recipientId], $size: 2 },
    ...(productId ? { product: productId } : {}),
  });

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [req.user._id, recipientId],
      product: productId || null,
    });
  }

  const populated = await conversation.populate([
    { path: 'participants', select: 'name profileImage' },
    { path: 'product', select: 'title images price' },
  ]);

  res.status(200).json({ success: true, data: { conversation: populated } });
});

// @desc    List the logged-in user's conversations, most recently active first
// @route   GET /api/conversations
// @access  Private
const getConversations = asyncHandler(async (req, res) => {
  const conversations = await Conversation.find({ participants: req.user._id })
    .populate('participants', 'name profileImage')
    .populate('product', 'title images price')
    .sort({ updatedAt: -1 });

  const withUnread = conversations.map((c) => {
    const obj = c.toObject();
    obj.unreadCount = c.unreadCounts.get(req.user._id.toString()) || 0;
    return obj;
  });

  res.json({ success: true, data: { conversations: withUnread } });
});

// @desc    Get a single conversation by id (must be a participant)
// @route   GET /api/conversations/:id
// @access  Private
const getConversationById = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findById(req.params.id)
    .populate('participants', 'name profileImage')
    .populate('product', 'title images price');

  if (!conversation) throw new ApiError(404, 'Conversation not found');

  const isParticipant = conversation.participants.some(
    (p) => p._id.toString() === req.user._id.toString()
  );
  if (!isParticipant) throw new ApiError(403, 'You are not part of this conversation');

  res.json({ success: true, data: { conversation } });
});

module.exports = { findOrCreateConversation, getConversations, getConversationById };
