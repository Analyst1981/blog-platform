import { Link } from 'react-router-dom'
import { formatDate } from '../../utils/helpers.js'
import { Button } from '../ui/index.jsx'

function PostCard({ post }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {post.coverImage && (
        <div className="h-48 overflow-hidden">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
      )}
      <div className="p-6">
        <div className="flex justify-between items-center mb-3">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
            {post.category}
          </span>
          <span className="text-gray-500 text-sm">{formatDate(post.createdAt)}</span>
        </div>
        <h3 className="text-xl font-bold mb-3 line-clamp-2">
          <Link to={`/post/${post.slug}`} className="hover:text-primary transition-colors">
            {post.title}
          </Link>
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img
              src={post.authorAvatar || 'https://picsum.photos/200/200'} // 默认头像
              alt={post.authorName}
              className="w-8 h-8 rounded-full mr-2"
            />
            <span className="text-sm font-medium">{post.authorName}</span>
          </div>
          <div className="flex items-center text-gray-500 space-x-3">
            <span className="flex items-center text-sm">
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
                className="mr-1"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              {post.comments}
            </span>
            <span className="flex items-center text-sm">
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
                className="mr-1"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {post.likes}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostCard