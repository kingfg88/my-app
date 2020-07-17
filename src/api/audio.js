import request from './index'

export function getAudioList(data) {
    return request({
      url: '/audio/getAudioList',
      method:'post',
      data:data
    })
}
export function addAudio(data) {
    return request({
      url: '/audio/addAudio',
      method:'post',
      data:data
    })
}

export function delAudio(data) {
    return request({
      url: '/audio/delAudio',
      method:'post',
      data:data
    })
}

export function editAudio(data) {
  return request({
    url: '/audio/editAudio',
    method:'post',
    data:data
  })
}