import Vue from 'vue'
import Router from 'vue-router'

import Login from '../view/user/login'
import index from '../view/index'

import Home from '../view/home/index'
import Center from '../view/user/center'
import Form from '../view/form/index'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/center',
      name: 'Center',
      component: Center
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
          path: '/form',
          name: 'Form',
          component: Form
        },
      ]
    },
    
  ]
})
