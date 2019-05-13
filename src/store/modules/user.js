const state = {
  id: -1,
  username: '',
  level: '',
  avatar: '',
  email: '',
  phone: '',
  isAdmin: false,
  isLogin: false,
  userCity: []
}

const getters = {
  id: state => state.id,
  username: state => state.username,
  level: state => state.level,
  avatar: state => state.avatar,
  email: state => state.email,
  phone: state => state.phone,
  isAdmin: state => state.isAdmin,
  isLogin: state => state.isLogin,
  userCity: state => state.userCity
}

const actions = {}

const mutations = {
  login (state, user) {
    state.id = user.id
    state.username = user.username
    state.level = user.level
    state.avatar = user.avatar
    state.email = user.email
    state.phone = user.phone
    state.isAdmin = user.isAdmin
    state.isLogin = true
  },
  logout (state) {
    state.isLogin = false
    state.id = ''
    state.username = ''
    state.level = ''
    state.avatar = ''
    state.email = ''
    state.phone = ''
    state.isAdmin = false
  },
  changeAvatar (state, avatar) {
    state.avatar = avatar
  },
  setUserName(state, username){
    state.username = username
  },
  setUserPhone(state, userPhone){
    state.phone = userPhone
  },
  setUserCity(state, userCity){
    state.userCity = userCity
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}

