<template>
  <div class="dashboard_box">
    <div class="calenderRow">
      <Calender class="calender" v-model:selected-date="selectDate"/>
      <div class="dateInfoBox">
        <div class="date">{{ selectDate.getFullYear() }}年{{ selectDate.getMonth() }}月{{ selectDate.getDate() }}日&nbsp;&nbsp;{{
            selectDate.getDay() === 0 ? '星期日' : selectDate.getDay() === 1 ? '星期一' : selectDate.getDay() === 2 ? '星期二' : selectDate.getDay() === 3 ? '星期三' : selectDate.getDay() === 4 ? '星期四' : selectDate.getDay() === 5 ? '星期五' : '星期六'
          }}
        </div>
        <div style="margin-top: 1rem;font-size: 2rem">当日选课:</div>
        <div style="margin-top: 2rem;font-size: 1.5rem">分部：初中</div>
        <div style="margin-top: 1rem;font-size: 1.5rem">班级：3年级1班</div>
        <div style="margin-top: 1rem;font-size: 1.5rem">课程：语文</div>
        <div style="margin-top: 1rem;font-size: 1.5rem">教师：张三</div>
        <div style="margin-top: 1rem;font-size: 1.5rem">上课时间：上午&nbsp;&nbsp;第3节</div>
      </div>
    </div>
    
  </div>
</template>

<script setup lang="ts">
import Calender from "./calender.vue";
import {computed, onMounted, ref, watch} from "vue";
import {useRouter} from "vue-router";
import {db} from "../../../utils/database/db";
const router = useRouter();

const selectDate = ref(new Date());
watch(() => selectDate.value, (val) => {
  console.log(val);
})

const classTotal = ref(0);
const teacherTotal = ref(0);
onMounted(async () => {
  classTotal.value = await db.classDB.count();
  teacherTotal.value = await db.teacherDB.count();
})

</script>

<style scoped lang="less">
.dashboard_box {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;


  .calenderRow {
    width: 100%;

    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;

    .calender {
      width: 70%;
      height: auto;
    }

    .dateInfoBox {
      width: 30%;


      .date {
        font-size: 2.5rem;
      }
    }
  }

  .boxRow {
    width: 100%;
    height: 30%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;

    padding: 1rem 0;
    box-sizing: border-box;

    
  }

}
</style>
