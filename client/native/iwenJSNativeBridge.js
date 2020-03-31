//js调用App 新浪健康和爱问健康
(function (window) {
  var UA = navigator.userAgent;

  function iwenJSNativeBridge() {
    this.sinaHealAppKeys = ["2", "20190123"];
    this.iaskAppKeys = ["20140123"];
    this.appScheme = "sinahealth";
    this.isSinaHealApp = false;
    this.isIaskHealApp = false;
    this.isWrappedByAPP = false;
    this.appsConf = {
      iaskpatient: {
        key: "iaskpatient",
        scheme: "iaskpatient",
        uaParams: null,
        uaParamsString: "",
        downloadUrl: "https://health.sina.cn/zt/app/down",
      },
      sinahealth: {
        key: "sinahealth",
        scheme: "sinahealth",
        uaParams: null,
        uaParamsString: "",
        downloadUrl: "https://health.sina.cn/zt/app/down",
      }
    };
    this._init();
  };

  /**
   * 初始化示例
   */

  iwenJSNativeBridge.prototype._init = function () {
    this._getAppParams();
    this._getPlatformInfo();
    if(this.appParams){
      this._getAppInfo();
    }
  };
  /**
   * 获取App的参数
   */
  iwenJSNativeBridge.prototype._getAppParams = function () {
    if (UA.indexOf(";app/") >= 0) {
      var queryString = UA.split(";app/")[1];
      this.appParams = JSON.parse(queryString);
      this.appParamsString = queryString;
    } else {
      this.appParams = null;
      this.appParamsString = "";
    }
  };
  /**
   * 获取当前平台
   */
  iwenJSNativeBridge.prototype._getPlatformInfo = function () {
    var os = {
      isiOS: false,
      isAndroid: false,
      isWx: false,
      isWeibo: false,
    };
    var UA = navigator.userAgent;
    os.isiOS = (function () {
      return UA.toLowerCase().indexOf("iphone") > 0 ? true : false;
    })();
    os.isAndroid = (function () {
      return UA.toLowerCase().indexOf("android") > 0 ? true : false;
    })();
    os.isWx = (function () {
      return UA.toLowerCase().match(/MicroMessenger/i) == "micromessenger" ? true : false;
    })();
    os.isWeibo = (function () {
      return UA.toLowerCase().match(/WeiBo/i) == "weibo" ? true : false;
    })();
    this.platformInfo = os;
  };
  /**
   * 获取当前APP的信息
   */
  iwenJSNativeBridge.prototype._getAppInfo = function () {
    var _self = this;
    var key = (function () {
      var isApp = _self.appParams.isApp || "";
      var isIaskApp = _self.iaskAppKeys.indexOf(isApp) >= 0;
      var isSinaHealApp = _self.sinaHealAppKeys.indexOf(isApp) >= 0;
      var key = "";
      if (isIaskApp) {
        key = "iaskpatient";
      }
      if (isSinaHealApp) {
        key = "sinahealth";
      }
      return key;
    })();
    var appInfo = this.appsConf[key];
    appInfo.uaParams = this.appParams;
    appInfo.uaParamsString = this.appParamsString;

    this.isSinaHealApp = key === "sinahealth";
    this.isIaskHealApp = key === "iaskpatient";
    this.isWrappedByAPP = this.isSinaHealApp || this.isIaskHealApp;
    this.appInfo = appInfo;
  };

  /**
   * 调用App
   */

  iwenJSNativeBridge.prototype.callNative = function (action, params) {
    var os = this.platformInfo;
    var paramsString = JSON.stringify(params);
    if (os.isiOS) {
      try {
        window.webkit.messageHandlers[action].postMessage(paramsString);
      } catch (error) {
        console.error("调用ios失败");
        console.error("action == ", action);
        console.error("paramsString == ", paramsString);
        console.error(error);
      }
    } else if (os.isAndroid) {
      try {
        window.jsCallSinaHealth[action](paramsString);
      } catch (error) {
        console.log("调用安卓失败");
        console.error("action == ", action);
        console.error("paramsString == ", paramsString);
        console.error(error);
      }
    }
  };

  /**
   * 打开App内内嵌H5页面 参数示例
   * 参数可为字符串类型 也可以为对象类型
   * path 需要编码 encodeURIComponent("/zt/depart/12345")
   *
   * 字符串类型
   * 打开 H5页面
   * paramsString = "type=web&path=path"
   *
   * 打开App内原生页面 参数示例
   * paramsString = "type=app&path=path"
   *
   * 对象类型需指定需要打开的App 默认为打开爱问健康，下面为示例
   *
   {
     scheme: "iaskpatient",
     paramsString:"type=app&path=path"
   }
   * **/

  iwenJSNativeBridge.prototype.openApp = function (params, isToDownload) {
    params = params || "";
    isToDownload = isToDownload || true;
    var typeOfParams = typeof params;
    var appScheme = "sinahealth";
    var paramsString = "";
    if (typeOfParams === "string") {
      paramsString = params;
      appScheme = "sinahealth";
    }
    if (typeOfParams === "object") {
      appScheme = params.scheme;
      paramsString = params.paramsString;
    }
    var openUrl = this.appsConf[appScheme].scheme + "://?" + paramsString;
    var downloadUrl = this.appsConf[appScheme].downloadUrl;
    try {
      window.location.href = openUrl;
      console.log("打开app参数");
      console.log(paramsString);
      console.log(openUrl);
      if (isToDownload) {
        setTimeout(function(){
          window.location.href = downloadUrl + "?referer=" + encodeURIComponent(paramsString);
        }, 500);
      }
    } catch (error) {
      console.log("打开app参数", paramsString);
      window.location.href = openUrl;
    }
  };

  /*
   *webview打开原生页面
   *参数
   *
   {
     "businessId": "业务ID"，
     "linkTo": "app",
     linkUrl: "app界面路由路径"
   }

   安卓直播详情页面path： /video/VideoPlayerActivity
   ios直播详情页面path： SinaHealth: //Health/SHLiveViewController
   */

  iwenJSNativeBridge.prototype.jumpApp = function (params) {
    if (!params) {
      alert("参数不能为空！");
    }
    console.log("【webview打开原生页面】");
    console.log("参数");
    console.log(params);
    this.callNative("jumpApp", params);
  };
  /*
   *通知App在手机浏览器打开某个网页链接
   *参数为url即可(url需要进行编码)
   */

  iwenJSNativeBridge.prototype.goSystemBrowser = function (params) {
    if (!params) {
      params = {
        url: encodeURIComponent("https://health.sina.cn")
      };
    }
    console.log("【通知App在手机浏览器打开某个网页链接】");
    console.log("参数");
    console.log(params);
    this.callNative("goSystemBrowser", params);
  };
  /*
   *回到app首页
   *参数不传即可
   */
  iwenJSNativeBridge.prototype.goHome = function (params) {
    if (!params) {
      params = "";
    };
    console.log("【回到app首页】");
    console.log("参数");
    console.log(params);
    this.callNative("goHome", params);
  };

  /*
   * 调起原生App登录
   */

  iwenJSNativeBridge.prototype.appLogin = function (params) {
    if (!params) {
      params = {};
    };
    console.log("【调起原生App登录】");
    console.log("参数");
    console.log(params);
    this.callNative("appLogin", params);
  };

  /*
   * 调起分享
   *
   {
     sourceType: 0, //默认0 1=>分享文章 2=>分享医生 3=>患者自述热榜
     title: "分享标题",
     url: "分享的链接",
     img: "分享图片",
     content: "分享描述"
   }
   */

  iwenJSNativeBridge.prototype.appShare = function (params) {
    if (!params) {
      params = {};
    };
    console.log("【调起分享】");
    console.log("参数");
    console.log(params);
    this.callNative("appShare", params);
  };

  /*
   * 隐藏分享
   * 当 hidden 为false时 需要传递分享信息(此时APP会显示出分享按钮 并设置分享信息为参数中设置的信息)
   *
   {
     hidden: false,
     share: {
       sourceType: 0, //默认0 1 => 分享文章 2 => 分享医生 3 => 患者自述热榜
       title: "分享标题",
       url: "分享的链接",
       img: "分享图片",
       content: "分享描述"
     }
   }
   */

  iwenJSNativeBridge.prototype.hiddenShare = function (params) {
    if (!params) {
      params = {
        hidden: true
      };
    };
    console.log("【调起隐藏分享按钮】");
    console.log("参数");
    console.log(params);
    this.callNative("hiddenShare", params);
  };

  /*
   * 设置App的title
   *
   * 参数说明
   * hidden 是否隐藏App的title栏 如果为true则App会隐藏标题栏
   * title 要设置的标题栏文字
   */

  iwenJSNativeBridge.prototype.appTitle = function (params) {
    if (!params) {
      params = {
        hidden: false,
        title: "标题"
      };
    };
    console.log("【设置App的title】");
    console.log("参数");
    console.log(params);
    this.callNative("appTitle", params);
  };

  /*
   * 关闭当前h5返回原生页面
   */

  iwenJSNativeBridge.prototype.webFinish = function () {
    console.log("关闭当前h5返回原生页面");
    this.callNative("webFinish", "");
  };

  window.iwenJSNativeBridge = new iwenJSNativeBridge();
})(window);

console.log(iwenJSNativeBridge);
