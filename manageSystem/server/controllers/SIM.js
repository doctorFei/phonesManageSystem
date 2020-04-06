import SIM from '../models/SIM.js'

const getAllUser = async (ctx) => {
    try {
        if (!!ctx.user) {
            const result = await SIM.getAllUser()
            ctx.body = result
        } else {
            ctx.body = {
                returnCode: '000005',
                success: false,
                message: 'token认证失败'
            }
        }
    } catch (err) {
        ctx.body = {
            success: false,
            message: err
        }
    }

}

const searchSIMPage = async (ctx) => {
    try {
        if (!!ctx.user) {
            const result = await SIM.searchSIMPage(ctx.request.body)
            ctx.body = result
        } else {
            ctx.body = {
                returnCode: '000005',
                success: false,
                message: 'token认证失败'
            }
        }
    } catch (err) {
        ctx.body = {
            success: false,
            message: err
        }
    }

}

const operateSIM = async (ctx) => {
    try {
        if (!!ctx.user && ctx.user.role !='游客') {
            if (!!ctx.request.body.id) {
                const result = await SIM.updateSIM(ctx.request.body)
                ctx.body = result
            } else {
                const result = await SIM.createSIM(ctx.request.body)
                ctx.body = result
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
            success: false,
            message: err
        }
    }

}

const deleteSIM = async (ctx) => {
    try {
        if (!!ctx.user && ctx.user.role == '超级管理员' || ctx.user.role == '管理员') {
            const result = await SIM.deleteSIM(ctx.request.body.id)
            ctx.body = result
        } else {
            ctx.body = {
                returnCode: '000005',
                success: false,
                message: 'token认证失败'
            }
        }
    } catch (err) {
        ctx.body = {
            success: false,
            message: err
        }
    }

}

export default {
    getAllUser,
    searchSIMPage,
    operateSIM,
    deleteSIM
}
