import db from '../config/db.js' // 引入todolist的表结构
const SIMModel = '../schema/SIM.js'
const userModel = '../schema/usertest.js'
const organizationModel = '../schema/organization.js'

const Database = db.Todolist // 引入数据库

const SIMTable = Database.import(SIMModel)
const UserTable = Database.import(userModel)
const OrganizationTable = Database.import(organizationModel)

SIMTable.belongsTo(UserTable, { foreignKey: 'borrowname' })
UserTable.belongsTo(OrganizationTable, { foreignKey: 'organizationid' })

//查询当前分类下的总数
const searchSIMPageAllNum = async function (reqObj) {
    let searchObj = reqObj.searchCondition
    let SIMlistSearch = {}, userSearch = {}
    for (let key in searchObj) {
        if (key == 'user' && searchObj[key] != '') {
            userSearch['name'] = searchObj[key]
        } else {
            if (!!searchObj[key]) {
                SIMlistSearch[key] = searchObj[key]
            }
        }
    }
    SIMlistSearch.deleteStatus = 0
    const result = await SIMTable.findAll(
        {
            order: [
                ['id', 'DESC']
            ],
            where: SIMlistSearch,
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
//SIM卡分页查询
const searchSIMPage = async (reqObj) => {
    try {
        let searchObj = reqObj.searchCondition
        let pageObj = reqObj.pagination, pageSize = pageObj.pageSize, currentPage = pageObj.currentPage
        let SIMlistSearch = {}, userSearch = {}
        for (let key in searchObj) {
            if (key == 'user' && searchObj[key] != '') {
                userSearch['name'] = searchObj[key]
            } else {
                if (!!searchObj[key]) {
                    SIMlistSearch[key] = searchObj[key]
                }
            }
        }
        SIMlistSearch.deleteStatus = 0
        const result = await SIMTable.findAll(
            {
                order: [
                    ['id', 'DESC']
                ],
                limit: pageSize,// 每页多少条
                offset: pageSize * (currentPage - 1),  // 跳过多少条
                where: SIMlistSearch,
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
        const allNumResult = await searchSIMPageAllNum(reqObj)
        return {
            result: {
                SIMlist: result,
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
const getAllUser = async (reqObj = {}) => {
    try {
        let allNumResult = await searchSIMPageAllNum({
            searchCondition: {},
            pagination: {}
        })
        let user = []
        let number=[]

        for (let i = 0; i < allNumResult.length; i++) {
            if (!!allNumResult[i].usertest.name && allNumResult[i].usertest.name != '暂无') {
                user.push(allNumResult[i].usertest.name)
            }
            if (!!allNumResult[i].number) {
                number.push(allNumResult[i].number)
            }
        }
        
        user = Array.from(new Set(user))
        number = Array.from(new Set(number))

        return {
            result: {
                user:user,
                number:number
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
//删除SIM卡
const deleteSIM = async function (id) {
    try {
        const result = await SIMTable.update(
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
//新增SIM卡
const createSIM = async function (data) {
    console.log(data)
    const createObj = data.param
    try {
        let searchResult = await SIMTable.findAll(
            {
                where: {
                    number: createObj.number,
                    deleteStatus: 0
                }
            }
        )
        if (!!searchResult && searchResult.length > 0) {
            return {
                returnCode: "000002",
                returnMsg: '该SIM卡已添加'
            }
        } else {
            createObj.addtime = Date.now()
            const result = await SIMTable.create(createObj)
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
//修改SIM卡
const updateSIM = async function (reqObj) {
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
        const result = await SIMTable.update(
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
    searchSIMPage,
    getAllUser,
    deleteSIM,
    createSIM,
    updateSIM
}