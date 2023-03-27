/*
 * @Author: haoyi hy@china-join.com
 * @Date: 2023-03-16 15:06:06
 * @LastEditors: haoyi 39499740@qq.com
 * @LastEditTime: 2023-03-21 14:58:01
 * @FilePath: /course-selection-system/src/utils/database/db.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import Dexie, { Table } from 'dexie';


export interface ClassEntity {
    id?: number;
    classIndex: number;
    grade: number;
    type: string;   //1 小学 2 初中
}

export interface CourseEntity {
    id?: number;
    name: string;
    type: string;   //1 小学 2 初中
}

export interface ResultEntity {
    id?: number;
    classId?: number;
    teacherId?: number;
    courseId?: number;
    date: Date;
}

export interface TeacherEntity {
    id?: number;
    name: string;
    type: string;   //1 小学 2 初中
}

export interface TimeTableEntity {
    id?: number
    classId?: number
    teacherId?: number
    courseId?: number
    weekDay: string
    dateType: number // 1 上午 2 下午
    sessionId?: number
}
export interface SessionEntity{
    id?: number
    name: string
    //小学上午课程数
    juniorAMCount?: number
    //小学下午课程数
    juniorPMCount?: number
    //初中上午课程数
    middleAMCount?: number
    //初中下午课程数
    middlePMCount?: number
    //每周上课时间
    weekDay?: string[]
}

export class COurseSelectionDexie extends Dexie{
    classDB!: Table<ClassEntity>;
    courseDB!: Table<CourseEntity>;
    resultDB!: Table<ResultEntity>;
    teacherDB!: Table<TeacherEntity>;
    timeTableDB!: Table<TimeTableEntity>;
    sessionDB!: Table<SessionEntity>;
    constructor() {
        super('CourseSelection');
        this.version(1).stores({
            classDB: '++id, classIndex, grade, type',
            courseDB: '++id, name, type',
            resultDB: '++id, classId, teacherId, courseId, date',
            teacherDB: '++id, name, type',
            timeTableDB: '++id, classId, teacherId, courseId, weekDay, dateType, sessionId',
            sessionDB: '++id, name, juniorAMCount, juniorPMCount, middleAMCount, middlePMCount, weekDay'
        });
    }
}
export const db = new COurseSelectionDexie();