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
            @sendMsgAli="sendMsgAli()"
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
        v-if="sayGoodMsgMaxCount > 0 && checkNameIsOver()"
        style="width: 100px; background-color: lightgreen"
        type="primary"
        @click="sayGood(myName, youName)"
      >
        <span v-if="sayGoodMsgMaxCount == maxCount"
          >夸一下,{{ sayGoodMsgMaxCount }}次</span
        >
        <span v-if="sayGoodMsgMaxCount > 0"
          >再夸一下,{{ sayGoodMsgMaxCount }}次</span
        >
        <span v-if="sayGoodMsgMaxCount < 0">今天夸够了啊，要知足</span>
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
      <div v-if="myPhoneInputIsHave">
        <el-input
          v-model="phone"
          placeholder="临近下班提醒短信手机号"
          size="small"
          class="w-50 m-2"
          clearable
        >
          <template #append>
            <el-button
              type="primary"
              style="width: 100px; background-color: lightgreen"
              @click="saveCache('phone', phone)"
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
import moment from "moment";
const afterSixTime = ref("");
const count = ref(0);
const visible = ref(false);

const addGoodMessage = ref("");

//配置输入框绑定的变量
const youName = ref("");
const myName = ref("");
const phone = ref("");
//配置是否展示输入框
const youNameInputIsHave = ref(true);
const myNameInputIsHave = ref(true);
const myPhoneInputIsHave = ref(true);

//缓存夸奖次数
const sayGoodMsgMaxCount = ref();
//总计
const maxCount = ref(10);

const sayGoodMsg = ref("记得设置名字呀");
//缓存最大次数的key
let key = "sayGoodMsgMaxCount";
//功德累计
function count1(star, tit, mess) {
  count.value = count.value + star;
  visible.value = true;
  addGoodMessage.value = tit + " " + mess + " + " + star;
}

//弹窗提示
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
  if (checkNameIsOver() && sayGoodMsgMaxCount.value > 0) {
    youNameInputIsHave.value = false;
    myNameInputIsHave.value = false;
    // http://api.tianapi.com/caihongpi/index?key=a90992593826fc57c993527b26d4aabc
    let result = await request.fetchGet(
      "https://api.tianapi.com/caihongpi/index?key=a90992593826fc57c993527b26d4aabc",
      ""
    );
    console.log(
      "aaaa",
      result.data.newslist[0].content
        .replace(/你/g, youName.value)
        .replace(/我/g, myName.value)
        .replace(/XXX/g, youName.value)
    );
    sayGoodMsg.value = result.data.newslist[0].content
      .replace(/你/g, youName.value)
      .replace(/我/g, myName.value)
      .replace(/XXX/g, youName.value);
    //修改页面缓存次数
    sayGoodMsgMaxCount.value = sayGoodMsgMaxCount.value - 1;
    //修改浏览器缓存中的次数
    let cacheCount = getCache(key);
    cacheCount.count = cacheCount.count - 1;
    saveCache(key, cacheCount);
  } else {
    if (getCache("you")) {
      youNameInputIsHave.value = false;
    } else {
      youNameInputIsHave.value = true;
    }
    if (getCache("my")) {
      myNameInputIsHave.value = false;
    } else {
      myNameInputIsHave.value = true;
    }
  }
  if (sayGoodMsgMaxCount.value < 1) {
    sayGoodMsg.value = "今天夸够了啊，就不能知足亿点点";
  }
  //检查打卡提醒手机号是否添加
  if (getCache("phone")) {
    myPhoneInputIsHave.value = false;
  } else {
    myPhoneInputIsHave.value = true;
  }
}

function getSayGoodMsgMaxCount() {
  let nowDate = moment(new Date()).format("YYYY-MM-DD");
  let cacheCount = getCache(key);
  if (!cacheCount) {
    //新的
    let cacheValue = {};

    cacheValue.count = maxCount.value;
    cacheValue.date = nowDate;

    //保存新的
    saveCache(key, cacheValue);
    //返回新的
    return cacheValue.count;
  } else {
    //存在，比较时间
    if (cacheCount.date == nowDate) {
      //时间范围内
      return cacheCount.count;
    } else {
      //新的
      let cacheValue = {};
      cacheValue.count = maxCount.value;
      cacheValue.date = nowDate;
      saveCache(key, cacheValue);
      //重新判断
      getSayGoodMsgMaxCount();
    }
  }
}
// 发送阿里短信提醒下班
async function sendMsgAli() {
  let name = getCache("you");
  let phone = getCache("phone");
  if (name && phone) {
    //内容已读取，允许发送
    let result = await request.fetchPost("/send/msg/ali", {
      name: name,
      phone: phone,
    });
    console.log("发送完成，发送结果" + result.data);
    popMessage("下班提醒", result.data.data, result.data.success, 10000);
  } else {
    popMessage("下班提醒失败", "读取失败:name" + name + "phone：" + phone);
  }
}

function saveCache(key, value) {
  if (!value) {
    popMessage("设置有误", key + "名字不存在", false, 1100);
  } else {
    window.localStorage.setItem(key, JSON.stringify(value));
  }
  if (key == "my" || key == "you" || key == "phone") {
    popMessage("设置完成", key + "为:" + JSON.stringify(value), true, 1900);
    //刷新查看是否加载值
    sayGood(myName, youName);
  }
}
function getCache(key) {
  console.log(key, "=====", JSON.parse(window.localStorage.getItem(key)));
  return JSON.parse(window.localStorage.getItem(key));
}

function setNmae() {
  youName.value = getCache("you");
  myName.value = getCache("my");
}

function checkNameIsOver() {
  let you = getCache("you");
  let my = getCache("my");

  if (my && you) {
    return true;
  } else {
    return false;
  }
}

onMounted(() => {
  count1(8, "初来乍到", "功德");

  console.log(`今日累计功德: ${count.value}`);
  //获取今日可以操作的最大夸夸次数
  sayGoodMsgMaxCount.value = getSayGoodMsgMaxCount();

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
