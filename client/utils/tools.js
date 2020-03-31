var utils = {};
utils.trim = function (str) {
  if (!str) str = "";
  return str.replace(/(^\s*)|(\s*$)/g, "");
};
utils.isEmpty = function (str) {
  var str = this.trim(str);
  if (str == "") {
    return true;
  } else {
    return false;
  }
};
utils.isTel = function (str) {
  var str = this.trim(str);
  var exp = /^[\d-]*$/;
  if (exp.test(str)) {
    return true;
  } else {
    return false;
  }
};
utils.isNumber = function (str) {
  var str = this.trim(str);
  var exp = /^[0-9]*[1-9][0-9]*$/;
  if (exp.test(str)) {
    return true;
  } else {
    return false;
  }
};
utils.isMobile = function (mobile) {
  var mobile = this.trim(mobile);
  var exp = /^1([0-9])\d{9}$/;
  if (exp.test(mobile)) {
    return true;
  } else {
    return false;
  }
};
utils.isEmail = function (email) {
  var email = this.trim(email);
  var exp = /^[\w\.]+@[a-zA-Z0-9]{2,10}(?:\.[a-z]{2,4}){1,3}$/;
  if (exp.test(email)) {
    return true;
  } else {
    return false;
  }
};
utils.addEvent = function (obj, ev, fn) {
  if (obj.attachEvent) {
    //针对IE浏览器
    obj.attachEvent("on" + ev, fn);
  } else {
    //针对FF与chrome
    obj.addEventListener(ev, fn, false);
  }
};
utils.removeEvent = function (obj, ev, fn) {
  if (obj.attachEvent) {
    //针对IE浏览器
    obj.detachEvent("on" + ev, fn);
  } else {
    //针对FF与chrome
    obj.removeEventListener(ev, fn, false);
  }
};
//将用户输入的信息转换为伪标签存入数据库
utils.getFormatFakeHtml = function (strContent) {
  strContent = strContent.replace(/\r\n/g, "[br]"); //IE9、FF、chrome
  strContent = strContent.replace(/\n/g, "[br]"); //IE7-8
  strContent = strContent.replace(/\s/g, " "); //空格处理
  return strContent;
};
//将数据库中提取的字符串中伪标签转换为可以识别的标签
utils.getFormatHtml = function (strContent) {
  strContent = strContent.replace(/\[br\]/g, "<br/>"); //IE9、FF、chrome
  return strContent;
};
//将数据库中提取的字符串中伪标签转换为textarea可以识别的字符
utils.getFormatStr = function (strContent) {
  strContent = strContent.replace(/\[br\]/g, "\r\n"); //IE9、FF、chrome
  strContent = strContent.replace(/\[br\]/g, "\n"); //IE7-8
  // strContent = strContent.replace(/ /g, '\s'); //空格处理
  return strContent;
};
utils.getFormatStrNone = function (strContent) {
  strContent = strContent.replace(/\[br\]/g, "\r\n"); //IE9、FF、chrome
  strContent = strContent.replace(/\[br\]/g, "\n"); //IE7-8
  strContent = strContent.replace(/\s/g, " "); //空格处理
  return strContent;
};
utils.replaceHtmlTag = function (strContent) {
  strContent = strContent.replace(/\[br\]/g, "");
  return strContent;
};
utils.delHtmlTag = function (str) {
  str = str.replace(/<\/?[^>]*>/g, ""); //去除HTML tag
  str = str.replace(/[ | ]*\n/g, "\n"); //去除行尾空白
  str = str.replace(/\n[\s| | ]*\r/g, "\n"); //去除多余空行
  str = str.replace(/&nbsp;/ig, ""); //去掉&nbsp;
  str = str.replace(/[\n\r]/g, ""); // 移除回车符
  // str = str.replace(/(\t)/g, '');
  // str = str.replace(/(\r)/g, '');
  // str = str.replace(/<\/?[^>]*>/g, '');
  // str = str.replace(/\s*/g, '');
  return str;
};

//压缩图片
utils.compressIMG = function (file, quality, callback) {
  if (!window.FileReader || !window.Blob) {
    return errorHandler("您的浏览器不支持图片压缩")();
  }

  var reader = new FileReader();
  var mimeType = file.type || "image/jpeg";

  reader.onload = createImage;
  reader.onerror = errorHandler("图片读取失败！");
  reader.readAsDataURL(file);

  function createImage() {
    var dataURL = this.result;
    var image = new Image();
    image.onload = compressImage;
    image.onerror = errorHandler("图片加载失败");
    image.src = dataURL;
  }

  function compressImage() {
    var canvas = document.createElement("canvas");
    var ctx;
    var dataURI;
    var result;

    canvas.width = this.naturalWidth;
    canvas.height = this.naturalHeight;
    ctx = canvas.getContext("2d");
    ctx.drawImage(this, 0, 0);
    dataURI = canvas.toDataURL(mimeType, quality);
    result = dataURIToBlob(dataURI);

    callback(null, result);
  }

  function dataURIToBlob(dataURI) {
    var type = dataURI.match(/data:([^;]+)/)[1];
    var base64 = dataURI.replace(/^[^,]+,/, "");
    var byteString = atob(base64);

    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {
      type: type
    });
  }

  function errorHandler(message) {
    return function () {
      var error = new Error("Compression Error:", message);
      callback(error, null);
    };
  }
};
//切分数组
utils.sliceArray = function (array, size) {
  var result = [];
  if (array.length % size == 0) {
    // console.log("求余取整");
    for (var x = 0; x < Math.ceil(array.length / size); x++) {
      var start = x * size;
      var end = start + size;
      result.push(array.slice(start, end));
    }
    return result;
  } else {
    if (array.length < size) {
      // console.log("不足5条");
      result.push(array);
      return result;
    } else {
      // console.log("多于5条,求余不取整");
      for (var x = 0; x < Math.ceil(array.length / size); x++) {
        var start = x * size;
        var end = start + size;
        result.push(array.slice(start, end));
      }
      // result.push(array.slice(end*5,array.length));
      return result;
    }
  }
};

export default utils;
