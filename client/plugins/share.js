export default {
  setConfig(configData){
    wx.config({
      debug: false,
      appId: configData.appId,
      timestamp: configData.timestamp,
      nonceStr: configData.nonceStr,
      signature: configData.signature,
      jsApiList: [
        "checkJsApi",
        "onMenuShareTimeline",
        "hideOptionMenu",
        "onMenuShareAppMessage",
        "openLocation",
        "getLocation"
      ] // 要加载的微信API
    });
  },
  setShareInfo(shareObj, callback){
    wx.ready(function(){
      // 校验JSAPI
      wx.checkJsApi({
        jsApiList: [
          "checkJsApi",
          "onMenuShareTimeline",
          "hideOptionMenu",
          "onMenuShareAppMessage",
          "openLocation",
          "getLocation"
        ],
        success: function (res) {
          // alert(JSON.stringify(res));
        }
      });
      // 分享给朋友
      wx.onMenuShareAppMessage({
        title: shareObj.shareTitle,
        desc: shareObj.descContent,
        link: shareObj.lineLink,
        imgUrl: shareObj.imgUrl,
        trigger: function (res) {
          // alert("用户点击发送给朋友"+res);
        },
        success: function (res) {
          // alert("分享朋友成功"+res);
          callback();
        },
        cancel: function (res) {
          // alert("已取消"+res);
        },
        fail: function (res) {
          // alert("分享朋友失败"+res);
        }
      });
      // 分享到朋友圈
      wx.onMenuShareTimeline({
        title: shareObj.shareTitle,
        desc: shareObj.descContent,
        link: shareObj.lineLink,
        imgUrl: shareObj.imgUrl,
        trigger: function (res) {
          //alert('用户点击分享到朋友圈'+res);
        },
        success: function (res) {
          //alert('分享朋友圈成功'+res);
          callback();
        },
        cancel: function (res) {
          //alert('已取消'+res);
        },
        fail: function (res) {
          //alert("分享朋友圈失败"+res);
        }
      });
      // 分享失败处理
      wx.error(function (res) {
        //alert("加载事件失败："+res.errMsg);
      });
    });
  }
};
