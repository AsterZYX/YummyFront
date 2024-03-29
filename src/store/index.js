import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import cart from './modules/cart'
import shop from './modules/shop'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    cart,
    shop
  }
})
