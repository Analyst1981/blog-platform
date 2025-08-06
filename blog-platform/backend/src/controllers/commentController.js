const Comment = require('../models/Comment');
const Post = require('../models/Post');

// 添加评论
exports.addComment = async (req, res) => {
  try {
    const { content, parent_id } = req.body;
    const { post_id } = req.params;

    // 检查文章是否存在
    const post = await Post.findByPk(post_id);
    if (!post) {
      return res.status(404).json({ success: false, message: '文章不存在' });
    }

    // 创建评论
    const comment = await Comment.create({
      content,
      post_id,
      user_id: req.user ? req.user.id : null,
      parent_id: parent_id || null,
      status: req.user ? 'approved' : 'pending'
    });

    res.status(201).json({
      success: true,
      message: '评论成功',
      data: comment
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
};

// 获取文章的所有评论
exports.getCommentsByPostId = async (req, res) => {
  try {
    const { post_id } = req.params;

    // 检查文章是否存在
    const post = await Post.findByPk(post_id);
    if (!post) {
      return res.status(404).json({ success: false, message: '文章不存在' });
    }

    // 获取评论（包括嵌套评论）
    const comments = await Comment.findAll({
      where: {
        post_id,
        parent_id: null,
        status: 'approved'
      },
      include: [{
        model: Comment,
        as: 'replies',
        where: { status: 'approved' },
        required: false
      }]
    });

    res.status(200).json({
      success: true,
      data: comments
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
};