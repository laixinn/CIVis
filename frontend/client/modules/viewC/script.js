/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import HttpHelper from "common/utils/axios_helper.js";
// import { get } from "mongoose";
export default {
    components: { // 依赖组件

    },
    watch: {
      performaceData(newVal, oldVal){

        let loss_semi = this.performaceData.loss_semi
        let loss_half = this.performaceData.loss_half
        let loss_full = this.performaceData.loss_full


        // let rmse_semi = this.performaceData.rmse_semi
        // let rmse_half = this.performaceData.rmse_half
        // let rmse_global = this.performaceData.rmse_global
        let val_full_loss =this.performaceData.val_full_loss
        let val_semi_loss =this.performaceData.val_semi_loss


        let con_loss = this.performaceData.con_loss
        let sup_loss = this.performaceData.sup_loss
        let mean_neg = this.performaceData.mean_neg
        let mean_pos = this.performaceData.mean_pos
        let var_neg = this.performaceData.var_neg

        let activation = this.performaceData.activation

        let train_flag = this.performaceData.train_flag
        // let loss_semi = this.performaceData.loss_semi
        // let performaceData_V = this.performaceData["V_results"]
        // console.log("ahhaha")
        // if(performaceData_L == 3){
        this.loss_semi = loss_semi
        this.loss_half = loss_half
        this.loss_full = loss_full

        this.con_loss = con_loss
        this.sup_loss = sup_loss

        // this.rmse_semi = rmse_semi
        // this.rmse_half = rmse_half
        // this.rmse_global = rmse_global

        this.val_full_loss = val_full_loss
        this.val_semi_loss = val_semi_loss

        this.mean_neg = mean_neg
        this.mean_pos = mean_pos
        this.var_neg = var_neg
        this.activation = activation
        // this.acc.push({"name":performaceData_L,"value":80*performaceData_L})
        this.drawLine1()
        this.drawLine2()
        this.$root.Bus.$emit('mean_var', JSON.parse(JSON.stringify(this.performaceData)))
        // this.$root.Bus.$emit('projection', "hahh")

        // var getmsg = HttpHelper.axiosGet("/euro/startTrain");
        // console.log(getmsg)
        if (train_flag == true) {
            clearInterval(this.dataTimer);
            console.log("Train Done");
            this.$root.Bus.$emit('train_done');
            this.$root.Bus.$emit('guidance_train');
        }
        // console.log(this.performaceData.loss_semi.length)
        // if (loss_semi.length == 360) {
        //   clearInterval(this.dataTimer);
        //   console.log("Train Done")
        // }

        // this.$root.Bus.$emit('mean_pos', JSON.parse(JSON.stringify(this.mean_pos)))
        // if (performaceData_L == this.iteration_num) {
        //   clearInterval(this.dataTimer);
        //   // this.lineChart2()
        // }

      }
    },
    data() { // 本页面数据
        return {
            id: "5d42ac3d9c149c38248c8199",
            learning_rate: 0.001,
            // iteration_num: 5,
            epoch:0,
            temperature:0,
            m:0,
            performaceData:[],
            data:[],
            neg_st:[],
            feature:[],
            neg:[],
            raw: [
              { "acc": 0.625, "auc": 0.45454545454545453, "iter": 0 },
              { "acc": 0.625, "auc": 0.46394984326018807, "iter": 1},
              { "acc": 0.625, "auc": 0.4670846394984326, "iter": 2 },
              { "acc": 0.675, "auc": 0.46708463949843265, "iter": 3 },
              { "acc": 0.675, "auc": 0.4702194357366771, "iter": 4},
              { "acc": 0.675, "auc": 0.47648902821316613, "iter": 5},
              { "acc": 0.675, "auc": 0.47648902821316613, "iter": 6}
            ],
            loss_semi: [],
            sup:[],
            con:[],
            rmse_semi:[],
            mean_neg:[],
            mean_pos:[],
            var_neg:[],

            // anchor: [
            //   { name: "1", value: 40 },
            //   { name: "2", value: 60 },

            // ],
            option: {
              grid:{
                top:"60px",
                left:"30px",
                right:"20px",
                bottom:"30px"
              },
              animation:false,
              title: {
                text: "loss+acc",
                textStyle: {
                  // fontWeight: 'normal',
                  fontSize:"17px",
                  color: "#606266",
                },
              },
              tooltip: {
                trigger: 'axis'
              },
              // 设置折现对应的颜色

              legend: {
                data: ["loss", "acc"],
                top: 20,
                right: 0,
                //   设置图例的形状
                icon: "rect",
                //   设置图例的高度
                itemHeight: 1
              },
              xAxis: {
                // name:"epoch",
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

                //解决白色的横线 show改为false即可
                splitLine: {
                  show:false,     //y网格线
                  lineStyle:{
                    color: '#a7abab'
                  }
                },
                //最小值和最大值根据传入进来的值变化
                min: function(value){
                  return value.min-5;
                },
                max:function(value){
                  return 0.5;
                },

              },
              series: [
              ]
            },
            acc_option: {
              grid:{
                top:"60px",
                left:"30px",
                right:"20px",
                bottom:"30px"
              },
              animation:false,
              title: {
                text: "loss+acc",
                textStyle: {
                  fontSize:"17px",
                  // fontWeight: 'normal',
                  color: "#606266",
                },
              },
              tooltip: {
                trigger: 'axis'
              },
              // 设置折现对应的颜色

              legend: {
                data: ["loss", "acc"],
                top: 20,
                right: 0,
                //   设置图例的形状
                icon: "rect",
                //   设置图例的高度
                itemHeight: 1
              },
              xAxis: {
                // name:"epoch",
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

                //解决白色的横线 show改为false即可
                splitLine: {
                  show:false,     //y网格线
                  lineStyle:{
                    color: '#a7abab'
                  }
                },
                //最小值和最大值根据传入进来的值变化
                min: function(value){
                  return value.min-5;
                },
                max:function(value){
                  return 0.5;
                },

              },
              series: [
              ]
            },
            //marks
            lr_marks: {
              0.001: '0.001',
              0.1: '0.1'
            },
            temp_marks: {
              0.01: '0.01',
              1: '1'
            },
            epo_marks: {
              10: '10',
              1000:'1000'
            },
            m_marks:  {
              0: '0',
              1: '1'
            }
        }
    },
    mounted() {
      this.drawLine1();
      this.drawLine2();
      // this.formatData(this.raw)
      // this.lineChart1()
    },
    methods: { // 这里写本页面自定义方法

      drawLine1() {

        // 基于准备好的dom，初始化echarts实例
        // this.option.series[0].data = this.loss_semi;
        // this.option.series[1].data = this.sup;
        // this.option.series[2].data = this.con;
        this.option.grid = {
          top:"60px",
          left:"40px",
          right:"10px",
          bottom:"20px"
        }
        this.option.series = [
          {
            name: "loss_semi",
            type: "line",
            showSymbol: false,
            hoverAnimation: false,
            data: this.loss_semi,
            itemStyle: {
                normal: {
                    opacity: 0.8,
                }
            },
          },
          {
            name: "sup",
            type: "line",
            showSymbol: false,
            hoverAnimation: false,
            data: this.sup_loss,
            itemStyle: {
              normal: {
                  opacity: 0.8,
              }
            },
          },
          // 自定义坐标
          {
            name: "con",
            type: "line",
            showSymbol: false,
            hoverAnimation: false,
            data: this.con_loss,
            itemStyle: {
              normal: {
                  opacity: 0.8,
              }
            },
          },
          // {
          //   name: "loss_half",
          //   type: "line",
          //   showSymbol: false,
          //   hoverAnimation: false,
          //   data: this.loss_half,
          // },
          {
            name: "loss_full",
            type: "line",
            showSymbol: false,
            hoverAnimation: false,
            data: this.loss_full,
            itemStyle: {
              normal: {
                  opacity: 0.8,
              }
            },
          }
        ];
        this.option.yAxis= {
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

          //解决白色的横线 show改为false即可
          splitLine: {
            show:false,     //y网格线
            lineStyle:{
              color: '#a7abab'
            }
          },
          //最小值和最大值根据传入进来的值变化
          min: (value) => {
            // parseFloat((d.percentage*100).toFixed(2))
            return value.min.toFixed(2)
          },
          max: (value) => {
            return value.max.toFixed(2)
          }

        },
        this.option.color = ['#ef9a9a',
                            '#b39ddb',
                            '#90caf9',
                            '#80cbc4',
                            '#c5e1a5',
                            // '#ffe082',
                            // '#bcaaa4',
                            // '#b0bec5',
                            // '#eeeeee'],
                            ],
        this.option.title.text ="Train";
        this.option.legend= {
          data: ["loss_semi","sup","con","loss_full"],
          top: 20,
          right: 0,
          //   设置图例的形状
          icon: "rect",
          //   设置图例的高度
          itemHeight: 1
        };
        // this.option.series[2].data = this.anchor;
        // console.log();
        // if(myChart1!=NULL) {
        //   myChart1.dispose();
        // };
        // if(myChart2!=NULL) {
        //   myChart2.dispose();
        // };

        let myChart1 = this.$echarts.init(this.$refs.chart1);
        // let myChart2 = this.$echarts.init(this.$refs.chart2);
        // myChart1.clear(" this.option.series[0].data", this.option.series);
        // myChart2.clear(" this.option.series[0].data", this.option.series);
        // 绘制图表
        myChart1.setOption(this.option);
        // this.option.series[0].data = 0;
        // this.option.series[1].data = this.acc;
        // myChart2.setOption(this.option);

      },
      drawLine2() {
        // 基于准备好的dom，初始化echarts实例
        this.acc_option.grid = {
          top:"60px",
          left:"40px",
          right:"10px",
          bottom:"20px"
        }
        this.acc_option.series = [
          {
            name: "val_full_error",
            type: "line",
            showSymbol: false,
            hoverAnimation: false,
            data: this.val_full_loss,
            itemStyle: {
              normal: {
                  opacity: 0.8,
              }
            },
          },
          {
            name: "val_semi_error",
            type: "line",
            showSymbol: false,
            hoverAnimation: false,
            data: this.val_semi_loss,
            itemStyle: {
              normal: {
                  opacity: 0.8,
              }
            },
          },
          // {
          //   name: "rmse_half",
          //   type: "line",
          //   showSymbol: false,
          //   hoverAnimation: false,
          //   data: this.rmse_half,
          // },
        ];
        this.acc_option.yAxis= {
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

          //解决白色的横线 show改为false即可
          splitLine: {
            show:false,     //y网格线
            lineStyle:{
              color: '#a7abab'
            }
          },
          //最小值和最大值根据传入进来的值变化

          min: (value) => {
            // parseFloat((d.percentage*100).toFixed(2))
            return value.min.toFixed(2)
          },
          max: (value) => {
            return 0.3
          }

        },


        this.acc_option.title.text ="Validation";


        // this.option.color = ['#ef9a9a',
        //                     // '#b39ddb',
        //                     // '#90caf9',
        //                     // '#80cbc4',
        //                     '#c5e1a5',
        // // '#ffe082',
        // // '#bcaaa4',
        //   '#b0bec5',
        // // '#eeeeee'],
        // ],
        this.acc_option.legend= {
          // data: ["rmse_semi","rmse_half","rmse_global"],
          data:["val_full_error","val_semi_error"],
          top: 20,
          right: 0,
          //   设置图例的形状
          icon: "rect",
          //   设置图例的高度
          itemHeight: 1
        };

        // this.option.series[2].data = this.anchor;
        // console.log();
        // if(myChart1!=NULL) {
        //   myChart1.dispose();
        // };
        // if(myChart2!=NULL) {
        //   myChart2.dispose();
        // };
        let myChart2 = this.$echarts.init(this.$refs.chart2);
        // let myChart2 = this.$echarts.init(this.$refs.chart2);
        // myChart2.clear(" this.option.series[0].data", this.option.series);
        // myChart2.clear(" this.option.series[0].data", this.option.series);
        // 绘制图表
        myChart2.setOption(this.acc_option);

      },
      runmodel() {

        let req = {
          // "sampled_id": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50],
          // "sampled_id": sample_id,
          // "host_index": this.featureL,
          // "guest_index": this.featureV,
          // "feature": JSON.parse(JSON.stringify(this.feature)),
          // "neg_st": JSON.parse(JSON.stringify(this.neg_st)),
          // "neg": JSON.parse(JSON.stringify(this.neg)),
          "learning_rate": this.learning_rate,
          "epoch": this.epoch,
          "temperature": this.temperature,
          "m":this.m,
        }
        console.log(req);
        this.performaceData = []
        // this.runStatus = 1;
        this.dataTimer = setInterval(() => {
          this.getData();
        }, 2000);
        // let data = await HttpHelper.axiosGet("/euro/getData",{});
        // HttpHelper.axiosPost("/run", JSON.stringify(req));
        HttpHelper.axiosPost("/euro/startTrain",JSON.stringify(req));
      },
      stopmodel() {
        // let data = await HttpHelper.axiosGet("/euro/getData",{});
        // HttpHelper.axiosPost("/run", JSON.stringify(req));
        HttpHelper.axiosPost("/euro/stopTrain");
      },
      async getData() {
        let dataget = await HttpHelper.axiosGet("/euro/getDynamicData");
        // console.log({datagetdata});
        this.performaceData = dataget;
        console.log(this.performaceData);
      },
      async add() {
        let mse = await HttpHelper.axiosGet("/euro/saveModel");
        let Model_result = {"mse":mse,"M":this.m,"Temperature":this.temperature,"learning_rate":this.learning_rate,"epoch":this.epoch}
        this.$root.Bus.$emit('model_result', Model_result)
        // console.log({datagetdata});
        // this.performaceData = dataget;
        // console.log(this.performaceData);
      }
    },
    created() { // 生命周期中，组件被创建后调用

      this.$root.Bus.$on('neg', info => {
          // console.log(msg)
          // 把数据给dt接收
          this.neg = info
      });
      this.$root.Bus.$on('feature', info => {
        // console.log(msg)
        // 把数据给dt接收
          this.feature = info
      });
      this.$root.Bus.$on('add_one', info => {
        // console.log(msg)
        // 把数据给dt接收
          this.add()
          // this.feature = info
      });
      // this.$root.Bus.$on('neg_sample', info => {
      //   // console.log(msg)
      //   // 把数据给dt接收
      //     this.neg_sample = info
      // })

    },
};
