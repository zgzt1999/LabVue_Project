<template>
  <div id="app">
    <router-view />
  </div>
</template>



<script>


export default {
  name: 'App',




}
</script>


<style>

  /* 解决内部滚动条 */
  .el-main {
    overflow:visible;

  }
  .el-upload-list__item {
    transition: none !important;
  }
</style>
