<template>
  <div>
    <el-card shadow="never" style="min-height: 100vh">
          <div slot="header">
            <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom: 20px">
              <el-breadcrumb-item :to="{ path: '/members/introduce' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item>资源存储</el-breadcrumb-item>
              <el-breadcrumb-item>资源展示</el-breadcrumb-item>
            </el-breadcrumb>
          <div class="title" style="text-align: left;font-size: 25px">
            <h2>{{ context.infoName }}</h2>
          </div>
          <div class="header-box" style="text-align: left;color: #a2a1a1">
              <el-popover
                placement="right"
                width="250"
                trigger="hover"
                >
                  <el-row>
                    <el-col :span="6">
                    <el-avatar
                      :size="60"
                      :src="context.userMessage.headPhotoUrl"></el-avatar>
                    </el-col>
                    <el-col :offset="2" :span="16" style="font-size: 20px;margin-bottom: 8px">
                      <strong>{{context.userMessage.name}}</strong>
                      <span style="font-size: 5px;margin-left: 3px;color:  #a2a1a1">{{ context.userMessage.direction }}</span>
                    </el-col>
                    <el-col :span="16" :offset="1" style="margin-top: 8px" >
                      <span style="color:  #a2a1a1">学号：{{context.userMessage.accountId}}</span>
                    </el-col>
                  </el-row>
                <el-row>
                  <el-col :span="24" style="color:  #a2a1a1">
                    <el-form style="text-align: left;color: #a2a1a1 " label-width="75px"  label-position="right" size="mini">
                      <el-form-item>
                         <span slot="label" style="color:  #a2a1a1">QQ号码:</span>
                        {{context.userMessage.qq}}
                      </el-form-item>
                      <el-form-item>
                        <span slot="label" style="color:  #a2a1a1">电话号码:</span>
                        {{context.userMessage.phone}}
                      </el-form-item>
                      <el-form-item>
                        <span slot="label" style="color:  #a2a1a1">自我介绍:</span>
                        {{context.userMessage.selfIntroduction}}
                      </el-form-item>
                    </el-form>
                  </el-col>
                </el-row>

                <span slot="reference" type="info" style="font-size: 17px">
                  <i class="el-icon-user"></i>&nbsp;{{ context.name }}&nbsp;&nbsp;
                </span>
              </el-popover>
               <span style="font-size: 17px">
                 <i class="el-icon-time"></i>&nbsp;于{{ context.time }}发布
               </span>
          </div>
          </div>
          <div style="font-size: 18px;text-align: left">
            <div class="body" v-html="context.infoBody"></div>
            <div class="btn-box">下载附件：
              <el-button type="primary" size="small" @click="download" :disabled="ok">
                <i class="el-icon-download">&nbsp;下载</i>
              </el-button>
            </div>
          </div>
        </el-card>

  </div>
</template>

<script>
import axios from "axios";

const token = window.sessionStorage.getItem('tokenStr')
export default {
  name: "show_blog",
  data() {
    return {
      ok: '',
      context: null,
      page:this.$route.query.page
    }
  },
  computed:{
    id() {
      return window.atob(this.$route.query.id)
    },
    direction() {
      return window.atob(this.$route.query.direction)
    }
  },
  mounted() {
    console.log(this)
    this.getBlog();
  },
  methods: {
    getBlog() {

      const params = new URLSearchParams();
      params.append('id', this.id);
      params.append('direction',this.direction);
      axios.post('http://192.168.31.106:8084/findOneMessage', params,
        {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then(result => {
        console.log(result);
        this.context = result.data
        this.ok = result.data.download;
        console.log(this.context)
      })

      // console.log(this.id)
    },
    download() {
      let a = document.createElement('a')
      a.href = `http://192.168.31.106:8084/download?id=${this.id}&direction=${this.direction}` // 这里的请求方式为get，如果需要认证，接口上需要带上token
      a.click()
    }

  },
}
</script>

<style scoped>
.el-form-item--mini.el-form-item,
.el-form-item--small.el-form-item {
  margin-bottom: 0px;
}
</style>
