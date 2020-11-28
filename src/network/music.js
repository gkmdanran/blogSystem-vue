import {requestMusic,request} from "./request"
export const getCloudMusic=(type,id)=>requestMusic({
    url:`?type=${type}&id=${id}&br=128000`,
})
export const addSong=(music)=>request({
    url:`/addsong`,
    method:'POST',
    data:music
})
export const getSongs=()=>request({
    url:`/songs`,
})
export const deleteSong=(id)=>request({
    url:`/delsong`,
    data:{id},
    method:'POST',
})