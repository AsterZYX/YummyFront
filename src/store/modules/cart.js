const state = {
  goods:[],
  cartName: '',
  cartId: ''
}

const getters = {
  goods: state => state.goods,
  cartName: state => state.cartName,
  cartId: state => state.cartId
}

const actions = {
  addProductToCart ({ state, commit }, {id, quantity}) {
      const cartItem = state.goods.find(item => item.id === id)
      if (!cartItem) {
        commit('pushGoodsToCart', {id: id, quantity: quantity})
      } else {
        commit('changeGoodsQuantity', {id: id, quantity: quantity})
      }
  },

  deleteProduct({ state, commit }, id) {
    commit('deleteGoods', {id: id})
  },

  clearCart({ state, commit }){
    commit('setGoods', { goods: [] })
    commit('setName', { name: '' })
    commit('setId', { cartId: '' })
  },

  incrementProduct ({ state, commit }, { id, name, price, max }) {
    const cartItem = state.goods.find(item => item.id === id)
    if (!cartItem) {
      commit('pushGoodsToCart', { id: id, quantity: 1, name: name, price: price, max: max })
    } else {
      commit('incrementItemQuantity', { id: id })
    }
  },

  changeCart ({ state, commit }, { name, cartId }) {
    commit('setName', { name: name })
    commit('setId', { cartId: cartId })
  },

  setCart ({ state, commit }, { name, cartId, goods }){
    commit('setName', { name: name })
    commit('setId', { cartId: cartId })
    commit('setGoods', { goods: goods })
  },

  setCartContent ({ state, commit }, goods) {
    commit('setGoods', { goods: goods })
  }
}

const mutations = {
  setGoods (state, { goods }) {
    state.goods = goods
  },

  setName (state, { name }) {
    state.cartName = name
  },

  setId(state, { cartId }){
    state.cartId = cartId
  },

  changeGoodsMax(state, { id, max }){
    const cartItem = state.goods.find(item => item.id === id)
    cartItem.max = max
  },

  pushGoodsToCart (state, {id, quantity, name, price, max}) {
    state.goods.push({
      id: id,
      quantity: quantity,
      name: name,
      price: price,
      max: max
    })
  },

  changeGoodsQuantity (state, { id, quantity }) {
    const cartItem = state.goods.find(item => item.id === id)
    if (cartItem.max >= quantity) {
      cartItem.quantity = quantity
    }
  },

  deleteGoods (state, {id}) {
    const cartItem = state.goods.find(item => item.id === id)
    var index = state.goods.indexOf(cartItem)
    state.goods.splice(index,1)
  },

  incrementItemQuantity (state, { id }) {
    const cartItem = state.goods.find(item => item.id === id)
    if (cartItem.max > cartItem.quantity) {
      cartItem.quantity++
    }
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
