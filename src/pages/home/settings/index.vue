import { ElDialog } from 'element-plus';

<!--
 * @Author: haoyi 39499740@qq.com
 * @Date: 2023-03-14 17:49:56
 * @LastEditors: haoyi 39499740@qq.com
 * @LastEditTime: 2023-03-27 11:57:42
 * @FilePath: /course-selection-system/src/pages/home/settings/index.vue
 * haoyi QQ:39499740 E-mail:39499740@qq.com
 * Copyright (c) 2023 by haoyi, All Rights Reserved. 
-->
<template>
  <div class="settings">
    <div class="title">学年设置</div>
    <div class="sessionSettings">
      <div class="titleStr">当前学年</div>
      <el-dropdown trigger="click">
        <el-button>
          {{ globalStore.selectedSession == null ? '未选择' : globalStore.selectedSession.name }}
          <el-icon
              class="el-icon--right">
            <arrow-down/>
          </el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="globalStore.updateSelectedSession(item)"
                              v-for="(item, index) in sessionList" :key="index">{{
                item.name
              }}
            </el-dropdown-item>
            <el-dropdown-item @click="addNewSession">添加新学年</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-dialog v-model="showAddNewSessionDialog" title="添加新学年" width="30%" align-center>
        <ElInput placeholder="请输入学年名称" v-model="newSessionName"/>
        <template #footer>
                    <span class="dialog-footer">
                        <el-button @click="showAddNewSessionDialog = false">Cancel</el-button>
                        <el-button type="primary" @click="addNewSessionConfirm">
                            Confirm
                        </el-button>
                    </span>
        </template>
      </el-dialog>
    </div>

    <template v-if="globalStore.selectedSession != null">

      <div class="sessionSettings">
        <div class="titleStr">上课时间</div>
        <el-checkbox-group v-model="globalStore.selectedSession.weekDay">
          <el-checkbox label="周一"/>
          <el-checkbox label="周二"/>
          <el-checkbox label="周三"/>
          <el-checkbox label="周四"/>
          <el-checkbox label="周五"/>
          <el-checkbox label="周六"/>
          <el-checkbox label="周日"/>
        </el-checkbox-group>
      </div>

      <div class="sessionSettings">
        <div class="titleStr">每天课程数量</div>
        <div style="display: flex; flex-direction: column;">
          <div>
            <span style="margin-right: 40px;">小学部</span>
            <span>上午</span>
            <ElInputNumber class="classNumInput" v-model="globalStore.selectedSession.juniorAMCount" :min="0"
                           :max="4"/>
            <span style="margin-left: 10px;">下午</span>
            <ElInputNumber class="classNumInput" v-model="globalStore.selectedSession.juniorPMCount" :min="0"
                           :max="4"/>
          </div>
          <div style="margin-top: 10px;">
            <span style="margin-right: 40px;">初中部</span>
            <span>上午</span>
            <ElInputNumber class="classNumInput" v-model="globalStore.selectedSession.middleAMCount" :min="0"
                           :max="4"/>
            <span style="margin-left: 10px;">下午</span>
            <ElInputNumber class="classNumInput" v-model="globalStore.selectedSession.middlePMCount" :min="0"
                           :max="4"/>
          </div>
        </div>
      </div>
      <span style="margin-top: 40px;">
                <el-button @click="reset">重置</el-button>
                <el-button type="primary" @click="saveClick">
                    保存
                </el-button>
            </span>
      <el-dialog v-model="showSaveAlert" title="警告" center>
                <span>
                    保存当前修改，将会清空学年内所有数据，是否继续？
                </span>
        <template #footer>
                    <span class="dialog-footer">
                        <el-button @click="showSaveAlert = false">取消</el-button>
                        <el-button type="primary" @click="save">
                            确定
                        </el-button>
                    </span>
        </template>
      </el-dialog>
    </template>
    <template v-if="globalStore.selectedSession != null">
      <div class="title" style="margin-top: 20px;">详细信息</div>

      <div class="sessionDetailArea">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>小学部</span>
              <el-button class="button" text @click="addNewClassTable('1')">添加课程表</el-button>

            </div>
          </template>
          <div class="boxContent">
            <div class="statisticBox">
              <el-statistic title="系统注册教师" :value="juniorSchool.teacher"/>
            </div>
            <div class="statisticBox">
              <el-statistic title="系统注册班级" :value="juniorSchool.class"/>
            </div>
            <div class="statisticBox">
              <el-statistic title="系统注册课程" :value="juniorSchool.teacher"/>
            </div>
          </div>

        </el-card>
        <el-card class="box-card" style="margin-top: 10px;">
          <template #header>
            <div class="card-header">
              <span>初中部</span>
              <el-button class="button" text>添加课程表</el-button>

            </div>
          </template>
          <div class="boxContent">
            <div class="statisticBox">
              <el-statistic title="系统注册教师" :value="middleSchool.teacher"/>
            </div>
            <div class="statisticBox">
              <el-statistic title="系统注册班级" :value="middleSchool.class"/>
            </div>
            <div class="statisticBox">
              <el-statistic title="系统注册课程" :value="middleSchool.teacher"/>
            </div>
          </div>

        </el-card>

      </div>

    </template>
  </div>
  <el-dialog v-model="showAddNewClassTable" title="添加课程表" width="30%" align-center>
    <NewClassTable :type="addType" @close="showAddNewClassTable = false" @confirm="addNewClassTableConfirm"/>
  </el-dialog>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref, render} from 'vue';
