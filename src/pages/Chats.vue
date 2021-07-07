<template>
    <div class="chat">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item >留言管理</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="card">
             <div class="heads">
                <el-input  placeholder="请输入留言人"  v-model="queryPeople" clearable @clear="search"></el-input>
                 <el-date-picker
                    v-model="queryDate"
                    type="date"
                    placeholder="选择日期"
                    @change="search"
                    >
                    </el-date-picker>
                <el-button type="primary" icon="el-icon-search" @click="search"></el-button>
                <el-button type="danger" icon="el-icon-delete" @click="delMany">批量删除</el-button>
            </div>
             <el-table :data="chatData" style="width: 100%" stripe  border @selection-change="handleSelectionChange">
                <el-table-column type="selection" >
                </el-table-column>
                <el-table-column prop="chatName" label="留言人" width="180px">
                </el-table-column>
                <el-table-column prop="chatContent" label="内容" >
                </el-table-column>
                <el-table-column prop="chatWay" label="联系方式" show-overflow-tooltip>
                     <template slot-scope="scope">
                        <span>
                            {{scope.row.chatWay=='：'?'暂无':scope.row.chatWay}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="发言时间"  width="180px">
                    <template slot-scope="scope">
                        <span>{{scope.row.createTime|dateFormat}}</span>
                    </template>
                </el-table-column>
               
            </el-table>
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pageNum"
                :page-sizes="[1, 5, 10]"
                :page-size="pageSzie"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
import {getChats,delChats} from "../network/chat"
export default {
    name: 'Chat',
    data () {
        return {
            multipleSelection:[],
            chatData:[],
            queryPeople:'',
            queryDate:'',
            pageNum:1,
            pageSzie:10,
            total:0,
        }
    },
    methods:{
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        handleSizeChange(val) {
            this.pageSzie=val
            this.getChat()
        },
        handleCurrentChange(val) {
            this.pageNum=val
            this.getChat()
        },
        async getChat(){
            const res=await getChats(this.queryPeople,this.queryDate,this.pageNum,this.pageSzie)
            
            this.chatData=res.data.list
            this.total=res.data.total
        },
        search(){
            this.pageNum=1
            this.pageSzie=10
            
            this.getChat()
        },
        delMany(){
            if(this.multipleSelection.length>0){
                var list=[]
                for(let x of this.multipleSelection){
                    list.push(x._id)
                }
                
                 this.$confirm(`确认删除${list.length}条评论吗？`)
                .then(async _ => {
                    await delChats(list.join(','))
                    this.getChat()
                })
                .catch(_ => {});
            }
        }
    },
    created(){
        this.getChat()
    }
}
</script>


<style scoped>

</style>
