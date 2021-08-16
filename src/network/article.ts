import {request} from "./request"
import {articleObj} from '../types/article'
export const addArticle=(article:articleObj,imgs:string)=>request({
    url:'/addarticle',
    data:{article,imgs},
    method:'POST'
})
export const getArticles=(query:string,tagquery:string,pageNum:number,pageSize:number)=>request({
    url:`/articles?query=${query}&tagquery=${tagquery}&pageNum=${pageNum}&pageSize=${pageSize}`,
})
export const delArticle=(ids:string)=>request({
    url:`/delarticle`,
    method:'POST',
    data:{
        ids
    }
})
export const getById=(id:string | (string | null)[])=>request({
    url:`/detailarticle?id=${id}`,
})

export const editArticle=(article:articleObj,id:string,imgs:string)=>request({
    url:'/editarticle',
    data:{
        ...article,
        id,imgs},
    method:'POST'
})

export const TopArticle=(id:string,type:number)=>request({
    url:'/totop',
    data:{id,type},
    method:'POST'
})
export const addArticlePic=(formdata:FormData)=>request({
    url:'/upload',
    data:formdata,
    method:'POST'
})
export const addFile=(filename:string)=>request({
    url:'/addfile',
    data:{filename},
    method:'POST'
})