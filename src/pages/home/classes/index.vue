<template>
    <div class="clessesIndex">
        <h1>班级列表</h1>
        <div class="optionRow">
            <span>类别：&nbsp;&nbsp;      </span>

            <el-dropdown trigger="click">
                <el-button>
                    {{ schoolType == "1" ? "小学" : "初中" }}
                    <el-icon
                            class="el-icon--right">
                        <arrow-down/>
                    </el-icon>
                </el-button>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item @click="updateClassList('1')">小学</el-dropdown-item>
                        <el-dropdown-item @click="updateClassList('2')">初中</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
        <el-table :data="classList" style="width: 100%">
            <el-table-column prop="grade" label="年级" width="180">
                <template #default="scope">
                    {{ gradeToGradeName(String(scope.row.grade)) }}
                </template>
            </el-table-column>
            <el-table-column prop="classes" label="班级">
                <template #default="scope">
          <span class="className" v-for="item in scope.row.classes" @click="classClicked(item.id)">{{
              item.name
              }}</span>
                </template>
            </el-table-column>
        </el-table>
    </div>

  <!--课程表-->
    <el-dialog :title="tableTitle" v-model="dialogVisible" width="80%">
        <div class="headers">
            <div style="flex: 1">节次</div>
            <div v-for="item in globalStore.selectedSession!.weekDay!" style="flex:1">
                {{ item }}
            </div>
        </div>
        <div class="classRow" v-for="(item,index) in timeTable.slice(0,amCount)">
            <div style="flex: 1;display: flex;justify-content: center;align-items: center">第{{ index + 1 }}节</div>
            <div class="classBox" v-for="c in item">
                <div class="courseName">{{ c.course.name }}</div>
                <div class="teacherName">{{ c.teacher.name }}</div>
            </div>
        </div>
        <div class="noonRow">
            午休
        </div>
        <div class="classRow" v-for="(item,index) in timeTable.slice(amCount)">
            <div style="flex: 1;display: flex;justify-content: center;align-items: center">第{{ index + 1 }}节</div>
            <div class="classBox" v-for="c in item">
                <div class="courseName">{{ c.course.name }}</div>
                <div class="teacherName">{{ c.teacher.name }}</div>
            </div>
        </div>
    </el-dialog>

</template>

<script setup lang="ts">

import {onMounted, reactive, ref} from "vue";
import {CourseEntity, db, TeacherEntity} from "../../../utils/database/db";
import {useGlobalStore} from "../../../store";

const globalStore = useGlobalStore()


const schoolType = ref("小学")
const classList = ref<any>([])
const updateClassList = async (type: string) => {
    if (globalStore.selectedSession == null) {
        return
    }
    schoolType.value = type;
    classList.value = []
    let list = await db.classDB.where("type").equals(type).toArray()
    for (let i = 0; i < list.length; i++) {
        let gradeDetail = classList.value.find((item: any) => item.grade === list[i].grade) ?? {
            "grade": list[i].grade,
            "classes": []
        }
        if (gradeDetail.classes.length === 0) {
            classList.value.push(gradeDetail)
        }

        gradeDetail.classes.push({
                "name": list[i].classIndex + 1 + "班",
                "classIndex": list[i].classIndex,
                "id": list[i].id
            }
        )
    }
    for (let i = 0; i < classList.value.length; i++) {
        classList.value[i].classes.sort((a: any, b: any) => a.classIndex - b.classIndex)
    }
    classList.value.sort((a: any, b: any) => a.grade - b.grade)
}

const dialogVisible = ref(false)
const timeTable = ref<ctEntity[][]>([])

interface ctEntity {
    teacher: TeacherEntity,
    course: CourseEntity;
    courseIndex: number;

}

const amCount = ref(0)
const tableTitle = ref("")

const classClicked = async (id: number) => {

    let c = await db.classDB.where("id").equals(id).first()
    tableTitle.value = (schoolType.value=="1"?"小学  ":"初中  ") + c!.grade + "年" + (c!.classIndex + 1) + "班  课程表"


    let classtables = await db.timeTableDB.where("classId").equals(id).toArray()
    let teacherList = await db.teacherDB.where("type").equals(schoolType.value).toArray()
    let teacherMap = new Map<number, any>()
    for (let i = 0; i < teacherList.length; i++) {
        teacherMap.set(teacherList[i].id!, teacherList[i])
    }
    let courseList = await db.courseDB.where("type").equals(schoolType.value).toArray();
    let courseMap = new Map<number, any>()
    for (let i = 0; i < courseList.length; i++) {
        courseMap.set(courseList[i].id!, courseList[i])
    }

    let tempMap = new Map<string, any>()
    for (let i = 0; i < classtables.length; i++) {
        let key = classtables[i].weekDay
        let ct = {} as ctEntity
        ct.teacher = teacherMap.get(classtables[i].teacherId!)!
        ct.course = courseMap.get(classtables[i].courseId!)!
        ct.courseIndex = classtables[i].courseIndex!
        let ctList = tempMap.get(key) ?? []
        ctList.push(ct)
        tempMap.set(key, ctList)

    }

    if (schoolType.value === "1") {
        amCount.value = globalStore.selectedSession!.juniorAMCount!
    } else {
        amCount.value = globalStore.selectedSession!.middleAMCount!
    }

    let classes: Map<number, ctEntity[]> = new Map();

    globalStore.selectedSession!.weekDay!.forEach((item: any) => {
        let cts = Array.from(tempMap.get(item) as ctEntity[])
        cts.sort((a: ctEntity, b: ctEntity) => a.courseIndex - b.courseIndex)
        for (let i = 0; i < cts.length; i++) {
            let cls: ctEntity[] = classes.get(cts[i].courseIndex) ?? []
            cls.push(cts[i])
            classes.set(cts[i].courseIndex, cls)
        }
    })
    timeTable.value = []
    for (let i = 0; i < classes.size; i++) {
        let classList: ctEntity[] = classes.get(i) ?? []
        timeTable.value.push(classList)
    }
    dialogVisible.value = true


}


onMounted(() => {
    updateClassList("1")
});

const gradeToGradeName = (grade: string) => {

    switch (grade) {
        case "1":
            return "一年级"
        case "2":
            return "二年级"
        case "3":
            return "三年级"
        case "4":
            return "四年级"
        case "5":
            return "五年级"
        case "6":
            return "六年级"
        case "7":
            return "七年级"
        case "8":
            return "八年级"
        case "9":
            return "九年级"
        default:
            return ""
    }
}

</script>

<style scoped lang="less">
.clessesIndex {
  display: flex;
  flex-direction: column;
  padding: 0 20px;
  box-sizing: border-box;

  .optionRow {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
  }

  .className {
    margin-right: 30px;
    cursor: pointer;
  }
}

.headers {
    width: 100%;
  display: flex;
  flex-direction: row;

  border-bottom: 1px solid #ebeef5;
  font-size: 16px;
}

.classRow {
    width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  height: 50px;
  font-size: 16px;
}

.classRow:nth-child(odd) {
  background-color: #f2f6fc;
}

.noonRow {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  height: 30px;
  font-size: 18px;
  background-color: lightblue;
  border-top: 1px solid #ebeef5;
  border-bottom: 1px solid #ebeef5;
}

.classBox {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .className {
    font-size: 16px;
  }

  .teacherName {
    font-size: 14px;
  }
}
</style>
