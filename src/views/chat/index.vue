<template>
  <div>
    <v-row align="start" no-gutters class="chat-row" style="height: 100%;">
      <v-col class="chat-list-col" style="height: 100%; max-height: 100%; overflow-y: auto;">
        <v-card style="height: 100%; border-right: 1px solid #e0e0e0;">
          <chat-list></chat-list>
        </v-card>
      </v-col>
      <v-col style="height: 100%; max-height: 100%; overflow-y: auto;">
        <chat-content></chat-content>
        <!--                <chat-content></chat-content>-->
      </v-col>
    </v-row>
  </div>
</template>
<script setup lang="ts">

import ChatList from "@/components/ChatList.vue";
import ChatContent from "@/components/ChatContent.vue";
</script>
<style scoped>
.chat-row {
  flex-wrap: nowrap; /* 关键点！不允许换行 */
  height: 100%;
}
.chat-list-col {
  flex: 0 0 300px; /* 固定最小宽度300px */
  max-width: 300px; /* 不拉伸 */
}
</style>