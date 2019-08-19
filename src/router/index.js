import Vue from 'vue'
import Router from 'vue-router'
import login from '../view/login/login'
import shouye from '../view/shouye/shouye'
import datamenu from '../view/shouye/datamenu'
import datamain from '../view/shouye/datamain'
import system from '../view/shouye/system'
import roledata from '../view/shouye/role/roledata'
import userdata from '../view/shouye/user/userdata'
import menudata from '../view/shouye/menu/menudata'
import email from '../view/email/email'
Vue.use(Router)

export default new Router({
  mode:'history',
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
      path: '/email',
      name: 'email',
      component: email,
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
            {
              path: "/system",
              component: system,
              meta: {require: true}
            },
            {
              path: "/userdata",
              component: userdata,
              meta:{require:true}
            },
            {
              path: "/roledata",
              component: roledata,
              meta:{require:true}
            },
            ,
            {
              path: "/menudata",
              component: menudata,
              meta:{require:true}
            }
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
