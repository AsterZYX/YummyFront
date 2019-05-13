// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import router from './router'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import IconSvg from './components/icon/icon-svg'
import './components/icon/iconfont'
import axios from 'axios'
import Qs from 'qs'
import ElementUI from 'element-ui'

Vue.config.productionTip = false

Vue.use(VueMaterial)
Vue.use(ElementUI)
Vue.component('icon-svg', IconSvg)
Vue.prototype.$ajax = axios
Vue.prototype.qs = Qs

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
