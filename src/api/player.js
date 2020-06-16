import request from './index'

export function getplayer(data) {
    return request({
      url: '/getplayer',
      method:'post',
      data:data
    })
}
export function addplayer(data) {
    return request({
      url: '/addplayer',
      method:'post',
      data:data
    })
}

export function delplayer(data) {
    return request({
      url: '/delplayer',
      method:'post',
      data:data
    })
}

export function editplayer(data) {
  return request({
    url: '/editplayer',
    method:'post',
    data:data
  })
}