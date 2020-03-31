import * as types from "./mutation-types";
import Auth from "../auth.js";
const mutations = {
  [types.USER_LOGIN](state,status) {
    state.is_login = status;
  },
  [types.SET_APPQUERYSTRING](state, appQueryString) {
    state.appQueryString = appQueryString;
  },
  [types.GET_USERINFO_SESSION](state) {
    state.userInfo = Auth.userinfo();
  },
  [types.SET_IDENTITYINFO](state, identityInfo) {
    state.identityInfo = identityInfo;
    // Auth.identityInfo();
  },
  [types.SET_COMTYID](state, comtyId) {
    state.comtyId = comtyId;
  },
  [types.SET_COMTYINFO](state, comtyInfo) {
    state.comtyInfo = comtyInfo;
  },
  [types.SET_ORGID](state, orgId) {
    state.orgId = orgId;
  },
  [types.SET_USERINFO](state,userinfo) {
    state.userInfo = userinfo || null;
    if (userinfo && userinfo.id) {
      Auth.save_iw_dataclollect_uid(userinfo.id||"");
    }
  },
  [types.SET_USERROLE](state,userRole) {
    state.userRole = userRole;
  },
  [types.SET_TOKEN](state, token) {
    state.token = token;
    // Auth.save_token(token);
  },
  [types.SET_CITY](state, city) {
    state.city = city;
    // Auth.save_city(city);
  },
  [types.SET_LOCATION](state, locationInfo) {
    state.location = locationInfo;
  },
  [types.SET_PERMISSION_MAP](state, obj) {
    state.permission_map = obj;
  },
  [types.SET_PERMISSION_LIST](state, arr) {
    state.permission_list = arr;
  },
  [types.SET_ISDOCTOR](state, boole) {
    state.isDoctor = boole;
  },
};

export default mutations;
