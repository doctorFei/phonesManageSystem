<template>
    <div class="headsetManage" element-loading-text="拼命加载中">
        <search @search="submit" @addDevice="addDevice" :user="searchObj.user" :brand="searchObj.brand" :SN="searchObj.SN" :ismanager="ismanager"></search>
        <headset-table :tableData="headsetTable.headsetTableData" :ismanager="ismanager" :currentPage="headsetTable.currentPage" :pageSizes="headsetTable.pageSizes"
            :pageSize="headsetTable.pageSize" :totalNum="headsetTable.totalNum" @pageSizeFn="pageSizeFn" @currentPageFn="currentPageFn"
            @deleteDate="deleteDate" @modify="modify" @receive="receive" @returnFn="returnFn">
        </headset-table>
        <add-device @addResult="addResult" @addclose="addclose" @modifyResult="modifyResult" :addVisible="addDeviceObj.addVisible"
            :status="addDeviceObj.addStatus" :ruleForm="addDeviceObj.deviceData"></add-device>
    </div>
</template>

<script>
    import Search from '@/base/headset/headsetSearch'
    import HeadsetTable from '@/base/headset/headsetTable'
    import AddDevice from '@/base/headset/headsetAdd'
    import headsetAPI from '@/common/api/headset'
    export default {
        name: 'headsetManage',
        mounted() {
            this.initHeadsetlist()
        },
        data() {
            return {
                loading: true,
                ismanager: true,
                searchSubmit: {},
                searchObj: {
                },
                headsetTable: {
                    headsetTableData: [
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
                this.headsetTable.currentPage = 1
                this.searchHeadsetPage()
            },
            pageSizeFn(val) {
                this.headsetTable.pageSize = val
                console.log('##改pageSize')
                console.log(this.headsetTable.pageSize)
                this.searchHeadsetPage()
            },
            currentPageFn(val) {
                this.headsetTable.currentPage = val
                console.log('##currentPage')
                console.log(this.headsetTable.currentPage)
                this.searchHeadsetPage()
            },
            async deleteDate(id) {
                this.$confirm("此操作将永久删除该信息, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                    .then(async () => {
                        try {
                            const result = await headsetAPI.deleteHeadset(id)
                            if (result.returnCode == '000000') {
                                this.$message({
                                    message: '删除成功',
                                    type: 'success',
                                    onClose: () => {
                                        this.initHeadsetlist()
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
            async initHeadsetlist() {
                await this.getSearchClassify()
                console.log('获取列表')
                await this.searchHeadsetPage()
                console.log('查询')
            },
            async searchHeadsetPage() {
                let obj = {
                    searchCondition: this.searchSubmit,
                    pagination: {
                        pageSize: this.headsetTable.pageSize,
                        currentPage: this.headsetTable.currentPage
                    }
                }
                this.loading = true
                try {
                    const res = await headsetAPI.searchHeadsetPage(obj) // 将信息发送给后端
                    this.headsetTable.totalNum = res.result.totalNum
                    this.headsetTable.headsetTableData = res.result.headsetlist
                    this.loading = false
                    return res.result
                } catch (error) {
                    this.$message.error('加载失败')
                }
            },
            async getSearchClassify() {
                try {
                    const result = await headsetAPI.getSearchList()
                    if (result.returnCode == '000000') {
                        this.searchObj.brand = result.result.brand
                        this.searchObj.SN = result.result.SN
                        this.searchObj.user = result.result.user
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
                    const result = await headsetAPI.createHeadset(reqObj)
                    if (result.returnCode == '000000') {
                        this.$message({
                            message: '添加成功',
                            type: 'success',
                            onClose: () => {
                                this.addDeviceObj.addVisible = false
                                this.initHeadsetlist()
                            }
                        })
                    } else {
                        this.$message.error('添加失败')
                    }
                } catch (err) {
                    this.$message.error('添加失败')
                }
            },
            async receive(id) {
                let account = sessionStorage.getItem('account')
                console.log('申领' + id)
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
                    const result = await headsetAPI.updateHeadset(reqObj)
                    if (result.returnCode == '000000') {
                        this.$message({
                            message: '申领成功',
                            type: 'success',
                            onClose: () => {
                                this.initHeadsetlist()
                            }
                        })
                    } else {
                        this.$message.error('申领失败')
                    }
                } catch (err) {
                    this.$message.error('申领失败')
                }
            },
            async returnFn(id) {
                console.log('申领' + id)
                var reqObj = {
                    id: id,
                    type: 'return',
                    param: {
                        borrowstatus: '未申领'
                    }
                }
                try {
                    const result = await headsetAPI.updateHeadset(reqObj)
                    if (result.returnCode == '000000') {
                        this.$message({
                            message: '归还成功',
                            type: 'success',
                            onClose: () => {
                                this.initHeadsetlist()
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
                        brand: val.brand,
                        SN: val.SN,
                        color: val.color,
                        source: val.source,
                        finishType: val.finishType,
                        remark: val.remark
                    }
                }
                try {
                    const result = await headsetAPI.updateHeadset(reqObj)
                    if (result.returnCode == '000000') {
                        this.$message({
                            message: '修改成功',
                            type: 'success',
                            onClose: () => {
                                this.addDeviceObj.addVisible = false
                                this.initHeadsetlist()
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
            HeadsetTable,
            AddDevice
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
    @import "../../common/less/mixin.less";
</style>