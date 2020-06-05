import Vue from 'vue'
import Router from 'vue-router'

import Login from '../view/user/login'
import Home from '../view/home/index'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/home',
      name: 'Home',
      component: Home
    },
  ]
})
