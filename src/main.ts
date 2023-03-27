/*
 * @Author: haoyi 39499740@qq.com
 * @Date: 2023-03-16 15:03:23
 * @LastEditors: haoyi 39499740@qq.com
 * @LastEditTime: 2023-03-21 13:28:01
 * @FilePath: /course-selection-system/src/main.ts
 * haoyi QQ:39499740 E-mail:39499740@qq.com
 * Copyright (c) 2023 by haoyi, All Rights Reserved. 
 */
import { createApp } from 'vue'
import "./style.css"
import App from './App.vue'
import './samples/node-api'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router'
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

const store = createPinia()
store.use(createPersistedState({
    serializer: {
        serialize: JSON.stringify,
        deserialize: JSON.parse
    }
}))


const app = createApp(App)
app.use(ElementPlus)
app.use(router)
app.use(store)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.mount('#app')
    .$nextTick(() => {
        postMessage({ payload: 'removeLoading' }, '*')
    })

