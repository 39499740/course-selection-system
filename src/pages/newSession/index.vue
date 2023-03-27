<template>
  <div class="newSession">
    <div class="addNewTimeTable" @click="addDialogVisible = true">
      添加新课表
    </div>
  </div>


  <el-dialog v-model="addDialogVisible" title="添加新课表">
    <div style="display: flex; flex-direction: row;justify-content: space-between; width: 100%;">
      <el-input style="flex: 1;" v-model="grade" placeholder="年级" />
      <el-radio-group v-model="type" style="flex: 1;">
        <el-radio-button label="1">小学</el-radio-button>
        <el-radio-button label="2">初中</el-radio-button>
      </el-radio-group>
    </div>
    <el-input v-model="textarea" :rows="2" type="textarea" placeholder="请将Excel粘贴到这里" />
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addNewTimeTable">
          提交
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ipcRenderer } from "electron";
import { ref, watch } from "vue";
import { ClassEntity, TeacherEntity, CourseEntity } from "../../utils/database/db";
import { db } from "../../utils/database/db";


const addDialogVisible = ref(false)
const textarea = ref('')
const grade = ref('')
const type = ref('1')

watch(() => addDialogVisible.value, (newVal: boolean, oldVal: boolean) => {
  if (oldVal) {
    textarea.value = ''
  }
})

/**
 *  数学	语文	数学	数学	语文	数学	语文	语文	语文	语文	小足球	语文	数学	美术	数学	数学	体健	数学	语文	语文	数学	语文	语文	数学	数学	体健	数学	数学	英语口语	数学
汪扬	严红	周茗萱	马婕	丁瑶	王书君	钱文霞	严红	靖静	王飞	左乐	徐天尉	汪扬	华蕊	周茗萱	马婕	蒋经纬	王书君	钱文霞	严红	周茗萱	王飞	丁瑶	王书君	汪扬	蒋经纬	周茗萱	马婕	杨俊	王书君
语文	数学	语文	语文	自习（珠）	语文	美术	德法	语文	语文	语文	小足球	小足球	数学	体健	自习（珠）	科学	综专	数学	数学	语文	自习（珠）	数学	语文	语文	语文	语文	语文	语文	语文
钱文霞	周茗萱	靖静	王飞	马婕	徐天尉	华蕊	华敏	靖静	王飞	丁瑶	左乐	左乐	周茗萱	蒋经纬	马婕	孙姝璟	陈玲	汪扬	周茗萱	靖静	马婕	王书君	徐天尉	钱文霞	严红	靖静	王飞	丁瑶	徐天尉
班队/心理	班队/心理	班队/心理	班队/心理	班队/心理	班队/心理	德法	自习（珠）	体健	自习（珠）	数学	语文	德法	自习（语）	语文	体健	语文	语文	音乐	体健	自习（珠）	综专	自习（珠）	自习（语）	体健	数学	自习（珠）	语文	音乐	劳动
汪扬	严红	靖静	蒋经纬	丁瑶	王书君	钱文霞	汪扬	蒋经纬	马婕	王书君	徐天尉	华敏	严红	靖静	蒋经纬	丁瑶	徐天尉	刘星如	蒋经纬	郑建云	陈玲	马婕	徐天尉	黄松华	周茗萱	郑建云	王飞	刘星如	韩春昕
 */


