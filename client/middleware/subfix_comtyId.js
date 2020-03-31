import {API_URL} from "@/config";
export default function ({app,req,store,redirect,route}) {
  if (route.query && route.query.comtyId){
    store.commit("SET_COMTYID", route.query.comtyId);
  }
  console.log("^^^^^^^^^^^^^^^^");
  console.log("^^^^^^^^^^^^^^^^");
  console.log(route.fullPath);
  console.log(route.comtyId);
  console.log("^^^^^^^^^^^^^^^^");
  console.log("^^^^^^^^^^^^^^^^");
  console.log("^^^^^^^^^^^^^^^^");
  console.log("^^^^^^^^^^^^^^^^");
  /*
  * 客户端url中始终携带社区id
  * 如果当前路由没有携带社区id 则永远携带上
  */
  if (route.query.comtyId == undefined && route.fullPath.indexOf("callback") < 0) {
    if (process.client) {
      console.log("client 补上");
      redirect(API_URL + route.fullPath, {
        ...route.query,
        comtyId: store.state.comtyId
      });
    }else{
      console.log("没有 社区id");
      console.log(route.query.comtyId);

      redirect("/notFound", {
        statusCode: 404,
        message: "链接访问失效",
        showHeader: false
      });
    }
  }
}
