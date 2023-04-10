import Vue from "vue";
import Router from 'vue-router'
import route from "../router";
import Login from "../view/Login";
import Main from "../view/Main";
import Register from "../view/Register";
import Welcome from "../view/Welcome";
import edit_blog from "../view/members/edit_blog";
import blog from "../view/members/blog";
import axios from "axios";
import adminfo from "../view/members/adminfo";
import show_blog from "../view/members/show_blog"
import competition from "../view/members/competition"
import show_competition from "../view/members/show_competition"
import project from "../view/members/project"
import show_project from "../view/members/show_project"
import show_photo from "../view/members/show_photo"
import photo from "../view/members/photo"
import uploadPhoto from "../view/members/uploadPhoto"
import introduce from "../view/members/introduce"
import modEditBlog from "../view/members/modEditBlog"
import manager from "../view/members/manager"
import supermanager from "../view/members/supermanager"
import essay from "../view/members/essay"
import property from "../view/members/property"
import resetMessage from '../utils/resetMessage';
import newDemo from "../view/newDemo"

Vue.use(Router)



const routes = [
  {
    path:'/Welcome',
    name:'Welcome',
    component:Welcome
  },
  {
    path:'/dialogMain',
    name:'dialogMain',
    component: ()=>import("../components/dialogTest/dialogMain")
  },
  {
    path:'/Login',
    name:'login',
    meta: { title: '系统登录' }, //路由加上meta属性
    component:Login,
  },
  {
    path:'/Register',
    name:'Register',
    component:Register
  },
  {
    path: '/newDemo',
    name:'小样',
    component: newDemo
  },
  {
    path:'/Main',
    name:'Main',
    component:Main,
    children:[
      {
        path: '/members/introduce',
        name:'实验室介绍',
        meta: { title: '实验室介绍' },
        component: introduce
      },
      {
        path:'/members/edit_blog',
        name:'Edit_blog',
        meta: { title: '编辑博文' },
        component:edit_blog
      },
      {
        path:'/members/blog',
        name:'Blog',
        meta: { title: '资源存储' },
        component:blog
      },
      {
        path:'/members/adminfo',
        name:'用户中心（新）',
        meta: { title: '个人中心' },
        component:adminfo
      },
      {
        path: '/members/show_blog',
        name: '展示博文',
        meta: { title: '博文展示' },
        component: show_blog
      },
      {
        path: '/members/competition',
        name: '获奖项目',
        meta: { title: '获奖项目' },
        component: competition
      },
      {
        path: '/members/show_competition',
        name: '获奖展示',
        meta: { title: '获奖展示' },
        component: show_competition
      },
      {
        path: '/members/project',
        name: '科研项目',
        meta: { title: '科研项目' },
        component: project
      },
      {
        path: '/members/show_project',
        name: '项目展示',
        meta: { title: '项目展示' },
        component: show_project
      },
      {
        path: '/members/show_photo',
        name: '相册展示',
        meta: { title: '相册展示' },
        component: show_photo
      },
      {
        path: '/members/photo',
        name:'相册',
        meta: { title: '相册' },
        component: photo
      },
      {
        path: '/members/uploadPhoto',
        name:'上传照片',
        meta: { title: '照片上传' },
        component: uploadPhoto
      },
      {
        path: '/members/modEditBlog',
        name:'修改博客',
        meta: { title: '博客修改' },
        component: modEditBlog
      },
      {
        path: '/members/manager',
        name:'管理员页面',
        meta: { title: '管理员' },
        component: manager
      },
      {
        path: '/members/supermanager',
        name:'超级管理员页面',
        meta: { title: '超级管理员' },
        component: supermanager
      },
      {
        path: '/members/essay',
        name:'科研论文',
        meta: {title: '科研论文'},
        component: essay
      },
      {
        path: '/members/property',
        name:'知识产权',
        meta: {title: '知识产权'},
        component: property
      },
      {
        path: '/members/show_property',
        name:'产权展示',
        meta: {title: '产权展示'},
        component: () => import("../view/members/show_property")
      }

    ]
  },




];
//


const router = new Router({
  routes
})


//请求拦截器
axios.interceptors.request.use(config=>{
  if (window.sessionStorage.getItem('tokenStr')) {
//请求携带自定义token
    config.headers['token'] =
      window.sessionStorage.getItem('tokenStr');
  }
  return config
},error => {
  console.log(error);
})


//响应拦截器
axios.interceptors.response.use(
  success =>{
    if(success.status == 200 && success.data.state == 600){
      // Message.success({message: success.data.msg});
      resetMessage({
        message: '成功登录',
        type: 'success',
        duration: 5 * 1000,
      });
    }
    if (success.data.state == 702) {
      //Message.error({message: '未登录，请重新登录'});
      resetMessage({
        message: success.data.msg,
        type: 'error',
        duration: 5 * 1000,
      });
      route.push('/login');
    }
    if (success.data.state == 703) {
      resetMessage({
        message: success.data.msg,
        type: 'error',
        duration: 5 * 1000,
      });
      //
      route.push('/login')
    }
    if (success.data.state == 704) {
      resetMessage({
        message: success.data.msg,
        type: 'warning',
        duration: 5 * 1000,
      });
      route.push('/members/introduce');
    }
    if (success.data.state == 705){
      resetMessage({
        message: success.data.msg,
        type: 'warning',
        duration: 5 * 1000,
      });
      route.push('/members/manager');
    }
    return success;
  }

  );

//全局前置守卫
// router.beforeEach((to, from, next) => {
//   if (window.sessionStorage.getItem('tokenStr')) {
//     next();
//   }else if(to.path == '/login') {
//     next();
//   }
//   console.log(to)
// })




export default router;
