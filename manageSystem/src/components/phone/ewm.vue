<template>
    <div class="ewm clearfix" v-loading="loading" element-loading-text="正在加载二维码">
        <div class="box" ref="printMe" v-show="canvasShow">
            <li class="ewmTable" v-for="item in ewmArr">
                <p>机型：{{item.name}}</p>
                <p>系统版本：{{item.eystem}}</p>
                <img src="" alt="" style="width: 200px; height: 200px;">
                <div style="display:none">
                    <qriously :value="item.value" :size="size" />
                </div>
            </li>
        </div>
        <div class="clone clearfix"></div>
        <a class="dl" href="">导出二维码</a>
    </div>
</template>

<script>
    import phoneListAPI from '@/common/api/phonelist'
    import html2canvas from 'html2canvas';
    export default {
        async created() {
            let setList = await this.searchSIMPage()
        },
        mounted() {

        },
        data() {
            return {
                loading:true,
                canvasShow: false,
                ewmArr: [
                ],
                size: 200
            }
        },
        methods: {
            //获取所有手机
            async searchSIMPage() {
                let obj = {
                    searchCondition: {}
                }
                let arr = []
                try {
                    let res = await phoneListAPI.searchPhoneListAll(obj) // 将信息发送给后端
                    res = res.result.phonelist
                    for (let i = 0; i < res.length; i++) {
                        let obj = {
                            value: 'http://xz.voicecloud.cn/activity/wxBorrow/main.html?phoneID=' + res[i].id,
                            name: res[i].name,
                            eystem: res[i].system
                        }
                        arr.push(obj)
                    }
                    this.ewmArr = arr
                    setTimeout(() => {
                        $('.box .ewmTable canvas').each((index, domEle) => {
                            var canvasDate = domEle.toDataURL();
                            $(domEle).parent().parent().siblings('img').attr('src', canvasDate);
                            this.ewmArr[index]['img'] = canvasDate
                            $(domEle).remove()
                        })
                        this.$nextTick(() => {
                            let html = ''
                            for (let i = 0; i < this.ewmArr.length; i++) {
                                html += `
                                    <li class="ewmClone">
                                        <p>机型：${this.ewmArr[i].name}</p>
                                        <p>系统版本：${this.ewmArr[i].system}</p>
                                        <img src="${this.ewmArr[i].img}" alt="" style="width: 200px; height: 200px;">
                                    </li>
                                `
                            }
                            $('.clone').html(html)
                            $('.ewmClone').css({ 'float': 'left', "margin-right": '10px', "margin-bottom": "10px" })
                            this.loading=false
                            this.htmlCanvasFn('.clone')
                        })
                    }, 1000)
                    return res
                } catch (error) {

                }
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
            download() {
                this.canvasShow = false
                $('.box .ewmTable canvas').each((index, domEle) => {
                    var canvasDate = domEle.toDataURL();
                    $(domEle).parent().parent().siblings('img').attr('src', canvasDate);
                    this.ewmArr[index]['img'] = canvasDate
                    $(domEle).remove()
                })
                this.$nextTick(() => {
                    console.log('v-for渲染已经完成')
                    console.log(this.ewmArr)
                    let html = ''
                    for (let i = 0; i < this.ewmArr.length; i++) {
                        html += `
                        <li class="ewmClone">
                            <p>机型：${this.ewmArr[i].name}</p>
                            <p>系统版本：${this.ewmArr[i].system}</p>
                            <img src="${this.ewmArr[i].img}" alt="" style="width: 200px; height: 200px;">
                        </li>
                        `
                    }
                    $('.clone').html(html)
                    $('.ewmClone').css({ 'float': 'left', "margin-right": '10px', "margin-bottom": "10px" })
                    this.htmlCanvasFn('.clone')
                })
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
    @import "../../common/less/mixin.less";
    .clearfix::before,
    .clearfix::after {
        content: '';
        height: 0;
        line-height: 0;
        display: block;
        visibility: hidden;
        clear: both;
    }
    .dl{
        position: absolute;
        right: 40px;
        top: 70px;
    }
    .ewmTable,
    .ewmClone {
        float: left;
        margin-right: 10px;
        margin-bottom: 5px;
    }
</style>