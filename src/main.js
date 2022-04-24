import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//引入Element组件
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from './request/api'
//引入淡入淡出
import 'element-ui/lib/theme-chalk/base.css'
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition'
//引入阿里图标库
import '../public/iconfont/iconfont.css'
//引入自定义命令
import './utils/directives.js'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.prototype.axios = axios
Vue.component(CollapseTransition.name, CollapseTransition)

let $vue =  new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
export default $vue

