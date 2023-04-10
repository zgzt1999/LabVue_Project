<template>
  <div>
    <div class="personData">
      <el-card shadow="never">
        <div style="margin: 30px 0" >
          <el-row :gutter="20">
            <el-col :span="4" style="text-align: center">
              <el-upload
                class="avatar-uploader"
                action="http://192.168.31.106:8084/personalCenter/updatePhoto"
                name="headPhoto"
                :headers="MyHeader"
                :limit="1"
                :on-success="handleSuccess"
              >
                <el-avatar
                  :size="200"
                  :src='account.headPhotoUrl'>
                </el-avatar>
              </el-upload>
            </el-col>
            <el-col :span="16">
              <div style="margin-bottom: 20px;margin-top: -30px;margin-left: -20px;text-align:left;font-size: 18px">
                <strong>{{ account.realName }}</strong>
              </div>
              <div>
                <el-form style="text-align: left" label-width="100px"  label-position="right">
                  <el-form-item label="学号/账号：" >{{ account.accountId}}
                  </el-form-item>
                  <el-form-item label="入学日期：">{{ account.enrollDate }}
                  </el-form-item>
                  <el-form-item label="电话号码：">{{ account.phone }}
                  </el-form-item>
                  <el-form-item label="QQ号码：">{{ account.qq }}
                  </el-form-item>
                  <el-form-item label="研究方向：">{{ account.direction }}
                  </el-form-item>
                </el-form>
              </div>
            </el-col>
          </el-row>
        </div>
        <el-row type="flex" justify="space-between">
          <el-col :span="12">
            <el-form style="text-align: left">
              <el-form-item label="自我介绍:" style="margin-left: 0px">{{account.selfIntroduction}}
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="8" style="text-align:end">
            <el-button @click="dialogFormVisible = true">修改信息</el-button>
            <el-dialog title="修改信息" :visible.sync="dialogFormVisible" style="text-align: left">
              <el-form label-width="100px" class="login-box" :model="modifyForm" ref="modifyForm" :rules="rules">
                <el-form-item label="姓名：" prop="realName">
