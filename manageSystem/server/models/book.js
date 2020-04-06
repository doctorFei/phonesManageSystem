import db from '../config/db.js' // 引入todolist的表结构
const bookModel = '../schema/book.js'
const userModel = '../schema/usertest.js'
const organizationModel = '../schema/organization.js'

const Database = db.Todolist // 引入数据库

const bookTable = Database.import(bookModel)
const UserTable = Database.import(userModel)
const OrganizationTable = Database.import(organizationModel)

bookTable.belongsTo(UserTable, { foreignKey: 'borrowname' })
UserTable.belongsTo(OrganizationTable, { foreignKey: 'organizationid' })

//查询当前分类下的总数
const searchBookPageAllNum = async function (reqObj) {
    let searchObj = reqObj.searchCondition
    let booklistSearch = {}, userSearch = {}
    for (let key in searchObj) {
        if (key == 'user' && searchObj[key] != '') {
            userSearch['name'] = searchObj[key]
        } else {
            if (!!searchObj[key]) {
                booklistSearch[key] = searchObj[key]
            }
        }
    }
    booklistSearch.deleteStatus = 0
    const result = await bookTable.findAll(
        {
            order: [
                ['id', 'DESC']
            ],
            where: booklistSearch,
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
//Book页查询
const searchBookPage = async (reqObj) => {
    try {
        let searchObj = reqObj.searchCondition
        let pageObj = reqObj.pagination, pageSize = pageObj.pageSize, currentPage = pageObj.currentPage
        let booklistSearch = {}, userSearch = {}
        for (let key in searchObj) {
            if (key == 'user' && searchObj[key] != '') {
                userSearch['name'] = searchObj[key]
            } else {
                if (!!searchObj[key]) {
                    booklistSearch[key] = searchObj[key]
                }
            }
        }
        booklistSearch.deleteStatus = 0
        const result = await bookTable.findAll(
            {
                order: [
                    ['id', 'DESC']
                ],
                limit: pageSize,// 每页多少条
                offset: pageSize * (currentPage - 1),  // 跳过多少条
                where: booklistSearch,
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
        const allNumResult = await searchBookPageAllNum(reqObj)
        return {
            result: {
                booklist: result,
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
        let allNumResult = await searchBookPageAllNum({
            searchCondition: {},
            pagination: {}
        })
        let user = []
        let bookname=[]
        for (let i = 0; i < allNumResult.length; i++) {
            if (!!allNumResult[i].usertest.name && allNumResult[i].usertest.name != '暂无') {
                user.push(allNumResult[i].usertest.name)
            }
            if (!!allNumResult[i].bookname) {
                bookname.push(allNumResult[i].bookname)
            }
        }
        bookname = Array.from(new Set(bookname))
        user = Array.from(new Set(user))
        return {
            result: {
                bookname:bookname,
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
//删除Book卡
const deleteBook = async function (id) {
    try {
        const result = await bookTable.update(
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
//新增Book卡
const createBook = async function (data) {
    console.log(data)
    const createObj = data.param
    try {
        let searchResult = await bookTable.findAll(
            {
                where: {
                    bookname: createObj.bookname,
                    deleteStatus: 0
                }
            }
        )
        if (!!searchResult && searchResult.length > 0) {
            return {
                returnCode: "000002",
                returnMsg: '该书籍已添加'
            }
        } else {
            createObj.addtime = Date.now()
            const result = await bookTable.create(createObj)
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
//修改Book卡
const updateBook = async function (reqObj) {
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
        const result = await bookTable.update(
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
    searchBookPage,
    getSearchList,
    deleteBook,
    createBook,
    updateBook
}