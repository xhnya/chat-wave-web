
<template>
<div>
  <el-card style="max-width: 480px">
    <el-form  :model="userInfo" label-width="80px">
      <el-form-item label="用户名" prop="userName">
        <el-input v-model="userInfo.userName" ></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="userInfo.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="login" type="primary">登录</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</div>
</template>
<script setup lang="ts">
import { ref} from "vue";
import {userInfoModel} from "./UserModel.ts";
import {loginApi} from "../../api/userApi.ts";
import router from "../../router";
import {ElMessage} from "element-plus";


const userInfo = ref<userInfoModel>({
  userName: '',
  password: ''
})


const login = () => {
  loginApi(userInfo.value).then((res:any) => {
    ElMessage.success('登录成功')
    // 保存token
    localStorage.setItem('chat-wave-access_token', res.data.accessToken)
    localStorage.setItem('chat-wave-refresh_token', res.data.refreshToken)

    // 跳转到首页
    router.push({path: '/'})
  })
}

</script>

<style scoped>

</style>