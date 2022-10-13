<template>
  <div class="about">
    <h1 @click="count1">今日累计功德 :{{ count }}</h1>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { ElNotification } from "element-plus";
const count = ref(0);
function count1() {
  count.value++;
  ElNotification({
    title: "功德无量",
    message: "功德+1",
    type: "success",
    duration: "900",
  });
}

onMounted(() => {
  console.log(`今日累计功德: ${count.value}`);
});
</script>


