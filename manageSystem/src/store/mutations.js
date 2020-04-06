import * as types from './mutation-types'

const mutations = {
  [types.SET_ROUTER](state, router) {
    state.router = router
  }
}

export default mutations