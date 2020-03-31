import { LOGIN_URL } from "~/config";
export default function ({app,req,store,redirect,route}) {
  /**
   * 微信自动登录
   **/
  console.log("###wexinLogin");

  if (process.server && !store.getters.isLogin) {
    let UA = req.headers["user-agent"];
    let isWx = UA.toLowerCase().match(/MicroMessenger/i) == "micromessenger";
    let isMp = UA.toLowerCase().match(/miniProgram/i) ? true : false;
    let referer = encodeURIComponent(route.fullPath);
    let token = route.query.token;

    // 判断链接是否已带token（必须）
    if (!token && (isWx || isMp)) {
      // url = "http://192.168.1.230:51003/auth/h5Login?cmtyId=5c0489e68a1e0e0008118bf1&referer=%252Fmy";
      let url = LOGIN_URL + "/auth/h5Login?cmtyId=" + store.state.comtyId;
      url += "&referer="+encodeURIComponent(referer);
      console.log("###url");
      console.log(url);

      redirect(url);
    }
  }
}
