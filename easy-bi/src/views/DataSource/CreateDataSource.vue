<template>
  <div v-if="dialogVisible" class="floating-dialog-container">
    <div class="floating-dialog" :class="{ 'dialog-enter': dialogVisible }">
      <div class="dialog-header">
        <h2>创建数据源</h2>
        <el-button class="close-btn" link @click="handleClose">
          <el-icon><Close /></el-icon>
        </el-button>
      </div>

      <div class="dialog-body">
        <div class="header">
          <el-steps :active="currentStep" finish-status="success">
            <el-step title="选择数据源" />
            <el-step title="配置信息" />
          </el-steps>
        </div>

        <div class="content" v-if="currentStep === 0">
          <div class="search-bar">
            <el-input
              v-model="searchQuery"
              placeholder="搜索"
              :prefix-icon="Search"
              clearable
            />
          </div>

          <div class="recent-section" v-if="recentSources.length > 0">
            <h3>最近创建</h3>
            <div class="source-grid">
              <!-- 最近创建的数据源 -->
            </div>
          </div>

          <div class="source-section">
            <h3>OLTP</h3>
            <div class="source-grid">
              <div
                v-for="source in filteredOltpSources"
                :key="source.id"
                class="source-card"
                @click="selectDataSource(source)"
              >
                <img :src="source.icon" :alt="source.name" class="source-icon" />
                <span class="source-name">{{ source.name }}</span>
              </div>
            </div>
          </div>

          <div class="source-section">
            <h3>OLAP</h3>
            <div class="source-grid">
              <div
                v-for="source in filteredOlapSources"
                :key="source.id"
                class="source-card"
                @click="selectDataSource(source)"
              >
                <img :src="source.icon" :alt="source.name" class="source-icon" />
                <span class="source-name">{{ source.name }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="content" v-else>
          <div class="config-form">
            <el-form
              ref="configForm"
              :model="configData"
              :rules="configRules"
              label-width="120px"
              class="config-form-inner"
            >
              <h3 class="form-title">{{ selectedSource.name }} 连接配置</h3>
              
              <!-- 基础配置 -->
              <el-form-item label="数据源名称" prop="name">
                <el-input v-model="configData.name" placeholder="请输入数据源名称" />
              </el-form-item>

              <!-- 连接配置 -->
              <template v-if="selectedSource.type === 'oltp'">
                <el-form-item label="主机地址" prop="host">
                  <el-input v-model="configData.host" placeholder="请输入主机地址" />
                </el-form-item>
                
                <el-form-item label="端口" prop="port">
                  <el-input-number 
                    v-model="configData.port" 
                    :min="1" 
                    :max="65535"
                    :controls="false"
                    placeholder="请输入端口号"
                  />
                </el-form-item>

                <el-form-item label="数据库名称" prop="database">
                  <el-input v-model="configData.database" placeholder="请输入数据库名称" />
                </el-form-item>

                <el-form-item label="用户名" prop="username">
                  <el-input v-model="configData.username" placeholder="请输入用户名" />
                </el-form-item>

                <el-form-item label="密码" prop="password">
                  <el-input
                    v-model="configData.password"
                    type="password"
                    placeholder="请输入密码"
                    show-password
                  />
                </el-form-item>
              </template>

              <template v-else-if="selectedSource.type === 'olap'">
                <el-form-item label="连接URL" prop="url">
                  <el-input
                    v-model="configData.url"
                    placeholder="请输入连接URL"
                    type="textarea"
                    :rows="2"
                  />
                </el-form-item>

                <el-form-item label="用户名" prop="username">
                  <el-input v-model="configData.username" placeholder="请输入用户名" />
                </el-form-item>

                <el-form-item label="密码" prop="password">
                  <el-input
                    v-model="configData.password"
                    type="password"
                    placeholder="请输入密码"
                    show-password
                  />
                </el-form-item>
              </template>

              <!-- 高级配置 -->
              <div class="advanced-config">
                <el-divider>
                  <el-button link type="primary" @click="showAdvanced = !showAdvanced">
                    {{ showAdvanced ? '收起' : '展开' }}高级配置
                    <el-icon class="el-icon--right">
                      <component :is="showAdvanced ? 'ArrowUp' : 'ArrowDown'" />
                    </el-icon>
                  </el-button>
                </el-divider>

                <div v-show="showAdvanced">
                  <el-form-item label="连接超时" prop="timeout">
                    <el-input-number
                      v-model="configData.timeout"
                      :min="0"
                      :max="3600"
                      :step="1"
                      placeholder="请输入超时时间（秒）"
                    />
                  </el-form-item>

                  <el-form-item label="最大连接数" prop="maxConnections">
                    <el-input-number
                      v-model="configData.maxConnections"
                      :min="1"
                      :max="1000"
                      :step="1"
                      placeholder="请输入最大连接数"
                    />
                  </el-form-item>

                  <el-form-item label="SSL连接" prop="ssl">
                    <el-switch v-model="configData.ssl" />
                  </el-form-item>
                </div>
              </div>

              <!-- 测试连接按钮 -->
              <div class="test-connection">
                <el-button
                  type="primary"
                  plain
                  :loading="testing"
                  @click="testConnection"
                >
                  测试连接
                </el-button>
              </div>
            </el-form>
          </div>
        </div>
      </div>

      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleNext" :disabled="!selectedSource && currentStep === 0">
          {{ currentStep === 1 ? '完成' : '下一步' }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Search, Close, ArrowUp, ArrowDown } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()
const currentStep = ref(0)
const searchQuery = ref('')
const selectedSource = ref(null)
const recentSources = ref([])
const dialogVisible = ref(false)

// 数据源定义
const oltpSources = [
  { id: 'mysql', name: 'MySQL', icon: '/icons/mysql.png', type: 'oltp' },
  { id: 'postgresql', name: 'PostgreSQL', icon: '/icons/postgresql.png', type: 'oltp' },
  { id: 'oracle', name: 'Oracle', icon: '/icons/oracle.png', type: 'oltp' },
  { id: 'sqlserver', name: 'SQL Server', icon: '/icons/sqlserver.png', type: 'oltp' },
  { id: 'mongodb', name: 'Mongodb-BI', icon: '/icons/mongodb.png', type: 'oltp' },
  { id: 'mariadb', name: 'MariaDB', icon: '/icons/mariadb.png', type: 'oltp' },
  { id: 'db2', name: 'Db2', icon: '/icons/db2.png', type: 'oltp' },
  { id: 'tidb', name: 'TiDB', icon: '/icons/tidb.png', type: 'oltp' }
]

const olapSources = [
  { id: 'impala', name: 'Apache Impala', icon: '/icons/impala.png', type: 'olap' },
  { id: 'doris', name: 'Apache Doris', icon: '/icons/doris.png', type: 'olap' },
  { id: 'clickhouse', name: 'ClickHouse', icon: '/icons/clickhouse.png', type: 'olap' },
  { id: 'starrocks', name: 'StarRocks', icon: '/icons/starrocks.png', type: 'olap' }
]

// 过滤数据源
const filteredOltpSources = computed(() => {
  return oltpSources.filter(source =>
    source.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const filteredOlapSources = computed(() => {
  return olapSources.filter(source =>
    source.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// 选择数据源
const selectDataSource = (source) => {
  selectedSource.value = source
  handleNext()
}

// 配置表单数据
const configForm = ref(null)
const configData = reactive({
  name: '',
  host: '',
  port: null,
  database: '',
  username: '',
  password: '',
  url: '',
  timeout: 30,
  maxConnections: 10,
  ssl: false
})

// 默认端口映射
const defaultPorts = {
  mysql: 3306,
  postgresql: 5432,
  oracle: 1521,
  sqlserver: 1433,
  mongodb: 27017,
  mariadb: 3306,
  db2: 50000,
  tidb: 4000,
  impala: 21050,
  doris: 9030,
  clickhouse: 8123,
  starrocks: 9030
}

// 表单验证规则
const configRules = {
  name: [
    { required: true, message: '请输入数据源名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  host: [
    { required: true, message: '请输入主机地址', trigger: 'blur' }
  ],
  port: [
    { required: true, message: '请输入端口号', trigger: 'blur' },
    { type: 'number', message: '端口号必须为数字', trigger: 'blur' }
  ],
  database: [
    { required: true, message: '请输入数据库名称', trigger: 'blur' }
  ],
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ],
  url: [
    { required: true, message: '请输入连接URL', trigger: 'blur' }
  ]
}

// 高级配置显示状态
const showAdvanced = ref(false)
const testing = ref(false)

// 监听选中的数据源变化，设置默认端口
watch(() => selectedSource.value, (newSource) => {
  if (newSource && newSource.type === 'oltp') {
    configData.port = defaultPorts[newSource.id]
  }
}, { immediate: true })

// 测试连接
const testConnection = async () => {
  if (!configForm.value) return
  
  try {
    await configForm.value.validate()
    testing.value = true
    
    // TODO: 实际的连接测试逻辑
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    ElMessage.success('连接测试成功')
  } catch (error) {
    console.error('表单验证失败:', error)
  } finally {
    testing.value = false
  }
}

// 处理下一步
const handleNext = async () => {
  if (currentStep.value === 0 && !selectedSource.value) {
    ElMessage.warning('请选择数据源类型')
    return
  }
  
  if (currentStep.value === 1) {
    if (!configForm.value) return
    
    try {
      await configForm.value.validate()
      // TODO: 保存数据源配置
      ElMessage.success('数据源创建成功')
      router.back()
      return
    } catch (error) {
      console.error('表单验证失败:', error)
      return
    }
  }
  
  currentStep.value++
}

// 处理关闭
const handleClose = () => {
  ElMessage.info('已取消创建数据源')
  router.back()
}

onMounted(() => {
  // 显示抽屉
  dialogVisible.value = true
})
</script>

<style scoped>
.floating-dialog-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  animation: overlay-fade-in 0.3s ease-out;
}

.floating-dialog {
  width: 80%;
  max-width: 1200px;
  height: 85vh;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 12px 32px 4px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  transform: scale(0.5);
  opacity: 0;
}

.dialog-enter {
  animation: dialog-zoom-in 0.3s ease-out forwards;
}

@keyframes dialog-zoom-in {
  from {
    transform: scale(0.5);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes overlay-fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.dialog-header {
  padding: 16px 24px;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dialog-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.close-btn {
  font-size: 20px;
  color: #909399;
  transition: color 0.3s ease;
}

.close-btn:hover {
  color: #303133;
}

.dialog-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.dialog-footer {
  padding: 12px 24px;
  border-top: 1px solid #e4e7ed;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  background-color: #fff;
}

.header {
  padding: 20px 15%;
  background-color: #fff;
  border-bottom: 1px solid #f0f0f0;
}

.content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  background-color: #fff;
}

.search-bar {
  margin-bottom: 30px;
  padding: 0 20px;
  max-width: 260px;
  position: relative;
}

:deep(.el-input__wrapper) {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  padding: 8px 12px;
  transition: all 0.3s ease;
}

:deep(.el-input__wrapper:hover) {
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.1);
}

.source-section {
  margin-bottom: 30px;
  animation: section-fade-in 0.6s ease-out;
}

@keyframes section-fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.source-section h3 {
  margin-bottom: 16px;
  padding: 0 20px;
  color: #303133;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
}

.source-section h3::before {
  content: '';
  display: inline-block;
  width: 4px;
  height: 16px;
  background: #409eff;
  margin-right: 8px;
  border-radius: 2px;
}

.source-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
  padding: 0 20px;
}

.source-card {
  display: flex;
  align-items: center;
  padding: 16px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  height: 60px;
  background: #fff;
  position: relative;
  overflow: hidden;
}

.source-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent 0%, rgba(64, 158, 255, 0.1) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.source-card:hover {
  transform: translateY(-2px);
  border-color: #409eff;
  box-shadow: 0 4px 20px 0 rgba(64, 158, 255, 0.15);
}

.source-card:hover::before {
  opacity: 1;
}

.source-icon {
  width: 32px;
  height: 32px;
  margin-right: 12px;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.source-card:hover .source-icon {
  transform: scale(1.1);
}

.source-name {
  font-size: 15px;
  color: #303133;
  font-weight: 500;
  transition: color 0.3s ease;
}

.source-card:hover .source-name {
  color: #409eff;
}

/* 添加滚动条样式 */
.content::-webkit-scrollbar {
  width: 6px;
}

.content::-webkit-scrollbar-thumb {
  background-color: #e4e7ed;
  border-radius: 3px;
}

.content::-webkit-scrollbar-thumb:hover {
  background-color: #c0c4cc;
}

.content::-webkit-scrollbar-track {
  background-color: transparent;
}

.config-form {
  max-width: 700px;
  margin: 0 auto;
  height: 100%;
  padding: 20px;
}

.form-title {
  margin-bottom: 24px;
  font-size: 18px;
  font-weight: 500;
  color: #303133;
}

.config-form-inner {
  background-color: #fff;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.advanced-config {
  margin: 24px 0;
}

.test-connection {
  margin-top: 24px;
  text-align: center;
}

:deep(.el-form-item__label) {
  font-weight: 500;
}

:deep(.el-input-number) {
  width: 100%;
}

:deep(.el-steps) {
  --el-step-icon-size: 28px;
}

/* 步骤条动画 */
:deep(.el-step__head.is-process) {
  animation: step-bounce 0.5s ease-in-out;
}

@keyframes step-bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
}
</style> 