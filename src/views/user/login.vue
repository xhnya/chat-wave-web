<template>
  <div class="login-container">
    <el-card style="max-width: 480px; width: 100%;">
      <el-form :model="userInfo" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userInfo.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="userInfo.password"></el-input>
        </el-form-item>
        <el-form-item class="button-container">
          <el-button @click="goToRegister" type="primary">注册</el-button>
          <el-button @click="login" type="primary">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script setup lang="ts">
import { ref} from "vue";
import {userInfoModel} from "@/type/UserModel";
import {loginApi} from "@/api/userApi.ts";
import router from "../../router";
import {ElMessage} from "element-plus";
import { useIMStore } from '@/stores/im'
import {useUserStore} from "@/stores/user.ts";

const im = useIMStore()
const userStore = useUserStore()

const userInfo = ref<userInfoModel>({
  username: '',
  password: '',
  userId: 0,
})


const login = () => {
  loginApi(userInfo.value).then((res:any) => {
    ElMessage.success('登录成功')
    // 保存token
    localStorage.setItem('chat-wave-access_token', res.data.accessToken)
    localStorage.setItem('chat-wave-refresh_token', res.data.refreshToken)

    // im.init(res.data.id)
    const userInfoResponse: userInfoModel= {
      userId: res.data.id,
      username: res.data.username,
      password: '',
    }
    userStore.setUserInfo(userInfoResponse)

    // 跳转到首页
    router.push({path: '/'})
  })
}
const goToRegister = () => {
  //重定向到注册页面
  router.push({path: '/register'})
}

</script>

<style scoped>
/* 设置父容器全屏，并使用 flexbox 实现水平垂直居中 */
.login-container {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center;     /* 垂直居中 */
  height: 100vh;           /* 高度占满屏幕 */
  background-color: #f4f4f4; /* 背景颜色，可根据需要修改 */
}

/* 对按钮容器使用 flexbox，使按钮右对齐 */
.button-container {
  display: flex;
  justify-content: flex-end; /* 右对齐 */
}
</style>