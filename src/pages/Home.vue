<template>
  <div class="home">
    <el-container>
      <el-aside :width="isCollapse==false?'200px':'65px'">
        <el-menu
          background-color="#545c64"
          :default-active="activeIndex"
          text-color="#fff"
          router
          active-text-color="#ffd04b"
          :collapse="isCollapse"
        >
          <div class="switch" @click="changeCollapse">
            <i class="el-icon-s-fold" v-show="isCollapse==false"></i>
            <i class="el-icon-s-unfold" v-show="isCollapse==true"></i>
          </div>
          <el-menu-item index="/tags">
            <i class="el-icon-paperclip"></i>
            <span slot="title">标签管理</span>
          </el-menu-item>
          <el-menu-item index="/article">
            <i class="el-icon-notebook-2"></i>
            <span slot="title">文章管理</span>
          </el-menu-item>
          <el-menu-item index="/picture">
            <i class="el-icon-picture"></i>
            <span slot="title">相册管理</span>
          </el-menu-item>
          <el-menu-item index="/chat">
            <i class="el-icon-chat-dot-round"></i>
            <span slot="title">留言管理</span>
          </el-menu-item>
          <el-menu-item index="/skin">
            <i class="el-icon-goods"></i>
            <span slot="title">皮肤管理</span>
          </el-menu-item>
          <el-menu-item index="/filelists">
            <i class="el-icon-folder-opened"></i>
            <span slot="title">文件清理</span>
          </el-menu-item>
          <el-menu-item index="/music">
            <i class="el-icon-headset"></i>
            <span slot="title">音乐管理</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header>
          <div class="titlename">
            <img src="../assets/img/headpic.jpg" alt />
            <div class="title" @click="$router.push('/home')">{{title}}</div>
            <a target="_blank" :href="blogUrl">
              <el-button size="mini" type="info">
                我的博客
                <i class="el-icon-s-promotion"></i>
              </el-button>
            </a>
          </div>
          <div class="userinfos">
            <div class="times">{{currentTime}}</div>
            <el-dropdown trigger="click" @command="handleCommand">
              <span class="el-dropdown-link">
                <i class="el-icon-setting"></i>设置
              </span>
              <el-dropdown-menu slot="dropdown" class="drops">
                <el-dropdown-item icon="el-icon-s-custom" command="loginout">退出登录</el-dropdown-item>
                <el-dropdown-item icon="el-icon-edit" command="changepassword">修改密码</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-header>
        <el-scrollbar style="height:100%">
          <router-view />
        </el-scrollbar>
      </el-container>
    </el-container>
    <Password :changeVisible.sync="showChange"></Password>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import Password from "../components/Password.vue";
import globalConfig from '../globalConfig'
@Component({
  components: {
    Password
  }
})
export default class Home extends Vue {
  isCollapse: boolean = false;
  currentTime: string = "";
  timer: number | null = null;
  showChange: boolean = false;
  userName: string = "";
  activeIndex: string = "";
  title:string=globalConfig.blogTitle;
  blogUrl:string=globalConfig.blogUrl
  @Watch("$route")
  routechange(to: any, from: any) {
    if (to.path == "/home") this.activeIndex = "";
    else if (to.path == "/article/add") this.activeIndex = "/article";
    else if (to.path == "/picturelist") this.activeIndex = "/picture";
    else this.activeIndex = to.path;
  }
  changeCollapse(): void {
    this.isCollapse = !this.isCollapse;
  }
  handleCommand(command: string): void {
    if (command == "loginout") this.LoginOut();
    else if (command == "changepassword") {
      this.showChange = true;
    }
  }
  LoginOut(): void {
    sessionStorage.clear();
    this.$router.push("/");
  }
  getTime(): void {
    this.timer = setInterval(() => {
      var currentTime: string = this.formateDate(Date.now());
      this.currentTime = currentTime;
    }, 1000);
  }
  formateDate(time: number): string {
    if (!time) return "";
    let date: Date = new Date(time);
    let month: string | number =
      date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1;
    let day: string | number =
      date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    let hour: string | number =
      date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    let minute: string | number =
      date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    let second: string | number =
      date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    return (
      date.getFullYear() +
      "-" +
      month +
      "-" +
      day +
      " " +
      hour +
      ":" +
      minute +
      ":" +
      second
    );
  }
  created() {
    this.currentTime = this.formateDate(Date.now());
    this.getTime();
    if (this.$route.path != "/home") this.activeIndex = this.$route.path;
    if (this.$route.path == "/article/add") this.activeIndex = "/article";
    if (this.$route.path == "/picturelist") this.activeIndex = "/picture";
  }
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}
</script>


<style scoped>
.home,
.el-container {
  width: 100%;
  height: 100%;
}
.el-menu {
  height: 100%;
}
.switch {
  height: 40px;
  line-height: 50px;
  text-align: center;
  font-size: 20px;
  cursor: pointer;
  color: #ffffff;
}
.el-header {
  background-color: #e9eef3;
}
.titlename {
  padding-left: 20px;
  width: 50%;
  height: 100%;
  display: flex;
  align-items: center;
  float: left;
  font-size: 18px;

  color: #333;
  font-family: "Arial", "Microsoft YaHei", "黑体", "宋体", sans-serif;
}
.userinfos {
  float: right;
  width: 50%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 30px;
}
.titlename img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: palegoldenrod;
  margin-right: 15px;
}
.titlename .el-button {
  margin-left: 20px;
  margin-top: 5px;
}
.userinfos .el-dropdown {
  cursor: pointer;
  font-size: 16px !important;
  letter-spacing: 2px;
}
.userinfos .el-icon-setting {
  margin-right: 5px;
}
.times {
  font-size: 14px;
  margin-right: 20px;
  color: #666;
}
.title {
  cursor: pointer;
}
</style>
<style >
.el-dropdown-menu.drops {
  width: 120px !important;
}
.el-scrollbar__view {
  padding: 20px !important;
}
.el-scrollbar__wrap {
  overflow-x: hidden !important;
}
</style>
