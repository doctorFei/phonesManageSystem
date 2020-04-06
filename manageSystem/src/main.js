// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
//引入element组件化框架
import ElementUI from "element-ui"
//引入样式文件
import 'element-ui/lib/theme-chalk/index.css'

import router from './router'
import VueQriously from 'vue-qriously';
import store from './store'
import Vuex from 'vuex'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import axios from 'axios'

axios.defaults.headers.post['Content-Type']  = 'application/json'

Vue.use(VueQriously)
Vue.use(ElementUI)

Vue.prototype.$http = axios // 类似于vue-resource的调用方法

window.axios=axios


NProgress.configure({
  easing: 'ease',  // 动画方式    
  speed: 500,  // 递增进度条的速度    
  showSpinner: false, // 是否显示加载ico    
  trickleSpeed: 200, // 自动递增间隔    
  minimum: 0.3 // 初始化时的最小百分比
})

/* eslint-disable no-new */
new Vue({
  router: router,
  store,
  render: h => h(App)
}).$mount('#app')
