<template>
  <div style="display: flex; align-items: center; gap: 8px;margin-top: 5px;margin-bottom: 5px;margin-right: 5px;">
    <v-text-field
        label="搜索"
        density="compact"
        hide-details
        style="height: 40px;"
    ></v-text-field>
    <v-menu >
      <template v-slot:activator="{ props }">
        <v-btn
            icon="mdi-plus"
            density="compact"
            v-bind="props"
            style="width: 40px; height: 40px; border-radius: 8px;"
        ></v-btn>
      </template>
      <v-list>
        <v-list-item
            v-for="(item, index) in ['新建群组', '添加好友']"
            :key="index"
            @click=""
            style="cursor: pointer;"
        >
          <v-list-item-title @click="clickAddBtn(item)">{{ item }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <add-contacts-dialog ref="addContactsDialogRef"></add-contacts-dialog>
  </div>
</template>
<script setup lang="ts">
import {ref} from "vue";
import AddContactsDialog from "@/components/addContactsDialog.vue";

const addContactsDialogRef=ref()
const clickAddBtn=(name:string)=>{

  if (name === '新建群组') {
    // 处理新建群组的逻辑
    console.log('新建群组');
  } else if (name === '添加好友') {
    // 处理添加好友的逻辑
    console.log('添加好友');
    // 打开添加好友对话框
    addContactsDialogRef.value.openDialog()
  }
}


</script>
<style scoped>

</style>