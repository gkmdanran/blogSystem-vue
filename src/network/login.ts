import {request,requestBgc} from "./request"
import {loginUserInfo} from '../types/login'
export const loginSystem=(userInfo:loginUserInfo)=>request({
    url:'/login',
    data:userInfo,
    method:'POST'
})
export const changePassword=(userName:string,oldPassword:string,newPassword:string)=>request({
    url:'/changepassword',
    data:{
        userName,
        oldPassword,
        newPassword,
    },
    method:'POST'
})
export const checkLogin=()=>request({
    url:'/checklogin',
    method:'POST'
})
export const getImg=()=>requestBgc({
    url:`/getskin`,
})