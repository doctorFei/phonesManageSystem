<template>
    <div class="bookSearch">
        <el-form :inline="true" :model="searchModel" ref="searchModel" class="demo-form-inline">
            <el-form-item label="品牌" prop="brand">
                <el-autocomplete popper-class="my-autocomplete" v-model="brandSearch" :fetch-suggestions="querySearch" placeholder="书名">
                    <i class="el-icon-edit el-input__icon" slot="suffix" @click="handleIconClick">
                    </i>
                    <template slot-scope="{ item }">
                        <div class="name">{{ item.value }}</div>
                    </template>
                </el-autocomplete>
            </el-form-item>
            <el-form-item label="SN号" prop="SN">
                <el-autocomplete popper-class="my-autocomplete" v-model="SNSearch" :fetch-suggestions="querySearchSN" placeholder="书名">
                    <i class="el-icon-edit el-input__icon" slot="suffix" @click="handleIconClick">
                    </i>
                    <template slot-scope="{ item }">
                        <div class="name">{{ item.value }}</div>
                    </template>
                </el-autocomplete>
            </el-form-item>
            <el-form-item label="签借人" prop="user">
                <el-autocomplete popper-class="my-autocomplete" v-model="userSearch" :fetch-suggestions="querySearchUser" placeholder="签借人">
                    <i class="el-icon-edit el-input__icon" slot="suffix" @click="handleIconClick">
                    </i>
                    <template slot-scope="{ item }">
                        <div class="name">{{ item.value }}</div>
                    </template>
                </el-autocomplete>
            </el-form-item>
            <el-form-item label="状态" prop="borrowstatus">
                <el-select v-model="searchModel.borrowstatus" placeholder="状态">
                    <el-option label="已申领" value="已申领"></el-option>
                    <el-option label="未申领" value="未申领"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit('searchModel')">查询</el-button>
                <el-button type="primary" @click="resetForm('searchModel')">重置</el-button>
                <el-button type="primary" v-if="ismanager" @click="addDevice()">添加设备</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: 'bookSearch',
        props: {
            brand: {
                type: Array,
                default: function () {
                    return []
                }
            },
            SN: {
                type: Array,
                default: function () {
                    return []
                }
            },
            user: {
                type: Array,
                default: function () {
                    return []
                }
            },
            ismanager: {
                type: Boolean,
                default: function () {
                    return false
                }
            }
        },
        data() {
            return {
                brandLists:[],
                brandSearch: '',
                SNLists:[],
                SNSearch: '',
                userLists: [],
                userSearch: '',
                searchModel: {
                    brand: '',
                    SN: '',
                    borrowstatus:'',
                    user: ''
                }
            }
        },
        methods: {
            onSubmit(formName) {
                this.searchModel.brand = this.brandSearch
                this.searchModel.SN = this.SNSearch
                this.$emit('search', this.searchModel)
            },
            addDevice() {
                this.$emit('addDevice', '')
            },
            resetForm(formName) {
                this.brandSearch = ''
                this.SNSearch = ''
                this.userSearch = ''
                this.$refs[formName].resetFields();
            },
            querySearch(queryString, cb) {
                var brandLists = this.brandLists;
                var results = queryString ? brandLists.filter(this.createFilter(queryString)) : brandLists;
                // 调用 callback 返回建议列表的数据
                cb(results);
            },
            querySearchSN(queryString, cb) {
                var SNLists = this.SNLists;
                var results = queryString ? SNLists.filter(this.createFilter(queryString)) : SNLists;
                // 调用 callback 返回建议列表的数据
                cb(results);
            },
            querySearchUser(queryString, cb) {
                var userLists = this.userLists;
                var results = queryString ? userLists.filter(this.createFilter(queryString)) : userLists;
                // 调用 callback 返回建议列表的数据
                cb(results);
            },
            createFilter(queryString) {
                return (list) => {
                    return (list.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                };
            },
            handleIconClick(ev) {
                console.log(ev);
            }
        },
        watch: {
            brand: {
                handler(newValue, oldValue) {
                    let numberArr = newValue
                    let brandLists = []
                    for (let i = 0; i < numberArr.length; i++) {
                        brandLists.push({ value: numberArr[i] })
                    }
                    this.brandLists = brandLists
                },
                // 代表在wacth里声明了firstName这个方法之后立即先去执行handler方法
                immediate: true
            },
            SN: {
                handler(newValue, oldValue) {
                    let SNArr = newValue
                    let SNLists = []
                    for (let i = 0; i < SNArr.length; i++) {
                        SNLists.push({ value: SNArr[i] })
                    }
                    this.SNLists = SNLists
                },
                // 代表在wacth里声明了firstName这个方法之后立即先去执行handler方法
                immediate: true
            },
            user: {
                handler(newName, oldName) {
                    let userArr = newName
                    let userSearch = []
                    for (let i = 0; i < userArr.length; i++) {
                        userSearch.push({ value: userArr[i] })
                    }
                    this.userLists = userSearch
                },
                // 代表在wacth里声明了firstName这个方法之后立即先去执行handler方法
                immediate: true
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
    @import "../../common/less/mixin.less";
    .bookSearch {
        background: #EFEEFF;
        padding: 24px 20px 0 20px;
    }
</style>