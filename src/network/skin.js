import {request} from "./request"
export const getSkins=()=>request({
    url:`/skins`,
})
export const deluUploads=(filename)=>request({
    url:'/deluploads',
    data:{filename},
    method:'POST'
})
export const addSkin=(skin)=>request({
    url:'/addskin',
    data:skin,
    method:'POST'
})
export const delSkin=(id,filename)=>request({
    url:'/delskin',
    data:{id,filename},
    method:'POST'
})