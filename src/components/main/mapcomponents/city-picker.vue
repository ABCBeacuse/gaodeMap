<template>
<div id="citypicker">
    <div class="header">
        <span>已选地区:</span>
        <el-tag size="small" v-for="(val,index) in choosedCitys" :key="index" closable @close="removeChoosedCity(val)" :disable-transitions="true">
            {{val.road}}
        </el-tag>
    </div>
    <div class="firstletter">
        <el-button v-for="(i,index) in tagName" :ref="`button${index}`" :key="index" type="info" size="small" @click="changeCityBody(i)">{{i}}</el-button>
        <el-link class="operationbt" type="primary" :disabled="removeAll" :underline="false" @click="removeAllChoosedCity">清空已选</el-link>
    </div>
    <div class="citybody">
        <div class="cityitem" v-for="(i,index) in cityIndex" :key="index" >
            <b v-if="cityJSON[i]" >{{i}}</b>
            <div class="citycontent">
                <el-link :underline="false" v-for="(val,index) in cityJSON[i]" :key="index" @click="chooseCity(val)">{{val.road}}</el-link>
            </div>
        </div>
    </div>
</div>
</template>
<script>
// //导入静态JS街道数据
// import cityList from '@/../data/road.json'
/*
    引入js-pinyin
    getFullChars()：获取字符串全部拼音，并且首字母大写；
    getCamelChars() ： 获取字符串拼音首字母，并大写；
*/
import pinyin from '@/../node_modules/js-pinyin/index'
export default {
    mounted(){
        this.init()
    },
    watch:{
        choosedCitys:{
            handler(val){
                this.$emit("choosedCitysChange",this.choosedCitys);
                if(val.length !== 0){
                    this.removeAll = false;
                    return
                }
                this.removeAll = true;
            },
            deep:true
        }
    },
    data(){
        return{
            //道路名称
            cityList:[],
            //城市首字母(大写)
            cityFirstLetter:[],
            //所有城市
            cityArr:[],
            //以首字母为键的对象，城市数组为对应值
            cityJSON:{},
            //tag表示
            tagName:["ABCDE","FGHJ","KLMN","PORST","WXYZ"],
            //用于citybody的表示
            cityIndex:[], //存取地区首字母
            //用于已选地区的tag表示
            choosedCitys:[],
            removeAll:true
        }
    },
    methods:{
        //将地区按首字母重新分组
        init(){
            let _this = this;
            //配置pinyin
            pinyin.setOptions({checkPolyphone: false, charCase: 0});
            //请求后端
            this.axios.getRoadName().then((res)=>{
                _this.cityList = res.data;
                //拿到所有地区首字母
                for(let i=0;i<_this.cityList.length;i++){
                    let cityName = _this.cityList[i].road;
                    let firstLetter = pinyin.getCamelChars(cityName).substr(0,1);
                    //给所有地区添加first属性
                    _this.cityList[i].first = firstLetter;
                    if(_this.cityFirstLetter.indexOf(firstLetter) == -1)
                        _this.cityFirstLetter.push(firstLetter);
                    _this.cityArr.push(_this.cityList[i]);
                }
                //根据首字母键值分类
                for(let i=0;i<_this.cityFirstLetter.length;i++){
                    _this.cityJSON[_this.cityFirstLetter[i]] = _this.cityArr.filter((value)=>{
                        return value.first === _this.cityFirstLetter[i];
                    })
                }
                // console.log(this.cityJSON);
                //默认先显示ABCDE
                _this.changeCityBody("ABCDE")
            })
        },
        changeCityBody(val){
            this.cityIndex = [];
            for(let i=0;i<val.length;i++){
                this.cityIndex.push(val.substr(i,1));
            }
        },
        //选中地区
        chooseCity(val){
            let map = new Map();
            this.choosedCitys.push(val);
            for(let item of this.choosedCitys){
                if(!map.has(item.id)){
                    map.set(item.id,item);
                }
            }
            this.choosedCitys = [...map.values()];
        },
        //从已选中的tags中移除地区
        removeChoosedCity(val){
            let index = this.choosedCitys.findIndex((v)=> v===val);
            this.choosedCitys.splice(index,1)
        },
        //清空已选择
        removeAllChoosedCity(){
            this.$confirm("此操作将清除已选地区,是否继续?","提示",{
                confirmButtonText:"确定",
                cancelButtonText:"取消",
                type:"warning"
            }).then(()=>{
                this.choosedCitys = [];
            })
        }
    }
}
</script>
<style lang="scss">
#citypicker{
    .header{
        font-size: 14px;
        font-weight: 700;
        color: #5f6477;
        border-bottom: 1px solid #cbcccd;
        padding-bottom: 4px;
        max-height: 110px;
        overflow-y: auto;
    }
    .firstletter{
        padding-top:6px;
        display: flex;
        justify-content: flex-start;
        flex-wrap: nowrap;
        .el-button{
            background-color: #F2F6FC;
            color: #909399;
            padding:5px 3px;
            border: none;
            border-radius: 0;
            box-shadow: none;
            transition: 0.1s linear;
        }
        .el-button:hover,.el-button:focus{
            background-color: #409EFF;
            color: #FFFFFF;
        }
    }
    .operationbt{
        margin-left: 87px;
        font-size: 12px;
    }
    .citybody{
        padding-top: 10px;
        max-height: 170px;
        overflow-y: auto;
        .cityitem{
            b{
                display: block;
                float: left;
                font-weight: 500;
                line-height: 20px;
                padding-top: 2.4px;
            }
            .citycontent{
                display: flex;
                flex-wrap: wrap;
                margin-left: 23px;
                .el-link{
                    margin-right: 9px;
                    color: #999;
                    font-size: 12px;
                }
            }
        }
    }
}

</style>