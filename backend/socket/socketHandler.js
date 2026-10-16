const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Maps userId (string) -> socketId, kept on the Express app instance so
// controllers can reach it (e.g. to emit a new-message event).
const onlineUsers = new Map();

const initSocket = (io, app) => {
  app.set('onlineUsers', onlineUsers);

  // Authenticate every socket connection using the same JWT used for REST
  io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.split(' ')[1];

      if (!token) return next(new Error('Authentication required'));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (!user || !user.isActive) return next(new Error('Authentication failed'));

      socket.userId = user._id.toString();
      next();
    } catch (err) {
      next(new Error('Authentication failed'));
    }
  });

  io.on('connection', (socket) => {
    const { userId } = socket;

    // Avoid duplicate sockets per user: only keep the latest connection
    onlineUsers.set(userId, socket.id);
    io.emit('presence:update', { userId, online: true });

    socket.join(`user:${userId}`);

    // Typing indicator relay
    socket.on('typing:start', ({ conversationId, toUserId }) => {
      const targetSocketId = onlineUsers.get(toUserId);
      if (targetSocketId) {
        io.to(targetSocketId).emit('typing:start', { conversationId, fromUserId: userId });
      }
    });

    socket.on('typing:stop', ({ conversationId, toUserId }) => {
      const targetSocketId = onlineUsers.get(toUserId);
      if (targetSocketId) {
        io.to(targetSocketId).emit('typing:stop', { conversationId, fromUserId: userId });
      }
    });

    // Client can ask whether a specific user is online
    socket.on('presence:check', (targetUserId, callback) => {
      const isOnline = onlineUsers.has(targetUserId);
      if (typeof callback === 'function') callback({ online: isOnline });
    });

    socket.on('disconnect', () => {
      // Only clear if this socket is still the registered one for the user
      if (onlineUsers.get(userId) === socket.id) {
        onlineUsers.delete(userId);
        io.emit('presence:update', { userId, online: false });
      }
    });
  });
};

module.exports = { initSocket, onlineUsers };
