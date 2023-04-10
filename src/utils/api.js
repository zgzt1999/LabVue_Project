import axios from 'axios'
import Vue from 'vue'


axios.defaults.baseURL = '/'
Vue.prototype.axios = axios

// 请求拦截器(在之后的请求中携带token)
axios.interceptors.request.use(config=>{
  if (window.sessionStorage.getItem('tokenStr')) {
//请求携带自定义token
    config.headers['Authorization'] =
      window.sessionStorage.getItem('tokenStr');
  }
  return config
},error => {
  console.log(error);
})


//相应拦截器
axios.interceptors.response.use(successsuccess => {
  //业务逻辑错误
  if (success.status && success.status == 200) {
    if (success.data.state == true) {
      Message.error({message: success.data.msg});
      return;
    }
    if (success.data.message) {
      Message.success({message: success.data.msg});
    }
  }
  return success.data;
}, error => {
  if (error.response.state == false) {
    Message.error({message: '尚未登录，请登录'});
    router.replace('/');
  }
  return;
});

