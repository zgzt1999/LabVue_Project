<template>
  <div id="app">
    <el-container>
      <el-header>
        <div class="l-content">
          <el-menu  class="el-menu-demo" mode="horizontal" :default-active="this.$route.path" router>
            <el-menu-item index="/members/introduce" style="font-size: 20px">
              <img src="../assets/labLogo.png" style="height: 100%" object-fit="cover">
            </el-menu-item>
          </el-menu>
        </div>
        <div class="r-content">
          <el-button
            v-if="manage"
            style="margin-right: 15px"
            @click="intoManager">
            管理员页面</el-button>
          <el-dropdown placement="top" @command="handleCommand">
            <el-avatar :size="50" style="margin-right: 15px" :src="imgSrc"></el-avatar>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="userinfo">个人中心</el-dropdown-item>
              <el-dropdown-item command="logout">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <el-container style="border: 1px solid #eee">
        <el-aside width="15%" style="background-color: rgb(238, 241, 246)">
          <el-menu  :default-active="$route.path" router>
            <el-menu-item index="/members/introduce" style="font-size: 19px">实验室介绍</el-menu-item>
            <el-menu-item :index="{path:'/members/photo',query:{page:1}}" style="font-size: 19px">实验室相册</el-menu-item>
            <el-submenu index="3">
              <template slot="title">科研成果</template>
              <el-menu-item :index="{path:'/members/project',query:{page:1}}">科研项目</el-menu-item>
              <el-menu-item :index="{path:'/members/competition',query:{page:1}}">比赛获奖</el-menu-item>
              <el-menu-item :index="{path:'/members/essay',query:{page:1}}">发表论文</el-menu-item>
              <el-menu-item :index="{path:'/members/property',query:{page:1}}">知识产权</el-menu-item>
            </el-submenu>
            <el-submenu index="4">
              <template slot="title">资料存储</template>
              <el-menu-item :index="{path:'/members/blog',query:{direction:'arithmetic',page:1}}" >算法</el-menu-item>
              <el-menu-item :index="{path:'/members/blog',query:{direction:'software',page:1}}">信息系统</el-menu-item>
              <el-menu-item :index="{path:'/members/blog',query:{direction:'hardware',page:1}}">硬件</el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <div></div>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>




<script>
import axios from "axios";

export default {
  name: "Main",
  mounted() {
    this.intoHeadPhoto();
    this.selectAuthority();
  },
  methods: {
    handleCommand(command) {
      if(command == 'userinfo') {
        // console.log(command)
        this.$router.push('/members/adminfo');
      }else if(command == 'logout') {
        this.$router.replace('/Login');
        this.$message({
          message: "注销成功",
          type: 'warning'
        });
        window.sessionStorage.removeItem('tokenStr');
        window.sessionStorage.removeItem('authority');
      }
    },
    intoHeadPhoto(){
      axios({
        method:'GET',
        url:'http://192.168.31.106:8084/account/headPhoto'
      }).then(result =>{
        this.imgSrc = result.data;
        // console.log(result)
      })
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    intoManager(){
      const manage = window.sessionStorage.getItem("authority") ;
      if(manage == 2) {
        this.$router.push("/members/supermanager");
      }else{
        this.$router.push("/members/manager")
      }

    },
    selectAuthority(){
      //判断是否出现管理员的按钮
      const authority = window.sessionStorage.getItem("authority");
       if(authority == 1||authority == 2){
        this.manage = true;
      }else {
        this.manage =false;
      }
    },
  },
  data() {
    return{
      imgSrc:'',
      manage:'',
    }
  },

}
</script>

<style>

html,
body,
#app,
.el-container {
  min-height: 93.74vh ;
}


header{
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: space-between;
}

.l-content{
  align-items: center;
}

.r-content,.el-dropdown {
  display: flex;
  align-items: center;
}
.el-submenu__title{
  font-size: 19px;
}
.el-menu-item * {
  vertical-align: inherit;
}
.el-aside {
  text-align: left;
}
</style>
