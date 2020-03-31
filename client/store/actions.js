import Vue from "vue";
import * as types from "./mutation-types";
import userService from "@/services/userService.js";
import sysService from "@/services/sysService.js";
import communityService from "@/services/communityService.js";

export const nuxtServerInit = async function ({ commit,dispatch }, { app,store,req ,route ,redirect,error}) {
  /**
   * 注： nuxt会保存上一个用户访问的store，会导致下一个用户拿到上一个用户的store，所以必须清空
  * */
  commit("SET_COMTYID", null);
  commit("SET_COMTYINFO", null);
  commit("SET_TOKEN", null);
  commit("SET_USERINFO", null);
  commit("SET_ISDOCTOR", false);
  commit("SET_APPQUERYSTRING", null);
  commit("SET_IDENTITYINFO", { type: "patient" });
  commit("SET_PERMISSION_MAP", {});
  commit("SET_PERMISSION_LIST", []);

  // store init
  if (process.server) {
    if (route.query && route.query.comtyId){
      console.error("router中有社区id");
      commit("SET_COMTYID", route.query.comtyId);
    }else{
      console.log("router中没有社区id");
    }

    //cookie中取持久化存储的内容
    if (req && req.headers.cookie){
      let cookieObj = app.$cookies.getAll();

      // 社区id
      if (cookieObj.comtyId && !store.state.comtyId) {
        commit("SET_COMTYID", cookieObj.comtyId);
      }

      // app进入参数
      if (cookieObj.appQueryString) {
        commit("SET_APPQUERYSTRING", cookieObj.appQueryString);
      }

      // 用户信息
      if (cookieObj.token){
        commit("SET_TOKEN", cookieObj.token);
      } else {
        // 没有token则退出，重要
        dispatch("user_logout");
        return;
      }

      if (cookieObj.userInfo){
        commit("SET_USERINFO", cookieObj.userInfo);
      }else {
        dispatch("user_logout");
        return;
      }

      if (cookieObj.isDoctor != undefined && cookieObj.isDoctor != null) {
        commit("SET_ISDOCTOR", cookieObj.isDoctor);
      }

      if (cookieObj.userIdentityInfo) {
        commit("SET_IDENTITYINFO", cookieObj.userIdentityInfo);
      }

    }
  }
};

export const update_userinfo = async function ({commit,dispatch},token) {
  return await userService.getmyinfo({
    token:token
  }).then(res => {
    if(res.status==200){
      let userinfo=res.data;
      commit(types.SET_USERINFO, userinfo);
      dispatch("update_userIdentity", userinfo.id);
      if (process.client) {
        try {
          Vue.$cookies.set("userInfo", userinfo);
        } catch (error) {
          Vue.cookies.set("userInfo", userinfo);
        }
        Vue.storage.set("userInfo", JSON.stringify(userinfo));
      }
    }
    return res;
  }).catch( () =>{
    return {
      data:{
        status:-1
      }
    };
  });
};

export const update_userIdentity = function ({commit},userId) {
  return userService.getIdentity({
    key: "community:front:h5:fromType:" + userId
  })
    .then((res) => {
      if (res.status == 200 && res.data) {
        let identityInfo = {
          type: "patient",
          doctorId: ""
        };
        if (res.data.fromType == "DOCTOR_APP") { //"CLIENT_H5"
          identityInfo.type = "doctor";
          identityInfo.doctorId = res.data.doctorId;
        }
        console.log(identityInfo);
        commit(types.SET_IDENTITYINFO, identityInfo);
      }
    });
};

export const update_comtyInfo = function ({commit}) {
  return communityService.getCommunityInstro({}).then(res => {
    if(res.status == 200 && res.data && res.data.status == 1){
      commit("SET_ORGID",res.data.bId);
      commit("SET_COMTYINFO",null);
      commit("SET_COMTYINFO",res.data);
      return res.data;
    }else{
      commit("SET_ORGID","");
      commit("SET_COMTYINFO",null);
    }
  });
};

export const update_city = function ({commit}) {
  if(!window.BMap) return new Promise ((resolve, reject) => {
    resolve();
  });
  return new Promise((resolve, reject) => {
    var geolocation = new BMap.Geolocation();
    geolocation.getCurrentPosition(function(r){
      // console.log(r);
      console.log(this.getStatus());
      if(this.getStatus() == BMAP_STATUS_SUCCESS){
        console.log("location",r);
        // alert(r.latitude);
        // var pt = r.point;
        var address = { ...r.address, ...r.point };
        // let destCity = address.province;
        commit(types.SET_LOCATION, address);
        resolve({
          success:true,
          status:this.getStatus(),
          geolocation:this,
          address: address
        });
      }else{
        resolve({
          success:false,
          status:this.getStatus(),
          geolocation:this
        });
      }
    });
  });
};

