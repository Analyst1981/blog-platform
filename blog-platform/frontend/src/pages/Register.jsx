import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { register } from '../services/authService.js'
import { Button, Input, FormError } from '../components/ui/index.jsx'

function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  // 注册mutation
  const registerMutation = useMutation(register, {
    onSuccess: () => {
      navigate('/login', { state: { success: '注册成功，请登录' } })
    },
    onError: (error) => {
      if (error.response && error.response.data && error.response.data.errors) {
        setErrors(error.response.data.errors)
      } else {
        setErrors({ general: error.message || '注册失败，请稍后再试' })
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
    if (!password) {
      setErrors({ password: '请输入密码' })
      return
    }
    if (password !== confirmPassword) {
      setErrors({ confirmPassword: '两次密码输入不一致' })
      return
    }
    if (password.length < 6) {
      setErrors({ password: '密码长度至少为6位' })
      return
    }

    // 提交注册请求
    registerMutation.mutate({ name, email, password })
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">注册</h2>

      <form onSubmit={handleSubmit}>
        {errors.general && <FormError>{errors.general}</FormError>}

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
          />
          {errors.email && <FormError>{errors.email}</FormError>}
        </div>

        <div className="mb-4">
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

        <div className="mb-6">
          <label htmlFor="confirmPassword" className="block text-gray-700 mb-2">确认密码</label>
          <Input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="请再次输入密码"
            error={errors.confirmPassword}
          />
          {errors.confirmPassword && <FormError>{errors.confirmPassword}</FormError>}
        </div>

        <Button variant="primary" type="submit" fullWidth disabled={registerMutation.isLoading}>
          {registerMutation.isLoading ? '注册中...' : '注册'}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          已有账号？ <Link to="/login" className="text-primary hover:underline">立即登录</Link>
        </p>
      </div>
    </div>
  )
}

export default Register