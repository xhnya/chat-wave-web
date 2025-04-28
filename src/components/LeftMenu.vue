<template>
  <div>

    <v-navigation-drawer
        expand-on-hover
        rail
    >
      <v-list>
        <v-list-item
            prepend-avatar="https://randomuser.me/api/portraits/women/85.jpg"
            subtitle="sandra_a88@gmailcom"
            title="Sandra Adams"
        ></v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list density="compact" nav>
        <v-list-item prepend-icon="mdi-message-bulleted" title="消息"
                     :to="'/chat'"
                     value="myfiles"></v-list-item>
        <v-list-item prepend-icon="mdi-account-multiple"
                     :to="'/contacts'"
                     title="联系人" value="shared"></v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>
<script setup lang="ts">





</script>
<style scoped>

</style>