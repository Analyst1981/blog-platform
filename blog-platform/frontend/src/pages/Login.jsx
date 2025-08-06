import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { login } from '../services/authService.js'
import { useAuthStore } from '../stores/authStore.js'
import { Button, Input, FormError } from '../components/ui/index.jsx'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()

  // 登录mutation
  const loginMutation = useMutation(login, {
    onSuccess: (data) => {
      // 保存用户信息和token
      setAuth(data.user, data.token)
      navigate('/')
    },
    onError: (error) => {
      setErrors({ general: error.message || '登录失败，请检查您的邮箱和密码' })
    }
  })

  // 处理表单提交
  const handleSubmit = (e) => {
    e.preventDefault()
    setErrors({})

    // 简单验证
    if (!email) {
      setErrors({ email: '请输入邮箱' })
      return
    }
    if (!password) {
      setErrors({ password: '请输入密码' })
      return
    }

    // 提交登录请求
    loginMutation.mutate({ email, password })
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">登录</h2>

      <form onSubmit={handleSubmit}>
        {errors.general && <FormError>{errors.general}</FormError>}

        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 mb-2">邮箱</label>
          <Input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="请输入邮箱"
            error={errors.email}
          />
          {errors.email && <FormError>{errors.email}</FormError>}
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 mb-2">密码</label>
          <Input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="请输入密码"
            error={errors.password}
          />
          {errors.password && <FormError>{errors.password}</FormError>}
        </div>

        <Button variant="primary" type="submit" fullWidth disabled={loginMutation.isLoading}>
          {loginMutation.isLoading ? '登录中...' : '登录'}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          还没有账号？ <Link to="/register" className="text-primary hover:underline">立即注册</Link>
        </p>
      </div>
    </div>
  )
}

export default Login