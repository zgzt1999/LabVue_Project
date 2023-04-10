<template>
  <div>
    <div style="margin-bottom: 30px">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/members/introduce' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>资源编辑</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div style="height: 1px; margin: 10px 0; background-color: white"></div>
    <el-form style="text-align: left" ref="form" :rules="rules" :model="form">
      <el-form-item label="资源标题" label-width="100px" prop="title">
        <el-input style="width: 40%" v-model="form.infoName"></el-input>
      </el-form-item>
      <el-form-item label="资源摘要" label-width="100px">
        <el-input type="textarea" maxlength="200" show-word-limit style="width: 40%" :autosize="{ minRows:7 }" v-model="form.infoSummary"></el-input>
      </el-form-item>
      <el-form-item label="博客内容" label-width="100px">
        <div style="border: 1px solid #ccc;width: 60%">
          <Toolbar
            style="border-bottom: 1px solid #ccc"
            :editor="editor"
            :defaultConfig="toolbarConfig"
            :mode="mode"
          />
          <Editor
            style="height: 400px; overflow-y: hidden;"
            :defaultConfig="editorConfig"
            :mode="mode"
            @onCreated="onCreated"
            @onChange="onChange"
            v-model="form.infoBody"
          />
        </div>
      </el-form-item>
    </el-form>
    <div style="text-align: left;font-size: 20px;margin-left: 30px">
      <strong>{{form.file}}已上传无需修改</strong>
    </div>
    <div style="padding: 10px;text-align: left">
      <el-button type="primary" @click="save" :disabled="now">保 存</el-button>
      <el-button @click="returnPage">取 消</el-button>
    </div>
  </div>
</template>


<script>
import axios from "axios";
import "@wangeditor/editor/dist/css/style.css"
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import resetMessage from "../../utils/resetMessage";

let imageList1 = new Array();


