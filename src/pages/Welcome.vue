<template>
    <div class="welcome">
        <div class="chats">
            <div class="title">近期留言</div>
            <div class="nochat" v-show="chatList.length==0">暂时没有留言</div>
            <div class="chat_item" v-for="chat in chatList" :key="chat._id">
                <span class="time">{{chat.createTime|dateFormat}}</span><span class="name">{{chat.chatName}}：</span>
                <div class="content">{{chat.chatContent}}</div>
            </div>
        </div>
        <div class="pie" ref="pie">

        </div>
    </div>
</template>

<script>
import {getChats} from "../network/chat"
import {getTags} from "../network/tags"
import echarts from "echarts";
export default {
    name: 'Welcome',
    data () {
        return {
            chatList:[],
            pieData:[]
        }
    },
    methods:{
        async initData(){
            const res=await getChats('','',1,5)
            
            this.chatList=res.data.list
            
            
        },
        async drawPie(){
            const res2=await getTags()
            for(let x of res2.data.list){
                if(x.blogsStrs!='')
                this.pieData.push({value:x.blogsStrs.split(',').length, name:x.tagName})
            }
            
            let myChart = echarts.init(this.$refs.pie);
            let option = {
                title: {
                    text: '博客分类',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{b} : {c} ({d}%)'
                },
                series : [
                    {
                        name: '',
                        type: 'pie',
                        radius: '55%',
                        data:this.pieData
                    }
                ]
            }
            myChart.setOption(option);
            window.addEventListener('resize', function () {myChart.resize();})
        }
    },
    created(){
        this.initData()
        
    },
    mounted(){
        this.drawPie()
    }
}
</script>


<style scoped>
    .welcome{
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: space-between;
    }
    .chats{
        width: 40%;
        min-height: 300px;
        border-radius: 15px;
        box-shadow: 1px 2px 9px 1px rgba(0, 0, 0, 0.2);
        margin-left: 6%;
        margin-top: 20px;
        padding-bottom: 10px;
    }
    .chats .title {
        width: 100%;
        height: 50px;
        line-height: 50px;
        padding-left: 20px;
        font-size: 18px;
        font-weight: 700;
        color: #333;
        border-bottom: 1px solid #cccccc;
    }
    .chat_item{
        padding:  2px 10px;
        
    }
    .chat_item .name {
        font-size: 14px;
        margin-left: 5px;
        font-weight: 700;
    }
    .chat_item .time {
        font-size: 12px;
        color: #cccccc;
    }
    .chat_item .content {
        font-style: 13px;
        color:#ccc;
        font-style: italic;
        display:-webkit-box;   
        -webkit-box-orient:vertical;   
        -webkit-line-clamp:2;   
        overflow:hidden;   
    }
    .nochat{
        text-align: center;
        font-size: 16px;
        color: #909399;
        line-height: 100px;
    }
    .pie{
        padding-top: 20px;
        width: 40%;
        height: 300px;
        border-radius: 15px;
        box-shadow: 1px 2px 9px 1px rgba(0, 0, 0, 0.2);
        margin-right: 6%;
        margin-top: 20px;
    }
</style>
