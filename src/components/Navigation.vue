<template>
  
  <el-radio-group  v-model="isCollapse" style="margin-bottom: 10px">
    <el-radio-button  :label="false">扩大</el-radio-button>
    <el-radio-button :label="true">缩小</el-radio-button>
  </el-radio-group>
  <el-menu
    default-active="1"
    class="el-menu-vertical-demo"
    :collapse="isCollapse"
    @open="handleOpen"
    @close="handleClose"
    router
  >
    <el-sub-menu
      v-for="menu in allMenu"
      :key="menu.menuid"
      :index="menu.menuName.toString()"
    >
      <template #title>
        <el-icon v-if="menu.icon">
          <component :is="menu.icon" />
        </el-icon>
        <span>{{ menu.menuTitle }}</span>
      </template>
      <el-menu-item
        v-if="menu.menus == null || menu.menus.length == 0"
        :index="menu.url.toString()"
        :route="'/' + menu.url"
      >
        {{ menu.menuName }}</el-menu-item
      >
      <el-menu-item
        v-for="subMenu in menu.menus"
        :key="subMenu.menuid"
        :index="subMenu.menuName.toString()"
        :route="'/' + subMenu.url"
      >
        {{ subMenu.menuName }}
      </el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<script  setup>
import { ref } from "vue";
import { Apple,Location,ChatDotRound } from '@element-plus/icons-vue';

const isCollapse = ref(false);
const handleOpen = (key, keyPath) => {
  console.log(key, keyPath);
};
const handleClose = (key, keyPath) => {
  console.log(key, keyPath);
};
</script>


<script>
export default {
  data() {
    return {
      allMenu: [],
    };
  },
  mounted() {
    console.log("初始化菜单数据");
    let res = [
      {
        menuid: 1,
        icon: Apple,
        menuName: "小工具合集",
        url: "tool",
        menuTitle: "亿点小工具",
        menus: [],
      },
      {
        menuid: 2,
        icon: Location,
        menuName: "work",
        menuTitle: "work",
        hasThird: null,
        url: null,
        menus: [
          {
            menuid: 21,
            menuName: "学期管理",
            hasThird: "N",
            url: "work/term",
            menus: null,
            isShow: true,
          },
        ],
      },
      {
        menuid: 3,
        icon: ChatDotRound,
        menuName: "微信相关",
        menuTitle: "微信相关",
        hasThird: null,
        menus: [
          {
            menuid: 31,
            icon: "",
            menuName: "每日消息配置",
            hasThird: "N",
            url: "wechat/msg",
            menus: null,
            isShow: true,
          },
          {
            menuid: 32,
            icon: "",
            menuName: "other",
            hasThird: "N",
            url: "wechat/test",
            menus: null,
            isShow: true,
          },
        ],
      },
    ];
    this.allMenu = res;
  },
};
</script>

<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>
