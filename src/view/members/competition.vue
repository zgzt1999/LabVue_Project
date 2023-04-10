<template>
  <el-card>
    <div class="header">
      <div class="l-content">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/members/introduce' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>竞赛获奖</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="r-content">
        <el-button @click="addDialogVisible = true">新增获奖</el-button>
        <el-dialog title="新增项目" :visible.sync="addDialogVisible" style="text-align: left">
          <el-form :model="messageFrom" class="message-box" label-width="100px">
            <el-form-item label="项目名称：">
              <el-input v-model="messageFrom.name"></el-input>
            </el-form-item>
            <el-form-item label="参与大赛：">
              <el-input v-model="messageFrom.competition"></el-input>
            </el-form-item>
            <el-form-item label="参与年份：">
              <el-date-picker
                v-model="messageFrom.year"
                placeholder="选择年"
                type="year"
                style="width: 100%;"
                value-format="yyyy"
                :picker-options="pickerOptions0"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="参与人员：">
              <el-input v-model="messageFrom.team"></el-input>
            </el-form-item>
            <el-form-item label="研究方向：">
              <el-select style="width: 100%" v-model="messageFrom.direction">
                <el-option label="算法" value="算法"></el-option>
                <el-option label="信息系统" value="信息系统"></el-option>
                <el-option label="硬件" value="硬件"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="获得奖项：">
              <el-input v-model="messageFrom.prize"></el-input>
            </el-form-item>
            <el-form-item label="比赛描述：">
              <el-input type="textarea" :rows="3" v-model="messageFrom.describe"></el-input>
            </el-form-item>
            <el-form-item label="比赛心得：">
              <el-input type="textarea" :rows="3" v-model="messageFrom.experience"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addDialogVisible = false;addCompetition() ">提 交</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
    <div style="text-align: left">
      <div style="margin: 10px;width: 475px;text-align: left" v-for="item in tableData" :key="item" class="student">
        <el-card shadow="hover" @click.native="toCompetition(item.id)">
          <div style="margin-bottom: 10px;text-align: left"></div>
          <el-row :gutter="20">
            <el-col :span="18">
              <div style="margin-left: 20px;text-align:left">
                <div style="margin-bottom:8px;font-size: 17px">
                  <strong>{{ item.work }}</strong>
                </div>
                <div style="color: #a2a1a1">
                  <div style="margin-bottom: 8px">
                    参与大赛：{{ item.competitionName }}
                  </div>
                  <div style="margin-bottom: 8px">
                    参赛年份：{{ item.year }}
                  </div>
                  <div style="margin-bottom: 8px">
                    参与人员：{{ item.team }}
                  </div>
                  <div style="margin-bottom: 8px">
                    研究方向：{{ item.direction }}
                  </div>
                  <div>
                    获得奖项：{{ item.award }}
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
  name: "competition",
  data(){
    return {
      addDialogVisible:false,
      messageFrom:{},
      tableData: null,
      total:'',
      currentPage:this.$route.query.page,
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
    }
  },
  created () {
    this.initData()
  },

  watch: {
    // 深度监听路由改变事件
    // Vue项目路由参数改变，接口没有重新调用
    '$route': {
      handler () {
        this.currentPage = this.$route.query.page;//对项目所传的参数进行更新
        this.initData();//重新调用接口
      },
      deep: true,
      immediate: true,
    }
  },
  mounted() {
    this.handleCurrentChange(this.currentPage);
  },
  methods:{
    addCompetition(){
      this.messageFrom.experience = this.messageFrom.experience.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>').replace(/\s/g, '&nbsp;&nbsp;');
      this.messageFrom.describe = this.messageFrom.describe.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>').replace(/\s/g, '&nbsp;&nbsp;');
      axios({
        method:'POST',
        url:'http://192.168.31.106:8084/competition/addCompetition',
        data:{
          competitionName: this.messageFrom.competition,
          year:this.messageFrom.year,
          team: this.messageFrom.team,
          details: this.messageFrom.describe,
          feeling: this.messageFrom.experience,
          work: this.messageFrom.name,
          award: this.messageFrom.prize,
          direction: this.messageFrom.direction
        }
      }).then(result => {
        if (result.data.state == 605){
          console.log(result);
          resetMessage({
            message: result.data.msg,
            type: 'success',
            duration: 5 * 1000,
          });
          this.handleCurrentChange(this.currentPage);
          this.messageFrom = {};
        }else {
          resetMessage({
            message: result.data.msg,
            type: 'error',
            duration: 5 * 1000,
          });
        }
      })
    },
    toCompetition(id){
      this.$router.push({path:"/members/show_competition",query:{id:id}});
    },
    handleCurrentChange(val) {
      // 改变默认的页数
      console.log(val);
      this.currentPage = val;
      console.log(this.currentPage)
      const params = new URLSearchParams();
      params.append('page', this.currentPage);
      axios.post("http://192.168.31.106:8084/competition/findSomeCompetitions",params,
        {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then(result => {
          this.$router.push({
            query:{page:this.currentPage}
          });
          // console.log(result)
          this.tableData = result.data.page;
          this.total = result.data.total;
          // console.log(this.tableData);
        })
    },
    // 在这里调用页面加载时的事件
    initData () {
      this.handleCurrentChange(this.currentPage)
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

</style>
