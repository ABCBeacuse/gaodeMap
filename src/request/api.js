import {post,get} from "./http"

export default{
    Login(req){  //用户登录
        // return post("/paas-web/api/auth/login",req)
        return post("/paas-web/api/auth/login",req)
    },
    getRoadName(){ //获取city-picker组件中显示的道路名称
        return get("/paas-web/api/device/getRoadName")
    },
    /* 
        主界面接口
    */
    getPipeType(){ //获取主界面开关中雨水，污水，暗渠，明沟，河道的pipeType
        return get("/paas-web/api/device/getPipeTypeName")
    },
    getMixedConcatPoint(){
        return get("/paas-web/api/mixed/concat")
    }
}