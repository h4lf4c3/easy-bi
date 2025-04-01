<template>
  <div class="analysis">
    <div class="page-header">
      <h2>分析主题</h2>
      <el-button type="primary" @click="handleCreate">
        <el-icon><Plus /></el-icon>创建分析主题
      </el-button>
    </div>

    <el-tabs v-model="activeTab" class="analysis-tabs">
      <el-tab-pane label="数据" name="data">
        <div class="data-container">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-card class="dataset-list">
                <template #header>
                  <div class="card-header">
                    <span>数据集</span>
                    <el-input
                      v-model="searchQuery"
                      placeholder="搜索数据集"
                      prefix-icon="Search"
                      clearable
                    />
                  </div>
                </template>
                <el-scrollbar height="calc(100vh - 200px)">
                  <el-menu
                    :default-active="selectedDataset"
                    @select="handleDatasetSelect"
                  >
                    <el-menu-item
                      v-for="dataset in filteredDatasets"
                      :key="dataset.id"
                      :index="dataset.id.toString()"
                    >
                      <el-icon><DataLine /></el-icon>
                      <span>{{ dataset.name }}</span>
                    </el-menu-item>
                  </el-menu>
                </el-scrollbar>
              </el-card>
            </el-col>
            <el-col :span="18">
              <el-card class="data-preview">
                <template #header>
                  <div class="card-header">
                    <span>数据预览</span>
                    <el-button-group>
                      <el-button type="primary" @click="handleAddToSheet">
                        添加到工作表
                      </el-button>
                    </el-button-group>
                  </div>
                </template>
                <el-table
                  :data="previewData"
                  style="width: 100%"
                  height="calc(100vh - 300px)"
                >
                  <el-table-column
                    v-for="col in previewColumns"
                    :key="col"
                    :prop="col"
                    :label="col"
                  />
                </el-table>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>
      
      <el-tab-pane label="工作簿" name="workbook">
        <div class="workbook-container">
          <el-tabs v-model="activeSheet" type="card" closable>
            <el-tab-pane
              v-for="sheet in sheets"
              :key="sheet.id"
              :label="sheet.name"
              :name="sheet.id"
              closable
              @close="handleCloseSheet(sheet)"
            >
              <div class="sheet-toolbar">
                <el-button-group>
                  <el-button type="primary" @click="handleAddChart">
                    <el-icon><PieChart /></el-icon>添加图表
                  </el-button>
                  <el-button type="primary" @click="handleAddTable">
                    <el-icon><Grid /></el-icon>添加表格
                  </el-button>
                </el-button-group>
                <el-button-group>
                  <el-button type="primary" @click="handleSave">
                    <el-icon><Check /></el-icon>保存
                  </el-button>
                  <el-button type="primary" @click="handleExport">
                    <el-icon><Download /></el-icon>导出
                  </el-button>
                </el-button-group>
              </div>
              <div class="sheet-content" ref="sheetContent">
                <!-- 这里可以添加拖拽布局组件 -->
                <div class="placeholder">拖拽组件到此处</div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-tab-pane>
      
      <el-tab-pane label="仪表板" name="dashboard">
        <div class="dashboard-container">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-card class="component-list">
                <template #header>
                  <div class="card-header">
                    <span>组件库</span>
                  </div>
                </template>
                <el-scrollbar height="calc(100vh - 200px)">
                  <div
                    v-for="component in components"
                    :key="component.type"
                    class="component-item"
                    draggable="true"
                    @dragstart="handleDragStart($event, component)"
                  >
                    <el-icon><component :is="component.icon" /></el-icon>
                    <span>{{ component.name }}</span>
                  </div>
                </el-scrollbar>
              </el-card>
            </el-col>
            <el-col :span="18">
              <el-card class="dashboard-content">
                <template #header>
                  <div class="card-header">
                    <span>仪表板设计</span>
                    <el-button-group>
                      <el-button type="primary" @click="handleSaveDashboard">
                        <el-icon><Check /></el-icon>保存
                      </el-button>
                      <el-button type="primary" @click="handlePreviewDashboard">
                        <el-icon><View /></el-icon>预览
                      </el-button>
                    </el-button-group>
                  </div>
                </template>
                <div class="dashboard-grid" ref="dashboardGrid">
                  <!-- 这里可以添加网格布局组件 -->
                  <div class="placeholder">拖拽组件到此处</div>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Plus,
  Search,
  DataLine,
  PieChart,
  Grid,
  Check,
  Download,
  View
} from '@element-plus/icons-vue'

const activeTab = ref('data')
const activeSheet = ref('1')
const searchQuery = ref('')
const selectedDataset = ref('')

// 模拟数据
const datasets = ref([
  { id: 1, name: '用户分析数据集' },
  { id: 2, name: '订单分析数据集' },
  { id: 3, name: '产品分析数据集' }
])

const sheets = ref([
  { id: '1', name: 'Sheet1' },
  { id: '2', name: 'Sheet2' }
])

const previewData = ref([
  { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com' },
  { id: 2, name: '李四', age: 30, email: 'lisi@example.com' }
])

const previewColumns = ['id', 'name', 'age', 'email']

const components = [
  { type: 'chart', name: '图表', icon: 'PieChart' },
  { type: 'table', name: '表格', icon: 'Grid' },
  { type: 'text', name: '文本', icon: 'Document' },
  { type: 'image', name: '图片', icon: 'Picture' }
]

const filteredDatasets = computed(() => {
  if (!searchQuery.value) return datasets.value
  return datasets.value.filter(dataset =>
    dataset.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const handleCreate = () => {
  ElMessage.success('创建分析主题')
}

const handleDatasetSelect = (index) => {
  selectedDataset.value = index
  // 这里可以加载选中数据集的数据
}

const handleAddToSheet = () => {
  if (!selectedDataset.value) {
    ElMessage.warning('请先选择数据集')
    return
  }
  ElMessage.success('已添加到工作表')
}

const handleCloseSheet = (sheet) => {
  const index = sheets.value.findIndex(s => s.id === sheet.id)
  if (index !== -1) {
    sheets.value.splice(index, 1)
  }
}

const handleAddChart = () => {
  ElMessage.success('添加图表')
}

const handleAddTable = () => {
  ElMessage.success('添加表格')
}

const handleSave = () => {
  ElMessage.success('保存成功')
}

const handleExport = () => {
  ElMessage.success('导出成功')
}

const handleDragStart = (event, component) => {
  event.dataTransfer.setData('component', JSON.stringify(component))
}

const handleSaveDashboard = () => {
  ElMessage.success('保存仪表板成功')
}

const handlePreviewDashboard = () => {
  ElMessage.success('预览仪表板')
}
</script>

<style scoped>
.analysis {
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

.analysis-tabs {
  height: calc(100vh - 100px);
}

.data-container,
.workbook-container,
.dashboard-container {
  height: calc(100vh - 150px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dataset-list,
.component-list {
  height: 100%;
}

.sheet-toolbar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.sheet-content,
.dashboard-grid {
  height: calc(100vh - 300px);
  border: 1px dashed #dcdfe6;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder {
  color: #909399;
  font-size: 14px;
}

.component-item {
  display: flex;
  align-items: center;
  padding: 10px;
  cursor: move;
  border-bottom: 1px solid #ebeef5;
}

.component-item:hover {
  background-color: #f5f7fa;
}

.component-item .el-icon {
  margin-right: 8px;
  font-size: 18px;
}
</style> 