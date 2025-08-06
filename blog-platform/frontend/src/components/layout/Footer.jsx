import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="bg-dark text-white py-10 mt-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">博客平台</h3>
            <p className="text-gray-400">
              一个功能齐全的个人博客平台，支持文章发布、评论、点赞等功能。
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">快速链接</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/" className="hover:text-white transition-colors">首页</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">关于</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">登录</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">注册</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">联系我们</h3>
            <ul className="space-y-2 text-gray-400">
              <li>邮箱: contact@example.com</li>
              <li>微信: example_wechat</li>
              <li>GitHub: <a href="https://github.com/example" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">github.com/example</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} 博客平台. 保留所有权利.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer