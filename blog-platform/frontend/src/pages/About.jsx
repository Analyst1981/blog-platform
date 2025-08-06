import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getAboutInfo } from '../services/postService.js'
import { Loader } from '../components/ui/index.jsx'

function About() {
  const { data: aboutInfo, isLoading, error } = useQuery('about', getAboutInfo)
  const [mounted, setMounted] = useState(false)

  // 解决SSR/CSR不匹配问题
  useEffect(() => {
    setMounted(true)
  }, [])

  if (isLoading) return <Loader />;
  if (error) return <div className="text-center py-10 text-red-500">加载失败: {error.message}</div>

  return (
    <div className="prose max-w-3xl mx-auto">
      <h1>关于我</h1>
      {mounted && aboutInfo && (
        <div dangerouslySetInnerHTML={{ __html: aboutInfo.content }}></div>
      )}

      <div className="mt-10 bg-gray-50 p-6 rounded-lg">
        <h2>联系方式</h2>
        <ul>
          <li>邮箱: contact@example.com</li>
          <li>微信: example_wechat</li>
          <li>GitHub: <a href="https://github.com/example" target="_blank" rel="noopener noreferrer">github.com/example</a></li>
        </ul>
      </div>
    </div>
  )
}

export default About