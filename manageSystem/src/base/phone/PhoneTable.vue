<template>
    <div class="phoneTable">
        <el-table :data="phoneTableData" stripe header-row-class-name="tableHeader" empty-text="暂时没有数据" border style="width: 100%">
            <el-table-column prop="name" label="设备名" align="center" width="100">
            </el-table-column>
            <el-table-column prop="platform" label="平台" align="center" width="100">
            </el-table-column>
            <el-table-column prop="brand" label="品牌" align="center" width="100">
            </el-table-column>
            <el-table-column prop="system" label="系统版本" align="center" width="100">
            </el-table-column>
            <el-table-column prop="imei" label="imei" align="center" width="100">
            </el-table-column>
            <el-table-column prop="borrowstatus" label="状态" align="center" width="100">
            </el-table-column>
            <el-table-column prop="usertest.name" label="签借人" align="center" width="100">
            </el-table-column>
            <el-table-column label="操作" align="center" min-width="320">
                <template slot-scope="scope">
                    <el-button size="small" type="info" @click="toDetail(scope.row)">详情</el-button>
                    <el-button size="small" v-show="scope.row.borrowstatus!='已申领'" type="primary" @click="receive(scope.row['id'],scope.row['name'])">申领</el-button>
                    <el-button size="small" v-if="ismanager" type="success" @click="modify(scope.row)">修改</el-button>
                    <el-button size="small" v-if="ismanager" type="danger" @click="deleteDate(scope.row['id'])">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div align="center" style="margin: 30px 0">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="pageSizes"
                :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalNum">
            </el-pagination>
        </div>
        <el-dialog title="设备详情" :visible.sync="detailVisible" width="70%">
            <phone-detail :gridtable="phonedetail"></phone-detail>
        </el-dialog>
        <el-dialog title="使用微信扫描二维码申领" :visible.sync="ewm.ewmShow" width="30%" style="text-align: center;">
            <div class="ewmBox" style="display: name">
                <p>{{ewmTitle}}</p>
                <img :src="ewmImg" alt="" style="width: 200px; height: 200px;">
                <div style="display: none">
                    <qriously :value="ewm.value" :size="ewm.size" />
                </div>
            </div>
            <a class="dl" href="">导出二维码</a>            
        </el-dialog>
    </div>
</template>

<script>
    import PhoneDetail from '@/base/phone/PhoneDetail'
    import html2canvas from 'html2canvas'
    export default {
        name: 'phoneTable',
        props: {
            ismanager: {
                type: Boolean,
                default: false
            },
            phoneTableData: {
                type: Array,
                default: function () {
                    return []
                }
            },
            currentPage: {
                type: Number,
                default: function () {
                    return 1
                }
            },
            pageSizes: {
                type: Array,
                default: function () {
                    return [10, 20, 50, 100]
                }
            },
            pageSize: {
                type: Number,
                default: function () {
                    return 10
                }
            },
            totalNum: {
                type: Number,
                default: function () {
                    return 100
                }
            }
        },
        data() {
            return {
                detailVisible: false,
                phonedetail: {},
                ewmTitle: '',
                ewmImg: '',
                ewm: {
                    ewmShow: false,
                    value: 'http://xz.voicecloud.cn/activity/wxBorrow/main.html?phoneID=',
                    size: 200
                },
            }
        },
        methods: {
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.$emit('pageSizeFn', val)
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.$emit('currentPageFn', val)
            },
            receive(id,name) {
                this.ewm.value = 'http://xz.voicecloud.cn/activity/wxBorrow/main.html?phoneID=' + id
                this.ewm.ewmShow = true
                this.ewmTitle=name
                setTimeout(() => {
                    var domEle = $('.ewmBox canvas').get(0)
                    var canvasDate = domEle.toDataURL();
                    $(domEle).parent().parent().siblings('img').attr('src', canvasDate);
                    this.ewmImg = canvasDate
                    $(domEle).remove()
                    this.htmlCanvasFn('.ewmBox')
                }, 20)
            },
            toDetail(row) {
                this.detailVisible = true
                this.phonedetail = row
            },
            deleteDate(id) {
                this.$emit('deleteDate', id)
            },
            modify(row) {
                console.log('点击了修改')
                this.$emit('modify', row)
            },
            _fixType(type) {
                type = type.toLowerCase().replace(/jpg/i, 'jpeg');
                var r = type.match(/png|jpeg|bmp|gif/)[0];
                return 'image/' + r;
            },
            async htmlCanvasFn(ele) {
                let _this = this
                html2canvas(document.querySelector(ele), { useCORS: true, async: true }).then(function (canvas) {
                    var type = 'png';
                    var imgData = canvas.toDataURL(type);
                    imgData = imgData.replace(_this._fixType(type), 'image/octet-stream');
                    $('.dl').attr({
                        'href': imgData,
                        'download': '二维码下载.png'
                    });
                });
            },
        },
        components: {
            PhoneDetail
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
    @import "../../common/less/mixin.less";
</style>