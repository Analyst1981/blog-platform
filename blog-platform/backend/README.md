# 博客平台后端

这是博客平台的后端代码，基于Node.js + Express + MySQL构建。

## 功能特点
- 用户认证系统（注册、登录、JWT认证）
- 文章管理（创建、获取、更新、删除）
- 分类和标签管理
- 评论系统
- 点赞功能

## 技术栈
- Node.js
- Express
- MySQL
- Sequelize ORM
- JWT认证
- BCrypt密码加密

## 安装说明
1. 克隆代码仓库
```bash
git clone https://github.com/Analyst1981/blog-platform.git
cd blog-platform/backend
```

2. 安装依赖
```bash
npm install
```

3. 配置环境变量
创建 `.env` 文件，参考 `.env.example` 填写数据库连接信息和其他配置

4. 初始化数据库
```bash
mysql -u root -p < database/schema.sql
```

5. 启动服务器
```bash
# 开发环境
npm run dev

# 生产环境
npm start
```