const express = require('express');
const checkToken = require('../middleware/checkToken');
const { sendMessage, getChat } = require('../controllers/messageController');
const router = express.Router();

router.post('/sendmessage/:friendId',checkToken,sendMessage)
router.get('/getchat/:friendId',checkToken,getChat)



module.exports = router

