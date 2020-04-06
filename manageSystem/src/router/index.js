import Vue from 'vue'
import Router from 'vue-router'
import NProgress from 'nprogress'
import axios from 'axios'
const Login = () => import(/* webpackChunkName: 'userChunk' */ '@/components/login/Login')
const Main = () => import(/* webpackChunkName: 'userChunk' */ '@/components/layout/Main')
const User = () => import(/* webpackChunkName: 'userChunk' */ '@/components/user/User')

const DeviceView = () => import(/* webpackChunkName: 'PhoneChunk' */ '@/components/phone/DeviceView')
const DeviceManage = () => import(/* webpackChunkName: 'PhoneChunk' */ '@/components/phone/DeviceManage')
const Ewm = () => import(/* webpackChunkName: 'PhoneChunk' */ '@/components/phone/ewm')

const SIMView = () => import(/* webpackChunkName: 'SIMChunk' */ '@/components/SIM/SIMView')
const SIMManage = () => import(/* webpackChunkName: 'SIMChunk'*/ '@/components/SIM/SIMManage')

const BookView = () => import(/* webpackChunkName: 'bookChunk'*/ '@/components/book/bookView')
const BookManage = () => import(/* webpackChunkName: 'bookChunk'*/ '@/components/book/bookManage')

const HeadsetManage = () => import(/* webpackChunkName: 'HeadsetChunk'*/ '@/components/headset/headsetManage')
const HeadsetView = () => import(/* webpackChunkName: 'HeadsetChunk'*/ '@/components/headset/headsetView')


Vue.use(Router)

const router = new Router({
  routes: [
    {
      name:'login',
      path: '/',
      component: Login
    },
    {
      path: '*',
      redirect: '/'
    },
    {
      name:'main',
      path: '/main',
      component: Main,
      children: [
        {
          name: 'c_main',
          path: '',
          redirect: '/main/deviceView'
        },
        {
          name: 'DeviceView',
          path: 'deviceView',
          component: DeviceView
        },
        {
          name: 'DeviceManage',
          path: 'devicemanage',
          component: DeviceManage
        },
        {
          name: 'Ewm',
          path: 'ewm',
          component: Ewm
        },
        {
          name: 'User',
          path: 'user',
          component: User
        },
        {
          name: 'SIMView',
          path: 'SIMView',
          component: SIMView
        },
        {
          name: 'SIMManage',
          path: 'SIMManage',
          component: SIMManage
        },
        {
          name: 'BookView',
          path: 'bookView',
          component: BookView
        },
        {
          name: 'BookManage',
          path: 'bookManage',
          component: BookManage
        },
        {
          name: 'HeadsetManage',
          path: 'headsetManage',
          component: HeadsetManage
        },
        {
          name: 'HeadsetView',
          path: 'headsetView',
          component: HeadsetView
        }
      ]
    }
  ]
})
router.beforeEach((to, from, next) => {
  const token = sessionStorage.getItem('login-token')
  NProgress.start();
  if (to.path === '/') { // 如果是跳转到登录页的
    if (token !== 'null' && token !== null) {
      next('/main') // 如果有token就转向todolist不返回登录页
    }
    next() // 否则跳转回登录页
  } else {
    //store.commit('SET_ROUTER',to.path)
    if (!!token && token !== 'null' && token !== null) {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token // 注意Bearer后有个空格
      next() // 如果有token就正常转向
    } else {
      next('/') // 否则跳转回登录页
    }
  }
})

router.afterEach(() => {
  // 在即将进入新的页面组件前，关闭掉进度条
  NProgress.done()
})
export default router