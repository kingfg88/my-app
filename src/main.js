// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/index'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import './style/index.scss'
//裁剪插件
import VueCropper from 'vue-cropper'
//时间格式插件
import moment from 'moment'

Vue.config.productionTip = false
Vue.use(VueCropper)
Vue.use(ElementUI)
Vue.prototype.$moment = moment


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
