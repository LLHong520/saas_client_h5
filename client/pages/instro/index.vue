<template>
  <section class="container">
    <m-header :title="comtyInfo.comtyName" :back_on="false"></m-header>
    <div class="introduce_card">
      <div class="community_logo">
        <!--<img v-if="comtyInfo.type == 1" src="~/assets/images/bg_bbs_company@2x.png" width="48" height="48" alt="" />
        <img v-else-if="comtyInfo.type == 2" src="~/assets/images/me_bg_bbs_facility@2x.png" width="48" height="48" alt="" />
        <img v-else src="~/assets/images/me_bg_bbs_hospital@2x.png" width="48" height="48" alt="" />-->
        <img :src="comtyInfo.comtyLogo" width="48" height="48" alt="" />
      </div>
      <dl>
        <dt>{{comtyInfo.comtyName || "社区名称"}}</dt>
        <dd>{{comtyInfo.introduction}}</dd>
      </dl>
      <div class="user_list">
        <div class="faces">
          <span>
            <template v-for="(item,index) in userList">
              <a :key="index" v-if="index < 3">
                <img :src="GET_IMG_URL(item.headPicUrl,'u')" width="60" height="60" alt="" />
              </a>
            </template>
          </span>
          <span>
            <template v-for="(item,index) in doctorImgs">
              <a :key="index" v-if="index < 3">
                <img :src="GET_IMG_URL(item,'doc')" width="60" height="60" alt="">
              </a>
            </template>
          </span>
        </div>
        <p v-if="userNum>0||doctorNum>0">
          <span class="blue">{{userNum}}</span>人已加入 | <span class="blue">{{doctorNum}}</span>位医生已入驻
        </p>
      </div>
    </div>
    <div class="btn_box">
      <a href="javascript:;" @click="doctorLogin">{{joinIng? "加入中...":"现在加入"}}</a>
    </div>
  </section>
</template>

