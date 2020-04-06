<template>
    <div class="phonedetail">
        <table class="gridtable">
            <tr>
                <td>
                    <span class="title">卡号：</span>
                    <span>{{gridtable.bookname}}</span>
                </td>
                <td>
                    <span class="title">作者：</span>
                    <span>{{gridtable.author}}</span>
                </td>
                <td>
                    <span class="title">出版社：</span>
                    <span>{{gridtable.publish}}</span>
                </td>
            </tr>
            <tr>
                <td colspan="5">
                    <span class="title">简介：</span>
                    <span>{{gridtable.remark}}</span>
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
    .phonedetail{
        padding-bottom: 30px;
    }
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