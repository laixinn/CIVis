<template>
  <!-- 这里写Html -->
   <div class="viewB">
    <div style="width:100%;height:130px;display: inline-block;padding: 10px 10px 10px 10px">
      <!-- <h2 style="margin:5px 0px 0px 0px; padding: 5px;display: inline-block;">Contrastive Learning</h2>
      <el-button round size= "mini" icon="el-icon-check" style="display: inline-block;margin-left: 15px;"  @click="init_neg_pos()" v-loading="loading4" >get Negative&Positive
      </el-button> -->
      <template>
        <a-steps :current="step_current" style="margin-top:10px">
          <a-step title="Specification" description="Choose model and features in Overview"/>
            <!-- <template>
              <a-progress type="circle" :percent="step_percent"/>
            </template> -->
          <a-step title="Sampling" description="Go positive & negative sampling" />
          <a-step title="Train" description="Set hyperparameter and train" />
          <a-step title="Comparison" description="Analyze the model status in comparison view" />
          <a-step title="Save&Switch" description="Save to go inference/ Swith to go sampling" />
          <a-step title="Inference" description="Test the saved model" />
        </a-steps>
      </template>
    </div>
    <h4 class="title-text"><span style="margin-top:-10px">Negative Sampling</span></h4>

    <div id="Svglasso" style="width:40%;height:420px;display: inline-block;margin-left:10px;">
    </div>
    <div style="width:55%;height:420px; display: inline-block; margin-top:0px;margin-left:40px;">
      <div style="width:700px;height:220px; display: inline-block;">

        <el-button round  icon="el-icon-upload2" size="mini" style="display: inline-block" @click="set_negative()">set Negative
        </el-button>

        <!-- <div style="font-size: 15px;color: #aaaaaa;margin-left:15px;display: inline-block;width:50%;height:40px">
            layer
          <el-cascader
            size="mini"
            placeholder="Select"
            :options="options1"
          >
          </el-cascader>
          <el-button size="mini"  @click="savelayer()">save</el-button>
        </div> -->
        <div style="width:40%;font-size: 15px;color: #aaaaaa;margin-left:5px;display: inline-block;">
          m
          <el-slider
            :min="0.9"
            :max="1"
            :step="0.01"
            v-model="m_para"
            style="margin-left: 20px;width: 30%;height:22px;display: inline-block;"
          ></el-slider>
        </div>
        <!-- <el-button round  icon="el-icon-download" size="mini" style="width:10%;display: inline-block;" @click="getPreprojection()">Neg -->
        <!-- </el-button> -->

      <!-- <div > -->
        <!-- <el-radio-group v-model="radio1" size="small" style="width:75%;display: inline-block;"> -->
          <!-- <el-radio-button label="All" disabled ></el-radio-button>
          <el-radio-button label="Complete"></el-radio-button>
          <el-radio-button label="Incomplete"></el-radio-button> -->
        <!-- </el-radio-group> -->

        <!-- <el-button round  icon="el-icon-download" size="mini" style="width:16%;display: inline-block;" @click="get_lasso()">get_lasso</el-button> -->
      <!-- </div> -->
        <!-- <el-button round size= "mini" icon="el-icon-delete" style="display: inline-block; margin-left:160px;" @click="init_drawlasso()">clear</el-button> -->
        <div style="width:700px;height:220px;   display: inline-block;">
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100% "
          :row-style="{height:'70px'}"
          size="mini"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            label="Strategy"
            width="180">
            <template slot-scope="scope">{{ scope.row.ss }}</template>
          </el-table-column>
          <el-table-column
            prop="hyperparameter"
            label="Rate"
            width="250"
          >
            <template slot-scope="scope">
              <!-- <span style="">{{scope.row.hyperparameter}}</span> -->
              <el-slider
                :min="0.2"
                :max="1"
                :step="0.1"
                v-model="scope.row.pp"
                style="margin-left: 10px; width: 100%;"
              ></el-slider>
            </template>
          </el-table-column>

          <el-table-column >
          <!-- <template slot-scope="scope"> -->
            <el-button
              size="mini"
              style="margin-left: 50px;"
              @click="applyNeg()">apply</el-button>
          <!-- </template> -->
        </el-table-column>
        </el-table>
        <!-- <div style="margin-top: 20px"> -->
          <!-- <el-button @click="toggleSelection([tableData[1], tableData[2]])">切换第二、第三行的选中状态</el-button> -->
        </div>

      </div>
      <div id="feature_list" style="width:700px;height:200px; display: inline-block;">
      <el-input   placeholder="Keywords" icon="search"  class="search"  size="mini" v-model="search" style="width:20%; top:-180px"  ></el-input>
      <el-table
          ref="feature_table"
          :data="feature_Data_values"
          tooltip-effect="dark"
          style="width: 75%;display: inline-block;margin-left:15px "
          border
          height="200"

          >
          <!-- <el-table-column fixed prop="name" label="name " width="100px"> -->
            <!-- </el-table-column> -->
          <el-table-column prop="feature" label="Feature" width=200px>
            <!-- <template slot="header" slot-scope="scope">
            //表头名称
            <div style="line-height: 14px;">产品编码</div>
            //表头搜索框
            <el-input
              v-model="search.feature"
              size="mini"
              clearable
              prefix-icon="el-icon-search"
              style="line-height: 24px;"></el-input>
            </template> -->
          </el-table-column>
          <el-table-column prop="value" label="Value">
          </el-table-column>
      </el-table>
      </div>
    </div>



    <!-- <div id = "myCircle"></div> -->

    <!-- <div style="width: 50%;left:50%">

    </div> -->
    <div style="margin-left:-10px">
      <h4 class="title-text"><span style="margin-top:-10px">Positive Sampling</span></h4>
      <div style="margin-bottom:1px;margin-top:-5px;">
        <!-- <el-button type="primary" icon="el-icon-upload2"></el-button> -->
  <!--      <el-button round size= "mini" icon="el-icon-download"  @click="init_pos()">getPos</el-button>-->
        <!-- <el-button round size= "mini" icon="el-icon-s-unfold"  @click="expand()">expand</el-button> -->
        <!-- <el-button round size= "mini" icon="el-icon-upload2"  @click="sampleDetails()">sampleDetails</el-button> -->
        <!-- <el-button round size= "mini" icon="el-icon-setting"  @click="setDetails()">set Details</el-button> -->
        <!-- <el-button round size= "mini" icon="el-icon-upload2"  @click="set_positive()">set Positive</el-button> -->


        <div style="width:485px;margin-left:600px;font-size: 15px;color: #aaaaaa;display: inline-block;">
        set Row
        <el-slider
          :min="1"
          :max="15"
          :step="1"
          v-model="set_num"
          style="margin-left: 10px;width: 30%;display: inline-block;height:20px"
        ></el-slider>
        <el-cascader
          ref="404"
          style="left:30px;width:180px;"
          size="mini"
          :options="options1"
          @change="changePosmethod"
          v-model="pos_method"
          v-loading="loading2"
          id="ouyy"
        >
        </el-cascader>
        </div>
        <!-- <el-button round size= "mini" icon="el-icon-delete"  @click="clean_samples()">clear</el-button> -->
        <el-button round size= "mini" icon="el-icon-upload2"  @click="set_positive()">set Positive</el-button>



      </div>

      <div id = "preview1" style="width:300px;height:302px; display: inline-block;">
        <svg style="width:300px;height:110px; "> </svg>
        <el-table
          ref="feature_table_pos_left"
          :data="feature_Data_values_pos_left"
          tooltip-effect="dark"
          height="192"
          style="width: 290px;display: inline-block;margin-left:5px;"


          >
          <!-- <el-table-column fixed prop="name" label="name " width="100px"> -->
            <!-- </el-table-column> -->
          <el-table-column prop="feature2" label="Feature" width=145px>
            <!-- <template slot="header" slot-scope="scope">
            //表头名称
            <div style="line-height: 14px;">产品编码</div>
            //表头搜索框
            <el-input
              v-model="search.feature"
              size="mini"
              clearable
              prefix-icon="el-icon-search"
              style="line-height: 24px;"></el-input>
            </template> -->
          </el-table-column>
          <el-table-column prop="value2" label="Value" width=130px>
          </el-table-column>
        </el-table>

      </div>
      <div id="left_distribution" style="width:50px;height:302px;display: inline-block;border: 0px solid black;">
        <svg style="width:50px;height:302px;" > </svg>
      </div>
      <div id="sankey"  style="width:600px;height:302px;display: inline-block;border: 0px solid black;"></div>
      <div id="right_distribution" style="width:50px;height:302px;display: inline-block;border: 0px solid black;">
        <svg style="width:50px;height:302px;" > </svg>
      </div>
      <div id = "preview2" style="width:300px;height:302px; display: inline-block; ">
        <svg style="width:300px;height:110px; "> </svg>
        <el-table
          ref="feature_table_pos_right"
          :data="feature_Data_values_pos_right"
          tooltip-effect="dark"
          height="192"
          style="width: 290px;display: inline-block;margin-left:5px;"


          >
          <!-- <el-table-column fixed prop="name" label="name " width="100px"> -->
            <!-- </el-table-column> -->
          <el-table-column prop="feature2" label="Feature" width=145px>
            <!-- <template slot="header" slot-scope="scope">
            //表头名称
            <div style="line-height: 14px;">产品编码</div>
            //表头搜索框
            <el-input
              v-model="search.feature"
              size="mini"
              clearable
              prefix-icon="el-icon-search"
              style="line-height: 24px;"></el-input>
            </template> -->
          </el-table-column>
          <el-table-column prop="value2" label="Value" width=130px>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <h4 class="title-text"><span>Comparison</span></h4>
    <div style="margin-bottom:0px;margin-top:-5px;">
      <!-- <el-button round size= "mini" icon="el-icon-check"  @click="get_pro_act()" v-loading="loading3">get</el-button> -->

      <!-- <el-button round size= "mini" icon="el-icon-delete"  @click="clear()">clear</el-button> -->
    </div>
    <div id="lasso_"  style ="width:420px;height:280px;display: inline-block;font-size: 15px;color: #aaaaaa;margin-left:15px;border: 0px solid black;"></div>
    <!-- <div id="lasso_2"  style ="width:400px;height:260px;font-size: 15px;color: #aaaaaa;margin-left:15px;border: 2px solid black;"></div> -->
    <div style ="width:415px;height:280px;display: inline-block;margin-left:0px;border: 0px solid black;">
    <!-- metric
    <el-cascader
    style="width: 200px;display: inline-block;"
    size="mini"
    placeholder="Please select metric"
    :options="metric_options"
    @change="metric_change"
    >
    </el-cascader> -->
    <!-- <el-table
        :data="tableData1"
        style="width: 900px;height:320px;">
        <el-table-column
          prop="Metrics"
          label="Metrics"
          width="120">
        </el-table-column>
        <el-table-column
          prop="First"
          label="First"
          width="120">
        </el-table-column>
        <el-table-column
          prop="Second"
          label="Second"
          width="120">
        </el-table-column>
        <el-table-column
          prop="Third"
          label="Third"
          width="120">
        </el-table-column>
    </el-table> -->



    <!-- <div ref="box"  style="width:400px;height:300px; display: inline-block; "> </div> -->
      <div ref="var_neg"  style="width:400px;height:140px; border: 0px solid black;"> </div>
      <div ref="mean_neg"  style="width:400px;height:140px; border: 0px solid black;"> </div>
    </div>

    <div style ="width:415px;height:280px;display: inline-block;margin-left:15px;border: 0px solid black;">
    <!-- <div ref="box"  style="width:400px;height:300px; display: inline-block; "> </div> -->
      <div ref="mean_pos"  style="width:400px;height:140px; border: 0px solid black;"> </div>
      <div ref="activation_chart"  style="width:400px;height:140px; border: 0px solid black;"> </div>
    </div>



  </div>
