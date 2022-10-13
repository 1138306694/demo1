<template>
  <div class="about">
    <h1 @click="count1">this a count :{{ count }}</h1>
  </div>
</template>
<script setup>
// export default {
//   data() {
//     return {
//       count: 0,
//     };
//   },
//   methods: {
//     count1() {
//       this.count++;
//     },
//   },
//   mounted() {
//     console.log(`The initial count is ${this.count}.`);
//   },
// };
import { ref, onMounted } from "vue";
const count = ref(0);
function count1() {
  count.value++;
}

onMounted(() => {
  console.log(`The init count is: ${count.value}`);
});
</script>


