<template>
  <div>
    <div class="header">
      <div class="l-content">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/members/introduce' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>实验室相册</el-breadcrumb-item>
          <el-breadcrumb-item>{{ albumName }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <div class="title" style="text-align: left;font-size: 25px">
      <h2>{{ albumName }}</h2>
    </div>
    <div class="photo-box">
      <el-row :gutter="20">
        <el-col :span="4"
                v-for="(img,index) in photoList" :key="index">
          <el-image
            :src="img"
            style="height: 250px"
            :preview-src-list="photoList"
            fit="cover"
          >
          </el-image>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "show_photo",
  data() {
    return{
      addDialogVisible:false,
      dialogImageUrl: '',
      dialogVisible: false,
      id: this.$route.query.id,
      fileList:[],
      photoList:null,
      albumName: "",
      page:this.$route.query.page
    }
  },
  mounted() {
    this.getOnePhoto()
  },
  methods:{
    getOnePhoto(){
      const params = new URLSearchParams();
      params.append('albumId', this.id);
      axios.post("http://192.168.31.106:8084/album/findAllPhotosOfOneAlbum",params,
        {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then(result => {
          console.log(result);
          this.photoList = result.data.photos;
          this.albumName = result.data.albumName;
          console.log(this.photoList)
      })
    }
  },


}
</script>

<style scoped>
.header{
  display: flex;
  justify-content: space-between;
  margin-bottom: 40px;
}
.r-content{
  display: flex;
}
.l-content{
  display: flex;
}
.addForm {
  width: 600px;
  margin: auto;
  padding: 40px;
}
</style>
