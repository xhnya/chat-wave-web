<template>
  <div style="width: 60px;">
    <el-menu
        default-active="1"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
    >
      <el-menu-item index="1">
        <el-icon><ChatSquare /></el-icon>
      </el-menu-item>
      <el-menu-item index="2">
        <el-icon><User /></el-icon>
      </el-menu-item>
    </el-menu>

  </div>
</template>
<script setup lang="ts">
import { ElMenu } from 'element-plus'
import { ChatSquare, User } from '@element-plus/icons-vue'
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}




</script>
<style scoped>

</style>