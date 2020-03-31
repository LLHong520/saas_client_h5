import {APP_URL} from "~/config";
import loginWhitelists from "~/consts/loginWhitelist.js";
export default function ({app,req,store,redirect,route}) {
  /**
   * 如果是在微博中打开链接 则自动去登录微博
   **/
  console.log("route.query============");
  if (process.server && !store.getters.isLogin) {
    let UA = req.headers["user-agent"];
    console.log(APP_URL);
    app.$cookies.set("APP_URL", APP_URL);

    if (route.query && route.query.comtyId) {
      app.$cookies.set("comtyId", route.query.comtyId);
    }

    let isInLoginWhitelist = loginWhitelists.some((item)=>{
      return item == route.path;
    });

    let isWb = UA.toLowerCase().match(/WeiBo/i) == "weibo";
    let referer = encodeURIComponent(APP_URL + "/callback?referer=" + route.fullPath);
    app.$cookies.set("APP_URL", referer);
    app.$cookies.set("decodeURIComponent_APP_URL", decodeURIComponent(referer));
    let isWeiBoLoginCallback = route.query.authLoginType? true:false;
    if (isWb && !isWeiBoLoginCallback && !isInLoginWhitelist) {
      console.log("server","请求第三方微博登录");
      let loginUrl = "https://health.sina.cn/" + "userAuth/weibo/login?callBackUrl=" + referer;
      console.log(loginUrl);
      console.log(store.getters.isLogin);
      redirect(loginUrl);
    }
  }
}
