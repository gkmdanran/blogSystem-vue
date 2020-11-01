import {request} from "./request"
export const addPictures=(pictureInfo)=>request({
    url:'/addpicture',
    data:pictureInfo,
    method:'POST'
})
export const getPictures=()=>request({
    url:`/pictures`,
})
export const delPicById=(id)=>request({
    url:'/delpic',
    data:{id},
    method:'POST'
})
export const getPicById=(id)=>request({
    url:`/detailpicture?id=${id}`,
})
export const addPicList=(id,filename,count)=>request({
    url:'/addlist',
    data:{id,filename,count},
    method:'POST'
})
export const delPicList=(id,filename,delList,count)=>request({
    url:'/dellist',
    data:{id,filename,count,delList},
    method:'POST'
})
export const changeCover=(id,cover)=>request({
    url:'/changecover',
    data:{id,cover},
    method:'POST'
})
export const editPictures=(id,title,tag,password)=>request({
    url:'/editpictures',
    data:{id,title,tag,password},
    method:'POST'
})