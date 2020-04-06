import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () =>
  import('../pages/login')
const Borrow = () =>
  import('../pages/borrow')
const JudgeId = () =>
  import('../pages/judgeId')
const Judge = () =>
  import('../pages/judge')
const Transfer = () =>
  import('../pages/transfer')


const routes = [
  {
    path: '/',
    redirect: '/judge'
  },
  {
    path: '/judge',
    component: Judge,
    beforeEnter: (to, from, next) => {
      next();
    }
  },
  {
    path: '/judgeId',
    component: JudgeId,
    beforeEnter: (to, from, next) => {
      next();
    }
  },
  {
    path: '/login',
    component: Login,
    beforeEnter: (to, from, next) => {
      next();
    }
  },
  {
    path: '/borrow',
    component: Borrow,
    beforeEnter: (to, from, next) => {
      next();
    }
  },
  {
    path: '/transfer',
    component: Transfer,
    beforeEnter: (to, from, next) => {
      next();
    }
  }
]

Vue.use(VueRouter);

export default new VueRouter({
  routes
})
