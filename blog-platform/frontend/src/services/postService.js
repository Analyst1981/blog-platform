import api from './api.js'

// 获取文章列表
export const getPosts = async (page = 1, limit = 6, search = '', category = 'all') => {
  const response = await api.get(`/posts?page=${page}&limit=${limit}&search=${search}&category=${category}`)
  return response.data
}

// 根据slug获取文章
export const getPostBySlug = async (slug) => {
  const response = await api.get(`/posts/${slug}`)
  return response.data
}

// 根据id获取文章
export const getPostById = async (id) => {
  const response = await api.get(`/posts/id/${id}`)
  return response.data
}

// 创建文章
export const createPost = async (postData) => {
  const response = await api.post('/posts', postData)
  return response.data
}

// 更新文章
export const updatePost = async ({ id, ...postData }) => {
  const response = await api.put(`/posts/${id}`, postData)
  return response.data
}

// 删除文章
export const deletePost = async (postId) => {
  const response = await api.delete(`/posts/${postId}`)
  return response.data
}

// 点赞文章
export const likePost = async (postId) => {
  const response = await api.post(`/posts/${postId}/like`)
  return response.data
}

// 获取关于页面信息
export const getAboutInfo = async () => {
  const response = await api.get('/about')
  return response.data
}