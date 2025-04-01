<template>
  <div class="datasources">
    <div class="page-header">
      <h2>数据源管理</h2>
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>添加数据源
      </el-button>
    </div>

    <el-table :data="dataSources" style="width: 100%" v-loading="loading">
      <el-table-column prop="name" label="数据源名称" />
      <el-table-column prop="type" label="类型">
        <template #default="{ row }">
          <el-tag :type="getTypeTag(row.type)">{{ row.type }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="host" label="主机地址" />
      <el-table-column prop="port" label="端口" width="100" />
      <el-table-column prop="database" label="数据库" />
      <el-table-column prop="status" label="状态">
        <template #default="{ row }">
          <el-tag :type="row.status === 'connected' ? 'success' : 'danger'">
            {{ row.status === 'connected' ? '已连接' : '未连接' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button-group>
            <el-button type="primary" link @click="handleTest(row)">
              测试连接
            </el-button>
            <el-button type="primary" link @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button type="danger" link @click="handleDelete(row)">
              删除
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

const router = useRouter()
const loading = ref(false)

// 模拟数据
const dataSources = ref([
  {
    id: 1,
    name: '生产数据库',
    type: 'MySQL',
    host: 'localhost',
    port: 3306,
    database: 'production',
    status: 'connected'
  },
  {
    id: 2,
    name: '测试数据库',
    type: 'PostgreSQL',
    host: 'localhost',
    port: 5432,
    database: 'test',
    status: 'disconnected'
  }
])

const getTypeTag = (type) => {
  const types = {
    MySQL: 'success',
    PostgreSQL: 'warning',
    'SQL Server': 'info',
    Oracle: 'danger'
  }
  return types[type] || 'info'
}

const handleAdd = () => {
  router.push('/datasource/create')
}

const handleEdit = (row) => {
  // TODO: 实现编辑功能
  ElMessage.info('编辑功能开发中')
}

const handleDelete = (row) => {
  ElMessageBox.confirm(
    '确定要删除该数据源吗？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    dataSources.value = dataSources.value.filter(item => item.id !== row.id)
    ElMessage.success('删除成功')
  })
}

const handleTest = (row) => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    ElMessage.success('连接测试成功')
  }, 1000)
}
</script>

<style scoped>
.datasources {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
}
</style> 