import {SessionEntity, db, ClassEntity, TeacherEntity, CourseEntity, TimeTableEntity} from '../../../utils/database/db';
import {useGlobalStore} from '../../../store';
import {ElButton, ElInput, ElInputNumber, ElMessage} from 'element-plus';
import NewClassTable from './newClassTable.vue'

const globalStore = useGlobalStore();
const sessionList = ref<SessionEntity[]>([])

/**
 * 学年相关
 */
const showAddNewSessionDialog = ref(false)
const newSessionName = ref('')
const addNewSession = () => {
  newSessionName.value = ''
  showAddNewSessionDialog.value = true
}
const addNewSessionConfirm = () => {
  let session = {} as SessionEntity
  session.name = newSessionName.value
  session.juniorAMCount = 3
  session.juniorPMCount = 3
  session.middleAMCount = 4
  session.middlePMCount = 4
  session.weekDay = ["周一", "周二", "周三", "周四", "周五"]
  db.sessionDB.add(session).then((res) => {
    ElMessage.success('添加成功')
    showAddNewSessionDialog.value = false
    db.sessionDB.toArray().then((res) => {
      sessionList.value = res
    })
  })
}

/**
 * 上课时间相关
 */

const reset = async () => {
  let session = await db.sessionDB.where('id').equals(globalStore.selectedSession!.id!).first()
  globalStore.updateSelectedSession(session!)
}
const saveClick = () => {
  showSaveAlert.value = true
}
const save = () => {
  showSaveAlert.value = false
}
const showSaveAlert = ref(false)


/**
 * 统计相关
 */
const juniorSchool = reactive({
  teacher: 0,
  class: 0,
  course: 0,

});
const middleSchool = reactive({
  teacher: 0,
  class: 0,
  course: 0,
});
//更新统计信息
const updateStatistic = async () => {
  let session = globalStore.selectedSession
  if (session == null) {
    return
  }

  let juniorSchoolClass = await db.classDB.where('type').equals("1").toArray()
  let juniorSchoolTeacher = await db.teacherDB.where('type').equals("1").toArray()
  let juniorSchoolCourse = await db.courseDB.where('type').equals("1").toArray()
  juniorSchool.class = juniorSchoolClass.length
  juniorSchool.teacher = juniorSchoolTeacher.length
  juniorSchool.course = juniorSchoolCourse.length

  let middleSchoolClass = await db.classDB.where('type').equals("2").toArray()
  let middleSchoolTeacher = await db.teacherDB.where('type').equals("2").toArray()
  let middleSchoolCourse = await db.courseDB.where('type').equals("2").toArray()
  middleSchool.class = middleSchoolClass.length
  middleSchool.teacher = middleSchoolTeacher.length
  middleSchool.course = middleSchoolCourse.length
}


/**
 * 添加课程表
 */
