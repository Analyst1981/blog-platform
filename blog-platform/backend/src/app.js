const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./config/database');

// 加载环境变量
dotenv.config();

// 初始化Express应用
const app = express();

// 中间件
app.use(cors());
app.use(express.json());

// 数据库连接
db.authenticate()
  .then(() => console.log('Database connected...'))
  .catch(err => console.log('Error: ' + err));

// 导入路由
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');

// 使用路由
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/posts', postRoutes);
app.use('/api/v1/comments', commentRoutes);

// 根路由
app.get('/', (req, res) => {
  res.send('Blog API is running...');
});

// 监听端口
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});