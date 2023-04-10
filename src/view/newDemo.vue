<template>
  <el-card class="outer">
    <el-card class="inner"></el-card>
  </el-card>
</template>

<script>
export default {
  name: "newDemo"
}
</script>

<style scoped>
  .outer {
    width: 80%;
    height: 300px;
    margin:  0 auto;
    position: relative;
  }
  .inner {
    width: 97%;
    height: 100px;
    position: absolute;

  }
  .inner:hover {
    transform: scale(1.05, 0.9);
  }


</style>
