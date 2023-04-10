<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom: 20px">
      <el-breadcrumb-item :to="{ path: '/members/introduce' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>科研项目</el-breadcrumb-item>
      <el-breadcrumb-item>项目说明</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row>
      <el-col>
          <div class="title" style="text-align: left;font-size: 25px">
            <h2>{{context.projectName}}</h2>
          </div>
          <div class="header-box" style="text-align: left;color: #a2a1a1;margin-bottom: 20px;font-size: 22px">
            <span class="iconfont icon-teamtuandui" style="font-size: 22px">&nbsp;{{context.team}}&nbsp;&nbsp;&nbsp;</span>
            <i class="el-icon-date" >&nbsp;{{context.year}}&nbsp;&nbsp;&nbsp;</i>
            <i class="el-icon-discover">&nbsp;{{context.direction}}&nbsp;&nbsp;&nbsp;</i>
          </div>
          <el-tabs tab-position="left" style="text-align: left;font-size: 23px;margin-top: 50px">
            <el-tab-pane label="项目描述">
              <div style="margin-left: 30px" v-html="context.details"></div>
            </el-tab-pane>
            <el-tab-pane label="项目方法">
              <div style="margin-left: 30px" v-html="context.process"></div>
            </el-tab-pane>
            <el-tab-pane label="相关设备">
              <div style="margin-left: 30px" v-html="context.equipment"></div>
            </el-tab-pane>
          </el-tabs>

      </el-col>
    </el-row>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "show_project",
  data() {
    return{
      id : this.$route.query.id,
      page:this.$route.query.page,
      context:null
    }
  },
  mounted() {
    this.getOneCompetition()
  },
  methods:{
    getOneCompetition() {
      const params = new URLSearchParams();
      params.append('id', this.id);
      axios.post('http://192.168.31.106:8084/project/findOneProject', params,
        {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then(result => {
        console.log(result);
        this.context = result.data
        console.log(this.context)
      })
    }
  }
}
</script>

<style scoped>

</style>
