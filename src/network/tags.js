import {request} from "./request"
export const getTags=(query,pageNum,pageSize)=>request({
    url:`/tags?query=${query}&pageNum=${pageNum}&pageSize=${pageSize}`,
})
export const addTags=(tagName,type)=>request({
    url:`/addtag?`,
    method:'POST',
    data:{
        tagName,
        type
    }
})
export const delTag=(id)=>request({
    url:`/deltag?`,
    method:'POST',
    data:{
        id
    }
})
