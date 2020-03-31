import Vue from "vue";

function getParseQuery(cookieArray) {
  let cookieObj = {};
  cookieArray.map((item) => {
    let arr = item.split("=");
    let value = decodeURIComponent(arr[1]);
    let key = arr[0].replace(/ /g, "");
    try {
      value = JSON.parse(value);
    } catch (error) {
      value = value;
    }
    cookieObj[key] = value;
  });
  return cookieObj;
}

const PlatformInfo = {
  install(Vue) {
    var UA = navigator.userAgent, appVersion = navigator.appVersion;
    var HREF = window.location.href;
    var platformInfo = {};
    //获取系统信息
    var os = {};
    os.userAgent = UA;
    os.appVersion = appVersion;
    os.isiOS = (function () {
      return UA.toLowerCase().indexOf("iphone") > 0 ? true : false;
    })();
    os.isAndroid = (function () {
      return UA.toLowerCase().indexOf("android") > 0 ? true : false;
    })();
    os.isMp = (function () {
      return UA.toLowerCase().match(/miniProgram/i) ? true : false;
    })();
    os.isWx = (function () {
      return UA.toLowerCase().match(/MicroMessenger/i) == "micromessenger" ? true : false;
    })();
    os.isWeibo = (function () {
      return UA.toLowerCase().match(/WeiBo/i) == "weibo" ? true : false;
    })();
    os.deviceInfo = (function () {
      return {
        width: window.screen.width,
        height: window.screen.height
      };
    })();

    //获取爱问App的信息
    var iaskApp = {};
    var paramsString = HREF.split("?");
    var parseQueryParams = paramsString[1]? paramsString[1].split("&") : [];
    var parseQuery = getParseQuery(parseQueryParams);
    console.log(parseQuery);
    iaskApp.href = HREF;
    iaskApp.docId = (function () {
      return parseQuery.docId||null;
    })();
    iaskApp.isApp = (function () {
      return parseQuery.isApp || null;
    })();
    iaskApp.clientType = (function () {
      return parseQuery.clientType || null;
    })();
    iaskApp.versioncode = (function () {
      return parseQuery.versioncode || null;
    })();
    iaskApp.source = (function () {
      return parseQuery.source || null;
    })();
    iaskApp.appChannel = (function () {
      return parseQuery.appChannel || null;
    })();
    iaskApp.appAction = (function () {
      return parseQuery.appAction;
    })();

    platformInfo.os = os;
    platformInfo.iaskApp = iaskApp;
    Vue.prototype.$platformInfo = platformInfo;
  }
};

Vue.use(PlatformInfo, {});
