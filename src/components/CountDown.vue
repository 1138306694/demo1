<template>
  <span :endTime="endTime" :endText="endText">
    <slot>{{ cont }}</slot>
  </span>
</template>

<script setup>
</script>

<script>
export default {
  data() {
    return {
      cont: "快选时间吧，都要干活了",
    };
  },
  props: {
    //接收父组件的数据
    endTime: {  default: "" },
    endText: {  default: "还不走等啥呢" },
  },
  watch: {
    //监听时间的变化
    endTime() {
      this.cacheOldWatch();
      this.countdowm(this.endTime);
    },
  },
  mounted() {
    // this.countdowm(this.endTime);
  },
  methods: {
    cacheOldWatch() {
      var qc = setInterval(function () {}, 1);
      for (var i = 0; i < qc; i++) {
        clearInterval(i);
      }
    },
    countdowm(timestamp) {
      console.log("计算时间戳：" + timestamp);
      let self = this;
      let timer = setInterval(function () {
        let nowTime = new Date();
        let endTime = new Date(timestamp * 1000);
        let t = endTime.getTime() - nowTime.getTime();
        if (t > 0) {
          let day = Math.floor(t / 86400000);
          let hour = Math.floor((t / 3600000) % 24);
          let min = Math.floor((t / 60000) % 60);
          let sec = Math.floor((t / 1000) % 60);
          hour = hour < 10 ? "0" + hour : hour;
          min = min < 10 ? "0" + min : min;
          sec = sec < 10 ? "0" + sec : sec;
          let format = "";
          if (day > 0) {
            format = `${day}天${hour}小时${min}分${sec}秒`;
          }
          if (day <= 0 && hour > 0) {
            format = `${hour}小时${min}分${sec}秒`;
          }
          if (day <= 0 && hour <= 0) {
            format = `${min}分${sec}秒`;
          }
          self.cont = "今日修行还有  " + format + "  结束";
          self.$emit("addGood");
          if (day == 0 && hour == 0 && min == 1 && sec == 0) {
            //最后三分钟发送短信提醒
            console.log("剩余时间已到开始发送短信");
            self.$emit("sendMsgAli");
          }
        } else {
          clearInterval(timer);
          self.cont = self.endText;
        }
      }, 1000);
    },
  },
};
</script>
