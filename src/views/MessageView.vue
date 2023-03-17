
<template>
  <!-- 下拉选 -->
  <el-row justify="start" style="margin-bottom: 20px;">
    <el-col :span="3">
      <el-select
        v-model="queryParam.msgKey"
        placeholder="选择key"
        @change="getNoteMessage()"
      >
        <el-option v-for="msg in queryMsg" :key="msg" :value="msg" />
      </el-select>
    </el-col>
    <!-- 是否已推送 -->
    <el-col :offset="1" :span="3">
      <el-select
        v-model="queryParam.isDeleted"
        placeholder="是否已推送"
        @change="getNoteMessage()"
      >
        <el-option v-for="isPush in queryIsPush" :key="isPush" :value="isPush.value" :label="isPush.label" />
      </el-select>
    </el-col>
  </el-row>
  <!-- 数据表格 -->
  <el-row >
    <el-col :span="24">
      <div class="table">
        <el-table :data="tableData" style="width: 90%" fit border>
          <el-table-column
            fixed
            prop="id"
            label="id"
            min-width="30px"
            align="center"
          />
          <el-table-column prop="createData" label="日期" align="center" />
          <el-table-column
            prop="msgValue"
            label="内容"
            min-width="120px"
            show-overflow-tooltip
            align="center"
          />
          <el-table-column
            prop="createBy"
            label="创建人"
            min-width="40px"
            align="center"
          />
          <el-table-column
            prop="isDeleted"
            label="是否已推送"
            min-width="50px"
            align="center"
          >
            <template #default="scope">
              <span v-if="scope == 0">未推送</span>
              <span v-else> 已推送</span>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            min-width="40px"
            align="center"
          >
            <template #default="scope">
              <el-button
                link
                type="primary"
                size="small"
                @click="handleClick(scope.row)"
                >查看</el-button
              >
              <el-button
                link
                type="primary"
                size="small"
                @click="handleEdit(scope.row)"
                >编辑</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-col>
  </el-row>
  <!-- 分页 -->
  <el-row>
    <el-col :span="10" :offset="7">
      <el-pagination
        background
        layout=" prev, pager, next,sizes,total"
        :total="pageTotal"
        :page-sizes="pageSizes"
        v-model:current-page="current"
        v-model:page-size="size"
        pager-count="9"
        @current-change="getNoteMessage()"
        @size-change="getNoteMessage()"
      >
      </el-pagination>
    </el-col>
  </el-row>

</template>

<script  setup>
import request from "../http.js";
import { ElNotification } from "element-plus";
import { VueElement } from "vue";
import { getCurrentInstance, ref, onMounted } from "vue";

//相当于 vue2 的this 获取全局挂载的变量
const { appContext } = getCurrentInstance();
const global = appContext.config.globalProperties;

//常用变量
let tableData = ref([]);
const current = ref(1);
const size = ref(10);
const pageTotal = ref(10);
// 分页下拉选项
let pageSizes = [10, 20, 30, 40, 50, 100];

//查询组件下拉选的值
let queryMsg = ["note"];
let queryIsPush = [{"value":0,"label":"未推送"},{"value":1,"label":"已推送"}];
// 定义搜索查询条件
let queryParam = {
  msgKey: "note",
  isDeleted: null,
};

//组件加载时
onMounted(() => {
  getNoteMessage();
});

//获取推送笔记信息
async function getNoteMessage() {
  getMessage(queryParam);
}

//获取信息
async function getMessage(query) {
  let result = await request.fetchPost("/msg/list", {
    current: current.value,
    size: size.value,
    data: { msgKey: query.msgKey, isDeleted: query.isDeleted },
  });
  tableData.value = result.data.data.records;
  // 设置分页属性
  setPage(result.data.data);
  // msg = result.data.msg;
  // alertMsg(msg, result.data.success, 3000);
  // console.log(tableData.value, "table");
}

function setPage(data) {
  console.log(
    "设置分页当前页：",
    data.current,
    "设置总数:",
    data.total,
    "设置页面大小:",
    data.size
  );
  current.value = data.current;
  size.value = data.size;
  pageTotal.value = data.total;
}

//组件点击事件  data 操作的数据
function handleClick(data) {
  alertMsg("点击了data:" + data.id);
}

//组件编辑事件  data 操作的数据
function handleEdit(data) {
  alertMsg("点击了data:" + data.id);
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
  console.log(global);
  global.$notify(msg);
}
</script>



