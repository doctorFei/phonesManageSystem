<template>
    <div class="addUser">
        <el-dialog :title="title" :visible.sync="dialogFormVisible" @closed="close">
            <el-form :model="addUserform" :rules="rules" :label-width="formLabelWidth" ref="addUserform">
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="addUserform.name" placeholder="请填写姓名" style="width: 400px;"></el-input>
                </el-form-item>
                <el-form-item label="域账号" prop="account">
                    <el-input v-model="addUserform.account" placeholder="请填写域账号" style="width: 400px;"></el-input>
                </el-form-item>
                <el-form-item label="组织" prop="organization">
                    <el-input v-model="addUserform.organization.name" placeholder="请填写组织" style="width: 400px;"></el-input>
                </el-form-item>
                <el-form-item label="角色" prop="role">
                    <el-select v-model="addUserform.role" placeholder="请选择角色" style="width: 400px;">
                        <el-option label="超级管理员" value="超级管理员"></el-option>
                        <el-option label="管理员" value="管理员"></el-option>
                        <el-option label="普通用户" value="普通用户"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-show="status==='add'" @click="submitForm('addUserform')">立即添加</el-button>
                    <el-button type="primary" v-show="status!=='add'" @click="submitForm('addUserform')">立即修改</el-button>
                    <!-- <el-button @click="resetForm('addUserform')">重置</el-button> -->
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'addUser',
        props: {
            status: {
                type: String,
                default: 'none'
            },
            addUserVisible: {
                type: Boolean,
                default: false
            },
            userform: {
                type: Object,
                default: function () {
                    return {
                        id: 0,
                        name: '',
                        account: '',
                        organization: {},
                        role: ''
                    }
                }
            }
        },
        data() {
            return {
                title: '',
                formLabelWidth: '120px',
                dialogFormVisible: false,
                addUserform: {
                    organization:{
                        name:'暂无'
                    }
                },
                rules: {
                    name: [
                        { required: true, message: '请填写姓名', trigger: 'blur' },
                    ],
                    account: [
                        { required: true, message: '请填写域账号', trigger: 'blur' }
                    ],
                    organization: [
                        { required: true, message: '请填写组织', trigger: 'blur' },
                    ],
                    role: [
                        { required: true, message: '请选择角色', trigger: 'change' }
                    ],
                }
            }
        },
        methods: {
            close() {
                this.addUserform = {}
                this.addUserform.organization={}
                this.addUserform.organization.name=''
                this.$emit('addDialogClose', false)
                this.$refs["addUserform"].resetFields();
                console.log('close')
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.status == 'add') {
                            console.log(this.addUserform)
                            this.$emit('addResult', this.addUserform)
                        }
                        if (this.status == 'modify') {
                            console.log(this.addUserform)
                            this.$emit('modifyResult', this.addUserform)
                        }
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetForm(formName) {
                // this.$refs[formName].resetFields();
                this.addUserform = {}
                this.addUserform.organization={}
                this.addUserform.organization.name=''
            }
        },
        watch: {
            addUserVisible(val) {
                this.dialogFormVisible = val
                if(!this.dialogFormVisible){
                    this.addUserform.organization={}
                    this.$refs["addUserform"].resetFields()
                }
            },
            status(val) {
                if (val == 'modify') {
                    this.title = "修改用户"
                } else {
                    this.title = "添加用户"
                }
            },
            userform: {
                handler() {
                    this.addUserform = this.userform
                    if (!this.userform.organization) {
                        this.addUserform.organization={}
                        this.addUserform.organization.name=''
                    } 
                    console.log(this.addUserform)                    
                },
                deep: true
            }
        }
    }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
    @import "../../common/less/mixin.less";
</style>