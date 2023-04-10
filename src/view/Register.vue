<template>
<!--  已弃用-->
  <div>
    <el-form ref="ruleForm" :model="form" :rules="rules" label-width="80px" class="register-box">
      <h2>注册新用户</h2>
      <el-form-item label="用户名" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPassword">
        <el-input type="password" v-model="form.checkPassword"></el-input>
      </el-form-item>
      <el-form-item label="入学日期" prop="value1">
        <div class="block">
          <el-date-picker
            v-model="form.value1"
            type="date"
            placeholder="选择日期"
            style="width: 320px">
          </el-date-picker>
        </div>
      </el-form-item>
      <el-form-item label="qq号码" prop="qqNum">
        <el-input v-model="form.qqNum"></el-input>
      </el-form-item>
      <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
      <el-button type="primary" @click="toLogin">取消</el-button>
    </el-form>



  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Register",
  data() {
    var validateName = (rule,value,callback) => {
      if(value === ''){
        callback(new Error('用户名不能为空'));
      }else {
        callback();
      }
    }
    var validatePass = (rule,value,callback) => {
      if(value === ''){
        callback(new Error("密码不能为空"));
      }else {
        callback();
      }
    };
    var validatePass2 = (rule,value,callback) => {
      if(value !== this.form.password){
        callback(new Error("两次输入不一致"));
      }else if (value === ''){
        callback(new Error("请输入密码"));
      }else {
        callback();
      }
    };
    var checkDate = (rule,value,callback) => {
      if(value === ''){
        callback(new Error("入学日期不能为空"))
      }else {
        callback();
      }
    };
    var checkNum = (rule,value,callback) => {
      if (value === '') {
        callback(new Error('qq号码不能为空'));
      }else {
        callback();
      }
    }
    return {
      form: {
        name: '',
        password: '',
        checkPassword: '',
        qqNum: '',
        value1:'',
      },
      rules: {
        name: [
          { validator: validateName, trigger: 'blur' },
        ],
        password: [
          { validator: validatePass, trigger: 'blur' },
        ],
        checkPassword: [
          { validator: validatePass2, trigger: 'blur' },
        ],
        value1: [
          { validator: checkDate, trigger: 'blur' },
        ],
        qqNum: [
          { validator: checkNum, trigger: 'blur' },
        ]
      }
    }
  },
  methods:{
    toLogin() {
      this.$router.push('/login')
    },
    submitForm() {
      this.$refs.ruleForm.validate(valid =>{
        if(valid){
          let param = new URLSearchParams()
          param.append('name',this.form.name)
          param.append('password',this.form.password)
          param.append('date',this.form.value1)
          param.append('qqnum',this.form.qqNum)

          axios.post("http://localhost:8080/ssmProject_war_exploded/account/logIn",param).then(function (response){
            console.log(response);
          });
          this.$message({
            message:'注册成功,请登录',
            type:'success',
          });
          this.$router.push('/Login');
        }else {
          console.log("error submit!");
          return false;
        }
      })
    }
  }
}
</script>

<style scoped>
.register-box {
  width: 400px;
  margin: 200px auto;
  border: 1px solid #DCDFE6;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 0 30px #DCDFE6;
}


</style>
