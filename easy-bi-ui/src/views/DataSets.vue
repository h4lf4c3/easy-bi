<template>
  <div class="datasets">
    <div class="page-header">
      <h2>数据集管理</h2>
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>创建数据集
      </el-button>
    </div>

    <el-table :data="dataSets" style="width: 100%" v-loading="loading">
      <el-table-column prop="name" label="数据集名称" />
      <el-table-column prop="source" label="数据源">
        <template #default="{ row }">
          <el-tag>{{ row.source }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="类型">
        <template #default="{ row }">
          <el-tag :type="row.type === 'SQL' ? 'success' : 'warning'">
            {{ row.type }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="更新时间" width="180" />
      <el-table-column prop="status" label="状态">
        <template #default="{ row }">
          <el-tag :type="row.status === 'active' ? 'success' : 'info'">
            {{ row.status === 'active' ? '已启用' : '已停用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250">
        <template #default="{ row }">
          <el-button-group>
            <el-button type="primary" link @click="handlePreview(row)">
              预览
            </el-button>
            <el-button type="primary" link @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button 
              :type="row.status === 'active' ? 'warning' : 'success'" 
              link 
              @click="handleToggleStatus(row)"
            >
              {{ row.status === 'active' ? '停用' : '启用' }}
            </el-button>
            <el-button type="danger" link @click="handleDelete(row)">
              删除
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加/编辑数据集对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '创建数据集' : '编辑数据集'"
      width="600px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="数据集名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="数据源" prop="source">
          <el-select v-model="form.source" placeholder="请选择数据源">
            <el-option label="生产数据库" value="生产数据库" />
            <el-option label="测试数据库" value="测试数据库" />
          </el-select>
        </el-form-item>
        <el-form-item label="数据集类型" prop="type">
          <el-radio-group v-model="form.type">
            <el-radio label="SQL">SQL查询</el-radio>
            <el-radio label="Table">数据表</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="SQL语句" prop="sql" v-if="form.type === 'SQL'">
          <el-input
            v-model="form.sql"
            type="textarea"
            :rows="4"
            placeholder="请输入SQL查询语句"
          />
        </el-form-item>
        <el-form-item label="数据表" prop="table" v-if="form.type === 'Table'">
          <el-select v-model="form.table" placeholder="请选择数据表">
            <el-option label="用户表" value="users" />
            <el-option label="订单表" value="orders" />
            <el-option label="产品表" value="products" />
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="2"
            placeholder="请输入数据集描述"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 预览数据对话框 -->
    <el-dialog
      v-model="previewVisible"
      title="数据预览"
      width="80%"
    >
      <el-table :data="previewData" style="width: 100%">
        <el-table-column
          v-for="col in previewColumns"
          :key="col"
          :prop="col"
          :label="col"
        />
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

const loading = ref(false)
const dialogVisible = ref(false)
const dialogType = ref('add')
const previewVisible = ref(false)
const formRef = ref(null)

// 模拟数据
const dataSets = ref([
  {
    id: 1,
    name: '用户分析数据集',
    source: '生产数据库',
    type: 'SQL',
    updateTime: '2024-03-31 10:00:00',
    status: 'active'
  },
  {
    id: 2,
    name: '订单分析数据集',
    source: '测试数据库',
    type: 'Table',
    updateTime: '2024-03-31 09:30:00',
    status: 'active'
  }
])

const form = reactive({
  name: '',
  source: '',
  type: 'SQL',
  sql: '',
  table: '',
  description: ''
})

const rules = {
  name: [{ required: true, message: '请输入数据集名称', trigger: 'blur' }],
  source: [{ required: true, message: '请选择数据源', trigger: 'change' }],
  type: [{ required: true, message: '请选择数据集类型', trigger: 'change' }],
  sql: [{ required: true, message: '请输入SQL语句', trigger: 'blur' }],
  table: [{ required: true, message: '请选择数据表', trigger: 'change' }]
}

// 预览数据
const previewData = ref([
  { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com' },
  { id: 2, name: '李四', age: 30, email: 'lisi@example.com' }
])
const previewColumns = ['id', 'name', 'age', 'email']

const handleAdd = () => {
  dialogType.value = 'add'
  Object.keys(form).forEach(key => form[key] = '')
  form.type = 'SQL'
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogType.value = 'edit'
  Object.keys(form).forEach(key => form[key] = row[key])
  dialogVisible.value = true
}

const handleDelete = (row) => {
  ElMessageBox.confirm(
    '确定要删除该数据集吗？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    dataSets.value = dataSets.value.filter(item => item.id !== row.id)
    ElMessage.success('删除成功')
  })
}

const handleToggleStatus = (row) => {
  row.status = row.status === 'active' ? 'inactive' : 'active'
  ElMessage.success(row.status === 'active' ? '已启用' : '已停用')
}

const handlePreview = (row) => {
  previewVisible.value = true
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    if (dialogType.value === 'add') {
      dataSets.value.push({
        id: dataSets.value.length + 1,
        ...form,
        updateTime: new Date().toLocaleString(),
        status: 'active'
      })
      ElMessage.success('创建成功')
    } else {
      const index = dataSets.value.findIndex(item => item.id === form.id)
      if (index !== -1) {
        dataSets.value[index] = {
          ...dataSets.value[index],
          ...form,
          updateTime: new Date().toLocaleString()
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
.datasets {
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

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style> 