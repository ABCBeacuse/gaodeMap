<template>
    <div id="Aside">
        <el-menu
          :default-active="$route.path"
          class="el-menu-vertical-demo"
          text-color="rgb(92,92,92)"
          active-text-color="#409EFF"
          :router="true"
          :collapse="isCollapse"
          >
          <el-menu-item class="menucontrol" @click="changeCollapse">
              <div class="menuItem">
                <i class="el-icon-menu"></i>
              </div>
          </el-menu-item>
          <el-menu-item v-for="(i) in menuList" :key="i.itemIndex" :index="i.itemIndex" @click="setTagName(i.itemName)">
              <el-tooltip :disabled="!isCollapse" class="item" effect="dark" :content="i.itemName" placement="right">
                <div class="menuItem">
                    <i :class="i.icon"></i>
                    <span slot="title">{{i.itemName}}</span>
                </div>
              </el-tooltip>
          </el-menu-item>
        </el-menu>
    </div>
</template>
<script>
export default {
    name:"AsideMenu",
    data(){
        return{
            menuList:[
                {itemName:"主界面",icon:"el-icon-s-home",itemIndex:"/detailMap"},
                {itemName:"报表界面",icon:"el-icon-notebook-2",itemIndex:"/report"},
                {itemName:"设置界面",icon:"el-icon-set-up",itemIndex:"/setting"}
            ],
            isCollapse:true
        }
    },
    methods:{
        changeCollapse(){
            this.isCollapse = !this.isCollapse;
        },
        setTagName(name){
            //把菜单名称放进去,当成tab页的名称
            this.$store.commit('set_tagName',name)
        }
    }
}
</script>
<style lang="scss">
#Aside{
    height: 100%;
    .el-menu{
        height: 100%;
        .menucontrol{
            border-bottom: 1px solid #e8e8e8;
            text-align: center;
        }
        .menuItem{
            transition: .1s linear;
        }
        .menuItem:hover *{
            color: #409EFF;
        }
    }
    .el-menu-item{
        text-align: left;
    }
    .el-menu-vertical-demo:not(.el-menu--collapse) {
        width: 190px;
    }
}
</style>