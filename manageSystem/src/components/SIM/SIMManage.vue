<template>
    <div class="SIMManage" element-loading-text="拼命加载中">
        <search @search="submit" @addDevice="addDevice" :user="searchObj.user"  :number="searchObj.number" :ismanager="ismanager"></search>
        <sim-table :tableData="SIMTable.SIMTableData" :ismanager="ismanager" :currentPage="SIMTable.currentPage" :pageSizes="SIMTable.pageSizes"
            :pageSize="SIMTable.pageSize" :totalNum="SIMTable.totalNum" @pageSizeFn="pageSizeFn" @currentPageFn="currentPageFn"
            @deleteDate="deleteDate" @modify="modify" @receive="receive" @returnFn="returnFn">
        </sim-table>
        <add-device @addResult="addResult" @addclose="addclose" @modifyResult="modifyResult" :addVisible="addDeviceObj.addVisible"
            :status="addDeviceObj.addStatus" :ruleForm="addDeviceObj.deviceData"></add-device>
    </div>
</template>

<script>
    import Search from '@/base/SIM/SIMSearch'
    import SimTable from '@/base/SIM/SIMTable'
    import AddDevice from '@/base/SIM/SIMAdd'
    import SIMAPI from '@/common/api/SIM'
    export default {
        name: 'SIMManage',
        mounted() {
            this.initSIMlist()
        },
        data() {
            return {
                loading: true,
                ismanager: true,
                searchSubmit: {},
                searchObj: {
                    user: ['ewqe','wqew rfew','werwe'],
                    number:['87945','744156','asdasdasdff']
                },
                SIMTable: {
                    SIMTableData: [
                        {number:123}
                    ],
                    currentPage: 1,
                    pageSizes: [5, 10, 15, 20],
                    pageSize: 5,
                    totalNum: 10
                },
                addDeviceObj: {
                    addVisible: false,
                    deviceData: {},
                    addStatus: 'none'
                }
            }
        },
        methods: {
            submit(val) {
                console.log(val)
                this.searchSubmit = val
                this.SIMTable.currentPage = 1
                this.searchSIMPage()
            },
            pageSizeFn(val) {
                this.SIMTable.pageSize = val
                console.log('##改pageSize')
                console.log(this.SIMTable.pageSize)
                this.searchSIMPage()
            },
            currentPageFn(val) {
                this.SIMTable.currentPage = val
                console.log('##currentPage')
                console.log(this.SIMTable.currentPage)
                this.searchSIMPage()
            },
            async deleteDate(id) {
                this.$confirm("此操作将永久删除该信息, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                    .then(async () => {
                        try {
                            const result = await SIMAPI.deleteSIM(id)
                            if (result.returnCode == '000000') {
                                this.$message({
                                    message: '删除成功',
                                    type: 'success',
                                    onClose: () => {
                                        this.initSIMlist()
                                    }
                                })
                            } else {
                                this.$message.error('删除失败')
                            }
                        } catch (err) {
                            this.$message.error('删除失败')
                        }
                    })
                    .catch(() => {
                        this.$message({
                            type: "info",
                            message: "已取消删除"
                        });
                    });
            },
            async initSIMlist() {
                await this.getSearchClassify()
                console.log('获取列表')
                await this.searchSIMPage()
                console.log('查询')
            },
            async searchSIMPage() {
                let obj = {
                    searchCondition: this.searchSubmit,
                    pagination: {
                        pageSize: this.SIMTable.pageSize,
                        currentPage: this.SIMTable.currentPage
                    }
                }
                this.loading = true
                try {
                    const res = await SIMAPI.searchSIMPage(obj) // 将信息发送给后端
                    this.SIMTable.totalNum = res.result.totalNum
                    this.SIMTable.SIMTableData = res.result.SIMlist
                    this.loading = false
                    return res.result
                } catch (error) {
                    this.$message.error('加载失败')
                }
            },
            async getSearchClassify() {
                try {
                    const result = await SIMAPI.getAllUser()
                    if (result.returnCode == '000000') {
                        this.searchObj.user = result.result.user
                        this.searchObj.number = result.result.number
                        return result
                    } else {
                        this.$message.error('加载失败')
                    }
                } catch (error) {
                    this.$message.error('加载失败')
                }
            },
            addDevice() {
                this.addDeviceObj.deviceData = {}
                this.addDeviceObj.addVisible = true
                this.addDeviceObj.addStatus = 'add'
            },
            addclose() {
                console.log('addclose')
                this.addDeviceObj.addVisible = false
            },
            async addResult(val) {
                val.borrowstatus = '未申领'
                let reqObj = {
                    param: val
                }
                try {
                    const result = await SIMAPI.createSIM(reqObj)
                    if (result.returnCode == '000000') {
                        this.$message({
                            message: '添加成功',
                            type: 'success',
                            onClose: () => {
                                this.addDeviceObj.addVisible = false
                                this.initSIMlist()
                            }
                        })
                    } else {
                        this.$message.error('添加失败')
                    }
                } catch (err) {
                    this.$message.error('添加失败')
                }
            },
            async receive(id){
                let account = sessionStorage.getItem('account')
                console.log('申领'+id)             
                console.log(account)   
                var reqObj = {
                    id: id,
                    type: 'borrow',
                    param: {
                        borrowstatus: '已申领',
                        borrowAccount: account
                    }
                }
                try {
                    const result = await SIMAPI.updateSIM(reqObj)
                    if (result.returnCode == '000000') {
                        this.$message({
                            message: '申领成功',
                            type: 'success',
                            onClose: () => {
                                this.initSIMlist()
                            }
                        })
                    } else {
                        this.$message.error('申领失败')
                    }
                } catch (err) {
                    this.$message.error('申领失败')
                }
            },
            async returnFn(id){
                console.log('申领'+id)             
                var reqObj = {
                    id: id,
                    type: 'return',
                    param: {
                        borrowstatus: '未申领'
                    }
                }
                try {
                    const result = await SIMAPI.updateSIM(reqObj)
                    if (result.returnCode == '000000') {
                        this.$message({
                            message: '归还成功',
                            type: 'success',
                            onClose: () => {
                                this.initSIMlist()
                            }
                        })
                    } else {
                        this.$message.error('归还失败')
                    }
                } catch (err) {
                    this.$message.error('归还失败')
                }
            },
            modify(val) {
                this.addDeviceObj.addStatus = 'modify'
                this.addDeviceObj.deviceData = Object.assign({}, val)
                this.addDeviceObj.addVisible = true
            },
            async  modifyResult(val) {
                let _this = this
                const reqObj = {
                    id: val.id,
                    param: {
                        number: val.number,
                        IMSI: val.IMSI,
                        type: val.type,
                        size: val.size,
                        operator: val.operator,
                        remark: val.remark
                    }
                }
                try {
                    const result = await SIMAPI.updateSIM(reqObj)
                    if (result.returnCode == '000000') {
                        this.$message({
                            message: '修改成功',
                            type: 'success',
                            onClose: () => {
                                this.addDeviceObj.addVisible = false
                                this.initSIMlist()
                            }
                        })
                    } else {
                        this.$message.error('修改失败')
                    }
                } catch (err) {
                    this.$message.error('修改失败')
                }
            }
        },
        components: {
            Search,
            SimTable,
            AddDevice
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
    @import "../../common/less/mixin.less";
</style>