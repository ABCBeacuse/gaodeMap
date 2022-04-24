import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path:"/",
    redirect:"/login"
  },
  {
    path:"/login",
    name:"login",
    component:()=> import("../views/login.vue")
  },
  {
    path: '/index',
    name: 'index',
    redirect:"/detailMap",
    component: ()=> import('../views/HomePage.vue'),
    children:[
      {
        path:"/detailMap",
        name:"detailMap",
        component:()=> import('../components/main/MainWindow.vue'),
      },
      {
        path: "/report",
        name: "reportforms",
        component: ()=> import('../components/main/ReportForms.vue'),
      },
      {
        path:"/setting",
        name:"setting",
        component:()=> import('../components/main/Setting.vue'),
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
