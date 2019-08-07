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


//路由拦截
router.beforeEach((to, from, next)=>{

  //判断是否登录 to.meta.require是true说明需要进行登录的验证
  if(to.meta.require){
    let token = window.sessionStorage.getItem("token")
    if(token != null){
          next();
    }else{
      next({path:"/"})
    }
  }else{
    next();
  }
})

Vue.config.productionTip = false
//请求拦截器
axios.interceptors.request.use((config)=>{

  if(config.url.includes("getCode")){//如果是获取验证码的路径
    //没有Cookie的话添加Cookie
    let aucokie=Cookies.get("authcode")
    if(aucokie==null){
      Cookies.set("authcode","",{path:"/",domain:"localhost",age:-1})
    }
  }

  let token =  window.sessionStorage.getItem("token");
  config.headers['token']=token

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

import yinpin from '../static/tishiyin/tishiyin.mp3'
import aiya from '../static/tishiyin/aiya.mp3'
import en from '../static/tishiyin/en.mp3'
import qingsong from '../static/tishiyin/dahuaxiyou.mp3'

Vue.prototype.playAudio = (id,yinyue) => {
  let buttonAudio = document.getElementById(id);
  if(yinyue=="yinpin"){
    buttonAudio.setAttribute('src',yinpin)
  }
  if(yinyue=="en"){
    buttonAudio.setAttribute('src',en)
  }
  if(yinyue=="aiya"){
    buttonAudio.setAttribute('src',aiya)
  }
  if(yinyue=="qingsong"){
    buttonAudio.setAttribute('src',qingsong)
  }
  buttonAudio.play()
}
