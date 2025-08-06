## 部署指南

### 环境要求
- Node.js 16.x 或更高版本
- MySQL 8.0 或更高版本
- Nginx (可选，用于反向代理)

### 后端部署

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
```env
# 数据库配置
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=blog_platform
DB_PORT=3306

# 服务器配置
PORT=5000
HOST=localhost

# 安全配置
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
```

4. 初始化数据库
```bash
mysql -u root -p < database/schema.sql
```

5. 启动服务器
```bash
# 开发环境
npm run dev

# 生产环境
npm run build
npm start
```

### 前端部署

1. 进入前端目录
```bash
cd blog-platform/frontend
```

2. 安装依赖
```bash
npm install
```

3. 配置环境变量
创建 `.env` 文件，参考 `.env.example` 填写API地址等配置
```env
VITE_API_URL=http://localhost:5000/api/v1
```

4. 构建项目
```bash
npm run build
```

5. 部署静态文件
将 `dist` 目录下的文件部署到Nginx或其他Web服务器

### Nginx配置示例
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        root /path/to/blog-platform/frontend/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 维护指南

1. 定期备份数据库
```bash
mysqldump -u root -p blog_platform > blog_platform_backup.sql
```

2. 更新代码
```bash
git pull
cd blog-platform/backend
npm install
npm run build
npm restart

cd ../frontend
npm install
npm run build
```

3. 监控服务器状态
可以使用 PM2 等工具监控Node.js进程
```bash
# 安装PM2
npm install -g pm2

# 启动后端服务
cd blog-platform/backend
npm run build
npm start --name "blog-backend"

# 查看状态
npm list
```

### 常见问题

1. 数据库连接失败
- 检查数据库服务是否启动
- 检查数据库配置是否正确
- 确保数据库用户有足够的权限

2. 后端无法启动
- 检查端口是否被占用
- 检查依赖是否安装完整
- 查看错误日志获取详细信息

3. 前端页面无法访问
- 检查Nginx配置是否正确
- 检查静态文件路径是否正确
- 清除浏览器缓存后重试