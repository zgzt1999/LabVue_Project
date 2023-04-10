<template>
  <div>
    <el-card>
      <div class="header">
        <div class="l-content">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/members/introduce' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>发表论文</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="r-content">
          <el-button @click="addDialogVisible = true">新增论文</el-button>
          <el-dialog title="新增论文"
                     :visible.sync="addDialogVisible"
                     style="text-align: left"
                     :show-close="false"
                     :destroy-on-close="true"
                     :close-on-press-escape="false"
                     :close-on-click-modal="false"
                     @close="closeDialog">
            <el-form ref="messageForm" :model="messageFrom" class="message-box" label-width="100px">
              <el-form-item label="论文名称：">
                <el-input v-model="messageFrom.name"></el-input>
              </el-form-item>
              <el-form-item label="发表期刊：">
                <el-input v-model="messageFrom.journal"></el-input>
              </el-form-item>
              <el-form-item label="发表年份：">
                <el-date-picker
                  v-model="messageFrom.year"
                  placeholder="选择年份"
                  type="year"
                  style="width: 100%;"
                  value-format="yyyy"
                  :picker-options="pickerOptions0">
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item label="发表人：">
                <el-input v-model="messageFrom.team"></el-input>
              </el-form-item>
              <el-form-item label="上传论文：">
                <el-upload
                  action="http://192.168.31.106:8084/paper/uploadPaper"
                  accept=".pdf,.PDF"
                  :before-remove="beforeRemove"
                  :on-remove="handleRemove"
                  :on-success="changeDisabled">
                  <el-button size="small" type="primary">点击上传</el-button>
                  <div slot="tip" class="el-upload__tip">只能上传.pdf格式的文件</div>
                </el-upload>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="addDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="addPaper" :disabled="openAddPaper">提 交</el-button>
            </div>
          </el-dialog>
        </div>
      </div>
      <div style="text-align: left">
        <div style="margin: 10px;width: 470px;text-align: left" v-for="item in tableData" :key="item" class="student">
          <el-card shadow="hover" @click.native="toEssay(item.id)">
            <div style="margin-bottom: 10px;text-align: left"></div>
            <el-row :gutter="10">
              <el-col :span="24">
                <div style="margin-left: 20px;text-align:left">
                  <div style="margin-bottom:8px;font-size: 17px">
                    <strong>{{ item.paperName}}</strong>
                  </div>
                  <div style="color: #a2a1a1">
                    <div style="margin-bottom: 8px">
                      发表期刊：{{ item.periodical }}
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
  </div>
</template>

<script>
import axios from "axios";
import resetMessage from "../../utils/resetMessage";

export default {
  name: "essay",
  data(){
    return {
      addDialogVisible:false,
      messageFrom:{},
      tableData: null,
      total:'',
      openAddPaper:true,
      successUpload:false,
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
    currentPage(){
      return this.$route.query.page;
    }

  },

  watch: {
    // 深度监听路由改变事件
    // Vue项目路由参数改变，接口没有重新调用
    currentPage: {
      handler () {
      this.handleCurrentChange(this.currentPage)
      },
      deep: true
    }
  },
  methods:{
    addPaper(){
      axios({
        method:'POST',
        url:'http://192.168.31.106:8084/paper/addPaper',
        data:{
          paperName: this.messageFrom.name,
          year:this.messageFrom.year,
          team: this.messageFrom.team,
          periodical:this.messageFrom.journal,
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
    closeDialog(){
      this.messageFrom = {};
      this.openAddPaper = true;
      if(this.successUpload){
        axios({
          method: 'GET',
          url: 'http://192.168.31.106:8084/paper/paperFileCancel'
        })
      }

    },
    changeDisabled(response){
      resetMessage({
        message: response,
        type: 'success',
        duration: 5 * 1000,
      });
      this.openAddPaper = false;
      this.successUpload = true;
    },
    beforeRemove(file) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
      axios({
        method: 'GET',
        url: 'http://192.168.31.106:8084/paper/paperFileCancel'
      }).then(result => {
        resetMessage({
          message: result.data,
          type: 'success',
          duration: 5 * 1000,
        });
      })
    },
    toEssay(id){
      window.open( "http://192.168.31.106:8084/paper/openPdf?id="+id,'_blank');
    },
    handleCurrentChange(val) {
      // 改变默认的页数
      this.currentPage = val;
      const params = new URLSearchParams();
      params.append('page', this.currentPage);
      axios.post("http://192.168.31.106:8084/paper/findSomePapers",params,
        {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then(result => {
        this.$router.push({query:{page:this.currentPage}});
        this.tableData = result.data.page;
        this.total = result.data.total;
      })
    },
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
