const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  publicPath:'./',
  transpileDependencies: true,
  lintOnSave:false,
  devServer:{      
    https:false,
    open:false,  
    proxy:{
        "/paas-web":{
//测试环境
            target:'http://youngc.oicp.net:23053',
            ws:true,
            pathRewrite:{
                '^/paas-web': ''
            },
            changeOrigin:true, //是否跨域
        },
    }
  }
})
