import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// 认证状态管理
export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      // 设置认证状态
      setAuth: (user, token) => {
        set({
          user,
          token,
          isAuthenticated: !!token
        })
      },

      // 注销
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false
        })
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }),
    {
      name: 'auth-storage',
      getStorage: () => localStorage,
      partialize: (state) => ({ token: state.token, user: state.user })
    }
  )
)