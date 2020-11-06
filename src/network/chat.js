import {request} from "./request"
export const getChats=(queryPeople,queryDate,pageNum,pageSize)=>request({
    url:`/chats?queryPeople=${queryPeople}&queryDate=${queryDate}&pageNum=${pageNum}&pageSize=${pageSize}`,
})
export const delChats=(ids)=>request({
    url:`/delchats?`,
    method:'POST',
    data:{
        ids
    }
})