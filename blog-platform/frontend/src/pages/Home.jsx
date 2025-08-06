import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getPosts } from '../services/postService.js'
import { PostCard, Pagination } from '../components/blog/index.jsx'
import { SearchBar } from '../components/ui/index.jsx'

function Home() {
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [category, setCategory] = useState('all')
  const postsPerPage = 6

  // 使用React Query获取文章列表
  const { data: posts, isLoading, error } = useQuery(
    ['posts', page, searchTerm, category],
    () => getPosts(page, postsPerPage, searchTerm, category)
  )

  // 处理搜索
  const handleSearch = (term) => {
    setSearchTerm(term)
    setPage(1) // 搜索时重置到第一页
  }

  // 处理分类筛选
  const handleCategoryChange = (cat) => {
    setCategory(cat)
    setPage(1) // 切换分类时重置到第一页
  }

  // 处理页码变化
  const handlePageChange = (newPage) => {
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (isLoading) return <div className="text-center py-10">加载中...</div>
  if (error) return <div className="text-center py-10 text-red-500">加载失败: {error.message}</div>

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6 text-center">最新文章</h1>
        <SearchBar onSearch={handleSearch} placeholder="搜索文章..." />
      </div>

      {/* 分类筛选 */}
      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        <button
          className={`px-4 py-2 rounded-full ${category === 'all' ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
          onClick={() => handleCategoryChange('all')}
        >
          全部
        </button>
        <button
          className={`px-4 py-2 rounded-full ${category === 'tech' ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
          onClick={() => handleCategoryChange('tech')}
        >
          技术
        </button>
        <button
          className={`px-4 py-2 rounded-full ${category === 'life' ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
          onClick={() => handleCategoryChange('life')}
        >
          生活
        </button>
        <button
          className={`px-4 py-2 rounded-full ${category === 'travel' ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
          onClick={() => handleCategoryChange('travel')}
        >
          旅行
        </button>
      </div>

      {/* 文章列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts?.data?.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {/* 分页 */}
      {posts?.totalPages > 1 && (
        <div className="mt-10 flex justify-center">
          <Pagination
            currentPage={page}
            totalPages={posts.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  )
}

export default Home