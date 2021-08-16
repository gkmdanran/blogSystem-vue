import {request} from "./request"
export const getChats=(queryPeople:string,queryDate:any,pageNum:number,pageSize:number)=>request({
    url:`/chats?queryPeople=${queryPeople}&queryDate=${queryDate}&pageNum=${pageNum}&pageSize=${pageSize}`,
})
export const delChats=(ids:string)=>request({
    url:`/delchats?`,
    method:'POST',
    data:{
        ids
    }
})