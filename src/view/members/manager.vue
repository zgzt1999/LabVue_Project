<template>
  <div>
    <el-card class="box-card" style="min-height:100vh">
      <div class="header">
        <div class="l-content">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/members/introduce' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>管理员页面</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="r-content">
          <el-button @click="diaLoginVisible = true">新增账号</el-button>
          <el-dialog title="新增账号" :visible.sync="diaLoginVisible" style="text-align: left">
            <el-form :model="form" class="message-box" label-width="100px">
              <el-form-item label="学号：">
                <el-input v-model="form.studentId"></el-input>
              </el-form-item>
              <el-form-item label="真实姓名：">
                <el-input v-model="form.name"></el-input>
              </el-form-item>
              <el-form-item label="密码：">
                <el-input v-model="form.studentId"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="diaLoginVisible = false">取 消</el-button>
              <el-button type="primary" @click="diaLoginVisible=false;addUser()">提 交</el-button>
            </div>
          </el-dialog>
        </div>
      </div>
      <div class="body">
        <el-table
          :data="tableData"
          style="width: 99%"
          >
          <el-table-column
            fixed
            prop="time"
            label="创建时间"
            min-width="300"
            >
          </el-table-column>
          <el-table-column
            prop="accountId"
            label="学号"
            min-width="300">
          </el-table-column>
          <el-table-column
            fixed="right"
            prop="realName"
            label="姓名"
            min-width="300">
          </el-table-column>
        </el-table>
      </div>
    </el-card>

  </div>

</template>

<script>
import axios from "axios";
import resetMessage from "../../utils/resetMessage";
import aes from '../../utils/asc';

export default {
  name: "manager",
  data(){
    return{
      diaLoginVisible:false,
      form:{
        studentId:'',
        name:'',
        password:'',
      },
      tableData: null,
    }
  },
  mounted() {
    this.getUsers();
  },
  methods:{
    getUsers() {
      axios({
        method:'GET',
        url:'http://192.168.31.106:8084/account/getUsers'
      }).then(result => {
        this.tableData = result.data
      })
    },
    addUser() {
      let encryptionPassword = aes.encrypt(this.form.studentId);
      axios({
        method: 'POST',
        url: 'http://192.168.31.106:8084/account/save',
        data:{
          name:this.form.studentId,
          password:encryptionPassword,
          realName:this.form.name,
        }
      })
        .then(result => {
          if (result){
            resetMessage({
              message: result.data,
              type: 'success',
              duration: 5 * 1000,
            });
            this.getUsers();
            this.form = {};
          }
        })
    }
  }
}
</script>

<style scoped>
.header{
  display: flex;
  justify-content: space-between;
}
.r-content{
  display: flex;
}
.l-content{
  display: flex;
}
.message-box {
  width: 80%;
  margin: auto;
  padding: 20px;
}
</style>
