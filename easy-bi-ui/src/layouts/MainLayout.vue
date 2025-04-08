<template>
  <el-container class="layout-container">
    <el-header class="header">
      <div class="header-left">
        <div class="logo">
          <img src="../assets/logo.svg" alt="Logo" />
          <span>Easy BI</span>
        </div>
        <el-menu
          :default-active="activeMenu"
          class="header-menu"
          :router="true"
          mode="horizontal"
          background-color="#ffffff"
          text-color="#606266"
          active-text-color="#409EFF"
          :ellipsis="false"
        >
          <el-menu-item index="/">
            <el-icon><HomeFilled /></el-icon>
            <span>首页</span>
          </el-menu-item>
          <el-menu-item index="/users">
            <el-icon><User /></el-icon>
            <span>用户管理</span>
          </el-menu-item>
          <el-menu-item index="/datasources">
            <el-icon><Connection /></el-icon>
            <span>数据源管理</span>
          </el-menu-item>
          <el-menu-item index="/datasets">
            <el-icon><DataLine /></el-icon>
            <span>数据集管理</span>
          </el-menu-item>
          <el-menu-item index="/analysis">
            <el-icon><PieChart /></el-icon>
            <span>分析主题</span>
          </el-menu-item>
        </el-menu>
      </div>
      <div class="header-right">
        <el-dropdown @command="handleCommand">
          <span class="user-info">
            <el-avatar :size="32" :src="userStore.avatar || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'" />
            <span>{{ userStore.name || userStore.username }}</span>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile">个人信息</el-dropdown-item>
              <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  HomeFilled,
  User,
  Connection,
  DataLine,
  PieChart,
  Fold,
  Expand
} from '@element-plus/icons-vue'
import { useUserStore } from '../stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const isCollapse = ref(false)
const activeMenu = computed(() => route.path)

const toggleSidebar = () => {
  isCollapse.value = !isCollapse.value
}

const handleCommand = (command) => {
  switch (command) {
    case 'profile':
      router.push('/profile')
      break
    case 'logout':
      userStore.logout()
      router.push('/login')
      break
  }
}
</script>

<style scoped>
.layout-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background-color: #f5f7fa;
}

.header {
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  height: 60px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 1000;
}

.header-left {
  display: flex;
  align-items: center;
  height: 100%;
}

.logo {
  display: flex;
  align-items: center;
  padding: 0 24px;
  height: 100%;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
}

.logo img {
  width: 32px;
  height: 32px;
  margin-right: 12px;
}

.logo span {
  color: #ffffff;
  font-size: 20px;
  font-weight: 600;
}

.header-menu {
  border: none;
  height: 60px;
  padding: 0 20px;
}

.header-menu :deep(.el-menu-item) {
  height: 60px;
  line-height: 60px;
  padding: 0 20px;
  font-size: 15px;
  border-bottom: 2px solid transparent;
}

.header-menu :deep(.el-menu-item.is-active) {
  background-color: transparent;
  border-bottom: 2px solid #6366f1;
  color: #6366f1;
}

.header-menu :deep(.el-menu-item:hover) {
  background-color: rgba(99, 102, 241, 0.04);
  color: #6366f1;
}

.header-right {
  padding-right: 24px;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0 12px;
  height: 40px;
  border-radius: 20px;
  transition: all 0.3s;
}

.user-info:hover {
  background-color: rgba(0,0,0,0.04);
}

.user-info span {
  margin-left: 8px;
  color: #606266;
  font-size: 14px;
}

.el-main {
  padding: 24px;
  height: calc(100% - 60px);
  overflow-y: auto;
}

:deep(.el-menu--horizontal > .el-menu-item) {
  display: flex;
  align-items: center;
}

:deep(.el-menu--horizontal .el-menu-item .el-icon) {
  margin-right: 4px;
  font-size: 18px;
}
</style>