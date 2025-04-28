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
import { ref, computed } from 'vue'
// import VueDraggableResizable from 'vue-draggable-resizable'
// import 'vue3-draggable-resizable/dist/Vue3DraggableResizable.css'
const chats = ref([
  {
    id: 1,
    name: 'Alice',
    avatar: 'https://i.pravatar.cc/150?img=1',
    lastMessage: 'Hey, how are you?',
    time: '10:20 AM',
    pinned: true,
    unreadCount: 2,
  },
  {
    id: 2,
    name: 'Bob',
    avatar: 'https://i.pravatar.cc/150?img=2',
    lastMessage: 'Got it, thanks!',
    time: 'Yesterday',
    pinned: false,
    unreadCount: 0,
  },
  {
    id: 3,
    name: 'Charlie',
    avatar: 'https://i.pravatar.cc/150?img=3',
    lastMessage: '11111111111111?',
    time: 'Mon',
    pinned: false,
    unreadCount: 10,
  },
])

const selectedChatId = ref(null)

const pinnedChats = computed(() => chats.value.filter(c => c.pinned))
const normalChats = computed(() => chats.value.filter(c => !c.pinned))

const selectChat = (chat) => {
  selectedChatId.value = chat.id
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
