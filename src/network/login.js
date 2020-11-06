import {request} from "./request"
export const loginSystem=(userInfo)=>request({
    url:'/login',
    data:userInfo,
    method:'POST'
})
export const changePassword=(userName,oldPassword,newPassword)=>request({
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