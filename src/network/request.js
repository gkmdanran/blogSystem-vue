import axios from 'axios'
import Vue from 'vue'
export  function request(config){
    const instance=axios.create({
        baseURL:'http://101.132.68.0:3000/admin/api',
        
    })
    instance.interceptors.request.use(config => {
       
            config.headers.Authorization='Bearer '+(sessionStorage.getItem('blog_token')||'')
        return config
    },err => {
        console.log(err)
    })
    instance.interceptors.response.use(res => {
        if(res.data.msg&&res.data.msg!='')
        Vue.prototype.$message({
            message:res.data.msg,
            type:res.data.code==200?'success':'error',
            duration:800
        })
        return res.data
    }, err => {
        // Vue.prototype.$message({
        //     message:err.response.data.msg,
        //     type:'error',
        //     duration:800
        // })

        
    })
    return instance(config)
 }
 export  function requestBgc(config){
    const instance=axios.create({
        baseURL:'http://101.132.68.0:3000/blog/api',
        
    })

    return instance(config)
 }
 export  function requestMusic(config){
    const instance=axios.create({
        baseURL:'https://api.imjad.cn/cloudmusic/',
       
    })
    instance.interceptors.response.use(res => {
            return res.data
    }, err => {})
    return instance(config)
}