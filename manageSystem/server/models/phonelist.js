import db from '../config/db.js' // 引入todolist的表结构
const phonelistMocel = '../schema/phonelist.js'
const userModel = '../schema/usertest.js'
const organizationModel = '../schema/organization.js'

const PhonelistDb = db.Todolist // 引入数据库

const Phonelist = PhonelistDb.import(phonelistMocel)
const User = PhonelistDb.import(userModel)
const OrganizationModel = PhonelistDb.import(organizationModel)

Phonelist.belongsTo(User, { foreignKey: 'borrowname' })
User.belongsTo(OrganizationModel, { foreignKey: 'organizationid' })

const getSearchClassify = async function (reqObj = {}) {
    const phonelist = await Phonelist.findAll(
        {
            where: {
                deleteStatus: 0
            },
            include: [
                {
                    model: User,
                    include: [
                        {
                            model: OrganizationModel
                        }
                    ]
                }
            ]
        }
    )
    let devicename = [], brand = [], system = [], user = [];
    for (let i = 0; i < phonelist.length; i++) {
        if (!!phonelist[i].name) {
            devicename.push(phonelist[i].name)
        }
        if (!!phonelist[i].brand) {
            brand.push(phonelist[i].brand)
        }
        if (!!phonelist[i].system) {
            system.push(phonelist[i].system)
        }
        if (!!phonelist[i].usertest.name && phonelist[i].usertest.name != '暂无') {
            user.push(phonelist[i].usertest.name)
        }
        devicename = Array.from(new Set(devicename))
        brand = Array.from(new Set(brand))
        system = Array.from(new Set(system))
        user = Array.from(new Set(user))
    }
    return {
        devicename: devicename,
        brand: brand,
        system: system,
        user: user
    }
}

const findUserByAccount = async function (account) {
    const result = await User.findOne(
        {
            where: {
                account: account,
                deleteStatus: 0
            }
        }
    )
    return result // 返回数据
}
const searchPhonelistAllNum = async function (reqObj) {
    let searchObj = reqObj.searchCondition
    let phonelistSearch = {}, userSearch = {}
    for (let key in searchObj) {
        if (key == 'user' && searchObj[key] != '') {
            userSearch['name'] = searchObj[key]
        } else {
            if (!!searchObj[key]) {
                phonelistSearch[key] = searchObj[key]
            }
        }
    }
    phonelistSearch.deleteStatus = 0
    const phonelist = await Phonelist.findAll(
        {
            order: [
                ['id', 'DESC']
            ],
            where: phonelistSearch,
            include: [
                {
                    model: User,
                    include: [
                        {
                            model: OrganizationModel,
                            where: {

                            }
                        }
                    ],
                    where: userSearch
                }
            ]
        }
    )
    return phonelist // 返回数据
}

const searchPhonelistPage = async function (reqObj) {
    let searchObj = reqObj.searchCondition
    let pageObj = reqObj.pagination, pageSize = pageObj.pageSize, currentPage = pageObj.currentPage
    let phonelistSearch = {}, userSearch = {}
    for (let key in searchObj) {
        if (key == 'user' && searchObj[key] != '') {
            userSearch['name'] = searchObj[key]
        } else {
            if (!!searchObj[key]) {
                phonelistSearch[key] = searchObj[key]
            }
        }
    }
    phonelistSearch.deleteStatus = 0
    const phonelist = await Phonelist.findAll(
        {
            order: [
                ['id', 'DESC']
            ],
            limit: pageSize,// 每页多少条
            offset: pageSize * (currentPage - 1),  // 跳过多少条
            where: phonelistSearch,
            include: [
                {
                    model: User,
                    include: [
                        {
                            model: OrganizationModel,
                            where: {

                            }
                        }
                    ],
                    where: userSearch
                }
            ]
        }
    )
    return phonelist // 返回数据
}
const searchPhoneById = async function (id) {
    if (!id) {
        return {
            returnCode: "000004",
            returnMsg: 'id不能为空'
        }
    }
    try {
        const phonelist = await Phonelist.findOne(
            {
                where: {
                    id: id
                },
                include: [
                    {
                        model: User,
                        include: [
                            {
                                model: OrganizationModel
                            }
                        ]
                    }
                ]
            }
        )
        return {
            result: phonelist,
            returnCode: "000000",
            returnMsg: "成功"
        }

    } catch (error) {
        return {
            returnCode: "000001",
            returnMsg: error
        }
    }
}

const createPhone = async function (data) {
    console.log(data)
    const createObj = data.param
    try {
        let searchResult = searchPhonelistAllNum(createObj)
        if (!!searchResult && searchResult.length > 0) {
            return {
                returnCode: "000002",
                returnMsg: '该机型已添加'
            }
        } else {
            createObj.addtime = Date.now()
            const result = await Phonelist.create(createObj)
            return {
                returnCode: "000000",
                returnMsg: '添加成功',
                result: result
            }
        }
    } catch (err) {
        return {
            returnCode: "000001",
            returnMsg: err
        }
    }
}
const deletePhone = async function (id) {
    const result = await Phonelist.update(
        {
            deleteStatus: 1
        },
        {
            where: {
                id: id
            }
        }
    )
    return result
}

const updatePhone = async function (reqObj) {
    console.log(reqObj)
    const id = reqObj.id

    if (!id) {
        return {
            returnCode: '000004',
            returnMsg: 'id参数不能为空'
        }
    }
    const type= reqObj.type    
    const param = reqObj.param
    const borrowAccount = param.borrowAccount
    let updateObj = {}
    for (let key in param) {
        if (!!param[key]) {
            updateObj[key] = param[key]
        }
    }
    try {
        if(type=='borrow'){
            let user = await findUserByAccount(borrowAccount)
            updateObj.borrowstatus = '已申领'
            updateObj.borrowname = user.id
            updateObj.borrowtime = Date.now()
        }else if(type=="return"){
            updateObj.borrowstatus = '未申领'
            updateObj.borrowname = 1
            updateObj.borrowtime =  Date.now()
        }
        console.log(updateObj)
        const result = await Phonelist.update(
            updateObj,
            {
                where: {
                    id: id
                }
            }
        )
        return {
            result: result, // 将请求的结果放到response的body里返回
            returnCode: '000000',
            returnMsg: "成功"
        }
    } catch (err) {
        return {
            returnCode: '000001',
            returnMsg: err
        }
    }
}

export default {
    getSearchClassify,
    createPhone,
    searchPhonelistAllNum,
    searchPhonelistPage,
    searchPhoneById,
    deletePhone,
    updatePhone
}