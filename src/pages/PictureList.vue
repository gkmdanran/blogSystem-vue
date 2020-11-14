<template>
    <div class="picture_list">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/picture' }">相册管理</el-breadcrumb-item>
            <el-breadcrumb-item >{{PictureInfo.title}}</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="card">
            <div class="heads">
                <div class="guanli" :style="{'backgroundColor':'#409eff'}" @click="dialogVisible=true">
                    <span>设置相册</span><i class="el-icon-money"></i>
                </div>
                <div class="guanli" @click="setList">
                    <span>{{wantDel?'退出管理':'批量管理'}}</span><i class="el-icon-edit"></i>
                </div>
                <div class="guanli" :style="{'backgroundColor':'#545c64'}" @click="setCover">
                    <span>设置封面</span><i class="el-icon-picture-outline"></i>
                </div>
            
            <el-checkbox v-show="wantDel&&previewList.length>0"  v-model="checkAll" @change="handleCheckAllChange" class="all">全选图片</el-checkbox>
            <i class="el-icon-delete" v-show="wantDel&&previewList.length>0" @click="deletelist"></i>
            </div>
                <el-checkbox-group v-model="checkedPics" @change="handleCheckedCitiesChange">
                    <div class="img" v-for="pic in previewList" :key="pic">
                        <el-checkbox class="checkimg" :label="pic" v-show="wantDel"></el-checkbox>
                        <el-image
                        style="width: 100%; height: 100%"
                        :src="pic"
                        :preview-src-list="previewList"
                        fit="cover"
                        
                        >
                        </el-image>
                    </div>
                </el-checkbox-group>
                <el-upload
                        action="http://localhost:3000/admin/api/upload"
                        multiple
                        list-type="picture-card"
                        :headers="header"
                        :on-success="uploadSuccess"
                        :on-change="changeList"
                        >
                        <i class="el-icon-plus"></i>
                </el-upload>
        </div>
        <div class="add_dialog">
            <el-dialog
            title="新建相册"
            :visible.sync="dialogVisible"
            width="400px"
            @close="handleClose">
                <el-form  label-width="70px" ref="editForm" :model="PictureInfo" :rules="rules" >
                    <el-form-item label="相册名" prop="title">
                        <el-input v-model.trim="PictureInfo.title"></el-input>
                    </el-form-item>
                    <el-form-item label="标签名" prop="tag">
                        <el-input v-model.trim="PictureInfo.tag"></el-input>
                    </el-form-item>
                    <el-form-item label="相册密码" prop="password">
                        <el-input v-model.trim="password"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="sureEdit">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import {getPicById,addPicList,delPicList,changeCover,editPictures} from "../network/picture"
