import { useState } from 'react'
import { formatRelativeTime } from '../../utils/helpers.js'
import { Button, CommentForm } from '../ui/index.jsx'

function Comment({ comment, onReply, currentUser, isReply = false }) {
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [replyContent, setReplyContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleReplySubmit = (e) => {
    e.preventDefault()
    if (!replyContent.trim()) return

    setIsSubmitting(true)
    onReply(comment.id, replyContent)
      .then(() => {
        setReplyContent('')
        setShowReplyForm(false)
      })
      .finally(() => {
        setIsSubmitting(false)
      })
  }

  return (
    <div className={`mb-4 ${isReply ? 'pl-6 border-l-2 border-gray-200' : ''}`}>
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center">
            <img
              src={comment.userAvatar || 'https://picsum.photos/200/200'} // 默认头像
              alt={comment.userName}
              className="w-8 h-8 rounded-full mr-3"
            />
            <div>
              <p className="font-medium text-sm">{comment.userName}</p>
              <p className="text-gray-500 text-xs">{formatRelativeTime(comment.createdAt)}</p>
            </div>
          </div>
          {currentUser && currentUser.id === comment.userId && (
            <Button variant="text" size="sm" className="text-red-500">删除</Button>
          )}
        </div>
        <p className="text-gray-800 text-sm mb-2">{comment.content}</p>
        <div className="flex items-center text-sm text-gray-500">
          <Button variant="text" size="sm" onClick={() => setShowReplyForm(!showReplyForm)}>
            回复
          </Button>
          <span className="mx-2">·</span>
          <Button variant="text" size="sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-1"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {comment.likes}
          </Button>
        </div>
      </div>

      {showReplyForm && (
        <div className="mt-3">
          <CommentForm
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            onSubmit={handleReplySubmit}
            isSubmitting={isSubmitting}
            placeholder="写下你的回复..."
            submitText="回复"
            cancelText="取消"
            onCancel={() => setShowReplyForm(false)}
          />
        </div>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3">
          {comment.replies.map((reply) => (
            <Comment
              key={reply.id}
              comment={reply}
              onReply={onReply}
              currentUser={currentUser}
              isReply={true}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function CommentList({ comments, onReply, currentUser }) {
  if (!comments || comments.length === 0) {
    return <p className="text-gray-500 text-center py-6">暂无评论</p>
  }

  return (
    <div className="mt-6 space-y-4">
      {comments.map((comment) => (
        // 只渲染顶级评论（非回复）
        {!comment.parentId && (
          <Comment
            key={comment.id}
            comment={comment}
            onReply={onReply}
            currentUser={currentUser}
          />
        )}
      ))}
    </div>
  )
}

export default CommentList