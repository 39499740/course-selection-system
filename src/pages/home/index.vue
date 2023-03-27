<!--
 * @Author: haoyi 39499740@qq.com
 * @Date: 2023-03-16 18:10:39
 * @LastEditors: haoyi 39499740@qq.com
 * @LastEditTime: 2023-03-21 15:04:20
 * @FilePath: /course-selection-system/src/pages/home/index.vue
 * haoyi QQ:39499740 E-mail:39499740@qq.com
 * Copyright (c) 2023 by haoyi, All Rights Reserved. 
-->
<template>
  <el-container style="height: 100vh">
    <el-aside width="15%" style="display: flex;flex-direction: column;">

      <el-menu class="menu" :router="true" :default-active="route.path">
        <div class="sessionName">{{ globalStore.selectedSession == null ? "暂未选择学年" : globalStore.selectedSession.name }}</div>

        <el-menu-item index="/">总览</el-menu-item>
        <el-menu-item index="/teachers">教师列表</el-menu-item>
        <el-menu-item index="/classes">班级列表</el-menu-item>
        <el-menu-item index="/settings">数据设置</el-menu-item>
      </el-menu>
    </el-aside>
    <el-main>
      <el-scrollbar>
        <router-view />
      </el-scrollbar>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import AddSession from "../newSession/index.vue"
import { ref } from "vue";
import { useGlobalStore } from "../../store";

const globalStore = useGlobalStore()
const { ipcRenderer } = require('electron')
const newSessionVisible = ref(false)


const route = useRoute()

const newSession = () => {
  newSessionVisible.value = true
  console.log(1111)
  // ipcRenderer.invoke("open-win","/newSession")
}

</script>

<style scoped lang="less">
.newSessionButton {
  margin: 10px 0;
  width: 80%;
  align-self: center;
  font-size: 1rem;
}

.menu {
  flex: 1;
  .sessionName{
    font-size: 1.5rem;
    font-weight: 600;
    margin: 10px 0;
    text-align: center;
  }
}
</style>