const express = require('express');
const { createPost, updatePost, deletePost, getAllPost, getYourPost, getfriendPost, commentPost, deleteComment, likeorDislike } = require('../controllers/postController');
const checkToken = require('../middleware/checkToken');
const router = express.Router();

router.post('/create',checkToken,createPost);
router.put('/update/:_id',updatePost);
router.delete('/delete/:_id',deletePost);
router.get('/getAllPost',getAllPost);
router.get('/getYourPost',checkToken,getYourPost)
router.get('/getFriendPost/:_id',getfriendPost)
router.post('/comment/:postId',checkToken,commentPost)
router.delete('/deleteComment/:commentId/:postId',deleteComment);
router.put('/likepost/:postId',checkToken,likeorDislike);

module.exports = router;