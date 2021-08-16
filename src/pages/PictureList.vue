<template>
  <div class="picture_list">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/picture' }">相册管理</el-breadcrumb-item>
      <el-breadcrumb-item>{{PictureInfo.title}}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="card">
      <div class="heads">
        <div class="guanli" :style="{'backgroundColor':'#409eff'}" @click="dialogVisible=true">
          <span>设置相册</span>
          <i class="el-icon-money"></i>
        </div>
        <div class="guanli" @click="setList">
          <span>{{wantDel?'退出管理':'批量管理'}}</span>
          <i class="el-icon-edit"></i>
        </div>
        <div class="guanli" :style="{'backgroundColor':'#545c64'}" @click="setCover">
          <span>设置封面</span>
          <i class="el-icon-picture-outline"></i>
        </div>

        <el-checkbox
          v-show="wantDel&&previewList.length>0"
          v-model="checkAll"
          @change="handleCheckAllChange"
          class="all"
        >全选图片</el-checkbox>
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
          ></el-image>
        </div>
      </el-checkbox-group>
      <el-upload
        :action="actionUrl"
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
      <el-dialog title="新建相册" :visible.sync="dialogVisible" width="400px" @close="handleClose">
        <el-form label-width="70px" ref="editForm" :model="PictureInfo" :rules="rules">
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

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { picDetail } from "../types/picture";
import globalConfig from "../globalConfig";
import {
  getPicById,
  addPicList,
  delPicList,
  changeCover,
  editPictures
} from "../network/picture";
@Component
export default class PictureList extends Vue {
  password: string = "";
  rules: any = {
    title: [
      { required: true, message: "请输入相册名", trigger: "blur" },
      { min: 1, max: 15, message: "长度在 1 到 15 个字符", trigger: "blur" }
    ],
    tag: [
      { min: 1, max: 2, message: "长度在 1 到 2个字符", trigger: "change" }
    ],
    password: [
      { min: 6, max: 16, message: "长度在 6 到 16个字符", trigger: "change" }
    ]
  };
  actionUrl: string = "";
  dialogVisible: boolean = false;
  header: any = {
    Authorization: "Bearer " + (sessionStorage.getItem("blog_token") || "")
  };
  PictureInfo: picDetail = {
    count: 0,
    cover: "",
    picDetailList: "",
    _id: "",
    title: "",
    tag: "",
    tagColor: "",
    createTime: ""
  };
  previewList: Array<string> = [];
  checkAll: boolean = false;
  checkedPics: Array<string> = [];
  fileList: Array<any> = [];
  wantDel: boolean = false;
  fileCount: number = 0;
  centerCount: number = 0;
  handleClose(): void {
    (this.$refs as any).editForm.resetFields();
  }
  handleCheckAllChange(val: Array<string>): void {
    this.checkedPics = val ? this.previewList : [];
  }
  handleCheckedCitiesChange(value: Array<string>): void {
    let checkedCount: number = value.length;
    this.checkAll = checkedCount === this.previewList.length;
  }
  setList(): void {
    if (this.previewList.length > 0) {
      this.wantDel = !this.wantDel;
      this.checkedPics = [];
      this.checkAll = false;
    }
  }
  changeList(file: any, fileList: any): void {
    this.fileCount = fileList.length;
  }
  uploadSuccess(response: any, file: any, fileList: any): void {
    this.fileList.push(response.filename);
    this.centerCount += 1;
    if (this.centerCount == this.fileCount) {
      this.addPhoto();
    }
  }
  async addPhoto(): Promise<any> {
    var list: Array<string> =
      this.PictureInfo.picDetailList == ""
        ? []
        : this.PictureInfo.picDetailList.split(",");
    var str: string = [...list, ...this.fileList].join(",");
    var count: number = [...list, ...this.fileList].length;
    await addPicList(this.PictureInfo._id, str, count);
    this.fileList = [];
    this.fileCount = 0;
    this.getDeailInfo();
  }
  async getDeailInfo(): Promise<any> {
    var id: string | (string | null)[] = this.$route.query.id;
    const { data, code } = await getPicById(id);
    if (!data._id) return this.$router.push("/notpicture");
    if (code == 200) {
      this.PictureInfo = data;
      this.previewList =
        this.PictureInfo.picDetailList == ""
          ? []
          : this.PictureInfo.picDetailList
              .split(",")
              .map(item => `${globalConfig.serverUrl}/uploads/` + item);
    }
  }
  async deletelist(): Promise<any> {
    var count:number=0
    if (this.checkedPics.length > 0) {
      var arr1: Array<string> = this.previewList;
      var arr2: Array<string> = this.checkedPics;
      let diff: Array<string> = arr1.filter(function(val) {
        return arr2.indexOf(val) === -1;
      });
      count = diff.length;
      var diff2: string = diff.join("");
      var str: string = `${globalConfig.serverUrl}/uploads/`;
      let filename: string = diff2
        .split(str)
        .join(",")
        .substr(1);

      const res = await delPicList(
        this.PictureInfo._id,
        filename,
        arr2.join(","),
        count
      );
      if (res.code == 200) this.getDeailInfo();
      this.checkedPics = [];
      this.checkAll = false;
    }
    if (count == 0) this.wantDel = false;
  }
  async setCover(): Promise<any> {
    if (this.checkedPics.length != 1) {
      this.$message({
        message: "请选择一张照片~",
        type: "warning",
        duration: 800
      });
    } else {
      var res = await changeCover(this.PictureInfo._id, this.checkedPics[0]);
      if (res.code == 200) {
        this.wantDel = false;
        this.checkedPics = [];
      }
    }
  }
  sureEdit(): void {
    (this.$refs as any)["editForm"].validate(async (valid: boolean) => {
      if (valid) {
        const res = await editPictures(
          this.PictureInfo._id,
          this.PictureInfo.title,
          this.PictureInfo.tag,
          this.password
        );

        if (res.code == 200) {
          this.dialogVisible = false;
          this.getDeailInfo();
        }
      } else {
        return false;
      }
    });
  }
  created(): void {
    this.actionUrl = `${globalConfig.serverUrl}/admin/api/upload`;
    this.getDeailInfo();
  }
}
</script>


<style scoped>
.heads {
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
.el-checkbox-group {
  width: 100%;
  min-height: 20px;
  display: flex;
  flex-wrap: wrap;
}

.guanli {
  display: inline-block;
  margin-left: 10px;
  margin-bottom: 10px;
  cursor: pointer;
  width: 120px;
  height: 30px;
  line-height: 30px;
  font-size: 16px !important;
  border-radius: 15px;
  text-align: center;
  background-color: #f78787;
  color: #ffffff;
}
.img {
  border: 1px solid #f6f6f6;
  position: relative;
  width: 175px;
  height: 175px;
  margin: 10px 10px;
  background: #ffffff;
}
.el-checkbox.checkimg {
  position: absolute;
  top: 5px;
  left: 5px;
}
.el-checkbox.all {
  margin-left: 15px;
}
</style>
<style >
.picture_list .checkimg .el-checkbox__label {
  display: none !important;
}
.picture_list .el-upload-list.el-upload-list--picture-card {
  display: none !important;
}
.picture_list .el-upload.el-upload--picture-card {
  margin-left: 10px;
  margin-top: 15px;
}
</style>