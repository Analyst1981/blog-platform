import api from './api.js'

// 获取文章评论
export const getCommentsByPostId = async (postId) => {
  const response = await api.get(`/comments/post/${postId}`)
  return response.data
}

// 创建评论
export const createComment = async (postId, content, parentId = null) => {
  const response = await api.post('/comments', {
    postId,
    content,
    parentId
  })
  return response.data
}

// 点赞评论
export const likeComment = async (commentId) => {
  const response = await api.post(`/comments/${commentId}/like`)
  return response.data
}

// 删除评论
export const deleteComment = async (commentId) => {
  const response = await api.delete(`/comments/${commentId}`)
  return response.data
}