import { ref, onBeforeUnmount } from 'vue'
import {ElNotification} from "element-plus";

export interface Message {
    senderId: number;
    receiverId: number | null;
    groupId: number | null;
    content: string;
    type: 'text' | 'emoji' | 'image' | 'voice';
    status: 'sent' | 'received' | 'read';
    //聊天消息还是系统消息
    isSystemMessage: boolean;
    timestamp?: string;
}

export function useWebSocket(userId: number, isChatOpen: boolean, currentChatUserId: number | null) {
    const socket = ref<WebSocket | null>(null)
    const leftSidebarMessages = ref<Message[]>([])  // 左侧聊天列表
    const messages = ref<Message[]>([])  // 当前聊天的消息
    const reconnectDelay = 3000
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null

    // 获取右侧聊天列表的消息
    const fetchRightSidebarMessages = async () => {
        try {
            // const response = await axios.get(`/api/chat/leftSidebarMessages?userId=${userId}`)
            // leftSidebarMessages.value = response.data || []  // 假设返回的数据是消息列表
        } catch (error) {
            console.error('Failed to fetch left sidebar messages:', error)
        }
    }

    // 获取当前聊天消息
    const fetchMessages = async (chatUserId: number) => {
        try {
            // const response = await axios.get(`/api/chat/messages?userId=${userId}&chatUserId=${chatUserId}`)
            // messages.value = response.data || []  // 假设返回的数据是消息列表
        } catch (error) {
            console.error('Failed to fetch chat messages:', error)
        }
    }

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
            handleMessage(msg)
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

    const handleMessage = (msg: Message) => {
        // 判断是否是系统消息
        if (msg.isSystemMessage) {
            //提示
            ElNotification({
                title: '系统消息',
                message: msg.content,
                duration: 3000,
            })
            return // 如果是系统消息，不处理
        }

        // 将非系统消息推送到右侧消息列表
        leftSidebarMessages.value.push(msg)

        // 判断聊天框是否打开，且接收的消息是否是当前聊天用户的消息
        if (isChatOpen && currentChatUserId !== null && currentChatUserId === msg.senderId) {
            // 当前聊天框是打开的，并且接收到的消息是和当前聊天用户一致
            messages.value.push(msg) // 将消息推送到聊天框
        }
    }

    onBeforeUnmount(() => {
        if (socket.value) socket.value.close()
        if (reconnectTimer) clearTimeout(reconnectTimer)
    })

    return {
        connect,
        sendMessage,
        fetchRightSidebarMessages,  // 提供获取左侧聊天列表的函数
        fetchMessages,  // 提供获取当前聊天消息的函数
        leftSidebarMessages,
        messages,
        socket
    }
}
