<template>
  <el-config-provider :locale="zhCn">
    <el-row :gutter="10" class="top row">
      <!-- 下班打卡计时 -->
      <el-col :span="8"
        ><div class="grid-content ep-bg-purple" />
        <!-- 累计功德 -->
        <el-tooltip effect="light" :visible="visible" class="box-item" placement="right" auto-close="30">
          <template #content>
            <span>{{ addGoodMessage }}</span>
          </template>
          <el-button @click="count1(3, '功德加倍无量', '功德')" size="large" text bg round>今日累计功德 :{{ Math.round(count * 10) / 10 }}</el-button>
        </el-tooltip>

        <div id="but" @click="count1(1.5, '功德无量', '功德')">
          <div class="demo-datetime-picker">
            <div class="block" v-if="setEndWorkTimeOver">
              <!-- <span class="demonstration">时间:{{ afterSixTime / 1000 }}</span> -->
              <el-time-select v-model="afterSixTime" min-time="17:30" placeholder="课节结束时间" start="17:30" step="00:01" end="23:59" format="YYYY-MM-DD HH:mm:ss" @change="resetTime(false)" />
            </div>
          </div>

          <div class="home">
            <!-- 重新实现 -->
            <el-countdown title="今日开心倒计时" format="HH:mm:ss" :value="countdownTime" @finish="
                popMessage(
                  '完美结束',
                  '今天修行结束，开始开心的夜晚叭',
                  true,
                  9999
                )
              " />
            <el-button class="countdown-footer" type="primary" @click="resetTime(true)">{{ setEndWorkTimeOver == false ? "重新开始修行" : "开始修行" }}
            </el-button>
          </div>
        </div>
      </el-col>
      <!-- 夸一夸 -->
      <el-col :span="6" :push="1">
        <div class="grid-content ep-bg-purple" />
        <p>
          <span v-if="youName != null || youName != ''">my:{{ myName }}-----</span>
          <span v-if="youName != null || youName != ''">you:{{ youName }}</span>
        </p>
        <el-button v-if="sayGoodMsgMaxCount > 0 && checkNameIsOver()" style="width: 100px; background-color: lightgreen" type="primary" @click="sayGood(myName, youName)">
          <span v-if="sayGoodMsgMaxCount == maxCount">夸一下,{{ sayGoodMsgMaxCount }}次</span>
          <span v-if="sayGoodMsgMaxCount > 0">再夸一下,{{ sayGoodMsgMaxCount }}次</span>
          <span v-if="sayGoodMsgMaxCount < 0">今天夸够了啊，要知足</span>
        </el-button>
        <p>
          {{ sayGoodMsg }}
        </p>
        <div v-if="youNameInputIsHave">
          <el-input v-model="youName" v-if="youNameInputIsHave" placeholder="Your Name ---- 被夸的那个" size="small" clearable>
            <template #append>
              <el-button v-if="youNameInputIsHave" style="width: 100px; background-color: lightgreen" type="primary" @click="saveCache('you', youName)">Set You</el-button>
            </template>
          </el-input>
        </div>

        <div v-if="myNameInputIsHave">
          <el-input v-model="myName" v-if="myNameInputIsHave" placeholder="My Name --- 配合夸的那个" size="small" class="w-50 m-2" clearable>
            <template #append>
              <el-button v-if="myNameInputIsHave" type="primary" style="width: 100px; background-color: lightgreen" @click="saveCache('my', myName)">set My</el-button>
            </template>
          </el-input>
        </div>
        <div v-if="myPhoneInputIsHave">
          <el-input v-model="phone" placeholder="临近下班提醒短信手机号" size="small" class="w-50 m-2" clearable>
            <template #append>
              <el-button type="primary" style="width: 100px; background-color: lightgreen" @click="saveCache('phone', phone)">set My</el-button>
            </template>
          </el-input>
        </div>
      </el-col>
      <!-- 日期计算 -->
      <el-col :span="10" :push="2">
        <div class="grid-content ep-bg-purple" />

        <div class="date">
          <el-input v-model="sourceDate" type="date" placeholder="请输入计算开始时间" />
        </div>
        <div class="date">
          <el-input-number v-model="addDay" :min="-9999" :max="9999" @change="calculateDateChange" />
        </div>
        <div class="dateResult">
          <el-input v-model="calculateResult" disabled placeholder="计算结果" />
        </div>
      </el-col>
    </el-row>
    <el-row class="row" :gutter="20">
      <el-col class="reduceImg" :span="6" :push="1">
        <el-input class="topPx" v-model="reduceUrl" :rows="2" type="textarea" placeholder="请输入压缩图片URL" />
        <el-input class="topPx splitCell" v-model="reducePostUrl" :rows="2" type="textarea" placeholder="输入压缩请求ip地址,不填默认服务器，容易oom" />
        <el-button class="topPx splitCell" @click="reduceImg" type="primary">开始压缩
        </el-button>
      </el-col>
      <el-col :span="6" :push="2">
        <div>
          <el-input v-model="translationText" :rows="2" type="textarea" placeholder="输入翻译文本" :autosize="{ minRows: 2, maxRows: 100 }" show-word-limit @input="toTranslation" class="topPx" />
          <div>
            <el-input v-model="translationResult" :rows="2" type="textarea" placeholder="翻译结果" show-word-limit :autosize="{ minRows: 2, maxRows: 100 }" disabled class="topPx" />
          </div>
          <div class="selectlanguage">
            <el-select v-model="nowChinese" filterable class="topPx" @change="toTranslation">
              <el-option v-for="key in selectChinese" :key="key.key" :value="key.key" :label="key.value">
              </el-option>
            </el-select>
          </div>
          <div class="selectlanguage">
            <el-select v-model="nowTranslationChannel" filterable class="topPx" @change="toTranslation">
              <el-option v-for="key in selectTranslationChannel" :key="key.key" :value="key.key" :label="key.value" disabled>
              </el-option>
            </el-select>
          </div>
        </div>
      </el-col>
      <el-col :span="8"> </el-col>
    </el-row>
  </el-config-provider>
