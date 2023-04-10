// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueRouter from "vue-router";
import router from "./router";
import axios from 'axios'
import VueAxios from 'vue-axios'
import resetMessage from './utils/resetMessage';
import Vuex from 'vuex'
import './assets/logo/iconfont.css';
import './assets/logo/iconfont.js';
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
import './assets/paperLogo/iconfont.css'



Vue.use(VueAxios, axios)
Vue.use(VueRouter);
Vue.use(ElementUI);
Vue.use(Vuex);
Vue.use(Viewer)
Viewer.setDefaults({
  Options: {
    'inline': true, // 启用 inline 模式
    'button': true, // 显示右上角关闭按钮
    'navbar': true, // 显示缩略图导航
    'title': true, // 显示当前图片的标题
    'toolbar': true, // 显示工具栏
    'tooltip': true, // 显示缩放百分比
    'movable': true, // 图片是否可移动
    'zoomable': true, // 图片是否可缩放
    'rotatable': true, // 图片是否可旋转
    'scalable': true, // 图片是否可翻转
    'transition': true, // 使用 CSS3 过度
    'fullscreen': true, // 播放时是否全屏
    'keyboard': true, // 是否支持键盘
    'url': 'data-source' // 设置大图片的 url
  }
})


ElementUI.Dialog.props.lockScroll.default = false; // 打开弹窗防止页面抖动


Vue.prototype.$message = resetMessage
Vue.config.productionTip = false

axios.defaults.withCredentials = true;//允许跨域携带cookie信息


router.beforeEach((to,from,next)=>{//beforeEach是router的钩子函数，在进入路由前执行
  if(to.meta.title){//判断是否有标题
    document.title = to.meta.title
  }
  next()  //执行进入路由，如果不写就不会进入目标页
})



/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
});
