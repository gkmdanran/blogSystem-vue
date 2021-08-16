import {request} from "./request"
import {  picInfo } from "../types/picture";
export const addPictures=(pictureInfo:picInfo)=>request({
    url:'/addpicture',
    data:pictureInfo,
    method:'POST'
})
export const getPictures=()=>request({
    url:`/pictures`,
})
export const delPicById=(id:string)=>request({
    url:'/delpic',
    data:{id},
    method:'POST'
})
export const getPicById=(id:string | (string | null)[])=>request({
    url:`/detailpicture?id=${id}`,
})
export const addPicList=(id:string,filename:string,count:number)=>request({
    url:'/addlist',
    data:{id,filename,count},
    method:'POST'
})
export const delPicList=(id:string,filename:string,delList:string,count:number)=>request({
    url:'/dellist',
    data:{id,filename,count,delList},
    method:'POST'
})
export const changeCover=(id:string,cover:string)=>request({
    url:'/changecover',
    data:{id,cover},
    method:'POST'
})
export const editPictures=(id:string,title:string,tag:string,password:string)=>request({
    url:'/editpictures',
    data:{id,title,tag,password},
    method:'POST'
})