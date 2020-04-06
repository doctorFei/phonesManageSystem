<template>
    <div class="user" v-loading="loading">
        <div class="search">
            <el-form :inline="true" :model="UserSearch" ref="UserSearch" class="demo-form-inline">
                <el-form-item label="组织" prop="organization">
                    <el-select v-model="UserSearch.organization" placeholder="组织名称">
                        <span v-for="item in organizationList">
                            <el-option :label="item" :value="item"></el-option>
                        </span>
                    </el-select>
                </el-form-item>
                <el-form-item label="角色" prop="role">
                    <el-select v-model="UserSearch.role" placeholder="角色">
                        <el-option label="超级管理员" value="超级管理员"></el-option>
                        <el-option label="管理员" value="管理员"></el-option>
                        <el-option label="普通用户" value="普通用户"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="searchUser('UserSearch')">查询</el-button>
                    <el-button type="primary" @click="resetForm('UserSearch')">重置</el-button>
                    <el-button type="primary" @click="addUser">添加用户</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-table :data="UserData" stripe style="width: 100%">
            <el-table-column prop="name" label="姓名" align="center" width="180">
            </el-table-column>
            <el-table-column prop="account" label="域账号" align="center" width="180">
            </el-table-column>
            <el-table-column prop="organization.name" label="组织" align="center" width="180">
            </el-table-column>
            <el-table-column prop="role" align="center" label="角色" width="180">
            </el-table-column>
            <el-table-column label="操作" align="center" min-width="320">
                <template slot-scope="scope">
                    <el-button size="small" type="success" @click="modify(scope.row)">修改</el-button>
                    <el-button size="small" type="danger" @click="deleteDate(scope.row['id'])">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <add-user :addUserVisible="addUserVisible" :userform="addUserform" :status="status" @addDialogClose="addDialogClose" @addResult="addResult"
            @modifyResult="modifyResult"> </add-user>
    </div>
</template>

<script>
    import AddUser from '@/base/user/addUser'
    import userAPI from '@/common/api/user'
    export default {
        name: 'user',
        data() {
            return {
                loading: false,
                organizationList: [],
                UserSearch: {
                    organization: '',
                    role: ''
                },
                UserData: [
                    {
                        id: 1,
                        name: '王小虎',
                        account: 'pfwang2',
                        organization: { name: '123' },
                        role: '超级管理员'
                    }, {
                        id: 2,
                        name: '王小虎',
                        account: 'pfwang2',
                        organization: { name: '123' },
                        role: '超级管理员'
                    }
                ],
                addUserform: {
                    name: '',
                    account: '',
                    organization: '',
                    role: '',
                },
                status: 'none',
                addUserVisible: false
            }
        },
        created() {
            this.getAllUser()
            this.getAllOrganization()
        },
        methods: {
            async getAllOrganization() {
                try {
                    let result = await userAPI.getAllOrganization()
                    for (let i = 0; i < result.result.length; i++) {
                        if (result.result[i].name != '暂无') {
                            this.organizationList.push(result.result[i].name)
                        }
                    }
                } catch (err) {
                    console.log(err)
                }
            },
            async deleteDate(id) {
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    this.loading = true
                    try {
                        let result = await userAPI.deleteDate(id)
                        this.loading = false
                        if (result.returnCode == '000000') {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            })
                            this.getAllUser()
                        } else if (result.returnCode == '000002') {
                            this.$message.error('删除失败,该用户名下有测试机未归还')
                        } else {
                            this.$message.error('删除失败')
                        }
                    } catch (err) {
                        this.$message.error('删除失败')
                    }
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
            },
            async searchUser() {
                console.log(this.UserSearch)
                this.loading = true
                try {
                    const result = await userAPI.searchUserList(this.UserSearch)
                    if (result.returnCode = "000000") {
                        this.UserData = []
                        for (let i = 0; i < result.result.length; i++) {
                            if (result.result[i].name != "暂无") {
                                this.UserData.push(result.result[i])
                            }
                        }
                    } else {
                        this.$message.error('查找失败')
                    }
                } catch (err) {
                    this.$message.error('查找失败')
                }
                this.loading = false
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            addUser() {
                this.status = 'add'
                this.addUserVisible = true
                this.addUserform = {}
            },
            async addResult(val) {
                this.loading = true
                let _this = this
                try {
                    let reqObj = {
                        param: val
                    }
                    const result = await userAPI.operateUSer(reqObj)
                    if (result.returnCode == "000000") {
                        this.$message({
                            message: '添加成功',
                            type: 'success',
                            onClose: function () {
                                _this.getAllUser()
                                _this.addUserVisible = false
                            }
                        });
                    } else if (result.returnCode == "000003") {
                        this.$message.error('不能重复添加');
                    } else {
                        this.$message.error('添加失败');
                    }
                } catch (error) {
                    this.$message.error('添加失败');
                }
                this.loading = false
            },
            addDialogClose(val) {
                this.addUserVisible = false
            },
            modify(val) {
                this.status = 'modify'
                this.addUserVisible = true
                this.addUserform = Object.assign({}, val)
                console.log(this.addUserform)
            },
            async modifyResult(val) {
                this.loading = true
                let _this = this
                let reqObj = {
                    id: val.id,
                    param: {
                        name:val.name,
                        account: val.account,
                        organization: val.organization,
                        role:val.role,
                        wxid:val.wxid
                    }
                }
                try {
                    const result = await userAPI.operateUSer(reqObj)
                    this.$message({
                        message: '修改成功',
                        type: 'success',
                        onClose: function () {
                            _this.getAllUser()
                            _this.addUserVisible = false
                        }
                    });
                } catch (error) {
                    this.$message.error('修改失败');
                }
                this.loading = false
            },
            async getAllUser() {
                this.loading = true
                try {
                    const result = await userAPI.getAllUser()
                    this.UserData = []
                    for (let i = 0; i < result.result.length; i++) {
                        if (result.result[i].name != "暂无") {
                            this.UserData.push(result.result[i])
                        }
                    }
                } catch (error) {
                    console.log(error)
                }
                this.loading = false
            }
        },
        components: {
            AddUser
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
    @import "../../common/less/mixin.less";
    .search {
        background: #EFEEFF;
        padding: 24px 20px 0px 20px;
    }
</style>