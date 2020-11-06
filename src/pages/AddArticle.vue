<template>
    <div class="addarticle">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/article' }">文章管理</el-breadcrumb-item>
            <el-breadcrumb-item >{{isUpdate==false?'新增':'修改'}}文章</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="card">
            <div class="column">
                <span class="lab">博客标题</span>
                <el-input v-model="article.title" class="title"></el-input>
                <el-button type="danger" @click="saveToSession()">保存草稿</el-button>
                <el-button type="primary" @click="save()">发布博客</el-button>
            </div>
            <div class="column">
                <span class="lab">参考链接</span>
                <el-input v-model="article.otherhref" class="title"></el-input>
     
            </div>
            
            <div class="column">
                <span class="lab">博客标签</span>
                <el-tag
                    :key="tag._id"
                    v-for="tag in dynamicTags"
                    :type="tag.type"
                    closable
                    :disable-transitions="false"
                    @close="handleClose(tag._id)">
                    {{tag.tagName}}
                </el-tag>
                <el-input
                    class="input-new-tag"
                    v-if="inputVisible"
                    v-model.trim="inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm"
                    @blur="handleInputConfirm"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
                <div class="tishi" v-show="tagData.length>0">以下标签可供选择~</div>
                <div class="tagbox" v-show="tagData.length>0">
                    <el-tag
                        :key="item._id"
                        v-for="item in tagData"
                        :type="item.type"
                        @click="chooseTag(item._id)"
                        >
                        {{item.tagName}}
                    </el-tag>
                </div>
            </div>
             <mavon-editor
                ref="md"
                @imgAdd="handleEditorImgAdd"
                @imgDel="handleEditorImgDel"
                v-model="article.mdValue"
                navigation 
                @change="markChange" 
                @save="saveToSession"
                style="min-height: 500px"
            />
        </div>
    </div>
</template>

