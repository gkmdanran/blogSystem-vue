<template>
  <div class="pclogin" v-loading="loading" :style="{backgroundImage: 'url(' + skinUrl + ')'}">
    <div class="contents">
      <div class="left">
        <div class="title">个人博客后台管理系统</div>
        <div class="eng">MY BLOG BACKGROUNG MANAGEMENT SYSTEM</div>
      </div>
      <div class="right">
        <div class="login_infos">
          <div class="welcome">欢迎登陆</div>
          <div class="names">个人博客后台管理系统</div>
          <form action class="fom">
            <div class="us">
              <i class="el-icon-s-custom"></i>
              <input type="text" v-model.trim="userInfo.userName" placeholder="请输入用户名" />
            </div>
            <div class="us">
              <i class="el-icon-lock"></i>
              <input
                type="password"
                autocomplete
                v-model="userInfo.password"
                placeholder="请输入密码"
                @keyup.enter="login"
              />
            </div>
          </form>

          <div class="foots">
            <button @click="login">登录</button>
          </div>
        </div>
        <div class="forget" @click="forgetPassword">忘记密码?寻求帮助</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { loginSystem, getImg } from "../network/login";
import { loginUserInfo } from "../types/login";
@Component
export default class Login extends Vue {
  userInfo: loginUserInfo = {
    userName: "",
    password: ""
  };
  loading: boolean = false;
  skinUrl: string = "";

  async login() {
    if (this.userInfo.userName !== "" && this.userInfo.password !== "") {
      sessionStorage.clear();
      this.loading = true;
      const res = await loginSystem(this.userInfo);
      this.loading = false;
      if (res.code == 200) {
        sessionStorage.setItem("blog_token", res.data.token);
        this.$cookies.set("userName", res.data.userName, "7d");
        this.$router.push("/homepage");
      }
    }
  }
  forgetPassword() {
    this.$message({
      message: "请联系管理员,管理员邮箱:1755989501@qq.com",
      type: "warning",
      showClose: true
    });
  }
  async created() {
    this.skinUrl = require("../assets/img/bgc.jpg");
    if (this.$cookies.get("userName"))
      this.userInfo.userName = this.$cookies.get("userName");
    try {
      let res = await getImg();
      if (res && res.data.code == 200) this.skinUrl = res.data.data;
      else this.skinUrl = require("../assets/img/bgc.jpg");
    } catch (error) {
      this.skinUrl = require("../assets/img/bgc.jpg");
    }
  }
}
</script>

<style scoped>
.pclogin {
  width: 100%;
  height: 100%;

  background-repeat: no-repeat;
  background-size: 100% 100%;
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
  transform: translate(-50%, -50%);
  box-shadow: 1px 1px 12px 6px rgba(0, 0, 0, 0.5);
  border-radius: 10px;
}
.contents .left {
  float: left;
  height: 100%;
  width: 63.7%;
  background: rgba(0, 0, 0, 0.1);
  padding-top: 10%;
  padding-left: 4.7%;
}
.contents .right {
  float: left;
  height: 100%;
  width: 36.3%;
  background: #ffffff;
  opacity: 0.9;
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
.right .fom {
  height: 38%;
}
.right .us {
  width: 100%;
  height: 40%;
  border-radius: 3px;
  background-color: #f4f4f4;
  display: flex;
  align-items: center;
  margin-top: 6%;
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
  width: 100%;
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
