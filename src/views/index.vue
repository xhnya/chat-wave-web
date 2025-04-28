<template>
  <div style="height: 100vh; overflow: hidden;">
    <v-card height="100%">
      <v-layout style="height: 100%;">
        <left-menu style="height: 100%; overflow-y: auto;"></left-menu>
        <v-main>
          <v-container fluid style="height: 100%;padding: 0;">
            <router-view></router-view>
          </v-container>
        </v-main>
      </v-layout>
    </v-card>
  </div>
</template>

<script setup lang="ts">


import {onBeforeUnmount, onMounted, ref} from "vue";
import {getUserInfoApi} from "@/api/userApi.ts";
import LeftMenu from "@/components/LeftMenu.vue";
import {useIMStore} from "@/stores/im";

import {useUserStore} from "@/stores/user.ts";
import ChatList from "@/components/ChatList.vue";
import ChatContent from "@/components/ChatContent.vue";
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
