<template>
  <el-table :data="tableData" style="width: 100%">

    <el-table-column prop="name" label="姓名" />
    <el-table-column prop="type" label="级部" />

    <el-table-column prop="date" label="所授课程" />
  </el-table>
</template>

<script setup lang="ts">

</script>

<style scoped lang="less">

</style>
