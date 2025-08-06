import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getPostBySlug, likePost } from '../services/postService.js'
import { getCommentsByPostId, createComment } from '../services/commentService.js'
import { useAuthStore } from '../stores/authStore.js'
import { CommentForm, CommentList } from '../components/blog/index.jsx'
import { Button, Loader } from '../components/ui/index.jsx'

function Post() {
  const { slug } = useParams()
  const [newComment, setNewComment] = useState('')
  const queryClient = useQueryClient()
  const { isAuthenticated, user } = useAuthStore()

  // 获取文章详情
  const { data: post, isLoading: postLoading, error: postError } = useQuery(
    ['post', slug],
    () => getPostBySlug(slug)
  )

  // 获取评论
  const { data: comments, isLoading: commentsLoading, error: commentsError } = useQuery(
    ['comments', slug],
    () => post && getCommentsByPostId(post.id),
    { enabled: !!post }
  )

  // 点赞文章的mutation
  const likeMutation = useMutation(
    (postId) => likePost(postId),
    {
      onSuccess: () => {
        // 点赞成功后，失效文章查询以重新获取数据
        queryClient.invalidateQueries(['post', slug])
      }
    }
  )

  // 创建评论的mutation
  const createCommentMutation = useMutation(
    ({ postId, content, parentId = null }) => createComment(postId, content, parentId),
    {
      onSuccess: () => {
        // 创建评论成功后，失效评论查询以重新获取数据
        queryClient.invalidateQueries(['comments', slug])
        setNewComment('')
      }
    }
  )

  // 处理点赞
  const handleLike = () => {
    if (!isAuthenticated) {
      alert('请先登录')
      return
    }
    likeMutation.mutate(post.id)
  }

  // 处理评论提交
  const handleCommentSubmit = (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      alert('请先登录')
      return
    }
    if (!newComment.trim()) return

    createCommentMutation.mutate({ postId: post.id, content: newComment })
  }

  // 处理回复
  const handleReply = (commentId, content) => {
    createCommentMutation.mutate({ postId: post.id, content, parentId: commentId })
  }

  if (postLoading) return <Loader />;
  if (postError) return <div className="text-center py-10 text-red-500">加载文章失败: {postError.message}</div>
  if (!post) return <div className="text-center py-10">文章不存在</div>

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm mb-4">
          {post.category}
        </span>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
        <div className="flex items-center text-gray-600 mb-6">
          <img
            src={post.authorAvatar || 'https://picsum.photos/200/200'} // 默认头像
            alt={post.authorName}
            className="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <p className="font-medium">{post.authorName}</p>
            <p className="text-sm">{new Date(post.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* 文章特色图 */}
      {post.coverImage && (
        <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-64 md:h-80 object-cover"
          />
        </div>
      )}

      {/* 文章内容 */}
      <div className="prose mb-8" dangerouslySetInnerHTML={{ __html: post.content }}></div>

      {/* 文章标签 */}
      {post.tags && post.tags.length > 0 && (
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 点赞和分享 */}
      <div className="flex items-center justify-between mb-10 pb-6 border-b">
        <button
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
          onClick={handleLike}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={likeMutation.isLoading ? 'animate-pulse' : ''}
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <span>{post.likes}</span>
        </button>

        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
            分享
          </Button>
        </div>
      </div>

      {/* 评论区 */}
      <div>
        <h2 className="text-2xl font-bold mb-6">评论 ({comments?.length || 0})</h2>

        {/* 评论表单 */}
        {isAuthenticated && (
          <CommentForm
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onSubmit={handleCommentSubmit}
            isSubmitting={createCommentMutation.isLoading}
            placeholder="写下你的评论..."
          />
        )}

        {!isAuthenticated && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center">
            <p className="mb-3">登录后可以发表评论</p>
            <Button variant="primary" size="sm" asLink to="/login">
              登录
            </Button>
          </div>
        )}

        {/* 评论列表 */}
        {commentsLoading ? (
          <Loader />
        ) : commentsError ? (
          <div className="text-red-500">加载评论失败: {commentsError.message}</div>
        ) : (
          <CommentList comments={comments || []} onReply={handleReply} currentUser={user} />
        )}
      </div>
    </div>
  )
}

export default Post