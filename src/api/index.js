import axios from 'axios';
import router from '../router/index'
import { MessageBox, Message ,Loading } from 'element-ui'

const service = axios.create({
    baseURL:process.env.BASE_API,
    timeout: 5000,
    headers: {
        // 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        'Content-Type': 'application/json;charset=UTF-8'
    }
})
// 请求拦截器
service.interceptors.request.use(
    config => {
    const token = localStorage.getItem('accessToken')
    //请求前是否已获取token，如果有设置token为X-Token,
      if (token) {
        config.headers['authorization'] = `Bearer ${token}`
      }
      return config
    },
    error => {
      return Promise.reject(error)
    }
  )
//响应拦截器
service.interceptors.response.use(
    response=>{
        if(response.status !== 200){
            if(response.status == 404 || res.code == 403){
                MessageBox.confirm('您已经登出，您可以取消以停留在此页面，或再次登录', '确认注销', {
                    confirmButtonText: '重新登录',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    // store.dispatch('user/resetToken').then(() => {
                    //     location.reload()
                    // })
                })
            }
        }else{
            return response.data
        }
    },
    error => {
        if(error.response.status === 401){
            router.replace({
                path:'/401',
                query:{redirect:router.currentRoute.fullPath}
            })
            // MessageBox.confirm('登录过期,请重新登录', '确认注销', {
            //     confirmButtonText: '重新登录',
            //     cancelButtonText: '取消',
            //     type: 'warning'
            // }).then(() => {
            //     //跳转到登陆页并携带参数为当前路由地址
            //     router.replace({
            //         path:'/login',
            //         query:{redirect:router.currentRoute.fullPath}
            //     })
            // })
        }
        return Promise.reject(error)
    }
)
const request = (params)=>{
    let loadingInstance = Loading.service({
        lock: true,
        text: '拼命加载中...',
        background: 'rgba(0, 0, 0, 0.7)'
    });
    return new Promise((resolve,reject)=>{
        service({...params}).then((res)=>{
            resolve(res)
        }).catch((err)=>{
            reject(err)
        })
        loadingInstance.close();
    })
}
export default request
