import phonelist from '../models/phonelist.js'


const getSearchClassify = async function (ctx) {
    try {
        if (!!ctx.user) {
            const result = await phonelist.getSearchClassify() // 通过await “同步”地返回查询结果
            ctx.body = {
                result: result, // 将请求的结果放到response的body里返回
                returnCode: '000000',
                returnMsg: "成功"
            }
        } else {
            ctx.body = {
                returnCode: '000005',
                success: false,
                message: 'token认证失败'
            }
        }
    }
    catch (err) {
        ctx.body = {
            success: false,
            message: err
        }
    }
}

const searchPhonelistAllNum =async function (ctx) {
    const data = ctx.request.body
    try {
        if (!!ctx.user) {
            const allList = await phonelist.searchPhonelistAllNum(data)
            ctx.body = {
                result: {
                    phonelist: allList
                },
                returnCode: '000000',
                returnMsg: "成功"
            }
        } else {
            ctx.body = {
                returnCode: '000005',
                success: false,
                message: 'token认证失败'
            }
        }
    } catch (err) {
        ctx.body = {
            returnCode: '000001',
            message: '服务端错误'
        }
    }
}

const searchPhonelist = async function (ctx) {
    const data = ctx.request.body
    try {
        if (!!ctx.user) {
            const allList = await phonelist.searchPhonelistAllNum(data)
            const result = await phonelist.searchPhonelistPage(data)
            ctx.body = {
                result: {
                    phonelist: result,
                    totalNum: allList.length
                },
                returnCode: '000000',
                returnMsg: "成功"
            }
        } else {
            ctx.body = {
                returnCode: '000005',
                success: false,
                message: 'token认证失败'
            }
        }
    } catch (err) {
        ctx.body = {
            returnCode: '000001',
            message: '服务端错误'
        }
    }
}
const deletePhone = async function (ctx) {
    const id = ctx.request.body.id
    try {
        if (!!ctx.user && ctx.user.role == '超级管理员' || ctx.user.role == '管理员') {
            const result = await phonelist.deletePhone(id)
            ctx.body = {
                returnCode: "000000",
                returnMsg: "成功"
            }
        } else {
            ctx.body = {
                returnCode: '000005',
                success: false,
                message: 'token认证失败'
            }
        }
    } catch (error) {
        ctx.body = {
            returnCode: "000001",
            returnMsg: error
        }
    }
}

const searchPhoneById = async function (ctx) {
    const id = ctx.request.body.id
    try {
        if (!!ctx.user) {
            const result = await phonelist.searchPhoneById(id)
            ctx.body = result
        } else {
            ctx.body = {
                returnCode: '000005',
                success: false,
                message: 'token认证失败'
            }
        }
    } catch (error) {
        ctx.body = {
            returnCode: "000001",
            returnMsg: error
        }
    }
}

const operatePhone = async function (ctx) {
    const data = ctx.request.body
    if (!!ctx.user && ctx.user.role !='游客') {
        if (!!data.id) {
            const result = await phonelist.updatePhone(data) // 通过await “同步”地返回查询结果
            ctx.body = result
        } else {
            const result = await phonelist.createPhone(data)
            ctx.body = result
        }
    } else {
        ctx.body = {
            returnCode: '000005',
            success: false,
            message: 'token认证失败'
        }
    }
}

export default {
    getSearchClassify,
    operatePhone,
    searchPhonelist,
    deletePhone,
    searchPhoneById,
    searchPhonelistAllNum
}
