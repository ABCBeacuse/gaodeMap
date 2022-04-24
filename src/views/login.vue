<template>
  <div id="login">
      <div class="logindiv">
          <div class="logo">
              <img src="../img/login/loginlogo.png" />
              <div class="desc">
                  乳山智慧管网综合监管平台
              </div>
          </div>
          <div class="loginpart">
              <div class="title">
                  欢迎登录
              </div>
              <div class="inputpart">
                  <el-input placeholder="账号" prefix-icon="el-icon-user" v-model="userInfo.userName"></el-input>
                  <el-input placeholder="密码" prefix-icon="el-icon-lock" v-model="userInfo.password" show-password></el-input>
                  <el-button type="primary" @click="loginAdmin">登&nbsp;录</el-button>
              </div>
          </div>
      </div>
  </div>
</template>
<script>
export default {
    data(){
        return{
            userInfo:{
                userName:"",
                password:""
            }
        }
    },
    created(){
        this.init();
    },
    methods:{
        init(){
            let hasCache = window.localStorage.getItem("hasCache");
            if(hasCache == "yes"){
                this.userInfo.userName = window.localStorage.getItem("userName");
                this.userInfo.password = window.localStorage.getItem("password");
            };
        },
        loginAdmin(){
            let _this = this;
            if(this.userInfo.userName == "" || this.userInfo.password == ""){
                this.$message({
                    message:"请输入用户名和密码",
                    type:"warning"
                });
                return
            }
            this.axios.Login(this.userInfo).then((res)=>{
                let data = res.data;
                if(res.code != 200){
                    _this.$message({
                        message:res.msg,
                        type:"error"
                    })
                }else{
                    window.sessionStorage.setItem("btnPermissions",data.roleStr);
                    window.sessionStorage.setItem("realName",data.realName);
                    window.sessionStorage.setItem("token",data.token);
                    window.sessionStorage.setItem("userId",data.id);
                    window.sessionStorage.setItem("userName",data.userName);
                    window.localStorage.setItem("userName",_this.userInfo.userName);
                    window.localStorage.setItem("password",_this.userInfo.password);
                    window.localStorage.setItem("hasCache","yes");
                    this.$router.push("/index");
                }
            });
        }
    }
};
</script>
<style lang="scss">
#login {
  height: 100%;
  width: 100%;
  margin: 0;
  background: url("../img/login/loginbackground.png") no-repeat;
  background-size: 100% 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  .logindiv{
      height: 60%;
      width: 65%;
      background: hsla(0,0%,100%,.5);
      min-height: 350px;
      min-width: 800px;
      border-radius: 4px;
      display: flex;
      justify-content: space-between;
      .logo{
          width: 120%;
          text-align: center;
          padding-top: 10%;
          img{
              width: 40%;
          }
          .desc{
              font-size: 24pt;
              font-family:PingFang SC;
              color: #3c619d;
              margin-top: 10px;
          }
      }
      .loginpart{
          background:hsla(0,0%,100%,.5);
          padding:44px 40px 0px 40px;
          .title{
              font-size: 20pt;
              width: 111px;
              color: #3c619d;
              border-bottom: 2px solid #3c619d;
              margin: auto;
          }
          .inputpart{
              margin-top: 40px;
              .el-input:nth-child(2){
                  margin-top: 20px;
              }
              .el-button{
                  margin-top: 30px;
                  font-size: 20px;
                  width: 100%;
              }
          }
      }
  }
}
</style>