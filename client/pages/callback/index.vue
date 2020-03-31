<template>
  <section class="container">
    <div class="banner"></div>
    <section class="grid clearfix">
      <ul>
        <li class="grid-cell">
          <div class="cell-icon"></div>
          <p class="cell-text"></p>
        </li>
        <li class="grid-cell">
          <div class="cell-icon"></div>
          <p class="cell-text"></p>
        </li>
        <li class="grid-cell">
          <div class="cell-icon"></div>
          <p class="cell-text"></p>
        </li>
        <li class="grid-cell">
          <div class="cell-icon"></div>
          <p class="cell-text"></p>
        </li>
      </ul>
    </section>
    <div v-for="n in 7" :key="n" class="skeleton">
      <div class="skeleton-head"></div>
      <div class="skeleton-body">
          <div class="skeleton-title"></div>
          <div class="skeleton-content"></div>
      </div>
    </div>
  </section>
</template>

<script>
  import { commonMixin, comtyIdValid, authMixin } from "~/mixins";
  import userService from "~/services/userService.js";
  import utils from "@/utils/index.js";
  // import sysService from "~/services/sysService.js";
  // import { docComtyIds } from "~/middleware/doc_comty_checklogin.js";

  export default {
    mixins: [commonMixin, comtyIdValid, authMixin],
    components: {
    },
    data() {
      return {
        callbackQueryString:{},
        appActions: {
          //医生端自动登录并加入社区
          docJoinComty:"/instro",
        }
      };
    },
    async asyncData({app,route,redirect,store}) {
      let callbackQueryString = route.query;
      // let appAction = callbackQueryString.appAction;
      //============爱问医生app自动登录进来=================
      /*if(appAction){
        return redirect("/instro",callbackQueryString);
      }*/
      return {
        callbackQueryString
      };
    },
    mounted() {
      this.iaskApp = this.$platformInfo.iaskApp;
      let callbackQueryString = this.$route.query;
      if(callbackQueryString.authLoginType != undefined){
        this.third_login_dispath("weibo");
      }else if(callbackQueryString.token != undefined){
        this.third_login_dispath("weixin");
      }else if(callbackQueryString.appToken != undefined){
        this.app_logain();
      } else if (callbackQueryString.docId != undefined) {
        this.app_logain();
      } else{
        this.goToReferer();
      }
    },
    computed:{
      referComtyId(){
        let comtyId="";
        let queryObj = this.$route.query;
        let referer="";
        if(queryObj.referer!=undefined){
          referer = decodeURIComponent(queryObj.referer);
        }
        if (referer) {
          comtyId=utils.getQueryParamByKey("comtyId",referer);
        }
        return comtyId;
      }
    },
    methods: {
      async third_login_dispath(type) {
        // 第三方登录、优化微博客户端调查问卷自动授权进入速度（暂时解决 - by djx 6.11）
        let queryObj = this.$route.query;
        let token = queryObj.token;

        if (queryObj && queryObj.referer && queryObj.referer.indexOf("questionnaire") > -1) {
          // await this.setUserInfo(token);
          await this.$store.dispatch("user_login", token);
          this.routerTo(type, queryObj);
        } else {
          this.third_login(type);
        }
      },
      /*
      * 医生app登录
      * */
      async app_logain() {
        /**
         * ---- app登录流程 ----
         * 1.保存进入时的参数
         * 2.是否带登录信息
         * 3.设置token到头部
         * 4.如果是医生，则医生token换取普通用户token，更新token
         * 5.检查是否医院社区的医生 & 更新状态isDoctor
         * 6.更新用户信息、加入社区
         * 7.新用户则跳转到设置页、医生登录除外
         * 8.end__跳转路由
         * */
        /*let appKey = [
          "1",// 爱问医生诊室（注：医生
          "2",// 新浪健康（注：用户
          "20140123",// 爱问医生（注：用户
          "20190123"// 新浪健康new（注：用户
        ];*/

        let userInfo = {};
        let store = this.$store;
        let queryObj = this.$route.query;
        let isDoc = !!queryObj.docId;
        let appToken = queryObj.appToken || queryObj.docId;
        let identityInfo = isDoc ? { type: "doctor" } : { type: "patient" };
        let type = isDoc ?  "doctor" : "user";
        let docJoinComty = queryObj.appAction && queryObj.appAction == "docJoinComty";

        // 保存app进入参数
        store.dispatch("appQueryString", queryObj);

        // 设置社区
        if (queryObj.comtyId) {
          store.commit("SET_COMTYID", queryObj.comtyId);
        }

        if (!queryObj.isApp || !appToken) {
          this.goToReferer();
          return;
        }

        // 设置请求头token
        store.dispatch("update_token", appToken);

        // 医生token换取社区用户token
        if (isDoc){
          console.log("###doctor appToken ：" + appToken);
          let res = await userService.doctorLogin({ token: appToken });
          if (res.status == 200 && res.data && res.data.token) {
            appToken = res.data.token;
            store.dispatch("update_token", appToken);
          }
        }

        // 检查是否医院社区的医生 & 更新状态isDoctor
        this.checkInfoByToken(appToken, queryObj);

        // 更新用户信息 & 加入社区
        userInfo = await store.dispatch("update_userinfo", appToken);

        console.log("###user token ：" + appToken);
        console.log("###user userInfo");
        console.log(userInfo);

        if (userInfo.status == 200 && userInfo.data) {
          store.commit("SET_IDENTITYINFO", identityInfo);

          // 用户直接加入社区
          if (!isDoc) {
            await store.dispatch("user_joinInComty", {type:type});
          }

          // 新用户则跳转到设置页
          if (userInfo.data.isNewUser == 1 && !isDoc) {
            this.$router.push({ path: "/login_setting" });
            return;
          }
        }else{
          store.dispatch("user_logout");
        }
        // 跳转路由
        if (docJoinComty) {
          if(queryObj.referer!=undefined){
            queryObj.referer = encodeURIComponent(queryObj.referer);
          }
          this.router_replace({
            path: "/instro",
            query: queryObj
          });
        } else {
          this.goToReferer();
        }
      },
      /*
      * 新浪健康App自动登录
      */
      /*async sina_App_login() {
        let userInfo = {};
        let store = this.$store;
        let queryObj = this.$route.query;
        let appToken = queryObj.appToken;
        let appKeys = ["2", "20190123","20140123"];

        if (!queryObj.isApp || !appKeys.includes(queryObj.isApp) || !appToken) {
          this.goToReferer();
          return;
        }

        store.commit("SET_TOKEN", appToken);
        store.dispatch("appQueryString", queryObj);

        // 检查是否医院社区的医生
        this.checkInfoByToken(appToken, queryObj);

        // 更新用户信息
        userInfo = await store.dispatch("update_userinfo",appToken);

        if(userInfo.status == 200 && userInfo.data){
          //加入社区
          store.dispatch("user_joinInComty");

          if (userInfo.data.isNewUser==1) {
            this.$router.push({
              path: "/login_setting"
            });
            return;
          }
        }

        this.goToReferer();
      },*/
      /*
      * 第三方自动登录
      */
      async third_login(type) {
        let queryObj = this.$route.query;
        let token = queryObj.token;
        console.log(`###${ type }登录`);
        console.log(queryObj);
        console.log(`###${ type }登录`);

        //判断是否是医生社区的医生 如果是 则允许进入医生社区 如果不是则不允许进入
        let isPass = await this.checkInfoByToken(token, queryObj);
        if(!isPass) { return; }

        /**
        * ---- 流程 ----
        * 1.设置token到头部，后端统一再头部获取token
        * 2.获取用户信息，后端需要把用户放到其他表
        * 3.检查是否是已有用户绑定第三账号
        * 4.使用合并后的token请求
        * 5.检查用户时候被禁用
        * 6.更新用户信息、加入社区
        * 7.检查用户信息已绑定手机号
        * 8.end__跳转路由
        * */

        // 更新请求token
        this.$store.dispatch("update_token", token);

        // 获取用户信息
        // let res = await userService.getmyinfo({ token: token });
        let res = await this.$store.dispatch("update_userinfo", token);

        // 检查第三方绑定
        let thirdBind = await this.toThirdBind(type, token);

        // 合并账户，获取新token
        token = thirdBind ? thirdBind : token;

        // 如果用户被禁用 直接跳转到/notFound
        if (this.checkUserStatus(res.data.status)) { return; }

        // 更新用户信息
        // await this.setUserInfo(token);
        await this.$store.dispatch("user_login", token);

        // 加入社区
        this.$store.dispatch("user_joinInComty",{type:"",comtyId:this.referComtyId});

        // 检查是否已绑定手机(第三方登录，强制绑定手机)
        /*if (!thirdBind && res.status == 200 && res.data && !res.data.phoneNum) {
          this.goToRedirectUrl("/login/bindPhone");
          return;
        }*/

        // 跳转
        this.routerTo(type, queryObj);
      },
      routerTo(type, queryObj) {
        if (type == "weibo") {
          this.goToReferer();
        } else if (type == "weixin") {
          if(queryObj.isNewUser==1){
            this.goToRedirectUrl("/login_setting");
          }else{
            if(queryObj.referer && queryObj.referer != ""){
              this.goToRedirectUrl(queryObj.referer);
            }else{
              this.goToRedirectUrl("/");
            }
          }
        }
      },
      /*async checkInfoByToken(token, query){
        let is = await sysService.checkInfoByToken({token})
          .then((res)=>{
            if(res.status == 200 && res.data){
              let isPass = res.data.isTrue;
              this.$store.commit("SET_ISDOCTOR", isPass);
              this.$cookies.set("isDoctor", isPass);

              if(!isPass && query.comtyId && docComtyIds.indexOf(query.comtyId) > -1){
                this.$router.replace("/docForbidTip");
              }

              if (docComtyIds.indexOf(query.comtyId) == -1) {
                return true;
              } else {
                return res.data.isTrue;
              }
            }else{
              return true;
            }
          });
        return is;
      },*/
      goToRedirectUrl(pathUrl){
        if(pathUrl){
          this.router_replace({
            path: pathUrl,
            query:{
              referer:this.$route.query.referer? this.$route.query.referer:""
            }
          });
        }else{
          this.router_replace({
            path:"/"
          });
        }
      },
      goToReferer(){
        let queryObj = this.$route.query;
        let referer = queryObj.referer||"";
        referer = decodeURIComponent(referer);

        // 微博会截断参数，需要重新拼上
        if (queryObj.authLoginType!= undefined) {
          let params = JSON.parse(JSON.stringify(queryObj));
          let query = "";

          delete params.authLoginType;
          delete params.token;
          delete params.access_token;
          delete params.referer;
          query = this._getUrlParams(params, referer);
          if (query) {
            referer = referer.indexOf("?") == -1 ? referer + "?": referer;
            referer = referer + "&" + query;
          }
        }

        if(referer!=""){
          this.router_replace({ path:referer });
        }else{
          this.router_replace({ path: "/" });
        }
      },
      async toThirdBind(bindType, thirdToken) {
        // 第三方绑定手机操作
        let phoneToken = localStorage.getItem("phoneToken");

        if (!phoneToken || !thirdToken) { return false; }

        return await userService.bindThirdUser({
          bindType: bindType,
          thirdToken: thirdToken,
          phoneToken: phoneToken,
        }).then( res => {
          let newToken = "";
          if (res.status == 200 && res.data) {
            // 合并后，返回新token
            newToken = res.data.token;
            this.$toast.tip("绑定成功", "", 3000);
          } else {
            newToken = phoneToken;
            this.$toast.tip(res.message, "", 3000);
          }

          return newToken;
        }).finally( () => {
          localStorage.removeItem("phoneToken");
        });
      },
      /*async setUserInfo(token) {
        this.$store.commit("USER_LOGIN", true);
        this.$cookies.set("token", token);
        this.$store.commit("SET_TOKEN", token);
        await this.$store.dispatch("update_userinfo",token);
        await this.$store.dispatch("update_isDoctor", token);
      },*/
      /*checkUserStatus(status) {
        // 检查用户是否被禁用
        if (status && status != 0) {
          this.$store.dispatch("user_logout");
          this.$router.push({
            path: "/notFound",
            query:{
              statusCode:410,
              message:"您的账号已被停用",
              showHeader:false
            }
          });
          return true;
        }

        return false;
      },*/
    },
    head() {
      return {
        title: "跳转中...",
      };
    }
  };

