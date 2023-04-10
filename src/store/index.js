import Vue from "vue";
import Vuex from "vuex";


Vue.use(Vuex)

export default new Vuex.Store({
  state:{
    now : true
  },
  mutations:{
  turnTure(state) {
    state.now = true;
  },
  turnFalse(state) {
    state.now = false;
  }
  },
  getters:{
    // changeNow (state) {
    //
    // }
  },
  actions:{
    turnTure({commit}) {
      commit('turnTure')
    },
    turnFalse({commit}) {
      commit('turnFalse')
    }
  }
})
