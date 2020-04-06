import "babel-polyfill"
import Vue from 'vue'
import router from './router/router'
import store from './store/index'
import lxUtil from '@/vendor/lxUtil'
import './vendor/lxadp.min'     
import '../config/config'
// import vConsole from 'vconsole' 
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import VueQriously from 'vue-qriously'
import axios from 'axios'
import api from '@/api/api'
import Zepto from "webpack-zepto"
window.$ = Zepto

Vue.use(VueQriously)
Vue.use(MintUI)
Vue.prototype.$http = axios 

let ua = navigator.userAgent.toLocaleLowerCase(),
  LINGXI = /lingxi/.test(ua),
  WX = /micromessenger/.test(ua);

if (WX) {
  let phoneID = lxUtil.queryUrl('phoneID')
  let code = lxUtil.queryUrl('code')
  let borrowAccount = lxUtil.queryUrl('borrowAccount')
  let wxcode=''

  window['phoneID'] = phoneID
  window['borrowAccount'] = borrowAccount
  console.log('phoneID' + phoneID)
  console.log('borrowAccount' + borrowAccount)

  api.getWXUserInfo(code).then((res)=>{
    wxcode=res.name
    window['wxcode'] = wxcode
    console.log('wxcode' + wxcode)  
    import(
      /* webpackChunkName: "jwexin" */
      'weixin-js-sdk').then(() => {
        new Vue({
          el: '#app',
          store,
          router
        })
    })  
  }).catch(()=>{
    alert('获取微信id失败')
  })
  router.beforeEach((to, from, next) => {
    const token = sessionStorage.getItem('login-token')
    console.log('获取token')
    console.log(token)
      if (!!token && token !== 'null' && token !== null) {
        Vue.prototype.$http.defaults.headers.common['Authorization'] = 'Bearer ' + token // 注意Bearer后有个空格
        next() // 如果有token就正常转向
      } else {
        next() // 否则跳转回登录页
      }
  })
} else {
  alert('请在微信页面打开')
}
