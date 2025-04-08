<template>
  <div class="home">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
        <el-card shadow="hover" class="stat-card">
          <template #header>
            <div class="card-header">
              <span>数据源总数</span>
              <el-icon><Connection /></el-icon>
            </div>
          </template>
          <div class="card-content">
            <span class="number">12</span>
            <span class="label">个</span>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
        <el-card shadow="hover" class="stat-card">
          <template #header>
            <div class="card-header">
              <span>数据集总数</span>
              <el-icon><DataLine /></el-icon>
            </div>
          </template>
          <div class="card-content">
            <span class="number">28</span>
            <span class="label">个</span>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
        <el-card shadow="hover" class="stat-card">
          <template #header>
            <div class="card-header">
              <span>分析主题</span>
              <el-icon><PieChart /></el-icon>
            </div>
          </template>
          <div class="card-content">
            <span class="number">45</span>
            <span class="label">个</span>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
        <el-card shadow="hover" class="stat-card">
          <template #header>
            <div class="card-header">
              <span>活跃用户</span>
              <el-icon><User /></el-icon>
            </div>
          </template>
          <div class="card-content">
            <span class="number">156</span>
            <span class="label">人</span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="chart-row">
      <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="16">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>数据访问趋势</span>
            </div>
          </template>
          <div ref="trendChart" class="chart"></div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>数据源分布</span>
            </div>
          </template>
          <div ref="sourceChart" class="chart"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { Connection, DataLine, PieChart, User } from '@element-plus/icons-vue'

const trendChart = ref(null)
const sourceChart = ref(null)
let trend = null
let source = null

// 处理图表resize
const handleResize = () => {
  trend?.resize()
  source?.resize()
}

onMounted(() => {
  // 初始化趋势图
  trend = echarts.init(trendChart.value)
  trend.setOption({
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      data: [820, 932, 901, 934, 1290, 1330, 1320],
      type: 'line',
      smooth: true
    }]
  })

  // 初始化数据源分布图
  source = echarts.init(sourceChart.value)
  source.setOption({
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        type: 'pie',
        radius: '50%',
        data: [
          { value: 1048, name: 'MySQL' },
          { value: 735, name: 'PostgreSQL' },
          { value: 580, name: 'SQL Server' },
          { value: 484, name: 'Oracle' },
          { value: 300, name: '其他' }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  })

  // 添加resize事件监听
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  // 移除resize事件监听
  window.removeEventListener('resize', handleResize)
  // 销毁图表实例
  trend?.dispose()
  source?.dispose()
})
</script>

<style scoped>
.home {
  padding: 10px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.stat-card {
  margin-bottom: 20px;
  height: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-content {
  text-align: center;
  padding: 10px 0;
}

.number {
  font-size: 36px;
  font-weight: bold;
  color: #409EFF;
}

.label {
  font-size: 14px;
  color: #909399;
  margin-left: 4px;
}

.chart-row {
  margin-top: 20px;
  flex: 1;
  min-height: 0;
}

.chart-row .el-card :deep(.el-card__body) {
  padding: 10px;
}

.chart-row .el-card :deep(.el-card__header) {
  padding: 10px 15px;
}

.chart {
  height: 100%;
  min-height: 220px;
  width: 100%;
}
</style>