<!--                  表单验证名字必须对应-->
                  <el-input v-model="modifyForm.realName"  ></el-input>
                </el-form-item>
                <el-form-item label="密码：">
                  <el-input show-password  v-model="modifyForm.password"  ></el-input>
                </el-form-item>
                <el-form-item label="入学日期：">
                  <el-date-picker type="date" placeholder="选择日期" value-format="yyyy-MM-dd" style="width: 100%;" v-model="modifyForm.enrollDate"></el-date-picker>
                </el-form-item>
                <el-form-item label="电话号码：">
                  <el-input v-model="modifyForm.phone"></el-input>
                </el-form-item>
                <el-form-item label="QQ号码：">
                  <el-input v-model="modifyForm.qq"></el-input>
                </el-form-item>
                <el-form-item label="研究方向：">
                  <el-select style="width: 100%" v-model="modifyForm.direction">
                    <el-option label="算法" value="算法"></el-option>
                    <el-option label="信息系统" value="信息系统"></el-option>
                    <el-option label="硬件" value="硬件"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="自我介绍：" >
                  <el-input type="textarea" v-model="modifyForm.selfIntroduction"></el-input>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="modifyMessage">提 交</el-button>
              </div>
            </el-dialog>
          </el-col>
        </el-row>
      </el-card>
    </div>
    <div class="topic" style="margin-top: 10px">
      <el-row :gutter="10">
        <el-col :span="6">
          <el-card  :body-style="{ padding: '40px' }" shadow="hover" @click.native="dialogComVisible=true;getModifyCompetition()">
            <el-link :underline="false">
              <i class= 'el-icon-medal' style="font-size: 40px" ></i>
              <div style="padding-top: 24px;">
                <div class="bottom clearfix">
                  我的获奖
                </div>
              </div>
            </el-link>
          </el-card>
          <el-dialog
            title="修改比赛"
            :visible.sync="dialogComVisible"
            style="text-align: left;"
          >
            <el-table
              :data="tableData"
              style="width: 100%"
              max-height="500"
              >
              <el-table-column
                fixed
                prop="time"
                label="发帖时间"
                width="250">
              </el-table-column>
              <el-table-column
                prop="year"
                label="参与年份"
                width="140">
              </el-table-column>
              <el-table-column
                prop="competitionName"
                label="参与大赛"
                width="240">
                <template slot-scope="scope">
                  {{scope.row.competitionName}}
                </template>
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                width="160">
                <template slot-scope="scope">
                  <el-button
                    @click.native="modDialogVisible=true"
                    @click.native.prevent="addModComRowForm(scope.$index, tableData)"
                    type="warning"
                    size="mini">
                    编辑
                  </el-button>
                  <el-button
                    @click.native.prevent="deleteComRow(scope.$index, tableData)"
                    type="danger"
                    size="mini">
                    移除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-dialog>
          <el-dialog title="修改比赛" :visible.sync="modDialogVisible" style="text-align: left;">
            <el-form class="message-box" label-width="100px" :model="modCompetitionForm">
              <el-form-item label="项目名称：">
                <el-input v-model="modCompetitionForm.work"></el-input>
              </el-form-item>
              <el-form-item label="参与大赛：">
                <el-input v-model="modCompetitionForm.competitionName"></el-input>
              </el-form-item>
              <el-form-item label="参与年份：">
                <el-date-picker
                  type="year"
                  placeholder="选择年"
                  value-format="yyyy"
                  style="width: 100%;"
                  v-model="modCompetitionForm.year"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="参与人员：">
                <el-input v-model="modCompetitionForm.team" ></el-input>
              </el-form-item>
              <el-form-item label="研究方向：">
                <el-select style="width: 100%" v-model="modCompetitionForm.direction">
                  <el-option label="算法" value="算法"></el-option>
                  <el-option label="信息系统" value="信息系统"></el-option>
                  <el-option label="硬件" value="硬件"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="获得奖项：">
                <el-input v-model="modCompetitionForm.award"></el-input>
              </el-form-item>
              <el-form-item label="比赛描述：">
                <el-input type="textarea" :rows="3" v-model="modCompetitionForm.details"></el-input>
              </el-form-item>
              <el-form-item label="比赛心得：">
                <el-input type="textarea" :rows="3" v-model="modCompetitionForm.feeling"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="modDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="modDialogVisible = false;uploadComModForm()">提 交</el-button>
            </div>
          </el-dialog>
        </el-col>
        <el-col :span="6">
          <el-card  :body-style="{ padding: '40px' }" shadow="hover" @click.native="dialogProVisible=true;getModProject()">
            <el-link :underline="false">
              <i class= 'el-icon-folder' style="font-size: 40px" ></i>
              <div style="padding-top: 24px;">
                <div class="bottom clearfix">
                  我的项目
                </div>
              </div>
            </el-link>
          </el-card>
          <el-dialog
            title="修改项目"
            :visible.sync="dialogProVisible"
            style="text-align: left;"
          >
            <el-table
              :data="proTableData"
              style="width: 100%"
              max-height="500"
              @row-click="gotoProject">
              <el-table-column
                fixed
                prop="time"
                label="发帖时间"
                width="250">
              </el-table-column>
              <el-table-column
                prop="year"
                label="参与年份"
                width="140">
              </el-table-column>
              <el-table-column
                prop="projectName"
                label="项目名称"
                width="240">
                <template slot-scope="scope">
                    {{scope.row.projectName}}
                </template>
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                width="160">
                <template slot-scope="scope">
                  <el-button
                    @click.stop="modProDialogVisible=true;addModProRowForm(scope.$index,proTableData)"
                    type="warning"
                    size="mini">
                    编辑
                  </el-button>
                  <el-button
                    @click.native.prevent="deleteProRow(scope.$index,proTableData)"
                    type="danger"
                    size="mini">
                    移除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <!--          修改项目对话框      -->
          </el-dialog>
          <el-dialog title="修改项目" :visible.sync="modProDialogVisible" style="text-align: left;">
            <el-form class="message-box" label-width="100px" :model="modProjectForm">
              <el-form-item label="项目名称：">
                <el-input v-model="modProjectForm.projectName"></el-input>
              </el-form-item>
              <el-form-item label="项目年份：">
                <el-date-picker
                  type="year"
                  placeholder="选择年"
                  value-format="yyyy"
                  style="width: 100%;"
                  v-model="modProjectForm.year"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="参与人员：">
                <el-input v-model="modProjectForm.team" ></el-input>
              </el-form-item>
              <el-form-item label="研究方向：">
                <el-select style="width: 100%" v-model="modProjectForm.direction">
                  <el-option label="算法" value="算法"></el-option>
                  <el-option label="信息系统" value="信息系统"></el-option>
                  <el-option label="硬件" value="硬件"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="项目设备：">
                <el-input v-model="modProjectForm.equipment"></el-input>
              </el-form-item>
              <el-form-item label="项目描述：">
                <el-input type="textarea" :rows="3" v-model="modProjectForm.details"></el-input>
              </el-form-item>
              <el-form-item label="项目方法：">
                <el-input type="textarea" :rows="3" v-model="modProjectForm.process"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="modProDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="modProDialogVisible = false;uploadProModForm()">提 交</el-button>
            </div>
          </el-dialog>
        </el-col>
        <el-col :span="6">
          <el-card  :body-style="{ padding: '40px' }" shadow="hover" @click.native="modBlogVisible=true;getDirectionBlog()">
            <el-link :underline="false">
              <i class= 'el-icon-document' style="font-size: 40px" ></i>
              <div style="padding-top: 24px;">
                <div class="bottom clearfix">
                  我的博文
                </div>
              </div>
            </el-link>
          </el-card>
          <el-dialog
            title="修改博文"
            :visible.sync="modBlogVisible"
            style="text-align: left;">
            <el-form class="message-box" label-width="100px" >
              <el-form-item label="研究方向：">
                <el-select
                  style="width: 100%"
                  v-model="blogDirection"
                  @change="getDirectionBlog"
                  ref="selectDirection"
                  @visible-change="isShowSelectOptions"
                  >
                  <el-option label="算法" value="arithmetic"></el-option>
                  <el-option label="信息系统" value="software"></el-option>
                  <el-option label="硬件" value="hardware"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <el-table
              :data="blogList"
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
                prop="infoName"
                label="博文名"
                width="300">
                <template slot-scope="scope">
                  <el-link
                  @click="gotoBlog(scope.$index,blogList)">
                    {{scope.row.infoName}}
                  </el-link>
                </template>
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                width="180">
                <template slot-scope="scope">
                  <el-button
                    @click.native.prevent="modBlog(scope.$index,blogList)"
                    type="warning"
                    size="mini">
                    编辑
                  </el-button>
                  <el-button
                    @click.native.prevent="deleteBlog(scope.$index,blogList)"
                    type="danger"
                    size="mini">
                    移除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-dialog>
        </el-col>
        <el-col :span="6">
          <el-card :body-style="{ padding: '40px' }" shadow="hover" @click.native="dialogPhotoVisible=true;getAlbum()">
            <el-link :underline="false">
              <i class='el-icon-picture-outline' style="font-size: 40px"></i>
              <div style="padding-top: 24px">
                <div class="bottom clearfix">
                  我的相册
                </div>
              </div>
            </el-link>
          </el-card>
          <el-dialog
            title="修改相册"
            :visible.sync="dialogPhotoVisible"
            style="text-align: left;"
            @row-click="gotoAlbum"
          >
            <el-table
              :data="albumList"
              style="width: 100%"
              max-height="500">
              <el-table-column
                fixed
                prop="time"
                label="创建时间"
                width="300">
              </el-table-column>
              <el-table-column
                prop="albumName"
                label="相册名称"
                width="200">
                <template slot-scope="scope">
                    {{scope.row.albumName}}
                </template>
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                width="300">
                <template slot-scope="scope">
                  <el-button
                    @click.native.prevent="getAlbumNameRow(scope.$index,albumList)"
                    @click.native="modAlbumNameVisible=true"
                    type="primary"
                    size="mini">
                    修改相册名
                  </el-button>
                  <el-button
                    @click.native.prevent="getAlbumPhoto(scope.$index,albumList)"
                    @click.native="dialogModPhotoVisible=true"
                    type="warning"
                    size="mini">
                    编辑
                  </el-button>
                  <el-button
                    @click.native.prevent="deletePhotoRow(scope.$index,albumList)"
                    type="danger"
                    size="mini">
                    移除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <!--          修改项目对话框      -->
          </el-dialog>
          <el-dialog title="修改相册" :visible.sync="dialogModPhotoVisible" style="text-align: left">
            <div class="photo-box" style="font-size: 17px">
              相册照片：
              <el-row :gutter="20"style="text-align: left;margin: auto">
                  <el-upload
                    action="http://192.168.31.106:8084/album/addPhoto"
                    list-type="picture-card"
                    :file-list="photoList"
                    :auto-upload="true"
                    :headers={id:this.getAlbumId}
                    :on-success="onSuccess"
                    >
                    <i slot="default" class="el-icon-plus"></i>
                    <div slot="file" slot-scope="{file}">
                      <img
                        class="el-upload-list__item-thumbnail"
                        :src="file.url"
                        alt=""
                      >
                      <span class="el-upload-list__item-actions">
                        <span
                          class="el-upload-list__item-preview"
                          @click="handlePictureCardPreview(file)"
                        >
                          <i class="el-icon-zoom-in"></i>
                        </span>
                        <span
                          v-if="!disabled"
                          class="el-upload-list__item-delete"
                          @click="handleRemove(file)"
                        >
                          <i class="el-icon-delete"></i>
                        </span>
                      </span>
                    </div>
                  </el-upload>
              </el-row>
            </div>
          </el-dialog>
          <el-dialog :visible.sync="dialogVisible" modal="true">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
          <el-dialog title="修改相册名" :visible.sync="modAlbumNameVisible" style="text-align: left;">
            <el-form class="message-box" label-width="100px" >
              <el-form-item label="相册名称：">
                <el-input v-model="modAlbumName"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="modAlbumNameVisible = false">取 消</el-button>
              <el-button type="primary" @click="modAlbumNameVisible = false;updateAlbumName()">提 交</el-button>
            </div>
          </el-dialog>
        </el-col>
      </el-row>
      <el-row :gutter="10" style="margin-top: 10px">
        <Dialog :paper="paper"></Dialog>
        <MyDialog :property="property"></MyDialog>
      </el-row>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import resetMessage from "../../utils/resetMessage";
