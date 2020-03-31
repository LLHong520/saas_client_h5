import Vue from "vue";
import Vuex from "vuex";
import * as actions from "./actions";
import * as getters from "./getters";
import state from "./state";
import mutations from "./mutations";
Vue.use(Vuex);
const createStore = () => {
  return new Vuex.Store({
    state: state,
    mutations,
    getters,
    actions,
  });
};

export default createStore;
