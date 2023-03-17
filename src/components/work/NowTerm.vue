<template>
  <el-select
    class="selTermCss"
    v-model="nowTerm"
    placeholder="选择学期"
    @change="updateNowTerm"
  >
    <el-option
      v-for="key in props.term"
      :key="key.id"
      :value="key.id"
      :label="key.termName"
    />
  </el-select>
</template>

<script setup>
import {
  defineEmits,
  getCurrentInstance,
  onMounted,
  ref,
  defineProps,
  onUpdated
} from "vue";

//相当于 vue2 的this 获取全局挂载的变量
const { appContext } = getCurrentInstance();
const global = appContext.config.globalProperties;

const emits = defineEmits(['nowTerm','update:nowTerm']);
const props = defineProps(
  {
    term:{
      default:[]
    },
    nowTerm: {
      default:{}
    }
  }
);

const nowTerm = ref(props.nowTerm);

// 初始化方法
onMounted(() => {
});

onUpdated( () =>{
  //prpos更新后
  nowTerm.value = props.nowTerm;
});

//更新学期
function updateNowTerm(){
  var now = nowTerm.value;
  console.log("子组件更新nowTerm",now);
  emits('update:nowTerm',now);
}



</script>

<style scoped>
.selTermCss {
  margin-bottom: 20px;
  float: left;
}
</style>