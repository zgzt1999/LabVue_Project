<template>
  <div>
    <div class="header">
      <div class="l-content">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/members/introduce' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{path: '/members/photo'}">实验室相册</el-breadcrumb-item>
          <el-breadcrumb-item>照片上传</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
      <div class="upload-box">
        <el-upload
          action="http://192.168.31.106:8084/album/addPhoto"
          ref="upload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="onSuccess"
          multiple
          :file-list="fileList"
          :auto-upload="false"
          :headers="header"
          >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </div>
    <div class="button-box">
<!--      <el-button type="primary" @click="submitUpload">开始上传</el-button>-->
      <el-button type="primary" @click="dialogVisible = true">开始上传</el-button>
      <el-dialog
        title="上传"
        :visible.sync="dialogVisible"
      >
        <div style="font-size: 16px">
          &nbsp;&nbsp;&nbsp;&nbsp;相片是否已经加载完成
        </div>
        <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取消</el-button>
    <el-button type="primary" @click="dialogVisible = false;submitUpload()">确认</el-button>
  </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>

import axios from "axios";
import resetMessage from "../../utils/resetMessage";

export default {
  name: "uploadPhoto",
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      id:this.$route.query.id,
      page:this.$route.query.page,
      header:{id:this.$route.query.id},
      fileList:null
    }
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    onSuccess(response, file, fileList) {
      console.log(response,file,fileList);
      if(response == "success") {
        resetMessage({
          message: "恭喜你，上传成功！！！",
          type: 'success',
          duration: 5 * 1000,
        });
        this.$router.replace({path:"/members/photo",query:{page:this.page}});
      }
    },
    // finishUpload(){
    //   this.$router.push("/members/photo")
    // },
    submitUpload(){
      this.$refs.upload.submit();
    }
  }

}
</script>

<style scoped>
.header {
  margin-bottom: 30px;
}
.upload-box ,
.button-box{
  text-align: left;
  margin-top: 30px;
}
</style>
