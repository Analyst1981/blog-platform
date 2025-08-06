## API设计文档

### 基础路径
所有API的基础路径为：`/api/v1`

### 用户认证API

#### 注册新用户
- URL: `/auth/register`
- 方法: POST
- 请求体:
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string"
  }
  ```
- 响应:
  ```json
  {
    "success": true,
    "message": "注册成功",
    "data": {
      "id": "number",
      "username": "string",
      "email": "string",
      "token": "string"
    }
  }
  ```

#### 用户登录
- URL: `/auth/login`
- 方法: POST
- 请求体:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- 响应:
  ```json
  {
    "success": true,
    "message": "登录成功",
    "data": {
      "id": "number",
      "username": "string",
      "email": "string",
      "token": "string"
    }
  }
  ```

### 文章API

#### 获取文章列表
- URL: `/posts`
- 方法: GET
- 查询参数:
  - page: 页码 (默认1)
  - limit: 每页数量 (默认10)
  - category: 分类ID
  - tag: 标签ID
  - search: 搜索关键词
- 响应:
  ```json
  {
    "success": true,
    "data": {
      "posts": [
        {
          "id": "number",
          "title": "string",
          "slug": "string",
          "excerpt": "string",
          "content": "string",
          "cover_image": "string",
          "created_at": "string",
          "updated_at": "string",
          "user": {
            "id": "number",
            "username": "string",
            "avatar": "string"
          },
          "categories": [
            {
              "id": "number",
              "name": "string"
            }
          ],
          "tags": [
            {
              "id": "number",
              "name": "string"
            }
          ],
          "comments_count": "number",
          "likes_count": "number"
        }
      ],
      "pagination": {
        "total": "number",
        "page": "number",
        "limit": "number",
        "pages": "number"
      }
    }
  }
  ```

#### 获取单篇文章
- URL: `/posts/:slug`
- 方法: GET
- 响应:
  ```json
  {
    "success": true,
    "data": {
      "id": "number",
      "title": "string",
      "slug": "string",
      "excerpt": "string",
      "content": "string",
      "cover_image": "string",
      "created_at": "string",
      "updated_at": "string",
      "user": {
        "id": "number",
        "username": "string",
        "avatar": "string"
      },
      "categories": [
        {
          "id": "number",
          "name": "string"
        }
      ],
      "tags": [
        {
          "id": "number",
          "name": "string"
        }
      ],
      "comments": [
        {
          "id": "number",
          "content": "string",
          "created_at": "string",
          "user": {
            "id": "number",
            "username": "string",
            "avatar": "string"
          },
          "replies": [
            // 嵌套评论
          ]
        }
      ],
      "comments_count": "number",
      "likes_count": "number"
    }
  }
  ```

### 评论API

#### 添加评论
- URL: `/posts/:id/comments`
- 方法: POST
- 请求体:
  ```json
  {
    "content": "string",
    "parent_id": "number" // 可选，回复评论时使用
  }
  ```
- 响应:
  ```json
  {
    "success": true,
    "message": "评论成功",
    "data": {
      "id": "number",
      "content": "string",
      "created_at": "string",
      "user": {
        "id": "number",
        "username": "string",
        "avatar": "string"
      }
    }
  }
  ```