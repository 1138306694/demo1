
<template>
  <!-- 下拉选 -->
  <el-row justify="start" style="margin-bottom: 20px">
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
        clearable
        filterable
        default-first-option

        
      >
        <el-option
          v-for="isPush in queryIsPush"
          :key="isPush"
          :value="isPush.value"
          :label="isPush.label"
        />
      </el-select>
    </el-col>
    <el-col :offset="12" :span="3">
      <el-button type="primary" plain round @click="openOperation('add', null)"
        >新增待办</el-button
      >
    </el-col>
  </el-row>
  <!-- 数据表格 -->
  <el-row>
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
            :formatter="
              (row) => {
                if (row.isDeleted) {
                  return '已推送';
                } else {
                  return '未推送';
                }
              }
            "
          >
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
                @click="openOperation('edit', scope.row)"
                >修改</el-button
              >
              <el-button
                link
                type="primary"
                size="small"
                @click="handleDel(scope.row)"
                >删除</el-button
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

  <!-- 新增或者修改视图 -->
  <el-dialog
    v-model="isShowTip"
    :title="isShowTipTitle"
    width="50%"
    destroy-on-close
  >
    <el-form :model="handleFormData">
      <el-form-item label="待办内容" :label-width="120">
        <el-input
          type="textarea"
          v-model="handleFormData.msgValue"
          :autosize="{ minRows: 3, maxRows: 10 }"
        />
      </el-form-item>

      <el-form-item
        v-if="submitOption == 'edit'"
        label="是否推送"
        :label-width="140"
      >
        <el-select
          class="selTermCss"
          v-model="handleFormData.isDeleted"
          placeholder="是否推送"
        >
          <el-option
            v-for="key in queryIsPush"
            :key="key.value"
            :value="key.value"
            :label="key.label"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button
          @click="
            () => {
              isShowTip = false;
            }
          "
          >取消
        </el-button>
        <el-button type="primary" @click="submitOperation()"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script  setup>

import request from "../http.js";
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
let queryIsPush = [
  { value: 0, label: "未推送" },
  { value: 1, label: "已推送" },
];
// 定义搜索查询条件
let queryParam = ref({
  msgKey: "note",
  isDeleted: null,
});

//编辑操作相关
const isShowTip = ref(false);
let isShowTipTitle = ref("");
let submitOption = "";
const handleFormData = ref();

let clearHandleData = { id: "", createBy: "", msgValue: "", msgKey: "" };

//组件加载时
onMounted(() => {
  getNoteMessage();
});

//获取推送笔记信息
async function getNoteMessage() {
  getMessage(queryParam.value);
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

// 处理新增或者删除
function openOperation(type, data) {
  isShowTip.value = true;
  if ("add" == type) {
    isShowTipTitle = "增加备忘提醒";
    //清空表单数据
    handleFormData.value = JSON.parse(JSON.stringify(clearHandleData));
  }
  if ("edit" == type) {
    isShowTipTitle = "修改备忘提醒";
    //表单内容携带
    handleFormData.value = data;
  }
  submitOption = type;
}
async function submitOperation() {
  if ("add" == submitOption) {
    //新增
    await handleAdd();
  }
  if ("edit" == submitOption) {
    //新增
    await handleEdit();
  }
  getNoteMessage();
}

async function handleAdd() {
  let body = {
    createBy: "cool",
    msgKey: "note",
    msgValue: handleFormData.value.msgValue,
  };
  let response = await request.fetchPost("/msg/add", body);
  console.log(response);
  if (response.data.data) {
    //成功后关闭表单
    isShowTip.value = false;
    alertMsg("新增完成");
  }
}

//组件点击事件  data 操作的数据
async function handleDel(data) {
  //弹窗
  await global
    .$confirm("是否确认删除", "删除")
    .then(async () => {
      let response = await request.fetchGet("/msg/del/" + data.id);
      if (response.data.data) {
        //成功
        alertMsg("成功删除");
      }
    })
    .catch(() => {
      console.log("取消");
    });
  getNoteMessage();
}

//组件编辑事件  data 操作的数据
async function handleEdit() {
  console.log(handleFormData);
  let body = {
    msgValue: handleFormData.value.msgValue,
    isDeleted: handleFormData.value.isDeleted,
    id: handleFormData.value.id,
  };
  let response = await request.fetchPost("/msg/edit", body);
  console.log(response);
  if (response.data.data) {
    //成功后关闭表单
    isShowTip.value = false;
    alertMsg("修改完成");
  } else {
    alertMsg("修改失败");
  }
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