<template>
  <div class="pclogin">
      
      <div class="contents">
        <div class="left">
          <div class="title">个人博客后台管理系统</div>
          <div class="eng">
            MY BLOG BACKGROUNG MANAGEMENT SYSTEM
          </div>
        </div>
        <div class="right">
          <div class="login_infos">
            <div class="welcome">
              欢迎登陆
            </div>
            <div class="names">
              个人博客后台管理系统
            </div>
                   
            <div class="us" >
                <i class="el-icon-s-custom"></i>
                <input type="text" v-model.trim="userInfo.userName" placeholder="请输入用户名">   
            </div>
            <div class="us" >
                <i class="el-icon-lock"></i>
                <input type="password" v-model="userInfo.password" placeholder="请输入密码"> 
            </div>
            <div class="foots">
              <input type="checkbox" class="checks">
              记住账号
               <button @click="login">登录</button>
            </div>
          </div>
          <div class="forget">忘记密码?寻求帮助</div>
        </div>
      </div>
  </div>
</template>

<script>
import {loginSystem} from "../network/login"
export default {
  
  name: 'pclogin',
  data () {
    return {
        userInfo:{
          userName:'',
          password:''
        }
    }
  },
  methods:{
    async login(){
      if(this.userInfo.userName!==''&&this.userInfo.password!==''){
        sessionStorage.clear()
        const res=await loginSystem(this.userInfo)
        console.log(res)
        if(res.code==200){
          sessionStorage.setItem('blog_token',res.data.token)
          this.$cookies.set("userName",res.data.userName,"7d");
          this.$router.push('/homepage')
        }
          
      }
        
    }
  },
  mounted:function(){
    
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.pclogin {
  width: 100%;
  height: 100%;
  background: url("../assets/img/bgc.jpg") no-repeat;
  
  background-size:100% 100%;
  position: relative;
  min-height: 700px;
  min-width: 1280px;
}
.logotxt {
  color: #ffffff;
  font-size: 25px;
  position: absolute;
  top: 3%;
  left: 3.5%;
}
.contents {
  position: absolute;
  width: 66.67%;
  height: 49.15%;
  overflow: hidden;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  box-shadow: 5px 5px 5px 5px rgba(0,0,0,0.3) ;
  border-radius: 10px;
}
.contents .left{
  float: left;
  height: 100%;
  width: 63.7%;
  background: rgba(0,0,0,0.1);
  padding-top: 10%;
  padding-left: 4.7%;
}
.contents .right {
  float: left;
  height: 100%;
  width: 36.3%;
  background: #ffffff;
}
.left .title {
  height: 50px;
  font-size: 28px;
  font-weight: 700;
  letter-spacing: 1px;
  color: #ffffff;
  
}
.left .eng {
  font-size: 12px;
  color: #ffffff;
}
.right .login_infos {
  width: 74.6%;
  margin: 0 auto;

  padding-top: 17.2%;
  height: 87%;
}
.right .forget {
  width: 100%;
  height: 13%;
  background: #f4f4f4;
  color: #788190;
  font-size: 9.6px;
  text-align: center;
  line-height: 45px;
  cursor: default;
}
.right .welcome {
  font-size: 18px;
  color: #28374f;
  height: 40px;
}
.right .names {
  font-size: 14px;
  color: #696969;
  height: 20px;
}

.right .us{
  width: 100%;
  height: 15%;
  border-radius: 3px;
  background-color: #f4f4f4;
  display: flex;
  align-items: center;
  margin-top: 5%;
  padding-left: 15px;
}
.us input {
    outline: none;
    border: 0;
    background-color: #f4f4f4;
    height: 100%;
    margin-left: 10px;
    width: calc(100% - 60px);
    font-size: 14px;
}
.foots {
  width: 100%;
  height: 35px;
  line-height: 35px;
  font-size: 11px;
  color: #2d3b53;
  margin-top: 8%;
}
.foots .checks {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 1px solid #cccccc;
  margin-bottom: 0;
  margin-top: -2px;
  vertical-align: middle;
}
.foots button {
  float: right;
  vertical-align: middle;
  height: 35px;
  width:40%;
  border-radius: 3px;
  border: 0;
  outline: 0;
  background-color: #0062ba;
  color: #ffffff;
  cursor: pointer;
}

</style>
<style>
  .pclogin .el-icon-s-custom,
  .pclogin .el-icon-lock {
    
   
    color: #28374f;
   
  }
</style>
