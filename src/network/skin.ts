import {request} from "./request"
import {skinForm} from '../types/skin'
export const getSkins=()=>request({
    url:`/skins`,
})
export const deluUploads=(filename:string)=>request({
    url:'/deluploads',
    data:{filename},
    method:'POST'
})
export const addSkin=(skin:skinForm)=>request({
    url:'/addskin',
    data:skin,
    method:'POST'
})
export const delSkin=(id:string,filename:string)=>request({
    url:'/delskin',
    data:{id,filename},
    method:'POST'
})