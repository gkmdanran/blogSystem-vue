import {request} from "./request"
export const getFiles=()=>request({
    url:`/getfilelists`,
})
export const clearFiles=()=>request({
    url:`/clearfile`,
})