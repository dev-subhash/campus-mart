const express = require('express');
const { protect } = require('../middleware/auth');
const { sendMessage, getMessages } = require('../controllers/messageController');

const router = express.Router();

router.use(protect);
router.post('/', sendMessage);
router.get('/:conversationId', getMessages);

module.exports = router;
