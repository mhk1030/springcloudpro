// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import ElementUi from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUi)

import gloable from './store/gloable'
Vue.prototype.domain=gloable


import axios from 'axios'
Vue.prototype.$axios=axios

// 允许携带cookie
axios.defaults.withCredentials=true

import Cookies from 'js-cookie'
Vue.prototype.Cookies=Cookies

//引入VUEX
import store from './store/store'

Vue.config.productionTip = false
axios.interceptors.request.use((config)=>{

  if(config.url.includes("getCode")){//如果是获取验证码的路径
    //没有Cookie的话添加Cookie
    let aucokie=Cookies.get("authcode")
    if(aucokie==null){
      Cookies.set("authcode","",{path:"/",domain:"localhost",age:-1})
    }
  }

  //config.headers.setItem("token","")

  return config;
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
