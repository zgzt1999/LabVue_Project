<template>
  <div>
    <Dialog :paper = paper></Dialog>
    
  </div>
</template>

<script>

import Dialog from "./dialog"
export default {
  name: "dialogTest",
  components:{Dialog},

  data(){
    return{
      paper:{
            title:'我的论文',
            time:'上传时间',
            year:'发表年份',
            name:'论文名',
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
        name:'论文名',
        icon:'icon-teamlunwenguanli',
        getAllUrl:'http://192.168.31.106:8084/paper/findPapersOfSomeone',
        deleteUrl:'http://192.168.31.106:8084/paper/deleteOnePaper',
        toUrl:'http://192.168.31.106:8084/paper/openPdf',
        getOneUrl:'http://192.168.31.106:8084/paper/setUpdateId',
        modUrl:'http://192.168.31.106:8084/paper/updatePaper'
      }
    }
  }

}
</script>

<style scoped>

</style>
