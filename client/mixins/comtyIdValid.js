import communityService from "~/services/communityService.js";
import articleService from "~/services/articleService.js";
import excludeLinks from "~/consts/excludeLinks.js";

const comtyIdValidMixin = {
  validate({
    params,
    query,
    route,
    store
  }) {
    /**
     * 注： 校验页面是否有社区id，没有则返回404状态码
     * 注2： 由于没有单独主域名，nginx配置会把404状态码的转到其他地址（newshealth.sina)
     *   所以不需要携带comtyId的，需要在 exclude 添加地址
     * */
    let isExclude = excludeLinks.some(a => {
      return route.path.indexOf(a) != -1;
    });
    let hasComtyId = (query && query.comtyId);
    let result = hasComtyId || isExclude;
    return result;
  },
  async getComtyInfo({
    redirect,
    store,
    query
  }) {
    if (query && query.comtyId) {
      store.commit("SET_COMTYID", query.comtyId);
    }

    let comtyInfo = {
      logo:{},
    };
    let res = await communityService.getCommunityInstro({});

    if (res.status == 200 && res.data && res.data.status == 1) {
      comtyInfo = this.checkLogo(res.data);
      store.commit("SET_ORGID", comtyInfo.bId);
      store.commit("SET_COMTYINFO", comtyInfo);
    } else {
      return redirect("/notFound", {
        statusCode: res.status == 400 ? 400:504,
        message: res.status == 400 ? "您的网址有误，请查正后继续访问~" : "社区内容准备中...",
        showHeader: false
      });
    }

    return comtyInfo;
  },
  async getArticleInfo({
    route,
    redirect,
    store,
    error
  }, type) {
    //获取文章详情
    let res = {};
    let result = {};
    let params = {
      id: route.params.id,
      userId: store.getters.isLogin ? store.state.userInfo.id : ""
    };

    if (type == "video") {
      params.sourceType = route.query.sourceType;
      params.authorId = route.query.authorId;
      res = await articleService.getVideoInfo(params);
    } else {
      res = await articleService.articleInfo(params);
    }

    if (res.status == 200 && res.data) {
      let articleInfo = res.data;
      let authorInfo = articleInfo.authorInfo;
      let subjectInfo = articleInfo.subjectInfo || [];

      articleInfo.articleTags = articleInfo.tags && typeof articleInfo.tags == "array" ?
        articleInfo.tags.map(item => {
          return item;
        }) :
        [];

      result = {
        authorInfo,
        articleInfo,
        subjectInfo
      };
    } else {
      error({
        statusCode: 804,
        message: "文章已删除"
      });
      return;
      // return redirect({
      //   path:"/notFound",
      //   query:{
      //     statusCode:404,
      //     message:"文章已删除"
      //   }
      // });
    }

    return result;
  },
  checkLogo(obj) {
    if (obj.logo && obj.logo.url) {
      obj.comtyLogo = obj.logo.url;
    } else {
      obj.comtyLogo = require("~/assets/images/default/img_hos_emp@2x.png");
      /*switch (obj.type) {
      case 1:
        obj.comtyLogo = require("~/assets/images/bg_bbs_company@2x.png");
        break;
      case 2:
        obj.comtyLogo = require("~/assets/images/me_bg_bbs_facility@2x.png");
        break;
      default:
        obj.comtyLogo = require("~/assets/images/me_bg_bbs_hospital@2x.png");
      }*/
    }
    return obj;
  },
};

export default comtyIdValidMixin;
