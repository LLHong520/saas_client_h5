import default_img_user from "@/assets/images/default/bg_head@2x.png";
import default_img_banner from "@/assets/images/default/banner.jpg";
import default_img_doc from "@/assets/images/default/img_doc_emp@2x.png";
import default_img_article from "@/assets/images/default/bg_article_img@2x.png";
import default_img_news from "@/assets/images/default/bg_news_img@2x.png";
import default_img_hospital from "@/assets/images/default/img_hos_emp@2x.png";

import {mapState,mapGetters} from "vuex";
import sysService from "~/services/sysService.js";
import {PIC_URL, SUB_FIX, APP_URL} from "@/config";
import showPostBarMixin from "./showPostBar";
import permission from "./permission";
import jsCallSinaHealth from "~/native/jsCallSinaHealth.js";

const commonMixin = {
  fetch({
    store,
    query
  }) {
    store.commit("SET_COMTYID", query.comtyId);
    console.log("fetch-----");
    console.log(query.comtyId);
    console.log("fetch=====");

  },
  data() {
    return {
      APP_URL,
      PIC_URL,
      PAGE_APP_OBJ: {},
    };
  },
  mounted(){},
  computed: {
    ...mapState({
      VX_userInfo: "userInfo",
      VX_identityInfo: "identityInfo",
      // VX_is_login: "is_login",
      VX_comtyId: "comtyId",
      VX_orgId: "orgId",
      VX_token: "token",
      VX_location: "location",
      VX_isDoctor: "isDoctor",
    }),
    ...mapGetters({
      VX_is_login: "isLogin",
      VX_isInApp: "isInApp",
      VX_isInSinaHealApp: "isInSinaHealApp"
    })
  },
  methods: {
    dataPvUvcollect(data) {
      if (this.VX_userInfo && this.VX_userInfo.id) {
        data.userId = this.VX_userInfo.id;
      }
      sysService.dataPvUvcollect(data);
    },
    addUserOperationRecord(data) {
      if (this.VX_userInfo && this.VX_userInfo.id) {
        data.userId = this.VX_userInfo.id;
        data.token= this.VX_token;
      }
      sysService.addUserOperationRecord(data);
    },
    commonMixin(data) {
      if (this.VX_userInfo && this.VX_userInfo.id) {
        data.userId = this.VX_userInfo.id;
      }
      sysService.dataPvUvcollect(data);
    },
    async dataCollectVisitor(data) {
      // type:打点类型（1：社区、2：文章、3：专题、4：帖子、5:咨询室 、6:调查问卷、 7:社区介绍 、8:按钮广告 、9:广告栏、10:健康知识、 11:健康公告）
      // 用户id
      if (this.VX_userInfo && this.VX_userInfo.id) {
        data.userId = this.VX_userInfo.id;
      }

      // 获取地理位置
      await this.$store.dispatch("getCurrentCity");
      data.city = this.$store.state.city;

      // ip地址
      if (returnCitySN) {
        data.ip = returnCitySN.cip;
      }

      // 来源（微博 / 微信 / 其他）
      let accountBinding = {};

      if (this.VX_is_login && this.VX_userInfo.accountBinding) {
        accountBinding = this.VX_userInfo.accountBinding;
      }

      if (this.$platformInfo.os.isWeibo) {
        data.readType = "weibo";
        data.uid = accountBinding.weiboUid || "";
      } else if (this.$platformInfo.os.isWx) {
        data.readType = "weixin";
        data.uid = accountBinding.wexinUnionId || "";
      } else {
        data.readType = "other";
      }

      sysService.addVisitor(data);
    },
    GET_IMG_URL(picID, type) {
      let url = picID;

      if (picID == "" || picID == null || picID == undefined) {
        const defaultImg = {
          "u": default_img_user,
          "b": default_img_banner,
          "doc": default_img_doc,
          "article": default_img_article,
          "news": default_img_news,
          "hospital": default_img_hospital,
        };
        url = defaultImg[type];
      } else {
        if (!/http/.test(picID) && !/_nuxt/.test(picID)) {
          url = PIC_URL + picID + SUB_FIX;
        }
      }

      return url;
    },
    GET_WB_SHAREURL(config) {
      return `https://service.weibo.com/share/mobile.php?
      url=${config.url}&language=zh_cn&title=${config.title}
      &source=&sourceUrl=&pic${config.pic}=&searchPic=true`;
    },
    CHECK_LOGIN(type) {
      let isLogin = false;
      if (!this.VX_is_login) {
        if (this.VX_isInSinaHealApp) {
          jsCallSinaHealth.appLogin();
        } else {
          this.$router.push({
            path: "/login",
            query: {
              referer: encodeURIComponent(this.$route.fullPath),
              type: type,
              comtyId: this.VX_comtyId
            }
          });
        }
      } else {
        isLogin = true;
      }
      return isLogin;
    },
    router_back() {
      if (window.history.length <= 1) {
        this.$router.push({
          name: "Index"
        });
      } else {
        this.$router.back(-1);
      }
    },
    router_replace(route) {
      let path = route.path;
      let query = this._getUrlParams(route.query);
      let url = APP_URL + path + "?" + query;

      // path可能带有url参数
      if (path.indexOf("?") > -1) {
        query = this._getUrlParams(route.query, path);
        url = APP_URL + path + "&" + query;
      } else {
        url = APP_URL + path + "?" + query;
      }

      window.location.replace(url);
    },
    _getUrlParams(query = {}, path = "") {
      path = path.indexOf("?") == -1 ? path + "?": path;
      let pathQuery = path ? path.split("?")[1] : "";


      // 拼接链接地址
      if (!query.comtyId) {
        query.comtyId = this.VX_comtyId;
      }

      let url = "";
      for (let k in query) {
        let value = query[k] != undefined ? query[k] : "";
        let isExits = pathQuery.indexOf(k) >= 0;
        if (!isExits) {
          url += `&${k}=${value}`;
        }
      }
      return url ? url.substring(1) : "";
    },
    //限制文字显示字数
    limit: function(val, param, subfix) {
      let result = val;
      if (result && result.length > param) {
        result = result.substring(0, param);
        if (subfix != undefined) {
          result += subfix;
        } else {
          result += "...";
        }
      }
      return result;
    },
    //移除文本中的html
    removeHtmlTag: function(val) {
      let result = utils.replaceHtmlTag(val);
      return result;
    },
    //时间戳转换为时间 yy-mm-dd ss
    dataFormat(val) {
      if (val == "" || val == 0 || val == null || val == undefined)
        return "";
      let timeMinSeconds = parseInt(val) * 1000;

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
      return year + "-" + month + "-" + day + " " + hour + ":" + minute;
    },
    preventDoctorLink(item, id) {
      if (item.customerSource && item.customerSource == "famousDoctorOnline") {
        return;
      }
      this.$router.push(`/doctors/${ id }`);
    },
    showPostBar() {
      return showPostBarMixin.showPostBar(this.$route.query.comtyId);
    },
    async SET_PAGE_PERMISSION(type, obj) {
      // 获取当前页面配置权限
      return await permission.init(type, obj);
    },
    GET_PAGE_PERMISSION_MODULE(type) {
      // 获取模块配置权限
      return this.$store.getters.getCurrPermission(type);
    },
    GET_PERMISSION_SEARCH() {
      // 获取权限控制可查询模块
      let arr = [];

      if (this.GET_PAGE_PERMISSION_MODULE("0")) {
        arr.push("文章");
      }
      if (this.GET_PAGE_PERMISSION_MODULE("2")) {
        arr.push("帖子");
      }
      if (this.GET_PAGE_PERMISSION_MODULE("1")) {
        arr.push("专题");
      }

      return arr.join(",");
    }
  },
  filters:{
    //时间戳转换为时间 yy-mm-dd ss
    dateFormat(val,type) {
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
      if(type == "YMD"){
        dataStr =  year + "-"+ month + "-" + day;
      }else if (type == "YMDHM") {
        dataStr = year + "-" + month + "-" + day + " " + hour + ":" + minute;
      }else if(type == "YMDHMS"){
        dataStr = year + "-"+month + "-" + day + " " +hour+ ":"+minute+":" +second;
      }else if(type == "HMS"){
        dataStr = hour+":" + minute+":" + second;
      }else if(type == "YM"){
        dataStr = year + "-" + month;
      }
      return dataStr;
    },
    //限制文字显示字数
    limit: function (val, param, subfix) {
      let result = val;
      if (result && result.length > param) {
        result = result.substring(0, param);
        if (subfix != undefined) {
          result += subfix;
        } else {
          result += "...";
        }
      }
      return result;
    },
    // 阅读量公式
    rvFilter(val) {
      let retult = val ? val : 0;

      return (retult + 7) * 98 + 13;
    }
  },
};

export default commonMixin;
