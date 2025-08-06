import { Routes, Route } from 'react-router-dom'
import Layout from './layouts/Layout.jsx'
import Home from './pages/Home.jsx'
import Post from './pages/Post.jsx'
import About from './pages/About.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Admin from './pages/Admin.jsx'
import CreatePost from './pages/CreatePost.jsx'
import Profile from './pages/Profile.jsx'
import { useAuthStore } from './stores/authStore.js'

function App() {
  const { isAuthenticated } = useAuthStore()

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="post/:slug" element={<Post />} />
        <Route path="about" element={<About />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="profile" element={<Profile />} />

        {/* 受保护的路由 */}
        <Route
          path="admin"
          element={isAuthenticated ? <Admin /> : <Login />}
        />
        <Route
          path="create-post"
          element={isAuthenticated ? <CreatePost /> : <Login />}
        />
      </Route>
    </Routes>
  )
}

export default App