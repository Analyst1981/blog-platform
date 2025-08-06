import { Link } from 'react-router-dom'
import { Button } from '../ui/index.jsx'

function Navbar({ isScrolled, isAuthenticated, user, logout }) {
  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold text-primary">博客平台</Link>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="font-medium hover:text-primary transition-colors">首页</Link>
          <Link to="/about" className="font-medium hover:text-primary transition-colors">关于</Link>

          {isAuthenticated ? (
            <>:
              <Link to="/admin" className="font-medium hover:text-primary transition-colors">管理</Link>
              <Link to="/create-post" className="font-medium hover:text-primary transition-colors">写文章</Link>
              <div className="relative group">
                <div className="flex items-center cursor-pointer">
                  <img
                    src={user.avatar || 'https://picsum.photos/200/200'} // 默认头像
                    alt={user.name}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  <span className="font-medium">{user.name}</span>
                </div>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block z-10">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    个人资料
                  </Link>
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    退出登录
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>:
              <Link to="/login" className="font-medium hover:text-primary transition-colors">登录</Link>
              <Link to="/register" className="font-medium hover:text-primary transition-colors">注册</Link>
            </>
          )}
        </nav>

        {/* 移动端菜单按钮 */}
        <div className="md:hidden">
          <Button variant="outline" size="sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </Button>
        </div>
      </div>
    </header>
  )
}

export default Navbar