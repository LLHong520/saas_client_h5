/**
 *
 * 注：路由插件会第一次访问时，
 * 服务端：第一次
 * 客户端：第一次 + 后面的路由跳转
 *
 * */


// import userService from "~/services/userService.js";
import jsCallSinaHealth from "~/native/jsCallSinaHealth.js";
import {
  APP_URL
} from "../config";
import excludeLinks from "~/consts/excludeLinks.js";

export default ({
  app,
  store,
  req,
  route,
  redirect
}) => {
  app.router.beforeEach(async (to, from, next) => {
    console.log("###beforeEach fullPath");
    console.log(to.fullPath);
    //如果得到附加上社区id的链接 则停止当前路由跳转 否则直接执行next回调
    let isExclude = excludeLinks.some(a => {
      return to.path.indexOf(a) != -1;
    });

    if (process.server){
      // let cookieObj = null;
      // if (req && req.headers.cookie) {
      //   cookieObj = app.$cookies.getAll();
      // }
      //记录首次进入页面的社区id
      if (to.query && to.query.comtyId) {
        store.commit("SET_COMTYID", to.query.comtyId);
        next();
      // } else if (cookieObj && cookieObj.comtyId) {
      //   console.log("[cookieObj]");
      //   console.log(cookieObj);
      //   console.log("[cookieObj]");
      //   store.commit("SET_COMTYID", cookieObj.comtyId);
      //   console.log("[new store ] ======comtyId====");
      //   console.log(store.state.comtyId);
      //   next();
      } else {
        if (isExclude){
          console.error("当前页面不需要社区id即可渲染");
          next();
        }else{
          console.error("您访问的页面不存在！");
          next({
            path: "/notFound",
            query: {
              statusCode: 404,
              message: "链接访问失效",
              showHeader: false
            }
          });
        }
      }
    }

    if (process.client) {
      //切换路由时默认隐藏App的分享按钮
      jsCallSinaHealth.hiddenShare({
        hidden: true,
      });

      let toWithComtyId = null;
      let comtyId = store.state.comtyId;
      console.log(store.state.comtyId);
      //当前链接没有社区id则加上社区id再跳转
      if (to.query && !to.query.comtyId) {
        if (comtyId){
          console.log("[拼接前 comtyId] === " + comtyId);
          toWithComtyId = {
            path: to.path,
            params: to.params,
            query: {
              ...to.query
            },
            replace: false
          };
          toWithComtyId.query.comtyId = comtyId;
        } else{
          //如果没有 则跳转社区信息不存在
          toWithComtyId = {
            path: "/notFound",
            query: {
              statusCode: 400,
              message: "您的网址有误，请查正后继续访问",
              showHeader: false
            }
          };
        }
      }
      //如果得到附加上社区id的链接 则停止当前路由跳转 否则直接执行next回调
      let isExclude = excludeLinks.some(a => {
        return to.path.indexOf(a) != -1;
      });

      if (toWithComtyId != null && !isExclude) {
        next(toWithComtyId);
      } else {
        // 微信 ios路由问题。注：不能放到afterEach，因为
        if (process.client) {
          const ua = navigator.userAgent.toLowerCase();
          if (ua.toLowerCase().indexOf("iphone") > -1 && ua.toLowerCase().match(/MicroMessenger/i) == "micromessenger") {
            let path = location.pathname.substr(2, location.pathname.length); // 跟路由为/c，获取到的与path不一致
            if (to.path !== path) {
              location.assign(APP_URL + to.fullPath);
              return;
            }
          }
        }
        next();
      }
    }

  });
  app.router.afterEach(async (to, from) => {});
};
