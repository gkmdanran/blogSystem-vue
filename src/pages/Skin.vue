<template>
    <div class="skin">
         <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item >皮肤管理</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="card">
                <div class="heads">
                    <el-button  type="primary" icon="el-icon-plus" @click="showAdd">添加皮肤</el-button>
                </div>
                <el-table :data="skinData" style="width: 100%" stripe border >
                    <el-table-column type="index" >
                    </el-table-column>
                
                    <el-table-column prop="skinUrl" label="预览">
                        <template slot-scope="scope">
                            <el-image
                                style="width: 50px; height: 50px"
                                :src="scope.row.skinUrl"
                                fit="cover"
                                :preview-src-list="[scope.row.skinUrl]"
                               ></el-image>
                        </template>
                    </el-table-column>
                    <el-table-column prop="showTime" label="触发日期">
                        <template slot-scope="scope">
                            <span>{{scope.row.showTime==''||scope.row.showTime==null?'随时':scope.row.showTime}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column  label="操作">
                        <template slot-scope="scope">
                            <el-button  type="danger" icon="el-icon-delete" size="small" @click="deleteSkin(scope.row)">删除皮肤</el-button>
                        </template>
                    </el-table-column>
                </el-table>
        </div>
        <div class="add">
            <el-dialog
                title="添加皮肤"
                :visible.sync="dialogVisible"
                width="400px"
                :before-close="handleClose"
                limit="1">
                <el-form :model="skinForm" :rules="rules"  ref="skinForm" label-width="80px" class="demo-ruleForm">
                    <el-form-item label="触发日期" prop="showTime">
                        <el-date-picker
                            v-model="skinForm.showTime"
                            type="date"
                            placeholder="选择触发日期"
                            >
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="皮肤" prop="skinUrl">
                        <el-upload
                            ref="upload"
                            action="http://101.132.68.0:3000/admin/api/upload"
                            :headers="header"
                            list-type="picture-card"
                            :on-success="uploadSuccess"
                            :on-remove="handleRemove"
                            :on-change="changeImg"
                            :limit="1"
                            :file-list="fileList"
                            :class="{hide:hideUpload}">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="handleClose">取 消</el-button>
                    <el-button type="primary" @click="saveSkin">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import {getSkins,deluUploads,addSkin,delSkin} from "../network/skin"
export default {
    name: 'Skin',
    data () {
        return {
            header:{
                'Authorization':'Bearer '+(sessionStorage.getItem('blog_token')||'')
            },
            fileList:[],
            hideUpload: false,
            skinData:[],
            dialogVisible:false,
            skinForm:{
                showTime:'',
                skinUrl:''
            },
            rules: {
                skinUrl: [
                    { required: true, message: '请上传图片', trigger: 'change' },
                ],
            }       
        }
    },
    methods:{
        showAdd(){
            this.dialogVisible=true
        },
        deleteSkin(skin){
            this.$confirm(`确认删除这皮肤吗？`)
                .then(async _ => {
                    
                    await delSkin(skin._id,skin.skinUrl.split('/uploads/')[1])
                    this.getSkinData()
                })
                .catch(_ => {});
        },
        async getSkinData(){
            const res=await getSkins()
            
            if(res.code==200)
            this.skinData=res.data
        },
        handleClose(){
            if(this.skinForm.skinUrl!=''){
                var filename=this.skinForm.skinUrl.split('/uploads/')[1]
                console.log(this.skinForm.skinUrl)
                deluUploads(filename)
                this.$refs.upload.clearFiles()
                this.hideUpload = this.fileList.length == 1;
            }
            this.$refs.skinForm.resetFields()
            this.dialogVisible=false
        },
        handleRemove(file, fileList) {
            this.hideUpload = fileList.length == 1;
            this.skinForm.skinUrl=''
            deluUploads(file.response.filename)
        },
        changeImg(file,fileList){
            this.hideUpload = fileList.length == 1;
        },
        uploadSuccess(file){
            // console.log(file)
            this.skinForm.skinUrl=file.url
        },
        saveSkin(){
            //  this.dialogVisible=false
            this.$refs['skinForm'].validate(async (valid) => {
                if (valid) {
                    if(this.skinForm.showTime!=''&&this.skinForm.showTime!=null){
                        var month=new Date(this.skinForm.showTime).getMonth()+1
                        var day=new Date(this.skinForm.showTime).getDate()
                        month=month<10?'0'+month:month
                        day=day<10?'0'+day:day
                        this.skinForm.showTime=month+'-'+day
                    }
                     
                    const {code}=await addSkin(this.skinForm)
                   
                    if(code==200){
                        this.$refs.upload.clearFiles()
                        this.$refs.skinForm.resetFields()
                        this.skinForm.skinUrl=''
                        this.dialogVisible=false
                        this.hideUpload = this.fileList.length == 1;
                        this.getSkinData()
                    }
                    else{
                        this.handleClose()
                    }
                } else {
                    
                    return false;
                }
            });
        }
    },
    created(){
        this.getSkinData()
    }
}
</script>


<style scoped>
    .el-image {
       
        display: block!important;
    }
    
</style>
<style>
    .skin .el-table__row .el-table_1_column_2  {
        padding: 0!important;
    }
     .skin .hide .el-upload--picture-card {
	    display: none!important;
    }
</style>
<style >
   
</style>
