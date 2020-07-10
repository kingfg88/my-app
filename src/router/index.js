import Vue from 'vue'
import Router from 'vue-router'

import error from '../view/404'
import untoken from '../view/401'
import Login from '../view/user/login'
import index from '../view/index'

import Home from '../view/home/index'
import message from '../view/message/index'
import workbench from '../view/workbench/index'
import articleManagement from '../view/workbench/articleManagement'
import imageManagement from '../view/workbench/material/imageManagement'
import videoManagement from '../view/workbench/material/videoManagement'
import audioManagement from '../view/workbench/material/audioManagement'

Vue.use(Router)

export default new Router({
  routes: [
    {path: '*',component: error},//404
    {path: '/401',component: untoken},//401
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    
    {
      path: '/',
      name: 'index',
      component: index,
      children:[
        {
          path: '/home',
          name: 'Home',
          component: Home
        },
        {
          path: '/workbench',
          name:'workbench',
          component:workbench,
          children:[
            {
              path: 'articleManagement',
              name:'articleManagement',
              component: articleManagement
            },
            {
              path: 'material/imageManagement',
              name:'imageManagement',
              component: imageManagement
            },
            {
              path: 'material/videoManagement',
              name:'videoManagement',
              component: videoManagement
            },
            {
              path: 'material/audioManagement',
              name:'audioManagement',
              component: audioManagement
            },
          ]
        },
        {
          path: '/message',
          name: 'message',
          component: message
        },
      ]
    },
    
  ]
})
const originalPush = Router.prototype.push
   Router.prototype.push = function push(location) {
   return originalPush.call(this, location).catch(err => err)
}
