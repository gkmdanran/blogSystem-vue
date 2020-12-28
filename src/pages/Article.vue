<template>
  <div class="article">
      <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item >文章管理</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="card">
            <div class="heads">
                <el-input v-model="query" placeholder="请输入文章标题" clearable @clear="search"></el-input>
                 <el-select v-model="tagquery" placeholder="请选择标签" clearable @clear="search">
                    <el-option
                    
                    v-for="item in tagSelectList"
                    :key="item.id"
                    :label="item.tagName"
                    :value="item._id">
                    </el-option>
                </el-select>
                <el-button type="primary" icon="el-icon-search" @click="search()"></el-button>
                <el-button type="primary" icon="el-icon-edit" @click="$router.push('/article/add')">写博客</el-button>
                <el-button type="danger" icon="el-icon-delete" @click="delarts">批量删除</el-button>
            </div>
            <el-table
                :data="articleData"
                style="width: 100%"
                stripe
                border
                @selection-change="handleSelectionChange">
                <el-table-column
                type="selection"
                fixed="left"
                width="40">
                </el-table-column>
                <el-table-column
                    prop="title"
                    label="文章标题"
                    show-overflow-tooltip
                >
                    <template slot-scope="scope">
                        <span class="title">
                            {{scope.row.title}}
                        </span> 
                    </template>
                </el-table-column>
                <el-table-column
                    prop="tagList"
                    label="标签"
                    width="320px"
                >
                    <template slot-scope="scope">
                       <el-tag v-for="tag in scope.row.tagList" 
                       :key="tag._id" 
                       :type="tag.type"  
                       disable-transitions>{{tag.tagName}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="contextText"
                    label="概要"
                    show-overflow-tooltip
                >
                    <template slot-scope="scope">
                        <span class="context_text">
                            {{scope.row.contextText.slice(0,20)}}
                        </span> 
                    </template>
                </el-table-column>
                <el-table-column
                    prop="star"
                    label="点赞数"
                    width="120px"
                >
                    <template slot-scope="scope">
                        <span>
                            <i class="el-icon-star-on"></i>
                            {{scope.row.star>=10000?scope.row.star/10000+'w':scope.row.star>=1000?scope.row.star/1000+'k':scope.row.star}}
                            </span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="createTime"
                    label="发表日期"
                    width="180px"
                >
                    <template slot-scope="scope">
                        <span>{{scope.row.createTime|dateFormat}}</span>
                    </template>
                </el-table-column>
                
                <el-table-column label="操作" width="370px">
                     <template slot-scope="scope">
                        <el-button  type="primary" icon="el-icon-edit" size="small" @click="editArticle(scope.row._id)">编辑文章</el-button>
                        <el-button  type="danger" icon="el-icon-delete" size="small" @click="deleteArticle(scope.row._id)">删除文章</el-button>
                        <el-button  :type="scope.row.isTop==0?'info':'success'" :icon="scope.row.isTop==0?'el-icon-upload2':'el-icon-download'" size="small" @click="toTop(scope.row)">
                            {{scope.row.isTop==0?'置顶文章':'取消置顶'}}
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pageNum"
                :page-sizes="[1, 3, 5]"
                :page-size="pageSzie"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
      </div>
  </div>
</template>

<script>
import {getArticles,delArticle,TopArticle} from "../network/article"
import {getTags} from "../network/tags"
export default {
    name: 'Article',
    data () {
        return {
            query:'',
            articleData:[],
            tagSelectList:[],
            pageNum:1,
            pageSzie:5,
            total:0,
            query:'',
            tagquery:'',
            multipleSelection:[]
        }
    },
    methods:{
        handleSelectionChange(val) {
            this.multipleSelection = val;
            
        },
        handleSizeChange(val) {
            this.pageSzie=val
            this.getArticle()
        },
        handleCurrentChange(val) {
            this.pageNum=val
            this.getArticle()
        },
        async getArticle(){
            const res=await getArticles(this.query,this.tagquery,this.pageNum,this.pageSzie)
            
            this.articleData=res.data.list
            this.total=res.data.total
        },
        deleteArticle(ids){
            this.$confirm(`确认删除这篇文章吗？`)
                .then(async _ => {
                    await delArticle(ids)
                    this.getArticle()
                })
                .catch(_ => {});
            
        },
        delarts(){
            var list=[]
            this.multipleSelection.forEach(art=>{
                list.push(art._id)
            })
            if(list.length>0)
            this.$confirm(`确认删除${list.length}篇文章吗？`)
                .then(async _ => {
                    await delArticle(list.join(','))
                    this.getArticle()
                })
                .catch(_ => {});
        },
        async getTag(){
            const res=await getTags()
            
            this.tagSelectList=res.data.list          
        },
        search(){
            this.pageNum=1
            this.pageSzie=5
            this.getArticle()
        },
        editArticle(id){
            this.$router.push({
                path:'article/add',
                query:{
                    article_id:id
                }
            })
        },
        async toTop(article){
            var type=article.isTop==1?0:1
            const res=await TopArticle(article._id,type)
            if(res.code==200)
                this.getArticle()
        }
    },
    created(){
        if(this.$route.params.tagId)
            this.tagquery=this.$route.params.tagId
        this.getArticle()
        this.getTag()
    }
}
</script>


<style scoped>
    .el-icon-star-on:before{
        font-size: 20px;
        position: relative;
        top: 2px;
        
        color: #F56C6C;
    }
    .title {
        font-weight: 700;
    }
    .context_text{
        font-style: italic;
        color: #cccccc;
    }
    .el-tag + .el-tag {
        margin-left: 10px;
    }
    .el-tag{
        min-width: 80px;
        text-align: center;
        
    }
</style>
