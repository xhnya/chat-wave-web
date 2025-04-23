import { ref, onBeforeUnmount } from 'vue'

export interface Message {
    senderId: number;
    receiverId: number | null;
    groupId: number | null;
    content: string;
    type: 'text' | 'emoji' | 'image' | 'voice';
    timestamp?: string;
}

export function useWebSocket(userId: number) {
    const socket = ref<WebSocket | null>(null)
    const messages = ref<Message[]>([])
    const reconnectDelay = 3000
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null

    const connect = () => {
        const ws = new WebSocket(`ws://localhost:9000/ws/chat?userId=${userId}`)

        ws.onopen = () => {
            console.log('✅ WebSocket connected')
            if (reconnectTimer) {
                clearTimeout(reconnectTimer)
                reconnectTimer = null
            }
        }

        ws.onmessage = (event) => {
            const msg: Message = JSON.parse(event.data)
            messages.value.push(msg)
        }

        ws.onerror = (e) => {
            console.warn('❌ WebSocket error', e)
        }

        ws.onclose = () => {
            console.warn('⚠️ WebSocket closed, trying to reconnect...')
            reconnectTimer = setTimeout(() => {
                connect()
            }, reconnectDelay)
        }

        socket.value = ws
    }

    const sendMessage = (msg: Message) => {
        if (socket.value && socket.value.readyState === WebSocket.OPEN) {
            socket.value.send(JSON.stringify(msg))
        } else {
            console.warn('❗WebSocket not connected, message not sent.')
        }
    }

    onBeforeUnmount(() => {
        if (socket.value) socket.value.close()
        if (reconnectTimer) clearTimeout(reconnectTimer)
    })

    return {
        connect,
        sendMessage,
        messages,
        socket
    }
}
