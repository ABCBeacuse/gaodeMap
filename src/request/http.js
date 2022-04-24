import axios from "axios"

//请求拦截器  
axios.interceptors.request.use(config=>{
    //每次发送请求之前判断vuex中是否存在token
    //如果存在，则统一在http请求的header都加上token，后台根据token判断你的登录情况
    //即使本地存在token，也有可能token是过期的，所以在响应拦截器上要对返回状态进行判断
    if(window.sessionStorage.getItem("token")){
        config.headers.Authorization = "Bearer " + window.sessionStorage.getItem("token");
        config.headers["X-Auth-Token"] = window.sessionStorage.getItem("token");
    }
    error =>{
        return Promise.reject(error)
    } 
    return config  //这里为啥要return???
})

//get方法，对于get请求
export function get(url,params){
    return new Promise((resolve,reject)=>{
        axios.get(url,params).then((res)=>{
            resolve(res.data)
        }).catch(err=>{
            reject(err.data)
        })
    })
}
//post方法，对于post请求
export function post(url,params){
    return new Promise((resolve,reject)=>{
        axios.post(url,params).then((res)=>{
            resolve(res.data)
        }).catch(err=>{
            reject(err.data)
        })
    })
}