export default {
    name: 'PictureList',
    data () {
        return {
            password:'',
            rules: {
                title: [
                    { required: true, message: '请输入相册名', trigger: 'blur' },
                    { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
                ],
                tag: [
                    { min: 1, max: 2, message: '长度在 1 到 2个字符', trigger: 'change' }
                ],
                password: [
                    { min: 6, max: 16, message: '长度在 6 到 16个字符', trigger: 'change' }
                ],
            },  
            dialogVisible:false,
            header:{
                'Authorization':'Bearer '+(sessionStorage.getItem('blog_token')||'')
            },
            PictureInfo:{},
            previewList:[],
            checkAll: false,
            checkedPics: [],
            fileList:[],
            wantDel:false,
            // checkCount:0,
            fileCount:0,
            centerCount:0
        }
    },
    methods:{
        handleClose(){
            this.$refs.editForm.resetFields();
        },
        handleCheckAllChange(val) {
            this.checkedPics = val ? this.previewList : [];
        },
        handleCheckedCitiesChange(value) {
            let checkedCount = value.length;
            this.checkAll = checkedCount === this.previewList.length;
        },
        setList(){
            if(this.previewList.length>0){
                this.wantDel=!this.wantDel
                this.checkedPics=[]
                this.checkAll = false
            }
                
        },
        changeList(file, fileList){
            this.fileCount=fileList.length
            // console.log(this.fileCount)
        },
        uploadSuccess(response, file, fileList){
            this.fileList.push(response.filename)
            this.centerCount+=1
            // console.log(this.fileList.length,this.fileCount)
            if(this.centerCount==this.fileCount){
                this.addPhoto()
            }
            
        },
        async addPhoto(){
            var list=this.PictureInfo.picDetailList==''?[]:this.PictureInfo.picDetailList.split(',')
            var str=[...list,...this.fileList].join(',')
            var count=[...list,...this.fileList].length
            // console.log(str,count)
            await addPicList(this.PictureInfo._id,str,count)
            this.fileList=[]
            this.fileCount=0
            this.getDeailInfo()
            // console.log(this.fileList)
            
        },
        async getDeailInfo(){
            
            var id=this.$route.query.id
            const {data,code}=await getPicById(id)
            // console.log(data)
            if(!data._id)
                return this.$router.push('/notpicture')
            if(code==200){
                 this.PictureInfo=data
                 this.previewList=this.PictureInfo.picDetailList==''?[]:this.PictureInfo.picDetailList.split(',').map(item=>'http://localhost:3000/uploads/'+item)
                 
            }
               
        },
        async deletelist(){
            if(this.checkedPics.length>0){
                var arr1=this.previewList
                var arr2=this.checkedPics
                let diff = arr1.filter(function (val) { return arr2.indexOf(val) === -1 })
                var count=diff.length
                diff=diff.join('')
                var str='http://localhost:3000/uploads/'
                let filename=diff.split(str).join(',').substr(1)
                // console.log(arr1)
                // console.log(arr2)
                // console.log(filename,count)
                
                const res=await delPicList(this.PictureInfo._id,filename,arr2.join(','),count)
                if(res.code==200)
                    this.getDeailInfo()
                    this.checkedPics=[]
                    this.checkAll=false
                }
                if(count==0)this.wantDel=false
        },
        async setCover(){
            if(this.checkedPics.length!=1){
                this.$message({
                    message:'请选择一张照片~',
                    type:'warning',
                    duration:800
                })
            }
            else{
                var res=await changeCover(this.PictureInfo._id,this.checkedPics[0])
                if(res.code==200){
                    this.wantDel=false
                    this.checkedPics=[]
                }

            }
        },
        sureEdit(){
            this.$refs['editForm'].validate(async (valid) => {
                if (valid) {
                    const res=await editPictures(this.PictureInfo._id,this.PictureInfo.title,this.PictureInfo.tag,this.password)
                    
                    if(res.code==200){
                        this.dialogVisible=false
                        this.getDeailInfo()
                    }
                        
                } else {
                    
                    return false;
                }
            });
        
        },
    },
    created(){     
        this.getDeailInfo()
    }
}
</script>


<style scoped>
    .heads{
        margin-bottom: 0;
    }
    .picture_list .card {
        background: #e8f0d8;
        padding-left: 10px;
        padding-right: 10px;
    }
    .el-icon-delete {
        float: right;
        font-size: 25px;
        margin-right: 30px;
        cursor: pointer;
        color: red;
        font-weight: 700;
    }
    .el-checkbox-group{
        width: 100%;
        min-height: 20px;
        display: flex;
        flex-wrap: wrap;
    }
   
    .guanli{
        display: inline-block;
        margin-left: 10px;
        margin-bottom: 10px;
        cursor: pointer;
        width: 120px;
        height: 30px;
        line-height: 30px;
        font-size: 16px!important;
        border-radius: 15px;
        text-align: center;
        background-color: #f78787;
        color: #ffffff;
    }
    .img{
        border: 1px solid #f6f6f6;
        position: relative;
        width: 175px;
        height: 175px;
        margin: 10px 10px;
        background: #ffffff;
    }
    .el-checkbox.checkimg{
        position: absolute;
        top: 5px;
        left:5px
    }
    .el-checkbox.all{
        margin-left: 15px;
    }
    
</style>
<style >
    .picture_list  .checkimg .el-checkbox__label{
        display: none!important;
    }
    .picture_list .el-upload-list.el-upload-list--picture-card{
        display: none!important;
    }
    .picture_list .el-upload.el-upload--picture-card{
        margin-left: 10px;
        margin-top: 15px;
    }
</style>