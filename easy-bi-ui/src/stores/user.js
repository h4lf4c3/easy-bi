import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '')
  const userInfo = ref(null)

  // 登录
  async function login(username, password) {
    try {
      // 这里应该调用实际的登录 API
      const response = { token: 'mock_token' } // 模拟接口返回
      token.value = response.token
      localStorage.setItem('token', response.token)
      return response
    } catch (error) {
      throw error
    }
  }

  // 获取用户信息
  async function getUserInfo() {
    try {
      // 这里应该调用获取用户信息的 API
      const response = { // 模拟接口返回
        id: 1,
        username: 'admin',
        name: '管理员',
        avatar: '',
        roles: ['admin']
      }
      userInfo.value = response
      return response
    } catch (error) {
      throw error
    }
  }

  // 登出
  function logout() {
    token.value = ''
    userInfo.value = null
    localStorage.removeItem('token')
  }

  return {
    token,
    userInfo,
    login,
    getUserInfo,
    logout
  }
}) 