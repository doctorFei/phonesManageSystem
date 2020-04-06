import Headset from '../models/headset.js'

const getSearchList = async (ctx) => {
    try {
        if (!!ctx.user) {
            const result = await Headset.getSearchList()
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


const searchHeadsetPage = async (ctx) => {
    try {
        if (!!ctx.user) {
            const result = await Headset.searchHeadsetPage(ctx.request.body)
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

const operateHeadset = async (ctx) => {
    try {
        if (!!ctx.user && ctx.user.role !='游客') {
            if (!!ctx.request.body.id) {
                const result = await Headset.updateHeadset(ctx.request.body)
                ctx.body = result
            } else {
                const result = await Headset.createHeadset(ctx.request.body)
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

const deleteHeadset = async (ctx) => {
    try {
        if (!!ctx.user && ctx.user.role == '超级管理员' || ctx.user.role == '管理员') {
            const result = await Headset.deleteHeadset(ctx.request.body.id)
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
    getSearchList,
    searchHeadsetPage,
    operateHeadset,
    deleteHeadset
}
