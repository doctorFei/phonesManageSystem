import user from '../models/usertest.js'
import fetch from 'node-fetch'
import jwt from 'jsonwebtoken'
import AES from '../api/aes'
const login = async function (ctx) {
    const data = ctx.request.body
    console.log(data)
    try {
        const userInfo = await user.getUserByName(data.username)
        if (userInfo != null) {
            if(data.username=='admin'&&AES.Decrypt(data.password)=='123456'){
                console.log('游客模式登录')
                let userToken = {
                    username: userInfo.account,
                    id: userInfo.id,
                    role: userInfo.role
                }
                let secret = 'lxPhone' // 指定密钥
                let token = jwt.sign(userToken, secret, { expiresIn: '5h' }) // 签发token
                ctx.body = {
                    result: {
                        token: token,
                        name: userInfo.name,
                        role: userInfo.role
                    },
                    returnCode: "000000",
                    returnMsg: "登录成功"
                }
                return 
            }
            let obj = {
                "base": {
                    "appid": "108ViaFly"
                },
                "param": {
                    "username": data.username,
                    "password": AES.Decrypt(data.password)
                }
            }
            var res = await fetch('http://172.31.4.30:8083/domainauth/auth?flag=debug&ts=2018061701211', {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain',
                },
                body: JSON.stringify(obj),
            }).then(response => {
                return response.text()
            }).catch((err) => {
                throw 'error'
            });
            res = JSON.parse(res)
            if (res.errorcode == '000000') {
                let userToken = {
                    username: userInfo.account,
                    id: userInfo.id,
                    role: userInfo.role
                }
                let secret = 'lxPhone' // 指定密钥
                let token = jwt.sign(userToken, secret, { expiresIn: '5h' }) // 签发token
                ctx.body = {
                    result: {
                        token: token,
                        name: userInfo.name,
                        role: userInfo.role
                    },
                    returnCode: "000000",
                    returnMsg: "登录成功"
                }
            } else {
                ctx.body = {
                    'returnCode': res.errorcode,
                    'returnMsg': res.desc
                }
            }
        } else {
            ctx.body = {
                returnCode: "000002",
                returnMsg: "用户名不存在"
            }
        }
    }
    catch (err) {
        console.log(err)
        ctx.body = {
            returnCode: "000001",
            returnMsg: "服务端错误"
        }
    }

}

const nameToToken = async function (ctx) {
    const data = ctx.request.body
    try {
       
        const userInfo = await user.getUserByName(data.username)
        if (userInfo != null) {
            let userToken = {
                username: userInfo.account,
                id: userInfo.id,
                role: userInfo.role
            }
            let secret = 'lxPhone' // 指定密钥
            let token = jwt.sign(userToken, secret, { expiresIn: '1h' }) // 签发token
            ctx.body = {
                result: {
                    token: token,
                    name: userInfo.name,
                    role: userInfo.role
                },
                returnCode: "000000",
                returnMsg: "token获取成功"
            }
        } else {
            console.log(ctx)
            ctx.body = {
                returnCode: "000002",
                returnMsg: "用户名不存在"
            }
        }
    }
    catch (err) {
        ctx.body = {
            returnCode: "000001",
            returnMsg: "服务端错误"
        }
    }
}

const getAllUser = async function (ctx) {
    const data = ctx.request.body
    try {
        if (!!ctx.user) {
            const userList = await user.getAllUser()
            ctx.body = {
                result: userList,
                returnCode: "000000",
                returnMsg: '请求成功'
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
            returnCode: "000001",
            returnMsg: '请求失败'
        }
    }
}

const getAllOrganization = async function (ctx) {
    try {
        if (!!ctx.user) {
            const result = await user.getAllOrganization()
            ctx.body = {
                result: result,
                returnCode: "000000",
                returnMsg: '请求成功'
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
            returnCode: "000001",
            returnMsg: '请求失败'
        }
    }
}
const searchUserList = async function (ctx) {
    const data = ctx.request.body
    try {
        if (!!ctx.user) {
            const result = await user.searchUserList(data)
            ctx.body = {
                result: result,
                returnCode: "000000",
                returnMsg: '请求成功'
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
            returnCode: "000001",
            returnMsg: '请求失败'
        }
    }
}

const getUserByWXID = async function (ctx) {
    const data = ctx.request.body
    const result = await user.getUserByWXID(data.wxid)
    ctx.body = result
}

const getUserByName = async function (ctx) {
    const data = ctx.request.body
    try {
        const result = await user.getUserByName(data.account)
        ctx.body = {
            result: result,
            returnCode: "000000",
            returnMsg: '请求成功'
        }
    } catch (err) {
        ctx.body = {
            returnCode: "000001",
            returnMsg: '请求失败'
        }
    }
}

const operateUSer = async function (ctx) {
    const data = ctx.request.body
    if (!!ctx.user && ctx.user.role == '超级管理员') {
        if (!!data.id) {
            var result = await user.updateUser(data)
        } else {
            console.log('添加')
            var result = await user.creatUser(data)
        }
        ctx.body = result
    } else {
        ctx.body = {
            returnCode: '000005',
            success: false,
            message: 'token认证失败'
        }
    }
}
// const wxUser = async function (ctx) {
//     const data = ctx.request.body
//     if (!!ctx.user) {
//         var result = await user.wxUser(data)
//         ctx.body = result
//     } else {
//         ctx.body = {
//             returnCode: '000005',
//             success: false,
//             message: 'token认证失败'
//         }
//     }

// }
const deleteUser = async function (ctx) {
    if (!!ctx.user && ctx.user.role == '超级管理员') {
        const data = ctx.request.body
        const userList = await user.deleteUser(data.id)
        ctx.body = userList
    } else {
        ctx.body = {
            returnCode: '000005',
            success: false,
            message: 'token认证失败'
        }
    }
}

export default {
    login,
    nameToToken,
    getAllUser,
    //wxUser,
    getUserByWXID,
    getUserByName,
    deleteUser,
    operateUSer,
    getAllOrganization,
    searchUserList
}
