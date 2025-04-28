<template>
  <v-container fluid class="d-flex flex-column" style="height: 100vh; padding: 0;">
    <!-- 顶部栏 -->
    <div style="height: 60px; background-color: #f5f5f5;">
      <!-- 顶部内容 -->
    </div>

    <!-- 主内容区 -->
    <v-container fluid class="d-flex flex-column" style="flex: 1; padding: 0;">
      <!-- 聊天内容区 -->
      <div style="overflow-y: auto;height: calc(70vh - 60px);">
        <v-infinite-scroll
            :items="messages"
            @load="loadMore"
            :reverse="true"
            side="start"
        >
          <template v-for="(message, index) in messages" :key="message.id">
            <message-bubble
                :message="message"
                :previous="messages[index - 1]"
                @retry="retrySendMessage"
            />
          </template>
        </v-infinite-scroll>
      </div>

      <!-- 输入框区域 -->
      <div style="height: 30vh; position: relative; border-top: 1px solid #e0e0e0;">
        <div class="message-input-wrapper">
          <!-- 多功能按钮 -->
          <v-btn
              icon
              variant="text"
              class="attachment-btn"
              @click="toggleAttachmentMenu"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>

          <!-- 附件菜单 -->
          <v-menu v-model="showAttachmentMenu">
            <template v-slot:activator="{ props }">
              <div v-bind="props"></div>
            </template>
            <v-list density="compact">
              <v-list-item @click="triggerFileInput('image')">
                <v-icon>mdi-image</v-icon>
                <span class="ml-2">图片</span>
              </v-list-item>
              <v-list-item @click="triggerFileInput('file')">
                <v-icon>mdi-file</v-icon>
                <span class="ml-2">文件</span>
              </v-list-item>
              <v-list-item @click="startRecording">
                <v-icon>mdi-microphone</v-icon>
                <span class="ml-2">语音</span>
              </v-list-item>
            </v-list>
          </v-menu>

          <!-- 消息输入 -->
          <v-textarea
              v-model="newMessage"
              variant="solo"
              auto-grow
              :rows="1"
              max-rows="8"
              hide-details
              class="message-input"
              @keydown.enter.exact.prevent="sendTextMessage"
          ></v-textarea>

          <!-- 发送控制 -->
          <div class="message-controls">
            <v-btn
                v-if="isRecording"
                color="error"
                icon
                @click="stopRecording"
            >
              <v-icon>mdi-stop</v-icon>
            </v-btn>

            <v-btn
                color="primary"
                :disabled="!canSend"
                icon
                @click="sendTextMessage"
            >
              <v-icon>mdi-send</v-icon>
            </v-btn>
          </div>

          <!-- 隐藏的文件输入 -->
          <input
              ref="fileInput"
              type="file"
              hidden
              :accept="fileAccept"
              @change="handleFileUpload"
          />
        </div>
      </div>
    </v-container>
  </v-container>
</template>

<script setup lang="ts">
import { ref, nextTick, computed } from 'vue';
import MessageBubble from './MessageBubble.vue';

interface ChatMessage {
  id: string;
  content: any;
  type: 'text' | 'image' | 'file' | 'audio';
  isOwn: boolean;
  timestamp: number;
  status: 'sending' | 'sent' | 'failed' | 'read';
  progress?: number;
}

const allowLoadMore=ref(false)
const messages = ref<ChatMessage[]>([]);
const newMessage = ref('');
const messagesContainer = ref<HTMLElement>();
const fileInput = ref<HTMLInputElement>();
const fileAccept = ref('*');
const isRecording = ref(false);
const mediaRecorder = ref<MediaRecorder | null>(null);
const showAttachmentMenu = ref(false);

// 消息能力判断
const canSend = computed(() => {
  return newMessage.value.trim() || isRecording.value;
});

// 发送文本消息
const sendTextMessage = async () => {
  if (!newMessage.value.trim()) return;

  const message: ChatMessage = {
    id: Date.now().toString(),
    content: newMessage.value.trim(),
    type: 'text',
    isOwn: true,
    timestamp: Date.now(),
    status: 'sending'
  };

  messages.value.push(message);
  newMessage.value = '';
  scrollToBottom();

  // 模拟发送
  setTimeout(() => {
    message.status = 'sent';
  }, 2000);
};

