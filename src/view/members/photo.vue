<template>
  <div>
    <el-card>
      <div class="header">
        <div class="l-content">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/members/introduce' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>实验室相册</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="r-content">
          <el-button @click="addDialogVisible = true">新建相册</el-button>
          <el-dialog title="修改相册" :visible.sync="addDialogVisible" style="text-align: left">
            <el-form class="addForm" :rules="rules" ref="albumForm" :model="albumForm">
              <el-form-item label="相册标题：" label-width="100px" prop="albumTitle">
                <el-input type="text" placeholder="请输入标题" v-model="albumForm.albumTitle"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="addDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="addPhotoList()">提 交</el-button>
            </div>
          </el-dialog>
        </div>
      </div>
      <div class="photo-box" v-for="(item,index) in albumList" :key="index" style="margin-bottom: 20px">
        <el-card shadow="hover" @click.native="toShowAlbum(item.id)">
          <div style="margin-bottom: 10px;text-align: left">
            <h2>{{ item.albumName }}</h2>
          </div>
          <el-row :gutter="20">
            <el-col :span="4"
                    v-for="(img,index) in item.photoList" :key="index"
            >
                <el-image
                  :src="img.photoName"
                  style="height: 250px"
                  fit="cover"
                >
                </el-image>
            </el-col>
          </el-row>
        </el-card>
      </div>
      <div class="block" style="margin-top: 20px">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="4"
          layout="prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "photo",
  data() {
    //限制标题不能输入为空
    var validateTitle = (rule,value,callback) => {
      if(value === ''){
        callback(new Error('资源标题不能为空'));
      }else {
        callback();
      }
    }
    return{
      addDialogVisible:false,
      albumList:null,
      total:'',
      currentPage:this.$route.query.page,
      fit:'cover',
      albumForm:{
        albumTitle:''
      },
      rules:{
        albumTitle: [
          { validator: validateTitle, trigger: 'blur' },
        ],
      },
    }
  },
  mounted() {
    this.handleCurrentChange(this.currentPage)
  },
  // created () {
  //   this.initData()
  // },

  watch: {
    // 深度监听路由改变事件
    // Vue项目路由参数改变，接口没有重新调用
    '$route': {
      handler () {
        this.currentPage = this.$route.query.page;//对项目所传的参数进行更新
        this.handleCurrentChange(this.currentPage)//重新调用接口
      },
      deep: true,
      immediate: true,
    }
  },
  methods:{
    addPhotoList(){
      this.$refs.albumForm.validate(valid => {
        if (valid) {
          axios({
            method: 'POST',
            url: 'http://192.168.31.106:8084/album/addAlbum',
            data: {
              albumName: this.albumForm.albumTitle
            }
          }).then(result => {
            if (result) {
              this.$router.push({path: "/members/uploadPhoto", query: {id: result.data,page:this.currentPage}});
            }
          })
        }else {
          console.log("error submit!");
          return false;
        }
      })
    },
    handleCurrentChange(val){
      //改变页数
      this.currentPage = val;
      const params = new URLSearchParams();
      params.append('page', this.currentPage);
      axios.post("http://192.168.31.106:8084/album/findSomeAlbumsWithSomePhotos",params,
        {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then(result => {
        this.$router.push({query:{page:this.currentPage}});
        console.log(result)
        this.albumList = result.data.page;
        this.total = result.data.total;
      })
    },
    // 在这里调用页面加载时的事件



    toShowAlbum(id){
      this.$router.push({path:"/members/show_photo",query:{id:id}});
    }
  }

}
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 40px;
}

.r-content {
  display: flex;
}

.l-content {
  display: flex;
}

.addForm {
  width: 600px;
  margin: auto;
  padding: 40px;
}
.photo-box .el-card:hover{
  transform: scale(1, 1.1);
}

</style>
