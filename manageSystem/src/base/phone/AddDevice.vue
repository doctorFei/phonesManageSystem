<template>
    <div class="addDevice" style="padding: 20px 0 0 40px">
        <el-dialog :title="title" :visible.sync="dialogFormVisible" width="800px" @closed="close">
            <el-form :inline="true" :model="formData" :rules="rules" ref="formData" label-width="100px" class="demo-ruleForm" style="width: 700px;">
                <el-form-item label="设备名" prop="name" style="width: 300px;">
                    <el-input v-model="formData.name"></el-input>
                </el-form-item>
                <el-form-item label="平台" prop="platform" style="width: 300px;" ref="platformData">
                    <el-select v-model="formData.platform" placeholder="请选择手机平台">
                        <el-option label="Android" value="Android"></el-option>
                        <el-option label="IOS" value="IOS"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="品牌" prop="brand" style="width: 300px;">
                    <el-input v-model="formData.brand"></el-input>
                </el-form-item>
                <el-form-item label="imei" prop="imei" style="width: 300px;">
                    <el-input v-model="formData.imei" style="width: 200px;"></el-input>
                </el-form-item>
                <el-form-item label="系统版本" prop="system" style="width: 300px;">
                    <el-input v-model="formData.system"></el-input>
                </el-form-item>
                <el-form-item label="手机质量" prop="quality" style="width: 300px;">
                    <el-select v-model="formData.quality" placeholder="请选择手机质量">
                        <el-option label="正常" value="正常"></el-option>
                        <el-option label="损坏" value="损坏"></el-option>
                        <el-option label="报废" value="报废"></el-option>
                        <el-option label="丢失" value="丢失"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="手机描述" prop="describe" style="width: 700px;">
                    <el-input type="textarea" v-model="formData.describe" style="width: 515px;"></el-input>
                </el-form-item>
                <el-form-item label="问题记录" prop="question" style="width: 700px;">
                    <el-input type="textarea" v-model="formData.question" style="width: 515px;"></el-input>
                </el-form-item>
                <el-form-item label="上传图片" prop="desc">
                    <el-upload ref="uploadImg" action="/phoneManageSystem/upload/uploadImg" list-type="picture-card" :headers="personal.headers" :multiple=false
                        :limit="1" :on-success="handleSuccess" :on-error="handleError" :on-preview="handlePictureCardPreview"
                        :on-remove="handleRemove">
                        <i class="el-icon-plus"></i>
                    </el-upload>
                    <el-dialog :visible.sync="dialogVisible">
                        <img width="100%" :src="dialogImageUrl" alt="">
                    </el-dialog>
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
                dialogImageUrl: '',
                dialogVisible: false,
                dialogFormVisible: false,
                personal: {
                    headers: {
                        enctype: "multipart/form-data"
                    }
                },
                formData: {},
                rules: {
                    name: [
                        { required: true, message: '请输入活动名称' },
                    ],
                    platform: [
                        { required: true, message: '请选择手机平台' }
                    ]
                }
            };
        },
        methods: {
            handleSuccess(response, file, fileList) {
                console.log('handleSuccess')
                this.dialogImageUrl = 'http://' + location.host + '/phoneManageSystem/' + file.response.filename
            },
            handleError(err, file, fileList) {
                console.log('handleError')
            },
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePictureCardPreview(file) {
                this.dialogVisible = true
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.status == 'add') {
                            this.formData.img = this.dialogImageUrl
                            this.$emit('addResult', this.formData)
                            console.log(this.formData)
                        }
                        if (this.status == 'modify') {
                            this.formData.img = this.dialogImageUrl
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
                this.$refs["uploadImg"].clearFiles()
            },
            close() {
                this.formData = {}
                this.dialogImageUrl = ''
                this.$refs["formData"].resetFields()
                this.$refs["uploadImg"].clearFiles()
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
                    this.dialogImageUrl = ''
                    this.$refs["formData"].resetFields()
                    this.$refs["uploadImg"].clearFiles()
                }
            },
            ruleForm: {
                handler() {
                    this.formData = {}
                    this.dialogImageUrl = ''
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