export default {
  name: "modEditBlog",
  beforeDestroy() {
    // this.cancelTokenSource.cancel('cancel request before enter next page');
    const editor = this.editor
    if (editor == null) return
    editor.destroy() // 组件销毁时，及时销毁编辑器
  },

  components: { Editor, Toolbar },
  // components:{Editor},
  data() {
    // 自定义校验链接
    const customCheckLinkFn = (text, url) => {
      if (!url) {
        this.$message.warning("链接不能为空");
        return
      }
      if (url.indexOf('http') !== 0) {
        this.$message.warning("链接必须以 http/https 开头");
        return;
      }
      return true

      // 返回值有三种选择：
      // 1. 返回 true ，说明检查通过，编辑器将正常插入链接
      // 2. 返回一个字符串，说明检查未通过，编辑器会阻止插入。会 alert 出错误信息（即返回的字符串）
      // 3. 返回 undefined（即没有任何返回），说明检查未通过，编辑器会阻止插入。但不会提示任何信息
    }

    // 自定义转换链接 url
    const customParseLinkUrl = (url) => {
      if (url.indexOf('http') !== 0) {
        //console.log(`http://${url}`)
        return `http://${url}`
      }
      return url
    }


    // 自定义校验图片
    const customCheckImageFn = (url) => {
      if(url.indexOf('http') !== 0) {
        this.$message.warning("图片链接必须以 http/https 开头");
        return '图片链接必须以 http/https 开头'
      }
      return true

      // 返回值有三种选择：
      // 1. 返回 true ，说明检查通过，编辑器将正常插入图片
      // 2. 返回一个字符串，说明检查未通过，编辑器会阻止插入。会 alert 出错误信息（即返回的字符串）
      // 3. 返回 undefined（即没有任何返回），说明检查未通过，编辑器会阻止插入。但不会提示任何信息
    }

    // 转换图片链接
    const customParseImageSrc = (src) => {
      if (src.indexOf('http') !== 0) {
        return `http://${src}`
      }
      return src
    }

    //限制标题不能输入为空
    var validateTitle = (rule,value,callback) => {
      if(value === ''){
        callback(new Error('资源标题不能为空'));
      }else {
        callback();
      }
    }

    return {
      entity: {},
      fileList: [],
      form:{
        title:'',
        description:'',
        myTextarea:'',
      },
      visible:true,
      now:false,
      cancelTokenSource: axios.CancelToken.source(),
      detail:"",
      editor: null,
      toolbarConfig: {
        excludeKeys: [
          'group-video'
        ]
      },
      editorConfig: {
        placeholder: '请输入内容...',
        MENU_CONF: {
          // 插入链接的校验
          insertLink: {
            checkLink: customCheckLinkFn, // 也支持 async 函数
            parseLinkUrl: customParseLinkUrl // 也支持 async 函数
          },

          // 修改链接的校验
          editLink: {
            checkLink: customCheckLinkFn, // 也支持 async 函数
            parseLinkUrl: customParseLinkUrl, // 也支持 async 函数
          },

          // 插入网络图片的校验
          insertImage: {
            //  插入图片之后的回调

            onInsertedImage(imageNode) {
              if (imageNode == null) return
              imageList1.push(imageNode);
              console.log('imageList1',imageList1)

            },

            // 校验图片链接
            checkImage: customCheckImageFn, // 也支持 async 函数

            // 转换图片链接
            parseImageSrc: customParseImageSrc, // 也支持 async 函数
          },

          // 编辑网络图片的校验
          editImage: {
            // 更新图片之后的回调
            onUpdatedImage(imageNode = null) {
              if (imageNode == null) return
              const { src } = imageNode
              console.log('updated image', src)
            },

            // 校验图片链接
            checkImage: customCheckImageFn, // 也支持 async 函数

            // 转换图片链接
            parseImageSrc: customParseImageSrc, // 也支持 async 函数
          },

          // 图片的上传
          uploadImage: {
            server: 'http://192.168.31.106:8084/blog/addPhoto',//上传接口
            maxFileSize: 10 * 1024 * 1024,//最大上传图片
            base64LimitSize: 5 * 1024,//5kb以下插入base 64
            // 自定义增加 http  header
            headers: {
              token:window.sessionStorage.getItem('tokenStr')
            },
            // 上传之前触发
            onBeforeUpload(file) {
              // file 选中的文件，格式如 { key: file }
              console.log('onBeforeUpload', file)
              return file

              // 可以 return
              // 1. return file 或者 new 一个 file ，接下来将上传
              // 2. return false ，不上传这个 file
            },
            // 上传进度的回调函数
            onProgress(progress) {
              // progress 是 0-100 的数字
              console.log('progress', progress)
            },
            // 单个文件上传成功之后
            onSuccess(file, res) {
              console.log(`${file.name} 上传成功`, res)
            },
            // 单个文件上传失败
            onFailed(file, res) {
              console.log(`${file.name} 上传失败`, res)
            },
            // 上传错误，或者触发 timeout 超时
            onError(file, err, res) {
              console.log(`${file.name} 上传出错`, err, res)
            },
          },
        }
      },
      mode: 'default', // or 'simple'
      rules:{
        title: [
          { validator: validateTitle, trigger: 'blur' },
        ],
      },
    }

  },

  mounted() {
    this.getTheBlog();
  },
  computed:{
    id() {
      return this.$route.query.id
    },
    direction() {
      return this.$route.query.direction
    }
  },

  methods: {
    handleImgList(){
      this.imageList2 = this.editor.getElemsByType('image');
      console.log('imageList2',this.imageList2)//最终结果上传的图片
      console.log('imageList1',imageList1)//总共输入过的图片
      var list = new Array();
      console.log(this.imageList2.length)
      console.log(imageList1.length)
      if(this.imageList2.length !== imageList1.length){
        Object.keys(imageList1).map(key =>{
          if(!this.imageList2[key]){
            console.log("imageList1[key]",imageList1[key]);
            var a = imageList1[key]['src'].split('http://192.168.31.106:8084/image/blogImage/')[1];
            list.push(a);
          }
        })
      }
      if (list.length != 0){
        axios({
          method: 'POST',
          url:'http://192.168.31.106:8084/blog/deletePhotoTwo',
          data:{
            photoName:list
          },
          headers:{'Content-Type':'application/json'}
        }).then(result => {
          console.log(result);
        })
      }

    },
    save(){
      this.$refs.form.validate(valid =>{
        if (valid){
          this.handleImgList();
          axios({
            method:'POST',
            url:'http://192.168.31.106:8084/updateInfo',
            data: {
              infoName:this.form.infoName,
              infoSummary:this.form.infoSummary,
              direction:this.direction,
              infoBody:this.form.infoBody,
              id:this.id,
            },
            // headers: {'Content-Type': 'text/html;charset=UTF-8'},
          }).then(function (response){
            if (response) {
              console.log(response)
              resetMessage({
                message: response.data,
                type: 'success',
                duration: 5 * 1000,
              });
              window.history.go(-"1");
            }
          })
        }else {
          console.log("error submit!");
          return false;
        }
      })
    },
    returnPage() {
      if (window.history.length <= 1) {
        this.$router.push({ path: "/members/introduce" });
        return false;
        console.log(this.now)

      } else {
        this.$router.go(-1);
        console.log(this.now)
      }
      // axios.post('http://192.168.31.106:8084/information/uploadCancel')

    },
    uploadFile() {
      this.visible = true;
    },
    onClose() {
      this.visible = false;
    },
    onCreated(editor) {
      this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
    },
    onChange(val) {
      console.log(val.getHtml())

    },
    getTheBlog() {
      const params = new URLSearchParams();
      params.append('id',this.id);
      params.append('direction',this.direction);
      axios.post("http://192.168.31.106:8084/setInfoUpdateId",params,
        {headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
        .then(result => {
          if (result) {
            this.form = result.data;
            console.log(this.form)
          }
        })
    }
  }
}
</script>
<style scoped>

</style>

