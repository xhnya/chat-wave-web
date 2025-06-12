<template>
  <div>
    <div>
      <v-row align="start" no-gutters class="chat-row" style="height: 100%;">
        <v-col class="chat-list-col" style="height: 100%; max-height: 100%; overflow-y: auto;">

          <v-card style="height: 100%; border-right: 1px solid #e0e0e0;">
            <top-search></top-search>
<!--            TODO: 好友通知-->
            <v-expansion-panels multiple>
              <v-expansion-panel
                  v-for="(group, i) in groups"
                  :key="i"
              >
                <template #title>
                  {{ group.name }}（总人数：{{ group.contacts.length }}，在线：12）
                </template>

                <template #text>
                  <v-list  class="pa-0 ma-0"  lines="two" style="margin: 0"   item-props :items="group.contacts">
                    <template v-slot:subtitle="{ subtitle }">
                      <div v-html="subtitle"></div>
                    </template>
                  </v-list>
                </template>
              </v-expansion-panel>
            </v-expansion-panels>

          </v-card>
        </v-col>
        <v-col style="height: 100%; max-height: 100%; overflow-y: auto;">

        </v-col>
      </v-row>
    </div>
    <add-contacts-dialog ref="addContactsDialogRef"></add-contacts-dialog>
  </div>
</template>
<script setup lang="ts">


import TopSearch from "@/components/TopSearch.vue";
import AddContactsDialog from "@/components/addContactsDialog.vue";
import {ref} from "vue";



const groups = [
  {
    name: '家人',
    contacts: [
      { title: '爸爸', subtitle: "[在线]爱运动", prependAvatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg' },
      { title: '妈妈',  subtitle: "[在线]喜欢阅读", prependAvatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg' },
    ],
  },
  {
    name: '朋友',
    contacts: [
      { title: '小明',  subtitle: '[在线]在学习 Vue' },
      { title: '小红',  subtitle: '[在线]准备考试' },
    ],
  },
  {
    name: '同事',
    contacts: [
      { title: '张三',subtitle: '[离线]正在开发项目' },
      { title: '李四', subtitle: '[在线]开会中' },
    ],
  },
];

</script>
<style scoped>

</style>