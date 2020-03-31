export const docComtyIds = ["5c3ee4473b3af50008268d07"];// 后端也需要修改

export default function ({app,req,store,redirect,route}) {
  /**
   * 医生社区检测登录 强制用户登录
   **/

  // let docComtyIds = ["5c3ee4473b3af50008268d07"];
  let isDocComty = docComtyIds.some((item)=>{
    return item == store.state.comtyId;
  });
  let whiteListPage = [
    "/instro",
    "/login",
    "/notFound",
    "/docForbidTip",
  ];
  let isWhiteListPate = whiteListPage.some((item) => {
    return item == route.path;
  });;
  let isCallback = (function(){
    let is = false;
    if (route.query.authLoginType != undefined){
      is = true;
    }
    if (route.query.token != undefined) {
      is = true;
    }
    if ((route.query.appAction != undefined && route.query.docId != undefined)) {
      is = true;
    }

    // is = false;
    return is;
  })();
  console.log("是否是医生社区");
  console.log(isDocComty);
  if (process.server && !store.getters.isLogin && isDocComty) {
    // 判断链接是否已带token（必须）
    if (!isCallback && !isWhiteListPate) {
      console.log("重置到登录页面===");
      redirect("/login?referer=" + encodeURIComponent(route.fullPath));
    }
  }
}
