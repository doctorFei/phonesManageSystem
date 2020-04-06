<template>
    <div class="transfer">
        <li class="detail">
            <!-- <span class="lable">你好</span> -->
            <span>{{userName}}</span>
        </li>
        <li class="detail">
            <span class="lable">设备名：</span>
            <span>{{phoneDetail.name}}</span>
        </li>
        <li class="detail">
            <span class="lable">imei：</span>
            <span>{{phoneDetail.imei}}</span>
        </li>
        <li class="detail">
            <span class="lable">系统版本：</span>
            <span>{{phoneDetail.system}}</span>
        </li>
        <li class="detail">
            <span class="lable">手机质量：</span>
            <span>{{phoneDetail.quality}}</span>
        </li>
        <li class="detail">
            <span class="lable">申领状态：</span>
            <span>{{phoneDetail.borrowstatus}}</span>
        </li>
        <li class="detail">
            <span class="lable">申领人：</span>
            <span>{{phoneDetail.usertest.name}}</span>
        </li>
    </div>
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
                userName: '',
                phoneDetail: {
                    usertest: {
                        name: ''
                    }
                }
            }
        },
        methods: {
            async judgeID() {
                try {
                    let result = await api.getUserByWXID({ wxid: wxcode })
                    console.log(result)
                    if (result.data.returnCode == '000000') {
                        if (!!result.data.result) {
                            let token=await api.nameToToken({ username: result.data.result.account})
                            let propraAccount= result.data.result.account
                            token=token.data.result.token
                            sessionStorage.setItem('login-token', token)
                            axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
             
                            let phoneDetail = await api.searchPhoneById({ id: phoneID })
                            if (phoneDetail.data.returnCode == '000000') {
                                if (!!phoneDetail.data.result) {
                                    this.userName = result.data.result.name
                                    if (result.data.result.account == propraAccount) {
                                        // this.$router.push({ path: '/borrow' });
                                        this.borrow()
                                    } else {
                                        this.showErrorToast()
                                        console.log('拥有人不对')
                                        // this.$router.push({ path: '/login' });
                                    }
                                } else {
                                    this.showErrorToast()
                                    console.log('没有这个phoneid')
                                }
                            } else {
                                this.showErrorToast()
                                console.log('phoneid获取手机有误')
                            }
                        } else {
                            this.showErrorToast()
                            console.log('没有这个wxid')
                            // this.$router.push({ path: '/login' });
                        }
                    } else {
                        this.showErrorToast()
                        console.log('wxid获取用户失败')
                        // this.$router.push({ path: '/login' });
                    }
                } catch (err) {
                    console.log('不知道')
                    this.showErrorToast()
                    console.log(err)
                }
            },
            async borrow() {
                var reqObj = {
                    id: phoneID,
                    type: 'borrow',
                    param: {
                        borrowstatus: '已申领',
                        borrowAccount: borrowAccount
                    }
                }
                try {
                    let borrowPhone = await api.borrowPhone(reqObj)
                    console.log(borrowPhone)
                    console.log(borrowPhone.data.returnCode == "000000")

                    if (borrowPhone.data.returnCode == "000000") {
                        this.getPhoneDetail()
                        Toast({
                            message: '转让成功',
                            position: 'middle',
                            duration: 3000
                        });
                    } else {
                        Toast({
                            message: '转让失败',
                            position: 'middle',
                            duration: 3000
                        });
                    }
                } catch (error) {
                    Toast({
                        message: '转让失败',
                        position: 'middle',
                        duration: 3000
                    });
                }
            },
            async getPhoneDetail() {
                let result = await api.searchPhoneById({ id: phoneID })
                this.phoneDetail = result.data.result
            },
            showErrorToast() {
                Indicator.close()
                Toast({
                    message: '信息核实有误',
                    position: 'middle',
                    duration: 3000
                })
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
    .transfer {
        width: 100%;
        height: 100%;
        background: url(../assets/login-bg.png) no-repeat;
        background-size: cover;
        position: fixed;
        z-index: 1000;
    }

    li {
        color: #ffffff;
        list-style: none;
        padding-left: px2rem(30px);
        font-size: px2rem(40px);
        line-height: px2rem(100px);
        border-bottom: 1px solid #eeeeee;
        .lable {
            display: inline-block;
            width: px2rem(240px);
        }
    }
</style>