const showAddNewClassTable = ref(false)
const addType = ref('1')
const addNewClassTable = (school: string) => {
  addType.value = school
  showAddNewClassTable.value = true
}
const addNewClassTableConfirm = async (grade: string, classTableStr: string) => {
  console.log(grade, classTableStr);
  let session = globalStore.selectedSession
  let data = classTableStr.split('\n')
  let classCount = data[0].split("	").length / session?.weekDay?.length!
  //将班级添加到数据库，并生成班级id序列
  let classList: ClassEntity[] = []
  for (let i = 0; i < classCount; i++) {
    classList.push({
      grade: Number(grade),
      type: addType.value,
      classIndex: i,
    })
  }

  let classesKeys = await db.classDB.bulkAdd(classList, {allKeys: true})


  //将老师添加到数据库，并生成老师名字和ID的映射
  let teacherNameList = data.filter((item, index) => index % 2 !== 0).join('	').split('	').filter((item, index, arr) => arr.indexOf(item) === index)
  let teacherNameMap = new Map<string, number>()
  let teachersInDB = await db.teacherDB.where('name').anyOf(teacherNameList).and(item => item.type === addType.value).toArray()
  teachersInDB.forEach(item => {
    teacherNameMap.set(item.name, Number(item.id))
  })
  let teacherList: TeacherEntity[] = []
  teacherNameList.forEach(item => {
    if (!teacherNameMap.has(item)) {
      teacherList.push({
        name: item,
        type: addType.value
      })
    }
  })
  let teacherKeys = await db.teacherDB.bulkAdd(teacherList, {allKeys: true})
  teacherList.forEach((item, index) => {
    teacherNameMap.set(item.name, Number(teacherKeys[index]))
  })
//将课程添加到数据库，并生成课程id序列
  let courseNameList = data.filter((item, index) => index % 2 === 0).join('	').split('	').filter((item, index, arr) => arr.indexOf(item) === index)
  let courseNameMap = new Map<string, number>()
  let coursesInDB = await db.courseDB.where('name').anyOf(courseNameList).and(item => item.type === addType.value).toArray()
  coursesInDB.forEach(item => {
    courseNameMap.set(item.name, Number(item.id))
  })
  let courseList: CourseEntity[] = []
  courseNameList.forEach(item => {
    if (!courseNameMap.has(item)) {
      courseList.push({
        name: item,
        type: addType.value
      })
    }
  })
  let courseKeys = await db.courseDB.bulkAdd(courseList, {allKeys: true})
  courseList.forEach((item, index) => {
    courseNameMap.set(item.name, Number(courseKeys[index]))
  })

  //循环课程，将课程添加到课程表
  for (let i = 0; i < data.length; i += 2) {

    let dateType = 1
    let temp = addType.value == "1" ? session?.juniorAMCount : session?.middleAMCount
    if (i / 2 > temp! - 1) {
      dateType = 2
    }
    let classTable = data[i].split('	')
    let teacherTable = data[i + 1].split('	')
    for (let j = 0; j < session?.weekDay?.length!; j++) {
      for (let k = 0; k < classCount; k++) {
        let classId = classesKeys[k] as number
        let teacherId = teacherNameMap.get(teacherTable[j * classCount + k])
        let courseId = courseNameMap.get(classTable[j * classCount + k])
        await db.timeTableDB.add({
          classId: classId,
          teacherId: teacherId,
          courseId: courseId,
          weekDay: session?.weekDay![j] ?? "",
          sessionId: session?.id!,
          dateType: dateType,
        })
      }
    }

  }

  updateStatistic();
  showAddNewClassTable.value = false
}


onMounted(() => {
  db.sessionDB.toArray().then((res) => {
    sessionList.value = res
  })
  updateStatistic();
})


</script>

<style scoped lang="less">
.settings {
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;

  .title {
    width: 100%;
    height: 50px;
    font-size: 28px;
    text-align: start;

  }

  .sessionSettings {
    width: 98%;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;

    .classNumInput {
      width: 100px;
    }

  }

  .sessionDetailArea {
    width: 98%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;

    .box-card {
      width: 100%;

      .card-header {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 0 40px;
      }

      .boxContent {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;

        .statisticBox {
          flex: 1;
          margin: 0 10px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
      }
    }
  }
}
</style>
