<template>
  <div class="home">
    <el-row :gutter="20">
      <el-col :span="6">
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
      <el-col :span="6">
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
      <el-col :span="6">
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
      <el-col :span="6">
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
      <el-col :span="16">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>数据访问趋势</span>
            </div>
          </template>
          <div ref="trendChart" class="chart"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
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
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import { Connection, DataLine, PieChart, User } from '@element-plus/icons-vue'

const trendChart = ref(null)
const sourceChart = ref(null)

onMounted(() => {
  // 初始化趋势图
  const trend = echarts.init(trendChart.value)
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
  const source = echarts.init(sourceChart.value)
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
})
</script>

<style scoped>
.home {
  padding: 20px;
}

.stat-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-content {
  text-align: center;
  padding: 20px 0;
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
}

.chart {
  height: 300px;
}
</style> 