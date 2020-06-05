import request from './index'

export function login(data) {
    return request({
      url: '/login',
      method:'post',
      data:data
    })
}
export function registe(data) {
  return request({
    url: '/registe',
    method:'post',
    data:data
  })
}