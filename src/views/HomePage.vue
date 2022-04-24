<template>
  <div id="HomePage">
    <el-header>
      <div id="logoDiv">
        <img src="../img/logo.png" />
      </div>
      <div class="userInfo">
        <el-tag color="rgb(50,92,149)">
          <i class="el-icon-user-solid" />&nbsp;{{ userInfo.userNum }}
        </el-tag>
        <el-button type="text" class="help"
          ><i class="el-icon-question" />&nbsp;帮助</el-button
        >
        <el-button type="text" class="exit">退出</el-button>
      </div>
    </el-header>
    <el-container>
      <el-aside width="initial"><AsideMenu /></el-aside>
      <el-container>
        <div class="tabsTemplate">
          <el-tabs
            v-model="activeIndex"
            type="card"
            closable
            @tab-click="tabClick"
            @tab-remove="tabRemove"
          >
            <el-tab-pane
              :key="item.name"
              v-for="item in tags"
              :name="item.route"
              :label="item.name"
            >
            </el-tab-pane>
          </el-tabs>
        </div>
        <el-main>
          <keep-alive :include="tagsList">
            <router-view/>
          </keep-alive>
        </el-main>
        <el-footer></el-footer>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import AsideMenu from "../components/aside/AsideMenu.vue";

export default {
  components: {
    AsideMenu,
  },
  mounted(){
    this.init();
  },
  data() {
    return {
      userInfo: {
        userNum: "用户1500075",
      },
      editableTabsValue: "",
      editableTabs: [],
      tagsList: [],
    };
  },
  computed: {
    //动态设置及获取当前激活的tab页
    activeIndex: {
      get() {
        return this.$store.state.activeIndex;
      },
      set(val) {
        this.$store.commit("set_active_index", val);
      },
    },
    tags() {
      return this.$store.state.tags;
    },
  },
  watch: {
    $route(to) {
      let showName = this.$store.state.tagName;
      //判断页面中是否已经存在该路由的tab页
      let flag = false;
      //tags记录当前页面中已存在的tab页
      let tags = this.$store.state.tags;
      for (let option of tags) {
        if (option.name === showName || showName === "") {
          flag = true;
          this.$store.commit("set_active_index", to.path);
          break;
        }
      }
      //如果不存在,新增tab页，再将新增的tab页设置为active显示在桌面前端
      if (!flag && to.path !== "/") {
        // let componentName = this.$route.matched[1].components.default["__file"];
        // console.log(this.$route.matched)
        // componentName = componentName.slice(componentName.lastIndexOf("/")+1,-4);
        this.$store.commit("add_tabs", {
          route: to.path,
          name: showName,
          // componentName: componentName,
        });
        this.$store.commit("set_active_index", to.path);
      }
    },
    tags(val) {
      let arr = [];
      for (let option of val) {
        arr.push(option.componentName);
      }
      this.tagsList = arr;
    },
  },
  methods: {
    //页面加载完毕后默认激活主界面TAB
    init(){
      this.$store.commit("add_tabs",{route:"/detailMap",name:"主界面",componentName:"MainWindow"});
      this.$store.commit("set_active_index","/detailMap");
    },
    //tab选中时触发，动态切换路由
    tabClick(tab) {
      let path = this.activeIndex;
      this.$router.push({ path: path });
    },
    //点击tab移除按钮后触发
    tabRemove(targetName) {
      this.$store.commit("delete_tabs", targetName);
      //如果关闭当前激活的tab
      if (this.activeIndex === targetName) {
        //设置当前激活的路由
        if (this.tags && this.tags.length >= 1) {
          this.$store.commit(
            "set_active_index",
            this.tags[this.tags.length - 1].route
          );
          this.$router.push({ path: this.activeIndex });
        } else {
          this.$router.push({ path: "/" });
        }
      }
    },
  },
};
</script>
<style lang="scss">
#HomePage {
  width: 100%;
  height: 100%;
  .el-header {
    height: 53px !important;
    background-color: rgb(37, 43, 72);
    #logoDiv {
      float: left;
      height: 70%;
      width: 25%;
      padding: 9px 0 0 0px;
      text-align: left;
      img {
        width: 323px;
      }
    }
    .userInfo {
      display: flex;
      float: right;
      margin: 11px 15px 0 0;
      .el-tag {
        border: 0;
        color: white;
        border-radius: 27px;
        margin-right: 20px;
      }
      .exit,
      .help {
        color: white;
        padding-top: 8px;
      }
    }
  }
  .el-container {
    width: 100%;
    height: 100%;
    .el-aside {
      box-shadow: 0px 2px 7px 0 #e8e8e8;
      -moz-box-shadow: 0px 2px 7px 0 #e8e8e8;
      -webkit-box-shadow: 0px 2px 7px 0 #e8e8e8;
    }
    .el-main {
      padding: 2px;
      .amap-icon {
        overflow: visible !important;
      }
    }
    .tabsTemplate {
      .el-tabs {
        background-color: #F2F6FC;
        .el-tabs__header {
          margin: 0px;
        }
        .el-tabs__item {
          font-size: 13.5px;
          font-family: Microsoft Yahei;
          background-color: #EBEEF5;
          border: 1px solid #E4E7ED;
        }
        .el-tabs__item:nth-child(1) span{
          display: none;
        }
        .is-active{
          border-bottom: 1px;
        }
      }
    }
  }
}
</style>
