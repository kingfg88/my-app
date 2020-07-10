import request from './index'

export function getArticleList(data) {
    return request({
      url: '/article/getArticleList',
      method:'post',
      data:data
    })
}
export function addArticle(data) {
    return request({
      url: '/article/addArticle',
      method:'post',
      data:data
    })
}

export function delArticle(data) {
    return request({
      url: '/article/delArticle',
      method:'post',
      data:data
    })
}

export function editArticle(data) {
  return request({
    url: '/article/editArticle',
    method:'post',
    data:data
  })
}

export function detailArticle(data){
  return request({
    url:'/article/detailArticle',
    method:'post',
    data:data
  })
}