<template>
  <el-card>
    <div class="header">
      <div class="l-content">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/main' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>历届学生</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="r-content">
        <el-button>新增学生</el-button>
      </div>
    </div>

    <div style="margin: 10px;width: 500px" v-for="item in tableData" :key="item" class="student">
      <el-card>
        <div style="margin-bottom: 10px;text-align: left"></div>
        <el-row :gutter="20">
          <el-col :span="5">
            <img :src="item.img" style="width: 100%; height: 110px;margin-left: 20px;" class="image">
          </el-col>
          <el-col :span="18">
            <div style="margin-left: 20px;text-align:left;">
              <div style="margin-bottom:8px;font-size: 17px">
                <strong>{{ item.name }}</strong>
              </div>
              <div style="margin-bottom: 8px">
                入学年份：{{item.date}}
              </div>
              <div style="margin-bottom: 8px">
                研究方向：{{item.address}}
              </div>
              <div>
                个人介绍：{{item.address}}
              </div>
            </div>
          </el-col>
          <el-col style="text-align: left;margin-left: 20px;margin-top: 10px;height: 80px">
            获奖项目:{{item.address}}
          </el-col>
        </el-row>
      </el-card>
    </div>
    <div class="block">
      <el-pagination
        layout="prev, pager, next"
        :total="50">
      </el-pagination>
    </div>
  </el-card>
</template>

<script>
export default {
  name: "student",
  data(){
    return {
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '学生姓名',
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      },{
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      },{
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      },
      ],
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
.student{
  display: inline-block;
}
</style>