</template>
<script src="./script.js"></script>

<style lang="sss"  scoped>

.viewB {
  position: fixed;
  width: 1322px;
  /*300*/
  height: 1230px;
  left:585px;
  /*300*/
  bottom: 10px;
  top:50px;
  border: 2px solid #aaaaaa;
  margin: 10px 0px 0px 0px;
  padding-left: 10px;
  padding-top: 0px;
  padding-bottom: 10px;
}

h2 {
  width:40%;
  height: 1%;
  font-family: noto-black;
  font-size: 25px;
  color: #aaaaaa;
  text-align: left;
}
h2_new {
  width:40%;
  height: 1%;
  font-family: noto-black;
  font-size: 25px;
  color: #aaaaaa;
  text-align: left;
}
h3 {
  width:10%;
  height: 2%;
  right: 1000px;
  font-family: noto-black;
  font-size: 15px;
  color: #aaaaaa;
  text-align: left;
}
h4 {
  /* font-family: noto-bold; */
  font-size: 5px;
  color: white;
  /* text-align: left; */
  /* background-color: white; */
}
.title-text span {
    display: block;      /*设置为块级元素会独占一行形成上下居中的效果*/
    position: relative;  /*定位横线（当横线的父元素）*/

    color: #aaaaaa;      /*居中文字的颜色*/
    text-align: center;
}

.title-text span:before, .title-text span:after {
    content: '';
    position: absolute;   /*定位背景横线的位置*/
    top: 50%;
    background: #aaaaaa;   /*背景横线颜色*/
    width: 40%;            /*单侧横线的长度*/
    height: 0.1px;
}

.title-text span:before {
    left: 1%;              /*调整背景横线的左右距离*/
}

.title-text span:after {
    right: 1%;
}
#Svglasso {
  margin-left:50px;
  width:500px;
  height:400px;
  display: inline-block;
}


</style>
