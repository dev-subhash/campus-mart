const asyncHandler = require('express-async-handler');
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const Notification = require('../models/Notification');
const ApiError = require('../utils/ApiError');

// @desc    Send a message in a conversation
// @route   POST /api/messages
// @access  Private
const sendMessage = asyncHandler(async (req, res) => {
  const { conversationId, text } = req.body;

  if (!conversationId || !text || !text.trim()) {
    throw new ApiError(400, 'conversationId and text are required');
  }

  const conversation = await Conversation.findById(conversationId);
  if (!conversation) throw new ApiError(404, 'Conversation not found');

  const isParticipant = conversation.participants.some(
    (p) => p.toString() === req.user._id.toString()
  );
  if (!isParticipant) throw new ApiError(403, 'You are not part of this conversation');

  const receiverId = conversation.participants.find(
    (p) => p.toString() !== req.user._id.toString()
  );

  const message = await Message.create({
    conversationId,
    sender: req.user._id,
    receiver: receiverId,
    text: text.trim(),
  });

  conversation.lastMessage = {
    text: message.text,
    sender: req.user._id,
    createdAt: message.createdAt,
  };
  const currentUnread = conversation.unreadCounts.get(receiverId.toString()) || 0;
  conversation.unreadCounts.set(receiverId.toString(), currentUnread + 1);
  await conversation.save();

  const notification = await Notification.create({
    user: receiverId,
    type: 'message',
    text: `New message from ${req.user.name}`,
    link: `/chat/${conversationId}`,
    relatedId: conversationId,
  });

  const populatedMessage = await message.populate('sender', 'name profileImage');

  // Emit real-time events via Socket.IO (io instance attached to app in server.js)
  const io = req.app.get('io');
  const onlineUsers = req.app.get('onlineUsers');
  if (io && onlineUsers) {
    const receiverSocketId = onlineUsers.get(receiverId.toString());
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('message:new', populatedMessage);
      io.to(receiverSocketId).emit('notification:new', notification);
    }
  }

  res.status(201).json({ success: true, data: { message: populatedMessage } });
});

// @desc    Get message history for a conversation (also marks messages as read)
// @route   GET /api/messages/:conversationId
// @access  Private
const getMessages = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;

  const conversation = await Conversation.findById(conversationId);
  if (!conversation) throw new ApiError(404, 'Conversation not found');

  const isParticipant = conversation.participants.some(
    (p) => p.toString() === req.user._id.toString()
  );
  if (!isParticipant) throw new ApiError(403, 'You are not part of this conversation');

  const messages = await Message.find({ conversationId })
    .populate('sender', 'name profileImage')
    .sort({ createdAt: 1 });

  // Mark unread messages sent to this user as read
  await Message.updateMany(
    { conversationId, receiver: req.user._id, status: { $ne: 'read' } },
    { $set: { status: 'read' } }
  );
  conversation.unreadCounts.set(req.user._id.toString(), 0);
  await conversation.save();

  // Notify the sender's open socket (if any) that their messages were read
  const io = req.app.get('io');
  const onlineUsers = req.app.get('onlineUsers');
  if (io && onlineUsers) {
    const otherParticipant = conversation.participants.find(
      (p) => p.toString() !== req.user._id.toString()
    );
    const otherSocketId = onlineUsers.get(otherParticipant.toString());
    if (otherSocketId) {
      io.to(otherSocketId).emit('message:read', { conversationId, readBy: req.user._id });
    }
  }

  res.json({ success: true, data: { messages } });
});

module.exports = { sendMessage, getMessages };
