<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <img src="../assets/logo.svg" alt="Logo" class="logo" />
        <h2>Easy BI</h2>
        <p>商业智能分析平台</p>
      </div>
      <el-form
        ref="loginForm"
        :model="loginData"
        :rules="rules"
        class="login-form"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginData.username"
            placeholder="用户名"
            :prefix-icon="User"
            size="large"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginData.password"
            type="password"
            placeholder="密码"
            :prefix-icon="Lock"
            size="large"
            show-password
            @keyup.enter="handleLogin"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :loading="loading"
            class="login-button"
            size="large"
            @click="handleLogin"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'

const router = useRouter()
const loginForm = ref(null)
const loading = ref(false)

// 登录表单数据
const loginData = reactive({
  username: '',
  password: ''
})

// 表单验证规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
}

// 默认用户信息
const defaultUser = {
  username: 'admin',
  password: '123456'
}

// 处理登录
const handleLogin = async () => {
  if (!loginForm.value) return
  
  try {
    await loginForm.value.validate()
    loading.value = true
    
    // 模拟登录验证
    if (loginData.username === defaultUser.username && 
        loginData.password === defaultUser.password) {
      // 存储登录状态
      localStorage.setItem('token', 'mock_token')
      localStorage.setItem('userInfo', JSON.stringify({
        username: loginData.username,
        name: '管理员',
        avatar: ''
      }))
      
      setTimeout(() => {
        loading.value = false
        ElMessage.success('登录成功')
        router.push('/')
      }, 1000)
    } else {
      loading.value = false
      ElMessage.error('用户名或密码错误')
    }
  } catch (error) {
    loading.value = false
    console.error('登录验证失败:', error)
  }
}
</script>

<style scoped>
.login-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
}

.login-box {
  width: 400px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.login-header .logo {
  width: 64px;
  height: 64px;
  margin-bottom: 16px;
}

.login-header h2 {
  margin: 0;
  font-size: 24px;
  color: #333;
  margin-bottom: 8px;
}

.login-header p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.login-form .el-form-item {
  margin-bottom: 24px;
}

.login-button {
  width: 100%;
  height: 40px;
  border-radius: 20px;
  font-size: 16px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border: none;
}

.login-button:hover {
  background: linear-gradient(135deg, #5254cc 0%, #7a4ed3 100%);
}

:deep(.el-input__wrapper) {
  border-radius: 20px;
  padding: 0 15px;
}

:deep(.el-input__inner) {
  height: 40px;
}
</style> 