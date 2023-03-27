/*
 * @Author: haoyi 39499740@qq.com
 * @Date: 2023-03-21 13:24:25
 * @LastEditors: haoyi 39499740@qq.com
 * @LastEditTime: 2023-03-21 13:30:01
 * @FilePath: /course-selection-system/src/store/index.ts
 * haoyi QQ:39499740 E-mail:39499740@qq.com
 * Copyright (c) 2023 by haoyi, All Rights Reserved. 
 */
import { defineStore } from 'pinia'
import { SessionEntity } from '../utils/database/db'

export const useGlobalStore = defineStore({
    id: 'global',
    state: () => {
        return {
            selectedSession: null as SessionEntity | null,
        }
    },
    getters: {
        getSelectedSession(): SessionEntity | null {
            return this.selectedSession
        }
    },
    actions: {
        updateSelectedSession(session: SessionEntity) {
            this.selectedSession = session
        }
    },
    persist: {
        storage: sessionStorage,
    }
})
