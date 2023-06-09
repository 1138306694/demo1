<template>
  <!-- 学期下拉选 -->
  <el-row>
    <el-col :span="4">
      <NowTerm
        @change="updateSelectList"
        :term="allTerm"
        v-model:nowTerm="nowTerm"
      ></NowTerm>
    </el-col>
    <!-- 班级下拉选 -->
    <el-col :span="4">
      <el-select
        v-model="nowWorkStuClassId"
        placeholder="选择班级"
        filterable
        clearable
        @change="updateSelectList"
      >
        <el-option
          v-for="key in selectStuClassList"
          :key="key.id"
          :value="key.id"
          :label="key.name"
        />
      </el-select>
    </el-col>
    <!-- 学科下拉选 -->
    <el-col :span="4">
      <el-select
        v-model="nowWorkSubjectId"
        placeholder="选择学科"
        filterable
        clearable
        @change="updateSelectList"
      >
        <el-option
          v-for="key in selectSubjectList"
          :key="key.id"
          :value="key.id"
          :label="key.name"
        />
      </el-select>
    </el-col>
    <!-- 星期下拉选 -->
    <el-col :span="4">
      <el-select
        v-model="nowWeekDay"
        placeholder="选择星期"
        filterable
        clearable
        @change="updateSelectList"
      >
        <el-option
          v-for="key in isWorkDayLable"
          :key="key.key"
          :value="key.key"
          :label="key.value"
        />
      </el-select>
    </el-col>
    <!-- 课节下拉选 -->
    <!-- <el-col :span="4">
      <el-select
        v-model="nowWorkClassId"
        placeholder="选择课节"
        filterable
        clearable
        @change="updateSelectList"
      >
        <el-option
          v-for="key in selectClassList"
          :key="key.id"
          :value="key.id"
          :label="key.name"
        />
      </el-select>
    </el-col> -->
    <!-- 新增按钮 -->
    <el-col :span="2" :push="3">
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
            label="课表 Id"
            min-width="30px"
            align="center"
          />
          <el-table-column
            prop="subjectName"
            min-width="40px"
            label="学科名称"
            align="center"
          />
          <el-table-column
            prop="workClassName"
            min-width="60px"
            label="课节归属"
            align="center"
          />
          <el-table-column
            prop="workStuClassName"
            min-width="60px"
            label="班级名称"
            align="center"
          />
          <el-table-column
            prop="workDay"
            min-width="60px"
            label="上课星期"
            :formatter="dealLable"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="startTime"
            min-width="60px"
            label="上课时间"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="endTime"
            min-width="60px"
            label="下课时间"
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
        @current-change="getPage()"
        @size-change="getPage()"
      >
      </el-pagination>
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
      <el-form-item label="上课学期" :label-width="140">
        <el-select
          class="selTermCss"
          v-model="handleFormData.termId"
          placeholder="选择学期"
          @change="addUpdateSelectList"
        >
          <el-option
            v-for="key in allTerm"
            :key="key.id"
            :value="key.id"
            :label="key.termName"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="选择学科" :label-width="140">
        <el-select
          class="selTermCss"
          v-model="handleFormData.subjectId"
          placeholder="选择学科"
        >
          <el-option
            v-for="key in selectSubjectList"
            :key="key.id"
            :value="key.id"
            :label="key.name"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="选择课节" :label-width="140">
        <el-select
          class="selTermCss"
          v-model="handleFormData.workClassId"
          placeholder="选择课节"
        >
          <el-option
            v-for="key in selectClassList"
            :key="key.id"
            :value="key.id"
            :label="key.name"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="选择班级" :label-width="140">
        <el-select
          class="selTermCss"
          v-model="handleFormData.workStuClassId"
          placeholder="选择班级"
        >
          <el-option
            v-for="key in selectStuClassList"
            :key="key.id"
            :value="key.id"
            :label="key.name"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="选择周几" :label-width="140">
        <el-select
          class="selTermCss"
          v-model="handleFormData.workDay"
          placeholder="选择班级"
        >
          <el-option
            v-for="key in isWorkDayLable"
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
import moment from "moment";
//相当于 vue2 的this 获取全局挂载的变量
const { appContext } = getCurrentInstance();
const global = appContext.config.globalProperties;
//下拉选，以及默认修改的值
const nowTerm = ref();
const nowWorkClassId = ref();
const nowWorkSubjectId = ref();
const nowWorkStuClassId = ref();
const nowWeekDay = ref();

//下拉选列表数据
const allTerm = ref([]);
//学科下拉数据
const selectSubjectList = ref([]);
//课节下拉选数据
const selectClassList = ref([]);
//学生班级课节数据
const selectStuClassList = ref([]);

//分页数据
const current = ref(1);
const size = ref(10);
const pageTotal = ref(10);
// 分页下拉选项
let pageSizes = [10, 20, 30, 40, 50, 100];

// 表格数据
const tableData = ref([]);
// 是否展示新增或者编辑弹窗
const isShowTip = ref(false);
const isShowTipTitle = ref("");

let onClickBtnType = "add";
//页面接口前缀
let urlPrefix = "/work/course";

//用于清除表单数据
let defaultForm = {
  id: "",
  termId: "",
  subjectId: "",
  subjectName: "",
  workClassId: "",
  workClassName: "",
  workStuClassId: "",
  workStuClassName: "",
  ext: "",
  workDay: 1,
  addTime: "",
};
//星期
let isWorkDayLable = [
  { key: 1, value: "星期一" },
  { key: 2, value: "星期二" },
  { key: 3, value: "星期三" },
  { key: 4, value: "星期四" },
  { key: 5, value: "星期五" },
  { key: 6, value: "星期六" },
  { key: 7, value: "星期日" },
];

let workClassShow = [];

