const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const auth = require('../middleware/auth');

// 创建文章
router.post('/', auth, postController.createPost);

// 获取文章列表
router.get('/', postController.getPosts);

// 获取单篇文章
router.get('/:slug', postController.getPostBySlug);

// 更新文章
router.put('/:id', auth, postController.updatePost);

// 删除文章
router.delete('/:id', auth, postController.deletePost);

module.exports = router;