<template>
  <div id="top" @click="count1(2)">
    <div class="about">
      <el-tooltip content="功 · 德 · 加 · 倍" effect="customized">
        <el-button size="large" text="true" bg="true" round="true"
          >今日累计功德 :{{ count }}</el-button
        >
      </el-tooltip>
    </div>
  </div>
  <div id="but" @click="count1(1)">
    <div class="demo-datetime-picker">
      <div class="block">
        <span class="demonstration"
          >时间:{{ afterSixTime / 1000 + 9 * 3600 }}</span
        >
        <el-date-picker
          v-model="afterSixTime"
          type="datetime"
          placeholder="选择打卡时间"
          default-value="2022-10-12"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="x"
        />
      </div>
    </div>

    <div class="home">
      <!-- <img alt="Vue logo" src="../assets/logo.png" /> -->
      <!-- <HelloWorldss msg="哈哈哈哈哈哈" /> -->
      <CountDown
        :endTime="afterSixTime / 1000 + 9 * 3600"
        :endText="还不走等啥呢"
      />
    </div>
  </div>
</template>
<script scope setup>
import { ref, onMounted } from "vue";
import CountDown from "../components/CountDown.vue";
import { ElNotification } from "element-plus";
const afterSixTime = ref("");
const count = ref(0);
function count1(int) {
  count.value = count.value + int;
  ElNotification({
    title: "功德无量",
    message: "功德 + " + int,
    type: "success",
    duration: "900",
  });
}

onMounted(() => {
  count.value = 8;
  ElNotification({
    title: "初来乍到",
    message: "功德 + 8",
    type: "success",
    duration: "900",
  });
  console.log(`今日累计功德: ${count.value}`);
});
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

  mounted() {},
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

<style>
.el-popper.is-customized {
  /* Set padding to ensure the height is 32px */
  padding: 6px 12px;
  background: linear-gradient(90deg, rgb(159, 229, 151), rgb(204, 229, 129));
}

.el-popper.is-customized .el-popper__arrow::before {
  background: linear-gradient(45deg, #b2e68d, #bce689);
  right: 0;
}
</style>
