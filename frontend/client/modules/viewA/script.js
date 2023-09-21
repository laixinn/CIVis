/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import HttpHelper from "common/utils/axios_helper.js";
import * as d3 from "d3";
// import { connect } from "echarts";
// import { init } from "../../../server/model/Road";
export default {
    components: { // 依赖组件

    },
    data() { // 本页面数据
        return {
          MODEL:"",
          DATA:"",
          tableData: [],
          // value:[],
          // selected_dataset: 'House',
          options1: [{
              value: "House",
              label: "House"
          },
          {
              value: "UCI_concrete",
              label: "UCI_concrete"
          },
          {
            value: "Credit",
            label: "Credit_Card"
          }],
          options2: [{
            value: "CNN",
            label: "CNN"
          },
          {
              value: "AutoInt",
              label: "AutoInt"
          }],
          id: "613a1f1d9b3ecc1ceddec9c9",
          dataset : [
            { id:1, name: '数据一', value: 2345 },
            { id:2, name: '数据二', value: 4467 },
            { id:3, name: '数据三', value: 2356 },
            { id:4, name: '数据四', value: 3895 },
            { id:5, name: '数据五', value: 3495 },
            { id:6, name: '数据六', value: 3895 },
            { id:7, name: '数据七', value: 2597 },
            { id:8, name: '数据八', value: 2997 },
          ],
          all_features:[],
          activities: [{
            content: "",
            timestamp: 'First',
            color :"#bfbfbf",
            model_id:0,
          }, {
            content: "",
            timestamp: 'Second',
            color :"#bfbfbf",
            model_id:0,
          }, {
            content: "",
            timestamp: 'Third',
            color :"#bfbfbf",
            model_id:0,
          }],
          model_id:0,
          status:-1,
          loading1:false,
          gui_cnt: 0
      };
    },
    mounted() {
      // this.init()
      this.barChartsD3();
      // this.get_feature();
    },
    methods: { // 这里写本页面自定义方法
      async choose() {
        let array = this.$refs.feature_table.selection
        let feature_list = []
        array.forEach(d => {
          feature_list.push(d.feature)
        })
        // console.log(feature)
        // this.$root.Bus.$emit('feature', JSON.parse(JSON.stringify(feature)));
        // let req={"feature":feature};
        // let req = {feature};
        // let all_features = this.all_features
        // let select_features = all_features.remove(feature_list)
        console.log(feature_list)
        // feature_list.remove()
        this.loading1 = true
        console.log(await HttpHelper.axiosPost("/euro/selectFeature",JSON.stringify(feature_list)));
        this.$root.Bus.$emit('feature_select_all', JSON.parse(JSON.stringify(feature_list)));

        this.loading1 = false
        console.log("SelectFeature Done!")
        // function sleep(time){
        //   return new Promise((resolve) => setTimeout(resolve, time));
        // }
        // await sleep(200);
        // this.getpreprojection()
        // this.initpos()
        // HttpHelper.axiosPost("/euro/getPreProjection");

        // await sleep(5000);
        // var sleep = require('sleep');
        // sleep.sleep(2);

        this.$root.Bus.$emit('get_neg_pos');
        this.$root.Bus.$emit('guidance_specification');
      },
      async getpreprojection() {
        let preprojection = await HttpHelper.axiosPost("/euro/getPreProjection");
        console.log(preprojection)
        this.$root.Bus.$emit('preprojection', JSON.parse(JSON.stringify(preprojection)))
        console.log("Get PreProjection Done!")
      },
      async initpos() {
        let initPos = await HttpHelper.axiosGet("/euro/initPos");
        this.$root.Bus.$emit('initPos', JSON.parse(JSON.stringify(initPos)))
      },
      async get_feature() {
          let dataset = this.$refs['cascaderAddr'].getCheckedNodes()[0].data.value;
          let missing_get = await HttpHelper.axiosPost("/euro/getMissing",JSON.stringify({'dataset': dataset}));
          // console.log("111");
          console.log(missing_get)
          // console.log("111");
          console.log("Get Missing Done!")

          function toDecimal2(x) {
            var f = parseFloat(x);
            if (isNaN(f)) {
              return false;
            }
            var f = Math.round(x*100)/100;
            var s = f.toString();
            var rs = s.indexOf('.');
            if (rs < 0) {
              rs = s.length;
              s += '.';
            }
            while (s.length <= rs + 2) {
              s += '0';
            }
            return s;
          }
          missing_get.forEach(d => {
            // this.all_features.push(d.feature)
            d.percentage = parseFloat((d.percentage*100).toFixed(2));
          })
          this.tableData = missing_get;
          console.log(missing_get)
          missing_get.forEach(d => {
            this.all_features.push(d.feature)
          })
          console.log(this.all_features)
          this.$root.Bus.$emit('feature_all', JSON.parse(JSON.stringify(this.all_features)));
          // console.log(dataget.miss_rate);
          // console.log(this.tableData);
      },
      customColor(percentage) {

        if(percentage < 20) {
          return "#80cbc4";
        }
        else if (percentage < 40 && percentage >= 20) {
          return "#90caf9";
        } else if (percentage < 70 && percentage >= 40) {
          return '#b39ddb';
        } else {
          return "#ef9a9a";
        }
      },
      barChartsD3() {
        var dataAll = [100,200,152,50,135,236];
        var rectWidth = 15;
        var xAxisWidth = 235;
        var yAxisHeight = 260;
        var svg = d3.select('#barChartsD3')
                .append("svg")
                .attr("width",xAxisWidth)
                .attr("height",yAxisHeight);

        var padding = {top: 10,right: 30,left: 40,bottom: 30};

        var xScale = d3.scaleBand()
                    .domain(d3.range(dataAll.length+1))
                    .range([0,xAxisWidth]);

        var yScale = d3.scaleLinear()
                    .domain([0,d3.max(dataAll)+50])
                    .range([0,yAxisHeight]);

        function draw_updateCharts(){
            var updateCharts = svg.selectAll("rect")
                                .data(dataAll);

            var enterCharts = updateCharts.enter();
            var exitCharts = updateCharts.exit();

            updateCharts.attr("x",function(d,i){
                            return padding.left + rectWidth/2 + xScale(i);
                        })
                        .attr("y",function(d,i){
                            return yAxisHeight - padding.bottom - yScale(d);
                        })
                        .attr("width",function(d,i){
                            return rectWidth;
                        })
                        .attr("height",function(d,i){
                            // console.log(yScale(d));
                            return yScale(d);
                        });

            enterCharts.append("rect")
                        .attr("fill","#aaaaac")
                        .attr("x",function(d,i){
                            return padding.left + rectWidth/2 + xScale(i);
                        })
                        .attr("y",function(d,i){
                            return yAxisHeight - padding.bottom - yScale(d);
                        })
                        .attr("width",function(d,i){
                            return rectWidth;
                        })
                        .attr("height",function(d,i){
                            // console.log(yScale(d));
                            return yScale(d);
                        });

            exitCharts.remove();
        }

        function draw_updateChartsText(){
            var updateChartsText = svg.selectAll("text")
                                    .data(dataAll);

            var enterChartsText = updateChartsText.enter();
            var exitChartsText = updateChartsText.exit();

            enterChartsText.append("text")
                        .attr("fill",d3.rgb(0,0,0))
                        .attr("font-size","14px")
                        .attr("text-anchor","middle")
                        .attr("x",function(d,i){
                            return padding.left + rectWidth/2 + xScale(i);
                        })
                        .attr("y",function(d,i){
                            return yAxisHeight - padding.bottom - yScale(d);
                        })
                        .attr("dx",rectWidth/2)
                        .attr("dy",14)
                        .text(function(d,i){
                            return dataAll[i];
                        });

            exitChartsText.remove();
        }

        function draw_axis(){
            var xAxis = d3.axisBottom()
                        .scale(xScale);

            yScale.range([yAxisHeight,0]);
            var yAxis = d3.axisLeft()
                        .scale(yScale);

            svg.append("g")
                .attr("class","axis")
                .attr("transform","translate(" + padding.left + "," + (yAxisHeight - padding.bottom) + ")")
                .call(xAxis);

            svg.append("g")
                .attr("class","axis")
                .attr("transform","translate(" + padding.left + "," + -1*padding.bottom + ")")
                .call(yAxis);
        }

        draw_updateCharts();
        draw_updateChartsText();
        draw_axis();
      },
      delete_one() {
        // this.activities[this.status].content = ""
        if (this.status == 0) {
          this.activities[0].content = this.activities[1].content
          this.activities[0].model_id = this.activities[1].model_id
          this.activities[1].content = this.activities[2].content
          this.activities[1].model_id = this.activities[2].model_id
          this.activities[2].content = ""
          this.activities[2].model_id = 0

          // HttpHelper.axiosPost("/euro/switchLogs",{"model": parseInt(activity.model_id)})
          // this.status = 0
          // console.log(0)
        }
        else if (this.status == 1) {
          // this.activities[0].content = this.activities[1].content
          this.activities[1].content = this.activities[2].content
          this.activities[1].model_id = this.activities[2].model_id
          this.activities[2].content = ""
          this.activities[2].model_id = 0
          // HttpHelper.axiosPost("/euro/switchLogs",{"model": parseInt(activity.model_id)})
          // this.status = 1
        }
        else {
          this.activities[2].content = ""
          this.activities[2].model_id = 0
          // HttpHelper.axiosPost("/euro/switchLogs",{"model": parseInt(activity.model_id)})
          // this.status = 2
        }
        for (var i=0; i <  this.activities.length; i++) {
          this.activities[i].color = "#bfbfbf"
        }

        // if (this.activities[1].content == "")
        //   this.activities[0].content = ""
        // if (this.activities[2].content == "")
        //   this.activities[1].content = ""
        // this.activities[2].content = ""
      },
      async add_one() {
        let model_id = await HttpHelper.axiosPost("/euro/addLogs")
        this.model_id = model_id
        console.log(model_id)
        this.$root.Bus.$emit('add_one')
        this.$root.Bus.$emit('guidance_save')



        // console.log({datagetdata});
        // this.performaceData = dataget;
        // console.log(this.performaceData);
      },
      handleChangeVideo(activity) {

        if (activity.timestamp == "First") {
          // HttpHelper.axiosPost("/euro/switchLogs",{"model": parseInt(activity.model_id)})
          this.status = 0
          // console.log(0)
        }
        else if (activity.timestamp == "Second") {
          // HttpHelper.axiosPost("/euro/switchLogs",{"model": parseInt(activity.model_id)})
          this.status = 1
        }
        else {
          // HttpHelper.axiosPost("/euro/switchLogs",{"model": parseInt(activity.model_id)})
          this.status = 2
        }
        for (var i=0; i <  this.activities.length; i++) {
            this.activities[i].color = "#bfbfbf"
        }
        activity.color = "#409EFF"

        // return
      },
      async switch_model() {
        if (this.status == 0) {
          await HttpHelper.axiosPost("/euro/switchLogs",{"model": parseInt( this.activities[0].model_id)})
          // this.status = 0
          // console.log(0)
        }
        else if (this.status == 1) {
          await HttpHelper.axiosPost("/euro/switchLogs",{"model": parseInt( this.activities[1].model_id)})
          // this.status = 1
        }
        else {
          await HttpHelper.axiosPost("/euro/switchLogs",{"model": parseInt( this.activities[2].model_id)})
          // this.status = 2
        }
        this.$root.Bus.$emit('get_neg_pos');
        this.$root.Bus.$emit('guidance_switch');
      }
      // openArticle(value){
      //   console.log(value)
      // }
    },
    created() { // 生命周期中，组件被创建后调用
      this.$root.Bus.$on('model_result',info=>{
        // console.log("hah")
        console.log(info)
        for (var i=0; i <  3; i++) {
          if (this.activities[i].content=="") {
            this.activities[i].content = info
            this.activities[i].model_id = this.model_id
            break
          }
        }

        // console.log(this.initPos)
        // console.log(initPos)
        // this.drawsankey()
        //
      })
    },
};
