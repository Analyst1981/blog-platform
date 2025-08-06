import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateProfile } from '../services/authService.js'
import { useAuthStore } from '../stores/authStore.js'
import { Button, Input, FormError, AvatarUpload } from '../components/ui/index.jsx'

function Profile() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [avatar, setAvatar] = useState(null)
  const [errors, setErrors] = useState({})
  const { user, setAuth } = useAuthStore()
  const queryClient = useQueryClient()

  // 初始化表单数据
  useState(() => {
    if (user) {
      setName(user.name)
      setEmail(user.email)
    }
  }, [user])

  // 更新个人资料的mutation
  const updateProfileMutation = useMutation(updateProfile, {
    onSuccess: (data) => {
      // 更新本地存储的用户信息
      setAuth(data.user, data.token)
      setErrors({ success: '个人资料更新成功' })
    },
    onError: (error) => {
      if (error.response && error.response.data && error.response.data.errors) {
        setErrors(error.response.data.errors)
      } else {
        setErrors({ general: error.message || '更新失败，请稍后再试' })
      }
    }
  })

  // 处理表单提交
  const handleSubmit = (e) => {
    e.preventDefault()
    setErrors({})

    // 简单验证
    if (!name) {
      setErrors({ name: '请输入姓名' })
      return
    }
    if (!email) {
      setErrors({ email: '请输入邮箱' })
      return
    }
    if (password && password.length < 6) {
      setErrors({ password: '密码长度至少为6位' })
      return
    }
    if (password !== confirmPassword) {
      setErrors({ confirmPassword: '两次密码输入不一致' })
      return
    }

    // 准备表单数据
    const formData = new FormData()
    formData.append('name', name)
    formData.append('email', email)
    if (password) formData.append('password', password)
    if (avatar) formData.append('avatar', avatar)

    // 提交请求
    updateProfileMutation.mutate(formData)
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">个人资料</h2>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {errors.general && <FormError>{errors.general}</FormError>}
        {errors.success && <FormError type="success">{errors.success}</FormError>}

        <div className="flex flex-col items-center mb-6">
          <AvatarUpload
            initialAvatar={user?.avatar}
            onAvatarChange={(file) => setAvatar(file)}
            isLoading={updateProfileMutation.isLoading}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 mb-2">姓名</label>
          <Input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="请输入姓名"
            error={errors.name}
          />
          {errors.name && <FormError>{errors.name}</FormError>}
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 mb-2">邮箱</label>
          <Input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="请输入邮箱"
            error={errors.email}
            disabled
          />
          {errors.email && <FormError>{errors.email}</FormError>}
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 mb-2">新密码 (选填)</label>
          <Input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="请输入新密码"
            error={errors.password}
          />
          {errors.password && <FormError>{errors.password}</FormError>}
        </div>

        <div className="mb-6">
          <label htmlFor="confirmPassword" className="block text-gray-700 mb-2">确认新密码 (选填)</label>
          <Input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="请再次输入新密码"
            error={errors.confirmPassword}
          />
          {errors.confirmPassword && <FormError>{errors.confirmPassword}</FormError>}
        </div>

        <Button variant="primary" type="submit" fullWidth disabled={updateProfileMutation.isLoading}>
          {updateProfileMutation.isLoading ? '更新中...' : '更新资料'}
        </Button>
      </form>
    </div>
  )
}

export default Profile