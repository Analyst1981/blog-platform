const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const auth = require('../middleware/auth');

// 添加评论
router.post('/posts/:post_id/comments', authController.addComment);

// 获取文章的所有评论
router.get('/posts/:post_id/comments', commentController.getCommentsByPostId);

module.exports = router;