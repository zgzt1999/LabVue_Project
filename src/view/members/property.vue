<template>
  <el-card>
    <div class="header">
      <div class="l-content">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/members/introduce' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>知识产权</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="r-content">
        <el-button @click="addDialogVisible = true">新增产权</el-button>
        <el-dialog title="新增产权"
                   :visible.sync="addDialogVisible"
                   style="text-align: left"
                   :show-close="false"
                   :destroy-on-close="true"
                   :close-on-press-escape="false"
                   :close-on-click-modal="false"
                   @close="closeDialog">
          <el-form :model="messageFrom" class="message-box" label-width="100px">
            <el-form-item label="产权名称：">
              <el-input v-model="messageFrom.name"></el-input>
            </el-form-item>
            <el-form-item label="类型：">
              <el-input v-model="messageFrom.type"></el-input>
            </el-form-item>
            <el-form-item label="发表日期：">
              <el-date-picker
                v-model="messageFrom.year"
                placeholder="选择日期"
                type="date"
                style="width: 100%;"
                value-format="yyyy-MM-dd"
                :picker-options="pickerOptions0">
                >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="发表人：">
              <el-input v-model="messageFrom.team"></el-input>
            </el-form-item>
            <el-form-item label="产权简介：">
              <el-input v-model="messageFrom.introduce" type="textarea" :autosize="{ minRows: 2, maxRows: 4}"></el-input>
            </el-form-item>
            <el-form-item label="上传文件：">
              <el-upload
                action="http://192.168.31.106:8084/property/propertyFileUpload"
                :on-success="changeDisabled"
                accept=".zip,.ZIP,.rar,.RAR">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传.zip/.rar格式的文件</div>
              </el-upload>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" :disabled="openAddProperty" @click="addCompetition">提 交</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
    <div style="text-align: left">
      <div style="margin: 10px;width: 470px;text-align: left" v-for="item in tableData" :key="item" class="student">
        <el-card shadow="hover" @click.native="toProperty(item.id)">
          <div style="margin-bottom: 10px;text-align: left"></div>
          <el-row :gutter="10">
            <el-col :span="24">
              <div style="margin-left: 20px;text-align:left">
                <div style="margin-bottom:8px;font-size: 17px">
                  <strong>{{ item.propertyName}}</strong>
                </div>
                <div style="color: #a2a1a1">
                  <div style="margin-bottom: 8px">
                    类型：{{ item.type }}
                  </div>
                  <div style="margin-bottom: 8px">
                    发表年份：{{ item.year }}
                  </div>
                  <div style="margin-bottom: 8px">
                    发表人员：{{ item.team }}
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </div>
    </div>
    <div class="block" style="margin-top: 20px">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="12"
        layout="prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </el-card>
</template>

<script>
import axios from "axios";
import resetMessage from "../../utils/resetMessage";

export default {
  name: "property",
  data(){
    return {
      addDialogVisible:false,
      messageFrom:{},
      tableData: null,
      total:'',
      openAddProperty:true,
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
    }
  },
  mounted() {
    this.handleCurrentChange(this.currentPage);
  },
  computed: {
    currentPage() {
      return this.$route.query.page;
    },
    },

  watch: {
    // 深度监听路由改变事件
    // Vue项目路由参数改变，接口没有重新调用
    currentPage: {
      handler(now,old){
        if(now != old) {
          this.handleCurrentChange(this.currentPage)
        }
      },
      deep: true,
    }
  },
  methods:{
    addCompetition(){
      this.messageFrom.introduce = this.messageFrom.introduce.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>').replace(/\s/g, '&nbsp;&nbsp;');
      axios({
        method:'POST',
        url:'http://192.168.31.106:8084/property/addProperty',
        data:{
          propertyName: this.messageFrom.name,
          year:this.messageFrom.year,
          team: this.messageFrom.team,
          type:this.messageFrom.type,
          introduce:this.messageFrom.introduce
        }
      }).then(result => {
          if (result){
            resetMessage({
              message: result.data.msg,
              type: 'success',
              duration: 5 * 1000,
            });
            this.addDialogVisible = false;
            this.handleCurrentChange(this.currentPage)
        }
      })
    },
    toProperty(id){
      this.$router.push({path:"/members/show_property",query:{id:id}});
    },
    handleCurrentChange(val) {
      let page = val;
      const params = new URLSearchParams();
      params.append('page', page);
      axios.post("http://192.168.31.106:8084/property/findSomePropertys",params,
        {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then(result => {
        this.$router.push({query:{page:page}});
        this.tableData = result.data.page;
        this.total = result.data.total;
      })
    },
    changeDisabled(response){
      resetMessage({
        message: response,
        type: 'success',
        duration: 5 * 1000,
      });
      this.openAddProperty = false;
    },
    closeDialog(){
      this.messageFrom = {};
      this.openAddProperty = true;
    }

  },

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
  .student{
    display: inline-block;
  }
  .message-box {
    width: 80%;
    margin: auto;
    padding: 40px;
  }

  .student .el-card:hover{
    transform: scale(1, 1.1);
  }

  .el-dialog__wrapper {
    top: 0px;
  }
</style>
