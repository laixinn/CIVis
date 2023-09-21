<template >
  <!-- 这里写Html -->
  <div class="viewC">
    <!-- <h1>viewC</h1> -->
    <div>
      <div style="width:50%;height:30px;display: inline-block;">
        <h2 style="margin:5px 0px 0px 0px; padding: 5px;">Training</h2>
      </div>
      <div style="width:40%;height:30px;display: inline-block;">
        <!-- <el-button
            round
            style="margin:5px 10px 10px 10px; padding: 5px;"
            icon="el-icon-plus"
            @click="add()"
            >add
          </el-button> -->
      </div>
    </div>
    <h3 style="margin-left:10px;  margin-bottom:0px;margin-top:15px;margin-right:0px;display: inline-block;">Model Parameter</h3>
    <div style="display: inline-block;font-size: 15px;color: #aaaaaa;margin-left:70px;width:300px">
      <el-button  round icon="el-icon-switch-button" size= "mini"  style=" display: inline-block;margin-left:100px;"  @click="stopmodel()">stop</el-button>
      <el-button  round icon="el-icon-caret-right" size= "mini"  style=" display: inline-block;margin-left:10px;"  @click="runmodel()">train</el-button>
      <!-- <el-button size="mini"  @click="getData()">test</el-button> -->
    </div>
    <div style="float: left; width: 100%;height:25%">
      <div style="float: left; width: 50%">
        <div style="margin: 0 0px 0 0px; overflow: hidden">
          <span style="float: left; margin-top: 0px; margin-left:15px; width: 100%">Learning rate</span>
          <span style="float: left; margin-top: 10px; width: 10%; font-size: smaller;" align="center">0.001</span>
          <el-slider
            :min="0.001"
            :max="0.1"
            :step="0.001"
            v-model="learning_rate"
            style="margin-left: 15px; width: 70%; float: left;"
          ></el-slider>
          <span style="float: left; margin-top: 10px; margin-left: 10px; width: 10%; font-size: smaller;">0.01</span>
        </div>
        <div style="margin: 0 0px 0 0px; overflow: hidden">
          <span style="float: left; margin-top: 0px; margin-left:15px; width: 100%">Temperature</span>
          <span style="float: left; margin-top: 10px; width: 10%; font-size: smaller;" align="center">0.01</span>
          <el-slider
            :min="0.01"
            :max="1"
            :step="0.01"
            v-model="temperature"
            style="margin-left: 15px; width: 70%; float: left"
          ></el-slider>
          <span style="float: left; margin-top: 10px; margin-left: 10px; width: 10%; font-size: smaller;">1</span>
        </div>

      </div>
      <div style="float: left; width: 50%">

        <div style="margin: 0 0px 0 15px; overflow: hidden">
          <span style="float: left; margin-top: 0px; margin-left:15px; width: 100%">Epoch</span>
          <span style="float: left; margin-top: 10px; width: 10%; font-size: smaller;" align="center">10</span>
          <el-slider
            :min="10"
            :max="1000"
            :step="10"
            v-model="epoch"
            style="margin-left: 10px; width: 70%; float: left"
          ></el-slider>
          <span style="float: left; margin-top: 10px; margin-left: 10px; width: 10%; font-size: smaller;">1000</span>
        </div>
        <div style="margin: 0 0px 0 15px; overflow: hidden">
          <span style="float: left; margin-top: 0px; margin-left:15px; width: 100%">M</span>
          <span style="float: left; margin-top: 10px; width: 10%; font-size: smaller;" align="center">0</span>
          <el-slider
            :min="0"
            :max="1"
            :step="0.01"
            v-model="m"
            style="margin-left: 10px;width: 70%; float: left"
          ></el-slider>
          <span style="float: left; margin-top: 10px; margin-left: 10px; width: 10%; font-size: smaller;">1</span>
        </div>
      </div>

    </div>

    <!-- <svg id="lineChart1" ></svg> -->
    <!-- <svg id="lineChart2" ></svg> -->
    <h3 style="margin-left:10px;">Model Performance</h3>
    <div  ref="chart1"  style="width:48%;height:300px;display: inline-block;"></div>
    <div  ref="chart2"  style="width:48%;height:300px;display: inline-block;margin-left:15px"></div>




    <!-- <div  ref="chart1"  style="width:50%;height:300px;display: inline-block;" ></div> -->
    <!-- <div  ref="chart2"  style="width:50%;height:300px;display: inline-block;" ></div> -->

    <!-- </el-col> -->

    <!-- <div id="chartLineBox" style="width: 90%;height: 70vh;"> </div> -->
  </div>
</template>
<script src="./script.js"></script>

<style lang="less" scoped>
.viewC {
  position: fixed;
  width: 590px;
  height: 573px;
  left:1932px;
  bottom: 10px;
  top:50px;
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
  position: absolute;
}
h3 {
  font-family: noto-black;
  font-size: 18px;
  color: #aaaaaa;
  text-align: left;
  // position: absolute;
}
</style>
