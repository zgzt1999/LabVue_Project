<template>
  <div class="login">
    <el-form ref="form" :model="form" label-width="80px" class="login-box">
      <h2>欢迎登录</h2>
      <el-form-item label="用户名：">
        <el-input placeholder="请输入用户名" v-model="form.name" @keyup.enter.native="onSubmit"></el-input>
      </el-form-item>
      <el-form-item label="密码：">
        <el-input show-password placeholder="请输入密码" v-model="form.password" @keyup.enter.native="onSubmit"></el-input>
      </el-form-item>
        <el-button type="primary" @click="onSubmit" >登录</el-button>
    </el-form>
  </div>
</template>

<script>
import aes from '../utils/asc';


export default {
  name: "Login",
  data(){
    return{
      form:{
        name:'',
        password:''
      }
    }
  },
  methods: {
    onSubmit() {
      // let encryptionPassword = aes.encrypt(this.form.password); // 对密码进行加密
      let encryptionPassword = this.form.password;
      this.axios.post("http://192.168.31.106:8084/account/logIn",{name:this.form.name,password:encryptionPassword}).then(response => {
        console.log(response);
        if(response.data.state == 600){
          const tokenStr = response.data.token;//从后端返回的map中获取其中的token
          const authority = response.data.authority;//获取用户的权限
          window.sessionStorage.setItem('authority', authority);
          window.sessionStorage.setItem('tokenStr', tokenStr);//将token放入浏览器中的sessionStorage中
          // sessionStorage.setItem('login',true);
          // console.log(tokenStr);
          this.$router.push('/members/introduce');

          // console.log(response);
        }else {
          this.$message({
            message: response.data.msg,
            type: 'error'
          });
        }
      })
    },

  }

}
</script>

<style scoped>
.login-box {
  width: 400px;
  height: 220px;
  position: absolute;
  transform: translate(-50%,-60%);
  top: 50%;
  left: 50%;
  border: 1px solid #000000;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 0 30px #DCDFE6;
}
.login-title {
  text-align: center;
}
.login {
  position: relative;
  height: 100vh;
}
</style>
