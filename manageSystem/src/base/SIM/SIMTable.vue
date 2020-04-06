<template>
    <div class="SIMTable">
        <el-table :data="tableData" stripe header-row-class-name="tableHeader" empty-text="暂时没有数据" border
            style="width: 100%">
            <el-table-column prop="number" label="卡号" align="center" width="100">
            </el-table-column>
            <el-table-column prop="IMSI" label="IMSI" align="center" width="100">
            </el-table-column>
            <el-table-column prop="type" label="套餐类型" align="center" width="100">
            </el-table-column>
            <el-table-column prop="size" label="尺寸" align="center" width="100">
            </el-table-column>
            <el-table-column prop="operator" label="运营商" align="center" width="100">
            </el-table-column>
            <el-table-column prop="borrowstatus" label="状态" align="center" width="100">
            </el-table-column>
            <el-table-column prop="usertest.name" label="签借人" align="center" width="100">
            </el-table-column>
            <el-table-column label="操作" align="center" min-width="320">
                <template slot-scope="scope">
                    <el-button size="small" type="info" @click="toDetail(scope.row)">详情</el-button>
                    <el-button size="small" v-show="scope.row.borrowstatus!='已申领'" type="primary" @click="receive(scope.row['id'])">申领</el-button>
                    <el-button size="small" v-show="scope.row.borrowstatus=='已申领'&&scope.row.usertest.account==account" type="warning" @click="returnFn(scope.row['id'])">归还</el-button>
                    <el-button size="small" v-if="ismanager" type="success" @click="modify(scope.row)">修改</el-button>
                    <el-button size="small" v-if="ismanager" type="danger" @click="deleteDate(scope.row['id'])">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div align="center" style="margin: 30px 0">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="pageSizes"
                :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalNum">
            </el-pagination>
        </div>
        <el-dialog title="设备详情" :visible.sync="detailVisible" width="70%">
            <sim-detail :gridtable="phonedetail"></sim-detail>
        </el-dialog>
    </div>
</template>

<script>
    import SimDetail from '@/base/SIM/SIMDetail'
    export default {
        name: 'SIMTable',
        created() {
            this.account = sessionStorage.getItem('account')
        },
        props: {
            ismanager:{
                type: Boolean,
                default:false
            },
            tableData: {
                type: Array,
                default: function () {
                    return []
                }
            },
            currentPage: {
                type: Number,
                default: function () {
                    return 1
                }
            },
            pageSizes: {
                type: Array,
                default: function () {
                    return [10,20,50,100]
                }
            },
            pageSize: {
                type: Number,
                default: function () {
                    return 10
                }
            },
            totalNum: {
                type: Number,
                default: function () {
                    return 100
                }
            }
        },
        data() {
            return {
                account:'',
                detailVisible: false,
                phonedetail: {}
            }
        },
        methods: {
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.$emit('pageSizeFn', val)
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.$emit('currentPageFn', val)
            },
            toDetail(row) {
                this.detailVisible = true
                this.phonedetail = row
            },
            deleteDate(id) {
                console.log('删除的ID'+id)
                this.$emit('deleteDate', id)
            },
            modify(row){
                console.log('点击了修改')
                this.$emit('modify',row)
            },
            receive(id){
                this.$emit('receive', id)
            },
            returnFn(id){
                this.$emit('returnFn', id)
            }
        },
        components: {
            SimDetail
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
    @import "../../common/less/mixin.less";
</style>