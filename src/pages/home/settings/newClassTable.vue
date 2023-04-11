<!--
 * @Author: haoyi 39499740@qq.com
 * @Date: 2023-03-21 15:25:35
 * @LastEditors: haoyi 39499740@qq.com
 * @LastEditTime: 2023-03-27 13:24:30
 * @FilePath: /course-selection-system/src/pages/home/settings/newClassTable.vue
 * haoyi QQ:39499740 E-mail:39499740@qq.com
 * Copyright (c) 2023 by haoyi, All Rights Reserved. 
-->
<template>
  <div class="newClassTable">
    <div style="display: flex;flex-direction: row;justify-content: space-between;align-items: center">
      <el-input v-model="grade" @change="gradeChanged" style="flex: 1">
        <template #prepend>{{ props.type == "1" ? "小学" : "中学" }}</template>
        <template #append>年级</template>
      </el-input>
      <span style="flex: 1;color: red">{{ classIsExist ? "该年级已经录入" : "" }}</span></div>
    <div style="text-align: start;margin-top: 20px;">Excel内容：</div>
    <el-input v-model="textarea" :rows="2" type="textarea" placeholder="请将Excel粘贴到这里"/>
    <!--确认取消-->
    <div style="display: flex;flex-direction: row;justify-content: space-around;align-items: center;margin-top: 20px;">
      <el-button type="primary" @click="confirmBtnClicked">确认</el-button>
      <el-button type="danger" @click="cancelBtnClicked">取消</el-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import {onMounted, ref} from 'vue';
import {ClassEntity, db} from '../../../utils/database/db';
import {Action, ElMessageBox} from "element-plus";

const grade = ref("")
const textarea = ref("")
const props = defineProps({
  type: {
    type: String,
    default: "1"
  },
  confirm: {
    type: Function,
    default: () => {
    }
  },
  close: {
    type: Function,
    default: () => {
    }
  }
})
const emit = defineEmits(["confirm", "close"])

// 判断年级是否已经存在
const classIsExist = ref(false)
const gradeChanged = async () => {

  let classes: ClassEntity[] = await db.classDB.where("grade").equals(Number(grade.value)).toArray()

  if (classes.length > 0) {
    classIsExist.value = true
  } else {
    classIsExist.value = false
  }

}

const cancelBtnClicked = () => {
  textarea.value = ""
  grade.value = ""
  emit("close")
}

const confirmBtnClicked = () => {
  if (classIsExist.value) {
    ElMessageBox.alert("该年级已经录入", "错误")
    return
  }
  if (grade.value == "") {
    ElMessageBox.alert("年级不能为空", "错误")
    return
  }
  if (textarea.value == "") {
    ElMessageBox.alert("Excel内容不能为空", "错误")
    return
  }
  ElMessageBox.confirm("您将添加" + (props.type == "1" ? "  小学  " : "  初中  ") + grade.value + "  年级的课程表",
      "提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then((action: Action) => {
    if (action == "confirm") {
      emit("confirm", grade.value, textarea.value)
      textarea.value = ""
      grade.value = ""
    }
  })
}

onMounted(() => {

})
</script>

<style scoped lang="less">
.newClassTable {
  width: 100%;
  height: 100%;
}
</style>