function dealLable(row) {
  return getLableByKey(row.workDay, isWorkDayLable);
}

//获取初始字段
const handleFormData = ref(JSON.parse(JSON.stringify(defaultForm)));

onMounted(() => {
  initPageData();
});

function getLableByKey(key, lableList) {
  console.log("key:", key, "List:", lableList);
  for (var index in lableList) {
    var label = lableList[index];
    console.log("比较key：", key, "配置label：", label);
    console.log(key + " == " + label.key + "====", key == label.key);
    if (key == label.key) {
      console.log("返回对应值:", label.value);
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

// 加载学科数据
async function getSubject() {
  var result = await request.fetchGet(
    "/work/subject/list/" + nowTerm.value,
    {}
  );
  var resultData = result.data;
  selectSubjectList.value = resultData.data;
  //默认选中 ---学科不需要自动选择
  //   nowWorkSubjectId.value = selectSubjectList.value[0].id;
  console.log("加载学科数据", selectSubjectList.value, "nowID", nowTerm.value);
}

// 加载课节数据
async function getClass() {
  var result = await request.fetchGet("/work/class/list/" + nowTerm.value, {});
  var resultData = result.data;
  selectClassList.value = resultData.data;
  //默认选中 ---课节不需要自动选择
  //   nowWorkClassId.value = selectClassList.value[0].id;
  workClassShow = [];
  for(let value of resultData.data){
    let classId = value.id;
    let classMap = {"key":classId,"value":JSON.stringify(value)};
    workClassShow.push(classMap);
  }
  console.log("课节ididid",workClassShow);
  console.log("加载课节数据", selectClassList.value, "nowID", nowTerm.value);
}

// 加载班级数据
async function getStuClass() {
  var result = await request.fetchGet(
    "/work/stu/class/list/" + nowTerm.value,
    {}
  );
  var resultData = result.data;
  selectStuClassList.value = resultData.data;
  //暂不 默认选中
  //   nowWorkStuClassId.value = selectStuClassList.value[0].id;
  console.log("加载班级数据", selectStuClassList.value, "nowID", nowTerm.value);
}

// 增加或者修改弹窗修改学期下拉选
function addUpdateSelectList() {
  console.log("修改后表单数据：", handleFormData);
  //   获取修改后的学期，更新其余下拉选
  nowTerm.value = handleFormData.value.termId;
  updateSelectList();
  //清除已经选中的值
  handleFormData.value.subjectId = "";
  handleFormData.value.workClassId = "";
  handleFormData.value.workStuClassId = "";
}

//下拉选改变获取当前学期的所有对象属性
function updateSelectList() {
  console.log(
    "修改后选择学期:",
    nowTerm.value,
    "选择班级:",
    nowWorkClassId.value,
    "选择学科:",
    nowWorkSubjectId.value,
    "选择课节：",
    nowWorkClassId.value
  );
  //重新调用页面数据方法
  //   获取班级信息
  getStuClass();
  //   获取科目
  getSubject();
  //课节
  getClass();
  //   获取页面数据
  getPage();
}

async function getNowTerm() {
  let result = await request.fetchGet("/work/term/now", {});
  let resultData = result.data;
  nowTerm.value = resultData.data.id;
}

async function initPageData() {
  //处理term
  await getTerm();
  //初始化的时候处理默认选择学期
  await getNowTerm();
  //初始化当前周几
  let onWeek = moment().day();
  if (onWeek == 0) {
    onWeek = 7;
  }
  // await getClass();
  nowWeekDay.value = onWeek;
  await getPage();
  //这些下拉选可以慢慢加载不用同步
  getSubject();
  getStuClass();
}
// 请求页面数据
async function getPage() {
  console.log("请求学期下的获取课节列表，当前学期为", nowTerm.value);
  let result = await request.fetchPost(urlPrefix + "/list", {
    current: current.value,
    size: size.value,
    data: {
      termId: nowTerm.value,
      subjectId: nowWorkSubjectId.value,
      workClassId: nowWorkClassId.value,
      workStuClassId: nowWorkStuClassId.value,
      workDay: nowWeekDay.value,
    },
  });
  let resultData = result.data.data.records;
  //返回页面表格数据
  await getClass();
 for( let value of resultData){
  let classId = value.workClassId;
  let classValue = JSON.parse(getLableByKey(classId,workClassShow));
  console.log("classValueclassValueclassValue",classValue)
  value.startTime = classValue.startTime;
  value.endTime = classValue.endTime;
 }
  tableData.value = resultData;
  console.log("ableData.valueableData.value",tableData.value);
  setPage(result.data.data);
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

  //为表单设置默认初始值
  handleFormData.value.termId = nowTerm.value;
  handleFormData.value.subjectId = nowWorkSubjectId;
  handleFormData.value.workClassId = nowWorkClassId;
  handleFormData.value.workStuClassId = nowWorkStuClassId;

  //操作标识类型
  onClickBtnType = "add";
  console.log("点击add");
  //新增
  isShowTipTitle.value = "增加课表";
  isShowTip.value = true;
}

// 点击修改按钮
function buttonEdit(event, data) {
  console.log("点击edit");
  onClickBtnType = "edit";
  // 重置表单
  handleFormData.value = JSON.parse(JSON.stringify(defaultForm));
  //修改
  isShowTipTitle.value = "修改课表";
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
    ext: data.ext,
    termId: data.termId,
    subjectId: data.subjectId,
    workDay: data.workDay,
    workClassId: data.workClassId,
    workStuClassId: data.workStuClassId,
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
    ext: data.ext,
    termId: data.termId,
    subjectId: data.subjectId,
    workDay: data.workDay,
    workClassId: data.workClassId,
    workStuClassId: data.workStuClassId,
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
  
  