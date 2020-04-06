<template>
    <div class="bookManage" element-loading-text="拼命加载中">
        <search @search="submit" @addDevice="addDevice" :user="searchObj.user" :number="searchObj.bookname" :ismanager="ismanager"></search>
        <book-table :tableData="bookTable.bookTableData" :ismanager="ismanager" :currentPage="bookTable.currentPage" :pageSizes="bookTable.pageSizes"
            :pageSize="bookTable.pageSize" :totalNum="bookTable.totalNum" @pageSizeFn="pageSizeFn" @currentPageFn="currentPageFn"
            @deleteDate="deleteDate" @modify="modify" @receive="receive" @returnFn="returnFn">
        </book-table>
        <add-device @addResult="addResult" @addclose="addclose" @modifyResult="modifyResult" :addVisible="addDeviceObj.addVisible"
            :status="addDeviceObj.addStatus" :ruleForm="addDeviceObj.deviceData"></add-device>
    </div>
</template>

<script>
    import Search from '@/base/book/bookSearch'
    import BookTable from '@/base/book/bookTable'
    import AddDevice from '@/base/book/bookAdd'
    import bookAPI from '@/common/api/book'
    export default {
        name: 'bookManage',
        mounted() {
            this.initBooklist()
        },
        data() {
            return {
                loading: true,
                ismanager: false,
                searchSubmit: {},
                searchObj: {
                },
                bookTable: {
                    bookTableData: [
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
                this.bookTable.currentPage = 1
                this.searchBookPage()
            },
            pageSizeFn(val) {
                this.bookTable.pageSize = val
                console.log('##改pageSize')
                console.log(this.bookTable.pageSize)
                this.searchBookPage()
            },
            currentPageFn(val) {
                this.bookTable.currentPage = val
                console.log('##currentPage')
                console.log(this.bookTable.currentPage)
                this.searchBookPage()
            },
            async deleteDate(id) {
                this.$confirm("此操作将永久删除该信息, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                    .then(async () => {
                        try {
                            const result = await bookAPI.deleteBook(id)
                            if (result.returnCode == '000000') {
                                this.$message({
                                    message: '删除成功',
                                    type: 'success',
                                    onClose: () => {
                                        this.initBooklist()
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
            async initBooklist() {
                await this.getSearchClassify()
                console.log('获取列表')
                await this.searchBookPage()
                console.log('查询')
            },
            async searchBookPage() {
                let obj = {
                    searchCondition: this.searchSubmit,
                    pagination: {
                        pageSize: this.bookTable.pageSize,
                        currentPage: this.bookTable.currentPage
                    }
                }
                this.loading = true
                try {
                    const res = await bookAPI.searchBookPage(obj) // 将信息发送给后端
                    this.bookTable.totalNum = res.result.totalNum
                    this.bookTable.bookTableData = res.result.booklist
                    this.loading = false
                    return res.result
                } catch (error) {
                    this.$message.error('加载失败')
                }
            },
            async getSearchClassify() {
                try {
                    const result = await bookAPI.getSearchList()
                    if (result.returnCode == '000000') {
                        this.searchObj.user = result.result.user
                        this.searchObj.bookname = result.result.bookname
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
                    const result = await bookAPI.createBook(reqObj)
                    if (result.returnCode == '000000') {
                        this.$message({
                            message: '添加成功',
                            type: 'success',
                            onClose: () => {
                                this.addDeviceObj.addVisible = false
                                this.initBooklist()
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
                    const result = await bookAPI.updateBook(reqObj)
                    if (result.returnCode == '000000') {
                        this.$message({
                            message: '申领成功',
                            type: 'success',
                            onClose: () => {
                                this.initBooklist()
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
                    const result = await bookAPI.updateBook(reqObj)
                    if (result.returnCode == '000000') {
                        this.$message({
                            message: '归还成功',
                            type: 'success',
                            onClose: () => {
                                this.initBooklist()
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
                        bookname: val.bookname,
                        author: val.author,
                        publish : val.publish,
                        remark: val.remark
                    }
                }
                try {
                    const result = await bookAPI.updateBook(reqObj)
                    if (result.returnCode == '000000') {
                        this.$message({
                            message: '修改成功',
                            type: 'success',
                            onClose: () => {
                                this.addDeviceObj.addVisible = false
                                this.initBooklist()
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
            BookTable,
            AddDevice
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
    @import "../../common/less/mixin.less";
</style>