</script>

<style lang="less" scoped>
html{
  background-color: #fff;
}
.skeleton {
    padding: 10px;
}

.skeleton .skeleton-head,
.skeleton .skeleton-title,
.skeleton .skeleton-content,
.cell-icon,
.cell-text,
.banner{
    background: #e7e7e7;
    background-image: linear-gradient(90deg,rgba(255, 255, 255, 0.15) 25%, transparent 25%);
    background-size: 20rem 20rem;
    animation: skeleton-stripes 1s linear infinite;
}

@keyframes skeleton-stripes {
    from {
        background-position: 0 0 ;
    }
    to {
        background-position: 20rem 0;
    }
}

.skeleton-head {
    width: 45px;
    height: 45px;
    float: left;

    &.round{
      border-radius: 50%;
    }
}

.skeleton-body {
    margin-left: 55px;
}

.skeleton-title {
    width: 100%;
    height: 20px;
}

.skeleton-content {
    width: 260px;
    height: 15px;
    margin-top: 10px;
}
.grid{
  width: 100%;
  .cell-icon{
    width: 45px;
    height: 45px;
    border-radius: 50%;
    margin: 0 auto;
  }
  .cell-text{
    width: 45px;
    height: 15px;
    margin: 0 auto;
    margin-top: 10px;
  }
  .grid-cell{
    width: 25%;
    height: auto;
    padding: 15px 0;
    float: left;
  }
}
.banner{
  height: 100px;
  margin-bottom: 10px;
  margin: 10px;
  border-radius: 5px;
}
.clearfix {
  *zoom: 1;
  &:before,
  &:after {
    display: table;
    content: "";
    line-height: 0;
  }
  &:after {
    clear: both;
  }
}
</style>
