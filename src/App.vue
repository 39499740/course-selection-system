<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import {db, TeacherEntity} from "./utils/database/db";


const route = useRoute()


</script>

<template>
  <div id="app">
    <el-config-provider :locale="zhCn">
      <el-container>
        <el-aside width="15%">
          <el-menu class="menu" :router="true" :default-active="route.path">
            <el-menu-item index="/dashboard">总览</el-menu-item>
            <el-menu-item index="/teachers">教师列表</el-menu-item>
            <el-menu-item index="/classes">班级列表</el-menu-item>
            <el-menu-item index="/setting">数据初始化</el-menu-item>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-config-provider>
  </div>
</template>

<style lang="less">
#app {
  width: 100%;
  height: 100%;

  .menu {
    height: 98vh;
    box-sizing: border-box;
  }
}
</style>
