import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createPost, updatePost, getPostById } from '../services/postService.js'
import { Button, Input, TextArea, FormError, Select } from '../components/ui/index.jsx'

function CreatePost() {
  const { id } = useParams()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('tech')
  const [tags, setTags] = useState('')
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const isEditing = !!id

  // 获取文章详情（编辑模式）
  const { data: post, isLoading, error } = useQuery(
    ['post', id],
    () => getPostById(id),
    { enabled: isEditing }
  )

  // 初始化表单数据（编辑模式）
  useEffect(() => {
    if (post) {
      setTitle(post.title)
      setContent(post.content)
      setCategory(post.category)
      setTags(post.tags.join(','))
    }
  }, [post])

  // 创建文章的mutation
  const createPostMutation = useMutation(createPost, {
    onSuccess: () => {
      queryClient.invalidateQueries(['posts'])
      navigate('/admin')
    },
    onError: (error) => {
      if (error.response && error.response.data && error.response.data.errors) {
        setErrors(error.response.data.errors)
      } else {
        setErrors({ general: error.message || '创建文章失败，请稍后再试' })
      }
    }
  })

  // 更新文章的mutation
  const updatePostMutation = useMutation(updatePost, {
    onSuccess: () => {
      queryClient.invalidateQueries(['posts'])
      navigate('/admin')
    },
    onError: (error) => {
      if (error.response && error.response.data && error.response.data.errors) {
        setErrors(error.response.data.errors)
      } else {
        setErrors({ general: error.message || '更新文章失败，请稍后再试' })
      }
    }
  })

  // 处理表单提交
  const handleSubmit = (e) => {
    e.preventDefault()
    setErrors({})

    // 简单验证
    if (!title) {
      setErrors({ title: '请输入标题' })
      return
    }
    if (!content) {
      setErrors({ content: '请输入内容' })
      return
    }
    if (!category) {
      setErrors({ category: '请选择分类' })
      return
    }

    // 处理标签
    const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag)

    // 提交请求
    if (isEditing) {
      updatePostMutation.mutate({ id, title, content, category, tags: tagsArray })
    } else {
      createPostMutation.mutate({ title, content, category, tags: tagsArray })
    }
  }

  if (isLoading) return <div className="text-center py-10">加载中...</div>
  if (error) return <div className="text-center py-10 text-red-500">加载失败: {error.message}</div>

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{isEditing ? '编辑文章' : '创建文章'}</h1>

      <form onSubmit={handleSubmit}>
        {errors.general && <FormError>{errors.general}</FormError>}

        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 mb-2">标题</label>
          <Input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="请输入文章标题"
            error={errors.title}
          />
          {errors.title && <FormError>{errors.title}</FormError>}
        </div>

        <div className="mb-4">
          <label htmlFor="category" className="block text-gray-700 mb-2">分类</label>
          <Select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            error={errors.category}
            options={[
              { value: 'tech', label: '技术' },
              { value: 'life', label: '生活' },
              { value: 'travel', label: '旅行' },
              { value: 'book', label: '读书' },
            ]}
          />
          {errors.category && <FormError>{errors.category}</FormError>}
        </div>

        <div className="mb-4">
          <label htmlFor="tags" className="block text-gray-700 mb-2">标签</label>
          <Input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="请输入标签，用逗号分隔"
            error={errors.tags}
          />
          {errors.tags && <FormError>{errors.tags}</FormError>}
        </div>

        <div className="mb-6">
          <label htmlFor="content" className="block text-gray-700 mb-2">内容</label>
          <TextArea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="请输入文章内容"
            error={errors.content}
            rows={15}
          />
          {errors.content && <FormError>{errors.content}</FormError>}
        </div>

        <div className="flex gap-4 justify-end">
          <Button variant="outline" onClick={() => navigate('/admin')}>取消</Button>
          <Button variant="primary" type="submit" disabled={createPostMutation.isLoading || updatePostMutation.isLoading}>
            {createPostMutation.isLoading || updatePostMutation.isLoading ? '提交中...' : '提交'}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default CreatePost