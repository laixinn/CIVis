/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import HttpHelper from "common/utils/axios_helper.js";
import { mean } from "d3-array";
import { color } from "d3-color";
import { path } from "d3-path";
import { schemeGnBu } from "d3-scale-chromatic";
import { arc } from "d3-shape";
import { List } from "echarts";
import { ColorPicker } from "element-ui";
import { SVG } from "leaflet";
// import { connect } from "mongoose";
// import { NULL } from "node-sass";
const d3lasso = require('d3-lasso');
const datatool = require('echarts/dist/extension/dataTool.js');
const cityOptions = ['All', 'Complete', 'Incomplete'];
export default {
    components: { // 依赖组件

    },

    data() { // 本页面数据
        return {
            id: "5d42ac3d9c149c38248c8199",
            option_mean_pos: {

                animation:false,
                title: {
                    text: "mean+var"
                },
                tooltip: {
                    trigger: 'axis'
                },
                // 设置折现对应的颜色
                color: ['#b39ddb',"#90caf9", "#ef9a9a","#80cbc4"],
                xAxis: {
                    name:"epoch",
                    type: 'category',
                    nameTextStyle: {
                        fontStyle: "italic"
                    },
                    splitLine: {
                        show: false
                    },
                    axisLabel: {
                        show: true,
                        // interval: "0", // 显示全部数据，还有auto/>0数字均可
                        // margin: 100,
                        // splitNumber: 0,
                    }
                },
                yAxis: {
                // name: "loss+acc",
                    type: "value",
                    // boundaryGap: [0, "100%"],
                    splitLine: {
                        show: false
                    },
                    axisLine: {
                        show:true,
                        // lineStyle: {
                        //   color:'red'  //Y轴颜色
                        // }
                    },
                    min: (value) => {
                        // parseFloat((d.percentage*100).toFixed(2))
                        return value.min.toFixed(2);
                    },
                    max: (value) => {
                        return value.max.toFixed(2);
                    }

                },
                series: [

                ],
                legend :{
                    data: ["mean_pos"],
                    top: 10,
                    right: 0,
                    //   设置图例的形状
                    icon: "rect",
                    //   设置图例的高度
                    itemHeight: 1
                }
            },
            option_mean_neg: {
                animation:false,
                title: {
                    text: "mean+var"
                },
                tooltip: {
                    trigger: 'axis'
                },
                // 设置折现对应的颜色
                color: ['#b39ddb',"#90caf9", "#ef9a9a","#80cbc4"],
                xAxis: {
                    name:"epoch",
                    type: 'category',
                    nameTextStyle: {
                        fontStyle: "italic"
                    },
                    splitLine: {
                        show: false
                    },
                    axisLabel: {
                        show: true,
                        // interval: "0", // 显示全部数据，还有auto/>0数字均可
                        // margin: 100,
                        // splitNumber: 0,
                    }
                },
                yAxis: {
                // name: "loss+acc",
                    type: "value",
                    // boundaryGap: [0, "100%"],
                    splitLine: {
                        show: false
                    },
                    axisLine: {
                        show:true,
                        // lineStyle: {
                        //   color:'red'  //Y轴颜色
                        // }
                    },
                    min: (value) => {
                        // parseFloat((d.percentage*100).toFixed(2))
                        return value.min.toFixed(2);
                    },
                    max: (value) => {
                        return value.max.toFixed(2);
                    }

                },
                series: [

                ],
                legend :{
                    data: ["mean_pos"],
                    top: 20,
                    right: 0,
                    //   设置图例的形状
                    icon: "rect",
                    //   设置图例的高度
                    itemHeight: 1
                }
            },
            option_var_neg: {
                animation:false,
                title: {
                    text: "mean+var"
                },
                tooltip: {
                    trigger: 'axis'
                },
                // 设置折现对应的颜色
                color: ['#b39ddb',"#90caf9", "#ef9a9a","#80cbc4"],
                // "#90caf9"
                xAxis: {
                    name:"epoch",
                    type: 'category',
                    nameTextStyle: {
                        fontStyle: "italic"
                    },
                    splitLine: {
                        show: false
                    },
                    axisLabel: {
                        show: true,
                        // interval: "0", // 显示全部数据，还有auto/>0数字均可
                        // margin: 100,
                        // splitNumber: 0,
                    }
                },
                yAxis: {
                // name: "loss+acc",
                    type: "value",
                    // boundaryGap: [0, "100%"],
                    splitLine: {
                        show: false
                    },
                    axisLine: {
                        show:true,
                        // lineStyle: {
                        //   color:'red'  //Y轴颜色
                        // }
                    },
                    // min: 0,
                    // max: 1,

                    min: (value) => {
                        // parseFloat((d.percentage*100).toFixed(2))
                        return value.min.toFixed(2);
                    },
                    max: (value) => {
                        return value.max.toFixed(2);
                    }

                },
                series: [

                ],
                legend :{
                    data: ["mean_pos"],
                    top: 20,
                    right: 0,
                    //   设置图例的形状
                    icon: "rect",
                    //   设置图例的高度
                    itemHeight: 1
                }
            },
            metric_options: [{
                value: "mean",
                label: "mean"
            },
            {
                value: "var",
                label: "var"
            },
            {
                value: "activation",
                label: "activation"
            }],

            defaultpos_method:{
              value: "find_sim",
              label: "embedding"
            },
            options1: [{
                value: "find_sim",
                label: "embedding"
            },
            {
                value: "find_sim_cos",
                label: "raw"
            }],
            width: 380,
            height: 350,
            tableData: [{
                s: 'semi-hard',
                ss: 'hard',
                hyperparameter: 'm',
                pp:0,
            }, {
                s: 'random',
                ss: 'random',
                hyperparameter: 'size',
                pp:0,
            }],
            tableData1: [{
                Metrics: 'Embeddings',
            }, {
                Metrics: 'Mean/Var',
            }, {
                Metrics: 'TCAV',
            }, {
                Metrics: 'Activation',
            }
            ],
            multipleSelection: [],
            radio1: 'Complete',
            lasso_start: "",
            lasso_end: "",
            activation:[],
            mean_var:{
                mean_neg:[],
                mean_pos:[],
                mean_var:[],
                activation:[],
            },
            select_sample:[],
            preprojection:[],
            projection:[],

            status:1,
            status_act:1,
            status_lasso_:1,
            // lasso_status:1,
            option_act:[],
            circles_in:[],
            m_para:0,
            tsne_data:[],
            feature_Data_value:[],
            feature_select_all:[],
            feature_all:[],
            // search:{feature:[]},
            search: '',  //搜索
            // center_x_y:[],
            // train
            initPos: [],
            select_sets:[],
            select_set_details:[],
            selectsampleDetails:[],
            feature_Data_values_pos_left:[],
            feature_Data_values_pos_right:[],
            sampleDetails_set:[],
            Dict_inside:{},
            nodes_inside:[],
            links_inside:[],
            arr_left:[],

            lassosamples_details:{},
            // data1:{},
            set_num:2,

            // adjust_color
            // arc_color:"#f1c40f",
            arc_color_left:"#80cbc4",
            arc_color_right:"#ef9a9a",
            arc_out_color:"#aaaaaa",
            arc_apply_color:"#90caf9",
            pos_method: ["find_sim"],
            loading2:false,
            loading3:false,
            loading4:false,
            //step
            step_percent: 40,
            step_current: 0,
        };
    },
    computed:{
        feature_Data_values:function(){
            var search = this.search;
            if(search){
                console.log("search");
                return  this.feature_Data_value.filter(function(dataNews){
                    return Object.keys(dataNews).some(function(key){
                        return String(dataNews[key]).toLowerCase().indexOf(search) > -1;
                    });
                });
            }
            return this.feature_Data_value;
        }
    },
    mounted() {
        // this.drawsankey()
        // this.drawfeature_list()
        this.drawpreview1();
        this.drawpreview2();
        // this.drawlasso()
        this.init_drawlasso_();
        this.init_drawlasso();
        // this.drawbox()
        // this.drawmean()
        this.draw_mean_pos();
        this.draw_mean_neg();
        this.draw_var_neg();
        this.draw_activation1();

        // this.init_pos()

        // this.drawsankey();
        // this.draw_left_distribution();
        // this.draw_right_distribution();


    },
    methods: {
        changePosmethod(value) {
          this.pos_method = value
          this.loading2 = true
          this.init_pos()
          this.loading2 = false
        },
        init_neg_pos() {
          this.init_pos()
          this.getPreprojection()
        },
        async set_negative() {

            let select_sample = this.select_sample;
            // console.log(select_sample)
            let array = this.$refs.multipleTable.selection;
            let neg_st = [];
            array.forEach(d => {
                neg_st.push({"strategy":d.s,"value":d.pp,"m":this.m_para});
            });
            let neg = {"neg_st":neg_st[0],"neg_sample":select_sample};
            // console.log(neg)
            await HttpHelper.axiosPost("/euro/setNegative",JSON.stringify(neg));
            console.log("Set_negative Done!");


            var circles_in = this.circles_in;
            circles_in._groups[0].forEach(function (item) {
            // console.log(select_sample)
            // console.log(item.getAttribute("name"))
                if ( select_sample.indexOf(item.getAttribute("name")) != -1) {
                    // console.log(item.getAttribute("name"))
                    // item.setAttribute("r","11")
                }
            // console.log(item)
            });

            // let preprojection = await HttpHelper.axiosGet("/euro/getPreProjection");
            // console.log()

            // this.$root.Bus.$emit('neg', JSON.parse(JSON.stringify(neg)))
        },
        async set_positive() {

            // let select_sample = this.select_sample
            // console.log(select_sample)
            // let array = this.$refs.multipleTable.selection
            // let neg_st = []
            // array.forEach(d => {
            //   neg_st.push({"strategy":d.s,"value":d.pp})
            // })
            // let neg = {"neg_st":neg_st,"neg_sample":select_sample};
            await HttpHelper.axiosPost("/euro/setPositive");
            console.log("Set_positive Done!");

            // this.$root.Bus.$emit('neg', JSON.parse(JSON.stringify(neg)))
            this.$root.Bus.$emit('guidance_sampling');
        },
        async get_lasso(){

            let lassosamples = this.select_sample;
            let lassosamples_details = await HttpHelper.axiosPost("/euro/getLasso",JSON.stringify(lassosamples));
            // console.log(lassosamples_details)
            this.lassosamples_details = lassosamples_details;
            this.get_mean_var();

        },
        async init_pos() {
            // console.log("hah")
            let set_num = this.set_num;
            // let pos_method = this.$refs['404'].getCheckedNodes()[0].data.value;
            //
            // let pos_method = "embedding"
            let initPos = await HttpHelper.axiosPost("/euro/initPos",JSON.stringify({'method': this.pos_method[0]}));
            this.initPos = initPos;
            this.set_num = set_num;
            // console.log(this.initPos)
            // console.log(initPos)
            d3.select("#sankey").select("svg").remove();
            this.drawsankey();
            this.draw_left_distribution();
            this.draw_right_distribution();
            //

            let selectsampleDetails = ["left",0];
            let sampleDetails_ = await HttpHelper.axiosPost("/euro/sampleDetails",JSON.stringify(selectsampleDetails));
            let feature_Data_values_pos_left = [];
            if (selectsampleDetails[0] == "left") {
              for (var key in sampleDetails_) {
                var item = sampleDetails_[key];
                feature_Data_values_pos_left.push({"feature2":key,"value2":item});
              }
              // 　　console.log(item); //AA,BB,CC,DD

              // for (let i = 0; i < this.feature_select_all.length; i++) {
              //   // text += cars[i] + "<br>";
              //   feature_Data_values_pos_left.push({"feature2":this.feature_select_all[i],"value2":sampleDetails_[i]})
              // }
              this.feature_Data_values_pos_left = feature_Data_values_pos_left;
              // sampleDetails_set[0] = selectsampleDetails[1];
              // feature_Data_value.push({"feature":that.feature_all,"value":d.feature})
              // console.log(d.feature)
              // console.log(that.feature_select_all)
            }

            selectsampleDetails = ["right",0];
            sampleDetails_ = await HttpHelper.axiosPost("/euro/sampleDetails",JSON.stringify(selectsampleDetails));
            let feature_Data_values_pos_right = [];
            if (selectsampleDetails[0] == "right") {
              // that.feature_all.forEach(function(){})
              // for (let i = 0; i < this.feature_all.length; i++) {
              //   // text += cars[i] + "<br>";
              //   // if (i == 0 )
              //   //   feature_Data_value.push({"feature":that.feature_all[i],"value":d.feature[i],"name":d.name})
              //   // else
              //   feature_Data_values_pos_right.push({"feature2":this.feature_all[i],"value2":sampleDetails_[i]})
              // }
              // sampleDetails_.forEach(function(item){

              // })

              for (var key in sampleDetails_) {
                var item = sampleDetails_[key];
                feature_Data_values_pos_right.push({"feature2":key,"value2":item});
                // 　　console.log(item); //AA,BB,CC,DD

              }
              this.feature_Data_values_pos_right = feature_Data_values_pos_right;
              // sampleDetails_set[1] = selectsampleDetails[1];


              // console.log(d.feature)
              // console.log(that.feature_all)
            }




        },
        async expand() {
            // console.log("hsha")
            // let selectsets = ["left_set_0","right_set_2"];
            let selectsets = this.select_sets;
            // rect hide
            // d3.select("#sankey").select(".select_rect_right")
            //     // .attr("", "white")
            //     .attr("fill-opacity", 1)
            //     .attr("stroke-width", 4)

            // d3.select("#sankey").select(".select_rect_left")
            //     // .attr("fill", "white")
            //     .attr("fill-opacity", 1)
            //     .attr("stroke-width", 4)
            // document.querySelectorAll(" span")
            console.log(selectsets);
            let select_set_details = await HttpHelper.axiosPost("/euro/selectSets",JSON.stringify(selectsets));
            this.select_set_details = select_set_details;
            console.log(this.select_set_details);
            console.log(this.select_set_details.length);
            // handle inside nodes
            let Dict_inside = {};
            let node_name_left = [];
            let node_name_right = [];

            this.select_set_details.forEach(function(item){
            // Dict[i] =
            // console.log(item.source)
                node_name_left.push(item.source);
                node_name_right.push(item.target);

            });
            console.log(node_name_left);
            console.log(node_name_right);
            var arr_left =[];    //定义一个临时数组
            for(var i = 0; i < node_name_left.length; i++){
                if(arr_left.indexOf(node_name_left[i]) == -1){
                    arr_left.push(node_name_left[i]);
                }
            }
            var arr_right =[];    //定义一个临时数组
            for(var i = 0; i < node_name_right.length; i++){

                if(arr_right.indexOf(node_name_right[i]) == -1){
                    arr_right.push(node_name_right[i]);
                }
            }
            console.log(arr_left);
            console.log(arr_right);
            this.arr_left = arr_left;
            // Dict_inside[i] =
            for(var i = 0; i < (arr_left.length+arr_right.length); i++){
                if (i<arr_left.length)
                    Dict_inside[i] = arr_left[i];
                else
                    Dict_inside[i] = arr_right[i-arr_left.length];
            }

            console.log(Dict_inside);
            this.Dict_inside = Dict_inside;
            var nodes_inside = [];
            arr_left.forEach(function(item){
                nodes_inside.push({"name":item});
            });
            arr_right.forEach(function(item){
                nodes_inside.push({"name":item});
            });
            console.log(nodes_inside);
            this.nodes_inside = nodes_inside;

            var links_inside = [];

            function findKey(obj, value, compare = (a, b) => a === b) {
                return Object.keys(obj).find(k => compare(obj[k], value));
            }
            this.select_set_details.forEach(function(item){
            // Dict[i] =
            // console.log(item.source)
            // if (item.coeff != 0)
                links_inside.push({"source":parseInt(findKey(Dict_inside,item.source)),"target":parseInt(findKey(Dict_inside,item.target)),"value":item.value,"coeff":item.coeff});
            // node_name_right.push(item.target)

            });
            this.links_inside = links_inside;
            console.log(links_inside);
            // 'nodes': [
            //   {name: "left_set_0"},
            //   {name: "left_set_1"},
            //   {name: "left_set_2"},
            //   {name: "left_set_3"},
            //   {name: "left_set_4"},
            //   {name: "left_set_5"},
            //   {name: "left_set_6"},
            //   {name: "left_set_7"},
            //   {name: "left_set_8"},
            //   {name: "left_set_9"},
            //   {name: "right_set_0"},
            //   {name: "right_set_1"},
            //   {name: "right_set_2"},
            //   {name: "right_set_3"},
            //   {name: "right_set_4"},
            //   {name: "right_set_5"},
            //   {name: "right_set_6"},
            //   {name: "right_set_7"},
            //   {name: "right_set_8"},
            //   {name: "right_set_9"},
            // ],


            this.drawsankey_inside(nodes_inside,links_inside,arr_left,Dict_inside);
            // console.log("Set_positive Done!")
        },
        async sampleDetails() {
            let selectsampleDetails = this.selectsampleDetails;
            console.log(selectsampleDetails);
            let sampleDetails_set = this.sampleDetails_set;
            let sampleDetails_ = await HttpHelper.axiosPost("/euro/sampleDetails",JSON.stringify(selectsampleDetails));
            console.log(sampleDetails_);
            let feature_Data_values_pos_left = [];
            let feature_Data_values_pos_right = [];
            if (selectsampleDetails[0] == "right") {
            // that.feature_all.forEach(function(){})
            // for (let i = 0; i < this.feature_all.length; i++) {
            //   // text += cars[i] + "<br>";
            //   // if (i == 0 )
            //   //   feature_Data_value.push({"feature":that.feature_all[i],"value":d.feature[i],"name":d.name})
            //   // else
            //   feature_Data_values_pos_right.push({"feature2":this.feature_all[i],"value2":sampleDetails_[i]})
            // }
            // sampleDetails_.forEach(function(item){

            // })

                for (var key in sampleDetails_) {
                    var item = sampleDetails_[key];
                    feature_Data_values_pos_right.push({"feature2":key,"value2":item});
                // 　　console.log(item); //AA,BB,CC,DD

                }
                this.feature_Data_values_pos_right = feature_Data_values_pos_right;
                sampleDetails_set[1] = selectsampleDetails[1];


            // console.log(d.feature)
            // console.log(that.feature_all)
            }
            else if (selectsampleDetails[0] == "left") {
                for (var key in sampleDetails_) {
                    var item = sampleDetails_[key];
                    feature_Data_values_pos_left.push({"feature2":key,"value2":item});
                }
                // 　　console.log(item); //AA,BB,CC,DD

                // for (let i = 0; i < this.feature_select_all.length; i++) {
                //   // text += cars[i] + "<br>";
                //   feature_Data_values_pos_left.push({"feature2":this.feature_select_all[i],"value2":sampleDetails_[i]})
                // }
                this.feature_Data_values_pos_left = feature_Data_values_pos_left;
                sampleDetails_set[0] = selectsampleDetails[1];
            // feature_Data_value.push({"feature":that.feature_all,"value":d.feature})
            // console.log(d.feature)
            // console.log(that.feature_select_all)
            }
            console.log(sampleDetails_set);
            this.sampleDetails_set = sampleDetails_set;


            // console.log(feature_Data_values_pos_left)
        },
        async setDetails() {
            // let connects = [38,534]
            let connects = this.sampleDetails_set;
            console.log(connects);
            let connects_ = await HttpHelper.axiosPost("/euro/connect",JSON.stringify(connects));
            function findKey(obj, value, compare = (a, b) => a === b) {
                return Object.keys(obj).find(k => compare(obj[k], value));
            }
            let path_new = {"source":parseInt(findKey(this.Dict_inside,connects[0])),"target":parseInt(findKey(this.Dict_inside,connects[1])),"value":1};
            this.links_inside.push(path_new);
            d3.select("#sankey").selectAll(".in").remove();
            this.drawsankey_inside(this.nodes_inside,this.links_inside,this.arr_left,this.Dict_inside);
            console.log(connects_);
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        expandChange(row,index,e){
            this.$refs.feature_table.toggleRowExpansion(row);
        },
        expandChange2(row,index,e){
            this.$refs.feature_table_pos_left.toggleRowExpansion(row,true);
        },
        async getPreprojection(){
            this.loading4 = true
            let preprojection = await HttpHelper.axiosGet("/euro/getPreProjection");
            this.preprojection = preprojection;
            this.drawlasso();
            this.loading4 = false
        },
        drawlasso() {
            var c_y = 250;
            var c_x = 250;
            var r = 150;
            let r_out = 215;
            let that = this;
            // var tsne_data =  this.tsne_data

            let projection = this.preprojection;
            let feature_select_all = this.feature_select_all;
            // console.log(projection)
            // var svg_width = document.getElementById("Svglasso").clientWidth
            // var svg_height = document.getElementById("Svglasso").clientHeight
            // d3.select("#Svglasso> *").remove();
            var svg = d3.select("#Svglasso").select("svg");
            // .append("svg")
            // .attr("width", svg_width)
            // .attr("height", svg_height)
            svg.selectAll(".circles_grey").remove();
            svg.append("circle")
                .attr("cx", c_x)
                .attr("cy", c_y)
                .attr("r", r)
                .attr("fill", "none")
                .attr('stroke', "#BFBFBF")
                .attr("stroke-width", 5);
            // svg.append("circle").attr("cx",20).attr("cy",20).attr("r", 5).style("fill", "none").style("stroke", "#b39ddb").style("stroke-width", 3.5).style("stroke-opacity", 0.4)
            // svg.append("circle").attr("cx",20).attr("cy",40).attr("r", 5).style("fill", "none").style("stroke", "#90caf9").style("stroke-width", 3.5).style("stroke-opacity", 0.4)
            // svg.append("text").attr("x", 35).attr("y", 20).text("first").style("font-size", "14px").attr("alignment-baseline","middle").attr("font-family", "noto-black").style("fill", "#aaaaaa")
            // svg.append("text").attr("x", 35).attr("y", 40).text("second").style("font-size", "14px").attr("alignment-baseline","middle").attr("font-family", "noto-black").style("fill", "#aaaaaa")




            // .append("circle")
            // .attr("cx", 200)
            // .attr("cy", 200)
            var x_y = [];
            var tsne_data = [];
            projection.forEach(d => {
            // console.log(d.value)
                let radian = d.value*Math.PI;
                let x = c_x + Math.cos(radian)*r;
                let y = c_y + Math.sin(radian)*r;
                let z_x = c_x + Math.cos(radian)*r_out;
                let z_y = c_y + Math.sin(radian)*r_out;
                x_y.push({"name":d.name,"ax":x,"ay":y,"z_x":z_x,"z_y":z_y,"radian":radian});
                // tsne_data.push({"name":d.name,"x":d.pca[0],"y":d.pca[1],"feature":d.raw})
                tsne_data.push({"name":d.name,"x":d.pca[0],"y":d.pca[1],"feature":d.raw});
            });
            // console.log(x_y);
            // console.log(tsne_data);

            // init_data
            // tsne_data.forEach(function (item) {
            //   item.name ="semi_0"
            //   // feature.push(item.feature)
            //   // console.log(item);

            // });
            // initial data
            this.tsne_data = tsne_data;
            var x_scale = d3.scaleLinear()
                .domain(d3.extent(tsne_data, d => d.x))
                .range([10, 208 - 10]);
            var y_scale = d3.scaleLinear()
                .domain(d3.extent(tsne_data, d => d.y))
                .range([10, 208 - 10]);
            var gg = svg.append("g");
            // .attr("width", svg_width/3)
            // .attr("height", svg_height/3)

            gg.append("rect")
                .attr("width", 1.3*160)
                .attr("height", 1.3*160)
                .attr("transform", "translate(146, 220)")
                .attr("fill", "none")
                .attr('stroke', "#BFBFBF")
                .attr("stroke-width", 0);

            // adjust tsne_data
            // const feature_list = d3.select("#feature_list");
            var center_x_y = gg.selectAll("ellipse")
                .data(tsne_data)
                .enter()
                .append("ellipse")
                .attr("cx", d => x_scale(d.x))
                .attr("cy", d => y_scale(d.y))
                .attr("name",d=> d.name)
                .attr("feature",d=>d.feature)
            // .attr("cx", c_x)
            // .attr("cy", c_y)
                .attr("rx", 4)
                .attr("ry", 4)
                .attr("transform", "translate(146, 145)")
                .attr("fill", "#BFBFBF")
            // .attr('stroke', "#BFBFBF")
            // .attr("stroke-width", 1)
                .attr("fill-opacity", function(d, i){ if (i%2==0)return 0.4; else return 0;})

                .on("click", function(d) {
                    let name = d.name;
                    let type = name.split("_")[0];

                    let feature_Data_value = [];
                    if (type == "full") {
                        // that.feature_all.forEach(function(){})
                        // for (let i = 0; i < that.feature_all.length; i++) {
                        //   // text += cars[i] + "<br>";
                        //   if (i == 0 )
                        //     feature_Data_value.push({"feature":that.feature_all[i],"value":d.feature[i],"name":d.name})
                        //   else
                        //     feature_Data_value.push({"feature":that.feature_all[i],"value":d.feature[i]})
                        // }
                        for (var key in d.feature) {
                            var item = d.feature[key];
                            feature_Data_value.push({"feature":key,"value":item});

                        }
                        // console.log(d.feature)
                        // console.log(that.feature_all)
                    }
                    else {
                        for (var key in d.feature) {
                            var item = d.feature[key];
                            feature_Data_value.push({"feature":key,"value":item});

                        }

                        // for (let i = 0; i < that.feature_select_all.length; i++) {
                        //   // text += cars[i] + "<br>";
                        //   feature_Data_value.push({"feature":that.feature_select_all[i],"value":d.feature[i]})
                        // }
                        // feature_Data_value.push({"feature":that.feature_all,"value":d.feature})
                        // console.log(d.feature)
                        // console.log(that.feature_select_all)
                    }
                    console.log(feature_Data_value);
                    that.feature_Data_value = feature_Data_value;
                    // feature_list
                    // console.log("1")

                    // that.feature_Data_value = d.feature
                    // let feature_accord = []


                    // console.log(d.feature)
                    // feature_list.select("text")
                    //   .attr("x", 10)
                    //   .attr("y", 20)
                    //   .attr("fill", "#BFBFBF")
                    //   .text(d.feature)
                    console.log("2");
                // feature_list.select("text")
                //           .attr("x", 10)
                //           .attr("y", 20)
                //           .attr("fill", "#BFBFBF")
                //           .text(d.feature)
                })
                .on("mouseover", function (d) {

                    // d3.select(this)
                    //     .attr("r", 10)
                    //     .attr("fill-opacity", 1)

                    svg.append("text")
                        .attr("x", 20)
                        .attr("y", 450)
                        .attr("fill", "#BFBFBF")
                        .attr("class","center_x_y_text")
                        .text(d3.select(this).attr("name"));

                    // console.log(feature_select_all)

                    // console.log(d3.select(this))

                })
                .on("mouseout", function () {
                // d3.select(this)
                //     .attr("r", 7)
                //     .attr("fill-opacity", 0.5)

                    svg.select(".center_x_y_text").remove();
                // feature_list.select("text").text("")
                // feature_list.append("text")
                //             .attr("x", 10)
                //             .attr("y", 20)
                //             .attr("fill", "#BFBFBF")

                });



            function compute_name(a) {
            // if
                var type = a.split("_")[0];
                if (type == "full")
                    return "#ef9a9a";
                else
                    return  "#80cbc4";
            }
            var circles_on = svg.append("g")
                .selectAll('points')
                .data(x_y)
                .enter()
                .append("circle")
                .attr("cx", d => d.ax)
                .attr("cy", d => d.ay)
                .attr("name",d=>d.name)
                .attr("r", 7)
                .attr('fill', function(d, i){ return compute_name(d.name);})
            // .attr("stroke-width", 0.5)
                .attr("fill-opacity", 0.5)
            // .attr("fill", d=>color(d))
            // .attr("stroke-width", 1)
            // .on("click", d => {
            //     // console.log(d.name)
            // })
                .on("mouseover", function (d) {

                    // d3.select(this)
                    // .attr("r", 10)
                    // .attr("fill-opacity", 1)

                    svg.append("text")
                        .attr("x", 20)
                        .attr("y", 450)
                        .attr("fill", "#BFBFBF")
                        .attr("class","circles_on_text")
                        .text(d3.select(this).attr("name"));
                    // console.log(d3.select(this))

                })
                .on("mouseout", function () {
                    // d3.select(this)
                    // .attr("r", 7)
                    // .attr("fill-opacity", 0.5)

                    svg.select(".circles_on_text").remove();

                });

            var circles_in = svg.append('g')
                .selectAll('points')
                .data(x_y)
                .enter()
                .append("circle")
                .attr("cx",d=>d.ax)
                .attr("cy",d=>d.ay)
                .attr("name",d=>d.name)
                .attr("r", 7)
                .attr('fill', function(d, i){ return compute_name(d.name);})
            // .attr("stroke-width", 0.5)
                .attr("fill-opacity", 0.5)
            // .on("click", d => {
            //   console.log(d.name)

            // })
                .on("mouseover", function (d) {

                    d3.select(this);
                    // .attr("r", 10)
                    // .attr("fill-opacity", 1)

                    svg.append("text")
                        .attr("x", 20)
                        .attr("y", 450)
                        .attr("fill", "#BFBFBF")
                        .attr("class","circles_in_text")
                        .text(d3.select(this).attr("name"));
                    // console.log(d3.select(this))

                })
                .on("mouseout", function () {
                    // d3.select(this)
                    // .attr("r", 7)
                    // .attr("fill-opacity", 0.5)

                    svg.select(".circles_in_text").remove();

                });



            this.circles_in = circles_in;

            let _opacity;
            if(projection.length>10000)
              _opacity = 0.1;
            else
              _opacity = 1.0;
            var lines = svg.append("g").attr("stroke-opacity",String(_opacity));
            var arcs = svg.append("g");
            var distribution_selects = svg.append("g");
            // add lasso
            var lasso_start = function() {
            // that.init_mean_var()
                console.log('start');

                // console.log("1");
                // center_x_y.selectAll("ellipse").on("click", d => {
                //   // feature_list
                //   // console.log(d.feature)

                //   // that.feature_Data_value = d.feature
                //   console.log(feature_select_all)
                //   // console.log(feature_select_all)
                //   // feature_list.select("text")
                //   //   .attr("x", 10)
                //   //   .attr("y", 20)
                //   //   .attr("fill", "#BFBFBF")
                //   //   .text(d.feature)
                //   // console.log(d.raw)
                //   // feature_list.select("text")
                //   //           .attr("x", 10)
                //   //           .attr("y", 20)
                //   //           .attr("fill", "#BFBFBF")
                //   //           .text(d.feature)
                // })
                // console.log("2")
                // d3.select("#lines").remove();
                lines.selectAll("path").remove();
                arcs.selectAll(".preview_new").remove();
                arcs.selectAll(".preview_new_in").remove();
                distribution_selects.selectAll(".distribution_select").remove();
                // svg.select(".var").remove()
                // svg.select(".mean").remove()
                // attr("class","hidden");

                center_x_y._groups[0].forEach(function (item1) {
                    // if ( select_sample.indexOf(item1.getAttribute("name")) != -1) {
                    item1.setAttribute("fill","#BFBFBF");
                    // }
                });

                circles_in.attr("r",7);
                lasso.items()
                    .attr("r",7)
                    .attr("cx",d=>d.ax)
                    .attr("cy",d=>d.ay)
                    .classed("not_possible",true)
                    .classed("selected",false);
            };
            var lasso_draw = function() {
            // circles_in.attr("r",7)
                console.log('draw');
                lasso.possibleItems()
                    .classed("not_possible",false)
                    .classed("possible",true);
                lasso.notPossibleItems()
                    .classed("not_possible",true)
                    .classed("possible",false);
            };
            var lasso_end = function() {
                console.log('end');
                lasso.items()
                    .classed("not_possible",false)
                    .classed("possible",false);
                lasso.selectedItems()
                    .classed("selected",true);
                // .attr("r",15);

                let select_data = lasso.selectedItems()._groups[0];
                // console.log(select_data)
                let select_sample = [];
                let select_sample_radian = [];
                let select_sample_x_y = [];
                select_data.forEach(function (item) {
                    // console.log(item.__data__)
                    select_sample.push(item.__data__.name);
                    select_sample_radian.push(item.__data__.radian);
                    select_sample_x_y.push({"name":item.__data__.name,"x":item.__data__.ax,"y":item.__data__.ay});
                    // console.log()
                    // console.log(item)
                });

                that.select_sample = select_sample;

                console.log(select_sample.length);
                if (select_sample.length != 0) {
                    that.get_lasso();
                    console.log(select_sample.length);
                    svg.select(".var1").remove();
                    svg.select(".mean1").remove();
                }
                // console.log("333")


                // var svg = d3.select("#Svglasso").select("svg")

                // console.log(select_sample);
                // console.log(select_sample_radian);

                // let radian = d.value*Math.PI
                // let x = c_x + Math.cos(radian)*r;
                // let y = c_y + Math.sin(radian)*r;
                // let z_x = c_x + Math.cos(radian)*r_out;
                // let z_y = c_y + Math.sin(radian)*r_out;
                let _median = arr => {
                    arr.sort((a, b) => {
                        if (a < b) return -1;
                        if (a > b) return 1;
                        return 0;
                    });
                    //求中位数
                    if (arr.length % 2 == 0) {
                        return (arr[arr.length / 2 - 1] + arr[arr.length / 2]) / 2;
                    } else {
                        return arr[Math.floor(arr.length / 2)];
                    }
                };
                function avg(array) {
                    var sum = 0;
                    for (var i = 0, j = array.length; i < j; i++) {
                        sum += array[i];
                    }
                    return sum / array.length;
                }
                console.log(avg(select_sample_radian));
                console.log(d3.min(select_sample_radian));
                console.log(d3.max(select_sample_radian));

                var Scale = d3.scaleLinear()
                    .domain([d3.min(select_sample_radian),d3.max(select_sample_radian)])
                // .range([avg(select_sample_radian)-Math.PI*0.5,avg(select_sample_radian)+Math.PI*0.5]);
                    .range([avg(select_sample_radian),avg(select_sample_radian)+Math.PI]);
                // console.log(select_sample_radian);
                // console.log(select_sample);
                let select_sample_radian_new = [];
                for (var i = 0;i < select_sample_radian.length; i++) {

                    select_sample_radian_new.push(Scale(select_sample_radian[i]));
                }
                // select_sample_radian_new(Scale(select_sample_radian[i]));
                function arcs_out() {

                    console.log("select_sample_radian");
                    console.log(select_sample_radian);
                    var dataset = [
                        // { startAngle: 0 , endAngle: Math.PI * 2 },
                        Math.PI * 0.5,
                        Math.PI * 1.5,
                        Math.PI * 1.7,
                        // { startAngle: select_sample_radian[0], endAngle: select_sample_radian[1]},
                    ];
                    for (var i = 0;i < select_sample_radian.length; i++) {

                        var outerRadius = 200 ;
                        var innerRadius = 190 ;
                        var arc = d3.arc()
                            .innerRadius(innerRadius)
                            .outerRadius(outerRadius)
                            .startAngle(Scale(select_sample_radian[i]))
                            .endAngle(Scale(select_sample_radian[i]));
                        var arc_in = d3.arc()
                            .innerRadius(190)
                            .outerRadius(180)
                            .startAngle(Scale(select_sample_radian[i]))
                            .endAngle(Scale(select_sample_radian[i]));



                        // console.log()
                        // svg.selectAll("path")
                        // arcs.data(dataset)
                        //     .enter()
                        arcs.append("path")
                            .attr("d",arc)
                        // .attr("transform","translate(250,250)")
                            .attr("transform","translate("+c_x+","+c_y+")")
                        // .attr("fill","#90caf9")
                        // .attr("stroke", "#90caf9")
                        // .attr("stroke",that.arc_out_color)
                            .attr("stroke",compute_name(select_sample[i]))

                            .attr("stroke-width", "2")
                            .attr("name",select_sample[i])

                            .attr("class","preview_new")
                            .attr("stroke-opacity",0.6)
                            .on("mouseover", function (d) {

                                // d3.select(this)
                                // .attr("r", 10)
                                // .attr("fill-opacity", 1)

                                svg.append("text")
                                    .attr("x", 20)
                                    .attr("y", 450)
                                    .attr("fill", "#BFBFBF")
                                    .attr("class","arcs_out")
                                    .text(d3.select(this).attr("name"));
                                // console.log(d3.select(this))

                            })
                            .on("mouseout", function () {
                                // d3.select(this)
                            // .attr("r", 7)
                            // .attr("fill-opacity", 0.5)

                                svg.select(".arcs_out").remove();

                            });
                        arcs.append("path")
                            .attr("d",arc_in)
                        // .attr("transform","translate(250,250)")
                            .attr("transform","translate("+c_x+","+c_y+")")
                        // .attr("fill","#90caf9")
                            .attr("stroke", "none")
                            .attr("stroke-width", "2")
                            .attr("name",select_sample[i])

                            .attr("class","preview_new_in")
                            .attr("stroke-opacity",0.6)
                            .on("mouseover", function (d) {

                                // d3.select(this)
                                // .attr("r", 10)
                                // .attr("fill-opacity", 1)

                                // svg.append("text")
                                //     .attr("x", 20)
                                //     .attr("y", 470)
                                //     .attr("fill", "#BFBFBF")
                                //     .attr("class","arcs_in")
                                //     .text(d3.select(this).attr("name"))
                                // console.log(d3.select(this))

                            })
                            .on("mouseout", function () {
                            // d3.select(this)
                                // .attr("r", 7)
                                // .attr("fill-opacity", 0.5)

                            // svg.select(".arcs_in").remove()

                            });

                        // svg.append("line")
                        //     .attr("stroke",function(d,i){
                        //       return color(i);
                        //     })
                        //     .attr("x1",arc.centroid()[0]
                        //     )
                        //     .attr("y1",arc.centroid()[1]
                        //     )
                        //     .attr("transform","translate(250,250)")
                        //     .attr("fill","red")
                        //     .attr("x2",arc.centroid()[0]*(outerRadius+1)/outerRadius
                        //     )
                        //     .attr("y2",arc.centroid()[1]*(outerRadius+1)/outerRadius
                        //     )
                        //     // .attr("stroke-width", outerRadius*(Scale(select_sample_radian[i])-Scale(select_sample_radian[i]))
                        //     // )
                        //     .attr("stroke-width", outerRadius*(10)
                        //     )
                        // console.log(arcs)
                        // arcs_out()
                        // console.log("select_sample_radian")
                    }

                }
                arcs_out();
                console.log("444");
                console.log([d3.min(select_sample_radian_new),d3.max(select_sample_radian_new)]);
                let thresholds_arr = [];
                for (var i = 0;i < Math.PI; i = i+Math.PI/180) {
                    thresholds_arr.push(d3.min(select_sample_radian_new)+i);
                }
                // console.log(thresholds_arr);
                var partition = d3.histogram().domain([d3.min(select_sample_radian_new),d3.max(select_sample_radian_new)]).thresholds(thresholds_arr);
                // .range([0,100])
                // .bins(10)
                // .frequency(true)

                var data_new1 = partition(select_sample_radian_new);
                let distirbution_selected = [];
                data_new1.forEach(function(item){
                    let avg_each = (item.x0+item.x1)/2;
                    // console.log(item.length,avg_each)
                    distirbution_selected.push([avg_each,item.length]);
                });
                // console.log("distirbution_selected");
                // console.log(distirbution_selected);
                let distirbution_selected_path = [];
                if (select_sample_radian.length != 0 ) {
                    var Scale_new = d3.scaleLinear()
                        .domain([d3.min(select_sample_radian_new),d3.max(select_sample_radian_new)])
                    // .range([avg(select_sample_radian)-Math.PI*0.5,avg(select_sample_radian)+Math.PI*0.5]);
                        .range([avg(select_sample_radian),avg(select_sample_radian)+Math.PI]);

                    for (var i = 0;i < distirbution_selected.length; i = i+1) {

                        let r_out_new = 205;
                        let radian_each = (distirbution_selected[i][0]);
                        // let cx_height;

                        if (distirbution_selected[i][1]>=25)
                            r_out_new = r_out_new + 25;
                        else
                            r_out_new = r_out_new+distirbution_selected[i][1];
                        // let cy = (distirbution_selected[i][0])
                        let cx = c_x + Math.cos(Scale_new(radian_each)+1.5*Math.PI)*r_out;
                        let cy = c_y + Math.sin(Scale_new(radian_each)+1.5*Math.PI)*r_out;
                        let cx_height = c_x + Math.cos(radian_each+1.5*Math.PI)*r_out_new;
                        let cy_height = c_y + Math.sin(radian_each+1.5*Math.PI)*r_out_new;
                        // if (cy_height>=20)

                        if (distirbution_selected[i][1] !=0 ) {
                            distirbution_selected_path.push([cx_height,cy_height]);
                            distribution_selects.append("circle")
                                .attr("stroke",function(d,i){
                                    return color(i);
                                })
                            // .attr("x1",arc.centroid()[0]
                            // )
                            // .attr("y1",arc.centroid()[1]
                            // )
                            // .attr("transform","translate(250,250)")
                                .attr("fill","#b39ddb")
                                .attr("fill-opacity",0.7)
                            // .attr("cx",cx)
                            // .attr("cy",cy)
                                .attr("cx",cx_height)
                                .attr("cy",cy_height)
                                .attr("r",2)
                                .attr("class","distribution_select");

                        }


                    // .attr("stroke-width", outerRadius*(Scale(select_sample_radian[i])-Scale(select_sample_radian[i]))
                    // )
                    // .attr("stroke-width", r_out*(10)
                    // )
                    }
                }
                var linePath = d3.line().curve(d3.curveCatmullRom);
                // curveCardinal
                // curveMonotoneX
                // curveCatmullRom
                // curveNatural
                // let distirbution_selected_path.forEach(function (item) {
                lines.append("path")
                    .attr("d",linePath(distirbution_selected_path))      //使用了线段生成器
                    .attr("stroke","#90caf9")         //线的颜色
                    .attr("stroke-width",1)     //线的宽度
                    .attr("fill","none")
                    ;            //填充颜色为none
                // .attr("fill-opacity", 0.5)
                // })

                // var x = d3.scaleLinear()
                //       .domain([0, 10])
                //       .range([0, 300]);
                // console.log(x.ticks(10));


                // var data = [1,2,3,4,5,6,7,8,9];

                // var histogram = d3.histogram().domain([d3.min(data),d3.max(data)]).thresholds([1,3,7,9]);
                // var bins = histogram(data);
                // console.log(bins)

                // console.log(data_new1)
                console.log("55");

                Scale = d3.scaleLinear()
                    .domain([d3.min(select_sample_radian),d3.max(select_sample_radian)])
                    .range([avg(select_sample_radian)-Math.PI*0.5,avg(select_sample_radian)+Math.PI*0.5]);
                function handle_select_sample () {


                    ///  1.0_circles
                    function circles_out_hide() {
                        lasso.selectedItems()
                            .classed("selected",true)
                            .attr("cx",d=>c_x + Math.cos(Scale(d.radian))*r_out)
                            .attr("cy",d=>c_y + Math.sin(Scale(d.radian))*r_out);
                        // console.log(lasso.selectedItems()._groups[0][0]);
                        // circles_in.attr("r",15)
                        // console.log(select_sample);
                        circles_in._groups[0].forEach(function (item) {
                            // console.log(select_sample)
                            // console.log(item.getAttribute("name"))
                            if ( select_sample.indexOf(item.getAttribute("name")) != -1) {
                                // console.log(item.getAttribute("name"));
                                item.setAttribute("r","10");
                            }
                        });
                    }
                    // circles_out_hide()
                    // console.log(lasso.selectedItems());
                    // .classed("selected",true)
                    // .attr("cx",d=>c_x + Math.cos(Scale(d.radian))*r_out)
                    // .attr("cy",d=>c_y + Math.sin(Scale(d.radian))*r_out);

                    // circles out hide


                    // path generator
                    let center_x_y_name = [];
                    center_x_y._groups[0].forEach(function (item) {
                        center_x_y_name.push({"name":item.getAttribute("name"),"x":+item.getAttribute("cx")+146,"y":+item.getAttribute("cy")+145});
                    });
                    center_x_y._groups[0].forEach(function (item1) {
                        if ( select_sample.indexOf(item1.getAttribute("name")) != -1) {
                            item1.setAttribute("fill","#90caf9");
                        }
                    });

                    // console.log(select_sample_x_y)

                    // console.log(center_x_y_name);

                    // var gg = svg.append("g")

                    var path_connect = [];
                    select_sample_x_y.forEach(function (item1) {
                        center_x_y_name.forEach(function (item2) {
                            if (item2.name == item1.name)
                            {
                                // item2.x
                                path_connect.push([[item1.x,item1.y],[item2.x,item2.y]]);
                            }
                        });

                        // if ( select_sample.indexOf(item.name) != -1) {
                        //   console.log(item.getAttribute("name"))
                        //   item.setAttribute("r","10")
                        // }
                    });
                    // console.log(path_connect);
                    var linePath = d3.line();
                    var path_len = path_connect.length;
                    path_connect.forEach(function (item) {
                        lines.append("path")
                            .attr("d",linePath(item))      //使用了线段生成器
                            .attr("stroke","#BFBFBF")         //线的颜色
                            .attr("stroke-width",
                                function(){
                                    if (path_len<=10) return 0.7;
                                    else return 0.1;})     //线的宽度
                            .attr("fill","none")

                            ;            //填充颜色为none
                        // .attr("fill-opacity", 0.5)
                    });


                    // that.select_sample{}

                    // console.log(circles_in._groups[0][0].getAttribute("name"))

                }
                handle_select_sample();
                // that.$root.Bus.$emit('neg_sample', JSON.parse(JSON.stringify(select_sample)));
                lasso.notSelectedItems()
                    .attr("r",7);
            };

            var lasso = d3lasso.lasso()
                .closePathDistance(350) // max distance for the lasso loop to be closed
                .closePathSelect(true) // can items be selected by closing the path?
                .hoverSelect(true) // can items by selected by hovering over them?
                .items(circles_on)
                .targetArea(svg)
                .on("start", lasso_start) // lasso start function
                .on("draw", lasso_draw) // lasso draw function
                .on("end", lasso_end); // lasso end function

            svg.call(lasso);
        },
        async applyNeg() {
            let that = this;
            let select_sample = this.select_sample;
            console.log(select_sample);
            let array = this.$refs.multipleTable.selection;
            let neg_st = [];
            array.forEach(d => {
                neg_st.push({"strategy":d.s,"value":d.pp,"m":this.m_para});
            });
            let neg = {"neg_st":neg_st[0],"neg_sample":select_sample};
            console.log(neg);
            let applysamples = await HttpHelper.axiosPost("/euro/applyNegative",JSON.stringify(neg));
            console.log(applysamples);

            console.log("apply_negative Done!");
            function circles_out() {
                let selected = d3.select("#Svglasso").selectAll(".selected");
                console.log(selected);
                // var circles_in = this.circles_in;
                selected._groups[0].forEach(function (item) {
                    // console.log(select_sample)
                    // console.log(item.getAttribute("name"))
                    if ( applysamples.indexOf(item.getAttribute("name")) != -1) {
                        // console.log(item.getAttribute("name"))
                        item.setAttribute("r","15");
                        // item.setAttribute("transform","translate(0,20)")

                    }
                    // console.log(item)
                });
            }
            // circles_out()
            let preview_new_selected = d3.select("#Svglasso").selectAll(".preview_new");
            let preview_new_in_selected = d3.select("#Svglasso").selectAll(".preview_new_in");
            console.log(preview_new_selected);
            // var circles_in = this.circles_in;
            preview_new_selected._groups[0].forEach(function (item) {
            // console.log(select_sample)
            // console.log(item.getAttribute("name"))
                if ( applysamples.indexOf(item.getAttribute("name")) != -1) {
                    // console.log(item.getAttribute("name"))
                    // item.setAttribute("stroke","red")
                    // item.setAttribute("stroke","none")
                    // item.setAttribute("stroke",'#34495e')
                    console.log(item);
                    // item.setAttribute("transform","translate(0,20)")

                }
            // console.log(item)
            });
            preview_new_in_selected._groups[0].forEach(function (item) {
            // console.log(select_sample)
            // console.log(item.getAttribute("name"))
                if ( applysamples.indexOf(item.getAttribute("name")) != -1) {
                    // console.log(item.getAttribute("name"))
                    // item.setAttribute("stroke","red")
                    // item.setAttribute("stroke",'#95a5a6')
                    item.setAttribute("stroke",that.arc_apply_color);

                    console.log(item);
                    // item.setAttribute("transform","translate(0,20)")

                }
            // console.log(item)
            });

            // .attr("stroke-width",function(d){
            //   return outerRadius*(d.endAngle-d.startAngle);
            // })




        },
        async drawlasso_() {
            let that = this;
            var x_y = [];
            var c_x = 110;
            var c_x_2 = 310;
            var c_y = 160;
            var cr = 70;//90;
            var cr2 = 70;//90;
            // var tsne_data =  this.tsne_data

            // let projection = this.projection
            let projection = await HttpHelper.axiosGet("/euro/getProjection");
            console.log(projection);
            if (this.status_lasso_ == 1) {
                console.log(this.status_lasso_);
                var svg_width = document.getElementById("lasso_").clientWidth;
                var svg_height = document.getElementById("lasso_").clientHeight;
                d3.select("#lasso_> *").remove();

                var svg = d3.select("#lasso_")
                    .append("svg")
                    .attr("width", svg_width)
                    .attr("height", svg_height);
                // legend
                svg.append("circle").attr("cx",20).attr("cy",20).attr("r", 5).style("fill", "none").style("stroke", "#b39ddb").style("stroke-width", 3.5).style("stroke-opacity", 0.4);
                svg.append("circle").attr("cx",20).attr("cy",40).attr("r", 5).style("fill", "none").style("stroke", "#90caf9").style("stroke-width", 3.5).style("stroke-opacity", 0.4);
                svg.append("text").attr("x", 35).attr("y", 20).text("first").style("font-size", "14px").attr("alignment-baseline","middle").attr("font-family", "noto-black").style("fill", "#aaaaaa");
                svg.append("text").attr("x", 35).attr("y", 40).text("second").style("font-size", "14px").attr("alignment-baseline","middle").attr("font-family", "noto-black").style("fill", "#aaaaaa");
                svg.append("circle").attr("cx",400).attr("cy",20).attr("r", 6).style("fill", "#ef9a9a").style("fill-opacity", 0.5);
                svg.append("circle").attr("cx",400).attr("cy",40).attr("r", 6).style("fill", "#80cbc4").style("fill-opacity", 0.5);
                svg.append("text").attr("x", 365).attr("y",20).text("full").style("font-size", "14px").attr("alignment-baseline","middle").attr("font-family", "noto-black").style("fill", "#aaaaaa");
                svg.append("text").attr("x", 355).attr("y",40).text("semi").style("font-size", "14px").attr("alignment-baseline","middle").attr("font-family", "noto-black").style("fill", "#aaaaaa");

                function compute_name(a) {
                    // if
                    var type = a.split("_")[0];
                    if (type == "full")
                        return "#ef9a9a";
                    else
                        return  "#80cbc4";
                }


                projection.forEach(d => {
                    // console.log(d.value)
                    let radian = d.value*Math.PI;
                    let x = c_x + Math.cos(radian)*cr;
                    let y = c_y + Math.sin(radian)*cr;
                    x_y.push({"name":d.name,"ax":x,"ay":y});
                });
                this.status_lasso_ = 0;
            }
            else {

                var svg =d3.select("#lasso_").select("svg");

                svg.selectAll(".lasso_cc").remove();
                // cr = cr2
                projection.forEach(d => {
                    // console.log(d.value)
                    let cr = cr2;
                    let radian = d.value*Math.PI;
                    let x = c_x_2 + Math.cos(radian)*cr;
                    let y = c_y + Math.sin(radian)*cr;
                    x_y.push({"name":d.name,"ax":x,"ay":y});
                });
            }
            console.log(x_y);

            svg.append("circle")
                .attr("cx", c_x)
                .attr("cy", c_y)
                .attr("r", cr)
                .attr("fill", "none")
            // .attr('stroke', "#BFBFBF")
                .attr('stroke',  '#b39ddb')
                .attr("stroke-width", 5)
                .attr("stroke-opacity",0.4)
                .attr("class","lasso_cc");
            svg.append("circle")
                .attr("cx", c_x_2)
                .attr("cy", c_y)
                .attr("r", cr2)
                .attr("fill", "none")
                .attr('stroke',"#90caf9")
                .attr("stroke-width", 5)
                .attr("stroke-opacity",0.4)
                .attr("class","lasso_cc");



            var color = d3.scaleOrdinal(d3.schemeCategory10); // 定义一个10种颜色的比例尺


            // var x_scale = d3.scaleLinear()
            //       .domain(d3.extent(tsne_data, d => d.x))
            //       .range([10, svg_width - 10])
            // var y_scale = d3.scaleLinear()
            //     .domain(d3.extent(tsne_data, d => d.y))
            //     .range([10, svg_height - 10])



            // .append("rect")
            // .attr("width", svg_width)
            // .attr("height", svg_height)
            var line_generator = d3.line()
                .x(d => x_scale(d.x))
                .y(d => y_scale(d.y));

            // svg.append("path")
            //     .attr("d", line_generator(tsne_data))
            //     .attr("stroke", "#BFBFBF")
            //     .attr("stroke-width", 1)
            //     .attr("fill", "none")

            // color scale
            function compute_name(a) {
            // if
                var type = a.split("_")[0];
                if (type == "full")
                    return "#ef9a9a";
                else
                    return  "#80cbc4";
            }
            var circles_on = svg.append("g")
                .selectAll('points')
                .data(x_y)
                .enter()
                .append("circle")
                .attr("cx", d => d.ax)
                .attr("cy", d => d.ay)
                .attr("name",d=>d.name)
                .attr("r", 7)
                .attr('fill', function(d, i){ return compute_name(d.name); })
                .attr("stroke-width", 1)
            // .attr("fill", d=>color(d))
                .attr("stroke-width", 1)
                .attr("fill-opacity", 0.5)
                .on("click", d => {
                    console.log(d);
                })
                .on("mouseover", function (d) {

                    d3.select(this)
                        .attr("r", 10)
                        .attr("fill-opacity", 1);

                    svg.append("text")
                        .attr("x", c_x-22)
                        .attr("y", c_y+2)
                        .attr("fill", "#BFBFBF")
                        .attr("class","circles_on_text")
                        .text(d3.select(this).attr("name"));
                    // console.log(d3.select(this))

                })
                .on("mouseout", function () {
                    d3.select(this)
                        .attr("r", 7)
                        .attr("fill-opacity", 0.5);

                    svg.select(".circles_on_text").remove();

                });



            // var circles_in = svg.append("g")
            //     .selectAll('points')
            //     .data(tsne_data)
            //     .enter()
            //     .append("circle")
            //     .attr("cx", d => x_scale(d.x))
            //     .attr("cy", d => y_scale(d.y))
            //     .attr("sample_id", d => d.sample_id)
            //     .attr("r", (d, i) => {
            //         if (i == 0 || i == tsne_data.length - 1) {
            //             return 7
            //         }
            //         else {
            //             return 7
            //         }
            //     })
            //     .attr("fill", (d, i) => compute(linear(i)))
            //     .attr("fill-opacity", 0.2)
            //     .attr("stroke", (d, i) => {
            //         if (i == 0 || i == tsne_data.length - 1) {
            //             return "black"
            //         }
            //         else {
            //             return "none"
            //         }
            //     })
            //     .attr("stroke-width", 1)
            //     .on("click", d => {
            //         console.log(d)
            //     })
            //     .on("mouseover", function (d) {

            //         d3.select(this)
            //             .attr("r", 10)
            //             .attr("fill-opacity", 1)

            //         svg.append("text")
            //             .attr("x", 10)
            //             .attr("y", svg_height - 5)
            //             .attr("fill", "#BFBFBF")
            //             .text(d3.select(this).attr("sample_id"))
            //         // console.log(d3.select(this))

            //     })
            //     .on("mouseout", function () {
            //         d3.select(this)
            //             .attr("r", 7)
            //             .attr("fill-opacity", 0.5)

            //         svg.select("text").remove()

            //     })
            // add lasso
            var lasso_start = function() {
                console.log('start');
                lasso.items()
                // .attr("r",7)
                    .classed("not_possible",true)
                    .classed("selected",false);
            };
            var lasso_draw = function() {
                console.log('draw');
                lasso.possibleItems()
                    .classed("not_possible",false)
                    .classed("possible",true);
                lasso.notPossibleItems()
                    .classed("not_possible",true)
                    .classed("possible",false);
            };
            var lasso_end = function() {
                console.log('end');
                lasso.items()
                    .classed("not_possible",false)
                    .classed("possible",false);
                lasso.selectedItems()
                    .classed("selected",true);
                // .attr("r",15);

                let select_data = lasso.selectedItems()._groups[0];
                // console.log(select_data)
                let select_sample = [];
                select_data.forEach(function (item) {
                    select_sample.push(item.__data__.name);
                    // console.log()
                    // console.log(item)
                });

                that.select_sample = select_sample;
                console.log(select_sample);
                // that.$root.Bus.$emit('neg_sample', JSON.parse(JSON.stringify(select_sample)));
                lasso.notSelectedItems();
                // .attr("r",7);
            };

            var lasso = d3lasso.lasso()
                .closePathDistance(350) // max distance for the lasso loop to be closed
                .closePathSelect(true) // can items be selected by closing the path?
                .hoverSelect(true) // can items by selected by hovering over them?
                .items(circles_on)
                .targetArea(svg)
                .on("start", lasso_start) // lasso start function
                .on("draw", lasso_draw) // lasso draw function
                .on("end", lasso_end); // lasso end function

            // svg.call(lasso)
        },
        init_drawlasso_() {
            var c_x = 110;
            var c_x_2 = 310;
            var c_y = 160;
            var cr = 70;//90;
            var cr2 = 70;//90;
            var svg_width = document.getElementById("lasso_").clientWidth;
            var svg_height = document.getElementById("lasso_").clientHeight;
            d3.select("#lasso_> *").remove();
            var svg = d3.select("#lasso_")
                .append("svg")
                .attr("width", svg_width)
                .attr("height", svg_height);
            svg.append("circle")
                .attr("cx", c_x)
                .attr("cy", c_y)
                .attr("r", cr)
                .attr("fill", "none")
            // .attr('stroke', "#BFBFBF")
                .attr('stroke',  '#b39ddb')
                .attr("stroke-width", 5)
                .attr("stroke-opacity",0.4);
            svg.append("circle")
                .attr("cx", c_x_2)
                .attr("cy", c_y)
                .attr("r", cr2)
                .attr("fill", "none")
                .attr('stroke',"#90caf9")
                .attr("stroke-width", 5)
                .attr("stroke-opacity",0.4);


            svg.append("circle").attr("cx",20).attr("cy",20).attr("r", 5).style("fill", "none").style("stroke", "#b39ddb").style("stroke-width", 3.5).style("stroke-opacity", 0.4);
            svg.append("circle").attr("cx",20).attr("cy",40).attr("r", 5).style("fill", "none").style("stroke", "#90caf9").style("stroke-width", 3.5).style("stroke-opacity", 0.4);
            svg.append("text").attr("x", 35).attr("y", 20).text("first").style("font-size", "14px").attr("alignment-baseline","middle").attr("font-family", "noto-black").style("fill", "#aaaaaa");
            svg.append("text").attr("x", 35).attr("y", 40).text("second").style("font-size", "14px").attr("alignment-baseline","middle").attr("font-family", "noto-black").style("fill", "#aaaaaa");
            svg.append("circle").attr("cx",400).attr("cy",20).attr("r", 6).style("fill", "#ef9a9a").style("fill-opacity", 0.5);
            svg.append("circle").attr("cx",400).attr("cy",40).attr("r", 6).style("fill", "#80cbc4").style("fill-opacity", 0.5);
            svg.append("text").attr("x", 365).attr("y",20).text("full").style("font-size", "14px").attr("alignment-baseline","middle").attr("font-family", "noto-black").style("fill", "#aaaaaa");
            svg.append("text").attr("x", 355).attr("y",40).text("semi").style("font-size", "14px").attr("alignment-baseline","middle").attr("font-family", "noto-black").style("fill", "#aaaaaa");

            // "#80cbc4""#90caf9" '#b39ddb' "#ef9a9a"
        },
        init_drawlasso() {
            let that = this;
            var c_y = 250;
            var c_x = 250;
            var r = 130;//150;
            var svg_width = document.getElementById("Svglasso").clientWidth;
            var svg_height = document.getElementById("Svglasso").clientHeight;
            d3.select("#Svglasso> *").remove();
            var svg = d3.select("#Svglasso")
                .append("svg")
                .attr("width", svg_width)
                .attr("height", svg_height);
            svg.append("circle")
                .attr("cx", c_x)
                .attr("cy", c_y)
                .attr("r", r)
                .attr("fill", "none")
                .attr('stroke', "#BFBFBF")
                .attr("stroke-width", 5)
                .attr("class","circles_grey");
            svg.append("circle").attr("cx",20).attr("cy",10).attr("r", 6).style("fill", "#ef9a9a").style("fill-opacity", 0.5);
            svg.append("circle").attr("cx",70).attr("cy",10).attr("r", 6).style("fill", "#80cbc4").style("fill-opacity", 0.5);
            svg.append("text").attr("x", 30).attr("y",10).text("full").style("font-size", "14px").attr("alignment-baseline","middle").attr("font-family", "noto-black").style("fill", "#aaaaaa");
            svg.append("text").attr("x", 80).attr("y",10).text("semi").style("font-size", "14px").attr("alignment-baseline","middle").attr("font-family", "noto-black").style("fill", "#aaaaaa");


            let arc_legend_g = svg.append("g");
            var arc_legend_1 = d3.arc()
                .innerRadius(11)
                .outerRadius(11)
                .startAngle(0)
                .endAngle(Math.PI/2);
            var arc_legend_2 = d3.arc()
                .innerRadius(11)
                .outerRadius(11)
                .startAngle(Math.PI)
                .endAngle(1.5*Math.PI);

            arc_legend_g.append("path")
                .attr("d",arc_legend_1)
            // .attr("transform","translate(250,250)")
                .attr("transform","translate("+125+","+15+")")
                .attr("fill","none")
                .attr("stroke", "#ef9a9a")
                .attr("stroke-width", "2")
                .attr("stroke-opacity",0.6);
            arc_legend_g.append("path")
                .attr("d",arc_legend_2)
            // .attr("transform","translate(250,250)")
                .attr("transform","translate("+197+","+5+")")
                .attr("fill","none")
                .attr("stroke", "#80cbc4")
                .attr("stroke-width", "2")
                .attr("stroke-opacity",0.6);
            // svg.append("path").attr("cx",20).attr("cy",420).attr("r", 6).style("fill", "#ef9a9a").style("fill-opacity", 0.5)
            // svg.append("path").attr("cx",20).attr("cy",440).attr("r", 6).style("fill", "#80cbc4").style("fill-opacity", 0.5)
            arc_legend_g.append("text").attr("x", 140).attr("y",10).text("mean").style("font-size", "14px").attr("alignment-baseline","middle").attr("font-family", "noto-black").style("fill", "#aaaaaa");
            arc_legend_g.append("text").attr("x", 200).attr("y",10).text("var").style("font-size", "14px").attr("alignment-baseline","middle").attr("font-family", "noto-black").style("fill", "#aaaaaa");
            // arc_legend_g.attr("transform","translate("+400+","+-175+")")

            let arc_legend_3_arr = [2*Math.PI-0.12,2*Math.PI-0.08,2*Math.PI-0.05,2*Math.PI-0.06,2*Math.PI-0.03,2*Math.PI-0.02,2*Math.PI+0.01];
            for (var j=0;j<arc_legend_3_arr.length;j++){
                var arc_legend_3 = d3.arc()
                    .innerRadius(120)
                    .outerRadius(120)
                    .startAngle(arc_legend_3_arr[j]+0.01)
                    .endAngle(arc_legend_3_arr[j]);
                arc_legend_g.append("path")
                    .attr("d",arc_legend_3)
                    // .attr("transform","translate(250,250)")
                    .attr("transform","translate("+250+","+130+")")
                    .attr("fill","none")
                    .attr("stroke", "#90caf9")
                    .attr("stroke-width", "13")
                    .attr("stroke-opacity",0.6);
                // .attr("stroke", "#80cbc4")
                // .attr("stroke-width", "20")
                // .attr("stroke-opacity",0.6)
            }
            arc_legend_g.append("text").attr("x", 260).attr("y",10).text("collection").style("font-size", "14px").attr("alignment-baseline","middle").attr("font-family", "noto-black").style("fill", "#aaaaaa");
            let arc_legend_4_arr = [2*Math.PI-0.09,2*Math.PI-0.05,2*Math.PI-0.06,2*Math.PI-0.03,2*Math.PI-0.02,2*Math.PI+0.01];
            var preview_color = ["#008b8b", '#ef9a9a']
            for (var j=0;j<arc_legend_4_arr.length;j++){
                var arc_legend_4 = d3.arc()
                    .innerRadius(120)
                    .outerRadius(120)
                    .startAngle(arc_legend_4_arr[j]+0.01)
                    .endAngle(arc_legend_4_arr[j]);
                arc_legend_g.append("path")
                    .attr("d",arc_legend_4)
                    // .attr("transform","translate(250,250)")
                    .attr("transform","translate("+335+","+130+")")
                    .attr("fill","none")
                    .attr("stroke", preview_color[parseInt(2*j/arc_legend_4_arr.length)])//"#008b8b")
                    .attr("stroke-width", "13")
                    .attr("stroke-opacity",0.6);
                // .attr("stroke", "#80cbc4")
                // .attr("stroke-width", "20")
                // .attr("stroke-opacity",0.6)
            }
            arc_legend_g.append("text").attr("x", 345).attr("y",10).text("preview").style("font-size", "14px").attr("alignment-baseline","middle").attr("font-family", "noto-black").style("fill", "#aaaaaa");


            let legend_path = [[421,10],[425,5],[430,12],[433,8]];
            for (var j=0;j<legend_path.length;j++) {
                arc_legend_g.append("circle")
                    .attr("stroke",function(d,i){
                        return color(i);
                    })
                // .attr("x1",arc.centroid()[0]
                // )
                // .attr("y1",arc.centroid()[1]
                // )
                // .attr("transform","translate(250,250)")
                    .attr("fill","#b39ddb")
                    .attr("fill-opacity",0.7)
                // .attr("cx",cx)
                // .attr("cy",cy)
                    .attr("cx",legend_path[j][0])
                    .attr("cy",legend_path[j][1])
                    .attr("r",2);
                // .attr("class","distribution_select")
            }
            var linePath = d3.line().curve(d3.curveCatmullRom);
            // curveCardinal
            // curveMonotoneX
            // curveCatmullRom
            // curveNatural
            // let distirbution_selected_path.forEach(function (item) {
            arc_legend_g.append("path")
                .attr("d",linePath(legend_path))      //使用了线段生成器
                .attr("stroke","#90caf9")         //线的颜色
                .attr("stroke-width",1)     //线的宽度
                .attr("fill","none");            //填充颜色为none
            arc_legend_g.append("text").attr("x", 440).attr("y",10).text("distribution").style("font-size", "14px").attr("alignment-baseline","middle").attr("font-family", "noto-black").style("fill", "#aaaaaa");


            svg.append("circle").attr("cx",20).attr("cy",30).attr("r", 6).style("fill", "#bfbfbf").style("fill-opacity", 0.5);
            // svg.append("circle").attr("cx",70).attr("cy",20).attr("r", 6).style("fill", "#80cbc4").style("fill-opacity", 0.5)
            svg.append("text").attr("x", 30).attr("y",30).text("projection").style("font-size", "14px").attr("alignment-baseline","middle").attr("font-family", "noto-black").style("fill", "#aaaaaa");
            // svg.append("text").attr("x", 80).attr("y",20).text("semi").style("font-size", "14px").attr("alignment-baseline","middle").attr("font-family", "noto-black").style("fill", "#aaaaaa")

            // svg.append("g")

            // svg.append("circle")
            //       .attr("cx", c_x)
            //       .attr("cy", c_y)
            //       .attr("r", R)
            //       .attr("fill", "none")
            //       .attr('stroke', "#BFBFBF")
            //       .attr("stroke-width", 1)

            var pie = d3.pie();
            // var dataset = [30 , 10];
            var dataset = [{ startAngle: Math.PI * 0, endAngle: Math.PI * 0.5 },
                { startAngle:  Math.PI  , endAngle: Math.PI*1.5  },
            // { startAngle: 0 , endAngle: Math.PI * 2 },
            ];
            var outerRadius = 220 ;
            var innerRadius = 210 ;
            var arc = d3.arc()
                .innerRadius(innerRadius)
                .outerRadius(outerRadius);

            // change
            var arc2 = d3.arc()
                .innerRadius(149)//169
                .outerRadius(150);//170

            let arcarc = svg.append("g");
            arcarc.selectAll("path")
                .data(dataset)
                .enter()
                .append("path")
                .attr("d",function(d,i){
                    if (i == 2)
                        return arc(d);
                    else
                        return arc2(d);})
                .attr("transform","translate("+c_x+","+c_y+")")
                .attr("fill","none")
                .attr("stroke",function(d,i){
                    if (i == 0)
                    // return "#ef9a9a";
                        return that.arc_color_right;
                    else if (i == 1)
                    // return "#80cbc4";
                        return that.arc_color_left;
                    // else
                // return "bfbfbf"
                // return "#90caf9"
                })
                .attr("stroke-width",function(d,i){
                    if (i == 0)
                        return "4";
                    else if (i == 1)
                        return "4";
                    else
                        return  "2";})
                .attr("class",function(d,i){
                    if (i == 0)
                        return "mean1";
                    else if (i == 1)
                        return "var1";
                    else
                        return  "preview";})
                .attr("stroke-opacity",0.6);




            // var arcs = svg.selectAll("g")
            //               .data(pie(dataset))
            //               .enter()
            //               .append("g")
            //               .attr("transform","translate("+outerRadius+","+outerRadius+")")
            //               .attr("stroke",function(d,i){
            //                     if(i==0){
            //                         return "red";
            //                     }else{
            //                         return "blue";
            //                     }
            //                 })
            //               .attr("stroke-width","10")



            // svg.append("path")
            //     .attr("fill",function(d,i){
            //         // if(i==0){
            //         //     return "white";
            //         // }else{
            //         //     return "blue";
            //         // }
            //     })
            //     .attr("d",function(d){
            //         return arc(d);
            //     })
            //     .attr("stroke-dasharray",function(d,i){
            //         if(i==0){
            //             return "5,5";
            //         }else{
            //             return "0,0";
            //         }
            //     });

        },
        // init_mean_var() {
        //   var c_x = 250
        //   var c_y = 220

        //   var svg = d3.select("#Svglasso").select("svg")
        //   svg.select(".var").remove()
        //   svg.select(".mean").remove()

        //   var pie = d3.pie();
        //   // var dataset = [30 , 10];
        //   console.log(this.lassosamples_details)
        //   var dataset = [{ startAngle: Math.PI * 0.25, endAngle: Math.PI * 0.75},
        //     { startAngle:  Math.PI*1.25  , endAngle: Math.PI*1.75   }];
        //   var outerRadius = 220 ;
        //   var innerRadius = 210 ;
        //   var arc = d3.arc()
        //                   .innerRadius(innerRadius)
        //                   .outerRadius(outerRadius);
        //   var arc2 = d3.arc()
        //                   .innerRadius(169)
        //                   .outerRadius(170);
        //   console.log("333")
        //   svg.append("path")
        //       .attr("d",arc2(dataset[1]))
        //       // .attr("transform","translate(250,250)")
        //       .attr("transform","translate("+c_x+","+c_y+")")
        //       .attr("fill","none")
        //       .attr("stroke","#80cbc4")
        //       .attr("stroke-width","2")
        //       .attr("class","var1")
        //   svg.append("path")
        //       .attr("d",arc2(dataset[0]))
        //       // .attr("transform","translate(250,250)")
        //       .attr("transform","translate("+c_x+","+c_y+")")
        //       .attr("fill","none")
        //       .attr("stroke","#ef9a9a")
        //       .attr("stroke-width","2")
        //       .attr("class","mean1")
        // },
        get_mean_var(){
            var c_x = 250;
            var c_y = 250;
            var svg = d3.select("#Svglasso").select("svg");
            svg.select(".var").remove();
            svg.select(".mean").remove();
            // if (this.select_sample.length != 0) {
            //   svg.select(".var1").remove()
            //   svg.select(".mean1").remove()
            // }
            var pie = d3.pie();
            // var dataset = [30 , 10];
            // console.log(this.lassosamples_details.var)
            // console.log(Math.log(this.lassosamples_details.var))
            let var_scale = d3.scaleLinear()
                .domain([0,0.0005])
                .range([0, 0.5]);
            let mean_scale = d3.scaleLinear();
            // .domain([0,0.0005])
            // .range([0, 1])
            // console.log(this.lassosamples_details.mean)
            // console.log(var_scale(this.lassosamples_details.var))
            // console.log(mean_scale(this.lassosamples_details.mean))
            var mean_end =  Math.PI * (0.5)+ 0.7*this.lassosamples_details.mean;
            var var_end = Math.PI*(1.5+var_scale(this.lassosamples_details.var));
            if (var_end >= 1.98*Math.PI )
                var_end = 1.98*Math.PI;
            if (mean_end >= 0.98*Math.PI)
                mean_end = 0.98*Math.PI;
            var dataset = [{ startAngle: Math.PI * 0, endAngle: mean_end},
                { startAngle:  Math.PI*1  , endAngle: var_end  }];
            let mean_var_ = [this.lassosamples_details.mean,this.lassosamples_details.var];
            var outerRadius = 220 ;
            var innerRadius = 210 ;
            var arc = d3.arc()
                .innerRadius(innerRadius)
                .outerRadius(outerRadius);
            var arc2 = d3.arc()
                .innerRadius(169)
                .outerRadius(170);
            console.log("333");
            svg.append("path")
                .attr("d",arc2(dataset[1]))
            // .attr("transform","translate(250,250)")
                .attr("transform","translate("+c_x+","+c_y+")")
                .attr("fill","none")
            // .attr("stroke","#80cbc4")
                .attr("stroke",this.arc_color_left)
                .attr("stroke-width","3")
                .attr("name",mean_var_[1])
                .attr("class","var")
                .attr("stroke-opacity",0.6);

            svg.selectAll(".var_text").remove();
            // svg.append("text")
            //       .attr("x", 20)
            //       .attr("y", 40)
            //       .attr("fill", "#BFBFBF")
            //       .attr("class","var_text")
            //       .text(mean_var_[1])

            svg.append("path")
                .attr("d",arc2(dataset[0]))
            // .attr("transform","translate(250,250)")
                .attr("transform","translate("+c_x+","+c_y+")")
                .attr("fill","none")
            // .attr("stroke","#ef9a9a")
                .attr("stroke",this.arc_color_right)
                .attr("stroke-width","3")
                .attr("class","mean")
                .attr("stroke-opacity",0.6);

            // svg.append("text")
            //     .attr("x", 400)
            //     .attr("y", 40)
            //     .attr("fill", "#BFBFBF")
            //     .attr("class","var_text")
            //     .text(mean_var_[0])



        },
        async drawcircle() {
            var svg = d3.select("#myCircle")
                .append("svg");
            svg.append("circle")
                .attr("cx", 300)
                .attr("cy", 200)
                .attr("r", 200)
                .attr("fill", "none")
                .attr('stroke', "red")
                .attr("stroke-width", 3);
        },
        drawsankey() {
            let that = this;
            var svg_width = document.getElementById("sankey").clientWidth;
            var svg_height = document.getElementById("sankey").clientHeight;
            const svg = d3.select("#sankey").append("svg")
                .attr("width", svg_width)
                .attr("height", svg_height);
            // var  = this.$refs.sankey;

            var data1 = {
                'nodes': [
                    {name: "left_set_0"},
                    {name: "left_set_1"},
                    {name: "left_set_2"},
                    {name: "left_set_3"},
                    {name: "left_set_4"},
                    // {name: "left_set_5"},
                    // {name: "left_set_6"},
                    // {name: "left_set_7"},
                    // {name: "left_set_8"},
                    // {name: "left_set_9"},
                    {name: "right_set_0"},
                    {name: "right_set_1"},
                    {name: "right_set_2"},
                    {name: "right_set_3"},
                    // {name: "right_set_4"},
                    // {name: "right_set_5"},
                    // {name: "right_set_6"},
                    // {name: "right_set_7"},
                    // {name: "right_set_8"},
                    // {name: "right_set_9"},
                ],
                'links': [
                    {source: 0, target: 10, value: 1},
                    {source: 1, target: 11, value: 1},
                    {source: 2, target: 12, value: 5},
                ]
            };
            // console.log(sankeydata_1)
            // console.log(sankeydata_1.nodes)
            // console.log(sankeydata_1.links)
            const colors = ['#FFCC99','#FF6666','#CC3399',"#80cbc4"];
            // const color = d3.scaleOrdinal(d3.schemeCategory10);
            const color = d3.scaleOrdinal(colors);


            let nodes_names= [];
            let nodes_min_max  = {};
            console.log(this.initPos);


            function findKey(obj, value, compare = (a, b) => a === b) {
                return Object.keys(obj).find(k => compare(obj[k], value));
            }


            this.initPos.range.forEach(function(item) {
                let node_name = item.name.replace(/'/g, '"');
                nodes_names.push({"name":node_name});
                nodes_min_max[node_name] = {"max":item.max,"min":item.min};
            });
            let nodes_name_all = [];
            for(var i = 0; i < (nodes_names.length); i++){
                if (i%2==0)
                    nodes_name_all.push(nodes_names[i]);

            // else
                // Dict_inside[i] = arr_right[i-arr_left.length]
            }
            for(var i = 0; i < (nodes_names.length); i++){
                if (i%2!=0)
                    nodes_name_all.push(nodes_names[i]);

            // else
                // Dict_inside[i] = arr_right[i-arr_left.length]
            }
            let nodes_name_without_names = [];
            nodes_name_all.forEach(function(item){
                nodes_name_without_names.push(item.name);
            });
            let Dict_out ={};
            for(var i = 0; i < (nodes_name_all.length); i++){
            // if (i<arr_left.length)
                Dict_out[i] = nodes_name_without_names[i];
            // else
                // Dict_inside[i] = arr_right[i-arr_left.length]
            }
            let links_out = [];
            this.initPos.links.forEach(function(item) {
            // if ("right".indexOf(item["source"]) == -1) {console.log("left")}
            // item["source"] = parseInt(findKey(Dict,item.source));
            // item["target"] = parseInt(findKey(Dict,item.target));
                links_out.push({"source":parseInt(findKey(Dict_out,item.source)),"target":parseInt(findKey(Dict_out,item.target)),"value":item.value,"real_value":item.value});
            // item["value"] = item["value"].replace(/[^0-9]/ig,"");
            });
            // console.log("links_out",links_out);
            console.log("nodes_min_max",nodes_min_max);
            // console.log(this.initPos.links)




            // var sankeydata_1 = {'nodes': nodes_names,'links':this.initPos.links}


            // that.data1 = data1;
            // console.log(nodes_names);
            console.log("nodes_name_all",nodes_name_all);
            console.log("links_out",links_out);
            console.log("svg_height",svg_height);
            var sankey = d3.sankey()
                .nodeWidth(50)
                .nodePadding(5)
                .size([svg_width, svg_height])
            // .nodes(this.initPos.nodes)
            // .links(data1.links)
                .nodes(nodes_name_all)
                .links(links_out);
            console.log("hahha");
            // var sankey1 = d3.sankey()
            //     .nodeWidth(50)
            //     .nodePadding(40)
            //     .size([300, 300])
            //     .nodes(sankeydata_1.nodes)
            //     .links(sankeydata_1.links)
            // .layout(3);
            // var path = sankey().links;
            //   .domain(tempExtent)
            //   .range(colors);
            // console.log(path);
            // console.log(sankey().nodes)
            function sankey_0 () {
                function sum(array) {
                    let sum_ = 0;
                    array.sourceLinks.forEach(function(item2){sum_ = sum_+ item2.real_value;});
                    array.targetLinks.forEach(function(item2){sum_ = sum_+ item2.real_value;});
                    if (sum_ <=15)
                        sum_ = 15;
                    if (sum_ >=25)
                        sum_ = 25;
                    return sum_;
                }
                let rect_range = svg_height;
                let rect_height = (svg_height)/that.set_num;
                console.log("rect_height",rect_height);
                let rect_left = 0;
                let rect_left_width = 50;
                let rect_right_width = 50;
                let rect_right = 550;
                var nodes = svg.append("g")
                    .selectAll(".nodes")
                    .data(sankey().nodes)
                    .enter();
                console.log(sankey().nodes);

                nodes.append("rect")
                // .attr("x", d => d.x0)
                    .attr("x",function(d,i){
                        if (i <that.set_num)
                            return rect_left;
                        else
                            return  rect_right;})
                // .attr("y", d => d.y0)

                    .attr("y",function(d,i){
                        if (i <that.set_num)
                            return i*rect_height;
                        else
                            return  (i-that.set_num)*(rect_range)/(sankey().nodes.length-that.set_num);      })
                    .attr("height", rect_height)
                    .attr("width", function(d,i){
                        if (i <that.set_num)
                            return rect_left_width;
                        else
                            return  rect_right_width;})
                    .attr("fill", "#BFBFBF")
                    .attr("fill","blue")
                    .attr("fill-opacity", 0.1)
                    .attr("stroke-width", 0.01)
                    .attr("class", "select_rect_left")
                    .attr("class", "select_rect_right")
                    .attr("pos_set",true)
                    .classed("select_rect_left",false)
                    .classed("select_rect_right",false);
                nodes.append("circle")
                // .attr("x", d => d.x0)
                // .attr("y", d => d.y0)
                // .attr("height", d => d.y1 - d.y0)
                // .attr("width", d => d.x1 - d.x0)
                // .attr("cx", d => (d.x0+d.x1)/2)
                    .attr("cx",function(d,i){
                        if (i <that.set_num)
                            return rect_left_width/2+rect_left;
                        else
                            return  rect_right_width/2+rect_right;})
                // .attr("cy", d => (d.y0+d.y1)/2)
                // .attr("cy",d=>((rect_range)/that.set_num -d.y0)/2)
                    .attr("cy",function(d,i){
                        if (i <that.set_num)
                            return (i*(rect_range)/that.set_num) + ((rect_range)/that.set_num/2);
                        else
                            return  ((i-that.set_num)*(rect_range)/(sankey().nodes.length-that.set_num))+((rect_range)/that.set_num/2);      })
                    .attr("r", d=>(sum(d))/2)

                // .attr("")
                // .attr("fill", d=>color(d.name))
                    .attr("fill", "#BFBFBF")
                    .attr("fill-opacity", 0.4)
                    .attr("stroke", "BFBFBF") // "output" == the link's destination, not origin
                    .attr("stroke-width", 0.01)
                // .attr('fill-opacity', '0.6')
                // .attr('stroke-opacity', '1')
                    .attr("show",d=>["set:"+" "+d.name])
                    .attr("class","pos_set")
                    .attr("class", "select_rect_left")
                    .attr("class", "select_rect_right")
                    .attr("pos_set",true)
                    .classed("select_rect_left",false)
                    .classed("select_rect_right",false)
                    .attr("show1",d=> ["max:"+" "+nodes_min_max[d.name].max])
                    .attr("show2",d=> ["min:"+" "+nodes_min_max[d.name].min]);
                // console.log("hahah2")
                // console.log(nodes)
                // nodes.append("text")
                //       .attr("x", d=>(d.x0+d.x1)/2)
                //       .attr("y", d => (d.y1 - d.y0) + d.y0)
                //       .text(d=>d.name);
                //       // .attr("simple_id",d=>d.width);


                // // var nodes = svg.append("g").selectAll(".node")
                // //       .data(sankey().nodes)
                // //       .enter();

                // console.log(svg)

                const link = svg.append("g")
                    .attr("fill", "none")
                    .attr("stroke-opacity", 0.8)
                    .selectAll("g")
                    .data(sankey().links)
                    .enter().append("g")
                    .style("mix-blend-mode", "multiply");
                console.log(sankey().links);
                // console.log(d3.sankeyLinkHorizontal())

                var path_connect = [];
                links_out.forEach(function (item1) {
                    function  handle_y(i){
                        if (i <that.set_num)
                            return (i*(rect_range)/that.set_num) + ((rect_range)/that.set_num/2);
                        else
                            return  ((i-that.set_num)*(rect_range)/(sankey().nodes.length-that.set_num))+((rect_range)/that.set_num/2);
                    }
                    // function  handle_y_right(i){
                    //   if (i <that.set_num)
                    //     return (i*(rect_range)/that.set_num) + (5*(rect_range)/that.set_num);
                    //   else
                    //     return  ((i-that.set_num)*(rect_range)/(sankey().nodes.length-that.set_num))+((rect_range)/that.set_num/2);
                    // }

                    function  handle_x(i){
                        if (i <that.set_num)
                            return rect_left+rect_left_width/2;
                        else
                            return rect_right+rect_right_width/2;
                    }

                    // item2.x
                    // let x00 = (item1.source.x0+item1.source.x1)/2
                    let x00 = handle_x(item1.source.index);
                    // let y00 = (item1.source.y0+item1.source.y1)/2
                    let y00 = handle_y(item1.source.index);

                    // let x11 = (item1.target.x0+item1.target.x1)/2
                    let x11 = handle_x(item1.target.index);

                    // let y11 = (item1.target.y0+item1.target.y1)/2
                    let y11 = handle_y(item1.target.index);
                    let real_value = item1.real_value;
                    if (real_value>=25)
                        real_value = 25;
                    path_connect.push([[x00,y00],[x11,y11],real_value]);


                    // if ( select_sample.indexOf(item.name) != -1) {
                    //   console.log(item.getAttribute("name"))
                    //   item.setAttribute("r","10")
                    // }
                });
                var linePath = d3.line();


                var path_len = path_connect.length;
                path_connect.forEach(function (item) {


                    let dx = 0, dy = 50, x1 = item[0][0], y1 = item[0][1], x2 = item[1][0], y2 = item[1][1];
                    dy = rect_height;
                    // let dy =
                    var path = d3.path();
                    let cpx1 = x1 - dx;
                    let cpy1 = y1 + dy;
                    // let cpy1 = (y1+y2)/2;
                    // let cpx1 = (x1+x2)/2;
                    let cpx2 = x2 + dx;
                    let cpy2 = y2 - dy;
                    path.moveTo(x1,y1);
                    path.bezierCurveTo(cpx1,cpy1,cpx2,cpy2,x2,y2);
                    // path.bezierCurveTo(cpx1,cpy1,x2,y2);
                    svg.append("path")
                    // .attr("d",linePath(item))      //使用了线段生成器
                        .attr('d', path.toString())
                        .attr("stroke","#BFBFBF")         //线的颜色
                        .attr("stroke-width", item[2])
                    // if (path_len<=10) return 0.7;
                    // else return 0.1})     //线的宽度
                        .attr("fill","none");            //填充颜色为none
                    // .attr("fill-opacity", 0.5)
                });

                link.append("path")

                    .attr("d", d3.sankeyLinkHorizontal())
                // .attr("show", d=>["source: "+d.source.name])
                // .attr("show1", d=>["target: "+d.target.name])
                // // +"->"+d.target.name+"  "+" value:"+d.value])
                // .attr("show2", d=>["value: "+d.value])

                    .attr("stroke", d => color(d.target.name)) // "output" == the link's destination, not origin
                    .attr("stroke-width", 0);
                // .attr("stroke-width", d => Math.max(1, d.width));
            }
            function sankey_01 () {


                var nodes = svg.append("g")
                // .attr("fill", "")
                // .attr("transform", "translate(100, 0)")
                    .selectAll(".nodes")
                    .data(sankey().nodes)
                    .enter();

                nodes.append("rect")
                    .attr("x", d => d.x0)
                    .attr("y", d => d.y0)
                    .attr("height", d => d.y1 - d.y0)
                    .attr("width", d => d.x1 - d.x0)
                    .attr("fill", d => color(d.name))
                // .attr("fill","blue")
                    .attr("fill-opacity",0.7)
                // .attr("")
                    .attr("name", d => d.name)
                    .attr("show",d=>["sample_id:"+d.name]);
                console.log(nodes);
                // nodes.append("text")
                //       .attr("x", d=>(d.x0+d.x1)/2)
                //       .attr("y", d => (d.y1 - d.y0) + d.y0)
                //       .text(d=>d.name);
                // .attr("simple_id",d=>d.width);


                // var nodes = svg.append("g").selectAll(".node")
                //       .data(sankey().nodes)
                //       .enter();

                // console.log(svg)

                const link = svg.append("g")
                    .attr("fill", "none")
                    .attr("stroke-opacity", 1)
                    .selectAll("g")
                    .data(sankey().links)
                    .enter().append("g")
                    .style("mix-blend-mode", "multiply");

                link.append("path")

                    .attr("d", d3.sankeyLinkHorizontal())
                    .attr("show", d=>["path: "+d.source.name+"->"+d.target.name])
                    .attr("stroke", d => color(d.source.name)) // "output" == the link's destination, not origin
                    .attr("stroke-opacity",0.6)
                // .attr("stroke-width", 3);s
                    .attr("stroke-width", d => Math.max(1, d.width));
            }
            // console.log("hahah2")
            sankey_0();
            // sankey_01()




            let flag_text = 0;
            const preview1 = d3.select("#preview1").select("svg");
            const preview2 = d3.select("#preview2").select("svg");
            let nodes_select_final = [];
            // preview1.selectAll("text").remove();
            // preview2.selectAll("text").remove();
            // console.log(path)
            d3.selectAll('path');

            // expand functionality
            svg.selectAll("circle")
                .on("click",function(d) {
                    // d3.selectAll('.node, path')

                    // preview1.select("text")
                    //     .attr("x", 10)
                    //     .attr("y", 20)
                    //     // .attr('text-anchor',"middle")
                    //     .attr("fill", "#BFBFBF")
                    //     // .text([d3.select(this).attr("x"),d3.select(this).attr("y")])
                    //     .text(d3.select(this).attr("show"))

                    // d3.select(this).attr("stroke-width", 0.01)
                    // if (flag_text == 2) {preview1.selectAll("text").remove();preview2.selectAll("text").remove();flag_text = 0}
                    if (d3.select(this).attr("show").indexOf("left") != -1) {
                        svg.selectAll("circle").classed("select_rect_left",false).attr("stroke-width", 1).attr("fill-opacity", 0.6);
                        preview1.selectAll("text").remove();
                        preview1.append("text")
                            .attr("x", 10)
                            .attr("y", 20)
                        // .attr('text-anchor',"middle")
                            .attr("fill", "#BFBFBF")
                            .text(d3.select(this).attr("show"))
                            .classed("textout",true);

                        preview1.append("text")
                            .attr("x", 10)
                            .attr("y", 40)
                        // .attr('text-anchor',"middle")
                            .attr("fill", "#BFBFBF")
                            .text(d3.select(this).attr("show1"))
                            .classed("textout",true);
                        preview1.append("text")
                            .attr("x", 10)
                            .attr("y", 60)
                        // .attr('text-anchor',"middle")
                            .attr("fill", "#BFBFBF")
                            .text(d3.select(this).attr("show2"))
                            .classed("textout",true);
                        nodes_select_final[0] = d.name;
                        d3.select(this).classed("select_rect_left",true);
                        // d3.selectAll("rect").attr()
                        d3.select(this).attr("stroke-width", 4);
                    }
                    else if (d3.select(this).attr("show").indexOf("left") == -1) {
                        svg.selectAll("circle").classed("select_rect_right",false).attr("stroke-width", 1).attr("fill-opacity", 0.6);
                        preview2.selectAll("text").remove();
                        preview2.append("text")
                            .attr("x", 10)
                            .attr("y", 20)
                        // .attr('text-anchor',"middle")
                            .attr("fill", "#BFBFBF")
                            .text(d3.select(this).attr("show"))
                            .classed("textout",true);
                        preview2.append("text")
                            .attr("x", 10)
                            .attr("y", 40)
                        // .attr('text-anchor',"middle")
                            .attr("fill", "#BFBFBF")
                            .text(d3.select(this).attr("show1"))
                            .classed("textout",true);
                        preview2.append("text")
                            .attr("x", 10)
                            .attr("y", 60)
                        // .attr('text-anchor',"middle")
                            .attr("fill", "#BFBFBF")
                            .text(d3.select(this).attr("show2"))
                            .classed("textout",true);
                        d3.select(this).classed("select_rect_right",true);
                        d3.select(this).attr("stroke-width", 4);
                        nodes_select_final[1] = d.name;
                        // d3.select(this).classed("select_rect",true)
                    }
                    console.log(d3.select(this).attr("show"));
                    that.select_sets = nodes_select_final;

                    d3.select("#sankey").select(".select_rect_right")
                    // .attr("", "white")
                        .attr("fill-opacity", 1)
                        .attr("stroke-width", 2);

                    d3.select("#sankey").select(".select_rect_left")
                    // .attr("fill", "white")
                        .attr("fill-opacity", 1)
                        .attr("stroke-width", 2);
                    // if (!=-1)
                    // console.log()

                    // d => `${d.source.name} → ${d.target.name}\n${this.format(d.value)}`
                    // console.log(d.name)
                    // d => `${d.source.name} → ${d.target.name}\n${this.format(d.value)}`
                    // console.log(d3.select(this).attr("show2"))
                    // flag_text = flag_text + 1;
                });

        },
        drawsankey_inside(item1,item2,item3) {
            let that = this;
            const colors = ['#FFCC99','#FF6666','#CC3399',"#80cbc4"];
            // const color = d3.scaleOrdinal(d3.schemeCategory10);
            const color = d3.scaleOrdinal(colors);
            const svg = d3.select("#sankey").select("svg");
            svg.selectAll('path')            //     d3.selectAll('.node, path')
                .attr('fill-opacity', '1')
                .attr('stroke-opacity', '0.1');
            // const svg1 = svg.append("g")
            // .attr("translate",)


            var gg = svg.append("g")
                .attr("width", 440)
                .attr("height", 260)
                .attr("transform", "translate(80, 20)")
                .classed("in",true);

            // .attr("width", svg_width/3)
            // .attr("height", svg_height/3)

            // gg.append("rect")
            //     .attr("width", 380)
            //     .attr("height", 300)
            //     .attr("fill", "none")
            //     .attr('stroke', "#BFBFBF")
            //     .attr("stroke-width", 0)
            var data1 = {
                'nodes': [
                    {name: "left_set_0"},
                    {name: "left_set_1"},
                    {name: "left_set_2"},
                    // {name: "left_set_3"},
                    // {name: "left_set_4"},
                    // {name: "left_set_5"},
                    // {name: "left_set_6"},
                    // {name: "left_set_7"},
                    // {name: "left_set_8"},
                    // {name: "left_set_9"},
                    {name: "right_set_0"},
                    {name: "right_set_1"},
                    {name: "right_set_2"},
                    // {name: "right_set_3"},
                    // {name: "right_set_4"},
                    // {name: "right_set_5"},
                    // {name: "right_set_6"},
                    // {name: "right_set_7"},
                    // {name: "right_set_8"},
                    // {name: "right_set_9"},
                ],
                'links': [
                    {source: 0, target: 3, value: 1},
                    {source: 1, target: 4, value: 1},
                    {source: 2, target: 5, value: 5},
                ]
            };
            function sankey_1 () {
                var sankey1 = d3.sankey()
                    .nodeWidth(10)
                    .nodePadding(6)
                    .size([440, 260])
                // .nodes(this.initPos.nodes)
                // .links(data1.links)
                    .nodes(item1)
                    .links(item2);

                var nodes = gg.append("g")
                // .attr("fill", "")
                // .attr("transform", "translate(100, 0)")
                    .selectAll(".nodes")
                    .data(sankey1().nodes)
                    .enter();

                nodes.append("rect")
                    .attr("x", d => d.x0)
                    .attr("y", d => d.y0)
                    .attr("height", d => d.y1 - d.y0)
                    .attr("width", d => d.x1 - d.x0)
                // .attr("fill", d => color(d.name))
                    .attr("fill","blue")
                    .attr("fill-opacity",0.1)
                // .attr("")
                    .attr("name", d => d.name)
                    .attr("show",d=>["sample_id:"+d.name]);
                console.log(nodes);
                // nodes.append("text")
                //       .attr("x", d=>(d.x0+d.x1)/2)
                //       .attr("y", d => (d.y1 - d.y0) + d.y0)
                //       .text(d=>d.name);
                // .attr("simple_id",d=>d.width);


                // var nodes = svg.append("g").selectAll(".node")
                //       .data(sankey().nodes)
                //       .enter();

                // console.log(svg)

                const link = gg.append("g")
                    .attr("fill", "none")
                    .attr("stroke-opacity", 1)
                    .selectAll("g")
                    .data(sankey1().links)
                    .enter().append("g")
                    .style("mix-blend-mode", "multiply");

                link.append("path")

                    .attr("d", d3.sankeyLinkHorizontal())
                    .attr("show", d=>["path: "+d.source.name+"->"+d.target.name])
                    .attr("coeff",d=>d.coeff)
                    .attr("stroke", "#008b8b") // "output" == the link's destination, not origin
                    .attr("stroke-opacity",function(d){ if (d.coeff!=0) return 0.4; else return 0;} )

                    .attr("stroke-width", 3);
            }
            sankey_1();

            const preview1 = d3.select("#preview1").select("svg");
            const preview2 = d3.select("#preview2").select("svg");
            let selectsampleDetails = [];
            // preview1.selectAll("text").remove();
            // preview2.selectAll("text").remove();
            // console.log(path)
            d3.selectAll('path');
            // .on("click",function(d) {

            //   d3.selectAll('.node, path')
            //         .attr('fill-opacity', '1')
            //         .attr('stroke-opacity', '1')
            // })

            // preview2.selectAll("text").remove()
            // preview2.append("text")
            //     .attr("x", 10)
            //     .attr("y", 100)
            //     // .attr('text-anchor',"middle")
            //     .attr("fill", "#BFBFBF")
            //     .text(d3.select(this).attr("show"))
            //     // .text(d.show)
            // preview2.append("text")
            //     .attr("x", 10)
            //     .attr("y", 120)
            //     // .attr('text-anchor',"middle")
            //     .attr("fill", "#BFBFBF")
            //     .text(d3.select(this).attr("show1"))
            // preview2.append("text")
            //     .attr("x", 10)
            //     .attr("y", 140)
            //     // .attr('text-anchor',"middle")
            //     .attr("fill", "#BFBFBF")
            //     .text(d3.select(this).attr("show2"))
            // console.log(d3.select(this).attr("show"))

            // })
            d3.select(".in").selectAll('rect')
                .on("click",function(d) {
                    // d3.selectAll('.node, path')

                    // preview1.select("text")
                    //     .attr("x", 10)
                    //     .attr("y", 20)
                    //     // .attr('text-anchor',"middle")
                    //     .attr("fill", "#BFBFBF")
                    //     // .text([d3.select(this).attr("x"),d3.select(this).attr("y")])
                    //     .text(d3.select(this).attr("show"))
                    console.log(item3);
                    console.log(d3.select(this).attr("name"));
                    // if (flag_text == 2) {preview1.selectAll("text").remove();preview2.selectAll("text").remove();flag_text = 0}
                    if (item3.includes(parseInt(d3.select(this).attr("name")))) {
                        preview1.selectAll(".textinside").remove();
                        preview1.append("text")
                            .attr("x", 10)
                            .attr("y", 100)
                        // .attr('text-anchor',"middle")
                            .attr("fill", "#BFBFBF")
                            .text(d3.select(this).attr("show"))
                            .classed("textinside",true);
                        selectsampleDetails = ["left",d.name];
                        // preview1.append("text")
                        //     .attr("x", 10)
                        //     .attr("y", 140)
                        //     // .attr('text-anchor',"middle")
                        //     .attr("fill", "#BFBFBF")
                        //     .text(d3.select(this).attr("show1"))
                        //     .classed("textinside",true)
                        // preview1.append("text")
                        //     .attr("x", 10)
                        //     .attr("y", 160)
                        //     // .attr('text-anchor',"middle")
                        //     .attr("fill", "#BFBFBF")
                        //     .text(d3.select(this).attr("show2"))
                        //     .classed("textinside",true)
                        // nodes_select_final[0] = d.name
                    }
                    else if (item3.includes(parseInt(d3.select(this).attr("name"))) == false) {
                        preview2.selectAll(".textinside").remove();
                        preview2.append("text")
                            .attr("x", 10)
                            .attr("y", 100)
                        // .attr('text-anchor',"middle")
                            .attr("fill", "#BFBFBF")
                            .text(d3.select(this).attr("show"))
                            .classed("textinside",true);
                        selectsampleDetails = ["right",d.name];
                        // preview2.append("text")
                        //     .attr("x", 10)
                        //     .attr("y", 140)
                        //     // .attr('text-anchor',"middle")
                        //     .attr("fill", "#BFBFBF")
                        //     .text(d3.select(this).attr("show1"))
                        //     .classed("textinside",true)
                        // preview2.append("text")
                        //     .attr("x", 10)
                        //     .attr("y", 160)
                        //     // .attr('text-anchor',"middle")
                        //     .attr("fill", "#BFBFBF")
                        //     .text(d3.select(this).attr("show2"))
                        //     .classed("textinside",true)
                        // nodes_select_final[1] = d.name
                    }
                    console.log(typeof(d3.select(this).attr("show")));
                    that.selectsampleDetails = selectsampleDetails;
                    that.sampleDetails();
                    // that.select_sets = nodes_select_final;
                    // if (!=-1)
                    // console.log()

                    // d => `${d.source.name} → ${d.target.name}\n${this.format(d.value)}`
                    // console.log(d.name)
                    // d => `${d.source.name} → ${d.target.name}\n${this.format(d.value)}`
                    // console.log(d3.select(this).attr("show2"))
                    // flag_text = flag_text + 1;
                });

            // console.log(svg)
        },
        clean_samples() {
            d3.select("#sankey").selectAll(".in").remove();
            d3.select("#sankey").select("svg").selectAll('path')            //     d3.selectAll('.node, path')
                .attr('fill-opacity', '1')
                .attr('stroke-opacity', '0.8');
            // .attr("stroke-width", 0.01)
            d3.select("#sankey").select("svg").selectAll('rect')            //     d3.selectAll('.node, path')
                .attr('fill-opacity', 0.1)
            // .attr('stroke-opacity', '0.8')
                .attr("stroke-width", 0.01);
            // d3.select("#sankey").select("svg").selectAll('circle')            //     d3.selectAll('.node, path')
            // .attr('fill-opacity', 0.)
            // .attr('stroke-opacity', '0.8')
            // .attr("stroke-width", 0.01)
            // d3.select("#sankey").select("svg").remove();
            d3.select("#preview1").selectAll('.textinside').remove();
            d3.select("#preview2").selectAll('.textinside').remove();
            // this.init_pos();        //     d3.selectAll('.node, path')
            // .attr('fill-opacity', '1')
            // .attr('stroke-opacity', '0.8')
        },
        drawfeature_list() {
            var svg_width = document.getElementById("feature_list").clientWidth;
            var svg_height = document.getElementById("feature_list").clientHeight;
            const svg = d3.select("#feature_list").append("svg")
                .attr("width", svg_width)
                .attr("height", svg_height);
            svg.append("text")
                .attr("x", 50)
                .attr("y", 50)
            // .attr('text-anchor',"middle")
                .attr("fill", "#BFBFBF")
                .text("feature");
        },
        drawpreview1() {
            var svg_width = document.getElementById("preview1").clientWidth;
            var svg_height = document.getElementById("preview1").clientHeight;
            const svg = d3.select("#preview1").select("svg");
            // .attr("width", svg_width)
            // .attr("height", 100);
            svg.append("text")
                .attr("x", 10)
                .attr("y", 20)
            // .attr('text-anchor',"middle")
                .attr("fill", "#BFBFBF")
                .text("preview1");
        },
        drawpreview2() {
            var svg_width = document.getElementById("preview2").clientWidth;
            var svg_height = document.getElementById("preview2").clientHeight;
            const svg = d3.select("#preview2").select("svg");
            svg.append("text")
                .attr("x", 10)
                .attr("y", 20)
            // .attr('text-anchor',"middle")
                .attr("fill", "#BFBFBF")
                .text("preview2");
        },
        metric_change(value) {
            if (value == "mean") {
                this.drawbox();
            }
            else if (value == "var") {
                this.drawbox2();
            }
            else if (value == "activation") {
                this.draw_activation1();
            }

            // console.log(value)
            // console.log(this.selected_city)
        },
        drawbox() {
            // option = {
            //   title: [
            //       {
            //           text: 'Michelson-Morley Experiment',
            //           left: 'center'
            //       },
            //       {
            //           text: 'upper: Q3 + 1.5 * IQR \nlower: Q1 - 1.5 * IQR',
            //           borderColor: '#999',
            //           borderWidth: 1,
            //           textStyle: {
            //               fontWeight: 'normal',
            //               fontSize: 14,
            //               lineHeight: 20
            //           },
            //           left: '10%',
            //           top: '90%'
            //       }
            //   ],
            //   dataset: [{
            //       source: [
            //           [850, 740, 900, 1070, 930, 850, 950, 980, 980, 880, 1000, 980, 930, 650, 760, 810, 1000, 1000, 960, 960],
            //           [960, 940, 960, 940, 880, 800, 850, 880, 900, 840, 830, 790, 810, 880, 880, 830, 800, 790, 760, 800],
            //           [880, 880, 880, 860, 720, 720, 620, 860, 970, 950, 880, 910, 850, 870, 840, 840, 850, 840, 840, 840],
            //           [890, 810, 810, 820, 800, 770, 760, 740, 750, 760, 910, 920, 890, 860, 880, 720, 840, 850, 850, 780],
            //           [890, 840, 780, 810, 760, 810, 790, 810, 820, 850, 870, 870, 810, 740, 810, 940, 950, 800, 810, 870]
            //       ]
            //   }, {
            //       transform: {
            //           type: 'boxplot',
            //           config: { itemNameFormatter: 'expr {value}' }
            //       }
            //   }, {
            //       fromDatasetIndex: 1,
            //       fromTransformResult: 1
            //   }],
            //   tooltip: {
            //       trigger: 'item',
            //       axisPointer: {
            //           type: 'shadow'
            //       }
            //   },
            //   grid: {
            //       left: '10%',
            //       right: '10%',
            //       bottom: '15%'
            //   },
            //   xAxis: {
            //       type: 'category',
            //       boundaryGap: true,
            //       nameGap: 30,
            //       splitArea: {
            //           show: false
            //       },
            //       splitLine: {
            //           show: false
            //       }
            //   },
            //   yAxis: {
            //       type: 'value',
            //       name: 'km/s minus 299,000',
            //       splitArea: {
            //           show: true
            //       }
            //   },
            //   series: [
            //       {
            //           name: 'boxplot',
            //           type: 'boxplot',
            //           datasetIndex: 1
            //       },
            //       {
            //           name: 'outlier',
            //           type: 'scatter',
            //           datasetIndex: 2
            //       }
            //   ]
            // };
            let box = this.$echarts.init(this.$refs.box);
            var option;

            var data = this.$echarts.dataTool.prepareBoxplotData([
                [850, 740, 900, 1070, 930, 850, 950, 980, 980, 880, 1000, 980, 930, 650, 760, 810, 1000, 1000, 960, 960],
                [960, 940, 960, 940, 880, 800, 850, 880, 900, 840, 830, 790, 810, 880, 880, 830, 800, 790, 760, 800],
            // [880, 880, 880, 860, 720, 720, 620, 860, 970, 950, 880, 910, 850, 870, 840, 840, 850, 840, 840, 840],
            // [890, 810, 810, 820, 800, 770, 760, 740, 750, 760, 910, 920, 890, 860, 880, 720, 840, 850, 850, 780],
            // [890, 840, 780, 810, 760, 810, 790, 810, 820, 850, 870, 870, 810, 740, 810, 940, 950, 800, 810, 870]
            ], {
                layout: 'vertical'
            });
            option = {
                title: [{
                    text: 'Mean/Var',
                    x: 'center',
                },
                    // {
                    //   text: 'upper: Q3 + 1.5 * IRQ \nlower: Q1 - 1.5 * IRQ',
                    //   borderColor: '#999',
                    //   borderWidth: 1,
                    //   textStyle: {
                    //     fontSize: 14
                    //   },
                    //   left: '10%',
                    //   top: '90%'
                    // }
                ],
                tooltip: {
                    trigger: 'item',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                grid: {
                    left: '10%',
                    right: '10%',
                    bottom: '15%'
                },
                xAxis: {
                    type: 'category',
                    data: data.axisData,
                    boundaryGap: true,
                    nameGap: 30,
                    splitArea: {
                        show: false
                    },
                    axisLabel: {
                        formatter: ''
                    },
                    splitLine: {
                        show: false
                    }
                },
                yAxis: {
                    type: 'value',
                    name: '',
                    splitArea: {
                        show: true
                    }
                },
                series: [{
                    name: 'boxplot',
                    type: 'boxplot',
                    data: data.boxData,
                    tooltip: {
                        formatter: function(param) {
                            return [
                                'box' + param.name + ': ',
                                'upper: ' + param.data[5],
                                'Q3: ' + param.data[4],
                                'median: ' + param.data[3],
                                'Q1: ' + param.data[2],
                                'lower: ' + param.data[1]
                            ].join('<br/>');
                        }
                    }
                },
                {
                    name: 'outlier',
                    type: 'scatter',
                    data: data.outliers
                }
                ]
            };
            box.setOption(option);

        },
        drawbox2() {
            // option = {
            //   title: [
            //       {
            //           text: 'Michelson-Morley Experiment',
            //           left: 'center'
            //       },
            //       {
            //           text: 'upper: Q3 + 1.5 * IQR \nlower: Q1 - 1.5 * IQR',
            //           borderColor: '#999',
            //           borderWidth: 1,
            //           textStyle: {
            //               fontWeight: 'normal',
            //               fontSize: 14,
            //               lineHeight: 20
            //           },
            //           left: '10%',
            //           top: '90%'
            //       }
            //   ],
            //   dataset: [{
            //       source: [
            //           [850, 740, 900, 1070, 930, 850, 950, 980, 980, 880, 1000, 980, 930, 650, 760, 810, 1000, 1000, 960, 960],
            //           [960, 940, 960, 940, 880, 800, 850, 880, 900, 840, 830, 790, 810, 880, 880, 830, 800, 790, 760, 800],
            //           [880, 880, 880, 860, 720, 720, 620, 860, 970, 950, 880, 910, 850, 870, 840, 840, 850, 840, 840, 840],
            //           [890, 810, 810, 820, 800, 770, 760, 740, 750, 760, 910, 920, 890, 860, 880, 720, 840, 850, 850, 780],
            //           [890, 840, 780, 810, 760, 810, 790, 810, 820, 850, 870, 870, 810, 740, 810, 940, 950, 800, 810, 870]
            //       ]
            //   }, {
            //       transform: {
            //           type: 'boxplot',
            //           config: { itemNameFormatter: 'expr {value}' }
            //       }
            //   }, {
            //       fromDatasetIndex: 1,
            //       fromTransformResult: 1
            //   }],
            //   tooltip: {
            //       trigger: 'item',
            //       axisPointer: {
            //           type: 'shadow'
            //       }
            //   },
            //   grid: {
            //       left: '10%',
            //       right: '10%',
            //       bottom: '15%'
            //   },
            //   xAxis: {
            //       type: 'category',
            //       boundaryGap: true,
            //       nameGap: 30,
            //       splitArea: {
            //           show: false
            //       },
            //       splitLine: {
            //           show: false
            //       }
            //   },
            //   yAxis: {
            //       type: 'value',
            //       name: 'km/s minus 299,000',
            //       splitArea: {
            //           show: true
            //       }
            //   },
            //   series: [
            //       {
            //           name: 'boxplot',
            //           type: 'boxplot',
            //           datasetIndex: 1
            //       },
            //       {
            //           name: 'outlier',
            //           type: 'scatter',
            //           datasetIndex: 2
            //       }
            //   ]
            // };
            let box = this.$echarts.init(this.$refs.box);
            var option;

            var data = this.$echarts.dataTool.prepareBoxplotData([
                [960, 940, 960, 940, 880, 800, 850, 880, 900, 840, 830, 790, 810, 880, 880, 830, 800, 790, 760, 800],
                [850, 740, 900, 1070, 930, 850, 950, 980, 980, 880, 1000, 980, 930, 650, 760, 810, 1000, 1000, 960, 960],

            // [880, 880, 880, 860, 720, 720, 620, 860, 970, 950, 880, 910, 850, 870, 840, 840, 850, 840, 840, 840],
            // [890, 810, 810, 820, 800, 770, 760, 740, 750, 760, 910, 920, 890, 860, 880, 720, 840, 850, 850, 780],
            // [890, 840, 780, 810, 760, 810, 790, 810, 820, 850, 870, 870, 810, 740, 810, 940, 950, 800, 810, 870]
            ], {
                layout: 'vertical'
            });
            option = {
                title: [{
                    text: 'Mean/Var',
                    x: 'center',
                },
                    // {
                    //   text: 'upper: Q3 + 1.5 * IRQ \nlower: Q1 - 1.5 * IRQ',
                    //   borderColor: '#999',
                    //   borderWidth: 1,
                    //   textStyle: {
                    //     fontSize: 14
                    //   },
                    //   left: '10%',
                    //   top: '90%'
                    // }
                ],
                tooltip: {
                    trigger: 'item',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                grid: {
                    left: '10%',
                    right: '10%',
                    bottom: '15%'
                },
                xAxis: {
                    type: 'category',
                    data: data.axisData,
                    boundaryGap: true,
                    nameGap: 30,
                    splitArea: {
                        show: false
                    },
                    axisLabel: {
                        formatter: ''
                    },
                    splitLine: {
                        show: false
                    }
                },
                yAxis: {
                    type: 'value',
                    name: '',
                    splitArea: {
                        show: true
                    }
                },
                series: [{
                    name: 'boxplot',
                    type: 'boxplot',
                    data: data.boxData,
                    tooltip: {
                        formatter: function(param) {
                            return [
                                'box' + param.name + ': ',
                                'upper: ' + param.data[5],
                                'Q3: ' + param.data[4],
                                'median: ' + param.data[3],
                                'Q1: ' + param.data[2],
                                'lower: ' + param.data[1]
                            ].join('<br/>');
                        }
                    }
                },
                {
                    name: 'outlier',
                    type: 'scatter',
                    data: data.outliers
                }
                ]
            };
            box.setOption(option);

        },
        // draw_activation() {
        //   // async get_fearure() {
        //   // let dataget = HttpHelper.axiosGet("/euro/getData");
        //   // console.log({dataget});
        //   let activation = this.mean_var.activation;
        //   // console.log(this.activation);
        //   var act = [];
        //   var feature = [];
        //   activation.forEach(function (item) {
        //     // if (item === 3) {
        //     //     return;
        //     // }
        //     act.push(item.act)
        //     feature.push(item.feature)
        //     // console.log(item);

        //   });
        //   // console.log(this.activation)
        //   console.log(act)
        //   console.log(feature)



        //   // 指定图表的配置项和数据
        //   let option_act = {
        //     title: [{
        //       text: 'Activation',
        //       x: 'center',
        //     }],
        //     tooltip: {
        //       trigger: 'axis'
        //     },
        //     xAxis: {
        //         type: 'category',
        //         data: feature
        //     },
        //     yAxis: {
        //       type: 'value',
        //     },
        //     series: [{
        //         data: act,
        //         type: 'scatter',
        //     }]
        //   };
        //   let activation_chart = this.$echarts.init(this.$refs.activation_chart);
        //   // 使用刚指定的配置项和数据显示图表。
        //   activation_chart.setOption(option_act);
        // },
        drawmean() {
            this.option.series = [
                {
                    name: "mean_neg",
                    type: "line",
                    showSymbol: false,
                    hoverAnimation: false,
                    data: this.mean_var.mean_neg,
                },
                {
                    name: "mean_pos",
                    type: "line",
                    showSymbol: false,
                    hoverAnimation: false,
                    data: this.mean_var.mean_pos,
                },
                {
                    name: "var_neg",
                    type: "line",
                    showSymbol: false,
                    hoverAnimation: false,
                    data: this.mean_var.var_neg,
                }
            ];
            this.option.legend= {
                data: ["mean_neg","mean_pos","var_neg"],
                top: 20,
                right: 0,
                //   设置图例的形状
                icon: "rect",
                //   设置图例的高度
                itemHeight: 1
            };


            let mean_var = this.$echarts.init(this.$refs.mean_var);
            mean_var.setOption(this.option);
        },
        draw_mean_pos() {
            this.option_mean_pos.grid = {
                top:"30px",
                left:"50px",
                right:"15px",
                bottom:"20px"
            };
            // this.option_mean_pos.series = [
            //   {
            //     name: "mean_pos",
            //     type: "line",
            //     showSymbol: false,
            //     hoverAnimation: false,
            //     data: this.mean_var.mean_pos,
            //   }
            // ];
            // this.option_mean_pos.legend= {
            //   data: ["mean_pos"],
            //   top: 20,
            //   right: 0,
            //   //   设置图例的形状
            //   icon: "rect",
            //   //   设置图例的高度
            //   itemHeight: 1
            // };
            this.option_mean_pos.tooltip = {
                trigger: 'axis',
            },
            this.option_mean_pos.title = [{
                text: 'Mean_positive',
                x: 'center',
                textStyle: {
                    // fontWeight: 'normal',
                    color: "#606266",
                },
            }];
            // let mean_pos = this.$refs.mean_pos
            let mean_pos = this.$echarts.init(this.$refs.mean_pos);
            if (mean_pos) {
                console.log(this.option_mean_pos.series.length);
                if (this.status == 0) {
                    if (this.option_mean_pos.series[1])
                    {
                        this.option_mean_pos.series[1].data = this.mean_var.mean_pos;
                    }
                    else {
                        this.option_mean_pos.series.push(
                            {
                                name: "second",
                                type: "line",
                                showSymbol: false,
                                hoverAnimation: false,
                                data: this.mean_var.mean_pos,
                            }
                        ) ;
                        this.option_mean_pos.legend= {
                            data: ["first","second"],
                            top: 5,
                            right: 0,
                            //   设置图例的形状
                            icon: "rect",
                            //   设置图例的高度
                            itemHeight: 1
                        };
                    }
                }
                else {
                    this.option_mean_pos.series = [
                        {
                            name: "first",
                            type: "line",
                            showSymbol: false,
                            hoverAnimation: false,
                            data: this.mean_var.mean_pos,
                        }
                    ];
                    this.option_mean_pos.legend= {
                        data: ["first"],
                        top: 5,
                        right: 0,
                        //   设置图例的形状
                        icon: "rect",
                        //   设置图例的高度
                        itemHeight: 1
                    };
                    // console.log(this.option_mean_pos.series[0].data.length)
                    if (this.mean_var.train_flag == true)
                    {
                        this.status = 0;
                    }

                }
            //
            }
            mean_pos.setOption(this.option_mean_pos);
        },
        draw_mean_neg() {
            this.option_mean_neg.grid = {
                top:"30px",
                left:"50px",
                right:"15px",
                bottom:"20px"
            };
            this.option_mean_neg.tooltip = {
                trigger: 'axis',
            },
            this.option_mean_neg.title = [{
                text: 'Mean_negative',
                x: 'center',
                textStyle: {
                    // fontWeight: 'normal',
                    color: "#606266",
                },
            }];
            // let mean_pos = this.$refs.mean_pos
            let mean_neg = this.$echarts.init(this.$refs.mean_neg);
            if (mean_neg) {
                console.log(this.option_mean_neg.series.length);
                if (this.status == 0) {
                    if (this.option_mean_neg.series[1])
                    {
                        this.option_mean_neg.series[1].data = this.mean_var.mean_neg;
                    }
                    else {
                        this.option_mean_neg.series.push(
                            {
                                name: "second",
                                type: "line",
                                showSymbol: false,
                                hoverAnimation: false,
                                data: this.mean_var.mean_neg,
                            }
                        ) ;
                        this.option_mean_neg.legend= {
                            data: ["first","second"],
                            top: 5,
                            right: 0,
                            //   设置图例的形状
                            icon: "rect",
                            //   设置图例的高度
                            itemHeight: 1
                        };
                    }
                }
                else {
                    this.option_mean_neg.series = [
                        {
                            name: "first",
                            type: "line",
                            showSymbol: false,
                            hoverAnimation: false,
                            data: this.mean_var.mean_neg,
                        }
                    ];
                    this.option_mean_neg.legend= {
                        data: ["first"],
                        top: 5,
                        right: 0,
                        //   设置图例的形状
                        icon: "rect",
                        //   设置图例的高度
                        itemHeight: 1
                    };
                    // console.log(this.option_mean_neg.series[0].data.length)
                    // if (this.option_mean_neg.series[0].data.length == 360)
                    // {
                    //   this.status_mean_neg = 0
                    // }

                }
            //
            }
            mean_neg.setOption(this.option_mean_neg);
        },
        draw_var_neg() {
            this.option_var_neg.grid = {
                top:"30px",
                left:"50px",
                right:"15px",
                bottom:"20px"
            };
            this.option_var_neg.tooltip = {
                trigger: 'axis',
            },
            this.option_var_neg.title = [{
                text: 'Var_negative',
                x: 'center',
                textStyle: {
                    // fontWeight: 'normal',
                    color: "#606266",
                },
            }];
            // let mean_pos = this.$refs.mean_pos
            let var_neg = this.$echarts.init(this.$refs.var_neg);
            if (var_neg) {
                console.log(this.option_var_neg.series.length);
                if (this.status == 0) {
                    if (this.option_var_neg.series[1])
                    {
                        this.option_var_neg.series[1].data = this.mean_var.var_neg;
                    }
                    else {
                        this.option_var_neg.series.push(
                            {
                                name: "second",
                                type: "line",
                                showSymbol: false,
                                hoverAnimation: false,
                                data: this.mean_var.var_neg,
                            }
                        ) ;
                        this.option_var_neg.legend= {
                            data: ["first","second"],
                            top: 5,
                            right: 0,
                            //   设置图例的形状
                            icon: "rect",
                            //   设置图例的高度
                            itemHeight: 1
                        };
                    }
                }
                else {
                    this.option_var_neg.series = [
                        {
                            name: "first",
                            type: "line",
                            showSymbol: false,
                            hoverAnimation: false,
                            data: this.mean_var.var_neg,
                        }
                    ];
                    this.option_var_neg.legend= {
                        data: ["first"],
                        top: 5,
                        right: 0,
                        //   设置图例的形状
                        icon: "rect",
                        //   设置图例的高度
                        itemHeight: 1
                    };
                    // console.log(this.option_var_neg.series[0].data.length)
                    // if (this.option_var_neg.series[0].data.length == 360)
                    // {
                    //   this.status = 0
                    // }

                }
            //
            }
            var_neg.setOption(this.option_var_neg);
        },
        // async draw_activation2() {

        //   let all_activation = await HttpHelper.axiosGet("/euro/getActivation");
        //   console.log(all_activation);
        //   console.log("get activation");
        //   let activation = [];
        //   let samples = [];
        //   all_activation.forEach(function (item) {
        //     // if (item === 3) {
        //     //     return;
        //     // }
        //     activation.push(item.activation)
        //     samples.push(item.sample)
        //     // console.log(item);

        //   });
        //   console.log(activation[0][0].act)
        //   // console.log(activation[0][0])
        //   console.log(samples)
        //   console.log(activation.length)
        //   // var samples = ["sample1"];
        //   let features = [];
        //   activation[0].forEach(function (item) {
        //     features.push(item.feature)
        //   });
        //   // console.log(features)

        //   // let xy = []
        //   let xyz = []
        //   for (let i = 0; i < samples.length; i++) {
        //       for (let j = 0; j < activation[0].length; j++) {
        //           // console.log(j)
        //           let actval = activation[i][j].act
        //           xyz[i*activation.length+j] = [j,i,actval]
        //       }
        //   }
        //   console.log(xyz)

        //   // data = data.map(function (item) {
        //   //     return [item[1], item[0], item[2] || '-'];
        //   // });
        //   // console.log(data)

        //   var option = {
        //         tooltip: {
        //                       //   tooltip: {
        //           trigger: 'axis',
        //   //   },
        //         },
        //         animation: false,
        //         // grid: {
        //         //     height: '50%',
        //         //     y: '10%'
        //         // },
        //         xAxis: {
        //             show: false,
        //             type: 'category',
        //             data: features,
        //             splitArea: {
        //                 // show: true
        //             }
        //         },
        //         yAxis: {
        //             type: 'category',
        //             data: samples,
        //             splitArea: {
        //                 show: false
        //             }
        //         },
        //         visualMap: {
        //             min: 0,
        //             max: 1,
        //             calculable: true,
        //             orient: 'horizontal',
        //             left: 'center',
        //             top: '0%'
        //         },
        //         series: [{
        //             // name: 'Punch Card',
        //             type: 'heatmap',
        //             data: xyz,
        //             label: {
        //                 normal: {
        //                     show: false
        //                 }
        //             },
        //             itemStyle: {
        //                 emphasis: {
        //                     shadowBlur: 10,
        //                     shadowColor: 'rgba(0, 0, 0, 0.5)'
        //                 },
        //                 opacity:0.1,
        //             }
        //         }]
        //     };
        //     let activation_chart = this.$echarts.init(this.$refs.activation_chart);
        //     // 使用刚指定的配置项和数据显示图表。
        //     activation_chart.setOption(option);


        // },
        draw_activation1() {

            // console.log(features)


            this.option_act = {
                grid:{
                    top:"30px",
                    left:"50px",
                    right:"15px",
                    bottom:"20px"
                },
                color: ['#b39ddb',"#90caf9", "#ef9a9a","#80cbc4"],
                title: [{
                    text: 'Activation',
                    x: 'center',
                    textStyle: {
                        // fontWeight: 'normal',
                        color: "#606266",
                    },
                }],
                tooltip: {
                    trigger: 'axis'
                },
                xAxis: {
                    type: 'category',
                    data: [],
                },
                yAxis: {
                    type: 'value',
                    max:1,
                    min:0,
                    // min: (value) => {
                    //   // parseFloat((d.percentage*100).toFixed(2))
                    //   return value.min.toFixed(2)
                    // },
                    // max: (value) => {
                    //   return value.max.toFixed(2)
                    // }
                },
                series: [
                    {
                        name: "first",
                        data: [],
                        type: 'scatter',
                    },
                    {
                        name: "second",
                        data: [],
                        type: 'scatter',
                    },
                ],

                legend:{
                    data: ["first"],
                    top: 5,
                    right: 0,
                    //   设置图例的形状
                    icon: "rect",
                    //   设置图例的高度
                    itemHeight: 1
                }
            };



            let activation_chart = this.$echarts.init(this.$refs.activation_chart);
            // 使用刚指定的配置项和数据显示图表。
            activation_chart.setOption(this.option_act);

        },
        async draw_activation2() {
            let all_activation = await HttpHelper.axiosGet("/euro/getActivation");
            console.log(all_activation);
            console.log("get activation");
            let activation = [];
            let samples = [];
            all_activation.forEach(function (item) {
            // if (item === 3) {
            //     return;
            // }
                activation.push(item.activation);
                samples.push(item.sample);
            // console.log(item);

            });
            console.log(activation[0][0].act);
            // console.log(activation[0][0])
            console.log(samples);
            console.log(activation.length);
            // var samples = ["sample1"];
            let features = [];
            activation[0].forEach(function (item) {
                features.push(item.feature);
            });
            // console.log(features)

            let xy = [];
            for (let j = 0; j < activation[0].length; j++) {
                xy[j] = 0;
            }
            let xyz = [];
            for (let i = 0; i < samples.length; i++) {
                for (let j = 0; j < activation[0].length; j++) {
                    // console.log(j)
                    let actval = activation[i][j].act;
                    xyz[i*activation.length+j] = [i,j,actval];
                    xy[j] = Math.max(xy[j] , actval);
                }
            }
            // for (let j = 0; j < activation[0].length; j++) {
            //     xy[j] = xy[j] / samples.length;
            // }

            console.log(xy);



            if (this.status_act == 0) {
                this.option_act.series.push(
                    {
                        name: "second",
                        data: xy,
                        type: 'scatter',
                        itemStyle: {
                            // color:'white',		   		//点颜色
                            // borderColor: 'green',  		//点边框颜色
                            opacity: 0.5,            		//点的透明度 1不透明
                            // borderWidth: 0.5       		//图形描边宽度
                        },
                    }
                ) ;
                this.option_act.legend= {
                    data: ["first","second"],
                    top: 5,
                    right: 0,
                    //   设置图例的形状
                    icon: "rect",
                    //   设置图例的高度
                    itemHeight: 1
                };
            }
            else {
                this.option_act = {
                    grid:{
                        top:"30px",
                        left:"50px",
                        right:"15px",
                        bottom:"20px"
                    },
                    color: ['#b39ddb',"#90caf9", "#ef9a9a","#80cbc4"],
                    // color: ["#ef9a9a","#80cbc4"],
                    title: [{
                        text: 'Activation',
                        x: 'center',
                        textStyle: {
                            // fontWeight: 'normal',
                            color: "#606266",
                        },
                    }],
                    tooltip: {
                        trigger: 'axis'
                    },
                    xAxis: {
                        type: 'category',
                        data: features
                    },
                    yAxis: {
                        type: 'value',
                    },
                    series: [{
                        name: "first",
                        data: xy,
                        type: 'scatter',
                        itemStyle: {
                            // color:'white',		   		//点颜色
                            // borderColor: 'green',  		//点边框颜色
                            opacity: 0.5,            		//点的透明度 1不透明
                            // borderWidth: 0.5       		//图形描边宽度
                        },
                    }],
                    legend:{
                        data: ["first"],
                        top: 5,
                        right: 0,
                        //   设置图例的形状
                        icon: "rect",
                        //   设置图例的高度
                        itemHeight: 1
                    }
                };
                this.status_act = 0;


            }

            let activation_chart = this.$echarts.init(this.$refs.activation_chart);
            // 使用刚指定的配置项和数据显示图表。
            activation_chart.setOption(this.option_act);

        },
        async get_pro_act() {
            this.loading3 = true
            await this.draw_activation2();
            await this.drawlasso_();
            this.loading3 = false;
            this.$root.Bus.$emit('guidance_comparison');
        },
        clear() {
            this.status = 1;
            this.status_act = 1;
            let mychart = this.$echarts.init(this.$refs.mean_pos);
            this.option_mean_pos.series = [];
            this.option_mean_pos.series = [
                {
                    name: "first",
                    type: "line",
                    showSymbol: false,
                    hoverAnimation: false,
                    data: [],
                },
                {
                    name: "second",
                    type: "line",
                    showSymbol: false,
                    hoverAnimation: false,
                    data: [],
                }
            ];
            this.option_mean_pos.legend= {
                data: ["first"],
                top: 20,
                right: 0,
                //   设置图例的形状
                icon: "rect",
                //   设置图例的高度
                itemHeight: 1
            };
            mychart.setOption(this.option_mean_pos);

            this.option_mean_neg.series = [];
            this.option_mean_neg.series = [
                {
                    name: "first",
                    type: "line",
                    showSymbol: false,
                    hoverAnimation: false,
                    data: [],
                },
                {
                    name: "second",
                    type: "line",
                    showSymbol: false,
                    hoverAnimation: false,
                    data: [],
                }
            ];
            this.option_mean_neg.legend= {
                data: ["first"],
                top: 20,
                right: 0,
                //   设置图例的形状
                icon: "rect",
                //   设置图例的高度
                itemHeight: 1
            };
            this.$echarts.init(this.$refs.mean_neg).setOption(this.option_mean_neg);

            this.option_var_neg.series = [];
            this.option_var_neg.series = [
                {
                    name: "first",
                    type: "line",
                    showSymbol: false,
                    hoverAnimation: false,
                    data: [],
                },
                {
                    name: "second",
                    type: "line",
                    showSymbol: false,
                    hoverAnimation: false,
                    data: [],
                }
            ];
            this.option_var_neg.legend= {
                data: ["first"],
                top: 20,
                right: 0,
                //   设置图例的形状
                icon: "rect",
                //   设置图例的高度
                itemHeight: 1
            };
            this.$echarts.init(this.$refs.var_neg).setOption(this.option_var_neg);

            this.draw_activation1();
            this.status_act = 1;

            this.init_drawlasso_();
            this.status_lasso_ = 1;
            // this.$refs
        },
        draw_left_distribution() {
            let that = this;
            console.log("left_distribution");
            // console.log(this.initPos.range[0].labels)
            // d3.select('#left_distribution').append("svg")
            d3.select("#left_distribution").selectAll("g").remove();
            // d3.select('#left_distribution').select("svg").selectAll("g").remove()

            // data.forEach(function(item) {
            //   item.value =
            // })
            let left_range = [];
            let right_range = [];
            for (let i = 0; i < this.initPos.range.length; i=i+1) {
                if (i%2 == 0)
                // {}
                    left_range.push(this.initPos.range[i].labels.length);
            }
            for (let i = 0; i < this.initPos.range.length; i=i+1) {
                if (i%2 != 0)
                // {}
                    right_range.push(this.initPos.range[i].labels.length);
            }
            console.log("left_range",left_range);
            var rectWidth = 15;
            var Width = 50;
            var Height = 302;
            var svg = d3.select('#left_distribution').select("svg");
            // Height = 302;
            var data  = [];
            for (let j = 0; j < left_range.length; j++) {


            // for (let i = 0; i < left_range[j].labels.length; i=i+1) {
                // xy[j] = 0
                // data.push({"label":i,"value":left_range[j].labels[i]})
            // }
                data.push({"label":j+1,"value":left_range[j]});
            }
            data.push({"label":that.set_num+1,"value":0});
            // console.log(left_range[j].labels.length);
            console.log("data",data);
            //   // xy[j] = 0
            //   // data.push({"label":j,"value":this.initPos.range[0].labels[j]})
            var gg = svg.append("g")
            // .attr("x",0)
            // .attr("y",Height*j)
                .attr("width",Width)
                .attr("height",Height)
                .attr("fill", "none")
                .attr("fill-opacity",1);
            // .attr("fill",none)
            // .attr("transform",  "translate(0,"+j*Height+")")
            //               // .transform("");
            //               // "translate(" + width / 2 + "," + height / 2 + ")"

            // // var svg = d3.select('#left_distribution')
            // //         .append("svg")
            // //         .attr("width",Width)
            // //         .attr("height",Height);

            // // svg.attr("transform", "translate(50,150)rotate(90)")
            // // var gg = svg.append("g")
            // //         .attr("width",Width-30)
            // //         .attr("height",Height-30)
            //         // .attr("transform", "translate(10, 0)")


            //   var bandScale = d3.scaleBand()
            //           .domain(['Mon', 'Tue', 'Wed', 'Thu', 'Fri'])
            //           .range([0, 200]);
            const xScale = d3.scaleLinear().range([Width,0])
                .domain([d3.min(data, item => item.value)-100,d3.max(data, item => item.value)+100]);

            const yScale = d3.scaleLinear().range([0,Height])
                .domain([d3.min(data, item => item.label),d3.max(data, item => item.label)]);

            gg.append("g")
            // .call(d3.axisBottom(xScale))
                .attr("transform", "translate(0, 0)");

            gg.append("g")
                .call(d3.axisLeft(yScale).ticks(that.set_num))
                .attr("transform", "translate(49, 0)");
            // .attr("stroke", "red");
            gg.selectAll(".tick").selectAll("text").remove();
            const group1 = gg
                .selectAll(".gruop-circle-text")
                .data(data)
                .enter()
                .append('circle')
                .attr("class", "gruop-circle-text")
                .attr("cx", d => {
                    return xScale(d.value) ;
                })
                .attr("cy", d => {
                    return yScale(d.label);
                })
                .attr("name", d => {
                    return [d.label,d.value];
                })
                .attr("r", 5)
                .attr("fill", "green")
                .attr("fill-opacity",0.5)
                .attr("transform",  "translate(0,"+0.5*Height/that.set_num+")")
                .on("mouseover", function (d) {

                    // d3.select(this)
                    //     .attr("r", 10)
                    //     .attr("fill-opacity", 1)

                    // gg.append("text")
                    //     .attr("x", xScale(d.value))
                    //     .attr("y", yScale(d.label))
                    //     .attr("fill", "#BFBFBF")
                    //     .attr("class","left_distribution")
                    //     .text(d.label)

                    gg.append("text")
                        .attr("x", 10)
                        .attr("y", yScale(d.label)+20)
                        .attr("fill", "#BFBFBF")
                        .attr("class","left_distribution")
                        .text(d.value);
                    // console.log(feature_select_all)

                    // console.log(d3.select(this))

                })
                .on("mouseout",function (d){
                    gg.selectAll(".left_distribution").remove();
                });

            const line = d3
                .line()
                .x(d => {
                    // 这里是d3.scaleBand自带比例尺
                    return xScale(d.value);
                })
                .y(d => {
                    return yScale(d.label);
                })
                .curve(d3.curveCatmullRom);  //这里有多种形态可以选择
            data.pop();
            console.log(data);
            gg.append("path")
                .attr("d", line(data))
                .attr("fill", "none")
                .attr("stroke", "purple")
                .attr("transform",  "translate(0,"+0.5*Height/that.set_num+")")
            ;
            // }

        },
        draw_right_distribution() {
            let that = this;
            // console.log("left_distribution")
            // console.log(this.initPos.range[0].labels)
            // d3.select('#left_distribution').append("svg")
            d3.select("#right_distribution").selectAll("g").remove();
            // d3.select('#left_distribution').select("svg").selectAll("g").remove()

            // data.forEach(function(item) {
            //   item.value =
            // })
            let right_range = [];
            // for (let i = 0; i < that.initPos.range.length; i=i+1) {
            //   if (i%2 == 0)
            //   // {}
            //   left_range.push(this.initPos.range[i].labels.length)
            // }
            console.log(that.initPos.range);
            for (let i = 0; i < that.initPos.range.length; i=i+1) {
                if (i%2 != 0)
                // {}
                    right_range.push(that.initPos.range[i].labels.length);
            }
            console.log(right_range);
            var rectWidth = 15;
            var Width = 50;
            var Height = 302;
            var svg = d3.select('#right_distribution').select("svg");
            // Height = 302;
            var data1  = [];
            for (let j = 0; j < right_range.length; j++) {


            // for (let i = 0; i < left_range[j].labels.length; i=i+1) {
                // xy[j] = 0
                // data.push({"label":i,"value":left_range[j].labels[i]})
            // }
                data1.push({"label":j+1,"value":right_range[j]});
            }
            data1.push({"label":that.set_num+1,"value":0});
            //   console.log(left_range[j].labels.length)
            console.log(data1);
            //   // xy[j] = 0
            //   // data.push({"label":j,"value":this.initPos.range[0].labels[j]})
            var gg = svg.append("g")
            // .attr("x",0)
            // .attr("y",Height*j)
                .attr("width",Width)
                .attr("height",Height)
                .attr("fill", "none")
                .attr("fill-opacity",1);
            // .attr("fill",none)
            // .attr("transform",  "translate(0,"+j*Height+")")
            //               // .transform("");
            //               // "translate(" + width / 2 + "," + height / 2 + ")"

            // // var svg = d3.select('#left_distribution')
            // //         .append("svg")
            // //         .attr("width",Width)
            // //         .attr("height",Height);

            // // svg.attr("transform", "translate(50,150)rotate(90)")
            // // var gg = svg.append("g")
            // //         .attr("width",Width-30)
            // //         .attr("height",Height-30)
            //         // .attr("transform", "translate(10, 0)")


            //   var bandScale = d3.scaleBand()
            //           .domain(['Mon', 'Tue', 'Wed', 'Thu', 'Fri'])
            //           .range([0, 200]);

            const xScale = d3.scaleLinear().range([5,Width])
                .domain([d3.min(data1, item => item.value)-100,d3.max(data1, item => item.value)+100]);

            const yScale = d3.scaleLinear().range([0,Height])
                .domain([d3.min(data1, item => item.label),d3.max(data1, item => item.label)]);



            gg.append("g")
            // .call(d3.axisBottom(xScale))
                .attr("transform", "translate(0, 0)");

            gg.append("g")
                .call(d3.axisRight(yScale).ticks(that.set_num))
                .attr("transform", "translate(0, 0)");
            // .attr("stroke", "red");
            gg.selectAll(".tick").selectAll("text").remove();
            const group1 = gg
                .selectAll(".gruop-circle-text")
                .data(data1)
                .enter()
                .append('circle')
                .attr("class", "gruop-circle-text")
                .attr("cx", d => {
                    return xScale(d.value) ;
                })
                .attr("cy", d => {
                    return yScale(d.label);
                })
                .attr("name", d => {
                    return [d.label,d.value];
                })
                .attr("r", 5)
                .attr("fill", "green")
                .attr("fill-opacity",0.5)
                .attr("transform",  "translate(0,"+0.5*Height/that.set_num+")")
                .on("mouseover", function (d) {

                    // d3.select(this)
                    //     .attr("r", 10)
                    //     .attr("fill-opacity", 1)

                    // gg.append("text")
                    //     .attr("x", xScale(d.value))
                    //     .attr("y", yScale(d.label))
                    //     .attr("fill", "#BFBFBF")
                    //     .attr("class","right_distribution")
                    //     .text(d.label)

                    gg.append("text")
                    // .attr("x", xScale(d.value)-20)
                        .attr("x",20)
                        .attr("y", yScale(d.label)+10)
                        .attr("fill", "#BFBFBF")
                        .attr("class","right_distribution")
                        .text(d.value);
                    // console.log(feature_select_all)

                    // console.log(d3.select(this))

                })
                .on("mouseout",function (d){
                    gg.selectAll(".right_distribution").remove();
                });

            const line = d3
                .line()
                .x(d => {
                    // 这里是d3.scaleBand自带比例尺
                    return xScale(d.value);
                })
                .y(d => {
                    return yScale(d.label);
                })
                .curve(d3.curveCatmullRom);  //这里有多种形态可以选择
            data1.pop();
            console.log(data1);
            gg.append("path")
                .attr("d", line(data1))
                .attr("fill", "none")
                .attr("stroke", "purple")
                .attr("transform",  "translate(0,"+0.5*Height/that.set_num+")")
            ;


        }

        // 这里写本页面自定义方法
        // async getDetail() {
        //     let data = await HttpHelper.axiosPost("/detail/getdetail");
        //     // console.log(data.user.name);
        // },
        // async createOne() {
        //     let data = await HttpHelper.axiosPost("/detail/createOne",{title:"test title", desc: "this is test desc"});
        //     this.id = data.id;
        //     // console.log(`createOne ${JSON.stringify(data)}`);
        // },
        // async selectById() {
        //     let data = await HttpHelper.axiosGet("/detail/selectById",{id: this.id});
        //     // console.log(`selectById ${JSON.stringify(data)}`);
        // },
        // async updateOne() {
        //     let data = await HttpHelper.axiosPost("/detail/updateOne",{id: this.id, title:"kwkw", desc: "change desc"});
        //     // console.log(`updateOne ${JSON.stringify(data)}`);
        // },
        // async removeOne() {
        //     // eslint-disable-next-line no-unused-vars
        //     let data = await HttpHelper.axiosGet("/detail/removeOne",{id: this.id});
        //     // console.log(`removeOne ${JSON.stringify(data)}`);
        // },
    },
    created() { // 生命周期中，组件被创建后调用
        // this.getDetail();
        // let d3test = d3.select('body');
        // console.log(d3test);
        // this.createOne();
        // this.selectById();
        // this.updateOne();
        // this.removeOne();
        this.$root.Bus.$on('mean_var', info => {
            // console.log(msg)
            // 把数据给dt接收
            this.mean_var = info;
            console.log(this.mean_var);
            // console.log(this.mean_var.mean_neg)
            // console.log(this.mean_var.var_neg)
            // this.drawmean()

            this.draw_var_neg();
            this.draw_mean_neg();
            this.draw_mean_pos();
            // this.draw_activation()
            // this.draw_activation2()
        }),
        // this.$root.Bus.$on('preprojection', info => {
        // console.log(msg)
        // 把数据给dt接收
        // this.preprojection = info
        // console.log(this.preprojection)
        // console.log(this.mean_var.mean_neg)
        // console.log(this.mean_var.var_neg)
        // this.drawmean()
        // this.draw_activation()
        // d3.select("#Svglasso").selectAll("points").remove();
        // d3.selectAll("Svglasso > *").remove();
        // rave.selectAll("svg").remove();
        // this.drawlasso()
        // })
        this.$root.Bus.$on('feature_select_all', info => {
        // console.log(msg)
        // 把数据给dt接收
            this.feature_select_all = info;
            console.log(this.feature_select_all);

        });
        this.$root.Bus.$on('feature_all', info => {
        // console.log(msg)
        // 把数据给dt接收
            this.feature_all = info;
            console.log(this.feature_all);
        });
        this.$root.Bus.$on('initPos',info=>{
        // console.log("hah")
            this.initPos = info;
            console.log(this.initPos);
        // console.log(initPos)
        // this.init_pos()
        // this.drawsankey()
        //
        });
        // this.$root.Bus.$on('projection', info => {
        //   // console.log(msg)
        //   // 把数据给dt接收
        //   // this.projection = info
        //   console.log(info)
        //   // console.log(this.mean_var.mean_neg)
        //   // console.log(this.mean_var.var_neg)
        //   // this.drawmean()
        //   // this.draw_activation()
        //   this.drawlasso_()
        // })
        this.$root.Bus.$on('get_neg_pos', info=>{
            this.init_drawlasso();
            this.init_neg_pos();
        });
        this.$root.Bus.$on('train_done', info=>{
            if(this.status_act==1&&this.status_lasso_==1&&this.status == 1){
                console.log('train_done for the second time and trigger clear');
                this.clear();
            }
            this.get_pro_act();
        });
        //guidance
        this.$root.Bus.$on('guidance_specification', info=>{
            // Object.assign({}, this.step_current, 1);
            this.step_current = 1;
        });
        this.$root.Bus.$on('guidance_sampling', info=>{
            this.step_current = 2;
        });
        this.$root.Bus.$on('guidance_train', info=>{
            this.step_current = 3;
        });
        this.$root.Bus.$on('guidance_comparison', info=>{
            this.step_current = 4;
        });
        this.$root.Bus.$on('guidance_save', info=>{
            if(this.step_current == 4)
                this.step_current = 5;
        });
        this.$root.Bus.$on('guidance_switch', info=>{
            this.step_current = 1;
        });
        this.$root.Bus.$on('guidance_inference', info=>{
            this.step_current = 7;
        });
    },
};
