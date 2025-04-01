<template>
  <div class="register-container">
    <el-card style="max-width: 480px; width: 100%;margin-top: 10%">
      <el-form :model="registerInfo" label-width="80px">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="registerInfo.userName"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="registerInfo.password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input type="password" v-model="registerInfo.confirmPassword"></el-input>
        </el-form-item>
        <el-form-item class="button-container">
          <el-button @click="goToLogin" type="primary">登录</el-button>
          <el-button @click="register" type="primary">注册</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import router from "../../router";
import { ElMessage } from "element-plus";
import {registerApi} from "@/api/userApi.ts";

const registerInfo = ref({
  userName: '',
  password: '',
  confirmPassword: ''
});

const register = () => {
  if (registerInfo.value.password !== registerInfo.value.confirmPassword) {
    ElMessage.error('密码和确认密码不一致');
    return;
  }

  registerApi(registerInfo.value).then((res: any) => {
    ElMessage.success('注册成功');
    // 保存token
    localStorage.setItem('chat-wave-access_token', res.data.accessToken);
    localStorage.setItem('chat-wave-refresh_token', res.data.refreshToken);

    // 跳转到首页
    router.push({ path: '/' });
  });
};

const goToLogin = () => {
  // 重定向到登录页面
  router.push({ path: '/login' });
};
</script>

<style scoped>
/* 设置父容器全屏，并使用 flexbox 实现水平垂直居中 */
.register-container {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center;     /* 垂直居中 */
  width: 100%;             /* 宽度占满屏幕 */
  height: 100%;            /* 高度占满屏幕 */
  background-color: #f4f4f4; /* 背景颜色，可根据需要修改 */
}

/* 对按钮容器使用 flexbox，使按钮右对齐 */
.button-container {
  display: flex;
  justify-content: flex-end; /* 右对齐 */
}
</style>