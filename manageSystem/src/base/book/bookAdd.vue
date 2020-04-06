<template>
    <div class="addDevice" style="padding: 20px 0 0 40px">
        <el-dialog :title="title" :visible.sync="dialogFormVisible" width="800px" @closed="close">
            <el-form :inline="true" :model="formData" :rules="rules" ref="formData" label-width="100px" class="demo-ruleForm" style="width: 700px;">
                <el-form-item label="书名" prop="bookname" style="width: 300px;">
                    <el-input v-model="formData.bookname"></el-input>
                </el-form-item>

                <el-form-item label="作者" prop="author" style="width: 300px;">
                    <el-input v-model="formData.author"></el-input>
                </el-form-item>
                <el-form-item label="出版社" prop="publish" style="width: 300px;">
                    <el-input v-model="formData.publish"></el-input>
                </el-form-item>
                <el-form-item label="简介" prop="remark" style="width: 700px;">
                    <el-input type="textarea" v-model="formData.remark" style="width: 515px;"></el-input>
                </el-form-item>
                <div style="padding-left: 30px;text-align: center;">
                    <el-form-item>
                        <el-button type="primary" v-show="status==='add'" @click="submitForm('formData')">立即添加</el-button>
                        <el-button type="primary" v-show="status!=='add'" @click="submitForm('formData')">立即修改</el-button>
                        <!-- <el-button @click="resetForm('formData')">重置</el-button> -->
                    </el-form-item>
                </div>

            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "addDevice",
        props: {
            status: {
                type: String,
                default: 'none'
            },
            addVisible: {
                type: Boolean,
                default: false
            },
            ruleForm: {
                type: Object,
                default: function () {
                    return {
                    }
                }
            }
        },
        data() {
            return {
                title: '',
                dialogFormVisible: false,
                formData: {},
                rules: {
                    bookname: [
                        { required: true, message: '请输入书名' },
                    ]
                }
            };
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.status == 'add') {
                            console.log(this.formData)                            
                            this.$emit('addResult', this.formData)
                        }
                        if (this.status == 'modify') {
                            console.log(this.formData)
                            this.$emit('modifyResult', this.formData)
                        }
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.formData = {}
                this.dialogImageUrl = ''
                this.$refs["formData"].resetFields()
            },
            close() {
                this.formData = {}
                this.dialogImageUrl = ''
                this.$refs["formData"].resetFields()
                this.$emit('addclose', false)
            }
        },
        watch: {
            status(val) {
                if (val == 'modify') {
                    this.title = "修改设备"
                } else {
                    this.title = "添加设备"
                }
            },
            addVisible(val) {
                this.dialogFormVisible = val
                if (!this.dialogFormVisible) {
                    this.formData = {}
                    this.$refs["formData"].resetFields()
                }
            },
            ruleForm: {
                handler() {
                    this.formData = {}
                    this.formData = this.ruleForm
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