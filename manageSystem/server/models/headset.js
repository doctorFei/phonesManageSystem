import db from '../config/db.js' // 引入todolist的表结构
const headsetModel = '../schema/headset.js'
const userModel = '../schema/usertest.js'
const organizationModel = '../schema/organization.js'

const Database = db.Todolist // 引入数据库

const headsetTable = Database.import(headsetModel)
const UserTable = Database.import(userModel)
const OrganizationTable = Database.import(organizationModel)

headsetTable.belongsTo(UserTable, { foreignKey: 'borrowname' })
UserTable.belongsTo(OrganizationTable, { foreignKey: 'organizationid' })

//查询当前分类下的总数
const searchHeadsetPageAllNum = async function (reqObj) {
    let searchObj = reqObj.searchCondition
    let headsetlistSearch = {}, userSearch = {}
    for (let key in searchObj) {
        if (key == 'user' && searchObj[key] != '') {
            userSearch['name'] = searchObj[key]
        } else {
            if (!!searchObj[key]) {
                headsetlistSearch[key] = searchObj[key]
            }
        }
    }
    headsetlistSearch.deleteStatus = 0
    const result = await headsetTable.findAll(
        {
            order: [
                ['id', 'DESC']
            ],
            where: headsetlistSearch,
            include: [
                {
                    model: UserTable,
                    include: [
                        {
                            model: OrganizationTable,
                            where: {

                            }
                        }
                    ],
                    where: userSearch
                }
            ]
        }
    )
    return result // 返回数据
}
//Headset页查询
const searchHeadsetPage = async (reqObj) => {
    try {
        let searchObj = reqObj.searchCondition
        let pageObj = reqObj.pagination, pageSize = pageObj.pageSize, currentPage = pageObj.currentPage
        let headsetlistSearch = {}, userSearch = {}
        for (let key in searchObj) {
            if (key == 'user' && searchObj[key] != '') {
                userSearch['name'] = searchObj[key]
            } else {
                if (!!searchObj[key]) {
                    headsetlistSearch[key] = searchObj[key]
                }
            }
        }
        headsetlistSearch.deleteStatus = 0
        const result = await headsetTable.findAll(
            {
                order: [
                    ['id', 'DESC']
                ],
                limit: pageSize,// 每页多少条
                offset: pageSize * (currentPage - 1),  // 跳过多少条
                where: headsetlistSearch,
                include: [
                    {
                        model: UserTable,
                        include: [
                            {
                                model: OrganizationTable,
                                where: {

                                }
                            }
                        ],
                        where: userSearch
                    }
                ]
            }
        )
        const allNumResult = await searchHeadsetPageAllNum(reqObj)
        return {
            result: {
                headsetlist: result,
                totalNum: allNumResult.length
            },
            returnCode: '000000',
            returnMsg: "成功"
        }
    } catch (err) {
        return {
            returnCode: "000001",
            returnMsg: error
        }
    }
}
//获取所有的申领人
const getSearchList = async (reqObj = {}) => {
    try {
        let allNumResult = await searchHeadsetPageAllNum({
            searchCondition: {},
            pagination: {}
        })
        let user = []
        let brand=[]
        let SN=[]
        for (let i = 0; i < allNumResult.length; i++) {
            if (!!allNumResult[i].usertest.name && allNumResult[i].usertest.name != '暂无') {
                user.push(allNumResult[i].usertest.name)
            }
            if (!!allNumResult[i].brand) {
                brand.push(allNumResult[i].brand)
            }
            if (!!allNumResult[i].SN) {
                SN.push(allNumResult[i].SN)
            }
        }
        brand = Array.from(new Set(brand))
        SN = Array.from(new Set(SN))
        user = Array.from(new Set(user))

        return {
            result: {
                brand:brand,
                SN:SN,
                user:user
            }, // 将请求的结果放到response的body里返回
            returnCode: '000000',
            returnMsg: "成功"
        }
    } catch (error) {
        return {
            returnCode: '000001',
            message: '服务端错误'
        }
    }
}
//删除Headset卡
const deleteHeadset = async function (id) {
    try {
        const result = await headsetTable.update(
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
            result: result, // 将请求的结果放到response的body里返回
            returnCode: '000000',
            returnMsg: "成功"
        }
    } catch (error) {
        return {
            returnCode: '000001',
            message: '服务端错误'
        }
    }
    
}
//新增Headset卡
const createHeadset = async function (data) {
    console.log(data)
    const createObj = data.param
    try {
        let searchResult = await headsetTable.findAll(
            {
                where: {
                    SN: createObj.SN,
                    deleteStatus: 0
                }
            }
        )
        if (!!searchResult && searchResult.length > 0) {
            return {
                returnCode: "000002",
                returnMsg: '该耳机已添加'
            }
        } else {
            createObj.addtime = Date.now()
            const result = await headsetTable.create(createObj)
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
//查找对应域账号的人
const findUserByAccount = async function (account) {
    const result = await UserTable.findOne(
        {
            where: {
                account: account,
                deleteStatus: 0
            }
        }
    )
    return result // 返回数据
}
//修改Headset卡
const updateHeadset = async function (reqObj) {
    console.log(reqObj)
    const id = reqObj.id
    if (!id) {
        return {
            returnCode: '000004',
            returnMsg: 'id参数不能为空'
        }
    }
    const type = reqObj.type
    const param = reqObj.param
    const borrowAccount = param.borrowAccount
    let updateObj = {}
    for (let key in param) {
        if (!!param[key]) {
            updateObj[key] = param[key]
        }
    }
    try {
        if (type == 'borrow') {
            let user = await findUserByAccount(borrowAccount)
            updateObj.borrowstatus = '已申领'
            updateObj.borrowname = user.id
            updateObj.borrowtime = Date.now()
        } else if (type == "return") {
            updateObj.borrowstatus = '未申领'
            updateObj.borrowname = 1
            updateObj.borrowtime = Date.now()
        }
        console.log(updateObj)
        const result = await headsetTable.update(
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
    searchHeadsetPage,
    getSearchList,
    deleteHeadset,
    createHeadset,
    updateHeadset
}