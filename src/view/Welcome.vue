<template>
  <div>
    <el-container>
      <el-header style="height: 60px">
      </el-header>
      <el-divider></el-divider>
      <el-main>
        <el-button @click="toLogin">登录 Login</el-button>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "Welcome",
  methods: {
    toLogin() {
      this.$router.push('/Login')
    },
  }
}
</script>

<style scoped>

.el-header
.header-box{
  height: 60px;
  border-bottom: solid #2c3e50 1px;
}
.el-main
.el-button{
  margin-top: 300px;
  width: 200px;
  height: 100px;
  font-size: 25px;
}

</style>
