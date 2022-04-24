<template>
    <div id="mainWindow">
        <div id="map"></div>
        <transition name="el-fade-in-linear">
            <div class="searchdiv" v-show="searchShow">
                <el-input placeholder="搜索井盖、缺陷、街道" v-model="location" clearable>
                    <div slot="append">
                        <el-button icon="iconfont icon-sousuo" @click="locationSearch"></el-button>
                        <el-button icon="iconfont icon-didian" @click="locationCheck">
                            <el-badge :value="locationNum" class="item"></el-badge>
                        </el-button>
                    </div>
                </el-input>
                <el-button class="streetbox" @click="changeStreet">
                    <b>地区选择</b>
                    <i class="el-icon-caret-bottom" />
                </el-button>
                <transition name="el-fade-in-linear">
                    <div class="streetwindow" v-show="streetWindow">
                        <CityPicker v-on:choosedCitysChange="resultCitysChoosed" />
                    </div>
                </transition>
                <transition name="el-fade-in-linear">
                    <div class="resultwindow" v-show="locationResultShow">
                        <div class="resultitem" v-for="(local,i) in locationResult" :key="i" @click="locationMove(local)">
                            <i class="el-icon-location-outline"></i>
                            <span>
                                {{local.name}}
                            </span>
                        </div>
                    </div>
                </transition>
            </div>
        </transition>
        <el-button class="operationbox" icon="el-icon-s-operation" @click="openOperationWindow()">操作</el-button>
        <div class="functionbox">
            <transition name="el-fade-in-linear">
                <el-button-group class="functions" v-show="operationBox">
                    <el-button type="primary" plain icon="el-icon-copy-document" @click="openOpacityWindow"><b>透明度</b></el-button>
                    <el-button type="primary" plain icon="el-icon-search" @click="openSearchDiv">搜索</el-button>
                    <el-button type="primary" plain icon="el-icon-coin"><b>统计</b></el-button>
                    <el-button type="primary" plain icon="el-icon-setting" @click="openSwitchWindow"><b>开关</b></el-button>
                </el-button-group>
            </transition>
        </div>
        <!-- 透明度窗口 -->
        <el-dialog custom-class="opacityDialog" v-dialogDrag title="透明度" :visible.sync="opacityWindow" width="20%" top="65vh" :modal="false" :lock-scroll="false" :close-on-click-modal="false">
            <el-button-group>
                <el-button v-for="(val,index) in opacity" :key="index" @click="changeSatelliteLayerOpacity(val)"><b>{{val}}</b></el-button>
            </el-button-group>
        </el-dialog>
        <!-- 开关综合窗口 -->
        <el-dialog custom-class="switchDialog" title="开关控制" v-dialogDrag :visible.sync="switchWindow" width="24%" top="15.7vh" :modal="false" :lock-scroll="false" :close-on-click-modal="false">
            <div class="switchdiv">
                <div class="title">管道类型</div>
                <div class="pipeTypeSwitch">
                    <div class="switchitem" v-for="(val,index) in pipeTypeSwitchs" :key="index">
                        <b :class="{'choosed':val.value}">{{val.pipeName}}</b>
                        <el-switch v-model="val.value"></el-switch>
                    </div>
                </div>
                <div class="title">点标记类型</div>
                <div class="pointswitch">
                    <div class="switchitem" v-for="(val,index) in pointSwitchsGroup" :key="index">
                        <b :class="{'choosed':val.value}">{{val.pointName}}</b>
                        <el-switch v-model="val.value" @change="callback(val.value,val.method)"></el-switch>
                    </div>
                </div>
            </div>
        </el-dialog>
        <AlertWindow ref="infoWindowComponent" v-show="showInfoWindow" />
    </div>
</template>
<script>
//引入高德地图
import AMapLoader from '@amap/amap-jsapi-loader';
//引入弹框组件
import AlertWindow from '../main/mapcomponents/AlertWindow.vue'
//引入地区选择组件
import CityPicker from '../main/mapcomponents/city-picker.vue'
//引入百度地图坐标转换为高德地图js文件
import {processJSONData} from '../../tool/process_json'

