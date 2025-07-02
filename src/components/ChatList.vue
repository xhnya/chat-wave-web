<template>

  <div class="chat-list">
    <v-list class="pa-0">
      <!-- 置顶聊天 -->
      <template v-for="chat in pinnedChats" :key="'pinned-' + chat.id">
        <v-list-item
            @click="selectChat(chat)"
            :class="['chat-item', { active: selectedChatId === chat.id }]"
            density="comfortable"
        >
          <template #prepend>
            <v-avatar size="48">
              <v-img :src="chat.avatar" alt="Avatar" />
            </v-avatar>
          </template>

          <template #title>
            <div class="d-flex justify-space-between align-center">
              <span class="font-weight-medium">{{ chat.name }}</span>
              <span class="text-caption text-grey">{{ chat.time }}</span>
            </div>
          </template>

          <template #subtitle>
            <div class="d-flex justify-space-between align-center">
              <span class="text-truncate">{{ chat.lastMessage }}</span>
              <v-badge
                  v-if="chat.unreadCount > 0"
                  :content="chat.unreadCount"
                  color="red"
                  class="ml-2"
                  size="10"
                  inline
                  floating
                  bordered
              />
            </div>
          </template>
        </v-list-item>
      </template>

      <!-- 分隔线 -->
      <v-divider v-if="pinnedChats.length && normalChats.length" />

      <!-- 普通聊天 -->
      <template v-for="chat in normalChats" :key="chat.id">
        <v-list-item
            @click="selectChat(chat)"
            :class="['chat-item', { active: selectedChatId === chat.id }]"
            density="comfortable"
        >
          <template #prepend>
            <v-avatar size="48">
              <v-img :src="chat.avatar" alt="Avatar" />
            </v-avatar>
          </template>

          <template #title>
            <div class="d-flex justify-space-between align-center">
              <span class="font-weight-medium">{{ chat.name }}</span>
              <span class="text-caption text-grey">{{ chat.time }}</span>
            </div>
          </template>

          <template #subtitle>
            <div class="d-flex justify-space-between align-center">
              <span class="text-truncate">{{ chat.lastMessage }}</span>
              <v-badge
                  v-if="chat.unreadCount > 0"
                  :content="chat.unreadCount"
                  color="red"
                  class="ml-2"
                  size="10"
                  inline
                  floating
                  bordered
              />
            </div>
          </template>
        </v-list-item>
      </template>
    </v-list>
  </div>


</template>

<script setup lang="ts">
import {ref, computed, onMounted} from 'vue'
import { defineProps, defineEmits } from 'vue'
import {ElMessage} from "element-plus";
import {getChatListApi} from "@/api/chatApi.ts";
// import VueDraggableResizable from 'vue-draggable-resizable'
// import 'vue3-draggable-resizable/dist/Vue3DraggableResizable.css'
const chats = ref([])

const selectedChatId = ref(null)

const pinnedChats = computed(() => chats.value.filter(c => c.pinned))
const normalChats = computed(() => chats.value.filter(c => !c.pinned))

import {useUserStore} from "@/stores/user.ts";

onMounted(() => {
  getChatList()
})
//获取用户info useUserStore()中获取
const userInfo=computed(() => {
  const userStore = useUserStore();
  return userStore.userInfo;
});

const getChatList = () => {
  // Mock data for chat list
  const userId=userInfo.value?.userId
  if (!userId) {
    ElMessage.error('用户未登录')
    return
  }
  getChatListApi(userId).then((res:any) => {
    chats.value=res.data
  })


}
const props = defineProps<{ selectedChatId: number|null }>()
const emit = defineEmits<{
  (e: 'select', id: number): void
}>()

const selectChat = (chat: { id: number; unreadCount: number }) => {
  emit('select', chat.id)
  chat.unreadCount = 0
}

</script>

<style scoped>

.chat-list {
  margin: 0 auto;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}


.chat-item {
  border-bottom: 1px solid #eee;
  transition: background-color 0.2s;
  cursor: pointer;
  padding-left: 8px;
  padding-right: 8px;
}
.chat-item:hover {
  background-color: #f9f9f9;
}
.chat-item.active {
  background-color: #e0f7fa;
}
.text-truncate {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
