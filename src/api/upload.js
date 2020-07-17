import request from './index'

export function upload(data) {
    return request({
      url: '/user/upload',
      method:'post',
      data:data
    })
}