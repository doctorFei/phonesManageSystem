<template>
    <div class="borrow">
        <li class="detail">
            <!-- <span class="lable">姓名：</span> -->
            <span>{{user}}</span>
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
        <div style="text-align: center; margin-top: 60px;z-index: 1000;">
            <mt-button v-show="borrowShow" type="danger" @click="borrow()">申领测试机</mt-button>
            <mt-button v-show="returnShow" type="danger" @click="returnFn()">归还测试机</mt-button>
            <mt-button v-show="transferShow" type="danger" @click="transferFn()">申请转让</mt-button>
            <!-- <mt-button type="primary" @click="feedback()">问题反馈</mt-button> -->
        </div>
        <mt-popup v-model="popupVisible">
            <p class="poptxt">请测试机拥有人扫描以下二维码</p>
            <qriously :value="ewm.value" :size="ewm.size" />
        </mt-popup>
    </div>
</template>

<script>
    import api from '@/api/api'
    import { mapGetters, mapMutations } from 'vuex'
    import { MessageBox, Indicator, Toast, Popup } from 'mint-ui';
    let account = sessionStorage.getItem('account')
    export default {
        name: 'Borrow',
        created() {
            this.user=sessionStorage.getItem('name')
            Indicator.open('数据加载中...');
            this.getPhoneDetail()
        },
        data() {
            return {
                user:'',
                phoneDetail: {
                    usertest: {
                        name: ''
                    }
                },
                ewm: {
                    value: 'http://xz.voicecloud.cn/activity/wxBorrow/main.html?phoneID=',
                    size: 200
                },
                loadingShow: true,
                borrowShow: false,
                returnShow: false,
                transferShow: false,
                popupVisible: false
            }
        },
        methods: {
            async getPhoneDetail() {
                try {
                    let result = await api.searchPhoneById({ id: phoneID })
                    Indicator.close()
                    if (result.data.returnCode == '000000') {
                        if (!!result.data.result) {
                            this.phoneDetail = result.data.result
                            if (result.data.result.borrowstatus == '未申领') {
                                //一键申领
                                this.borrowShow = true
                            } else {
                                console.log(account)
                                if (this.phoneDetail.usertest.account == account) {
                                    this.returnShow = true
                                    console.log('可退还')
                                } else {
                                    console.log('可转让')
                                    this.transferShow = true
                                }
                            }
                        } else {
                            Toast({
                                message: '加载失败',
                                position: 'middle',
                                duration: 3000
                            });
                        }
                    } else {
                        Toast({
                            message: '加载失败',
                            position: 'middle',
                            duration: 3000
                        });
                    }
                } catch (error) {
                    Indicator.close()
                    Toast({
                        message: '加载失败',
                        position: 'middle',
                        duration: 3000
                    });
                }
            },
            async borrow() {
                var reqObj = {
                    id: phoneID,
                    type: 'borrow',
                    param: {
                        borrowstatus: '已申领',
                        borrowAccount: account
                    }
                }
                try {
                    let borrowPhone = await api.borrowPhone(reqObj)
                    if (borrowPhone.data.returnCode == "000000") {
                        this.returnShow = true
                        this.borrowShow = false
                        this.getPhoneDetail()
                        Toast({
                            message: '申领成功',
                            position: 'middle',
                            duration: 3000
                        });
                    } else {
                        Toast({
                            message: '申领失败',
                            position: 'middle',
                            duration: 3000
                        });
                    }
                } catch (error) {
                    Toast({
                        message: '申领失败',
                        position: 'middle',
                        duration: 3000
                    });
                }
            },
            async returnFn() {
                var reqObj = {
                    id: phoneID,
                    type: 'return',
                    param: {
                        borrowstatus: '未申领'
                    }
                }
                try {
                    let result = await api.borrowPhone(reqObj)
                    if (result.data.returnCode == '000000') {
                        Toast({
                            message: '归还成功',
                            position: 'middle',
                            duration: 3000
                        });
                        this.getPhoneDetail()
                        this.returnShow = false
                        this.borrowShow = true
                    } else {
                        Toast({
                            message: '归还失败',
                            position: 'middle',
                            duration: 3000
                        });
                    }
                } catch (error) {
                    Toast({
                        message: '归还失败',
                        position: 'middle',
                        duration: 3000
                    });
                }
            },

            async feedback() {
                MessageBox.prompt('请输入该测试机存在的问题').then(async ({ value, action }) => {
                    var reqObj = {
                        id: phoneID,
                        param: {
                            question: value
                        }
                    }
                    try {
                        let result = await api.borrowPhone(reqObj)
                        if (result.data.returnCode == '000000') {
                            Toast({
                                message: '反馈成功',
                                position: 'middle',
                                duration: 3000
                            });
                        }
                    } catch (error) {
                        Toast({
                            message: '反馈失败',
                            position: 'middle',
                            duration: 3000
                        });
                    }
                })
            },
            transferFn() {
                console.log('申请转让处理')
                console.log(account)
                console.log('http://xz.voicecloud.cn/activity/wxBorrow/main.html?phoneID='+phoneID+'&borrowAccount='+account)
                this.ewm.value= 'http://xz.voicecloud.cn/activity/wxBorrow/main.html?phoneID='+phoneID+'&borrowAccount='+account,
                this.popupVisible = true
            }
        },
        components: {

        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
    @import "../style/mixin";
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

    .borrow {
        width: 100%;
        height: 100%;
        background: url(../assets/login-bg.png) no-repeat;
        background-size: cover;
        position: fixed;
        z-index: 1000;
    }

    .poptxt {
        font-size: px2rem(40px);
        text-align: center;
    }
</style>