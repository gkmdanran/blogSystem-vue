import {requestMusic,request} from "./request"
import { MusicForm } from "../types/music";
export const getCloudMusic=(type:string,id:string)=>requestMusic({
    url:`?type=${type}&id=${id}&br=128000`,
})
export const addSong=(music:MusicForm)=>request({
    url:`/addsong`,
    method:'POST',
    data:music
})
export const getSongs=()=>request({
    url:`/songs`,
})
export const deleteSong=(id:string)=>request({
    url:`/delsong`,
    data:{id},
    method:'POST',
})