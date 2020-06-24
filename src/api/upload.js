import request from './index'

export function upload(data) {
    return request({
      url: '/upload',
      method:'post',
      data:data
    })
}