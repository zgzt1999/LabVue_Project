<template>
  <div>
    <el-col :span="6">
      <el-card  :body-style="{ padding: '40px' }" shadow="hover" @click.native="dialogComVisible=true;getAllProperty()">
        <el-link :underline="false">
          <i class="iconfont" :class="property.icon" style="font-size: 40px"></i>
          <div style="padding-top: 24px;">
            <div class="bottom clearfix">
              {{ property.title }}
            </div>
          </div>
        </el-link>
      </el-card>
      <el-dialog
        :title="property.title"
        :visible.sync="dialogComVisible"
        style="text-align: left;"
      >
        <el-table
          :data="tableData"
          style="width: 100%"
          max-height="500"
          @row-click="toProperty">
          <el-table-column
            fixed
            prop="time"
            :label="property.time"
            width="250">
          </el-table-column>
          <el-table-column
            prop="year"
            :label="property.year"
            width="140">
          </el-table-column>
          <el-table-column
            prop="propertyName"
            :label="property.name"
            width="240">
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="160">
            <template slot-scope="scope">
              <el-button
                @click.stop="modDialogVisible=true;addModRowForm(scope.$index,tableData)"
                type="warning"
                size="mini">
                编辑
              </el-button>
              <el-button
                @click.stop="deleteProperty(scope.$index,tableData)"
                type="danger"
                size="mini">
                移除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
      <el-dialog title="修改信息" :visible.sync="modDialogVisible" style="text-align: left;">
        <el-form class="message-box" label-width="100px" :model="modForm">
          <el-form-item :label="this.property.name">
            <el-input v-model="modForm.propertyName"></el-input>
          </el-form-item>
          <el-form-item :label="this.property.type">
            <el-input v-model="modForm.type"></el-input>
          </el-form-item>
          <el-form-item :label="this.property.year">
            <el-date-picker
              v-model="modForm.year"
              placeholder="选择年份"
              type="year"
              style="width: 100%;"
              value-format="yyyy"
              :picker-options="pickerOptions0">
              >
            </el-date-picker>
          </el-form-item>
          <el-form-item :label="this.property.team">
            <el-input v-model="modForm.team"></el-input>
          </el-form-item>
          <el-form-item :label="this.property.introduce">
            <el-input type="textarea" :rows="3" v-model="modForm.introduce"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="modDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="uploadModForm">提 交</el-button>
        </div>
      </el-dialog>
    </el-col>
  </div>

</template>

<script>
import axios from "axios";
import resetMessage from "../../utils/resetMessage";

export default {
  name: "MyDialog",
  data(){
    return{
      tableData: [],
      dialogComVisible:false,
      modDialogVisible:false,
      modForm:{},
      selectId:'',
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
    }
  },
  props:{
    property:Object
  },
  methods: {
    getAllProperty() {
      axios({
        method: 'GET',
        url: this.property.getAllUrl
      }).then(result => {
        this.tableData = result.data;
      })
    },
    deleteProperty(index, rows) {
      const params = new URLSearchParams();
      params.append('id', rows[index].id);
      console.log(rows[index].id);
      axios.post(this.property.deleteUrl, params,
        {headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
        .then(result => {
          if (result) {
            resetMessage({
              message: result.data,
              type: 'success',
              duration: 5 * 1000,
            });
            rows.splice(index, 1);
          }
        })
    },
    toProperty(item) {
      this.$router.push({path:"/members/show_property",query:{id:item.id}});
    },
    addModRowForm(index, rows) {
      //将获奖信息绑定到input框中
      const params = new URLSearchParams();
      params.append('id', rows[index].id);
      console.log(rows[index].id);
      this.selectId = rows[index].id
      axios.post(this.property.getOneUrl, params,
        {headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
        .then(result => {
          this.modForm = JSON.parse(JSON.stringify(result.data));
          //el-date-picker能双向绑定的数据为String类型，如果后端传输的数据类型为number类型需要强转
          this.modProjectForm.year = this.modProjectForm.year.toString();
        })
    },
    uploadModForm() {
      axios({
        method: 'POST',
        url: this.property.modUrl,
        data: {
          id:this.selectId,
          propertyName: this.modForm.propertyName,
          year: this.modForm.year,
          team: this.modForm.team,
          type: this.modForm.type,
          introduce:this.modForm.introduce,
        }
      }).then(result => {
        if (result) {
          resetMessage({
            message: result.data.msg,
            type: 'success',
            duration: 5 * 1000,
          });
          this.getAllProperty();
          this.modDialogVisible = false;
        }
      })
    }
  }

}
</script>

<style scoped>
.message-box {
  width: 80%;
  margin: auto;
  padding: 40px;
}
</style>
