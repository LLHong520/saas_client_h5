export default function ({store,route,redirect}) {
  if (process.client){
    if (!store.getters.isLogin) {
      console.log("需要登录");
      console.log(route);
      redirect("/login?referer=" + encodeURIComponent(route.fullPath));
    }else{
      console.log("no需要登录");
    }
  }
}
