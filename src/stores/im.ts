import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useWebSocket, Message } from '@/components/useWebSocket.ts'

export const useIMStore = defineStore('im', () => {
    const userId = ref<number | null>(null)
    const ws = ref<ReturnType<typeof useWebSocket> | null>(null)

    function init(user: number) {
        userId.value = user
        ws.value = useWebSocket(user)
        if (!ws.value) {
            console.error('WebSocket 初始化失败')
            return
        }
        ws.value.connect()
    }

    function send(msg: Message) {
        if (ws.value) {
            ws.value.sendMessage(msg)
        }
    }

    return { userId, messages: ws.value?.messages, init, send }
})
