<template>
  <el-config-provider :locale="zhCn">
    <!-- <div id="top" @click="count1(1.5, '功德无量', '功德')"></div> -->
    <div class="top">
      <el-tooltip
        effect="light"
        :visible="visible"
        class="box-item"
        placement="right"
        auto-close="30"
      >
        <template #content>
          <span>{{ addGoodMessage }}</span>
        </template>
        <el-button
          @click="count1(3, '功德加倍无量', '功德')"
          size="large"
          text="true"
          bg="true"
          round="true"
          >今日累计功德 :{{ Math.round(count * 10) / 10 }}</el-button
        >
      </el-tooltip>

      <div id="but" @click="count1(1.5, '功德无量', '功德')">
        <div class="demo-datetime-picker">
          <div class="block">
            <span class="demonstration">时间:{{ afterSixTime / 1000 }}</span>
            <el-date-picker
              v-model="afterSixTime"
              type="datetime"
              placeholder="今日修行结束时间"
              :default-value="new Date()"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="x"
            />
          </div>
        </div>

        <div class="home">
          <!-- <img alt="Vue logo" src="../assets/logo.png" /> -->
          <!-- <HelloWorldss msg="哈哈哈哈哈哈" /> -->

          <CountDown
            :endTime="afterSixTime / 1000"
            :endText="还不走等啥呢"
            @addGood="
              count1(Math.round(Math.random() * 10) / 10, '工作修行', '功德')
            "
          />
        </div>
      </div>
    </div>
    <div class="top">
      <p>
        <span v-if="youName != null || youName != ''"
          >my:{{ myName }}-----</span
        >
        <span v-if="youName != null || youName != ''">you:{{ youName }}</span>
      </p>
      <el-button
        v-if="sayGoodMsgCount > 0 && checkNameIsOver()"
        style="width: 100px; background-color: lightgreen"
        type="primary"
        @click="sayGood(myName, youName)"
      >
        <span v-if="sayGoodMsgCount == sayGoodMsgMaxCount"
          >夸一下,{{ sayGoodMsgCount }}次</span
        >
        <span v-if="sayGoodMsgCount < sayGoodMsgMaxCount && sayGoodMsgCount > 0"
          >再夸一下,{{ sayGoodMsgCount }}次</span
        >
        <span v-if="sayGoodMsgCount < 0">今天夸够了啊，要知足</span>
      </el-button>
      <p>
        {{ sayGoodMsg }}
      </p>
      <div v-if="youNameInputIsHave">
        <el-input
          v-model="youName"
          v-if="youNameInputIsHave"
          placeholder="Your Name ---- 被夸的那个"
          size="small"
          clearable
        >
          <template #append>
            <el-button
              v-if="youNameInputIsHave"
              style="width: 100px; background-color: lightgreen"
              type="primary"
              @click="saveCache('you', youName)"
              >Set You</el-button
            >
          </template>
        </el-input>
      </div>
      <div v-if="myNameInputIsHave">
        <el-input
          v-model="myName"
          v-if="myNameInputIsHave"
          placeholder="My Name --- 配合夸的那个"
          size="small"
          class="w-50 m-2"
          clearable
        >
          <template #append>
            <el-button
              v-if="myNameInputIsHave"
              type="primary"
              style="width: 100px; background-color: lightgreen"
              @click="saveCache('my', myName)"
              >set My</el-button
            >
          </template>
        </el-input>
      </div>
    </div>
  </el-config-provider>
</template>
<script scope setup>
import { ref, onMounted } from "vue";
import CountDown from "../components/CountDown.vue";
import request from "../http.js";
import { ElNotification } from "element-plus";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
const afterSixTime = ref("");
const count = ref(0);
const visible = ref(false);

const addGoodMessage = ref("");
//最大夸奖次数
const sayGoodMsgMaxCount = 10;
const sayGoodMsgCount = ref(sayGoodMsgMaxCount);

const youName = ref("");
const myName = ref("");
const youNameInputIsHave = ref(true);
const myNameInputIsHave = ref(true);

const sayGoodMsg = ref("记得设置名字呀");

function count1(star, tit, mess) {
  count.value = count.value + star;
  visible.value = true;
  addGoodMessage.value = tit + " " + mess + " + " + star;
}

function popMessage(title, content, type, time) {
  if (type == true) {
    type = "success";
  } else {
    type = "fail";
  }
  if (time == null || time < 1) {
    time = 10;
  }
  ElNotification({
    title: title,
    message: content,
    type: type,
    duration: time,
  });
}
async function sayGood(my, you) {
  if (checkNameIsOver() && sayGoodMsgCount.value > 0) {
    youNameInputIsHave.value = false;
    myNameInputIsHave.value = false;
    // http://api.tianapi.com/caihongpi/index?key=a90992593826fc57c993527b26d4aabc
    let result = await request.fetchGet(
      "http://api.tianapi.com/caihongpi/index?key=a90992593826fc57c993527b26d4aabc",
      ""
    );
    console.log(
      "aaaa",
      result.data.newslist[0].content
        .replace(/你/g, youName.value)
        .replace(/我/g, myName.value)
    );
    sayGoodMsg.value = result.data.newslist[0].content
      .replace(/你/g, youName.value)
      .replace(/我/g, myName.value);
    sayGoodMsgCount.value = sayGoodMsgCount.value - 1;
  } else {
    if (getCache("you") != null && getCache("you") != "") {
      youNameInputIsHave.value = false;
    } else {
      youNameInputIsHave.value = true;
    }
    if (getCache("my") != null && getCache("my") != "") {
      myNameInputIsHave.value = false;
    } else {
      myNameInputIsHave.value = true;
    }
  }
  if (sayGoodMsgCount.value < 1) {
    sayGoodMsg.value = "今天夸够了啊，就不能知足亿点点";
  }
}

function saveCache(key, value) {
  if (value == null || value == "") {
    popMessage("设置有误", key + "名字不存在", false, "1100");
  } else {
    window.localStorage.setItem(key, JSON.stringify(value));
    popMessage("设置完成", key + "名字为:" + value, true, "900");
  }

  //刷新查看是否加载值
  sayGood(myName, youName);
  // localStorage.setItem(key, value);
}
function getCache(key) {
  console.log(
    key,
    "=====",
    JSON.parse(window.localStorage.getItem(key) || "[]")
  );
  return JSON.parse(window.localStorage.getItem(key) || "[]");

  // return localStorage.key;
}

function setNmae() {
  youName.value = getCache("you");
  myName.value = getCache("my");
}

function checkNameIsOver() {
  let you = getCache("you");
  let my = getCache("my");
  if (my != null && my != "" && you != null && you != "") {
    return true;
  } else {
    return false;
  }
}

onMounted(() => {
  count1(8, "初来乍到", "功德");

  console.log(`今日累计功德: ${count.value}`);

  //获取缓存用户名称
  setNmae();
  //彩虹屁
  sayGood(myName, youName);
});
</script>


<script>
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

.top {
  width: 430px;
  height: 200px;
  float: left;
  background-color: #b2e68d;
  margin: 30px;
  border: 1px solid black;
}
</style>
