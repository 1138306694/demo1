
<template>
  <div class="table">
    <el-table :data="tableData" style="width: 90%" fit border >
      <el-table-column fixed prop="id" label="id" min-width="30px" align="center" />
      <el-table-column prop="createData" label="日期" align="center" />
      <el-table-column prop="msgValue" label="内容" min-width="120px" show-overflow-tooltip align="center"  />
      <el-table-column prop="createBy" label="创建人" min-width="40px" align="center" />
      <el-table-column prop="msgKey" label="关键字" min-width="40px" align="center" />
      <el-table-column prop="isDeleted" label="是否已推送" min-width="50px" align="center" >
        <template #default="scope">
          <span v-if="scope == 0">未推送</span>
          <span v-else> 已推送</span>
        </template>
        </el-table-column>
      <el-table-column fixed="right" label="操作" min-width="40px" align="center" >
        <template #default="scope">
          <el-button link type="primary" size="small" @click="handleClick(scope.row)"
            >查看</el-button
          >
          <el-button link type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
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

//组件点击事件  data 操作的数据
function handleClick(data) {
  alertMsg("点击了data:"+ data.id);
}

//组件编辑事件  data 操作的数据
function handleEdit(data) {
  alertMsg("点击了data:"+ data.id);
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



