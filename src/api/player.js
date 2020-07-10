import request from './index'

export function getplayer(data) {
    return request({
      url: '/player/getplayer',
      method:'post',
      data:data
    })
}
export function addplayer(data) {
    return request({
      url: '/player/addplayer',
      method:'post',
      data:data
    })
}

export function delplayer(data) {
    return request({
      url: '/player/delplayer',
      method:'post',
      data:data
    })
}

export function editplayer(data) {
  return request({
    url: '/player/editplayer',
    method:'post',
    data:data
  })
}