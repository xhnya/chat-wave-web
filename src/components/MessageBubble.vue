<!-- MessageBubble.vue -->
<template>
  <div :class="['message-bubble', { 'own-message': message.isOwn }]">
    <!-- 消息内容 -->
    <div v-if="message.type === 'text'" class="text-content">
      {{ message.content }}
    </div>

    <v-img
        v-else-if="message.type === 'image'"
        :src="message.content"
        max-width="300"
        class="media-content"
        @click="openPreview"
    />

    <div v-else-if="message.type === 'file'" class="file-content">
      <v-icon>mdi-file</v-icon>
      <span class="file-name">{{ message.content.name }}</span>
      <v-progress-linear
          v-if="message.status === 'sending'"
          :model-value="message.progress"
          height="4"
      />
    </div>

    <div v-else-if="message.type === 'audio'" class="audio-content">
      <audio controls :src="message.content" />
    </div>

    <!-- 消息状态 -->
    <div class="message-footer">
      <span class="time">{{ formatTime(message.timestamp) }}</span>
      <v-icon
          v-if="message.isOwn"
          :color="statusColor"
          size="small"
          class="status-icon"
      >
        {{ statusIcon }}
      </v-icon>
    </div>

    <!-- 失败重试 -->
    <v-btn
        v-if="message.status === 'failed'"
        icon
        size="small"
        color="error"
        class="retry-btn"
        @click="$emit('retry', message)"
    >
      <v-icon>mdi-reload</v-icon>
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  message: ChatMessage;
  previous?: ChatMessage;
}>();

const formatTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

const statusIcon = computed(() => {
  switch (props.message.status) {
    case 'sending': return 'mdi-clock';
    case 'sent': return 'mdi-check';
    case 'read': return 'mdi-check-all';
    default: return '';
  }
});

const statusColor = computed(() => {
  return props.message.status === 'failed' ? 'error' : 'primary';
});
</script>

<style scoped>
.message-bubble {
  max-width: 70%;
  margin: 8px 0;
  padding: 12px;
  border-radius: 12px;
  position: relative;
  background: white;
  align-self: flex-start;
}

.own-message {
  background: #1890ff;
  color: white;
  align-self: flex-end;
}

.message-footer {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
  font-size: 0.75rem;
}

.status-icon {
  margin-left: auto;
}

.retry-btn {
  position: absolute;
  top: -8px;
  right: -8px;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.media-content {
  border-radius: 8px;
  cursor: pointer;
}

.audio-content audio {
  width: 200px;
}
</style>