<template>
    <div class="login">
        <div class="welcome">
            <img src="../assets/welcome.png">
        </div>
        <div class="login-form">
            <div class="login-inp">
                <label>登录</label>
                <input type="text" v-model="username">
            </div>
            <div class="login-inp">
                <label>密码</label>
                <input type="password" v-model="password">
            </div>
            <div class="login-inp">
                <p @click="login()">立即登录</p>
            </div>
        </div>
    </div>
</template>

<script>
    import api from '@/api/api'
    import axios from 'axios'
    import AES from '@/api/aes'
    import { mapGetters, mapMutations } from 'vuex'
    import { MessageBox, Indicator, Toast } from 'mint-ui'
    export default {
        name: 'login',
        data() {
            return {
                username: '',
                password: ''
            }
        },
        methods: {
            async login() {
                if(!this.username){
                    alert('域账号不能为空')
                    return false
                }
                if(!this.password){
                    alert('密码不能为空')
                    return false
                }

                let req = {
                    username: this.username,
                    password:AES.Encrypt(this.password) 
                }
                this.password=AES.Encrypt(this.password)
                try {
                    let res=await api.login(req)
                    console.log(res.data)
                    if (res.data.returnCode === '000000') {
                        sessionStorage.setItem('login-token', res.data.result.token)
                        sessionStorage.setItem('account', this.username)
                        axios.defaults.headers.common['Authorization'] = 'Bearer ' + res.data.result.token
                        //绑定域账号
                        let result = await api.getUserByAccount({ account: this.username })
                        
                        let reqObj = {
                            id: result.data.result.id,
                            param: {
                                wxid: wxcode
                            }
                        }
                        sessionStorage.setItem('name', result.data.result.name)
                        let updateUser = await api.updateUser(reqObj)
                        //进入详情页
                        Toast({
                            message: '登录成功',
                            position: 'middle',
                            duration: 3000
                        });
                        this.setUser({
                            account: this.username,
                            name: res.data.result.name
                        })
                        this.$router.push({ path: '/borrow' });
                    } else {
                        Toast({
                            message: '登录失败',
                            position: 'middle',
                            duration: 3000
                        });
                        sessionStorage.setItem('login-token', null) // 将token清空
                    }
                } catch (error) {
                    Toast({
                            message: '登录失败',
                            position: 'middle',
                            duration: 3000
                        });
                        sessionStorage.setItem('login-token', null) // 将token清空
                }
            },
            ...mapMutations({
                setUser: 'SET_USER'
            })
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
    @import "../style/mixin";
    .login {
        width: 100%;
        height: 100%;
        background: url(../assets/login-bg.png) no-repeat;
        background-size: cover;
        position: fixed;
        z-index: 1000;
    }

    .welcome {
        width: 100%;
        margin: 25% 0;
    }

    .welcome img {
        width: 100%;
    }


    .login-inp {
        position: relative;
        height: px2rem(80px);
        line-height: px2rem(80px);
        margin: 0 30px 15px 30px;
        border: 1px solid #fff;
        border-radius: 25px;
    }

    .login-inp label {
        position: absolute;
        left: 0;
        top: 0;
        font-size: px2rem(30px);
        line-height: px2rem(80px);
        width: px2rem(140px);
        text-align: center;
        display: inline-block;
        color: #fff;
    }

    .login-inp input {
        position: absolute;
        height: px2rem(80px);
        line-height: px2rem(80px);
        font-size: px2rem(30px);
        color: #fff;
        top: 0;
        left: px2rem(140px);
        background-color: transparent;
        border: none;
        outline: none;
    }

    .login-inp p {
        display: block;
        width: 100%;
        text-align: center;
        line-height: 40px;
        color: #fff;
        font-size: 16px;
        letter-spacing: 5px;
    }

    .login-txt {
        text-align: center;
        color: #fff;
    }

    .login-txt p {
        color: #fff;
        padding: 0 5px;
    }
</style>