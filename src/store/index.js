import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    tags:[],
    tagName:"",
    activeIndex:""
  },
  mutations: {
    add_tabs(state,data){
      state.tags.push(data)
    },
    delete_tabs(state,route){
      let index = 0;
      for(let option of state.tags){
        if(option.route === route){
          break;
        }
        index++;
      }
      state.tags.splice(index,1)
      try{
        if(state.tags.length !== 0){
          state.tagName = state.tags[index-1].name
        }
        else{
          state.tagName = ""
        }
      }catch(error){state.tagName = ""}
    },
    set_active_index(state,index){
      state.activeIndex = index
    },
    //设置tag名
    set_tagName(state,name){
      state.tagName = name
    }
  },
  actions: {
  },
  modules: {
  }
})
