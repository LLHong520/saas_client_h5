/**
 * js调用原生App
*/
export default {
  getCookie(cookieName) {
    var strCookie = document.cookie;
    var arrCookie = strCookie.split("; ");
    for (var i = 0; i < arrCookie.length; i++) {
      var arr = arrCookie[i].split("=");
      if (cookieName == arr[0]) {
        return decodeURIComponent(arr[1]);
      }
    }
    return "";
  },
  getPlatformInfo() {
    let os = {
      isiOS: false,
      isAndroid: false,
    };
    if (window) {
      let UA = navigator.userAgent;
      os.isiOS = (function () {
        return UA.toLowerCase().indexOf("iphone") > 0 ? true : false;
      })();
      os.isAndroid = (function () {
        return UA.toLowerCase().indexOf("android") > 0 ? true : false;
      })();
    }
    return os;
  },
  getSinaAppQueryString() {
    let appQueryString = this.getCookie("appQueryString");
    let appQueryObject = {};
    if (appQueryString!=""){
      appQueryObject = JSON.parse(appQueryString);
    }
    return appQueryObject;
  },
  callNative(action, params) {
    let os = this.getPlatformInfo();
    let paramsString = JSON.stringify(params);
    if (os.isiOS) {
      try {
        window.webkit.messageHandlers[action].postMessage(paramsString);
      } catch (error) {
        if (action == "appLogin"){
          window.webkit.messageHandlers.appTokenInvalid.postMessage("");
        }
      }
    } else if (os.isAndroid) {
      try {
        window.jsCallSinaHealth[action](paramsString);
        if (action == "appLogin"){
          window.kxx.appTokenInvalid();
        }
      } catch (error) {
        console.log("调用安卓失败");
        console.log(error);
      }
    }
  },
  //调起原生App登录
  appLogin(params = {}) {
    this.callNative("appLogin", params);
  },
  //调起分享
  appShare(params = {}) {
    this.callNative("appShare", params);
  },
  //隐藏App的分享按钮
  hiddenShare(params = {
    hidden: true
  }) {
    this.callNative("hiddenShare", params);
  }
};