</template>
<script scope setup>
import { ref, onMounted } from "vue";
// import CountDown from "../components/CountDown.vue";
import request from "../http.js";
import { ElNotification } from "element-plus";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import moment from "moment";
const afterSixTime = ref("");
const countdownTime = ref();
const setEndWorkTimeOver = ref(true);
const count = ref(0);
const visible = ref(false);

const addGoodMessage = ref("");
// 计算日期的 开始日期 和加减天数
const addDay = ref(1);
const sourceDate = ref();
//计算结果
const calculateResult = ref();

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
const maxCount = ref(1000);

const reduceUrl = ref();
const reducePostUrl = ref();

let translationText = ref();
let translationResult = ref();
let nowChinese = ref("en");
let nowTranslationChannel = ref("bd");
let selectChinese = [
  { key: "zh", value: "中文" },
  { key: "en", value: "英文" },
  { key: "yue", value: "粤语" },
  { key: "wyw", value: "文言文" },
  { key: "jp", value: "日语" },
  { key: "kor", value: "韩语" },
  { key: "fra", value: "法语" },
  { key: "spa", value: "西班牙语" },
  { key: "th", value: "泰语" },
  { key: "ara", value: "阿拉伯语" },
  { key: "ru", value: "俄语" },
  { key: "pt", value: "葡萄牙语" },
  { key: "de", value: "德语" },
  { key: "it", value: "意大利语" },
  { key: "el", value: "希腊语" },
  { key: "pl", value: "波兰语" },
  { key: "bul", value: "保加利亚语" },
  { key: "est", value: "爱沙尼亚语" },
  { key: "dan", value: "丹麦语" },
  { key: "fin", value: "芬兰语" },
  { key: "cs", value: "捷克语" },
  { key: "rom", value: "罗马尼亚语" },
  { key: "slo", value: "斯洛文尼亚语" },
  { key: "swe", value: "瑞典语" },
  { key: "hu", value: "匈牙利语" },
  { key: "cht", value: "繁体中文" },
  { key: "vie", value: "越南语" },
];
let selectTranslationChannel = [
  { key: "bd", value: "百度翻译" },
  { key: "wangyi", value: "网易翻译" },
];

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
    //https://api.vvhan.com/api/love
    // let result = await request.fetchGet(
    //   "https://api.tianapi.com/caihongpi/index?key=a90992593826fc57c993527b26d4aabc",
    //   ""
    // );
    let result = await request.fetchGet(
      "/until/love",
      {}
    );
    console.log(
      "aaaa",
      result.data.data
        .replace(/你/g, youName.value)
        .replace(/我/g, myName.value)
        .replace(/XXX/g, youName.value)
    );
    sayGoodMsg.value = result.data.data
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
//本地记录缓存
function saveCache(key, value) {
  if (!value) {
    popMessage("设置有误", key + "名字不存在", false, 1100);
  } else {
    window.localStorage.setItem(key, JSON.stringify(value));
    console.log("设置本地缓存:" + key + ",value:" + JSON.stringify(value));
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
// 计算日期
async function calculateDateChange() {
  console.log(
    "sourceDate:::::",
    sourceDate.value,
    "------addDay",
    addDay.value
  );
  let result = await request.fetchGet(
    "/until/calculate/date?source=" + sourceDate.value + "&day=" + addDay.value,
    ""
  );

  console.log("计算结果：", result.data);
  if (result.data) {
    calculateResult.value = result.data.data;
  } else {
    (calculateResult.value = "计算有误，请检查开始日期:"),
      sourceDate.value + "计算天数:",
      addDay.value;
  }
}
//压缩图片
async function reduceImg() {
  if (reduceUrl.value) {
    var tempUrl = "";
    if (reducePostUrl.value) {
      tempUrl = reducePostUrl.value;
    }
    let result = await request.fetchGet(
      tempUrl + "/until/reduce/img?url=" + reduceUrl.value,
      ""
    );
    if (result.data.success) {
      popMessage("压缩完成", result.data.data, result.data.success, 5000);
    }
  } else {
    popMessage("请输入图片地址", "", "fail", 2000);
  }
}

//设置选择时间
function resetTime(flag) {
  var countTime = moment(nowTime).format("X");
  var afterTime = moment(afterSixTime.value).format("YYYY-MM-DD HH:mm:ss");
  if (flag) {
    //将时间设置为空  为重新设置时间
    var nowTime = new Date().getTime() - 1;
    countdownTime.value = countTime;
    afterSixTime.value = afterTime;
  } else {
    //为选中时间，设置为开始值
    console.log("afterSixTime.value", afterSixTime.value);
    countdownTime.value = moment(afterTime).valueOf();
    console.log("设置的倒计时实际:", countdownTime.value);
    //缓存当前记录时间
    setWorkTime(afterTime);
  }
  setEndWorkTimeOver.value = flag;
}

//设置今日下班时间
function setWorkTime(date) {
  let nowDate = new Date();
  let key = "workTime";
  let value = {
    time: nowDate.getFullYear() + "" + nowDate.getMonth() + nowDate.getDate(),
    value: date,
  };
  saveCache(key, value);
}

function getWorkTime() {
  let key = "workTime";
  let value = getCache(key);
  console.log("获取缓存work时间", value);
  if (value) {
    // 存在记录，比较时间是否为今日
    let cacheDate = value.time;
    let cacheTime = value.value;
    let nowDate = new Date();

    console.log(
      "nowDategetFullYear",
      nowDate.getFullYear() + "" + nowDate.getMonth() + nowDate.getDate()
    );
    console.log("cacheDategetFullYear", cacheDate);
    if (
      nowDate.getFullYear() + "" + nowDate.getMonth() + nowDate.getDate() ==
      cacheDate
    ) {
      //时间为今日，则使用，否则不做处理
      //修改默认时间为缓存时间
      afterSixTime.value = cacheTime;
      countdownTime.value = cacheTime;
      //使用今日时间
      resetTime(false);
    } else {
      resetTime(true);
    }
  }
}

function startEndWork() {
  //今日页面 先处理当前记录时间
  getWorkTime();
}

//翻译
async function toTranslation() {
  var result = await request.fetchPost("/until/translation", {
    from: "auto",
    to: nowChinese.value,
    channel: nowTranslationChannel.value,
    query: translationText.value,
  });
  console.log(result.data.data);
  if (result && result.data && result.data.success) {
    translationResult.value = result.data.data;
  } else {
    popMessage("翻译繁忙");
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
  //开始下班倒计时
  startEndWork();
});
</script>


<script>
export default {
  name: "LittleTool",
  components: {},
  mounted() { },
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

<style>
.top {
  float: left;
  margin: 30px;
  position: absolut;
}

.date {
  width: 200px;
  float: left;
}
.dateResult {
  width: 180px;
  float: left;
  margin-left: 110px;
  margin-top: 40px;
}
.reduceImg {
  width: 300px;
}

.selectlanguage {
  width: 120px;
  float: left;
  margin-left: 10px;
}
.language {
  width: 300px;
  height: 60px;
  float: left;
}
.row {
  float: left;
  margin: 30px;
  height: 240px;
  width: 1200px;
}

.topPx {
  margin-top: 10px;
}

.splitCell {
  float: left;
}
</style>
