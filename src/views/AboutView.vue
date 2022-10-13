<template>
  <div class="about">
    <h1 @click="count1">今日累计功德 :{{ count }}</h1>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
const count = ref(0);
function count1() {
  count.value++;
}

onMounted(() => {
  console.log(`今日累计功德: ${count.value}`);
});
</script>


