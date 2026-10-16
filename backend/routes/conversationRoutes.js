const express = require('express');
const { protect } = require('../middleware/auth');
const {
  findOrCreateConversation,
  getConversations,
  getConversationById,
} = require('../controllers/conversationController');

const router = express.Router();

router.use(protect);
router.post('/', findOrCreateConversation);
router.get('/', getConversations);
router.get('/:id', getConversationById);

module.exports = router;
