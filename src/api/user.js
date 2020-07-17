import request from './index'

export function login(data) {
    return request({
      url: '/user/login',
      method:'post',
      data:data
    })
}
export function registe(data) {
  return request({
    url: '/user/registe',
    method:'post',
    data:data
  })
}

export function userInfo() {
  return request({
    url: '/user/userInfo',
    method:'get'
  })
}

export function editInformation(data){
  return request({
    url:'/user/editInformation',
    method:'post',
    data:data
  })
}