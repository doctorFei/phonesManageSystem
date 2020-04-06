<template>
  <div class="login_page fillcontain">
    <transition name="form-fade" mode="in-out">
      <section class="form_contianer" v-show="showLogin">
        <div class="manage_tip">
          <p>测试机及物料管理系统</p>
        </div>
        <el-form :model="loginForm" :rules="rules" ref="loginForm">
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" placeholder="域账号">
              <span></span>
            </el-input>
          </el-form-item>
          <el-form-item prop="password"> 
            <el-input type="password" placeholder="密码" v-model="loginForm.password"   @keyup.enter.native="submitForm()"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm()" class="submit_btn">登陆</el-button>
          </el-form-item>
        </el-form>
          <p>
              游客模式（账号：admin；密码：123456） 
          </p>
      </section>
    </transition>
  </div>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex'
  import AES from '@/common/js/aes'
  export default {
    data() {
      return {
        loginForm: {
          username: '',
          password: '',
        },
        rules: {
          username: [
            { required: true, message: '请输入域账号', trigger: 'blur' },
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ],
        },
        showLogin: false,
      }
    },
    mounted() {
      this.showLogin = true;
    },
    computed: {
      // ...mapGetters([
      //   'user'
      // ])
    },
    methods: {
      submitForm() {
        let val=this.loginForm
        this.$refs["loginForm"].validate((valid) => {
          if (valid) {
            let password = val.password
            password=AES.Encrypt(password)
            this.loginForm.password=password
            let reqObj={
              username: val.username,
              password:password
            }
            const result = this.$http.post('/phoneManageSystem/login/login', reqObj) // 将信息发送给后端
            result.then((res) => {
              if (res.data.returnCode == '000000') {
                sessionStorage.setItem('login-token', res.data.result.token) // 用sessionStorage把token存下来
                sessionStorage.setItem('name', res.data.result.name)
                sessionStorage.setItem('role', res.data.result.role)
                sessionStorage.setItem('account', val.username)
                this.$message({ // 登录成功，显示提示语
                  type: 'success',
                  message: '登录成功！'
                })
                this.$router.push('/main') // 进入todolist页面，登录成功
              } else {
                this.$message.error(res.data.returnMsg) // 登录失败，显示提示语
                sessionStorage.setItem('login-token', null) // 将token清空
              }
            }, (err) => {
              this.$message.error('请求错误！')
              sessionStorage.setItem('login-token', null) // 将token清空
            })
            return result
          }
        })
      },
      encrypt(str, secret) {
        var cipher = crypto.createCipher('aes192', secret);
        var enc = cipher.update(str, 'utf8', 'hex');
        enc += cipher.final('hex');
        return enc;
      },
      // ...mapMutations({
      //   setUser: 'SET_USER'
      // })
    },
    watch: {

    }
  }
</script>

<style scoped lang="less">
  @import "../../common/less/mixin.less";
  .login_page {
    background-color: #324057;
  }

  .manage_tip {
    position: absolute;
    width: 100%;
    top: -100px;
    left: 0;
    p {
      font-size: 34px;
      color: #fff;
    }
  }

  .form_contianer {
    .wh(320px, 210px);
    .ctp(320px, 210px);
    padding: 25px;
    border-radius: 5px;
    text-align: center;
    background-color: #fff;
    .submit_btn {
      width: 100%;
      font-size: 16px;
    }
  }

  .tip {
    font-size: 12px;
    color: red;
  }

  .form-fade-enter-active,
  .form-fade-leave-active {
    transition: all 1s;
  }

  .form-fade-enter,
  .form-fade-leave-active {
    transform: translate3d(0, -50px, 0);
    opacity: 0;
  }
</style>