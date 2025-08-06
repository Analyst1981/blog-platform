import api from './api.js'

// 登录
export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials)
  if (response.data.token) {
    localStorage.setItem('token', response.data.token)
    localStorage.setItem('user', JSON.stringify(response.data.user))
  }
  return response.data
}

// 注册
export const register = async (userData) => {
  const response = await api.post('/auth/register', userData)
  return response.data
}

// 获取用户列表
export const getUsers = async (page = 1, limit = 10, search = '') => {
  const response = await api.get(`/users?page=${page}&limit=${limit}&search=${search}`)
  return response.data
}

// 删除用户
export const deleteUser = async (userId) => {
  const response = await api.delete(`/users/${userId}`)
  return response.data
}

// 更新个人资料
export const updateProfile = async (formData) => {
  const response = await api.put('/users/profile', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  if (response.data.token) {
    localStorage.setItem('token', response.data.token)
    localStorage.setItem('user', JSON.stringify(response.data.user))
  }
  return response.data
}