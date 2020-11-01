import {request} from "./request"
export const addArticle=(article)=>request({
    url:'/addarticle',
    data:article,
    method:'POST'
})
export const getArticles=(query,tagquery,pageNum,pageSize)=>request({
    url:`/articles?query=${query}&tagquery=${tagquery}&pageNum=${pageNum}&pageSize=${pageSize}`,
})
export const delArticle=(ids)=>request({
    url:`/delarticle?`,
    method:'POST',
    data:{
        ids
    }
})
export const getById=(id)=>request({
    url:`/detailarticle?id=${id}`,
})

export const editArticle=(article,id)=>request({
    url:'/editarticle',
    data:{
        ...article,
        id,id},
    method:'POST'
})

export const TopArticle=(id,type)=>request({
    url:'/totop',
    data:{id,type},
    method:'POST'
})