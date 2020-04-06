<template>
    <div class="deviceView" v-loading="loading" element-loading-text="拼命加载中">
        <search @search="submit" @addDevice="addDevice" :name="searchObj.devicename" :brand="searchObj.brand" :system="searchObj.system"
            :user="searchObj.user" :ismanager="ismanager"></search>
        <phone-table :phoneTableData="phoneTable.phoneTableData" :ismanager="ismanager" :currentPage="phoneTable.currentPage" :pageSizes="phoneTable.pageSizes"
            :pageSize="phoneTable.pageSize" :totalNum="phoneTable.totalNum" @pageSizeFn="pageSizeFn" @currentPageFn="currentPageFn"
            @deleteDate="deleteDate" @modify="modify">
        </phone-table>
        <add-device @addResult="addResult" @addclose="addclose" @modifyResult="modifyResult" :addVisible="addDeviceObj.addVisible"
            :status="addDeviceObj.addStatus" :ruleForm="addDeviceObj.deviceData"></add-device>
    </div>
</template>

<script>
    import Search from '@/base/phone/Search'
    import PhoneTable from '@/base/phone/PhoneTable'
    import AddDevice from '@/base/phone/AddDevice'
    import phoneListAPI from '@/common/api/phonelist'

    export default {
        name: 'deviceView',
        mounted() {
            this.initPhonelist()
        },
        data() {
            return {
                loading: false,
                ismanager: false,
                searchSubmit: {},
                searchObj: {
                    devicename: [],
                    brand: [],
                    system: [],
                    user: []
                },
                phoneTable: {
                    phoneTableData: [],
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
                this.phoneTable.currentPage = 1
                this.searchPhoneList()
            },
            pageSizeFn(val) {
                this.phoneTable.pageSize = val
                console.log('##改pageSize')
                console.log(this.phoneTable.pageSize)
                this.searchPhoneList()
            },
            currentPageFn(val) {
                this.phoneTable.currentPage = val
                console.log('##currentPage')
                console.log(this.phoneTable.currentPage)
                this.searchPhoneList()
            },
            async deleteDate(id) {
                this.$confirm("此操作将永久删除该信息, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                    .then(async () => {
                        try {
                            const result = await phoneListAPI.deletePhone(id)
                            if (result.returnCode == '000000') {
                                this.$message({
                                    message: '删除成功',
                                    type: 'success',
                                    onClose: () => {
                                        this.initPhonelist()
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
            getDevicenameList(val) {
                let devicename = [], brand = [], system = [], user = [];
                for (let i = 0; i < val.length; i++) {
                    if (!!val[i].name) {
                        devicename.push(val[i].name)
                    }
                    if (!!val[i].brand) {
                        brand.push(val[i].brand)
                    }
                    if (!!val[i].system) {
                        system.push(val[i].system)
                    }
                    if (!!val[i].usertest.name && val[i].usertest.name != '暂无') {
                        user.push(val[i].usertest.name)
                    }
                }
                this.searchObj.devicename = Array.from(new Set(devicename))
                this.searchObj.brand = Array.from(new Set(brand))
                this.searchObj.system = Array.from(new Set(system))
                this.searchObj.user = Array.from(new Set(user))
            },
            async initPhonelist() {
                await this.getSearchClassify()
                console.log('获取列表')
                await this.searchPhoneList()
                console.log('查询')
            },
            async searchPhoneList() {
                let obj = {
                    searchCondition: this.searchSubmit,
                    pagination: {
                        pageSize: this.phoneTable.pageSize,
                        currentPage: this.phoneTable.currentPage
                    }
                }
                this.loading = true
                try {
                    const res =await phoneListAPI.searchPhoneList(obj) // 将信息发送给后端
                    this.phoneTable.totalNum = res.data.result.totalNum
                    this.phoneTable.phoneTableData = res.data.result.phonelist
                    this.loading = false
                    console.log(this.phoneTable.totalNum)
                    return res.data.result
                } catch (error) {
                    this.$message.error('加载失败')
                }
            },
            async getSearchClassify() {
                try {
                    const result = await phoneListAPI.getSearchClassify()
                    if (result.returnCode == '000000') {
                        this.searchObj = result.result
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
                let reqObj={
                    param:val
                }
                try {
                    const result = await phoneListAPI.createPhone(reqObj)
                    if (result.returnCode == '000000') {
                        this.$message({
                            message: '添加成功',
                            type: 'success',
                            onClose: () => {
                                this.addDeviceObj.addVisible = false    
                                this.initPhonelist()
                            }
                        })
                    } else {
                        this.$message.error('添加失败')
                    }
                } catch (err) {
                    this.$message.error('添加失败')
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
                        name: val.name,
                        img: val.img,
                        platform: val.platform,
                        brand: val.brand,
                        imei: val.imei,
                        system: val.system,
                        describe: val.describe,
                        quality: val.quality,
                        question: val.question
                    }
                }
                try {
                    const result = await phoneListAPI.updatePhone(reqObj)
                    if (result.returnCode == '000000') {
                        this.$message({
                            message: '修改成功',
                            type: 'success',
                            onClose: () => {
                                this.addDeviceObj.addVisible = false
                                this.initPhonelist()
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
            PhoneTable,
            AddDevice
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
    @import "../../common/less/mixin.less";
</style>