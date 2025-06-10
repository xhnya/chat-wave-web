<template>
  <div>
    <el-dialog
        v-model="dialog"
        width="1000px"
    >
      <v-card
          title="全网搜索"
      >
        <template v-slot:text>
          <v-text-field
              @update:modelValue="searchFun"
              prepend-inner-icon="mdi-magnify"
              label="搜索" variant="solo"></v-text-field>
          <v-card class="mx-auto">
            <v-list>
              <v-list-item
                  v-for="item in list"
                  :key="item.id"
              >
                <v-list-item-title>{{ item.nickname }}</v-list-item-title>

                <!-- 右侧按钮 -->
                <template #append>
                  <v-btn icon @click.stop="handleClick(item)">
<!--                    <v-icon>mdi-dots-horizontal</v-icon>-->
                    <v-icon>mdi-account-plus</v-icon>
                  </v-btn>
                </template>
              </v-list-item>
            </v-list>
          </v-card>
        </template>
        <template v-slot:actions>
          <v-btn
              class="ms-auto"
              text="关闭"
              @click="dialog = false"
          ></v-btn>
        </template>
      </v-card>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">

import {ref} from "vue";
import {searchUserApi} from "@/api/userApi.ts";
import {ElMessage} from "element-plus";

const dialog =ref(false)

const searchQuery = ref('')
const list=ref([])


const searchFun = async (param: any) => {
  if (param.trim() === '') {
    list.value = []
    return
  }
  searchUserApi(param).then((res) => {
    list.value = res.data
  }).catch(() => {
    list.value = []
  })
}

const handleClick= (item: any) => {
  // 处理点击事件
  console.log('Clicked item:', item)
  // 可以在这里添加更多逻辑，比如打开用户详情等
  ElMessage.success(`已添加 ${item.nickname} 到好友列表`)
}

const openDialog = () => {
  dialog.value = true
}

defineExpose({
  openDialog
})

</script>
<style scoped>

</style>