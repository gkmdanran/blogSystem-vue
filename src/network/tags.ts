import { request } from "./request"
export const getTags = (query?: string, pageNum?: number, pageSize?: number) => request({
    url: `/tags?query=${query}&pageNum=${pageNum}&pageSize=${pageSize}`,
})
export const addTags = (tagName: string, type: string) => request({
    url: `/addtag?`,
    method: 'POST',
    data: {
        tagName,
        type
    }
})
export const delTag = (id: string) => request({
    url: `/deltag?`,
    method: 'POST',
    data: {
        id
    }
})
