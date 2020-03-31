function formatNumber (n) {
  const str = n.toString();
  return str[1] ? str : `0${str}`;
}

export function formatTime (date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  const t1 = [year, month, day].map(formatNumber).join("/");
  const t2 = [hour, minute, second].map(formatNumber).join(":");

  return `${t1} ${t2}`;
}

function dateFormat(val, type) {
  if (val == "" || val == 0 || val == null || val == undefined)
    return "";
  if (isNaN(parseInt(val))) return val;
  let timeMinSeconds = parseInt(val);

  function fix(num) {
    return num >= 10 ?
      num :
      "0" + num;
  }

  var date = new Date(timeMinSeconds);
  var year = date.getFullYear();
  var month = fix(date.getMonth() + 1);
  var day = fix(date.getDate());
  var hour = fix(date.getHours());
  var minute = fix(date.getMinutes());

  let dataStr = year + "-" + month + "-" + day + " " + hour + ":" + minute;
  if (type == "YMD") {
    dataStr = year + "-" + month + "-" + day;
  } else if (type == "YMDHMS") {
    dataStr = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
  } else if (type == "HMS") {
    dataStr = hour + ":" + minute + ":" + second;
  } else if (type == "YM") {
    dataStr = year + "-" + month;
  }
  return dataStr;
};

function trim(str) {
  if (!str) str = "";
  return str.replace(/(^\s*)|(\s*$)/g, "");
};

function isEmpty(str) {
  var str = this.trim(str);
  if (str == "") {
    return true;
  } else {
    return false;
  };
};

function debounce(fn, t) {
  let delay = t || 500;
  let timer;
  return function () {
    let args = arguments;
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      timer = null;
      fn.apply(this, args);
    }, delay);
  };
};
function getQueryParamByKey(paramName,queryUrl){
  let url="";
  if (queryUrl){
    url = queryUrl;
  }else{
    url = document.location.toString();
    // 如果url中有特殊字符则需要进行一下解码
    url = decodeURI(url);
  }
  let arrObj = url.split("?");
  if (arrObj.length > 1) {
    let arrPara = arrObj[1].split("&");
    let arr;
    for (let i = 0; i < arrPara.length; i++) {
      arr = arrPara[i].split("=");
      if (arr != null && arr[0] == paramName) {
        return decodeURIComponent(arr[1]);
      }
    }
    return "";
  } else {
    return "";
  }
}
export default {
  getQueryParamByKey,
  dateFormat,
  formatNumber,
  formatTime,
  trim,
  isEmpty,
  debounce,
};
