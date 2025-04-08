<template>
  <div class="users">
    <div class="page-header">
      <div class="header-title">
        <h2>用户管理</h2>
      </div>
      <el-button type="primary" class="add-button" @click="handleAdd">
        <el-icon><Plus /></el-icon>添加用户
      </el-button>
    </div>

    <el-card class="search-card" shadow="hover">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="用户名" class="search-item">
          <el-input 
            v-model="searchForm.username" 
            placeholder="请输入用户名" 
            prefix-icon="User"
            clearable
          />
        </el-form-item>
        <el-form-item label="角色" class="search-item">
          <el-select v-model="searchForm.role" placeholder="请选择角色" clearable style="width: 100%">
            <el-option label="管理员" value="admin" />
            <el-option label="分析师" value="analyst" />
            <el-option label="普通用户" value="user" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" class="search-item">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 100%">
            <el-option label="启用" value="active" />
            <el-option label="禁用" value="inactive" />
          </el-select>
        </el-form-item>
        <el-form-item class="search-buttons">
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>搜索
          </el-button>
          <el-button @click="handleReset">
            <el-icon><Refresh /></el-icon>重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="table-card" shadow="hover">
      <el-table 
        :data="users" 
        style="width: 100%" 
        v-loading="loading"
        row-class-name="table-row"
        header-row-class-name="table-header"
        :border="false"
        highlight-current-row
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="username" label="用户名">
          <template #default="{ row }">
            <div class="user-info">
              <el-avatar :size="32" :src="row.avatar || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'" />
              <span>{{ row.username }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="role" label="角色">
          <template #default="{ row }">
            <el-tag 
              :type="getRoleType(row.role)" 
              effect="light" 
              class="role-tag"
              round
            >
              {{ getRoleLabel(row.role) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="department" label="部门" />
        <el-table-column prop="lastLogin" label="最后登录时间" width="180" />
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <el-switch
              v-model="row.status"
              :active-value="'active'"
              :inactive-value="'inactive'"
              @change="() => handleToggleStatus(row)"
              inline-prompt
              active-text="启用"
              inactive-text="禁用"
              class="status-switch"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <div class="action-buttons">
              <el-tooltip content="编辑" placement="top" :effect="'light'">
                <el-button type="primary" circle @click="handleEdit(row)">
                  <el-icon><Edit /></el-icon>
                </el-button>
              </el-tooltip>
              <el-tooltip content="删除" placement="top" :effect="'light'">
                <el-button type="danger" circle @click="handleDelete(row)">
                  <el-icon><Delete /></el-icon>
                </el-button>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <div class="pagination-container">
      <el-pagination
        :current-page="currentPage"
        :page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        background
        class="pagination"
      />
    </div>

    <!-- 添加/编辑用户对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '添加用户' : '编辑用户'"
      width="580px"
      destroy-on-close
      center
      class="user-dialog"
      :close-on-click-modal="false"
      top="5vh"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
        class="user-form"
        status-icon
        label-position="top"
      >
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="用户名" prop="username">
              <el-input 
                v-model="form.username" 
                :disabled="dialogType === 'edit'" 
                prefix-icon="User"
                placeholder="请输入用户名"
                class="custom-input"
              />
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
          <el-col :span="12">
            <el-form-item label="角色" prop="role">
              <el-select 
                v-model="form.role" 
                placeholder="请选择角色" 
                class="custom-select"
              >
                <el-option label="管理员" value="admin" />
                <el-option label="分析师" value="analyst" />
                <el-option label="普通用户" value="user" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门" prop="department">
              <el-input 
                v-model="form.department" 
                prefix-icon="OfficeBuilding" 
                placeholder="请输入部门"
                class="custom-input"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="dialogType === 'add'">
            <el-form-item label="密码" prop="password">
              <el-input 
                v-model="form.password" 
                type="password" 
                show-password 
                prefix-icon="Lock" 
                placeholder="请输入密码"
                class="custom-input"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="dialogType === 'add'">
            <el-form-item label="确认密码" prop="confirmPassword">
              <el-input 
                v-model="form.confirmPassword" 
                type="password" 
                show-password 
                prefix-icon="Lock" 
                placeholder="请再次输入密码"
                class="custom-input"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false" plain class="cancel-button">取消</el-button>
          <el-button type="primary" @click="handleSubmit" class="submit-button">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  Plus, 
  Search, 
  Refresh, 
  Edit, 
  Delete, 
  User, 
  UserFilled, 
  Message, 
  Lock, 
  OfficeBuilding 
} from '@element-plus/icons-vue'

const loading = ref(false)
const dialogVisible = ref(false)
const dialogType = ref('add')
const formRef = ref(null)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

// 搜索表单
const searchForm = reactive({
  username: '',
  role: '',
  status: ''
})

// 模拟数据
const users = ref([
  {
    id: 1,
    username: 'admin',
    name: '管理员',
    email: 'admin@example.com',
    role: 'admin',
    department: '技术部',
    lastLogin: '2024-03-31 10:00:00',
    status: 'active'
  },
  {
    id: 2,
    username: 'analyst',
    name: '分析师',
    email: 'analyst@example.com',
    role: 'analyst',
    department: '数据分析部',
    lastLogin: '2024-03-31 09:30:00',
    status: 'active'
  }
])

const form = reactive({
  username: '',
  name: '',
  email: '',
  role: '',
  department: '',
  password: '',
  confirmPassword: ''
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }],
  department: [{ required: true, message: '请输入部门', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== form.password) {
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

const handleAdd = () => {
  dialogType.value = 'add'
  Object.keys(form).forEach(key => form[key] = '')
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogType.value = 'edit'
  Object.keys(form).forEach(key => {
    if (key !== 'password' && key !== 'confirmPassword') {
      form[key] = row[key]
    }
  })
  dialogVisible.value = true
}

const handleDelete = (row) => {
  ElMessageBox.confirm(
    '确定要删除该用户吗？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    users.value = users.value.filter(item => item.id !== row.id)
    ElMessage.success('删除成功')
  })
}

const handleToggleStatus = (row) => {
  row.status = row.status === 'active' ? 'inactive' : 'active'
  ElMessage.success(row.status === 'active' ? '已启用' : '已禁用')
}

const handleSearch = () => {
  // 实现搜索逻辑
  ElMessage.success('搜索成功')
}

const handleReset = () => {
  Object.keys(searchForm).forEach(key => searchForm[key] = '')
  handleSearch()
}

const handleSizeChange = (val) => {
  pageSize.value = val
  handleSearch()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  handleSearch()
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    if (dialogType.value === 'add') {
      users.value.push({
        id: users.value.length + 1,
        ...form,
        lastLogin: new Date().toLocaleString(),
        status: 'active'
      })
      ElMessage.success('添加成功')
    } else {
      const index = users.value.findIndex(item => item.id === form.id)
      if (index !== -1) {
        users.value[index] = {
          ...users.value[index],
          ...form,
          lastLogin: new Date().toLocaleString()
        }
        ElMessage.success('更新成功')
      }
    }
    dialogVisible.value = false
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}
</script>

<style scoped>
.users {
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

.header-title {
  display: flex;
  align-items: center;
}

.page-header h2 {
  margin: 0;
  font-size: 22px;
  font-weight: 600;
  color: #303133;
  letter-spacing: 0.5px;
}

.add-button {
  transition: all 0.3s;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 6px;
}

.add-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.search-card {
  margin-bottom: 20px;
  border-radius: 8px;
  transition: all 0.3s;
  border: none;
}

.search-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.search-form {
  display: flex;
  align-items: center;
  padding: 4px 0;
  flex-wrap: wrap;
}

.search-item {
  min-width: 220px;
  margin-right: 16px;
  margin-bottom: 10px;
}

.search-form .el-select {
  width: 100%;
}

.search-form .el-form-item__content {
  width: 100%;
}

.search-form .el-input,
.search-form .el-select {
  width: 100%;
}

.search-form :deep(.el-select__popper) {
  min-width: 100% !important;
}

.search-buttons {
  margin-left: auto;
}

.table-card {
  border-radius: 8px;
  margin-bottom: 20px;
  transition: all 0.3s;
  border: none;
}

.table-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.table-header {
  background-color: #f5f7fa !important;
  color: #606266;
  font-weight: 600;
  font-size: 14px;
  height: 50px;
}

.table-row {
  transition: all 0.3s;
}

.table-row:hover {
  background-color: #f0f9ff !important;
  transform: translateY(-1px);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.role-tag {
  border-radius: 15px;
  padding: 2px 12px;
  font-size: 12px;
  font-weight: normal;
}

.status-switch {
  --el-switch-on-color: #13ce66;
  --el-switch-off-color: #ff4949;
}

.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.action-buttons .el-button {
  padding: 6px;
  transition: all 0.3s;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.action-buttons .el-button:hover {
  transform: translateY(-2px);
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  padding: 12px 16px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  border: none;
}

.pagination {
  padding: 5px 0;
}

.user-dialog :deep(.el-dialog__header) {
  padding: 24px 30px;
  margin-right: 0;
  border-bottom: 1px solid #ebeef5;
  background-color: #f9fafc;
}

.user-dialog :deep(.el-dialog__title) {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  letter-spacing: 0.5px;
}

.user-dialog :deep(.el-dialog__headerbtn) {
  font-size: 18px;
  top: 24px;
  right: 24px;
}

.user-dialog :deep(.el-dialog__body) {
  padding: 30px 30px 20px;
  background-color: #ffffff;
}

.user-dialog :deep(.el-dialog__footer) {
  padding: 20px 30px;
  border-top: 1px solid #ebeef5;
  background-color: #f9fafc;
}

.user-dialog :deep(.el-dialog) {
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
}

.user-form {
  padding-right: 5px;
}

.user-form :deep(.el-form-item__label) {
  font-weight: 500;
  color: #606266;
  padding-bottom: 8px;
  font-size: 14px;
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

.custom-select :deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px #dcdfe6 inset;
  border-radius: 6px;
  transition: all 0.3s;
}

.custom-select :deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #c0c4cc inset;
}

.custom-select :deep(.el-input__wrapper.is-focus) {
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

.w-100 {
  width: 100%;
}
</style>