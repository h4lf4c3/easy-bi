<script setup>
</script>

<template>
  <router-view></router-view>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#app {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

/* element-plus 组件样式覆盖 */
.el-container {
  width: 100%;
  height: 100%;
}

.el-aside {
  height: 100%;
}

.el-main {
  height: 100%;
  padding: 0;
}

.el-menu {
  border-right: none !important;
}

.el-menu-item {
  height: 50px;
  line-height: 50px;
}

.el-menu-item .el-icon {
  margin-right: 8px;
}

.el-card {
  margin-bottom: 20px;
}

.el-card__header {
  padding: 15px 20px;
  border-bottom: 1px solid #ebeef5;
}

.el-card__body {
  padding: 20px;
}

.el-table {
  margin-top: 15px;
}

.el-pagination {
  margin-top: 20px;
  text-align: right;
}

.el-dialog__body {
  padding: 20px 30px;
}

.el-form-item {
  margin-bottom: 22px;
}

.el-input-number {
  width: 100%;
}

.el-select {
  width: 100%;
}

.el-date-editor {
  width: 100%;
}
</style>
