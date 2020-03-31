// import storage from "good-storage";
const storage_pre_fix ="chspu_user_";
export default {
  isInApp() {
    let isInApp = sessionStorage.getItem(storage_pre_fix + "isInApp");
    return isInApp;
  },
  identityInfo() {
    let identityInfo = sessionStorage.getItem(storage_pre_fix + "identityInfo");
    return identityInfo;
  },
  userinfo(){
    // let userinfo = storage.session.get(storage_pre_fix + "userinfo");
    let userinfo = sessionStorage.getItem(storage_pre_fix + "userinfo");
    if (userinfo==undefined){
      userinfo=null;
    }
    return userinfo;
  },
  docInfo(){
    let docInfo = storage.session.get(storage_pre_fix + "docInfo");
    if (docInfo==undefined){
      docInfo=null;
    }
    return docInfo;
  },
  searchHistory(){
    let searchHistory = storage.get(storage_pre_fix + "searchHistory");
    if (searchHistory==undefined){
      searchHistory=[];
    }
    return searchHistory;
  },
  city(){
    let city = storage.session.get(storage_pre_fix + "city");
    if (city==undefined){
      city="全国";
    }
    return city;
  },
  locationInfo(){
    let locationInfo = storage.session.get(storage_pre_fix + "locationInfo");
    if (locationInfo==undefined){
      locationInfo=null;
    }
    return locationInfo;
  },
  is_login(){
    var isLogin = false;
    if(!platformInfo.isWeibo){
      if (this.token() != undefined) {
        isLogin = true;
      }
    }else {
      if (storage.session.get(storage_pre_fix +"userinfo") != undefined) {
        isLogin = true;
      }
    }

    return isLogin;
  },
  orderLocToast() {
    var is = true;
    if (storage.get(storage_pre_fix + "orderLocToast") != undefined) {
      is = false;
    }
    return is;
  },
  token(){
    if(!platformInfo.isWeibo){
      return storage.get(storage_pre_fix +"token");
    }else{
      return storage.session.get(storage_pre_fix +"token");
    }
    // return "code3d8cf3a70ccdee840495341f93d4b9a2";
  },
  checkToken(){},
  save_isInApp(val) {
    storage.session.set(storage_pre_fix + "isInApp", val);
  },
  save_identityInfo(val) {
    storage.session.set(storage_pre_fix + "identityInfo", val);
  },
  save_userinfo(val){
    storage.session.set(storage_pre_fix +"userinfo",val);
  },
  save_history(val){
    storage.set(storage_pre_fix +"searchHistory",val);
  },
  save_orderLocToast(val) {
    storage.set(storage_pre_fix + "orderLocToast", val);
  },
  save_city(val){
    storage.session.set(storage_pre_fix +"city",val);
  },
  save_locationInfo(val){
    storage.session.set(storage_pre_fix +"locationInfo",val);
  },
  save_docInfo(val){
    storage.session.set(storage_pre_fix +"docInfo",val);
  },
  save_token(val){
    if(!platformInfo.isWeibo){
      storage.set(storage_pre_fix +"token", val);
    }else{
      storage.session.set(storage_pre_fix +"token", val);
    }
  },
  save_iw_dataclollect_uid(val){
    if(process.client){
      localStorage.setItem("IW_DATA_COLLECT_UID", val);
    }
  }
};
