<template>
  <div class="picture">
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item >相册管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="card">
        <div class="guanli" @click="setPicture">
            <span>管理 </span><i class="el-icon-edit"></i>
        </div>
        <div class="lists">
            <div class="photo_cmp add" @click="addPicture">
                <div class="addtxt">
                    <i class="el-icon-picture-outline"></i>
                    <p>新建相册</p>
                </div>
            </div>
            <div class="photo_cmp" v-for="pic in pictureList" :key="pic._id" @click="$router.push({path:'/picturelist',query:{id:pic._id}})">
                <transition name="fade">
                    <div class="del" v-show="wantDel" @mouseenter="active" @mouseleave="unActtive">
                        <i class="el-icon-delete" @click.stop="delPictures(pic)"></i>
                    </div>
                </transition>
                <img class="picture" :src="pic.cover==''?require('../assets/img/timg.jpg'):pic.cover" :title="pic.createTime|dateFormat"/>
                <div class="title">{{pic.title}}</div>
                <div class="count">{{pic.count}}</div>
                <div class="tag" :style="{'borderColor':pic.tagColor}" v-if="pic.tag!=''"><span class="tagtxt">{{pic.tag}}</span></div>
            </div>
        </div>
        <div class="add_dialog">
            <el-dialog
            title="新建相册"
            :visible.sync="dialogVisible"
            width="400px"
            @close="handleClose">
                <el-form  label-width="70px" ref="addForm" :model="pictureInfo" :rules="rules" >
                    <el-form-item label="相册名" prop="title">
                        <el-input v-model.trim="pictureInfo.title"></el-input>
                    </el-form-item>
                    <el-form-item label="标签名" prop="tag">
                        <el-input v-model.trim="pictureInfo.tag"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="sureAdd">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
  </div>
</template>

<script>
import {addPictures,getPictures,delPicById} from "../network/picture"
export default {
  name: 'Picture',
  data () {
    return {
        dialogVisible:false,
        wantDel:false,
        pictureInfo:{
            title:'',
            tag:''
        },
        rules: {
            title: [
                { required: true, message: '请输入相册名', trigger: 'blur' },
                { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
            ],
            tag: [
                { min: 1, max: 2, message: '长度在 1 到 2个字符', trigger: 'change' }
            ],
        },  
        pictureList:[]
    }
  },
  methods:{
    handleClose(){
        this.$refs.addForm.resetFields();
    },
    setPicture(){
        if(this.pictureList.length>0)
            this.wantDel=!this.wantDel
    },
    active(e){
        e.currentTarget.children[0].className="el-icon-delete active"
    },
    unActtive(e){
        e.currentTarget.children[0].className="el-icon-delete"
    },
    delPictures(pic){
        if(pic.count==0)
            this.$confirm('确认删除此相册吗？')
            .then(async _ => {
                const res=await delPicById(pic._id)
                if(res.code==200){
                    this.wantDel=false
                    this.getPictureList()
                }
            })
            .catch(_ => {this.wantDel=false});
        else{
            this.$message({
                    message:'相册下还有很多照片，请先删除照片吧~',
                    type:'warning',
                    duration:1000
            })
            this.wantDel=false
        }
            
       
    },
    addPicture(){
        this.dialogVisible=true
    },
    sureAdd(){
        this.$refs['addForm'].validate(async (valid) => {
            if (valid) {
                const res=await addPictures(this.pictureInfo)
                
                if(res.code==200){
                    this.dialogVisible=false
                    this.getPictureList()
                }
                    
            } else {
                
                return false;
            }
        });
        
    },
    async getPictureList(){
        const res=await getPictures()
        
        if(res.code==200){
            this.pictureList=res.data
        }
            
    }
  },
  created(){
      
      this.getPictureList()
  }
}
</script>


<style scoped>
    .fade-enter-active, .fade-leave-active {
        transition: opacity .8s ease;
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
        opacity: 0;
    }
    /* .picture{
        width: 100%;
        height: 100%;
    } */
    .lists{
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
    }
    .picture .card {
       
        background: #e8f0d8;
        padding: 15px;
    }
    .photo_cmp{
        cursor: pointer;
        margin: 15px;
        position: relative;
        width: 180px;
        padding: 6px;
        height: 210px;
        background-color: #fefff7;
        box-shadow: 3px 3px 10px 3px rgba(0, 0, 0, 0.2);
    }
    .photo_cmp .picture{
        width: 168px;
        height: 168px;
        object-fit: cover;
        /* border-radius: 10px; */
    }
    .photo_cmp .title{
        margin-top: 2px;
        padding: 0 1px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: #333;
        font-size: 14px;
        text-align: center;
    }
    .photo_cmp .count{
        height: 30px;
        line-height: 30px;
        text-align: right;
        font-size: 24px;
        
        color: pink;
        position: absolute;
        right: 15px;
        top: 140px;
    }
    .tag{
        position: absolute;
        top: 0;
        left: 0;
        width: 0px;
        height: 0px;
        border: 20px;
        border-top: 30px;
        /* border-color: #89b41e; */
        border-bottom-color: transparent!important;
        border-style: solid;
    }
    .tagtxt{
        width: 40px;
        position: absolute;
        left: 50%;
        transform:translateX(-50%) ;
        top: -25px;
        text-align: center;
        font-size: 14px;
        color: #ffffff;
    }
    .el-icon-picture-outline:before{
        font-size: 45px;
        
    }
    .addtxt {
        font-size: 18px;
        color: #cccccc;
        display: flex;
        height: 90%;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    .addtxt p {
        letter-spacing: 1px;
        margin-top: 10px;
    }
    .add{
        
        box-shadow: none;
        border: 2px solid #e9eef3;
    }
    .del{
        position: absolute;
        width: 180px;
        height: 210px;
        top: 0;
        left: 0;
        z-index: 1;
        background: rgba(0, 0, 0, 0.5);
        text-align: center;
        line-height: 210px;
    }
    .el-icon-delete:before{
        color: #ccc;
        font-size: 60px;
        opacity: 1; 
    }
    .guanli{
        margin-left: 20px;
        margin-bottom: 10px;
        cursor: pointer;
        width: 80px;
        height: 30px;
        line-height: 30px;
        font-size: 16px!important;
        border-radius: 15px;
        text-align: center;
        background-color: #f78787;
        color: #ffffff;
    }
    .active::before{
        color: #f78787!important;
    }
</style>
