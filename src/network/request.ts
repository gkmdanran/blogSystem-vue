import axios, { AxiosRequestConfig } from 'axios';
import Vue from 'vue'
import globalConfig from '../globalConfig'
export function request(config: AxiosRequestConfig): Promise<any> {
    const instance = axios.create({
        baseURL: `${globalConfig.serverUrl}/admin/api`,

    })
    instance.interceptors.request.use(config => {
        config.headers.Authorization = 'Bearer ' + (sessionStorage.getItem('blog_token') || '')
        return config
    }, err => {
        console.log(err)
    })
    instance.interceptors.response.use(res => {
        if (res.data.msg && res.data.msg != '')
            Vue.prototype.$message({
                message: res.data.msg,
                type: res.data.code == 200 ? 'success' : 'error',
                duration: 800
            })
        return res.data
    }, err => { })
    return instance(config)
}

export function requestBgc(config: AxiosRequestConfig): Promise<any> {
    const instance = axios.create({
        baseURL: `${globalConfig.serverUrl}/blog/api`,
    })
    return instance(config)
}
export function requestMusic(config: AxiosRequestConfig): Promise<any> {
    const instance = axios.create({
        baseURL: 'https://api.imjad.cn/cloudmusic/',
    })
    instance.interceptors.response.use(res => {
        return res.data
    }, err => { })
    return instance(config)
}