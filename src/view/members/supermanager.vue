<template>
  <div>
    <div>
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
              <el-form-item label="设为管理员：">
                <el-switch v-model="form.manager"></el-switch>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="diaLoginVisible = false">取 消</el-button>
              <el-button type="primary" @click="diaLoginVisible = false;addUser()">提 交</el-button>
            </div>
          </el-dialog>
        </div>
      </div>
      <div>
        <el-table
          :data="tableData"
          style="width: 99%"
        >
          <el-table-column
            fixed="left"
            prop="time"
            label="创建时间"
            min-width="300"
          >
          </el-table-column>
          <el-table-column
            prop="accountId"
            label="学号"
            min-width="200">
          </el-table-column>
          <el-table-column
            prop="realName"
            label="姓名"
            min-width="200">
          </el-table-column>
          <el-table-column
            fixed="right"
            label="设为管理员"
            min-width="200">
            <template slot-scope="scope">
                <el-switch  
                  v-model="scope.row.authority"
                  @change="changeManage(scope.$index,tableData)"
                >
                </el-switch>
            </template>
          </el-table-column>
        </el-table>

      </div>
    </div>
  </div>

</template>

<script>
import axios from "axios";
import resetMessage from "../../utils/resetMessage";
import aes from '../../utils/asc';

export default {
  name: "supermanager",
  data(){
    return{
      diaLoginVisible:false,
      form:{
        studentId:'',
        name:'',
        manager:false,
      },
      tableData: null
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
          authority:this.form.manager
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
    },
    changeManage(index, rows){
      const params = new URLSearchParams();
      params.append('id', rows[index].id);
      params.append('authority',rows[index].authority);
      axios.post("http://192.168.31.106:8084/account/updateAuthority",params,
        {headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
      .then(result => {
        if (result.data.state == 600) {
          console.log(result)
          resetMessage({
            message: result.data.msg,
            type: 'success',
            duration: 5 * 1000,
          });
          this.getUsers();
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
  padding: 40px;
}
</style>
