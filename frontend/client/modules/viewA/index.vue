<template >
  <!-- 这里写Html -->
  <div class="viewA">
    <div style="width:50%;display: inline-block;">
    <h2 style="margin:5px 0px 0px 0px; padding: 5px">Overview</h2>
    </div>
    <div id="select_panel">
      <div id="load data" style="font-size: 15px;color: #aaaaaa;margin:20px 0px 0px 0px;">
      Dataset
      <el-cascader
        ref="cascaderAddr"
        style="left:22px"
        size="mid"
        placeholder="Please select dataset"
        :options="options1"
        v-model="DATA"
      >
      </el-cascader>
      <el-button round  icon="el-icon-upload2" size="mini" style="margin-left:86px;display:inline-block;" @click="get_feature()" >set Dataset</el-button>
      </div>



      <div id="select model" style="font-size: 15px;color: #aaaaaa;margin:5px 0px 0px 0px;">
      Model
      <el-cascader
        style="left:33px"
        size="mid"
        placeholder="Please select model"
        :options="options2"
        v-model="MODEL"
      >
      </el-cascader>
      <el-button round  icon="el-icon-upload2" size="mini" style="margin-left:86px;display:inline-block;" @click="choose()" v-loading="loading1">select Feature</el-button>
      </div>


      <div id="data missing info" style="margin-top:15px">


      <div>
      <!-- <h3 style="margin:5px 0px 0px 0px; padding: 5px ;display:inline-block;" >Data Info</h3> -->
      <!-- <div id="testdata"></div> -->
      <!-- <div id="barChartsD3"></div> -->
      <!-- <el-button round  icon="el-icon-upload2" size="mini" style="margin-left:20px;display:inline-block;" @click="choose()" v-loading="loading1">select Feature</el-button> -->
      <el-table
        ref="feature_table"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 97% "
        height="550"
        :default-sort = "{prop: 'percentage', order: 'descending'}"
        >
        <el-table-column
        type="selection"
        width="45">
      </el-table-column>
        <el-table-column prop="feature" label="Feature"  width="170">
        </el-table-column>
        <el-table-column prop="percentage" label="Percentage" sortable :sort-orders="['ascending', 'descending']">
          <template slot-scope="scope">
            <el-progress
              type="line"
              :percentage="scope.row.percentage"
              :color="customColor"
              :show-text="false"
              class="progress"
            >
            </el-progress>
            <span class="progress" :style="{color: customColor(scope.row.percentage)}">{{ scope.row.percentage}}%</span>
          </template>
        </el-table-column>
      </el-table>
      </div>
      <div id="logs" style="margin-top:15px">
      <div style="display:inline-block;">
        <h3 style="margin:5px 0px 0px 0px; padding: 5px">Logs</h3>
      </div>
      <el-button round size= "mini" icon="el-icon-plus" style="margin-left:161px;" @click="add_one()">add</el-button>
      <el-button round size= "mini" icon="el-icon-check" style="margin-left:10px;" @click="switch_model()">switch</el-button>
      <el-button round size= "mini" icon="el-icon-delete" style="margin-left:10px;" @click="delete_one()">delete</el-button>
      <div class="block" style="width:500px">
        <el-timeline>
          <el-timeline-item
              v-for="(activity, index) in activities"
              :key="index"
              :timestamp="activity.timestamp"
              placement="top"
              :color="activity.color"
              @click.native="handleChangeVideo(activity)"
              >
            <!-- <el-button  size = "mini" >操作按钮</el-button> -->
            <el-card >
              <span style="margin:0px 0px 0px 0px;display: inline-block; font-family: noto-black;color: #aaaaaa;"> Learning rate: </span>
              <div style="width:100px;display: inline-block;"> {{activity.content.learning_rate}}</div>

              <span style="margin:0px 0px 0px 0px;display: inline-block; font-family: noto-black;color: #aaaaaa;" > Epoch:</span>
              <div style="width:150px;display: inline-block;"> {{activity.content.epoch}}</div>


              <!-- <span style="margin:0px 400px 0px 0px;"></span> -->

              <span style="margin:0px 0px 0px 0px;display: inline-block; font-family: noto-black;color: #aaaaaa;" > M:</span>
              <div style="width:175px;display: inline-block;"> {{activity.content.M}}</div>
              <span style="margin:0px 0px 0px 0px;display: inline-block; font-family: noto-black;color: #aaaaaa;"> Temperature:</span>
              <div style="width:100px;display: inline-block;"> {{activity.content.Temperature}} </div>
              <span style="margin:0px 0px 0px 0px;display: inline-block; font-family: noto-black;color: #aaaaaa;"> Error: </span>
              <div style="width:162px;display: inline-block;"> {{activity.content.mse}}</div>

              <!-- Temperature: -->
              <!-- <p> time1</p> -->
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>
      </div>

      </div>


    </div>

  </div>
</template>
<script src="./script.js"></script>

<style lang="less" scoped >
.viewA {
  position: fixed;
  width: 550px;
  /*300*/
  height: 1230px;
  left:10px;
  bottom: 10px;
  top:50px;
  border: 2px solid #aaaaaa;
  margin: 10px 0px 0px 0px;
  padding-left: 10px;
  padding-top: 0px;
  padding-bottom: 10px;
  // margin:10px 0px 0px 10px;
}
h2 {
  width:80%;
  // height: 1%;
  font-family: noto-black;
  font-size: 25px;
  color: #aaaaaa;
  // text-align: left;
}
h3 {
  width:60%;
  height: 1%;
  font-family: noto-black;
  font-size: 18px;
  color: #aaaaaa;
  text-align: left;
}
h4 {
  width:60%;
  height: 1%;
  font-family: noto-black;
  font-size: 14px;
  color: #aaaaaa;
  text-align: left;
}


</style>
