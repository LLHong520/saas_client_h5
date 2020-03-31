<template>
  <section class="container">
    <m-header :border_on="false"></m-header>
    <h3 class="tit">{{commtyName}}</h3>
    <div class="login_box">
      <div class="login_item">
        <label for="">手机号</label>
        <div class="ipt_wrapper">
          <input type="text" maxlength="11" class="ipt_txt" placeholder="" v-model="loginName">
        </div>
      </div>
      <div class="login_item">
        <label for="">验证码</label>
        <div class="ipt_wrapper">
          <input type="text"  maxlength="6" class="ipt_txt" placeholder="" v-model="loginPass">
          <span v-if="sendAuthCode" class="ipt_sent" @click="getAuthCode(59)">{{this.loading?"发送中":"获取验证码"}}</span>
          <span v-if="!sendAuthCode" class="ipt_sent disabled">已发送({{auth_time}}s)</span>
        </div>
      </div>
    </div>
    <div class="login_btn">
      <a href="javascript:;" class="btn_login" :class="{disabled:!isChecked||logining}" @click="login">
        {{logining? "登录中...":"登录"}}
      </a>

      <a v-if="isRegisterDoc" href="https://www.wenwo.com/jump/app/download.html" class="register-doc">注册爱问医生 >></a>
    </div>
    <div class="login_fast">
      <a href="javascript:;" @click="wxLogin"><img src="~/assets/images/icon_wechat@2x.png" width="50" height="50" alt=""></a>
    </div>
  </section>
</template>

