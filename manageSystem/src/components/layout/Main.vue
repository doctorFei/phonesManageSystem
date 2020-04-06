<template>
  <div class="index">
    <el-container>
      <el-header>
        <span class='title'>
          测试机管理系统
        </span>
        <span style="float: right;font-size: 14px">你好！{{user}}</span>
        <el-dropdown style="float: right" @command="handleCommand" trigger="click">
          <i class="el-icon-setting" style="margin-right: 15px;color: #ffffff"></i>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="dropOut">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-container>
        <slide></slide>
        <el-main style="padding: 0;min-width: 820px;">
          <transition name="fade" mode="out-in">
            <router-view :key="key"></router-view>
          </transition>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex'
  import Slide from './slide'
  export default {
    name: 'index',
    created() {
      this.user = sessionStorage.getItem('name')
    },
    mounted() {
      this.$nextTick(function () {
        this.setHeight()
        window.onresize = () => {
          this.setHeight()
        }
      })
    },
    data() {
      return {
        user: '',
        collapsed: false,
      }
    },
    methods: {
      async getUserInfo(ctx) {
        const id = ctx.params.id // 获取url里传过来的参数里的id
        const result = await user.getUserById(id) // 通过await “同步”地返回查询结果
        ctx.body = result // 将请求的结果放到response的body里返回
      },
      setHeight() {
        let ch = document.documentElement.clientHeight,
          headerh = $('.header').height()
        $('.el-main').height(ch - 50)
        $('.el-aside').height(ch - 50)
      },
      handleCommand(command) {
        //console.log('点击退出')
        sessionStorage.setItem('login-token', 'null')
        this.$router.push('/')
      },
      ...mapMutations({
        setRouter: 'SET_ROUTER'
      })
    },
    computed: {
      key() {
        return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
      },
      ...mapGetters([
        'router'
      ])
    },
    components:{
      Slide
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  @import "../../common/less/mixin.less";
  .el-header {
    background: #373D41;
    font-size: 20px;
    color: #bfcbd9;
    height: 50px !important;
    line-height: 50px !important;
  }

  
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.28s;
  }

  .fade-enter,
  .fade-leave-active {
    opacity: 0;
  }


</style>