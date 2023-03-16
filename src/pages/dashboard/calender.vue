<template>
  <div class="calender_Box">
    <div class="title"></div>
    <el-calendar v-model="selectedDate">
      <template #date-cell="{ data }">
        <p>  {{ data.day.split('-').pop()}}
          <br/>
          张三
          语文
        </p>
      </template>
    </el-calendar>

  </div>
</template>

<script setup lang="ts">
import {onMounted, ref, toRefs, watch} from "vue";

const props = defineProps({
  selectedDate: {
    type: Date,
    default: new Date()
  }
})

const selectedDate = ref(new Date())

const emit = defineEmits(['update:selectedDate'])


watch(() => selectedDate.value, (newVal) => {
  emit('update:selectedDate', newVal)
}, {immediate: true, deep: true})

</script>

<style scoped lang="less">
.calender_Box {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

}
</style>
