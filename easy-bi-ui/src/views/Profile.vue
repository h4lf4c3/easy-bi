<template>
  <div class="profile">
    <div class="page-header">
      <div class="header-title">
        <h2>个人信息</h2>
      </div>
      <el-button type="primary" class="edit-button" @click="handleEdit">
        <el-icon><Edit /></el-icon>编辑信息
      </el-button>
    </div>

    <el-row :gutter="24">
      <el-col :span="8">
        <el-card class="info-card" shadow="hover">
          <div class="avatar-container">
            <el-avatar :size="120" :src="userInfo.avatar || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'" />
            <h3 class="username">{{ userInfo.username }}</h3>
            <el-tag :type="getRoleType(userInfo.role)" effect="light" class="role-tag" round>
              {{ getRoleLabel(userInfo.role) }}
            </el-tag>
          </div>
          <div class="last-login">
            <p>上次登录时间</p>
            <span>{{ userInfo.lastLogin }}</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card class="detail-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>基本信息</span>
            </div>
          </template>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="姓名">
              {{ userInfo.name }}
            </el-descriptions-item>
            <el-descriptions-item label="用户名">
              {{ userInfo.username }}
            </el-descriptions-item>
            <el-descriptions-item label="邮箱">
              {{ userInfo.email }}
            </el-descriptions-item>
            <el-descriptions-item label="部门">
              {{ userInfo.department }}
            </el-descriptions-item>
            <el-descriptions-item label="角色">
              {{ getRoleLabel(userInfo.role) }}
            </el-descriptions-item>
            <el-descriptions-item label="状态">
              <el-tag :type="userInfo.status === 'active' ? 'success' : 'danger'" effect="light">
                {{ userInfo.status === 'active' ? '启用' : '禁用' }}
              </el-tag>
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
    </el-row>

    <!-- 编辑信息对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="编辑个人信息"
      width="580px"
      destroy-on-close
      center
      class="edit-dialog"
      :close-on-click-modal="false"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
        class="edit-form"
        status-icon
        label-position="top"
      >
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="头像">
              <el-upload
                class="avatar-uploader"
                action="#"
                :show-file-list="false"
                :auto-upload="false"
                :on-change="handleAvatarChange"
              >
                <el-avatar v-if="form.avatar" :size="100" :src="form.avatar" />
                <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input 
                v-model="form.name" 
                prefix-icon="UserFilled"
                placeholder="请输入姓名"
                class="custom-input"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input 
                v-model="form.email" 
                prefix-icon="Message"
                placeholder="请输入邮箱地址"
                class="custom-input"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="修改密码">
              <el-button type="primary" link @click="showChangePassword = true">
                点击修改密码
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 修改密码表单 -->
        <template v-if="showChangePassword">
          <el-divider>修改密码</el-divider>
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item label="原密码" prop="oldPassword">
                <el-input 
                  v-model="form.oldPassword"
                  type="password"
                  show-password
                  prefix-icon="Lock"
                  placeholder="请输入原密码"
                  class="custom-input"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="新密码" prop="newPassword">
                <el-input 
                  v-model="form.newPassword"
                  type="password"
                  show-password
                  prefix-icon="Lock"
                  placeholder="请输入新密码"
                  class="custom-input"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="确认新密码" prop="confirmPassword">
                <el-input 
                  v-model="form.confirmPassword"
                  type="password"
                  show-password
                  prefix-icon="Lock"
                  placeholder="请再次输入新密码"
                  class="custom-input"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </template>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false" plain class="cancel-button">取消</el-button>
          <el-button type="primary" @click="handleSubmit" class="submit-button">保存</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Edit, Plus, UserFilled, Message, Lock } from '@element-plus/icons-vue'

const dialogVisible = ref(false)
const showChangePassword = ref(false)
const formRef = ref(null)

// 模拟用户数据
const userInfo = reactive({
  id: 1,
  username: 'admin',
  name: '管理员',
  email: 'admin@example.com',
  role: 'admin',
  department: '技术部',
  lastLogin: '2024-03-31 10:00:00',
  status: 'active',
  avatar: ''
})

const form = reactive({
  name: '',
  email: '',
  avatar: '',
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const rules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  oldPassword: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== form.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

const getRoleType = (role) => {
  const types = {
    admin: 'danger',
    analyst: 'warning',
    user: 'info'
  }
  return types[role] || 'info'
}

const getRoleLabel = (role) => {
  const labels = {
    admin: '管理员',
    analyst: '分析师',
    user: '普通用户'
  }
  return labels[role] || role
}

const handleEdit = () => {
  form.name = userInfo.name
  form.email = userInfo.email
  form.avatar = userInfo.avatar
  showChangePassword.value = false
  dialogVisible.value = true
}

const handleAvatarChange = (file) => {
  form.avatar = URL.createObjectURL(file.raw)
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    // 这里添加更新用户信息的逻辑
    Object.assign(userInfo, {
      name: form.name,
      email: form.email,
      avatar: form.avatar
    })
    ElMessage.success('保存成功')
    dialogVisible.value = false
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}
</script>

<style scoped>
.profile {
  padding: 24px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 60px);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #ebeef5;
}

.header-title h2 {
  margin: 0;
  font-size: 22px;
  font-weight: 600;
  color: #303133;
  letter-spacing: 0.5px;
}

.edit-button {
  transition: all 0.3s;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 6px;
}

.edit-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.info-card,
.detail-card {
  border-radius: 8px;
  transition: all 0.3s;
  border: none;
  height: 100%;
}

.info-card:hover,
.detail-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.avatar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
}

.username {
  margin: 16px 0 8px;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.role-tag {
  border-radius: 15px;
  padding: 2px 12px;
  font-size: 12px;
  font-weight: normal;
}

.last-login {
  text-align: center;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
}

.last-login p {
  color: #909399;
  margin: 0 0 8px;
  font-size: 14px;
}

.last-login span {
  color: #606266;
  font-size: 14px;
}

.card-header {
  display: flex;
  align-items: center;
  color: #303133;
  font-size: 16px;
  font-weight: 600;
}

.edit-dialog :deep(.el-dialog__header) {
  padding: 24px 30px;
  margin-right: 0;
  border-bottom: 1px solid #ebeef5;
  background-color: #f9fafc;
}

.edit-dialog :deep(.el-dialog__title) {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  letter-spacing: 0.5px;
}

.edit-dialog :deep(.el-dialog__body) {
  padding: 30px 30px 20px;
}

.edit-dialog :deep(.el-dialog__footer) {
  padding: 20px 30px;
  border-top: 1px solid #ebeef5;
  background-color: #f9fafc;
}

.avatar-uploader {
  display: flex;
  justify-content: center;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  text-align: center;
  border: 1px dashed #d9d9d9;
  border-radius: 50%;
  cursor: pointer;
  line-height: 100px;
}

.avatar-uploader-icon:hover {
  border-color: #409eff;
}

.custom-input :deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px #dcdfe6 inset;
  border-radius: 6px;
  padding: 0 12px;
  transition: all 0.3s;
}

.custom-input :deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #c0c4cc inset;
}

.custom-input :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #409eff inset;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.cancel-button {
  padding: 9px 20px;
  border-radius: 6px;
  transition: all 0.3s;
}

.submit-button {
  padding: 9px 20px;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.3s;
}

.submit-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}
</style>