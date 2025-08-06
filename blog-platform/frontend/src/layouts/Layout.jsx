import { useState, useEffect } from 'react'
import { Outlet, Link } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore.js'
import { Navbar, Footer } from '../components/layout/index.jsx'

function Layout() {
  const [isScrolled, setIsScrolled] = useState(false)
  const { isAuthenticated, user, logout } = useAuthStore()

  // 监听滚动事件，用于导航栏样式变化
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      {/* 导航栏 */}
      <Navbar isScrolled={isScrolled} isAuthenticated={isAuthenticated} user={user} logout={logout} />

      {/* 主内容区 */}
      <main className="flex-grow container mx-auto px-4 py-8 max-w-5xl">
        <Outlet />
      </main>

      {/* 页脚 */}
      <Footer />
    </div>
  )
}

export default Layout