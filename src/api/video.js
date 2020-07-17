import request from './index'

export function getVideoList(data) {
    return request({
      url: '/video/getVideoList',
      method:'post',
      data:data
    })
}
export function addVideo(data) {
    return request({
      url: '/video/addVideo',
      method:'post',
      data:data
    })
}

export function delVideo(data) {
    return request({
      url: '/video/delVideo',
      method:'post',
      data:data
    })
}

export function editVideo(data) {
  return request({
    url: '/video/editVideo',
    method:'post',
    data:data
  })
}