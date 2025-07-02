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
                  <!-- 左侧联系人列表 -->
                  <v-list class="pa-0 ma-0" lines="two" style="margin: 0" item-props :items="group.contacts">
                    <v-list-item
                        v-for="(contact, idx) in group.contacts"
                        :key="contact.userId ?? idx"
                        @click="selectContact(contact)"
                        :active="selectedContact && selectedContact.userId === contact.userId"
                    >
                      <v-list-item-title>{{ contact.nickname || contact.title }}</v-list-item-title>
                      <template v-slot:subtitle>
                        <div v-html="contact.subtitle"></div>
                      </template>
                    </v-list-item>
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
          <!-- 右侧详情面板 -->
          <v-card v-else-if="selectedContact" class="h-100">
            <v-card-title>
              联系人详情
            </v-card-title>
            <v-card-text>
              <div>昵称：{{ selectedContact.nickname || selectedContact.title }}</div>
              <div>状态：{{ selectedContact.status }}</div>
              <!-- 其他详情字段 -->
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="goToChat(selectedContact)">去聊天</v-btn>
            </v-card-actions>
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
import {computed, onMounted, ref} from "vue";
import {acceptFriendRequestApi, getFriendRequestApi} from "@/api/userApi.ts";
import {useUserStore} from "@/stores/user.ts";
import {getFriendsListApi} from "@/api/contacts.ts";
import { useRouter } from 'vue-router';
import {createChatListApi} from "@/api/chatApi.ts";
import {ElMessage} from "element-plus";

// 通知相关
const notificationCount = ref(3);
const showNotifications = ref(false);
const notifications = ref<Array<{ userId: number; nickname: string; createdAt: Date; status: number }>>([]);
const groups = ref([])

//获取用户info useUserStore()中获取
const userInfo=computed(() => {
  const userStore = useUserStore();
  return userStore.userInfo;
});

onMounted(() => {
  // 页面加载时获取联系人列表
  getContactsList();
});
// script setup 部分
const selectedContact = ref<any>(null);

function selectContact(contact: any) {
  selectedContact.value = contact;
}

const router = useRouter();

function goToChat(contact: any) {
  console.log('跳转到聊天', contact);
  createChatListApi({ userId: userInfo.value?.userId, friendId: contact.userId })
    .then(() => {
      ElMessage.success('聊天创建成功');
    })
    .catch((error) => {
      console.error('创建聊天失败:', error);
    });


  if (!contact?.userId) return;
  router.push({ name: 'Chat', params: { userId: contact.userId } });
}
//获取联系人列表
const  getContactsList = () => {
  getFriendsListApi({userId:userInfo.value?.userId}).then((response) => {
    // 假设返回的数据格式为 { data: Array<{ name: string; contacts: Array<{ userId: number; nickname: string; status: number }> }> }
    groups.value = response.data
  }).catch((error) => {
    console.error('获取联系人列表失败:', error);
  });
};


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
  acceptFriendRequestApi({ userId: userInfo.value?.userId, friendId: id,status: 1 })
    .then(() => {
      // 假设接受成功后，更新通知状态
      getFriendRequestList()
    })
    .catch(error => {
      console.error('接受好友请求失败:', error);
    });
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