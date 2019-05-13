const state = {
  identifyCode: '',
  shopName: '',
  shopAddress: '',
  shopType: '',
  shopState: '',
  isShopLogin: false
}

const getters = {
  identifyCode: state => state.identifyCode,
  shopName: state => state.shopName,
  shopAddress: state => state.shopAddress,
  shopType: state => state.shopType,
  shopState: state => state.shopState,
  isShopLogin: state => state.isShopLogin
}

const actions = {}

const mutations = {
  shopLogin (state, shop) {
    state.identifyCode = shop.identifyCode
    state.shopName = shop.shopName
    state.shopAddress = shop.shopAddress
    state.shopType = shop.shopType
    state.shopState = shop.shopState
    state.isShopLogin = true
  },
  shopLogout (state) {
    state.identifyCode = ''
    state.shopName = ''
    state.shopAddress = ''
    state.shopType = ''
    state.shopState = ''
    state.isShopLogin = false
  },
  changeShopAvatar (state, avatar) {
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
