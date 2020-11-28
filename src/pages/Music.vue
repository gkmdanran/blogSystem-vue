<template>
    <div class="music">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item >音乐管理</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="card">
            <div class="heads">
                <el-input v-model="musicId" clearable placeholder="请输入网易云音乐ID"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="search()"></el-button>
            </div>
              <el-table
              stripe  border
                :data="songList"
                style="width: 100%">
                <el-table-column
                    prop="title"
                    label="歌名"
                    show-overflow-tooltip
                    >
                </el-table-column>
                <el-table-column
                    prop="artist"
                    label="歌手"
                    show-overflow-tooltip
                    >
                </el-table-column>
               
                <el-table-column
                    prop="cloudID"
                    label="网易云ID"
                    width="150px">
                </el-table-column>
                <el-table-column
                    prop="lrc"
                    label="歌词"
                    width="80px">
                    <template slot-scope="scope">
                        {{scope.row.lrc==''?'暂无歌词':'歌词完整'}}
                    </template>
                </el-table-column>
                 <el-table-column label="操作" width="120px">
                     <template slot-scope="scope">
                        <el-button  type="danger" icon="el-icon-delete" size="small" @click="delSong(scope.row._id)">删除音乐</el-button>
                       
                    </template>
                </el-table-column>
                </el-table>
        </div>
        <el-dialog
            title="查询结果"
            :visible.sync="dialogVisible"
            width="300px"
            >
            <div class="songitem">
                <span>歌名：</span><span>{{this.MusicForm.title}}</span>
            </div>
            <div class="songitem">
                <span>歌手：</span><span>{{this.MusicForm.artist}}</span>
            </div>
            <div class="songitem">
                <span>资源：</span><br><span>{{this.MusicForm.src}}</span>
            </div>
            <div class="songitem">
                <span>歌词：</span><span>{{this.MusicForm.lrc==''?'暂无歌词':'歌词完整'}}</span>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addMusic">添加</el-button>
            </span>
            </el-dialog>
    </div>
</template>

<script>
import {getCloudMusic,addSong,getSongs,deleteSong} from "../network/music"
export default {
    name: 'music',
    data () {
        return {
            dialogVisible:false,
            musicId:'',
            MusicForm:{
                title:'',
                pic:'',
                src:'',
                artist:'',
                cloudID:'',
                lrc:''
            },
            songList:[]
        }
    },
    methods:{
        async search(){
            
            if(this.musicId.trim()!='')
            Promise.all([
                getCloudMusic("detail",this.musicId),
                getCloudMusic("song",this.musicId),
                getCloudMusic("lyric",this.musicId)
                ]).then(([detail,music,words]) => {
                    if(detail&&detail.code==200&&detail.songs.length>0){
                        
                        this.MusicForm.title=detail.songs[0].name
                        this.MusicForm.pic=detail.songs[0].al.picUrl
                        var authorList=[]
                        for(let x of detail.songs[0].ar){
                            authorList.push(x.name)
                        }
                        this.MusicForm.artist=authorList.join("/")
                    }
                    
                    if(music&&music.code==200)
                        this.MusicForm.src=music.data[0].url
                    
                    if(words&&words.code==200&&words.lrc)
                        this.MusicForm.lrc=words.lrc.lyric
                    this.MusicForm.cloudID=this.musicId
                    
                    this.dialogVisible=true
                })
          
        },
        async addMusic(){
            if(this.MusicForm.title!=''&&this.MusicForm.src!=''){
                const res=await addSong(this.MusicForm)
                if(res.code==200){
                    this.dialogVisible=false
                    this.getSong()
                }
            }else{
                this.$message({
                 message:'资源不完整，无法添加',
                 type:'error',
                 duration:800
             })
            }
            
                
        },
        async getSong(){
            const res=await getSongs()
            if(res.code==200)
                this.songList=res.data
        },
        delSong(id){
            this.$confirm(`确认删除吗？`)
                .then(async _ => {
                    const res=await deleteSong(id)
                    
                    if(res.code==200){
                            this.getSong()
                        }
                })
                .catch(_ => {});
            
        }
    },
    created(){
        this.getSong()
    }
}
</script>


<style scoped>
    .songitem{
        margin-bottom: 10px;
    }
</style>
