
<template>
<div>
  index
</div>
</template>
<script setup lang="ts">



import {onMounted} from "vue";
import {getUserInfoApi} from "../api/userApi.ts";


const getUserInfo = () => {
  getUserInfoApi({}).then((res:any) => {
    console.log(res)
  })
}


onMounted(() => {
  console.log('index')
  getUserInfo()
})
</script>

<style scoped>

</style>