<script>
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import {getTags,addTags} from "../network/tags"
import {addArticle,getById,editArticle,addArticlePic,addFile} from "../network/article"
export default {
    name: 'AddArticle',
    data () {
        return {
            markdownOption: {
                bold: true, // 粗体
                italic: true, // 斜体
                header: true, // 标题
            },
            tagData:[],
            isUpdate:false,
            dynamicTags: [],
            inputVisible: false,
            inputValue: '',
            article:{
                title:'',
                context:'',
                contextText:'',
                tags:'',
                otherhref:'',
                mdValue:''
            },
            timer:'',
            updateId:'',
            imgFile:{}
        }
    },
    components:{// 在页面中注册组件
		mavonEditor 
	},
    methods:{
        handleClose(id) {
            var index=this.dynamicTags.findIndex(item=>item._id==id)
            if(index>=0)
            this.dynamicTags.splice(index, 1);
        },

        showInput() {
            this.inputVisible = true;
            this.$nextTick(_ => {
            this.$refs.saveTagInput.$refs.input.focus();
            });
        },

        async handleInputConfirm() {
            var colors=['success','info','warning','danger','']
            var max=colors.length-1
            var type=colors[Math.round(Math.random()*max)];
            if(this.inputValue&&this.inputValue!=''){
                if(this.dynamicTags.length>2){
                    this.inputVisible = false;
                    this.inputValue = '';   
                    return this.$message({
                        message:'最多添加3个',
                        type:'warning',
                        duration:800
                    })
                }    
                const res=await addTags(this.inputValue,type)
                if(res.code==200){        
                    this.dynamicTags.push(res.data);
                    this.getTag()
                }     
            }
            this.inputVisible = false;
            this.inputValue = '';   
            
        },
        async getTag(){
            const res=await getTags()
            this.tagData=res.data.list          
        },
        chooseTag(id){
            var tag=this.tagData.find(item=>item._id==id)
            var index=this.dynamicTags.findIndex(item=>item._id==tag._id)
            
            if(index==-1){
                if(this.dynamicTags.length>2)
                    return this.$message({
                        message:'最多添加3个',
                        type:'warning',
                        duration:800
                    })
                this.dynamicTags.push(tag)
            }
                
            else{
                this.$message({
                    message:'您已经添加该标签',
                    type:'warning',
                    duration:800
                })
            }
        },
        markChange (value, render) {
            // render 为 markdown 解析后的结果(转化成了HTML格式）
            this.article.mdValue=value
            this.article.context= render;
           
        },
        initArticle(){
            var content = this.article.context.replace(/<[^<>]+>/g,'');
            this.article.contextText=content.replace(/[\r\n]/g, " "); 
            var taglist=[]
            this.dynamicTags.forEach(item=>taglist.push(item._id))
            this.article.tags=taglist.join(',')
        },
        async save(){
            this.initArticle()
            if(this.article.title.trim()=='')
                return this.$message({
                    message:'标题不能为空~',
                    type:'warning',
                    duration:800
                })
            
            if(this.article.tags=='')
                return this.$message({
                    message:'请至少选择一个标签~',
                    type:'warning',
                    duration:800
                })
            if(this.article.context=='')
                return this.$message({
                    message:'写点什么再发布吧~',
                    type:'warning',
                    duration:800
                })
            
            localStorage.removeItem('article_session')
            var imglist=[]
            this.article.context.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function (match, capture) {
                if(imglist.indexOf(capture)==-1)
                imglist.push(capture)
            });
            
            if(this.isUpdate==false){
                const res=await addArticle(this.article,imglist.join(','))
                if(res.code==200)
                    this.$router.push('/article')
            }else{
                
                const res=await editArticle(this.article,this.updateId,imglist.join(','))
                if(res.code==200)
                    this.$router.push('/article')
            }
            
        },
        saveToSession(){
            this.initArticle()
            var article=JSON.stringify(this.article)
            localStorage.setItem('article_session',article)
            this.$message({
                message:'文章已缓存~',
                type:'success',
                duration:800
            })
        },
        autoSave(){
            
            this.timer=setInterval(()=>{
                var {context}=this.article
                if(context!='')
                    this.saveToSession()
            },120000)
        },
        async checkType(){
            if(this.$route.query.article_id){
                this.isUpdate=true
                const {data}=await getById(this.$route.query.article_id)
                
                var {_id,title,context,contextText,tags,otherhref,mdValue}=data
                if(!data._id)
                    return this.$router.push('/notarticle')
                this.updateId=_id
                this.article={
                    title,
                    context,
                    contextText,
                    tags,
                    otherhref,
                    mdValue
                }
                for (let x of tags.split(',')){
                    var tag=this.tagData.find(item=>item._id==x)
                    this.dynamicTags.push(tag)
                }
            }
            else if(localStorage.getItem('article_session')){
                var articleSession=localStorage.getItem('article_session')
                var article={
                    title:'',
                    context:'',
                    contextText:'',
                    tags:'',
                    otherhref:'',
                    mdValue:''
                }
                try {
                    article=JSON.parse(articleSession)
                } catch (error) {
                    localStorage.removeItem('article_session')
                    return this.$message({
                        message:'文章数据解析错误',
                        type:'error',
                        duration:1000
                    })
                }
                this.$message({
                        message:'获得草稿~',
                        type:'success',
                        duration:800
                    })
                this.article=article
                
                if(article.tags!='')
                    for (let x of article.tags.split(',')){
                        
                        var tag=this.tagData.find(item=>item._id==x)
                        this.dynamicTags.push(tag)
                    }
            }
        },
        async handleEditorImgAdd (pos, $file) {
            var formdata = new FormData()
            formdata.append('file', $file)
            this.imgFile[pos] = $file
            const res=await addArticlePic(formdata)
            await addFile(res.filename)
            
            if (res.url) {
                    let url = res.url
                    let name = $file.name
                    if (name.includes('-')) {
                        name = name.replace(/-/g, '')
                    }
                    let content = this.article.mdValue
                    // 第二步.将返回的url替换到文本原位置![...](0) -> ![...](url)  这里是必须要有的
                    if (content.includes(name)) {
                        let oStr = `(${pos})`
                        let nStr = `(${url})`
                        let index = content.indexOf(oStr)
                        let str = content.replace(oStr, '')
                        let insertStr = (soure, start, newStr) => {
                            return soure.slice(0, start) + newStr + soure.slice(start)
                        }
                        this.article.mdValue = insertStr(str, index, nStr)
                    }
            }
        },
        handleEditorImgDel (pos) {
            delete this.imgFile[pos[0]]
        },
    },
    async created(){
        await this.getTag()
        this.checkType()
        this.autoSave()
    },
    beforeDestroy(){
        clearInterval(this.timer)
        this.timer=null
    },
}
</script>


<style scoped>
    .title.el-input{
        width: calc(100% - 330px);
        margin-right: 10px;
    }
    .lab{
        display: inline-block;
        width: 80px;
        text-align: right;
        margin-right: 10px;
        height: 40px;
        line-height: 40px;
    }
    .column {
        margin-bottom: 5px;
        min-height: 40px;
    }
    .el-tag + .el-tag {
        margin-left: 10px;
    }
    .button-new-tag {
        margin-left: 10px;
        height: 32px;
        line-height: 30px;
        padding-top: 0;
        padding-bottom: 0;
    }
    .input-new-tag {
        width: 90px;
        margin-left: 10px;
        vertical-align: bottom;
    }
    .tagbox{
        width: 660px;
        margin-top: 10px;
        border: 1px solid #cccccc;
        border-radius: 10px;
        margin-left: 100px;
        min-height: 20px;
        display: flex;
        padding: 5px;
        flex-wrap: wrap;
        justify-content: flex-start;
    }
    .el-tag{
        min-width: 80px;
        text-align: center;
        
    }
    .tagbox .el-tag{
        margin-left: 10px;
        cursor: pointer;
        margin-bottom: 5px;
    }
    .tishi{
        color: #cccccc;
        font-size: 14px;
        margin-left: 110px;
        margin-top: 10px;
    }
    .nofile{
        font-size: 14px;
        color: #cccccc;
        font-style: italic;
    }
</style>
