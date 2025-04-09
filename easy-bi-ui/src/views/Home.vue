<template>
  <div class="home">
    <!-- 快捷功能区 -->
    <el-row :gutter="20" class="quick-access">
      <el-col :span="6" v-for="(action, index) in quickActions" :key="index">
        <el-card shadow="hover" class="action-card" @click="action.handler">
          <el-icon class="action-icon"><component :is="action.icon" /></el-icon>
          <div class="action-text">{{ action.name }}</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 数据概览区 -->
    <el-row :gutter="20" class="stats-overview">
      <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6" v-for="(stat, index) in statistics" :key="index">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <el-icon class="stat-icon"><component :is="stat.icon" /></el-icon>
            <div class="stat-info">
              <div class="stat-label">{{ stat.label }}</div>
              <div class="stat-value">
                <CountTo :endVal="stat.value" :duration="2500" />
                <span class="stat-unit">{{ stat.unit }}</span>
              </div>
              <div class="stat-trend" :class="stat.trend > 0 ? 'up' : 'down'">
                {{ Math.abs(stat.trend) }}% <el-icon><component :is="stat.trend > 0 ? 'ArrowUp' : 'ArrowDown'" /></el-icon>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 趋势分析区 -->
    <el-row :gutter="20" class="analysis-section">
      <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="16">
        <el-card shadow="hover" class="chart-card">
          <template #header>
            <div class="chart-header">
              <span>访问趋势分析</span>
              <el-radio-group v-model="timeRange" size="small">
                <el-radio-button label="week">本周</el-radio-button>
                <el-radio-button label="month">本月</el-radio-button>
                <el-radio-button label="year">全年</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div ref="trendChart" class="chart"></div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
        <el-card shadow="hover" class="chart-card">
          <template #header>
            <div class="chart-header">
              <span>数据源分布</span>
              <el-tooltip content="数据源使用情况统计" placement="top">
                <el-icon><InfoFilled /></el-icon>
              </el-tooltip>
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
import { CountTo } from 'vue3-count-to'
import { Connection, DataLine, PieChart, User, Plus, Setting, ArrowUp, ArrowDown, InfoFilled } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const timeRange = ref('week')
const trendChart = ref(null)
const sourceChart = ref(null)
let trend = null
let source = null

// 快捷功能区数据
const quickActions = [
  { name: '创建数据集', icon: 'Plus', handler: () => router.push('/datasets/create') },
  { name: '新建分析', icon: 'DataLine', handler: () => router.push('/analysis/create') },
  { name: '数据源管理', icon: 'Connection', handler: () => router.push('/datasource') },
  { name: '系统设置', icon: 'Setting', handler: () => router.push('/settings') }
]

// 统计数据
const statistics = [
  { label: '数据源总数', value: 12, unit: '个', icon: 'Connection', trend: 8.5 },
  { label: '数据集总数', value: 28, unit: '个', icon: 'DataLine', trend: 12.3 },
  { label: '分析主题', value: 45, unit: '个', icon: 'PieChart', trend: -5.2 },
  { label: '活跃用户', value: 156, unit: '人', icon: 'User', trend: 15.7 }
]

// 防抖函数
const debounce = (fn, delay) => {
  let timer = null
  return function (...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

// 处理图表resize
const handleResize = debounce(() => {
  trend?.resize()
  source?.resize()
}, 100)

// 初始化趋势图
const initTrendChart = () => {
  trend = echarts.init(trendChart.value)
  trend.setOption({
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      name: '访问量',
      type: 'line',
      smooth: true,
      areaStyle: {
        opacity: 0.1
      },
      emphasis: {
        focus: 'series'
      },
      data: [820, 932, 901, 934, 1290, 1330, 1320]
    }]
  })
}

// 初始化数据源分布图
const initSourceChart = () => {
  source = echarts.init(sourceChart.value)
  source.setOption({
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      top: 'middle'
    },
    series: [{
      type: 'pie',
      radius: ['50%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: false
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '14',
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      data: [
        { value: 1048, name: 'MySQL' },
        { value: 735, name: 'PostgreSQL' },
        { value: 580, name: 'SQL Server' },
        { value: 484, name: 'Oracle' },
        { value: 300, name: '其他' }
      ]
    }]
  })
}

onMounted(() => {
  initTrendChart()
  initSourceChart()

  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  trend?.dispose()
  source?.dispose()
})
</script>

<style scoped>
.home {
  padding: 20px;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 快捷功能区样式 */
.quick-access .action-card {
  cursor: pointer;
  text-align: center;
  padding: 20px;
  transition: all 0.3s ease;
}

.quick-access .action-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

.action-icon {
  font-size: 32px;
  color: #409EFF;
  margin-bottom: 10px;
}

.action-text {
  font-size: 16px;
  color: #606266;
}

/* 数据概览区样式 */
.stats-overview .stat-card {
  transition: all 0.3s ease;
}

.stats-overview .stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

.stat-content {
  display: flex;
  align-items: center;
  padding: 20px;
}

.stat-icon {
  font-size: 48px;
  color: #409EFF;
  margin-right: 20px;
}

.stat-info {
  flex: 1;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin-bottom: 5px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 5px;
}

.stat-unit {
  font-size: 14px;
  color: #909399;
  margin-left: 5px;
}

.stat-trend {
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.stat-trend.up {
  color: #67C23A;
}

.stat-trend.down {
  color: #F56C6C;
}

/* 趋势分析区样式 */
.analysis-section {
  flex: 1;
  min-height: 400px;
}

.chart-card {
  height: 100%;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-header .el-icon {
  font-size: 16px;
  color: #909399;
  cursor: help;
}

.chart {
  height: calc(100% - 20px);
  min-height: 300px;
}
</style>