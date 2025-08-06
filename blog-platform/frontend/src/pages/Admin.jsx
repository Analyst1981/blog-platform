import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getPosts, deletePost } from '../services/postService.js'
import { getUsers, deleteUser } from '../services/authService.js'
import { Button, Table, Pagination, SearchBar, ConfirmDialog } from '../components/ui/index.jsx'

function Admin() {
  const [activeTab, setActiveTab] = useState('posts')
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteId, setDeleteId] = useState(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const itemsPerPage = 10
  const queryClient = useQueryClient()

  // 获取文章列表
  const { data: posts, isLoading: postsLoading, error: postsError } = useQuery(
    ['adminPosts', page, searchTerm],
    () => getPosts(page, itemsPerPage, searchTerm)
  )

  // 获取用户列表
  const { data: users, isLoading: usersLoading, error: usersError } = useQuery(
    ['users', page, searchTerm],
    () => getUsers(page, itemsPerPage, searchTerm)
  )

  // 删除文章的mutation
  const deletePostMutation = useMutation(deletePost, {
    onSuccess: () => {
      queryClient.invalidateQueries(['adminPosts', page, searchTerm])
      setShowDeleteDialog(false)
    }
  })

  // 删除用户的mutation
  const deleteUserMutation = useMutation(deleteUser, {
    onSuccess: () => {
      queryClient.invalidateQueries(['users', page, searchTerm])
      setShowDeleteDialog(false)
    }
  })

  // 处理搜索
  const handleSearch = (term) => {
    setSearchTerm(term)
    setPage(1)
  }

  // 处理页码变化
  const handlePageChange = (newPage) => {
    setPage(newPage)
  }

  // 处理删除确认
  const handleDeleteConfirm = () => {
    if (activeTab === 'posts') {
      deletePostMutation.mutate(deleteId)
    } else {
      deleteUserMutation.mutate(deleteId)
    }
  }

  // 处理删除请求
  const handleDelete = (id) => {
    setDeleteId(id)
    setShowDeleteDialog(true)
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">管理后台</h1>

      <div className="mb-6 border-b">
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'posts' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('posts')}
        >
          文章管理
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'users' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('users')}
        >
          用户管理
        </button>
      </div>

      <div className="mb-6">
        <SearchBar onSearch={handleSearch} placeholder="搜索..." />
      </div>

      {activeTab === 'posts' ? (
        // 文章管理
        <div>
          <div className="flex justify-end mb-4">
            <Button variant="primary" asLink to="/create-post">
              创建文章
            </Button>
          </div>

          {postsLoading ? (
            <div className="text-center py-10">加载中...</div>
          ) : postsError ? (
            <div className="text-center py-10 text-red-500">加载失败: {postsError.message}</div>
          ) : (
            <>:
              <Table
                headers={['ID', '标题', '作者', '分类', '创建时间', '操作']}
                rows={posts?.data?.map((post) => [
                  post.id,
                  <Link key={post.id} to={`/post/${post.slug}`} className="text-primary hover:underline">
                    {post.title}
                  </Link>,
                  post.authorName,
                  post.category,
                  new Date(post.createdAt).toLocaleDateString(),
                  <div key={post.id} className="flex gap-2">
                    <Button variant="outline" size="sm" asLink to={`/create-post?id=${post.id}`}>
                      编辑
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(post.id)}>
                      删除
                    </Button>
                  </div>
                ])}
              />

              {posts?.totalPages > 1 && (
                <div className="mt-6 flex justify-center">
                  <Pagination
                    currentPage={page}
                    totalPages={posts.totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        // 用户管理
        <div>
          {usersLoading ? (
            <div className="text-center py-10">加载中...</div>
          ) : usersError ? (
            <div className="text-center py-10 text-red-500">加载失败: {usersError.message}</div>
          ) : (
            <>:
              <Table
                headers={['ID', '姓名', '邮箱', '角色', '注册时间', '操作']}
                rows={users?.data?.map((user) => [
                  user.id,
                  user.name,
                  user.email,
                  user.role,
                  new Date(user.createdAt).toLocaleDateString(),
                  <div key={user.id} className="flex gap-2">
                    <Button variant="danger" size="sm" onClick={() => handleDelete(user.id)} disabled={user.id === 1}>
                      删除
                    </Button>
                  </div>
                ])}
              />

              {users?.totalPages > 1 && (
                <div className="mt-6 flex justify-center">
                  <Pagination
                    currentPage={page}
                    totalPages={users.totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* 删除确认对话框 */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        title={activeTab === 'posts' ? '删除文章' : '删除用户'}
        message={`确定要删除${activeTab === 'posts' ? '这篇文章' : '这个用户'}吗？此操作不可撤销。`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteDialog(false)}
        isLoading={deletePostMutation.isLoading || deleteUserMutation.isLoading}
      />
    </div>
  )
}

export default Admin