<template>
  <div>
    <el-row>
      <el-card>
        <div slot="header" class="header">
          <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom: 20px">
            <el-breadcrumb-item :to="{ path: '/members/introduce' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>知识产权</el-breadcrumb-item>
            <el-breadcrumb-item>{{ context.propertyName }}</el-breadcrumb-item>
          </el-breadcrumb>
          <div class="underBread">
            <div class="title">
              <h1>{{context.propertyName}}</h1>
            </div>
            <el-popover
              placement="right"
              width="220"
              trigger="hover">
              <div class="msgBox">
                <el-row>
                  <el-col :span="6">
                    <el-avatar
                      :size="60"
                      :src="context.userMessage.headPhotoUrl">
                    </el-avatar>
                  </el-col>
                  <el-col :offset="2" :span="16" class="nameBox">
                    <strong>{{ context.userMessage.name }}</strong>
                    <span id="direction">{{ context.userMessage.direction }}</span>
                  </el-col>
                  <el-col :span="16" :offset="1">
                    <span>学号：{{ context.userMessage.accountId }}</span>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form label-width="75px"  label-position="right" size="mini">
                      <el-form-item>
                        <span slot="label">QQ号码:</span>
                        {{ context.userMessage.qq }}
                      </el-form-item>
                      <el-form-item>
                        <span slot="label">电话号码:</span>
                        {{ context.userMessage.phone }}
                      </el-form-item>
                      <el-form-item>
                        <span slot="label">自我介绍:</span>
                        {{ context.userMessage.selfIntroduction }}
                      </el-form-item>
                    </el-form>
                  </el-col>
                </el-row>
              </div>
              <span slot="reference">
             <i class="el-icon-user"></i>&nbsp;{{ context.userMessage.name }}&nbsp;&nbsp;
            </span>
            </el-popover>
            <span>
             <i class="el-icon-date">
               &nbsp;于{{ context.year }}年发表&nbsp;&nbsp;
             </i>
             <i class="iconfont icon-teamzhishichanquan">
               &nbsp;{{ context.type }}&nbsp;&nbsp;
             </i>
            </span>
          </div>
        </div>
        <div class="body">
          <div v-html="context.introduce"></div>
          <div class="btn-box">下载附件：
            <el-button type="primary" size="small" @click="download">
                <i class="el-icon-download">&nbsp;下载</i>
            </el-button>
          </div>
        </div>
      </el-card>
    </el-row>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "show_property",
  data(){
    return{
      context:'',
    }
  },
  computed:{
    id(){
      return this.$route.query.id;
    }
  },
  mounted() {
    this.getProperty()
  },
  methods:{
    getProperty() {
      const params = new URLSearchParams();
      params.append('id', this.id);
      axios.post("http://192.168.31.106:8084/property/findOneProperty",params,
        {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then(result => {
          if(result) {
            console.log(result)
            this.context = result.data;
            // this.canDownload = result.data.downloadOrNot;
          }
      })
    },
    download() {
      window.location.href = `http://192.168.31.106:8084/property/download?id=${this.id}`
    }
  }
}
</script>

<style scoped>
  .header {
    text-align: left;
  }
  .header el-breadcrumb {
    margin-bottom: 20px;
  }
  .header .underBread {
    font-size: 17px;
  }
  .title h1{
    font-size: 28px;
  }
  .header span {
    color: #a2a1a1;
    /*font-size: 17px;*/
  }
  .el-popover .msgBox {
    color: #a2a1a1
  }
  .el-popover .msgBox #direction {
    font-size: 5px;
    margin-left: 3px;
  }
  .el-popover .msgBox strong {
    font-size: 20px;
    color: #2c3e50;
   }
  .el-popover .msgBox .nameBox {
    margin-bottom: 10px;
  }
  .el-form .el-form-item {
    margin: 0px;
  }
  .el-form .el-form-item span {
    color: #a2a1a1
  }
  .body {
    font-size: 18px;
    text-align: left;
  }
  .body .btn-box {
    margin-top: 20px;
  }
  .el-card {
    min-height: 89vh;
  }
</style>
