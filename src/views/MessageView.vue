
<template>
  <div class="table">
    <el-table :data="tableData" style="width: 60%">
      <el-table-column fixed prop="id" label="id" width="100" />
      <el-table-column prop="createData" label="日期" width="180" />
      <el-table-column prop="msgValue" label="内容" width="400" />
      <el-table-column prop="createBy" label="创建人" width="100" />
      <el-table-column prop="msgKey" label="关键字" width="70" />
      <el-table-column fixed="right" label="操作" width="120">
        <template #default>
          <el-button link type="primary" size="small" @click="handleClick"
            >查看</el-button
          >
          <el-button link type="primary" size="small">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script  setup>
import request from "../http";
import { ElNotification } from "element-plus";
import { VueElement } from "vue";
import {  getCurrentInstance,ref, onMounted } from "vue";

//相当于 vue2 的this 获取全局挂载的变量
const { appContext } = getCurrentInstance();
const global = appContext.config.globalProperties;

//常用变量
let msg = "";
let tableData = ref([]);
let current = ref(1);
let size = ref(10);
//组件加载时
onMounted(() => {
  let result = getMessage("note");
  console.log(result + "aaaaaa");

});

//获取信息
async function getMessage(msgKey) {
  let result = await request.fetchPost("/msg/list", {
    current: current.value,
    size: size.value,
    data: { msgKey: msgKey },
  });
  tableData.value = result.data.data.records;
  msg = result.data.msg;
  alertMsg(msg, result.data.success, 3000);
  console.log(tableData.value + "table");
}

//组件编辑事件
function handleClick() {
  alertMsg("点击了操作");
  console.log("click");
}

//消息弹窗
function alertMsg(title, flag, time) {
  let type = "falil";
  if (flag) {
    type = "success";
  }
  let msg = {
    title: title,
    type: type,
    duration: time,
  };
  console.log(global)
  global.$notify(msg);
  // ElNotification({
  //   title: title,
  //   type: type,
  //   duration: time,
  // });
}

</script>



