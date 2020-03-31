export const userType = state => {
  if(state.userInfo){
    return state.userInfo.userType;
  }else{
    return "general";
  }
};

export const isLogin = state => {
  // 是否已登录
  return !!(state.token && state.userInfo && state.userInfo.id);
};

export const isInApp = state => {
  let is = false;
  let iaskDocAppKeys = ["1"];
  let sinaHealAppKeys = ["2", "20190123"];
  let iaskAppKeys = ["20140123"];
  let allKeys = iaskDocAppKeys.concat(sinaHealAppKeys).concat(iaskAppKeys);
  if (state.appQueryString) {
    if (allKeys.includes(state.appQueryString.isApp)){
      is = true;
    }
  }
  return is;
};

export const isInSinaHealApp = state => {
  let is = false;
  if (state.appQueryString) {
    if (state.appQueryString.isApp == 2 || state.appQueryString.isApp == "20190123") {
      is = true;
    }
    if (state.appQueryString.isApp == "20140123") {
      is = true;
    }
  }
  return is;
};

export const getCurrPermission = state => (type) => {
  // 获取应用是否显示开启：boolean
  if (state.permission_map[type]) {
    return state.permission_map[type].pagePermission || false;
  } else {
    return false;
  }
};

export const getCurrPermissionObj = state => (type) => {
  // 获取应用是否显示开启：obj
  return state.permission_map[type] || {};
};
