<template>
  <div>
    <el-row type="flex" justify="center" :gutter="20">
      <el-col :span="24">
        <div>
          <el-card>
            <div slot="header" class="clearfix"style="font-size: 20px;display: flex;justify-content: space-between">
              <div style="padding-top: 6px"><strong>资源存储</strong></div>
              <div>
                <el-button type="primary" @click="searchBlogVisible=true">搜索博文</el-button>
                <el-dialog
                  title="搜索博文"
                  :visible.sync="searchBlogVisible"
                  style="text-align: left;"
                  @closed="handleClose">
                  <el-form class="message-box" label-width="70px" >
                    <el-form-item label="搜索：">
                     <el-input
                       style="width: 60%"
                       clearable
                       v-model="search"
                       @keyup.enter.native="searchBlog"
                     ></el-input>
                    </el-form-item>
                  </el-form>
                  <el-table
                    :data="seaBlogList"
                    style="width: 100%"
                    max-height="500"
                  >
                    <el-table-column
                      fixed
                      prop="time"
                      label="上传时间"
                      width="300">
                    </el-table-column>
                    <el-table-column
                      fixed
                      prop="name"
                      label="作者"
                      width="300">
                    </el-table-column>
                    <el-table-column
                      prop="infoName"
                      label="博文名"
                      width="300">
                      <template slot-scope="scope">
                        <el-link
                          @click="gotoBlog(scope.$index,seaBlogList)">
                          {{scope.row.infoName}}
                        </el-link>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-dialog>
                <el-button @click="toAddTie" type="primary">发帖</el-button>
              </div>
            </div>
<!--            <div class="blog-box" style="margin: 20px 0" v-for="item in listData" :key="item">-->
            <div class="blog-box" style="margin: 20px 0" v-for="item in tableData" :key="item">
            <el-card shadow="hover" @click.native="toBlog(item.id,direction)">
                <div style="margin-bottom: 10px;text-align: left">
<!--                  <el-link :href="'#/members/show_blog?id='+item.id" style="font-size: 17px">-->
                  <strong>{{ item.infoName }}</strong>
<!--                  </el-link>-->
                </div>
                <el-row :gutter="20">
                  <el-col :span="24">
                    <div style="color: #a2a1a1;
                          height: 100px;
                          margin-bottom: 10px;
                          text-align:left;
                          ">{{ item.infoSummary}}</div>
                    <div style="height: 50px;line-height: 50px;text-align: right">
                      <span style="color: #a2a1a1;font-size: 13px">
                        作者：{{ item.name }} &nbsp;&nbsp;&nbsp;
                        时间：{{ item.time }}&nbsp;&nbsp;&nbsp;
                      </span>
                    </div>
                  </el-col>
                </el-row>
              </el-card>

            </div>

            <div>
              <el-pagination
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-size="4"
                layout="prev, pager, next, jumper"
                :total="total">
              </el-pagination>
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import axios from "axios";


export default {
  name: "blog",
  data() {
    return {
      tableData: null,
      listData:null,
      seaBlogList:null,
      searchData:[],
      total:'',
      searchBlogVisible:false,
      // direction:this.$route.query.direction,
      // currentPage:this.$route.query.page,
      search:'',
  }
  },
  mounted() {
    this.handleCurrentChange(this.currentPage);


  },
  // created () {
  //   this.handleCurrentChange(this.page);
  // },
  computed: {
    currentPage() {
      return this.$route.query.page;
    },
    direction() {
      return this.$route.query.direction;
    }

  },
  watch: {
    // 深度监听路由改变事件
    // Vue项目路由参数改变，接口没有重新调用
    direction:{
      handler(now,old){
        if(now != old) {
          this.handleCurrentChange(this.currentPage)
        }
      },
        deep: true,
    },
  },



  methods: {
    handleCurrentChange(val) {
      let page = val;
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('direction',this.direction);
      axios.post('http://192.168.31.106:8084/findSomeInfo', params,
        {headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
        .then(result => {
          this.$router.push({
            query: {
              direction:this.direction,
              page: page,
            }
          })
          if (result) {
            this.tableData = result.data.page;
            this.total = result.data.total;
          }
        })
    },
    toAddTie(){
      this.$router.push({path:"./edit_blog",query:{direction:this.direction}})
    },
    toBlog(id,direction){
      const ids = window.btoa(id);
      const directions = window.btoa(direction)
      this.$router.push({path:"/members/show_blog",query:{direction:directions,id:ids}});
    },




    searchBlog(){
      const params = new URLSearchParams();
      params.append('word',this.search);
      params.append('direction',this.direction);
      axios.post('http://192.168.31.106:8084/findInfoOfSomeWord',params,
        {headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
      .then(result => {
        if (result) {
          this.seaBlogList = result.data;
        }
      })
    },
    handleClose(){
      this.search = '';
      this.seaBlogList = null;
    },
    gotoBlog(index,rows) {
      const ids = window.btoa(rows[index].id);
      const directions = window.btoa(this.direction)
      this.$router.push({path:"/members/show_blog",query:{id:ids,direction:directions}})
    },

  }
}
</script>

<style scoped>
.blog-box .el-card:hover{
  transform: scale(1, 1.1);
}

</style>
