import Vue from 'vue'
import elementUI from 'element-ui'
import { mount } from '@vue/test-utils'
import Login from '../../src/components/Login.vue'
import axios from 'axios'

Vue.use(elementUI)

jest.mock('axios', () => ({
  post: jest.fn()
    .mockImplementationOnce(() => Promise.resolve({
      data: {
        success: false,
        info: '用户不存在！'
      }
    }))
    .mockImplementationOnce(() => Promise.resolve({
      data: {
        success: false,
        info: '密码错误！'
      }
    }))
    .mockImplementationOnce(() => Promise.resolve({
      data: {
        success: true,
        token: 'xxx'
      }
    }))
}))

Vue.prototype.$http = axios

let wrapper

const $router = {
  push: jest.fn()
}

beforeEach(() => {
  wrapper = mount(Login, {
    mocks: {
      $router
    }
  })
})

test('快照测试', () => {
  expect(wrapper.element).toMatchSnapshot() // 调用toMatchSnapshot来比对快照
})

test('Should have two input & one button', () => {
  const inputs = wrapper.findAll('.el-input')
  const loginButton = wrapper.contains('.el-button')
  expect(inputs.length).toBe(2)
  expect(loginButton).toBeTruthy()
})
