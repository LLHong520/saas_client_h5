const shareMixin = {
  beforeRouteEnter(to, from, next) {
    // XXX: 修复iOS版微信HTML5 History兼容性问题
    if (process.client) {
      // debugger;
      var UA = navigator.userAgent;
      let isiOS = (function () {
        return UA.toLowerCase().indexOf("iphone") > 0 ? true : false;
      })();
      let isWx = (function () {
        return UA.toLowerCase().match(/MicroMessenger/i) == "micromessenger" ? true : false;
      })();
      console.log("isiOS", isiOS);
      console.log("isWx", isWx);
      if (isiOS && isWx && to.path !== location.pathname) {
        console.log("重定向");
        // 此处不可使用location.replace
        location.assign(to.fullPath);
        // next();
      } else {
        console.log("不重定向");
        next();
      }
      // next();
    } else {
      next();
    }
  }
};

export default shareMixin;
