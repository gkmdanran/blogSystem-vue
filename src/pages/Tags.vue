<template>
  <div class="tags">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>标签管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="card">
      <div class="heads">
        <el-input v-model="query" placeholder="请输入标签名" clearable @clear="getTag"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="searchTag()"></el-button>
      </div>
      <el-table :data="tagData" style="width: 100%" stripe border>
        <el-table-column prop="tagName" label="标签名">
          <template slot-scope="scope">
            <el-tag :type="scope.row.type">{{scope.row.tagName}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="blogsStrs" label="文章数量">
          <template slot-scope="scope">
            <span
              :style="{'color':scope.row.blogsStrs==''?'red':'black','fontSize':'22px','marginRight':'2px'}"
            >{{scope.row.blogsStrs==''?0:scope.row.blogsStrs.split(',').length}}</span>篇
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-view"
              size="small"
              @click="checkArticle(scope.row._id)"
              :disabled="scope.row.blogsStrs==''"
            >查看文章</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="small"
              @click="handleDel(scope.row._id)"
            >删除标签</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[1, 3, 5]"
        :page-size="pageSzie"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { getTags, delTag } from "../network/tags";
import { tagObj } from "../types/tags";
@Component
export default class Tags extends Vue {
  tagData: Array<tagObj> = [];
  pageNum: number = 1;
  pageSzie: number = 5;
  query: string = "";
  total: number = 0;
  handleSizeChange(val: number): void {
    this.pageSzie = val;
    this.getTag();
  }
  handleCurrentChange(val: number): void {
    this.pageNum = val;
    this.getTag();
  }
  async getTag(): Promise<any> {
    const res = await getTags(this.query, this.pageNum, this.pageSzie);
    this.tagData = res.data.list;
    this.total = res.data.total;
  }
  searchTag(): void {
    this.pageNum = 1;
    this.pageSzie = 5;
    this.getTag();
  }
  async deleteTag(id: string): Promise<any> {
    await delTag(id);
    this.getTag();
  }
  handleDel(id: string): void {
    this.$confirm("确认删除此标签吗？")
      .then(_ => {
        this.deleteTag(id);
      })
      .catch(_ => {});
  }
  checkArticle(id: string): void {
    this.$router.push({
      name: "Article",
      params: {
        tagId: id
      }
    });
  }
  created(): void {
    this.getTag();
  }
}
</script>


<style scoped>
.el-tag {
  min-width: 80px;
  text-align: center;
}
</style>
