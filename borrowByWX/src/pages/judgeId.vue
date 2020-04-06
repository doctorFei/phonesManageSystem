<template>
    <div class="judgeID"></div>
  </template>
  
  <script>
    import api from '@/api/api'
    import axios from 'axios'
    import { mapGetters, mapMutations } from 'vuex'
    import { MessageBox, Indicator, Toast } from 'mint-ui';
    export default {
        name: 'judgeID',
        created() {
            Indicator.open('正在核实您的信息...');
            this.judgeID()
        },
        data() {
            return {
            }
        },
        methods: {
            async judgeID() {
                try {
                    let result = await api.getUserByWXID({ wxid: wxcode })
                    console.log(result)
                    if (result.data.returnCode == '000000') {
                        if (!!result.data.result) {
                            sessionStorage.setItem('account', result.data.result.account) // 用sessionStorage把token存下来
                            sessionStorage.setItem('name', result.data.result.name) // 用sessionStorage把token存下来
                            let tokenResult=await api.nameToToken({ username: result.data.result.account})
                            let token=tokenResult.data.result.token
                            sessionStorage.setItem('login-token', token)
                            //调一次登录接口
                            this.$router.push({ path: '/borrow' });
                        } else {
                            this.$router.push({ path: '/login' });
                        }
                    } else {
                        console.log('请求错误/login')
                        this.$router.push({ path: '/login' });
                    }
                } catch (err) {
                    console.log('请求错误/logincatch')
                    this.$router.push({ path: '/login' });
                }
            },
            ...mapMutations({
                setUser: 'SET_USER'
            })
        },
        computed: {
            ...mapGetters([
                'user'
            ])
        }
    }
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style lang="scss" scoped>
    @import "../style/mixin";
    .judgeID {
        width: 100%;
        height: 100%;
        background: url(../assets/login-bg.png) no-repeat;
        background-size: cover;
        position: fixed;
        z-index: 1000;
    }
  </style>