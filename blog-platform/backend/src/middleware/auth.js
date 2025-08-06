const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
  // 获取token
  const token = req.header('x-auth-token');

  // 检查token是否存在
  if (!token) {
    return res.status(401).json({ success: false, message: '没有令牌，授权被拒绝' });
  }

  try {
    // 验证token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 将用户信息添加到请求对象
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: '令牌无效' });
  }
};