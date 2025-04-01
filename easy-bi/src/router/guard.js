import { useUserStore } from '../stores/user'

// 白名单路由（不需要登录就可以访问的路由）
const whiteList = ['/login']

export function setupRouterGuard(router) {
  router.beforeEach(async (to, from, next) => {
    const userStore = useUserStore()
    const token = userStore.token

    // 有 token 说明已登录
    if (token) {
      if (to.path === '/login') {
        // 如果已登录，访问登录页则重定向到首页
        next({ path: '/' })
      } else {
        // 如果用户信息不存在，先获取用户信息
        if (!userStore.userInfo) {
          try {
            await userStore.getUserInfo()
            next()
          } catch (error) {
            // 获取用户信息失败，可能是 token 过期
            userStore.logout()
            next(`/login?redirect=${to.path}`)
          }
        } else {
          next()
        }
      }
    } else {
      // 没有 token
      if (whiteList.includes(to.path)) {
        // 在白名单中，直接进入
        next()
      } else {
        // 不在白名单中，重定向到登录页
        next(`/login?redirect=${to.path}`)
      }
    }
  })
} 