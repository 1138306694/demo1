<template>
  <div class="demo-datetime-picker">
    <div class="block">
      <span class="demonstration">时间:{{ afterSixTime / 1000 }}</span>
      <el-date-picker
        v-model="afterSixTime"
        type="datetime"
        placeholder="选择时间"
        default-value="2022-10-12"
        format="YYYY-MM-DD hh:mm:ss"
        value-format="x"
      />
    </div>
  </div>

  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png" /> -->
    <!-- <HelloWorldss msg="哈哈哈哈哈哈" /> -->
    <CountDown :endTime="afterSixTime / 1000" :endText="hhhhh" />
  </div>
</template>
<script scope setup>
import { ref } from "vue";
import CountDown from "../components/CountDown.vue";
const afterSixTime = ref("");
</script>


<script>
// import HelloWorldss from "@/components/HelloWorld.vue";

// import { DateTimePicker } from "element-plus";

export default {
  name: "HomeView",
  components: {
    // HelloWorldss,
    CountDown,
  },
};
</script>

<style scoped>
.demo-datetime-picker {
  display: flex;
  width: 100%;
  padding: 0;
  flex-wrap: wrap;
}
.demo-datetime-picker .block {
  padding: 30px 0;
  text-align: center;
  border-right: solid 1px var(--el-border-color);
  flex: 1;
}
.demo-datetime-picker .block:last-child {
  border-right: none;
}
.demo-datetime-picker .demonstration {
  display: block;
  color: var(--el-text-color-secondary);
  font-size: 14px;
  margin-bottom: 20px;
}
</style>