<script>
  import { commonMixin, authMixin } from "~/mixins";
  import {LOGIN_URL} from "@/config";
  import jsCallSinaHealth from "~/native/jsCallSinaHealth.js";
  import tools from "~/utils/tools.js";
  import header from "~/components/header.vue";
  import userService from "~/services/userService.js";
  import communityService from "~/services/communityService.js";
  // import sysService from "~/services/sysService.js";
  // import { docComtyIds } from "~/middleware/doc_comty_checklogin.js";

  export default {
    mixins: [commonMixin, authMixin],
    components: {
      mHeader: header
    },
    data() {
      return {
        loading:false,
        sendAuthCode: true,
        /*布尔值，通过v-show控制显示‘获取按钮’还是‘倒计时’ */
        auth_time: 0,
        /*倒计时 计数器*/
        loginName: "",
        loginPass: "",
        logining: false,
        commtyName: "",
      };
    },
    computed:{
      isChecked(){
        let is = true;
        if (this.loginName == "") {
          is = false;
        }
        if (this.loginPass == "") {
          is = false;
        }
        return is;
      },
      isRegisterDoc() {
        // 注册医生链接
        let query = this.$route.query;
        return query && query.type && query.type == "doctor";
      }
    },
    asyncData({ route, redirect, store, query }){
      console.log("asyncData");
      console.log(store.getters.isLogin);
      console.log(query.referer);
      if(store.getters.isLogin && query.referer && query.referer!=""){
        return redirect({
          path:query.referer
        });
      }
      return {};
    },
    created() {
      if (this.VX_is_login) {
        this.goToRefer();
      }
      if(process.client){
        if(this.$store.getters.isInApp && !this.VX_is_login){
          jsCallSinaHealth.appLogin();
        }
      }
      this.getCommunityInstro();
    },
    mounted(){
      $("body").eq(0).css({"background-color":"#fff","height":"100%"});
    },
    destroyed(){
      $("body").eq(0).css({"background-color":"#F2F5F8","height":"100%"});
    },
    methods: {
      getCommunityInstro() {
        //社区简介
        communityService.getCommunityInstro({})
          .then((res) => {
            if (res.status == 200 && res.data) {
              this.commtyName = res.data.comtyName;
            };
          });
      },
      getAuthCode(seconds) {
        if(this.loading) return;
        let _this = this;
        let phoneNum = tools.trim(_this.loginName);
        if (!(/^1[0-9]\d{9}$/.test(phoneNum))) {
          this.$toast.tip("请输入正确的手机号码");
          return false;
        }
        let data = {
          mobile: phoneNum,
        };
        this.loading = true;
        userService.sendCode(data)
          .then(((res) => {
            this.loading = false;
            if (res.status == 200) {
              this.sendAuthCode = false;
              this.auth_time = seconds;
              var auth_timetimer = setInterval(() => {
                this.auth_time--;
                if (this.auth_time <= 0) {
                  this.sendAuthCode = true;
                  clearInterval(auth_timetimer);
                }
              }, 1000);
            }
          })).catch(()=>{
            this.loading = false;
          });
      },
      async login() {
        if (!this.isChecked) return;
        if (this.logining) return;

        let phoneNum = tools.trim(this.loginName);

        if (!(/^1[0-9]\d{9}$/.test(phoneNum))) {
          this.$toast.tip("请输入正确的手机号码");
          return false;
        }

        this.logining = true;

        let data = {
          tel: phoneNum,
          checkNum: this.loginPass,
          // ...this.$route.query
        };

        if(this.$route.query.businessType&&this.$route.query.businessType=="share"){
          data.channel = this.$route.query.channel;
          data.beUserId = this.$route.query.userId;
          data.beUserType = this.$route.query.userType;
        }

        userService.login(data)
          .then(async (res) => {
            if (res.status == 200 && res.data) {
              //判断是否是医生社区的医生 如果是 则允许进入医生社区 如果不是则不允许进入
              let isPass = await this.checkInfoByToken(res.data.token);
              if(!isPass) {return;}

              await this.$store.dispatch("user_login",res.data.token);
              this.$store.dispatch("user_joinInComty");

              if (res.data.isNewUser == 1) {
                this.$router.push({ path: "/login_setting" });
              } else {
                this.goToRefer();
              }

            }else if(res.status == "410"){
              //若被停用 则跳转停用页面
              this.checkUserStatus(res.status);
            }else{
              this.$toast.tip(res.message);
            }
          })
          .finally(()=>{
            this.logining = false;
          });
      },
      wxLogin(){
        // let callbackUrl = `http://client.wenwo.com/callback?comtyId=${this.$store.state.comtyId}`;
        let referer = this.$route.query.referer;

        // let url = "/auth/h5Login?cmtyId="+this.$store.state.comtyId;
        let url = LOGIN_URL + "/auth/h5Login?cmtyId="+this.$store.state.comtyId;
        if(referer){
          url += "&referer="+encodeURIComponent(referer);
        }
        console.log("==========");
        console.log(url);
        console.log("==========");
        //如果是分享邀请链接邀请进行登录
        if(this.$route.query.businessType&&this.$route.query.businessType=="share"){
          let channel = this.$route.query.channel;
          let userId = this.$route.query.userId;
          let userType = this.$route.query.userType;
          url += encodeURIComponent("&channel="+channel+"&beUserId="+userId+"&beUserType="+userType+"&businessType=''");
          // console.log(url);
          // alert(url);
        }
        // return;
        // let url = "http://192.168.1.240:51003/auth/h5Login?comtyId="+encodeURIComponent(callbackUrl);
        window.location.href = url;
      },
      /*async checkInfoByToken(token){
        let is = await sysService.checkInfoByToken({token})
          .then((res)=>{
            if(res.status == 200 && res.data){
              let isPass = res.data.isTrue;
              this.$store.commit("SET_ISDOCTOR", isPass);
              this.$cookies.set("isDoctor", isPass);

              if(!isPass && docComtyIds.indexOf(this.$route.query.comtyId) > -1){
                this.$router.replace("/docForbidTip");
                return;
              }

              if (docComtyIds.indexOf(this.$route.query.comtyId) == -1) {
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
      goToRefer(){
        console.log(this.$route.query);
        let referer = this.$route.query.referer;
        if(referer){
          this.$router.replace({
            path: decodeURIComponent(referer)
          });
        }else{
          this.$router.replace({
            path: "/my"
          });
        }
      }
    },
    head() {
      return {
        title: "登录",
      };
    }
  };

</script>

<style lang="less" scoped>
  .container {
    width: 100%;
    height: 100%;
    min-height: 600px;
    background-color: #fff;
    left: 0;
    top: 0;
  }

  .tit {
    font-size: 20px;
    color: #282828;
    padding: 26px 35px 0;
  }

  .login_box {
    padding: 0 35px;

    .login_item {
      padding-top: 30px;
      border-bottom: 1px solid #EFEFEF;

      label {
        font-size: 12px;
        color: #999;
        line-height: 17px;
      }

      .ipt_wrapper {
        display: flex;
      }

      .ipt_txt {
        flex: 1;
        box-flex: 1;
        overflow: hidden;
        font-size: 17px;
        color: #282828;
        line-height: 24px;
        padding: 4px 0;
        border: 0;
      }

      .ipt_sent {
        color: #2688FC;
        font-size: 13px;
        line-height: 24px;
        padding: 4px 0;
      }

      .ipt_sent.disabled {
        color: #999;
        font-size: 13px;
      }
    }
  }

  .login_btn {
    text-align: center;
    padding: 40px 35px 0;

    .btn_login {
      display: block;
      width: 100%;
      height: 40px;
      line-height: 40px;
      text-align: center;
      font-size: 15px;
      background-color: #2688FC;
      color: #fff;
      border-radius: 20px;
    }

    .btn_login.disabled {
      background-color: #CFCFCF;
    }

    .register-doc {
      display: inline-block;
      margin-top: 20px;
      color: #999;
      font-size: 13px;
      line-height: normal;
    }
  }

  .login_fast {
    text-align: center;
    width: 100%;
    margin-top:150px;
  }

</style>
