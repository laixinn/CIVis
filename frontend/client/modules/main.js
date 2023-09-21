import Vue from "vue";
import VueRouter from "vue-router";
import routes from "./routers";
import * as d3 from "d3";
import "assets/css/main.less";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import locale from "element-ui/lib/locale/lang/en";
import axios from 'axios'

import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

import { legendColor } from 'd3-svg-legend';
//d3-sankey
import {sankey, sankeyLinkHorizontal,sankeyCenter} from 'd3-sankey';
// var d3lasso = require('d3-lasso');
//moment.js
var moment = require('moment');
//element-ui
window.d3 = Object.assign(d3,
  {
     sankey: sankey,
     sankeyLinkHorizontal:sankeyLinkHorizontal,
     sankeyCenter: sankeyCenter
    });

window.moment = moment;

// import VueAMap  from 'vue-amap';
// Vue.use(VueAMap);
// VueAMap.initAMapApiLoader({
//   key: '6c2ec811bda32a986596c2d0c6b91be5',
//   plugin: ['DistrictSearch'],
//   v: '1.4.4'
// });


import * as echarts from 'echarts';
//注册组件


Vue.use(VueRouter);
Vue.use(ElementUI, { locale });
Vue.use(Antd);

Vue.prototype.openLoading = function(class_name) {
    const loading = this.$loading({           // 声明一个loading对象
      lock: true,                             // 是否锁屏
      text: 'Loading...',                     // 加载动画的文字
      spinner: 'el-icon-loading',             // 引入的loading图标
      background: 'rgba(0, 0, 0, 0.3)',       // 背景颜色
      target: class_name,//'.sub-main',                    // 需要遮罩的区域
      body: true,                              
      customClass: 'mask'                     // 遮罩层新增类名
    })
    setTimeout(function () {                  // 设定定时器，超时5S后自动关闭遮罩层，避免请求失败时，遮罩层一直存在的问题
      loading.close();                        // 关闭遮罩层
    },5000)
    return loading;
  }


window.d3 = d3;
Vue.prototype.$echarts = echarts;
Vue.prototype.$http = window.$http;
Vue.prototype.$bus = new Vue();
const router = new VueRouter({
    mode: "history",
    routes: routes.routes
});

new Vue({
    router,
    data: {
        Bus: new Vue()
    }
}).$mount(`#app-wrapper`);