// 文件处理
const triggerFileInput = (type: 'image' | 'file') => {
  fileAccept.value = type === 'image' ? 'image/*' : '*';
  fileInput.value?.click();
};

const handleFileUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  const messageType = file.type.startsWith('image/') ? 'image' : 'file';

  const message: ChatMessage = {
    id: Date.now().toString(),
    content: file,
    type: messageType,
    isOwn: true,
    timestamp: Date.now(),
    status: 'sending',
    progress: 0
  };

  messages.value.push(message);
  scrollToBottom();

  // 模拟上传
  const interval = setInterval(() => {
    if (message.progress! < 100) {
      message.progress! += 10;
    } else {
      clearInterval(interval);
      message.status = 'sent';
    }
  }, 200);
};

// 语音消息处理
const startRecording = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.value = new MediaRecorder(stream);
    const chunks: Blob[] = [];

    mediaRecorder.value.ondataavailable = (e) => chunks.push(e.data);
    mediaRecorder.value.onstop = () => {
      const blob = new Blob(chunks, { type: 'audio/webm' });
      handleAudioUpload(blob);
      stream.getTracks().forEach(track => track.stop());
    };

    mediaRecorder.value.start();
    isRecording.value = true;
  } catch (error) {
    console.error('录音权限被拒绝');
  }
};

const stopRecording = () => {
  mediaRecorder.value?.stop();
  isRecording.value = false;
};

const handleAudioUpload = (blob: Blob) => {
  const message: ChatMessage = {
    id: Date.now().toString(),
    content: URL.createObjectURL(blob),
    type: 'audio',
    isOwn: true,
    timestamp: Date.now(),
    status: 'sending'
  };

  messages.value.push(message);
  scrollToBottom();

  // 模拟上传
  setTimeout(() => {
    message.status = 'sent';
  }, 2000);
};

// 其他功能
const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
};


const loadMore = ({ done }: { done: (status: 'ok' | 'error' | 'empty') => void }) => {
  console.log('真正加载数据中...');
  done('empty');
  return
  // done('ok');

  setTimeout(() => {
    const newMessages = generateHistoryMessages(); // 这里是你的生成假数据逻辑
    messages.value = [...newMessages, ...messages.value];
    done('ok'); // 通知 v-infinite-scroll 加载完成
  }, 1000);
};

const retrySendMessage = (message: ChatMessage) => {
  message.status = 'sending';
  // 重新发送逻辑
};

const generateHistoryMessages = () => {
  // 生成历史消息逻辑
  return [];
};

const toggleAttachmentMenu= () => {
  showAttachmentMenu.value = !showAttachmentMenu.value;
};
</script>

<style scoped>
/* 输入框容器 */
.message-input-wrapper {
  position: relative;
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* 深度定制的文本域样式 */
.deepseek-like-input :deep(.v-textarea__control) {
  height: 100%;
  min-height: 80px !important;
}

.deepseek-like-input :deep(textarea) {
  padding-right: 72px !important;
  padding-bottom: 12px !important;
  scroll-padding-bottom: 48px !important;
}

/* 发送按钮 */
.send-btn {
  position: absolute !important;
  right: 16px;
  bottom: 16px;
  min-width: 48px !important;
  height: 48px !important;
  border-radius: 24px !important;
  transition: transform 0.2s ease;
  z-index: 2;
}

.send-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

/* 调整 Vuetify 默认样式 */
.message-input-wrapper :deep(.v-field--variant-solo) {
  background: #fff !important;
  box-shadow: none !important;
  border-radius: 8px !important;
}

.message-input-wrapper :deep(.v-field__input) {
  padding-top: 16px !important;
  padding-left: 16px !important;
}
.message-input-wrapper {
  position: relative;
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
}

.message-input {
  padding-left: 56px !important;
  padding-right: 112px !important;
}

.attachment-btn {
  position: absolute;
  left: 12px;
  bottom: 12px;
  z-index: 2;
}

.message-controls {
  position: absolute;
  right: 12px;
  bottom: 12px;
  display: flex;
  gap: 8px;
  z-index: 2;
}
</style>