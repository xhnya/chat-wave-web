import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useWebSocket, Message } from '@/components/useWebSocket.ts'

export const useIMStore = defineStore('im', () => {
    const userId = ref<number | null>(null)
    const ws = ref<ReturnType<typeof useWebSocket> | null>(null)
    // 这里声明响应式变量
    const messages = ref<Message[]>([])
    const leftSidebarMessages = ref<Message[]>([])

    function init(user: number) {
        if (userId.value === user && ws.value?.socket?.readyState === WebSocket.OPEN) {
            console.log('🟡 已初始化且 WebSocket 已连接，跳过 init');
            return;
        }


        userId.value = user
        if (!ws.value) {
            ws.value = useWebSocket(user, true, null);
            ws.value?.connect();
        } else {
            // socket 已创建但断开，尝试重连
            if (ws.value.socket?.readyState !== WebSocket.OPEN) {
                ws.value.connect();
            }
        }
        if (ws.value && messages.value !== ws.value.messages) {
            messages.value = ws.value.messages;
        }
        if (ws.value && leftSidebarMessages.value !== ws.value.leftSidebarMessages) {
            leftSidebarMessages.value = ws.value.leftSidebarMessages;
        }


    }

    function send(msg: Message) {
        if (ws.value) {
            ws.value.sendMessage(msg)
        }
    }

    return { userId, messages: ws.value?.messages, init, send }
})
