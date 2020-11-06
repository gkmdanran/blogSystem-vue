import {request} from "./request"
export const addArticle=(article,imgs)=>request({
    url:'/addarticle',
    data:{article,imgs},
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

export const editArticle=(article,id,imgs)=>request({
    url:'/editarticle',
    data:{
        ...article,
        id,imgs},
    method:'POST'
})

export const TopArticle=(id,type)=>request({
    url:'/totop',
    data:{id,type},
    method:'POST'
})
export const addArticlePic=(formdata)=>request({
    url:'/upload',
    data:formdata,
    method:'POST'
})
export const addFile=(filename)=>request({
    url:'/addfile',
    data:{filename},
    method:'POST'
})