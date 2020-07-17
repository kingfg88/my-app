import request from './index'

export function getImageList(data) {
    return request({
      url: '/img/getImageList',
      method:'post',
      data:data
    })
}
export function addImage(data) {
    return request({
      url: '/img/addImage',
      method:'post',
      data:data
    })
}

export function delImage(data) {
    return request({
      url: '/img/delImage',
      method:'post',
      data:data
    })
}

export function editImage(data) {
  return request({
    url: '/img/editImage',
    method:'post',
    data:data
  })
}