let dataStr = `数学	语文	数学	数学	语文	数学	语文	语文	语文	语文	小足球	语文	数学	美术	数学	数学	体健	数学	语文	语文	数学	语文	语文	数学	数学	体健	数学	数学	英语口语	数学
汪扬	严红	周茗萱	马婕	丁瑶	王书君	钱文霞	严红	靖静	王飞	左乐	徐天尉	汪扬	华蕊	周茗萱	马婕	蒋经纬	王书君	钱文霞	严红	周茗萱	王飞	丁瑶	王书君	汪扬	蒋经纬	周茗萱	马婕	杨俊	王书君
语文	数学	语文	语文	自习（珠）	语文	美术	德法	语文	语文	语文	小足球	小足球	数学	体健	自习（珠）	科学	综专	数学	数学	语文	自习（珠）	数学	语文	语文	语文	语文	语文	语文	语文
钱文霞	周茗萱	靖静	王飞	马婕	徐天尉	华蕊	华敏	靖静	王飞	丁瑶	左乐	左乐	周茗萱	蒋经纬	马婕	孙姝璟	陈玲	汪扬	周茗萱	靖静	马婕	王书君	徐天尉	钱文霞	严红	靖静	王飞	丁瑶	徐天尉
班队/心理	班队/心理	班队/心理	班队/心理	班队/心理	班队/心理	德法	自习（珠）	体健	自习（珠）	数学	语文	德法	自习（语）	语文	体健	语文	语文	音乐	体健	自习（珠）	综专	自习（珠）	自习（语）	体健	数学	自习（珠）	语文	音乐	劳动
汪扬	严红	靖静	蒋经纬	丁瑶	王书君	钱文霞	汪扬	蒋经纬	马婕	王书君	徐天尉	华敏	严红	靖静	蒋经纬	丁瑶	徐天尉	刘星如	蒋经纬	郑建云	陈玲	马婕	徐天尉	黄松华	周茗萱	郑建云	王飞	刘星如	韩春昕`


const addNewTimeTable = async () => {
  const data = dataStr.split('\n')

  let classCount = data[0].split("	").length / 5

  //将班级添加到数据库，并生成班级id序列
  let classList: ClassEntity[] = []
  for (let i = 0; i < classCount; i++) {
    classList.push({
      grade: Number(grade.value),
      type: type.value,
      classIndex: i,
    })
  }
  let classesKeys = await db.classDB.bulkAdd(classList, { allKeys: true })

  //将老师添加到数据库，并生成老师名字和ID的映射
  let teacherNameList = data.filter((item, index) => index % 2 !== 0).join('	').split('	').filter((item, index, arr) => arr.indexOf(item) === index)
  let teacherNameMap = new Map<string, number>()
  let teachersInDB = await db.teacherDB.where('name').anyOf(teacherNameList).and(item => item.type === type.value).toArray()
  teachersInDB.forEach(item => {
    teacherNameMap.set(item.name, Number(item.id))
  })
  let teacherList: TeacherEntity[] = []
  teacherNameList.forEach(item => {
    if (!teacherNameMap.has(item)) {
      teacherList.push({
        name: item,
        type: type.value
      })
    }
  })
  let teacherKeys = await db.teacherDB.bulkAdd(teacherList, { allKeys: true })
  teacherList.forEach((item, index) => {
    teacherNameMap.set(item.name, Number(teacherKeys[index]))
  })

  //将课程添加到数据库，并生成课程id序列
  let courseNameList = data.filter((item, index) => index % 2 === 0).join('	').split('	').filter((item, index, arr) => arr.indexOf(item) === index)
  let courseNameMap = new Map<string, number>()
  let coursesInDB = await db.courseDB.where('name').anyOf(courseNameList).and(item => item.type === type.value).toArray()
  coursesInDB.forEach(item => {
    courseNameMap.set(item.name, Number(item.id))
  })
  let courseList: CourseEntity[] = []
  courseNameList.forEach(item => {
    if (!courseNameMap.has(item)) {
      courseList.push({
        name: item,
        type: type.value
      })
    }
  })
  let courseKeys = await db.courseDB.bulkAdd(courseList, { allKeys: true })
  courseList.forEach((item, index) => {
    courseNameMap.set(item.name, Number(courseKeys[index]))
  })





  // teacherKeys.forEach((item, index) => {
  //   if (item !== undefined) {
  //     teacherList[index].id = Number(teacherKeys[index])
  //   }
  // })
  // //将没有ID的老师加入数据库
  // let teacherKeys2 = await db.teacherDB.bulkAdd(teacherList.filter(item => item.id === undefined), { allKeys: true })
  // teacherList.filter(item => item.id === undefined).forEach((item, index) => {
  //   item.id = Number(teacherKeys2[index])
  // })
  // console.log('teacherList', teacherList)


}


</script>

<style scoped lang="less">
.newSession {
  height: 60vh;

  background-color: #fff;

  display: flex;
  flex-direction: column;
  position: relative;

  .addNewTimeTable {
    position: absolute;
    top: 0;
    right: 0;
    width: 120px;
    height: 40px;
    color: #000;
    border: 1px solid #000;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
}
</style>