
<template>
<div>
  <left-menu></left-menu>
  <el-button type="primary" @click="sendMsg">打开</el-button>
</div>
</template>
<script setup lang="ts">


import {onBeforeUnmount, onMounted, ref} from "vue";
import {getUserInfoApi} from "@/api/userApi.ts";
import LeftMenu from "@/components/LeftMenu.vue";
import {useIMStore} from "@/stores/im";

import {useUserStore} from "@/stores/user.ts";
const imStore = useIMStore()
const userStore = useUserStore()


const getUserInfo = () => {
  getUserInfoApi().then((res:any) => {
    console.log(res)
  })
}


onMounted(() => {
  console.log('index')
  getUserInfo()
  if (userStore.userInfo) {
    imStore.init(userStore.userInfo.userId)
  }
})

const sendMsg = () => {
  imStore.send({
    type: 'text',
    content: 'hello world',
    senderId: 1,
    receiverId: 2,
    groupId: null,
  })
  console.log('send msg')
}





</script>

<style scoped>

</style>