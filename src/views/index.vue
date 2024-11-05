

<template>
<div>
  <el-button @click="connect" type="primary">连接</el-button>
  <el-input v-model="message" placeholder="请输入消息内容" style="width: 300px;"></el-input>
  <el-button @click="send" type="primary">发送</el-button>
  {{ messages }}
</div>
</template>
<script setup>

import {ref,onBeforeUnmount,onMounted} from "vue";
import SockJS from 'sockjs-client';
import {Client} from '@stomp/stompjs';


const messages = ref([]);
let stompClient = ref();
const message = ref('');



// 连接 WebSocket 服务
const connect = () => {
  const socket = new SockJS('/ws');  // WebSocket 服务端地址
  stompClient.value = new Client({
    webSocketFactory: () => socket,
    onConnect: () => {
      console.log('连接websocket成功');
      // 订阅消息
      stompClient.value.subscribe('/topic/messages', (message) => {
        messages.value.push(message.body);  // 收到消息时更新 messages
      });
    },
    onStompError: (frame) => {
      console.error('STOMP Error:', frame);
    }
  });

  stompClient.value.activate();
};
// 发送消息

const send = () => {
  if (message.value.trim()) {
    stompClient.value.publish({
      destination: '/message/send',
      body: message.value
    });
    message.value = '';  // 发送后清空输入框
  }
};
const disconnect = () => {
  if (stompClient !== null) {
    stompClient.disconnect();
  }
  console.log('Disconnected');
};

onMounted(() => {
  connect();
});

onBeforeUnmount(() => {
  disconnect();
});

</script>
<style scoped>

</style>