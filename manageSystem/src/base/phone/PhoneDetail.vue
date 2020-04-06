<template>
    <div class="phonedetail">
        <table class="gridtable">
            <tr>
                <td>
                    <span class="title">设备名：</span>
                    <span>{{gridtable.name}}</span>
                </td>
                <td>
                    <span class="title">平台：</span>
                    <span>{{gridtable.platform}}</span>
                </td>
                <td>
                    <span class="title">品牌：</span>
                    <span>{{gridtable.brand}}</span>
                </td>
                <td>
                    <span class="title">imei：</span>
                    <span>{{gridtable.imei}}</span>
                </td>
                <td>
                    <span class="title">系统版本：</span>
                    <span>{{gridtable.system}}</span>
                </td>
            </tr>
            <tr>
                <td>
                    <span class="title">手机质量：</span>
                    <span>{{gridtable.quality}}</span>
                </td>
                <td>
                    <span class="title">申领状态：</span>
                    <span>{{gridtable.borrowstatus}}</span>
                </td>
                <td>
                    <span class="title">申领人：</span>
                    <span>{{gridtable.usertest.name}}</span>
                </td>
                <td>
                    <span class="title">添加时间：</span>
                    <span>{{gridtable.addtime}}</span>
                </td>
                <td>
                    <span class="title">借出时间：</span>
                    <span>{{borrowtime}}</span>
                </td>
            </tr>
            <tr>
                <td colspan="5">
                    <span class="title">手机描述：</span>
                    <span>{{gridtable.describe}}</span>
                </td>
            </tr>
            <tr>
                <td colspan="5">
                    <span class="title">问题记录：</span>
                    <span>{{gridtable.question}}</span>
                </td>
            </tr>
            <tr>
                <td colspan="5">
                    <span class="title">图片：</span>
                    <img class="phoneImg" :src="gridtable.img" alt="">
                </td>
            </tr>
        </table>
    </div>
</template>

<script>
    export default {
        name: 'phonedetail',
        props: {
            gridtable: {
                type: Object,
                default: function () {
                    return {
                        
                    }
                }
            }
        },
        data() {
            return {
            }
        },
        computed:{
            borrowtime(){
                if(this.gridtable.borrowstatus=='未申领'){
                    return '无'
                }else{
                    return this.gridtable.borrowtime
                }
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
    @import "../../common/less/mixin.less";
    table.gridtable {
        margin: auto;
        font-size: 14px;
        color: #333333;
        border-collapse: collapse;
        border-radius: 5px;
        box-shadow: 0 0 8px rgba(237, 237, 250, .6), 0 2px 4px 0 rgba(237, 237, 250, .5);
    }

    table.gridtable:hover {
        box-shadow: 0 0 8px rgba(237, 237, 250, .6), 0 2px 4px 0 rgba(237, 237, 250, .5);
    }

    table.gridtable td {
        border-width: 1px;
        padding: 12px 20px;
        border: 1px solid #ebeef5;
    }

    .phoneImg {
        display: block;
        margin: auto;
        width: 200px;
    }
</style>