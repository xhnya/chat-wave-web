<script setup lang="ts">
import {onMounted, ref} from 'vue'
import {useUserStore} from "@/stores/user.ts";
import {ElMessage} from "element-plus";
import {getChatListApi} from "@/api/chatApi.ts";

defineProps<{ msg: string }>()

const count = ref(0)


onMounted(() => {
  console.log('ChatList component mounted')
  getChatList()
})
//userStore
const userStore = useUserStore()
const chatList = ref([])

const getChatList = () => {
  // Mock data for chat list
  const userId=userStore.userInfo?.userId
  if (!userId) {
    ElMessage.error('用户未登录')
    return
  }
  getChatListApi(userId).then((res:any) => {
    chatList.value=res.data
  })


}
</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <button type="button" @click="count++">count is {{ count }}</button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>

  <p>
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank"
      >create-vue</a
    >, the official Vue + Vite starter
  </p>
  <p>
    Learn more about IDE Support for Vue in the
    <a
      href="https://vuejs.org/guide/scaling-up/tooling.html#ide-support"
      target="_blank"
      >Vue Docs Scaling up Guide</a
    >.
  </p>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