export default {
    name:"MainWindow",
    components:{
        AlertWindow,
        CityPicker
    },
    mounted(){
        this.initMap();
        this.initPipeType();
    },
    data(){
        return{
            //声明地图对象
            map:null,
            labelsLayer:null,
            //操作区
            operationBox:false,       
            //搜索框div
            searchShow:false,
            location:"",
            locationResult:[
                {name:"乳山市气象局",center:[121.546214,36.92858]},
                {name:"乳山市人民医院",center:[121.526589,36.918108]},
                {name:"乳山市市场监督管理局",center:[121.548389,36.931494]},
                {name:"乳山市水利工程公司",center:[121.50902,36.954336]}
            ],
            locationResultShow:false,
            locationNum:12,
            //所选道路最终结果(仅存储名字)
            roadsChoosed:[],
            //街道选择
            streetWindow:false,
            //自定义信息弹框初始不显示
            showInfoWindow:false,
            //透明度窗口
            opacityWindow:false,
            opacity:[0,0.3,0.6,1],
            satelliteLayer:null,
            //开关综合窗口
            switchWindow:false,
            //雨水 污水 暗渠 明沟 河道
            pipeTypeSwitchs:[],
            pointSwitchsGroup:[
                {pointName:"接入点",value:false,method:""},{pointName:"溢流口",value:false,method:""},
                {pointName:"混接点",value:false,method:"initMixedConcatPoints"},{pointName:"排水口",value:false,method:""},
                {pointName:"整改缺陷",value:false,method:""},{pointName:"重点企业",value:false,method:""},
                {pointName:"井盖",value:false,method:""},{pointName:"缺陷",value:false,method:""}
            ],
            //地图上的混接点集合LabelMarkers
            mixedConcatPoints:[],
            mixedConcatimage:require("../../img/switchIcon/mixed_concat.png"),
        }
    },
    methods:{
        initMap(){
            AMapLoader.load({
                key:"09bb81c94e61b8802173b45afe68aa86",
                version:"2.0",
                plugins:['AMap.ToolBar','AMap.ControlBar','AMap.DistrictSearch'],   //需要使用的插件列表
            }).then((AMap)=>{
                let _this = this;
                this.map = new AMap.Map("map",{  //容器id
                    viewMode:"3D",
                    zoom:10.5,
                    zooms:[2,16.6],
                    center:[121.53,36.92]
                });
                //创建一个标注层实例
                this.labelsLayer = new AMap.LabelsLayer({
                    collision:true,
                    opacity:1,
                    allowCollision:true
                })
                this.map.addLayer(this.labelsLayer);
                //添加一个卫星图层
                this.satelliteLayer = new AMap.TileLayer.Satellite();
                this.map.addLayer(this.satelliteLayer);
                //地图控件
                this.map.addControl(new AMap.ToolBar({
                    position:{right:"40px",top:"170px"}
                }));
                this.map.addControl(new AMap.ControlBar({
                    position:{top:"70px",right:"10px"}
                }));
                //根据乳山县区域边界坐标高亮标识边界
                //获取边界坐标
                let districtSearch = new AMap.DistrictSearch({
                    level:"city",
                    showbiz:false,
                    extensions:"all",
                    subdistrict:0
                });
                districtSearch.search('乳山市', function(status, result){
                    //背景四角
                    let outer = [
                        new AMap.LngLat(-360,90,true),
                        new AMap.LngLat(-360,-90,true),
                        new AMap.LngLat(360,-90,true),
                        new AMap.LngLat(360,90,true)
                    ];
                    //乳山市边界坐标
                    let holes = result.districtList[0].boundaries;
                    let pathArray = [outer];
                    //合并数组
                    pathArray.push.apply(pathArray,holes)
                    let polygon = new AMap.Polygon({
                        path:pathArray,
                        strokeColor:'#00eeff',
                        fillColor:"black",
                        fillOpacity:0.5 //默认为0.5
                    });
                    _this.map.add(polygon);
                });
            }).catch(e=>{
                console.log(e);
            });
        },
        changeStreet(){
            //点击改变上下箭头指向
            let dom = document.querySelector(".streetbox i");
            this.streetWindow = !this.streetWindow;
            if(dom.style.getPropertyValue("transform")){
                dom.style.removeProperty("transform");
                return
            }
            dom.style.setProperty("transform","rotate(180deg)");
        },
        locationSearch(){
            let type = this.location.substr(0,1); //查找字符串第一个字符
            console.log(type);
            //根据查找类别来动态更换显示的icon
        },
        locationCheck(){
            this.locationResultShow = !this.locationResultShow;
        },
        locationMove(val){
            let _this = this;
            //删除原地图标记
            this.labelsLayer.clear();
            //改变地图中心点
            this.map.panTo(val.center);
            //添加地图标记
            let marker = this.addPointMarker("//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-red.png",val.center);
            marker.on("click",function(){
                _this.initAlertWindow(val).open(_this.map,val.center);
            })
            this.labelsLayer.add(marker);
            this.map.setZoom(16.5);
        },
        /*
            实例化点标记
            icon: String 
            position: Array数组
        */
        addPointMarker(iconURL,position){
            return new AMap.LabelMarker({
                icon:{
                    image:iconURL,
                    size:[25,34]
                },
                position:position,
                offset:new AMap.Pixel(-47,0)
            });
        },
        // 创建infowindow并初始化组件信息
        initAlertWindow(val){
            //val中有初始化的信息
            let _this = this;
            this.showInfoWindow = true;
            return new AMap.InfoWindow({
                isCustom:true,
                content:_this.$refs.infoWindowComponent.$el,
                position:val.center,
                anchor:"bottom-left",
                offset:[10,-20]
            })
        },
        openOpacityWindow(){
            this.opacityWindow = !this.opacityWindow;
        },
        changeSatelliteLayerOpacity(val){
            this.satelliteLayer.setOpacity(val);
        },
        openSearchDiv(){
            this.searchShow = !this.searchShow;
        },
        openSwitchWindow(){
            this.switchWindow = !this.switchWindow;
        },
        //开关区管道类型开关获取
        initPipeType(){
            //后端返回的仅有pipeType,这里将其与名称对应
            let pipeTypeName=["暗渠","河道","明沟","污水","雨水"];
            let _this = this;
            this.axios.getPipeType().then((res)=>{
                pipeTypeName.forEach((item,index)=>{
                    res.data[index+1]["pipeName"] = item;
                    res.data[index+1]["value"] = true;
                })
                res.data.splice(0,1);
                _this.pipeTypeSwitchs =res.data;
            })
        },
        //按照开关对应的方法名来执行对应的方法
        callback(statu,methodName){
            if(statu){
                this[methodName]();
            };
        },
        initMixedConcatPoints(){
            //先清除上次的查询混接点
            if(this.mixedConcatPoints.length !=0){
                this.labelsLayer.remove(this.mixedConcatPoints);
            }
            let pointsJSON = [];
            let _this = this;
            this.axios.getMixedConcatPoint().then((res)=>{
                //转化好高德的坐标的JSON
                pointsJSON = processJSONData(res.data,"mapLon","mapLat");
                pointsJSON.forEach((element)=>{
                    let point = _this.addPointMarker(this.mixedConcatimage,element.position);
                    _this.mixedConcatPoints.push(point);
                })
                this.labelsLayer.add(this.mixedConcatPoints);
            });
        },
        openOperationWindow(){
            this.operationBox = !this.operationBox;
        },
        //所选城市改变时触发,val是所选城市数组
        resultCitysChoosed(val){
            this.roadsChoosed = [];
            val.forEach((item)=>{
                this.roadsChoosed.push(item.road)
            });
            console.log(this.roadsChoosed);
        }
    }
}
</script>
<style lang="scss">
#mainWindow{
    width: 100%;
    height: 100%;
    position: relative;
    b{
        font-size: 13px;
    }
    #map{
        width: 100%;
        height: 100%;
    }
    .searchdiv{
        display: flex;
        position: absolute;
        left: 13px;
        top:17px;
        .el-input__inner{
            height: 41px;
        }
        .el-badge{
            position: absolute;
            right: 0px;
            top: 0;
        }
        .streetbox{
            margin-left: 19px;
            padding: 12px 16px;
            transition: 0.4s linear;
            i{
                transition: 0.4s linear;
            }
        }
        .streetbox:hover,.streetbox:focus{
            color: #409EFF;
            background-color: white;
        }
        .streetwindow{
            position: absolute;
            top: 52px;
            right: -321px;
            padding: 6px 15px 15px;
            background-color: white;
            line-height: 26px;
            width: 391px;
            text-align: left;
            border-radius:4px;
        }
        .resultwindow{
            position: absolute;
            top: 45px;
            text-align: left;
            min-width: 326px;
            background: #FFF;
            border-radius:4px;
            padding-left: 2px;
            .resultitem{
                color:#404040;
                line-height: 32px;
                cursor:pointer;
                white-space: nowrap;
                font-size: 13.5px;
                text-overflow: ellipsis;
                padding-left: 7px;
                transition: .2s linear;
                i{
                    color: #C0C4CC;
                    font-size: 15px;
                }
            }
            .resultitem:hover{
                background-color: #EBEEF5;
            }
        }
    }
    .operationbox{
        position: absolute;
        right: 13px;
        top: 17px;
    }
    .functionbox{
        position: absolute;
        right: 36.5%;
        bottom: 30px;
        .el-button-group{
            height:45px;
            .el-button{
                height: 100%;
            }
        }
    }
    .opacityDialog{
        left: 7vh;
        min-width: 261px;
    }
    .switchDialog{
        left: 65vh;
        min-width: 339px;
        .el-dialog__header{
            display: flex;
            justify-content: space-between;
            .el-dialog__title{
                font-size: 14px ;
            }
            .el-dialog__headerbtn{
                top: 16px;
            }
        }
        .el-dialog__body{
            padding: 20px;
            .switchdiv{
                .title{
                    text-align: left;
                    border-bottom: 1px solid #E4E7ED;
                    font-size: 13px;
                    padding-bottom: 4px;
                    color: #606266;
                }
                .pipeTypeSwitch,.pointswitch{
                    width: 100%;
                    margin-top: 13px;
                    display: flex;
                    justify-content: flex-start;
                    flex-wrap: wrap;
                    padding-left: 10px;
                }
                .switchitem{
                    width: 94px;
                    margin-bottom: 12px;
                    margin-right: 5px;
                    display: flex;
                    justify-content: space-between;
                    b{
                        width: 60px;
                        text-align: center;
                        margin-right: 2px;
                        transition: .2s linear;
                    }
                    b.choosed{
                        color: #409EFF;
                    }
                }
            }
        }
    }
    .el-dialog__wrapper{
        pointer-events: none;
        .el-dialog{
            pointer-events: auto;
            .el-dialog__header{
                padding: 13px 20px 10px;
                background-color: #DCDFE6;
            }
        }
    }
}
</style>