export const getCurrentCity = function ({commit}) {
  // 根据当前ip获取当前城市
  if(!window.BMap) return new Promise ((resolve, reject) => {
    resolve();
  });
  return new Promise((resolve, reject) => {
    var geolocation = new BMap.LocalCity();
    geolocation.get(function(res){
      if(res && res.name){
        commit(types.SET_CITY, res.name);
        resolve({
          success: true,
          geolocation: this,
          address: res.name
        });
      }else{
        resolve({
          success: false,
          geolocation: this
        });
      }
    });
  });
};

export const update_isDoctor = async function ({ state, commit}, token) {
  // 更新是否医生
  return await sysService.checkInfoByToken({ token }).then( res => {
    if(res.status == 200 && res.data){
      commit("SET_ISDOCTOR", res.data.isTrue);

      if (process.client) {
        console.log(res.data);
        console.log(Vue.cookies);
        console.log(Vue.$cookies);
        try {
          Vue.$cookies.set("isDoctor", res.data.isTrue);
        } catch (error) {
          Vue.cookies.set("isDoctor", res.data.isTrue);
        }
        Vue.storage.set("isDoctor", res.data.isTrue);
      }
      return res.data.isTrue;
    } else {
      return false;
    }
  });
};

export const update_localStorage = function ({ commit, dispatch, getters }, token) {
  // 客户端更新用户信息
  if (process.client && !getters.isLogin) {
    let token = Vue.storage.get("token");
    let userInfo = Vue.storage.get("userInfo");
    let isDoctor = Vue.storage.get("isDoctor");

    if(!!token && !!userInfo && !!isDoctor) {
      commit("SET_TOKEN", token);
      commit("SET_USERINFO", JSON.parse(userInfo));
      commit("SET_ISDOCTOR", JSON.parse(isDoctor));
      dispatch("user_login", token);
    }
  }

  // 更新其他本地
  if (process.client) {
    let userLocation = Vue.storage.get("userLocation");

    if (userLocation) {
      commit("SET_LOCATION", JSON.parse(userLocation));
    }
  }
};

export const update_token = function ({ commit }, token) {
  // 更新token
  commit("SET_TOKEN", token);

  if (process.client) {
    try {
      Vue.$cookies.set("token", token);
    } catch (error) {
      Vue.cookies.set("token", token);
    }
    Vue.storage.set("token", token);
  }
};

export const user_login = async function ({ commit, dispatch }, token) {
  // 用户登录
  dispatch("update_token", token);
  await dispatch("update_userinfo", token);
  await dispatch("update_isDoctor", token);
};

export const user_logout = function ({ commit }) {
  // 用户退出
  commit("SET_TOKEN", null);
  commit("SET_USERINFO", null);
  commit("SET_ISDOCTOR", false);
  // commit("SET_APPQUERYSTRING", null);
  commit("SET_IDENTITYINFO", {
    type: "patient"
  });

  if (process.client) {
    try {
      Vue.$cookies.remove("token");
      Vue.$cookies.remove("userInfo");
      Vue.$cookies.remove("isDoctor");
    } catch (error) {
      Vue.cookies.remove("token");
      Vue.cookies.remove("userInfo");
      Vue.cookies.remove("isDoctor");
    }

    Vue.storage.remove("token");
    Vue.storage.remove("userInfo");
    Vue.storage.remove("isDoctor");
  }
};

export const user_joinInComty = async function ({ state, commit }, info = { }) {
  // 用户加入社区
  let params={
    userType: info.type || "user",
    bId: state.comtyInfo ? state.comtyInfo.bId : "",
  };
  if(info.comtyId){
    params.comtyId = info.comtyId;
  }

  return await userService.joinInComty(params).then( res => {
    return res;
  }).catch( e => {
    return e;
  });
};

export const appQueryString = function ({ commit }, queryObj) {
  // app进入保存参数
  commit("SET_APPQUERYSTRING", queryObj);

  if (process.client) {
    try {
      Vue.$cookies.set("appQueryString", queryObj);
    } catch (error) {
      Vue.cookies.set("appQueryString", queryObj);
    }
    Vue.storage.set("appQueryString", JSON.stringify(queryObj));
  }
};


