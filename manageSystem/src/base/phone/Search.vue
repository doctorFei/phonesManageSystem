<template>
    <div class="search">
        <el-form :inline="true" :model="searchModel" ref="searchModel" class="demo-form-inline">
            <el-form-item label="设备名" prop="name">
                <el-autocomplete popper-class="my-autocomplete" v-model="nameSearch" :fetch-suggestions="querySearch" placeholder="设备名">
                    <i class="el-icon-edit el-input__icon" slot="suffix" @click="handleIconClick">
                    </i>
                    <template slot-scope="{ item }">
                        <div class="name">{{ item.value }}</div>
                    </template>
                </el-autocomplete>
            </el-form-item>

            <el-form-item label="平台" prop="platform">
                <el-select v-model="searchModel.platform" placeholder="平台">
                    <el-option label="Android" value="Android"></el-option>
                    <el-option label="IOS" value="IOS"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="品牌" prop="brand">
                <el-select v-model="searchModel.brand" placeholder="品牌">
                    <span v-for="item in brand">
                        <el-option :label="item" :value="item"></el-option>
                    </span>
                </el-select>
            </el-form-item>
            <el-form-item label="系统版本" prop="system">
                <el-select v-model="searchModel.system" placeholder="系统版本">
                    <span v-for="item in system">
                        <el-option :label="item" :value="item"></el-option>
                    </span>
                </el-select>
            </el-form-item>
            <el-form-item label="状态" prop="borrowstatus">
                <el-select v-model="searchModel.borrowstatus" placeholder="状态">
                    <el-option label="已申领" value="已申领"></el-option>
                    <el-option label="未申领" value="未申领"></el-option>
                </el-select>
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
        name: 'search',
        props: {
            name: {
                type: Array,
                default: function () {
                    return []
                }
            },
            brand: {
                type: Array,
                default: function () {
                    return []
                }
            },
            system: {
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
                searchModel: {
                    name: '',
                    platform: '',
                    brand: '',
                    system: '',
                    borrowstatus: '',
                    user: ''
                },
                nameLists: [],
                userLists: [],
                nameSearch: '',
                userSearch: ''
            }
        },
        methods: {
            onSubmit(formName) {
                this.searchModel.name = this.nameSearch
                this.searchModel.user = this.userSearch
                this.$emit('search', this.searchModel)
            },
            addDevice() {
                this.$emit('addDevice', '')
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.nameSearch = ''
                this.userSearch = ''
            },
            querySearch(queryString, cb) {
                var nameLists = this.nameLists;
                var results = queryString ? nameLists.filter(this.createFilter(queryString)) : nameLists;
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
                return (userList) => {
                    return (userList.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                };
            },
            handleIconClick(ev) {
                console.log(ev);
            }
        },
        watch: {
            name: {
                handler(newName, oldName) {
                    let nameArr = newName
                    let nameSearch = []
                    for (let i = 0; i < nameArr.length; i++) {
                        nameSearch.push({ value: nameArr[i] })
                    }
                    this.nameLists = nameSearch
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
    .search {
        background: #EFEEFF;
        padding: 24px 20px 0 20px;
    }

    .my-autocomplete {
        li {
            line-height: normal;
            padding: 7px;

            .name {
                text-overflow: ellipsis;
                overflow: hidden;
            }
            .addr {
                font-size: 12px;
                color: #b4b4b4;
            }

            .highlighted .addr {
                color: #ddd;
            }
        }
    }
</style>