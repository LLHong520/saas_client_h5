import axios from "axios";
import { APP_URL } from "~/config";
var qs = require("qs");
require("promise.prototype.finally").shim();
import jsCallSinaHealth from "~/native/jsCallSinaHealth.js";
function getWbAutoLoginUrl(referer) {
  referer = encodeURIComponent(APP_URL + "/callback?referer=" + referer);
  let loginUrl = `https://health.sina.cn/userAuth/weibo/login?callBackUrl=${referer}`;
  return loginUrl;
}
// var https = require("https");
// const axios = axiosConstructor.create({
//   httpsAgent: new https.Agent({
//     rejectUnauthorized: false
//   })
// });
export default ({ store,route , app ,query,redirect}) => {
  // let axios = app.$axios;
  // axios.defaults.baseURL = API_URL;
  // axios.defaults.headers.token = store.state.token || "";
  // axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
  axios.defaults.timeout = 50000;
  //请求拦截器
  axios.interceptors.request.use(config => {
    config.headers.token = store.state.token;
    let configData = {};
    let comtyId = query.comtyId || store.state.comtyId || "";
    // let comtyId = route.query.comtyId;

    // console.log("-----");
    // console.log(`query.comtyId==${query.comtyId}`);
    // console.log(`store.state.comtyId==${store.state.comtyId}`);
    // console.log("-----");

    // post
    if (config.method == "post" ) {
      configData = config.data;
      if (typeof configData === "object" && !configData.comtyId){
        configData.comtyId = comtyId;
        configData.communityId = comtyId;
      }
      if (config.headers["Content-Type"] == "application/x-www-form-urlencoded") {
        configData = qs.stringify(configData);
      }
      config.data = configData;
    }

    // get
    if (config.method == "get") {
      configData = config.params;

      if (!configData.comtyId) {
        configData.comtyId = comtyId;
        configData.communityId = comtyId;
      }

      config.params = configData;
    }

    // put & delete
    if (config.method == "put" || config.method == "delete") {
      if (config.url.indexOf("?") >= 0){
        config.url += "&comtyId=" + comtyId;
        config.url += "&communityId=" + comtyId;
      }else{
        config.url += "?comtyId=" + comtyId;
        config.url += "&communityId=" + comtyId;
      }
    }
    return config;
  }, error => {
    return Promise.reject(error);
  });

  /*
  返回数据预判断
  */
  // function statusHandler(status) {
  //   switch (status) {
  //   case 60104:
  //     redirect("/login",{
  //       referer: encodeURIComponent(route.fullPath)
  //     });
  //     break;
  //   case 500:
  //     if(process.client){
  //       app.toast(response.data.message);
  //     }
  //   case 200:
  //     break;

  //   default:
  //     if(process.client){
  //       app.toast(response.data.message);
  //     }
  //     break;
  //   }
  // }
  /*
  返回数据拦截器
  */

  axios.interceptors.response.use(function (response) {
    let status = response.data.status;
    if (status != 200) {
      if (status == 60104) {
        store.dispatch("user_logout");
        if (process.client) {
          let isWB = navigator.userAgent.toLowerCase().match(/WeiBo/i) == "weibo" ? true : false;
          //新浪健康App中自动登录
          if (store.getters.isInSinaHealApp) {
            jsCallSinaHealth.appLogin();
          } else if(isWB){
            //微博中跳转微博登录
            return redirect(getWbAutoLoginUrl(route.fullPath));
          }else{
            //否则跳转H5登录
            return redirect("/login", {
              referer: encodeURIComponent(route.fullPath)
            });
          }
        }

      } else if (status == 500){
        // console.error(response.data.message);
        if(process.client){
          app.toast(response.data.message);
        }
      }else{
        if(process.client){
          // app.toast(response.data.message);
        }
      }
    }
    return response.data? response:{...response,data:null};
  }, function (error) {
    return Promise.reject(error);
  });

};
