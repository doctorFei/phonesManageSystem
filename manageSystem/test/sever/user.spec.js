import server from '../../app.js'
import request from 'supertest'
import AES from '../../src/common/js/aes'

afterEach(() => {
  server.close()
})

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InBmd2FuZzIiLCJpZCI6Mywicm9sZSI6Iui2hee6p-euoeeQhuWRmCIsImlhdCI6MTUzNTY3OTMyMCwiZXhwIjoxNTM1NjgyOTIwfQ.2PnCj8LpYS85fAovrZR6YYkKPXBG4x--B2SJbhfF6k8'
test('验证登录用户名不存在的情况', async () => {
  const response = await request(server)
    .post('/phoneManageSystem/login/login')
    .send({
      username: 'xiaoxiao',
      password: 13456789
    })
  expect(response.body.returnCode).toBe('000002')
})

test('验证登录密码不正确的情况', async () => {
  const response = await request(server)
    .post('/phoneManageSystem/login/login')
    .send({
      username: 'Molunerfinn',
      password: '1234'
    })
  expect(response.body.returnCode).not.toBe('000000')
})

test('验证登录账号密码正确的情况', async () => {
  const response = await request(server)
    .post('/phoneManageSystem/login/login')
    .send({
      username: 'pfwang2',
      password: AES.Encrypt('W664589771oa')
    })
  console.log(response.body.result.token)
  expect(response.body.returnCode).toBe('000000')
})

//*********查找所有用户******* */
test('查找所有用户列表', async () => {
  const response = await request(server)
    .post('/phoneManageSystem/user/getAllUser')
    .send({})
    .set('Authorization', 'Bearer ' + token)
  expect(response.body.returnCode).toBe('000000')
})

//*********分类查找所有用户******* */
test('分类查找所有用户', async () => {
  const response = await request(server)
    .post('/phoneManageSystem/user/searchUserList')
    .send({
      organization: '灵犀',
      role: '管理员'
    })
    .set('Authorization', 'Bearer ' + token)
  expect(response.body.returnCode).toBe('000000')
})

//*********查询所有组织******* */
test('查找所有组织', async () => {
  const response = await request(server)
    .post('/phoneManageSystem/user/getAllOrganization')
    .set('Authorization', 'Bearer ' + token)
  expect(response.body.returnCode).toBe('000000')
})

//*********新增用户******* */
test('新增用户——组织为已存在组织', async () => {
  const response = await request(server)
    .post('/phoneManageSystem/user/operateUSer')
    .send({
      param: {
        name: '852',
        account: '963',
        organization: {
          name: '灵犀'
        },
        role: '管理员'
      }
    })
    .set('Authorization', 'Bearer ' + token)
  expect(response.body.returnCode).toBe('000000')
})
test('新增用户——组织为未存在组织', async () => {
  const response = await request(server)
    .post('/phoneManageSystem/user/operateUSer')
    .send({
      param: {
        name: '王小虎2',
        account: '951',
        organization: {
          name: '来自测试1'
        },
        role: '管理员'
      }
    })
    .set('Authorization', 'Bearer ' + token)
  expect(response.body.returnCode).toBe('000000')
})
//*********修改用户******* */
test('修改用户信息', async () => {
  const response = await request(server)
    .post('/phoneManageSystem/user/operateUSer')
    .send({
      id: 24,
      param: {
        name: '王小虎测试',
        account: 'wxh',
        organization: {
          name: '来自测试'
        },
        role: '管理员'
      }
    })
    .set('Authorization', 'Bearer ' + token)
  expect(response.body.returnCode).toBe('000000')
})
//*********删除用户******* */
test('删除用户', async () => {
  const response = await request(server)
    .post('/phoneManageSystem/user/deleteUser')
    .send({
      id: 24
    })
    .set('Authorization', 'Bearer ' + token)
  expect(response.body.returnCode).toBe('000000')
})
//*********根据域账号获取token******* */
test('根据域账号获取token', async () => {
  const response = await request(server)
    .post('/phoneManageSystem/login/getToken')
    .send({
      username: 'pfwang2'
    })
  expect(response.body.returnCode).toBe('000000')
})
test('根据域账号获取token——域账号不存在的情况', async () => {
  const response = await request(server)
    .post('/phoneManageSystem/login/getToken')
    .send({
      username: '123'
    })
  expect(response.body.returnCode).toBe('000002')
})
//*********通过微信ID获取用户信息******* */
test('通过微信ID获取用户信息', async () => {
  const response = await request(server)
    .post('/phoneManageSystem/login/getUserByWXID')
    .send({
      wxid: '马靖'
    })
  expect(response.body.returnCode).toBe('000000')
})
//*********通过域账号获取用户信息******* */
test('通过域账号获取用户信息', async () => {
  const response = await request(server)
    .post('/phoneManageSystem/user/getUserByName')
    .send({
      account: 'pfwang2'
    })
    .set('Authorization', 'Bearer ' + token)
  expect(response.body.returnCode).toBe('000000')
})




