<template>
    <div class="slide">
        <el-aside width="250px">
            <el-menu :default-active="$route.path" router background-color="#09192A" text-color="#bfcbd9" active-text-color="#409EFF"
                @select="handleSelect">
                <template v-for="(item,index) in navList">
                    <el-submenu :index="index+''" v-if="item.leaf">
                        <template slot="title">
                            <i :class="item.iconCls"></i>
                            <span slot="title">{{item.name}}</span>
                        </template>
                        <el-menu-item v-for="term in item.children" :key="term.path" :index="term.path" v-if="term.menuShow" :class="$route.path===term.path?'is-active':''">
                            <i :class="term.iconCls"></i>
                            <span slot="title">{{term.name}}</span>
                        </el-menu-item>
                    </el-submenu>
                </template>
            </el-menu>
        </el-aside>
    </div>
</template>
<script>
    export default {
        name: 'slide',
        beforeCreate() {
            this.role = sessionStorage.getItem('role')
        },
        created() {
            this.defaultActiveIndex = this.$route.path
        },
        data() {
            return {
                role: '',
                defaultActiveIndex: '/main/deviceView',
                navList: [
                    {
                        name: '测试机管理',
                        leaf: true, // 只有一个节点
                        menuShow: true,
                        iconCls: 'el-icon-mobile-phone', // 图标样式class
                        children: [
                            { path: '/main/deviceView', name: '测试机查询', menuShow: true },
                            { path: '/main/devicemanage', name: '测试机管理', menuShow: (this.role == '管理员' || this.role == '超级管理员') },
                            { path: '/main/ewm', name: '二维码导出', menuShow: (this.role == '管理员' || this.role == '超级管理员') }
                        ]
                    },
                    {
                        name: 'SIM卡管理',
                        leaf: true, // 只有一个节点,这里可以通过判断语句来实现
                        menuShow: true,
                        iconCls: 'el-icon-menu', // 图标样式class
                        children: [
                            { path: '/main/SIMView', name: 'SIM卡查询', menuShow: true },
                            { path: '/main/SIMManage', name: 'SIM卡管理', menuShow: (this.role == '管理员' || this.role == '超级管理员') }
                        ]
                    },
                    {
                        name: '耳机管理',
                        leaf: true, // 只有一个节点
                        menuShow: true,
                        iconCls: 'el-icon-service', // 图标样式class
                        children: [
                            { path: '/main/headsetView', name: '耳机查询', menuShow: true },
                            { path: '/main/headsetManage', name: '耳机管理', menuShow: (this.role == '管理员' || this.role == '超级管理员') }
                        ]
                    },
                    {
                        name: '书籍管理',
                        leaf: true, // 只有一个节点
                        menuShow: true,
                        iconCls: 'el-icon-tickets', // 图标样式class
                        children: [
                            { path: '/main/bookView', name: '书籍查询', menuShow: true },
                            { path: '/main/bookManage', name: '书籍管理', menuShow: (this.role == '管理员' || this.role == '超级管理员') }
                        ]
                    },
                    {
                        name: '用户管理',
                        leaf: this.role == '超级管理员', // 只有一个节点
                        menuShow: true,
                        iconCls: 'el-icon-setting', // 图标样式class
                        children: [
                            { path: '/main/user', name: '用户管理', menuShow: (this.role == '超级管理员') }
                        ]
                    }
                ]
            }
        },
        methods: {
            handleSelect(index) {
                this.defaultActiveIndex = index;
            }
        }
    }
</script>
<style scoped lang="less">
    @import "../../common/less/mixin.less";
    .el-aside {
        background: #09192A;
    }
</style>