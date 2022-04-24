<template>
    <el-descriptions title="信息" :column="1" size="small" border>
        <template slot="extra">
            <el-button type="text" style="padding:5px 0px;" icon="el-icon-close" @click="closeInfoWindow"></el-button>
        </template>
        <!-- https://element.eleme.cn/#/zh-CN/component/descriptions -->
        <el-descriptions-item label="所属道路"></el-descriptions-item>
        <el-descriptions-item label="类型"></el-descriptions-item>
        <el-descriptions-item label="井深"></el-descriptions-item>
        <el-descriptions-item label="坐标">
            <el-button type="text" icon="el-icon-place" size="small"></el-button>
        </el-descriptions-item>
        <el-descriptions-item label="备注"></el-descriptions-item>
    </el-descriptions>
</template>
<script>
export default {
    data(){
        return{

        }
    },
    methods:{
        closeInfoWindow(){

        }
    }
}
</script>
<style lang="scss">
.el-descriptions{
    background-color: white;
    box-shadow: 0 1px 1px #e8e8e8;
    border-radius:4px;
    padding: 7px;
    .el-descriptions__header{
        margin-bottom: 9px;
    }
    .el-button--text{
        color: #909399;
        padding: 0px;
    }
}
</style>