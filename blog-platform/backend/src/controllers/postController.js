const Post = require('../models/Post');
const Category = require('../models/Category');
const Tag = require('../models/Tag');
const User = require('../models/User');
const { Op } = require('sequelize');

// 创建文章
exports.createPost = async (req, res) => {
  try {
    const { title, slug, excerpt, content, cover_image, category_ids, tag_ids, status } = req.body;

    // 检查slug是否已存在
    const slugExists = await Post.findOne({ where: { slug } });
    if (slugExists) {
      return res.status(400).json({ success: false, message: 'slug已存在' });
    }

    // 创建文章
    const post = await Post.create({
      title,
      slug,
      excerpt,
      content,
      cover_image,
      user_id: req.user.id,
      status: status || 'draft'
    });

    // 关联分类
    if (category_ids && category_ids.length > 0) {
      await post.setCategories(category_ids);
    }

    // 关联标签
    if (tag_ids && tag_ids.length > 0) {
      await post.setTags(tag_ids);
    }

    res.status(201).json({
      success: true,
      message: '文章创建成功',
      data: post
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
};

// 获取文章列表
exports.getPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, tag, search, status } = req.query;
    const offset = (page - 1) * limit;

    // 构建查询条件
    const where = {};
    if (status) where.status = status;
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { excerpt: { [Op.like]: `%${search}%` } },
        { content: { [Op.like]: `%${search}%` } }
      ];
    }

    // 查询文章
    const { count, rows: posts } = await Post.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
      include: [
        { model: User, attributes: ['id', 'username', 'avatar'] },
        { model: Category, attributes: ['id', 'name', 'slug'] },
        { model: Tag, attributes: ['id', 'name', 'slug'] }
      ]
    });

    // 按分类过滤
    if (category) {
      const filteredPosts = posts.filter(post => {
        return post.Categories.some(cat => cat.id === parseInt(category) || cat.slug === category);
      });
      return res.status(200).json({
        success: true,
        data: {
          posts: filteredPosts,
          pagination: {
            total: filteredPosts.length,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(filteredPosts.length / limit)
          }
        }
      });
    }

    // 按标签过滤
    if (tag) {
      const filteredPosts = posts.filter(post => {
        return post.Tags.some(t => t.id === parseInt(tag) || t.slug === tag);
      });
      return res.status(200).json({
        success: true,
        data: {
          posts: filteredPosts,
          pagination: {
            total: filteredPosts.length,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(filteredPosts.length / limit)
          }
        }
      });
    }

    res.status(200).json({
      success: true,
      data: {
        posts,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
};

// 获取单篇文章
exports.getPostBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    // 查询文章
    const post = await Post.findOne({
      where: { slug },
      include: [
        { model: User, attributes: ['id', 'username', 'avatar'] },
        { model: Category, attributes: ['id', 'name', 'slug'] },
        { model: Tag, attributes: ['id', 'name', 'slug'] }
      ]
    });

    if (!post) {
      return res.status(404).json({ success: false, message: '文章不存在' });
    }

    // 更新浏览量
    post.viewCount += 1;
    await post.save();

    res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
};

// 更新文章
exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, slug, excerpt, content, cover_image, category_ids, tag_ids, status } = req.body;

    // 检查文章是否存在
    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({ success: false, message: '文章不存在' });
    }

    // 检查用户权限
    if (post.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: '没有权限修改此文章' });
    }

    // 检查slug是否已存在（排除当前文章）
    if (slug && slug !== post.slug) {
      const slugExists = await Post.findOne({ where: { slug } });
      if (slugExists) {
        return res.status(400).json({ success: false, message: 'slug已存在' });
      }
    }

    // 更新文章
    await post.update({
      title,
      slug,
      excerpt,
      content,
      cover_image,
      status
    });

    // 更新分类
    if (category_ids !== undefined) {
      await post.setCategories(category_ids);
    }

    // 更新标签
    if (tag_ids !== undefined) {
      await post.setTags(tag_ids);
    }

    res.status(200).json({
      success: true,
      message: '文章更新成功',
      data: post
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
};

// 删除文章
exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    // 检查文章是否存在
    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({ success: false, message: '文章不存在' });
    }

    // 检查用户权限
    if (post.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: '没有权限删除此文章' });
    }

    // 删除文章
    await post.destroy();

    res.status(200).json({
      success: true,
      message: '文章删除成功'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
};