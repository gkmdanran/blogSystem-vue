import Vue from 'vue'
import VueCookies from 'vue-cookies'
import ElementUI from 'element-ui';
import 'default-passive-events'

import App from './App.vue'
import router from './router'

import 'element-ui/lib/theme-chalk/index.css';
import './assets/css/global.css'


Vue.use(VueCookies)
Vue.use(ElementUI);

Vue.config.productionTip = false
Vue.filter('dateFormat',function(originVal:string):string{
  const dt:Date=new Date(originVal)
  const y:number|string=dt.getFullYear()
  const m:number|string=(dt.getMonth()+1+'').padStart(2,'0')
  const d:number|string=(dt.getDate()+'').padStart(2,'0')
  const h:number|string=(dt.getHours()+'').padStart(2,'0')
  const mm:number|string=(dt.getMinutes()+'').padStart(2,'0')
  const s:number|string=(dt.getSeconds()+'').padStart(2,'0')
  return `${y}-${m}-${d} ${h}:${mm}:${s}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
