<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="200px">
        <navigation></navigation>
      </el-aside>
      <el-container>
        <el-header class="leftRight">
          <el-dropdown>
            <el-affix position="top" :offset="0">
              <el-button @click="toggleDark()" type="primary" round>
                <span class="ml-2">{{ isDark ? "Dark" : "Light" }}</span>
              </el-button>
            </el-affix>
          </el-dropdown>
        </el-header>
        <el-main>
          <router-view> </router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>


<script setup>
import { useDark, useToggle, useColorMode } from "@vueuse/core";

const isDark = useDark();
const toggleDark = useToggle(isDark);
const colorMode = useColorMode();
</script>

<script>
import Navigation from "@/components/Navigation.vue";
export default {
  data() {
    return {
      showtype: false,
    };
  },
  components() {
    // Navigation
  },
};
</script>


<style >
.leftRight {
  text-align: right;
}
</style>
