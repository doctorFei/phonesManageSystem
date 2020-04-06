import server from '../../app.js'
import request from 'supertest'

afterEach(() => {
    server.close()
})

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InBmd2FuZzIiLCJpZCI6Mywicm9sZSI6Iui2hee6p-euoeeQhuWRmCIsImlhdCI6MTUzNTY3OTMyMCwiZXhwIjoxNTM1NjgyOTIwfQ.2PnCj8LpYS85fAovrZR6YYkKPXBG4x--B2SJbhfF6k8'

//***************************查测试机列表*************************
test('请求测试机列表必须要有请求头JWT验证，否则会有问题', async () => {
    const response = await request(server)
        .post('/phoneManageSystem/phonelist/searchPhonelist')
        .send({
            searchCondition: {},
            pagination: {
                pageSize: 1,
                currentPage: 1
            }
        })
    expect(response.status).toBe(401||404)
})
test('请求测试机列表有请求头JWT验证，请求成功', async () => {
    const response = await request(server)
        .post('/phoneManageSystem/phonelist/searchPhonelist')
        .send({
            searchCondition: {},
            pagination: {
                pageSize: 1,
                currentPage: 1
            }
        })
        .set('Authorization', 'Bearer ' + token)
    expect(response.body.returnCode).toBe('000000')
})

//***************************分类查询所有测试机*************************
test('分类查询所有测试机-带请求头', async () => {
    const response = await request(server)
        .post('/phoneManageSystem/phonelist/searchPhonelist')
        .send({
            searchCondition: {
                name: '来自测试',
                platform: '来自测试',
                user:'王鹏飞'
            },
            pagination: {
                pageSize: 1,
                currentPage: 1
            }
        })
        .set('Authorization', 'Bearer ' + token)
    expect(response.body.returnCode).toBe('000000')
})
//*************根据测试机id查询测试机-带请求头*********************
test('根据测试机id查询测试机-带请求头', async () => {
    const response = await request(server)
        .post('/phoneManageSystem/phonelist/searchPhoneById')
        .send({
            id:4
        })
        .set('Authorization', 'Bearer ' + token)
    expect(response.body.returnCode).toBe('000000')
})
//***************************查测试机分类*************************
test('查询测试机分类', async () => {
    const response = await request(server)
        .post('/phoneManageSystem/phonelist/getSearchClassify')
        .set('Authorization', 'Bearer ' + token)
    expect(response.body.returnCode).toBe('000000')
})

//**************************增加测试机***************************
test('增加测试机', async () => {
    const response = await request(server)
        .post('/phoneManageSystem/phonelist/operatePhone')
        .send({
            param:{
                name: '来自测试',
                platform: '来自测试',
                brand: '来自测试',
                imei: '来自测试'
            }
        })
        .set('Authorization', 'Bearer ' + token)
    expect(response.body.returnCode).toBe('000000')
})

//**************************修改测试机***************************
test('修改测试机', async () => {
    const response = await request(server)
        .post('/phoneManageSystem/phonelist/operatePhone')
        .send({
            id:27,
            param:{
                name: '来自测试的修改',
                platform: '来自测试',
                brand: '来自测试',
                imei: '来自测试'
            }
        })
        .set('Authorization', 'Bearer ' + token)
    expect(response.body.returnCode).toBe('000000')
})
//**************************申领测试机***************************
test('申领测试机', async () => {
    const response = await request(server)
        .post('/phoneManageSystem/phonelist/operatePhone')
        .send({
            id: 28,
            type: 'borrow',
            param: {
                borrowstatus: '已申领',
                borrowAccount: 'pfwang2'
            }
        })
        .set('Authorization', 'Bearer ' + token)
    expect(response.body.returnCode).toBe('000000')
})
//**************************归还测试机***************************
test('归还测试机', async () => {
    const response = await request(server)
        .post('/phoneManageSystem/phonelist/operatePhone')
        .send({
            id: 28,
            type: 'return',
            param: {
                borrowstatus: '未申领'
            }
        })
        .set('Authorization', 'Bearer ' + token)
    expect(response.body.returnCode).toBe('000000')
})
//**************************删除测试机***************************
test('删除测试机', async () => {
    const response = await request(server)
        .post('/phoneManageSystem/phonelist/deletePhone')
        .send({
            id:28
        })
        .set('Authorization', 'Bearer ' + token)
    console.log(response.body)
    expect(response.body.returnCode).toBe('000000')
})


