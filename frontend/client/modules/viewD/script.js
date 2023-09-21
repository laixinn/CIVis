/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import HttpHelper from "common/utils/axios_helper.js";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// const d3cloud = require('d3-cloud');
// import HeatmapOverlay from 'heatmap.js/plugins/leaflet-heatmap'
export default {
    components: { // 依赖组件

    },
    data() { // 本页面数据
        return {
            id: "5d42ac3d9c149c38248c8199",
            InferenceData: [{
                sample:0,
                mse:1,
            },
            {
                sample:0,
                mse:1,
            },
            {
                sample:0,
                mse:1,
            },
            {
                sample:0,
                mse:1,
            }],
            map: "",
        };
    },
    mounted() {
        // this.draw_activation()
        // this.init_map()
    },
    methods: { // 这里写本页面自定义方法
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
        async get_inference()  {
            let getInference = await HttpHelper.axiosGet("/euro/getInference");
            console.log("getInference",getInference);
            let InferenceData = [];
            getInference.forEach(function(item) {
                InferenceData.push({"sample":item.sample,"mse":parseFloat((item.mse).toFixed(2)),"activation":item.activation});

            });
            this.InferenceData = InferenceData;
            // this.handle_activation()
            console.log({InferenceData});
            // this.performaceData = dataget;

            let activation_dict = {};

            console.log("activation_dict",activation_dict);
            getInference.forEach(function(item) {
                let temp = item.activation;
                temp.forEach(function (item2){
                    if (item2.feature in activation_dict ){
                        activation_dict[item2.feature] =  activation_dict[item2.feature] + item2.act ;
                    }
                    else {
                        activation_dict[item2.feature] = item2.act;
                    }

                    // features.push(item2.feature)
                });

            });
            let features = Object.keys(activation_dict);
            console.log(features);

            for (let i in activation_dict) {
              activation_dict[i] = activation_dict[i]/getInference.length
            }
            // let activation_dict_2 = Object.keys(activation_dict).sort();
            // console.log();
            // console.log("activation_dict",activation_dict);
            // console.log("activation_dict_2",activation_dict_2);
            let final_activation = []
            features.forEach(function(item) {
              final_activation.push(activation_dict[item])
            })
            // activation_dict
            console.log("final_activation",final_activation)
            this.draw_activation(features,final_activation)
            
            this.$root.Bus.$emit('guidance_inference');
        },
        handle_activation (row) {
            console.log(row.activation)
            let activation = []
            let features = []
            row.activation.forEach(function(item) {
              activation.push([item.feature,item.act])
              features.push(item.feature)
            })

            console.log(activation)
            // this.activation = activation
            this.draw_activation(features,activation)
        },
        draw_activation(value1,value2) {

            // console.log(features)


            let option_act = {
                grid:{
                    top:"50px",
                    left:"60px",
                    right:"50px",
                    bottom:"40px"
                },
                title: [{
                    text: 'Activation',
                    x: 'center',
                    textStyle: {
                        // fontWeight: 'normal',
                        // fontSize:"17px",
                        color: "#606266",
                    },
                }],
                tooltip: {
                    trigger: 'axis'
                },
                xAxis: {
                    type: 'category',
                    data: value1,
                },
                yAxis: {
                    type: 'value',
                    max:1,
                    min:0,
                },
                series: [
                    {
                        // name: "first",
                        data: value2,
                        type: 'scatter',
                    },
                    // {
                    //   name: "second",
                    //   data: [],
                    //   type: 'scatter',
                    // },
                ],

                legend:{
                    data: [""],
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
            activation_chart.setOption(option_act);

        },

        // init_map() {
        //     // ---------- Init map ------------//
        //     let map = L.map("map", {
        //       minZoom: 3,
        //       maxZoom: 14,
        //       center: [39.550339, 116.114129],
        //       zoom: 12,
        //       zoomControl: false,
        //       attributionControl: false,
        //       crs: L.CRS.EPSG3857
        //     });
        //     this.map = map;　　　　//data上需要挂载
        //     window.map = map;
        //     // 'https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicGF0cmljazExNDc4OTI0MTAiLCJhIjoiY2twODA2Nm8xMDJuMDJvbnI0c3c5MTZ6OSJ9.brE7KTNXR6eJwM1_fAjGtw'
        //     L.tileLayer(
        //       // "https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoib3V5YW5nLSIsImEiOiJja3Z1YnNqemEwdmdzMnBxaTQyOGhiZXhtIn0.E14urAFYeg-LfemIOC-Hyg"
        //       // "https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoib3V5YW5nLSIsImEiOiJja3Z1YnNqemEwdmdzMnBxaTQyOGhiZXhtIn0.E14urAFYeg-LfemIOC-Hyg"
        //       // 'https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicGF0cmljazExNDc4OTI0MTAiLCJhIjoiY2twODA2Nm8xMDJuMDJvbnI0c3c5MTZ6OSJ9.brE7KTNXR6eJwM1_fAjGtw'

        //       "https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoib3V5YW5nLSIsImEiOiJja3Z1ZDdiejEwbWJ5MnBqdDY0dTFuZGh4In0.eUbkl2shIMBmzHX7VJIrfQ"
        //       // 'https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicGF0cmljazExNDc4OTI0MTAiLCJhIjoiY2twODA2Nm8xMDJuMDJvbnI0c3c5MTZ6OSJ9.brE7KTNXR6eJwM1_fAjGtw'
        //       // 'https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoib3V5YW5nLSIsImEiOiJja3Z1YzAyaGIxMDIzMm9tOXMxajlrMXpjIn0.dARPspATWOgMaoZ32O0PSQ'
        //       // 'https://api.mapbox.com/styles/v1/ouyang/tiles/{z}/{x}/{y}?access_token={pk.eyJ1Ijoib3V5YW5nLSIsImEiOiJja3Z1YzAyaGIxMDIzMm9tOXMxajlrMXpjIn0.dARPspATWOgMaoZ32O0PSQ}'
        //       // "https://api.mapbox.com/tokens/v2/ouyang-?access_token=pk.eyJ1Ijoib3V5YW5nLSIsImEiOiJja3Z1YzAyaGIxMDIzMm9tOXMxajlrMXpjIn0.dARPspATWOgMaoZ32O0PSQ"

        //     ).addTo(map);

        // }
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
    },
};
