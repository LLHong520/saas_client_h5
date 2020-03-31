import { APP_URL } from "~/config";
export default function ({app,req,store,redirect,route}) {
  /**
   *  新浪健康、爱问诊室app自动登录 => 跳转到callback页面登录
   **/

  if (process.server) {
    let query = route.query;
    let isAppLogin = query && query.isApp && (query.appToken || query.docId);// 爱问医生诊室为docId

    // 例外链接
    let excludeURL = [
      "/callback",
    ];
    let isExclude = excludeURL.some( a => { return route.path.indexOf(a) != -1; });

    // 例外参数
    let excludeParams = [
      "isMiddlewareRedirect",
    ];
    let isExcludeParams = excludeParams.some( a => { return route.fullPath.indexOf(a) != -1; });

    // 保存app进入时的参数
    if (query && query.isApp) {
      store.dispatch("appQueryString", query);
    }

    // 未登录 & 携带登录信息 & 例外链接
    if (!store.getters.isLogin && isAppLogin && !isExclude && !isExcludeParams) {
      let referer = encodeURIComponent(route.fullPath + "&fromType=isMiddlewareRedirect"); // 添加来源，防止重复跳转
      let link = APP_URL
        + "/callback?fromType=middleware"
        + "&referer=" + referer;

      redirect(link, query);
    }
  }
}