import aes from '../../utils/asc';
import Dialog from "../../components/dialogTest/dialog"
import MyDialog from "../../components/dialogTest/MyDialog"

const token = sessionStorage.getItem('tokenStr');


export default {
  name: "adminfo",
  data() {
    return{
      modAlbumName:'',//修改相册所点击的那行的相册名
      modAlbumId:'',//修改相册所点击那行的id
      blogDirection:'arithmetic',//选择所获取博文的研究方向
      messageFrom:null,
      account:{},
      modProDialogVisible:false,
      modDialogVisible:false,
      dialogFormVisible: false,
      dialogComVisible:false,
      dialogProVisible:false,
      dialogPhotoVisible:false,
      dialogModPhotoVisible:false,
      modBlogVisible:false,
      modAlbumNameVisible:false,
      img:'',
      competitionForm:null,
      projectForm:null,
      modProjectForm:{},
      modCompetitionForm:{},
      getModProjectForm:{},
      getBlogForm:{},
      modifyForm:null,//修改表格的表
      MyHeader : {token: token},
      tableData: [],
      proTableData:[],
      albumList:[],
      blogList:[],
      photoList:{},
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      getAlbumId:'',
      selectId:'',
      paper:{
        title:'我的论文',
        time:'上传时间',
        year:'发表年份',
        name:'论文名称',
        team:'发表人',
        periodical:'发表期刊',
        icon:'icon-teamlunwenguanli',
        getAllUrl:'http://192.168.31.106:8084/paper/findPapersOfSomeone',
        deleteUrl:'http://192.168.31.106:8084/paper/deleteOnePaper',
        toUrl:'http://192.168.31.106:8084/paper/openPdf',
        getOneUrl:'http://192.168.31.106:8084/paper/setUpdateId',
        modUrl:'http://192.168.31.106:8084/paper/updatePaper'
      },
      property:{
        title:'我的产权',
        time:'上传时间',
        year:'发表年份',
        type:'产权类型',
        name:'知识产权名',
        team:'发表人',
        introduce:'产权简介',
        icon:'icon-teamzhishichanquan',
        getAllUrl:'http://192.168.31.106:8084/property/findPropertysOfSomeone',
        deleteUrl:'http://192.168.31.106:8084/property/deleteOneProperty',
        toUrl:'http://192.168.31.106:8084/paper/openPdf',
        getOneUrl:'http://192.168.31.106:8084/property/setUpdateId',
        modUrl:'http://192.168.31.106:8084/property/updateProperty'
      },
      rules: {
        realName: [
          { required: true, message: "请输入中文名", trigger: "blur" },
          {
            validator: function(rule, value, callback) {
              if (/^[\u4e00-\u9fa5]+$/.test(value) === false) {
                callback(new Error("请输入中文"));
              } else {
                //校验通过
                callback();
              }
            },
            trigger: "blur"
          }
        ],
      }


    }
  },
  components:{Dialog,MyDialog},
  mounted() {
    this.initAccount();
  },
  methods: {
    initAccount(){
      //获取用户个人信息
      axios({
        methods: 'GET',
        url:'http://192.168.31.106:8084/personalCenter/show',
        headers: {'Content-Type': 'application/json;charset=UTF-8'},
      }).then(result => {
        console.log(result);
        if(result) {
          this.account = result.data;
          this.modifyForm = JSON.parse(JSON.stringify(this.account));
          console.log(this.modifyForm);
        }
      })
    },

  handleSuccess(res, file) {
      //修改头像
      this.account.headPhotoUrl = URL.createObjectURL(file.raw);
      console.log(this.account.headPhotoUrl);
      window.location.reload();
    },//上传图片后获取图片url的函数

    modifyMessage(){
      //修改个人信息
      this.$refs.modifyForm.validate(valid => {
        if (valid) {
          let encryptionPassword = aes.encrypt(this.modifyForm.password);
          axios.post("http://192.168.31.106:8084/personalCenter/update",
            {
              realName: this.modifyForm.realName,
              password: encryptionPassword,
              phone: this.modifyForm.phone,
              enrollDate: this.modifyForm.enrollDate,
              qqAccount: this.modifyForm.qq,
              direction: this.modifyForm.direction,
              selfIntroduction: this.modifyForm.selfIntroduction
            }).then(response => {
            resetMessage({
              message: "已成功修改信息",
              type: 'success',
              duration: 5 * 1000,
            });
            this.dialogFormVisible = false;
            this.initAccount();
          })
        }
      })
    },
    getModifyCompetition() {
      //取得获奖信息
      axios({
        method:'GET',
        url: 'http://192.168.31.106:8084/competition/findCompetitionsOfSomeone',
      }).then(result => {
        if(result) {
          console.log(result.data);
          this.tableData = result.data;
        }
      })
    },
    deleteComRow(index, rows) {
      //删除一条获奖信息
      const params = new URLSearchParams();
      params.append('id', rows[index].id);
      console.log(rows[index].id);
      axios.post("http://192.168.31.106:8084/competition/deleteOneCompetition",params,
        {headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
        .then(result => {
        if(result) {
          resetMessage({
            message: result.data,
            type: 'success',
            duration: 5 * 1000,
          });
          rows.splice(index, 1);
        }
      })
    },
    addModComRowForm(index, rows) {
      //将获奖信息绑定到input框中
      const params = new URLSearchParams();
      params.append('id', rows[index].id);
      this.selectId = rows[index].id
      console.log(rows[index].id);
      axios.post("http://192.168.31.106:8084/competition/setUpdateId",params,
        {headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
      .then(result => {
        this.competitionForm = result.data;
        console.log(this.competitionForm)
        this.modCompetitionForm = JSON.parse(JSON.stringify(this.competitionForm));
        //el-date-picker能双向绑定的数据为String类型，如果后端传输的数据类型为number类型需要强转
        this.modCompetitionForm.year = this.modCompetitionForm.year.toString();
      })
    },
    uploadComModForm(){
      //上传修改获奖信息
      axios({
        method: 'POST',
        url:'http://192.168.31.106:8084/competition/updateCompetition',
        data:{
          id:this.selectId,
          competitionName:this.modCompetitionForm.competitionName,
          year:this.modCompetitionForm.year,
          team:this.modCompetitionForm.team,
          details:this.modCompetitionForm.details,
          feeling:this.modCompetitionForm.feeling,
          work:this.modCompetitionForm.work,
          award:this.modCompetitionForm.award,
          direction:this.modCompetitionForm.direction
        }
      }).then(result => {
        if(result) {
          resetMessage({
            message: result.data.msg,
            type: 'success',
            duration: 5 * 1000,
          });
          this.getModifyCompetition();
        }
      })
    },
    getModProject(){
      axios({
        method:'GET',
        url: 'http://192.168.31.106:8084/project/findSomeoneProject',
      }).then(result => {
        if(result) {
          console.log("pro",result.data);
          this.proTableData = result.data;
        }
      })
    },
    deleteProRow(index, rows) {
      //删除一条获奖信息
      const params = new URLSearchParams();
      params.append('id', rows[index].id);
      console.log(rows[index].id);
      axios.post("http://192.168.31.106:8084/project/deleteOneProject",params,
        {headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
        .then(result => {
          if(result) {
            resetMessage({
              message: result.data,
              type: 'success',
              duration: 5 * 1000,
            });
            rows.splice(index, 1);
          }
        })
    },
    addModProRowForm(index, rows) {
      //将获奖信息绑定到input框中
      const params = new URLSearchParams();
      params.append('id', rows[index].id);
      console.log(rows[index].id)
      this.selectId = rows[index].id
      axios.post("http://192.168.31.106:8084/project/setUpdateId",params,
        {headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
        .then(result => {
          this.projectForm = result.data;
          console.log(this.projectForm)
          this.modProjectForm = JSON.parse(JSON.stringify(this.projectForm));
          //el-date-picker能双向绑定的数据为String类型，如果后端传输的数据类型为number类型需要强转
          this.modProjectForm.year = this.modProjectForm.year.toString();
        })
    },
    uploadProModForm() {
      axios({
        method: 'POST',
        url:'http://192.168.31.106:8084/project/updateProject',
        data:{
          id:this.selectId,
          projectName:this.modProjectForm.projectName,
          year:this.modProjectForm.year,
          team:this.modProjectForm.team,
          details:this.modProjectForm.details,
          process:this.modProjectForm.process,
          equipment:this.modProjectForm.equipment,
          direction:this.modProjectForm.direction
        }
      }).then(result => {
        if(result) {
          resetMessage({
            message: result.data,
            type: 'success',
            duration: 5 * 1000,
          });
          this.getModProject();
        }
      })
    },
    getAlbum(){
      axios({
        method:'GET',
        url:'http://192.168.31.106:8084/album/findAlbumsOfSomeone'
      }).then(result => {
        if (result) {
          this.albumList = result.data;
          console.log("albumList",this.albumList)
        }

      })
    },
    deletePhotoRow(index, rows) {
      //删除所点击那一行的获奖信息
      const params = new URLSearchParams();
      params.append('albumId', rows[index].id);
      console.log(rows[index].id);
      axios.post("http://192.168.31.106:8084/album/deleteOneAlbum",params,
        {headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
        .then(result => {
          if(result) {
            resetMessage({
              message: result.data,
              type: 'success',
              duration: 5 * 1000,
            });
            rows.splice(index, 1);
          }
        })
    },
    getAlbumNameRow(index, rows){
      //获取所点击的那行相册的id和相册名
      this.modAlbumName = JSON.parse(JSON.stringify(rows[index].albumName));
      this.modAlbumId =rows[index].id;
      console.log("modAlbumId",this.modAlbumId)
    },
    updateAlbumName(){
      //修改相册名
      const params = new URLSearchParams();
      params.append('albumId', this.modAlbumId);
      params.append('albumName',this.modAlbumName);
      axios.post("http://192.168.31.106:8084/album/updateAlbumName",params,
        {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then(result => {
          if (result) {
            console.log(result);
            resetMessage({
              message: result.data,
              type: 'success',
              duration: 5 * 1000,
            });
            this.getAlbum();
          }
      })
    },
    getAlbumPhoto(index, rows){
      const params = new URLSearchParams();
      params.append('id', rows[index].id );
      this.getAlbumId = rows[index].id;
      axios.post("http://192.168.31.106:8084/album/setUpdateId",params,
        {headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
      .then(result => {
        if(result) {
          this.photoList = result.data.photos;
          console.log(this.photoList)
        }
      })
    },
    handleRemove(file) {
      console.log(file);
      const params = new URLSearchParams();
      params.append('photoId', file.id );
      axios.post("http://192.168.31.106:8084/album/deleteOnePhoto",params,
        {headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
      .then(result => {
        if(result){
          console.log(result);
          resetMessage({
            message: result.data,
            type: 'success',
            duration: 5 * 1000,
          });
         this.getPhotoList();
        }
      })
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleDownload(file) {
      console.log(file);
    },
    onSuccess(response, file, fileList) {
      console.log(response,file,fileList);
      resetMessage({
        message: "修改成功",
        type: 'success',
        duration: 5 * 1000,
      });
      this.getPhotoList();
    },
    getPhotoList(){
      const param = new URLSearchParams();
      param.append('id', this.getAlbumId);
      axios.post("http://192.168.31.106:8084/album/setUpdateId",param,
        {headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
        .then(result => {
          if(result) {
            this.photoList = result.data.photos;
          }
        })
    },
    getDirectionBlog(){
      const param = new URLSearchParams();
      param.append('direction', this.blogDirection);
      axios.post("http://192.168.31.106:8084/findInfosOfSomeone",param,
        {headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
      .then(result => {
        if (result) {
          console.log(result)
          this.blogList = result.data;
        }
      })
    },
    isShowSelectOptions(isShowSelectOptions){
      //让el-select在回车时不进行弹出
      if(!isShowSelectOptions) this.$refs.selectDirection.blur();
    },
    deleteBlog(index, rows){
      //删除所点击那一行的获奖信息
      const params = new URLSearchParams();
      params.append('id', rows[index].id);
      params.append('direction',this.blogDirection);
      console.log(rows[index].id);
      axios.post("http://192.168.31.106:8084/deleteInfo",params,
        {headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
        .then(result => {
          if(result) {
            resetMessage({
              message: result.data,
              type: 'success',
              duration: 5 * 1000,
            });
            rows.splice(index, 1);
          }
        })
    },
    modBlog(index, rows){
      //编辑博文
      this.$router.push({path:"/members/modEditBlog",query:{id:rows[index].id,direction:this.blogDirection}})
    },
    gotoBlog(index,rows) {
      //从个人中心查看博文
      const ids = window.btoa(rows[index].id);
      const directions = window.btoa(this.blogDirection)
      this.$router.push({path:"/members/show_blog",query:{id:ids,direction:directions}})
    },
    gotoProject(row) {
      this.$router.push({path:"/members/show_project",query:{id:row.id}})
    },
    gotoCompetition(row) {
      this.$router.push({path:"/members/show_competition",query:{id:row.id}})
    },
    gotoAlbum(row) {
      this.$router.push({path:"/members/show_photo",query:{id:row.id}})
    },
  },
}
</script>

<style scoped>
.el-form-item{
  margin-bottom: 20px;
}
.login-box {
  width: 600px;
  margin: auto;
  padding: 40px;
}
.message-box {
  width: 60%;
  /*margin: auto;*/
  margin-bottom: 10px;
}
</style>
