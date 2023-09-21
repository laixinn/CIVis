/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import HttpHelper from "common/utils/axios_helper.js";
import viewA from "../viewA/index.vue"
import viewB from "../viewB/index.vue"
import viewC from "../viewC/index.vue"
import viewD from "../viewD/index.vue"
export default {
  components: { // 依赖组件
     viewA,
     viewB,
     viewC,
     viewD
  },
  data() { // 本页面数据
      return {
          id: "5d42ac3d9c149c38248c8199",
      };
  },
  mounted() {

  },
  methods: { // 这里写本页面自定义方法

  },
  created() { // 生命周期中，组件被创建后调用

  },
};
