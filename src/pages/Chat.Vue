<template>
    <div class="chat">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item >留言管理</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="card">
             <div class="heads">
                <el-input  placeholder="请输入留言人"  v-model="queryPeople" clearable></el-input>
                 <el-date-picker
                    v-model="queryDate"
                    type="date"
                    placeholder="选择日期">
                    </el-date-picker>
                <el-button type="primary" icon="el-icon-search" ></el-button>
                <el-button type="danger" icon="el-icon-delete" >批量删除</el-button>
            </div>
             <el-table :data="chatData" style="width: 100%" stripe  border>
                <el-table-column type="selection" >
                </el-table-column>
                <el-table-column prop="chatName" label="留言人">
                </el-table-column>
                <el-table-column prop="chatContent" label="内容">
                </el-table-column>
                <el-table-column prop="chatWay" label="联系方式">
                </el-table-column>
                <el-table-column prop="createTime" label="发言时间">
                </el-table-column>
               
            </el-table>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Chat',
    data () {
        return {
            chatData:[
                {
                    chatName:'haha',
                    chatContent:'222',
                    chatWay:'22',
                    createTime:'232131'
                },
                 {
                    chatName:'haha',
                    chatContent:'222',
                    chatWay:'22',
                    createTime:'232131'
                }
            ],
            queryPeople:'',
            queryDate:''
        }
    }
}
</script>


<style scoped>

</style>
