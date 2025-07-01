<template>
  <div>
    <div>
      <v-row align="start" no-gutters class="chat-row" style="height: 100%;">
        <v-col class="chat-list-col" style="height: 100%; max-height: 100%; overflow-y: auto;">

          <v-card style="height: 100%; border-right: 1px solid #e0e0e0;">
            <top-search></top-search>
<!--            TODO: 好友通知-->
            <v-card-actions class="notification-area">
              <v-badge
                  :content="notificationCount"
                  :model-value="notificationCount > 0"
                  color="error"
              >
                <v-btn style="width: 100%;" variant="text" @click="showNotificationPanel">
                  <v-icon>mdi-bell</v-icon> 好友通知
                </v-btn>
              </v-badge>
            </v-card-actions>

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
        <!-- 右侧面板 -->
        <v-col style="height: 100%; max-height: 100%; overflow-y: auto;">
          <!-- 好友通知 -->
          <v-card v-if="showNotifications" class="h-100">
            <v-card-title class="d-flex justify-space-between align-center">
              <span>好友通知</span>
              <v-btn icon @click="showNotifications = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-card-title>
            <v-card-text>
              <v-list v-if="notifications.length > 0">
                <v-list-item v-for="(notification, index) in notifications" :key="notification.userId ?? index" class="mb-2">
                  <v-list-item-title>{{ notification.nickname }}</v-list-item-title>
<!--                  <v-list-item-subtitle>{{ notification.message }}</v-list-item-subtitle>-->
                  <v-list-item-subtitle class="text-caption text-grey">
                    {{ formatTime(notification.createdAt) }}
                  </v-list-item-subtitle>
                  <template v-slot:append>
                    <div v-if="notification.status === 0" class="d-flex gap-2">
                      <v-btn color="success" size="small" @click="acceptFriendRequest(notification.userId)">接受</v-btn>
                      <v-btn color="error" size="small" @click="rejectFriendRequest(notification.userId)">拒绝</v-btn>
                    </div>
                    <div v-else-if="notification.status === 1" class="text-success text-caption">已接受</div>
                    <div v-else-if="notification.status === 2" class="text-error text-caption">已拒绝</div>
                  </template>
                </v-list-item>
              </v-list>
              <div v-else class="text-center py-4">
                暂无通知
              </div>
            </v-card-text>
          </v-card>
          <div v-else>
            111
          </div>
        </v-col>
      </v-row>
    </div>
    <add-contacts-dialog ref="addContactsDialogRef"></add-contacts-dialog>
  </div>
</template>
<script setup lang="ts">


import TopSearch from "@/components/TopSearch.vue";
import AddContactsDialog from "@/components/addContactsDialog.vue";
import {computed, ref} from "vue";
import {getFriendRequestApi} from "@/api/userApi.ts";
import {useUserStore} from "@/stores/user.ts";


// 通知相关
const notificationCount = ref(3);
const showNotifications = ref(false);
const notifications = ref<Array<{ userId: number; nickname: string; createdAt: Date; status: number }>>([]);
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

//获取用户info useUserStore()中获取
const userInfo=computed(() => {
  const userStore = useUserStore();
  return userStore.userInfo;
});


const getFriendRequestList = () => {
  // 模拟获取好友请求列表
  getFriendRequestApi({userId:userInfo.value?.userId}).then((response) => {
    // 假设返回的数据格式为 { data: Array<Notification> }
    notifications.value = response.data;
    notificationCount.value = notifications.value.length;
  }).catch((error) => {
    console.error('获取好友请求失败:', error);
  });
};

const showNotificationPanel = () => {
  showNotifications.value = true;
  getFriendRequestList();
};

const acceptFriendRequest = (id: number) => {
  // 调用接受好友请求的API
  console.log('接受好友请求', id);
  removeNotification(id);
  // 这里可以添加将好友添加到联系人列表的逻辑
};

const rejectFriendRequest = (id: number) => {
  // 调用拒绝好友请求的API
  console.log('拒绝好友请求', id);
  removeNotification(id);
};

const removeNotification = (id: number) => {
  const index = notifications.value.findIndex(item => item.id === id);
  if (index !== -1) {
    notifications.value.splice(index, 1);
    notificationCount.value--;
  }
};

// 格式化时间
const formatTime = (time: string | Date): string => {
  // 把 MySQL 字符串手动转为标准格式：2025-06-30T09:00:16
  const date = typeof time === 'string'
      ? new Date(time.replace(' ', 'T'))
      : new Date(time);

  if (isNaN(date.getTime())) return '无效时间';

  const now = new Date();
  const diff = now.getTime() - date.getTime();

  if (diff < 60000) {
    return '刚刚';
  } else if (diff < 3600000) {
    return `${Math.floor(diff / 60000)}分钟前`;
  } else if (diff < 86400000) {
    return `${Math.floor(diff / 3600000)}小时前`;
  } else {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
};



</script>
<style scoped>
.notification-area {
  padding: 0 16px;
  border-bottom: 1px solid #e0e0e0;
}
</style>