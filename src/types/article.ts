import { tagObj } from './tags'
export interface articleObj {
    context: string
    contextText?: string
    createTime?: string
    isTop?: number
    mdValue: string
    otherhref: string
    star?: number
    tagList?: Array<tagObj>
    tags: string
    title: string
    updateTime?: string
    __v?: number
    _id?: string
}
export interface mdOption {
    bold: boolean
    italic: boolean
    header: boolean
}