<template >
  <!-- 这里写Html -->
  <div class="viewD">
    <!-- <h1>viewC</h1> -->
      <div style="display:inline-block;"> <h2 style="margin:5px 0px 0px 0px; padding: 5px">Inference</h2> </div>
        <el-button round size= "mini" icon="el-icon-finished" style="margin-left:300px;height:28px" @click="get_inference()">infer</el-button>
    <!-- <el-button round size= "mini" icon="el-icon-plus" style="margin-left:250px;" @click="add_one()">add</el-button> -->
      <!-- <el-table-column prop="positivescore" label="Positive score" sortable fit width="150px" >
        <template slot-scope="scope">
          <el-progress
            type="line"
            :percentage="scope.row.positivescore"
            :color="customColor"
            :show-text="false"
            class="progress"
          >
          </el-progress>
          <span class="progress" :style="{color: customColor(scope.row.positivescore)}">{{ scope.row.positivescore}}</span>
        </template>
      </el-table-column> -->
      <!-- <el-table-column prop="negativescore" label="Negative score" sortable width="150px">
        <template slot-scope="scope">
          <el-progress
            type="line"
            :percentage="scope.row.negativescore"
            :color="customColor"
            :show-text="false"
            class="progress"
          >
          </el-progress>
          <span class="progress" :style="{color: customColor(scope.row.negativescore)}">{{ scope.row.negativescore}}</span>
        </template>
      </el-table-column> -->
      <div>
      <el-table
        ref="Inference_table"
        :data="InferenceData"
        tooltip-effect="dark"
        style="width: 80%;margin-left:10px; "
        height="270"
        :default-sort = "{prop: 'mse', order: 'descending'}"
        @row-click="handle_activation"
        >

        <el-table-column prop="sample" label="Sample"  width="100" align="center">
        </el-table-column>
        <el-table-column prop="mse" label="Prediction" sortable :sort-orders="['ascending', 'descending'] " >
          <template slot-scope="scope">
            <el-progress
              type="line"
              :percentage="scope.row.mse"
              :color="customColor"
              :show-text="false"
              class="progress"
            >
            </el-progress>
            <span class="progress" :style="{color: customColor(scope.row.mse)}" align="center" >{{ scope.row.mse}}</span>
          </template>
        </el-table-column>
      </el-table>
      </div>
      <div ref="activation_chart"  style="width:550px;height:300px; margin-top:15px;border: 0px solid black;"> </div>



    <!-- <div
    id="map"
    style="
      position: absolute;
      width: 500px;
      height: 500px;
      bottom: 0px;
      right: 0px;
    "
    >
    </div> -->
  </div>
</template>
<script src="./script.js"></script>

<style lang="less" scoped>

.viewD {
  position: fixed;
  width: 590px;
  height: 630px;
  left:1932px;
  bottom: 10px;
  top:650px;
  border: 2px solid #aaaaaa;
  margin: 10px 10px 0px 0px;
  padding-left: 10px;
  padding-top: 0px;
  padding-bottom: 10px;
}

@font-face {
  font-family: "noto-bold";
  src: url("../../font/NotoSans-Bold.ttf");
  font-weight: normal;
  font-style: normal;
}


h1 {
  font-family: noto-bold;
  font-size: 25px;
  color: white;
  text-align: left;
  background-color: black;
}
h2 {
  font-family: noto-black;
  font-size: 25px;
  color: #aaaaaa;
  text-align: left;
  // position: absolute;
}
* {
    font-size: 14px;
}
/* .el-table--mini, .el-table--small, .el-table__expand-icon {
    font-size: 5px;
} */
</style>
