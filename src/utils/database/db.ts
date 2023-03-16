import Dexie, { Table } from 'dexie';


export interface ClassEntity {
    id: number;
    classIndex: number;
    grade: number;
    type: string;   //1 小学 2 初中
}

export interface CourseEntity {
    id: number;
    name: string;
    type: string;   //1 小学 2 初中
}

export interface ResultEntity {
    id: number;
    classId: number;
    teacherId: number;
    courseId: number;
    date: Date;
}

export interface TeacherEntity {
    id: number;
    name: string;
    type: string;   //1 小学 2 初中
}

export interface TimeTableEntity {
    id: number
    classId: number
    teacherId: number
    courseId: number
    classIndex: number
    weekDay: number
    dateType: number // 1 上午 2 下午
}
export class COurseSelectionDexie extends Dexie{
    classDB!: Table<ClassEntity>;
    courseDB!: Table<CourseEntity>;
    resultDB!: Table<ResultEntity>;
    teacherDB!: Table<TeacherEntity>;
    timeTableDB!: Table<TimeTableEntity>;
    constructor() {
        super('CourseSelection');
        this.version(1).stores({
            classDB: '++id, classIndex, grade, type',
            courseDB: '++id, name, type',
            resultDB: '++id, classId, teacherId, courseId, date',
            teacherDB: '++id, name, type',
            timeTableDB: '++id, classId, teacherId, courseId, classIndex, weekDay, dateType'
        });
    }
}
export const db = new COurseSelectionDexie();