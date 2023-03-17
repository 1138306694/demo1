<template>
  <el-row align="bottom">
    <el-col :span="2">
      <span>学期管理</span>
    </el-col>
    <el-col :span="1" :push="18">
      <el-button type="primary" @click="buttonAdd">
        <el-icon><Plus /></el-icon>
        <span>新增</span>
      </el-button>
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
            label="学期 Id"
            min-width="30px"
            align="center"
          />
          <el-table-column
            prop="termName"
            min-width="60px"
            label="学期名称"
            align="center"
          />
          <el-table-column
            prop="startTime"
            label="学期开始时间"
            min-width="60px"
            show-overflow-tooltip
            align="center"
          />
          <el-table-column
            prop="endTime"
            label="学期结束时间"
            min-width="60px"
            align="center"
          />
          <el-table-column
            prop="addTime"
            label="创建时间"
            min-width="50px"
            align="center"
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
                @click="buttonEdit($event,scope.row)"
                >修改</el-button
              >
              <el-button
                link
                type="primary"
                @click="buttonDel($event, scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-col>
  </el-row>

  <!-- 新增或者修改 -->
  <el-dialog
    v-model="isShowTip"
    :title="isShowTipTitle"
    width="50%"
    destroy-on-close
  >
    <el-form :model="handleFormData">
      <el-form-item
        v-if="isShowTipTitle == '新学期'"
        label="id"
        label-width="140px"
      >
        <el-input
          v-model="handleFormData.id"
          autocomplete="off"
          :size="small"
        />
      </el-form-item>
      <el-form-item label="学期名称" :label-width="140">
        <el-input v-model="handleFormData.termName" autocomplete="off" />
      </el-form-item>
      <el-form-item label="学期时间" :label-width="140" :size="small">
        <el-date-picker
          v-model="handleFormData.time"
          type="daterange"
          placeholder="学期时间"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="x"
          :start-placeholder="开始时间"
          :end-placeholder="结束时间"
          @change="updateTermTime"
        />
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
        <el-button type="primary" @click="submitOption"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { getCurrentInstance, ref, onMounted, onBeforeMount } from "vue";
import request from "../../http.js";
//相当于 vue2 的this 获取全局挂载的变量
const { appContext } = getCurrentInstance();
const global = appContext.config.globalProperties;
let nowTerm = "";
// 表格数据
const tableData = ref([]);
// 是否展示新增或者编辑弹窗
const isShowTip = ref(false);
const isShowTipTitle = ref("");
let onClickBtnType = "add";
//用于清除表单数据
let defaultForm = {
  id: "",
  termName: "",
  startTime: "",
  endTime: "",
  addTime: "",
};
const handleFormData = ref({
  id: "",
  termName: "",
  startTime: "",
  endTime: "",
  addTime: "",
});

// 消息提示
// global.$notify(msg);


// 初始化页面
onMounted(() => {
  // 初始化页面数据
  initPageData();
});

onBeforeMount (() =>{
  console.log("组件初始化调用方法");
});
async function initPageData() {
  // 加载页面数据

  //   获取学期
  getTerm();
}

//下拉选改变获取当前学期的所有对象属性
// function updateTerm(now) {
//   console.log("父组件改变值", now);
//   nowTerm = now;
// }

function updateTermTime() {
  handleFormData.value.startTime = handleFormData.value.time[0];
  handleFormData.value.endTime = handleFormData.value.time[1];
}

//获取list信息
async function getTerm() {
  var result = await request.fetchGet("/work/term/list", {});
  var resultData = result.data;
  tableData.value = resultData.data;
  console.log("resultData", resultData);
}
// 提交操作
async function submitOption() {
    console.log("提交操作")
if("add" == onClickBtnType){
    //新增
    handleAdd();

}else if ("edit" == onClickBtnType){
    //修改
    handleEdit();
}
//关闭表单
isShowTip.value = false;

}
// 点击新增按钮
function buttonAdd() {
  // 重置表单
  handleFormData.value = JSON.parse(JSON.stringify(defaultForm));
  //操作标识类型
  onClickBtnType = "add";
  console.log("点击add");
  //新增
  isShowTipTitle.value = "增加新学期";
  isShowTip.value = true;
}
// 点击修改按钮
function buttonEdit(event, data) {
  console.log("点击edit");
  onClickBtnType = "edit";
  // 重置表单
  handleFormData.value = JSON.parse(JSON.stringify(defaultForm));
  //修改
  isShowTipTitle.value = "修改学期";
  if (data) {
    console.log(data);
    handleFormData.value = JSON.parse(JSON.stringify(data));
    //处理时间
    handleFormData.value.time = [
      handleFormData.value.startTime,
      handleFormData.value.endTime,
    ];
  }
  isShowTip.value = true;
}

function buttonDel(event,row){
    console.log("点击del");
    if(row){
        global.$confirm(row.termName, "确认删除").then(
            ()=>{
                handleDel(row);
            }
            ).catch(e =>{
        });
    }
}

// 处理新增提交操作
async function handleAdd() {
  console.log("add------", handleFormData.value);
  var data = handleFormData.value;
  var result = await request.fetchPost("/work/term/add", {
    termName: data.termName,
    startTime: data.startTime,
    endTime: data.endTime,
    addTime: new Date().getTime(),
  });
  console.log(result.data);
  if (result && result.data.success) {
    global.$notify.success("新增完成");
  } else {
    global.$notify.error("增加失败");
  }
  //重新加载table
  getTerm();
}

// 处理修改提交操作
async function handleEdit() {
  console.log("edit------", handleFormData.value);
  var data = handleFormData.value;
  var result = await request.fetchPost("/work/term/update", {
    termName: data.termName,
    startTime: data.startTime,
    endTime: data.endTime,
    id: data.id,
  });
  console.log(result.data);
  if (result && result.data.success) {
    global.$notify.success("修改完成");
  } else {
    global.$notify.error("修改失败");
  }
  //重新加载table
  getTerm();
}

async function handleDel(row) {
    //调用删除
    var result = await request.fetchGet("/work/term/del/"+row.id, {});
    console.log("删除result",result.data);
    if (result && result.data.data) {
    global.$notify.success("删除成功");
  } else {
    global.$notify.error("删除失败");
  }
  //重新加载table
  getTerm();
}
</script>