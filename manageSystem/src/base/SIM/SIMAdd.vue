<template>
    <div class="addDevice" style="padding: 20px 0 0 40px">
        <el-dialog :title="title" :visible.sync="dialogFormVisible" width="800px" @closed="close">
            <el-form :inline="true" :model="formData" :rules="rules" ref="formData" label-width="100px" class="demo-ruleForm" style="width: 700px;">
                <el-form-item label="卡号" prop="number" style="width: 300px;">
                    <el-input v-model="formData.number"></el-input>
                </el-form-item>

                <el-form-item label="IMSI" prop="IMSI" style="width: 300px;">
                    <el-input v-model="formData.IMSI"></el-input>
                </el-form-item>
                <el-form-item label="套餐类型" prop="type" style="width: 300px;">
                    <el-input v-model="formData.type"></el-input>
                </el-form-item>
                <el-form-item label="尺寸" prop="size" style="width: 300px;">
                    <el-select v-model="formData.size" placeholder="尺寸">
                        <el-option label="标准卡" value="标准卡"></el-option>
                        <el-option label="micro" value="micro"></el-option>
                        <el-option label="nano" value="nano"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="运营商" prop="operator" style="width: 300px;">
                    <el-select v-model="formData.operator" placeholder="运营商">
                        <el-option label="中国移动" value="中国移动"></el-option>
                        <el-option label="中国联通" value="中国联通"></el-option>
                        <el-option label="中国电信" value="中国电信"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注" prop="remark" style="width: 700px;">
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
                    number: [
                        { required: true, message: '请输入卡号' },
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