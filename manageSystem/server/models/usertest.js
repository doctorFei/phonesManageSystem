import db from '../config/db.js' // 引入user的表结构
const phonelistMocel = '../schema/phonelist.js'
const userModel = '../schema/usertest.js'
const organizationModel = '../schema/organization.js'

const TodolistDb = db.Todolist // 引入数据库

const Phonelist = TodolistDb.import(phonelistMocel)
const User = TodolistDb.import(userModel) // 用sequelize的import方法引入表结构，实例化了User。
const OrganizationModel = TodolistDb.import(organizationModel)

User.belongsTo(OrganizationModel, { foreignKey: 'organizationid' })


const getUserByName = async function (account) {
    const userInfo = await User.findOne({
        where: {
            account: account,
            deleteStatus: 0
        }
    })
    return userInfo
}

const getUserByWXID = async function (wxid) {
    try {
        if (!!wxid) {
            const result = await User.findOne({
                where: {
                    wxid: wxid
                }
            })
            return {
                result: result,
                returnCode: "000000",
                returnMsg: '请求成功'
            }
        } else {
            return {
                returnCode: "000004",
                returnMsg: '输入wxid参数不能为空'
            }
        }
    } catch (error) {
        return {
            returnCode: "000001",
            returnMsg: '服务端错误'
        }
    }
}

const getAllUser = async function () {
    const userInfo = await User.findAll({
        where: {
            deleteStatus: 0
        },
        include: [
            {
                model: OrganizationModel
            }
        ]
    })
    return userInfo
}

const searchUserList = async function (reqObj) {
    let userSearch = {}, organizationSearch = {}

    if (!!reqObj.role) {
        userSearch.role = reqObj.role
    }
    if (!!reqObj.organization) {
        organizationSearch.name = reqObj.organization
    }
    userSearch.deleteStatus = 0
    const result = await User.findAll({
        where: userSearch,
        include: [
            {
                model: OrganizationModel,
                where: organizationSearch
            }
        ]
    })
    return result
}

const getAllOrganization = async function () {
    const result = await OrganizationModel.findAll({
        attributes: ['name'],
        where: {
            deleteStatus: 0
        }
    })
    return result
}

const deleteUser = async function (id) {
    try {
        const findUserPhone = await Phonelist.findOne({
            where: {
                borrowname: id,
                deleteStatus: 0
            }
        })
        if (!!findUserPhone) {
            return {
                returnCode: '000002',
                returnMsg: "暂不能删除"
            }
        } else {
            const result = await User.update(
                {
                    deleteStatus: 1
                },
                {
                    where: {
                        id: id
                    }
                }
            )
            return {
                returnCode: '000000',
                returnMsg: "服务端错误"
            }
        }
    } catch (err) {
        return {
            returnCode: '000001',
            returnMsg: err
        }
    }
}
const updateUser = async function (reqObj) {
    let organizationid=null;
    console.log('修改，请求req')
    console.log(reqObj)
    var id = reqObj.id
    var reqObj = reqObj.param
    let updateObj = {}
    try {
        if (!!reqObj.organization) {
            const findOrganization = await OrganizationModel.findOne(
                {
                    where: {
                        name: reqObj.organization.name
                    }
                }
            )
            if (!!findOrganization) {
                organizationid = findOrganization.id
                reqObj.organizationid= findOrganization.id
            } else {
                const creatOrganization = await OrganizationModel.create({
                    name: reqObj.organization.name
                })
                organizationid = creatOrganization.id
                reqObj.organizationid=creatOrganization.id
            }
            console.log(organizationid)
        }
        for (let key in reqObj) {
            if (!!reqObj[key]&&key!='organization') {
                updateObj[key] = reqObj[key]
            }
        }
        console.log(updateObj)
        const updateUserInfo = await User.update(
            updateObj,
            {
                where: {
                    id: id
                }
            }
        )
        return {
            return: updateUserInfo,
            returnCode: '000000',
            returnMsg: '成功'
        }

    } catch (err) {
        return {
            returnCode: '000001',
            returnMsg: err
        }
    }
}


// const wxUSer = async function (reqObj) {
//     try {
//         var id = reqObj.id
//         var reqObj = reqObj.param
//         const updateUserInfo = await User.update(
//             {
//                 wxid: reqObj.wxid
//             },
//             {
//                 where: {
//                     id: id
//                 }
//             }
//         )
//         return {
//             return: updateUserInfo,
//             returnCode: '000000',
//             returnMsg: '成功'
//         }
//     } catch (err) {
//         return {
//             returnCode: '000001',
//             returnMsg: err
//         }
//     }
// }

const creatUser = async function (reqObj) {
    var organizationid
    console.log(reqObj)
    var reqObj = reqObj.param
    try {
        const findOrganization = await OrganizationModel.findOne(
            {
                where: {
                    name: reqObj.organization.name
                }
            }
        )
        console.log(findOrganization)
        if (!!findOrganization) {
            organizationid = findOrganization.id
        } else {
            const creatOrganization = await OrganizationModel.create({
                name: reqObj.organization.name
            })
            organizationid = creatOrganization.id
        }
        console.log(organizationid)
        const findUserInfo = await User.findOne(
            {
                where: {
                    account: reqObj.account,
                    deleteStatus: 0
                }
            }
        )
        console.log(findUserInfo)
        if (!!findUserInfo) {
            return {
                returnCode: '000003',
                returnMsg: '不能重复添加'
            }
        } else {
            const creaUserInfo = await User.create({
                name: reqObj.name,
                account: reqObj.account,
                role: reqObj.role,
                organizationid: organizationid
            })
            return {
                return: creaUserInfo,
                returnCode: '000000',
                returnMsg: '成功'
            }
        }
    } catch (err) {
        return {
            returnCode: '000001',
            returnMsg: err
        }
    }
}
export default {
    getUserByName,
   // wxUSer,
    getAllUser,
    getUserByWXID,
    creatUser,
    deleteUser,
    updateUser,
    getAllOrganization,
    searchUserList
}
