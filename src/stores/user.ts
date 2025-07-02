import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { userInfoModel } from '@/type/UserModel' // 路径根据你项目结构来

export const useUserStore = defineStore('user', () => {
    const userInfo = ref<userInfoModel | null>(null)

    function setUserInfo(info: userInfoModel) {
        userInfo.value = info
    }

    function clearUserInfo() {
        userInfo.value = null
    }

    return {
        userInfo,
        setUserInfo,
        clearUserInfo
    }
},{
    persist: true
})