<script>
  import {
    commonMixin,
    comtyIdValid,
    asyncDataMixin
  } from "~/mixins";
  import userService from "~/services/userService.js";
  import homeService from "~/services/homeService.js";
  import communityService from "~/services/communityService.js";
  import header from "~/components/header.vue";
  export default {
    mixins: [commonMixin, comtyIdValid, asyncDataMixin],
    components: {
      mHeader: header
    },
    data() {
      return {
        comtyInfo: {
          comtyName: "",
          introduction: "",
        },
        joinIng: false,
        doctorNum: 0,
        userNum: 0,
        recoDoctorList: [],
        doctorList: [],
        userList: []
      };
    },
    async asyncData({
      route,
      store,
      redirect,
      query
    }) {
      let queryObj = route.query;
      let appAction = queryObj.appAction;

      // 获取社区信息
      let comtyInfo = await comtyIdValid.getComtyInfo({
        redirect,
        store,
        query
      });

      // 设置社区
      store.commit("SET_COMTYID", queryObj.comtyId);

      //如果是app嵌入记录queryString
      if (appAction) {
        store.dispatch("appQueryString", queryObj);
      }

      // 已在pluginss/router做了登录
      if (appAction) {
        await store.dispatch("update_localStorage", queryObj);

        //判断是否已加入社区
        let isJoinRes = await communityService.isJoinCommunity({
          userType: "doctor",
          customerToken: queryObj.docId,
        });

        if (isJoinRes.status == 200 && isJoinRes.data) {
          if (isJoinRes.data.isJoinCommunity == 1 && store.getters.isLogin) {
            return redirect("/", {
              comtyId: queryObj.comtyId
            });

            //医生自动登录
            /*let loginRes = await userService.doctorLogin({ token: queryObj.docId });

            if (loginRes.status == 200 && loginRes.data) {
              //自动登录
              store.dispatch("update_token", loginRes.data.token);

              try {
                //更新用户信息
                await store.dispatch("update_userinfo", loginRes.data.token);
                // return redirect("/", queryObj);
              } catch (error) {
                console.log("获取医生个人信息失败");
              }
            }*/
          }
        }
      }

      return {
        comtyInfo,
        queryObj
      };
    },
    created() {},
    mounted() {
      // this.getCommunityInstro();
      this.getCommunityUserCount();
      this.getDoctorList();
      this.getDocPosSet();
      this.getUserList();
      this.dataPvUvcollect({
        businessType: "index",
        collectType: "cmty_h5_introduction",
        businessId: this.VX_comtyId
      });
      window.appTokenInvalid = function () {};
    },
    computed: {
      doctorImgs() {
        let docImgs = [];
        this.recoDoctorList.map((item) => {
          docImgs.push(item.faceimage);
        });
        if (docImgs.length < 3) {
          let needFullNum = 3 - docImgs.length;
          let tarI = needFullNum >= this.doctorList.length ? this.doctorList.length : needFullNum;
          for (let index = 0; index < tarI; index++) {
            docImgs.push(this.doctorList[index].headPicUrl);
          }
        }
        return docImgs;
      }
    },
    methods: {
      getDocPosSet() {
        let queryParams = {};
        homeService.getDocPosSet(queryParams)
          .then(((res) => {
            if (res.status == 200 && res.data) {
              let doctorList = [];
              res.data.map((item) => {
                if (item.doctorId != "") {
                  doctorList.push(item);
                }
              });
              this.recoDoctorList = doctorList;
            }
          }));
      },
      callAPPRelogin() {
        if (this.$platformInfo.iaskApp.source && this.$platformInfo.iaskApp.source == "ios") {
          try {
            window.webkit.messageHandlers.appTokenInvalid.postMessage("");
          } catch (error) {
            console.log("调用APP登陆失败");
          }
        } else if (this.$platformInfo.iaskApp.source && this.$platformInfo.iaskApp.source == "android") {
          try {
            window.kxx.appTokenInvalid();
          } catch (error) {
            console.log("调用APP登陆失败");
          }
        }
      },
      getCommunityUserCount() {
        let queryParams = {};
        communityService.getCommunityUserCount(queryParams)
          .then(((res) => {
            if (res.status == 200 && res.data) {
              this.userNum = res.data;
            }
          }));
      },
      getCommunityInstro() {
        //社区简介
        communityService.getCommunityInstro({})
          .then((res) => {
            if (res.status == 200) {
              this.comtyInfo = res.data;

              if (this.comtyInfo.logo && this.comtyInfo.logo.url) {
                this.comtyInfo.comtyLogo = this.comtyInfo.logo.url;
              } else {
                switch (this.comtyInfo.type) {
                  case 1:
                    this.comtyInfo.comtyLogo = require("~/assets/images/bg_bbs_company@2x.png");
                    break;
                  case 2:
                    this.comtyInfo.comtyLogo = require("~/assets/images/me_bg_bbs_facility@2x.png");
                    break;
                  default:
                    this.comtyInfo.comtyLogo = require("~/assets/images/me_bg_bbs_hospital@2x.png");
                }
              }

              this.$store.commit("SET_ORGID", this.comtyInfo.bId);
            }
          });
      },
      getDoctorList() {
        //入驻医生列表
        communityService.enrolledDoctorInfo({})
          .then((res) => {
            if (res.status == 200 && res.data) {
              this.doctorNum = res.total;
              this.doctorList = res.data || [];
            }
          });
      },
      joinComty() {
        if (this.$store.state.token != "") {
          userService.joinInComty({
            userType: this.$platformInfo.iaskApp.isApp == 1 ? "doctor" : "user",
          }).then((res) => {
            this.joinIng = false;
            if (res.status == 200) {
              this.$router.push({
                path: "/"
              });
            } else {
              this.$toast.tip("加入失败，请重试");
              this.callAPPRelogin();
            }
          });
        } else {
          this.$router.push({
            path: "/"
          });
        }
      },
      async doctorLogin() {
        let queryObj = this.queryObj;
        console.log(queryObj);
        //普通用户
        if (!queryObj.docId) {
          this.$router.push({
            path: "/"
          });
          return;
        }

        //若是医生执行登录
        if (this.joinIng) return;
        this.joinIng = true;
        let loginRes = await userService.doctorLogin({
          token: queryObj.docId
        });

        if (loginRes.status == 200 && loginRes.data) {
          //自动登录
          this.$store.dispatch("update_token", loginRes.data.token);
          //更新用户信息
          await this.$store.dispatch("update_userinfo", loginRes.data.token);
          this.joinComty();
        } else {
          if (process.client) {
            //通知App重新登录
            this.callAPPRelogin();
          }
          this.joinIng = false;
          this.$toast.tip("加入失败，请重试");
        }
      },
      getUserList() {
        //入驻用户列表
        let queryParams = {
          page: 1,
          size: 10,
        };
        communityService.getUserList(queryParams)
          .then((res) => {
            if (res.status == 200 && res.data) {
              this.userList = res.data;
            }
          });
      }
    },
    watchQuery: true,
    head() {
      return {
        title: this.comtyInfo.comtyName,
      };
    }
  };

</script>

<style lang="less" scoped>
  .introduce_card {
    padding-top: 20px;
    background-color: #fff;
    text-align: center;
    padding-bottom: 40px;

    .community_logo {
      height: 48px;

      img {
        display: block;
        width: 48px;
        height: 48px;
        border-radius: 48px;
        margin: 0 auto;
      }
    }

    dl {
      font-size: 14px;
      line-height: 20px;
      color: #2D2D2D;
      padding: 10px 38px 0;
    }

    dt {
      font-size: 15px;
      font-weight: bold;
    }

    dd {
      padding-top: 20px;
    }

    .user_list {
      text-align: center;
      font-size: 13px;
      color: #999;

      .blue {
        color: #4B9BC5;
      }

      .faces {
        text-align: center;
        padding-top: 30px;
      }

      span {
        display: inline-block;

        a {
          width: 24px;
          height: 24px;
          display: inline-block;
          margin-left: -5px;

          img {
            display: inline-block;
            width: 24px;
            height: 24px;
            border-radius: 24px;
            border: 1px solid #fff;
          }
        }
      }
    }
  }

  .btn_box {
    padding-bottom: 40px;
    background-color: #fff;

    a {
      display: block;
      width: 110px;
      height: 40px;
      border-radius: 4px;
      line-height: 40px;
      text-align: center;
      color: #fff;
      font-size: 14px;
      background-color: #2688FC;
      margin: 0 auto;
    }
  }

</style>
