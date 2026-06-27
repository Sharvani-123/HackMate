const express = require('express');
const router = express.Router();
const { sendMessage, getConversation, getInbox, deleteMessage } = require('../controllers/message.controller');

router.get('/inbox', getInbox);
router.get('/:userId', getConversation);
router.post('/', sendMessage);
router.delete('/:messageId', deleteMessage);

module.exports = router;