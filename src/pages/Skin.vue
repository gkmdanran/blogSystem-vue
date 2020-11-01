<template>
    <div class="skin">
         <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item >皮肤管理</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="card">
                <div class="heads">
                    <el-button  type="primary" icon="el-icon-plus" >添加皮肤</el-button>
                </div>
                <el-table :data="skinData" style="width: 100%" stripe border >
                    <el-table-column type="index" >
                    </el-table-column>
                
                    <el-table-column prop="skinUrl" label="预览">
                        <template slot-scope="scope">
                            <img :src="scope.row.skinUrl" alt="" class="img">
                        </template>
                    </el-table-column>
                    <el-table-column prop="showTime" label="触发日期">
                    </el-table-column>
                    <el-table-column  label="操作">
                        <template slot-scope="scope">
                            <el-button  type="danger" icon="el-icon-delete" size="small">删除皮肤</el-button>
                        </template>
                    </el-table-column>
                </el-table>
        </div>
    </div>
</template>

<script>
export default {
    name: '',
    data () {
        return {
            skinData:[
                {
                    id:1,
                    skinUrl:'https://i01piccdn.sogoucdn.com/e97053fc1373a641',
                    showTime:'222'
                },
                 {
                    id:1,
                    skinUrl:'https://i01piccdn.sogoucdn.com/e97053fc1373a641',
                    showTime:'222'
                },
                 {
                    id:1,
                    skinUrl:'https://i01piccdn.sogoucdn.com/e97053fc1373a641',
                    showTime:'222'
                },
                 {
                    id:1,
                    skinUrl:'https://i01piccdn.sogoucdn.com/e97053fc1373a641',
                    showTime:'222'
                },
                 {
                    id:1,
                    skinUrl:'https://i01piccdn.sogoucdn.com/e97053fc1373a641',
                    showTime:'222'
                },
                 {
                    id:1,
                    skinUrl:'https://i01piccdn.sogoucdn.com/e97053fc1373a641',
                    showTime:'222'
                },
                 {
                    id:1,
                    skinUrl:'https://i01piccdn.sogoucdn.com/e97053fc1373a641',
                    showTime:'222'
                },
                 {
                    id:1,
                    skinUrl:'https://i01piccdn.sogoucdn.com/e97053fc1373a641',
                    showTime:'222'
                },
                 {
                    id:1,
                    skinUrl:'https://i01piccdn.sogoucdn.com/e97053fc1373a641',
                    showTime:'222'
                },
                 {
                    id:1,
                    skinUrl:'https://i01piccdn.sogoucdn.com/e97053fc1373a641',
                    showTime:'222'
                },
            ]
        }
    }
}
</script>


<style scoped>
    .img {
        height: 50px;
        display: block;
    }
    
</style>
<style>
    .chat .el-table__row .el-table_1_column_2  {
        padding: 0!important;
    }

</style>
