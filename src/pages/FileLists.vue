<template>
    <div class="file_lists">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>文件清理</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="card">
            <div class="heads">
                <el-button  type="danger" icon="el-icon-delete" @click="clear">一键清理</el-button>
            </div>
            <el-table :data="FileData" style="width: 100%" stripe border >
                <el-table-column type="index" >
                </el-table-column>
                <el-table-column prop="filename" label="文件名">
                </el-table-column>
                <el-table-column prop="useId" label="文章id">
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
import {getFiles,clearFiles} from "../network/filelist"
export default {
    name: 'FileLists',
    data () {
        return {
            FileData:[]
        }
    },
    methods:{
        async getList(){
            const {code,data}=await getFiles()
            if(code==200){
                this.FileData=data
            }
        },
        clear(){
            if(this.FileData.length>0)
                this.$confirm(`确认清理无用文件吗？`)
                    .then(async _ => {
                        await clearFiles()
                        this.getList()
                    })
                    .catch(_ => {});
                }
    },
    created(){
        this.getList()
    }
}
</script>


<style scoped>

</style>
