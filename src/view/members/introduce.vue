<template>
  <div v-html="context" style="text-align: left;font-size: 20px">
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "introduce",
  data() {
    return{
      context:null
    }
  },
  mounted() {
    this.getIntroduce();
  },
  methods: {
    getIntroduce(){
      axios({
        methods: 'GET',
        url:'http://192.168.31.106:8084/findLabIntroduce'
      }).then(result => {
        if (result) {
          console.log(result);
          this.context = result.data.LabIntroduce;
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
