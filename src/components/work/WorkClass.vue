<template>
  <!-- 学期下拉选 -->
  <el-row>
    <el-col :span="4">
      <NowTerm
        @change="updateTerm"
        :term="allTerm"
        v-model:nowTerm="nowTerm"
      ></NowTerm>
    </el-col>
    <!-- 新增按钮 -->
    <el-col :span="2" :push="16">
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
            label="课节 Id"
            min-width="30px"
            align="center"
          />
          <el-table-column
            prop="name"
            min-width="40px"
            label="课节名称"
            align="center"
          />
          <el-table-column
            prop="startTime"
            min-width="60px"
            label="开始时间"
            align="center"
          />
          <el-table-column
            prop="endTime"
            min-width="60px"
            label="结束时间"
            align="center"
          />
          <el-table-column 
            prop="isOneOrTwo"
            min-width="60px"
            label="是否为单双周"
            :formatter="dealLable"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="ext"
            min-width="60px"
            label="扩展"
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
                @click="buttonEdit($event, scope.row)"
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

  <!-- 新增或者修改表单数据 -->
  <el-dialog
    v-model="isShowTip"
    :title="isShowTipTitle"
    width="50%"
    destroy-on-close
  >
    <el-form :model="handleFormData">
      <el-form-item label="课节名称" :label-width="140">
        <el-input v-model="handleFormData.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="上课时间" :label-width="140" :size="small">
        <div class="demo-time-range">
          <el-time-select
            v-model="handleFormData.startTime"
            :max-time="handleFormData.endTime"
            class="mr-4"
            placeholder="课节开始时间"
            start="07:00"
            step="00:01"
            end="22:00"
            format="HH:mm:ss"
          />
          <el-time-select
            v-model="handleFormData.endTime"
            :min-time="handleFormData.startTime"
            placeholder="课节结束时间"
            start="07:00"
            step="00:01"
            end="22:00"
            format="HH:mm:ss"
          />
        </div>
      </el-form-item>
      <el-form-item label="是否单双周" :label-width="140">
        <el-select
          class="selTermCss"
          v-model="handleFormData.isOneOrTwo"
          placeholder="是否单双周"
        >
          <el-option
            v-for="key in isOneOrTwoLable"
            :key="key.key"
            :value="key.key"
            :label="key.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="学科扩展字段" :label-width="140">
        <el-input v-model="handleFormData.ext" autocomplete="off" />
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
import { getCurrentInstance, ref, onMounted } from "vue";
import request from "../../http.js";
//相当于 vue2 的this 获取全局挂载的变量
const { appContext } = getCurrentInstance();
const global = appContext.config.globalProperties;
const nowTerm = ref();
const allTerm = ref([]);
// 表格数据
const tableData = ref([]);
// 是否展示新增或者编辑弹窗
const isShowTip = ref(false);
const isShowTipTitle = ref("");
let onClickBtnType = "add";
//页面接口前缀
let urlPrefix = "/work/class";

//用于清除表单数据
let defaultForm = {
  id: "",
  name: "",
  termId: "",
  startTime: "",
  endTime: "",
  ext: "",
  isOneOrTwo: 0,
  addTime: "",
};
let isOneOrTwoLable = [
  { key: 0, value: "否" },
  { key: 1, value: "单" },
  { key: 2, value: "双" },
];

function dealLable(row){
  return getLableByKey(row.isOneOrTwo,isOneOrTwoLable); 
}



//获取初始字段
const handleFormData = ref(JSON.parse(JSON.stringify(defaultForm)));

onMounted(() => {
  initPageData();
});

function getLableByKey(key,lableList){
  console.log("key:",key,"List:",lableList);
  for(var index in lableList){
    var label = lableList[index];
    console.log("比较key：",key,"配置label：",label);
    console.log(key+" == "+label.key+"====",key == label.key);
    if(key == label.key){
        console.log("返回对应值:",label.value);
        return label.value;
    }
  }
}

// 加载term
async function getTerm() {
  let result = await request.fetchGet("/work/term/list", {});
  let resultData = result.data;
  allTerm.value = resultData.data;
  //默认选中
  console.log("加载学期前", allTerm.value, "nowID", nowTerm.value);
  nowTerm.value = allTerm.value[0].id;
  console.log("加载学期后", allTerm.value, "nowID", nowTerm.value);
}

//下拉选改变获取当前学期的所有对象属性
function updateTerm() {
  // 更新选中学期
  console.log("更新选择学期", nowTerm.value);
  //重新调用页面数据方法
  //   获取学科
  getPage();
}

async function initPageData() {
  //处理term
  await getTerm();

  await getPage();
}
// 请求页面数据
async function getPage() {
  console.log("请求学期下的获取课节列表，当前学期为", nowTerm.value);
  var result = await request.fetchGet(urlPrefix + "/list/" + nowTerm.value, {});
  var resultData = result.data;
  tableData.value = resultData.data;
  console.log("resultData", resultData);
}

// 表单提交按钮
async function submitOption() {
  console.log("提交操作");
  if ("add" == onClickBtnType) {
    //新增
    handleAdd();
  } else if ("edit" == onClickBtnType) {
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
  isShowTipTitle.value = "增加新学科";
  isShowTip.value = true;
}
// 点击修改按钮
function buttonEdit(event, data) {
  console.log("点击edit");
  onClickBtnType = "edit";
  // 重置表单
  handleFormData.value = JSON.parse(JSON.stringify(defaultForm));
  //修改
  isShowTipTitle.value = "修改学科";
  if (data) {
    console.log(data);
    handleFormData.value = JSON.parse(JSON.stringify(data));
  }
  isShowTip.value = true;
}
// 点击删除按钮
function buttonDel(event, row) {
  console.log("点击del");
  if (row) {
    global
      .$confirm(row.termName, "确认删除")
      .then(() => {
        handleDel(row);
      })
      .catch((e) => {});
  }
}

// 点击新增的操作
async function handleAdd() {
  console.log("add------", handleFormData.value);
  var data = handleFormData.value;
  var result = await request.fetchPost(urlPrefix + "/add", {
    name: data.name,
    ext: data.ext,
    termId: nowTerm.value,
    startTime: data.startTime,
    endTime: data.endTime,
    isOneOrTwo: data.isOneOrTwo,
    addTime: new Date().getTime(),
  });
  console.log(result.data);
  if (result && result.data.success) {
    global.$notify.success("新增完成");
  } else {
    global.$notify.error("增加失败");
  }
  //重新加载table
  getPage();
}

// 处理修改提交操作
async function handleEdit() {
  console.log("edit------", handleFormData.value);
  var data = handleFormData.value;
  var result = await request.fetchPost(urlPrefix + "/update", {
    name: data.name,
    ext: data.ext,
    startTime: data.startTime,
    endTime: data.endTime,
    isOneOrTwo: data.isOneOrTwo,
    id: data.id,
  });
  console.log(result.data);
  if (result && result.data.success) {
    global.$notify.success("修改完成");
  } else {
    global.$notify.error("修改失败");
  }
  //重新加载table
  getPage();
}
// 处理删除的操作
async function handleDel(row) {
  //调用删除
  var result = await request.fetchGet(urlPrefix + "/del/" + row.id, {});
  console.log("删除result", result.data);
  if (result && result.data.data) {
    global.$notify.success("删除成功");
  } else {
    global.$notify.error("删除失败");
  }
  //重新加载table
  getPage();
}

</script>

