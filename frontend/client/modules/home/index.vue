<template>
  <!-- 这里写Html -->
  <div class="wrapper" style="position: relative; width: 2530px; height: 1320px;margin:3px">
    <h1 style="margin:10px 0px 0px 0px; padding-left: 5px;height:50px;background-color:rgb(255 255 255);color:#AAAAAA;font-size: 38px;">CIVis</h1>
    <!-- <el-button size="mini" style="margin: 0px 0px 0px 0px;" @click="test()">test1</el-button> -->
    <viewA />
    <viewB />
    <viewC />
    <viewD />


  </div>
</template>
<script src="./script.js"></script>

<style>

@font-face {
  font-family: "noto-bold";
  src: url("../../font/NotoSans-Bold.ttf");
  font-weight: normal;
  font-style: normal;
}

/*
h1 {
  font-family: noto-bold;
  font-size: 32px;
  color: white;
  text-align: left;

} */
.lasso path {
    stroke: rgb(233, 20, 20);
    stroke-width:2px;
}

.lasso .drawn {
    fill: none;
    fill-opacity:.5 ;
}

.lasso .loop_close {
    fill: none;
    stroke-dasharray: 4, 4;
}

.lasso .origin {
    fill:#3399FF;
    fill-opacity:.5;
}

.not_possible {
    fill:rgb(200,200,200);
}

.possible {
    fill:#EC888C;
}

.selected {
  fill: steelblue;
}
/* .el-cascader-menu {
  height: 300px;
} */
.el-timeline {
    padding-left: 10px;
    padding-right: 15px;
}
.el-table__body-wrapper::-webkit-scrollbar{
    /*width: 0;宽度为0隐藏*/
  width: 0px;
}
.el-table__body-wrapper::-webkit-scrollbar-thumb{
  border-radius: 2px;
  height: 50px;
  background: #eee;
}
.el-table__body-wrapper::-webkit-scrollbar-track{
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 2px;
  background: rgba(0,0,0,0.4);
}
/* .el-table--scrollable-y .el-table__body-wrapper {
    overflow-y: hidden;
}
.el-table--scrollable-y .el-table__body-wrapper:hover {
    overflow-y: auto;
} */

</style>
