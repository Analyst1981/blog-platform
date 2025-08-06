const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// 注册用户
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 检查用户是否已存在
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ success: false, message: '用户已存在' });
    }

    // 密码加密
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 创建新用户
    const user = await User.create({
      username,
      email,
      password: hashedPassword
    });

    // 生成JWT
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });

    res.status(201).json({
      success: true,
      message: '注册成功',
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        token
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
};

// 用户登录
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 检查用户是否存在
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ success: false, message: '用户不存在' });
    }

    // 检查密码是否正确
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: '密码错误' });
    }

    // 生成JWT
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });

    res.status(200).json({
      success: true,
      message: '登录成功',
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        token
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
};

// 获取当前用户信息
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: '用户不存在' });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
};