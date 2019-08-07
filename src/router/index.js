import Vue from 'vue'
import Router from 'vue-router'
import login from '../view/login/login'
import shouye from '../view/shouye/shouye'
import datamenu from '../view/shouye/datamenu'
import datamain from '../view/shouye/datamain'
import system from '../view/shouye/system'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: login,
      meta:{
        require: false
      }
    },
    {
      path: '/view/shouye/shouye',
      name: 'shouye',
      component: shouye,
      meta:{
        require:true//该路径的访问需要登录
      },
      children:[
        {
          path: "/datamain",
          component: datamain,
          children: [
            {path:'/system',component:system,meta:{require:true}}
          ]
        }
      ]
    },
    {
      path:"/datamenu",
      component:datamenu,
      meta:{require:true}
    }
  ]
})
