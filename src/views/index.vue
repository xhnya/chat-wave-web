
<template>
<div>



  <v-card>
    <v-layout>
      <left-menu></left-menu>
      <v-main>
        <v-card>
          <chat-list></chat-list>
        </v-card>
      </v-main>
    </v-layout>
  </v-card>


  <el-button type="primary" @click="sendMsg">打开</el-button>
</div>
</template>
<script setup lang="ts">


import {onBeforeUnmount, onMounted, ref} from "vue";
import {getUserInfoApi} from "@/api/userApi.ts";
import LeftMenu from "@/components/LeftMenu.vue";
import {useIMStore} from "@/stores/im";

import {useUserStore} from "@/stores/user.ts";
import ChatList from "@/components/ChatList.vue";
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
    isSystemMessage: false,
    status: 'sent'
  })
  console.log('send msg')
}

//接收消息
const receiveMsg = () => {
  //useWebSocket中的message


}





</script>

<style scoped>

</style>