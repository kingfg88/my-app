import request from './index'

export function getperson(data) {
    return request({
      url: '/person/getPersonList',
      method:'post',
      data:data
    })
}
export function addperson(data) {
    return request({
      url: '/person/addPerson',
      method:'post',
      data:data
    })
}

export function delperson(data) {
    return request({
      url: '/person/delPerson',
      method:'post',
      data:data
    })
}

export function editperson(data) {
  return request({
    url: '/person/editPerson',
    method:'post',
    data:data
  })
}