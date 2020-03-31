<template>
  <section class="container">
    <m-header title="个人中心" :back_on="false"></m-header>

    <div class="my_card">
      <!-- 已登录 -->
      <a href="javascript:;" :class="{'user': !fromTypeInfo.doctorId}" v-if="VX_is_login" @click="editMyInfo">
        <div class="img"><img :src="GET_IMG_URL(userInfo.headPicUrl,'u')" width="35" height="35" alt=""></div>
        <div class="my_info">
          <div class="content">
            <div class="info">
              {{userInfo.nickName}}
              <span class="male" v-if="userInfo.gender===1"></span>
              <span class="female" v-else></span>
            </div>
            <div class="label" v-if="VX_identityInfo.type=='doctor'">
              <b class="identity">医生</b>
            </div>
          </div>
        </div>
      </a>

      <!-- 未登录 -->
      <nuxt-link v-else :to="{path:'/login',query:{referer:encodeURIComponent('/my'),comtyId:comtyInfo.id}}" class="no-login">
        <div class="img"><img src="~/assets/images/bg_head@2x.png" width="35" height="35" alt=""></div>
        <div class="my_info">
          <dl>
            <dt>点击登录账号</dt>
            <dd>登录后数据不再丢失</dd>
          </dl>
        </div>
      </nuxt-link>
    </div>

    <div class="my-tool">
      <ul>
        <li>
          <a href="javascript:;" @click="routerTo()">
            <i class="icon me_icon_doctor"></i>
            我的医生
          </a>
        </li>
        <li>
          <a href="javascript:;" @click="routerTo()">
            <i class="icon me_icon_collect"></i>
            我的收藏
          </a>
        </li>
        <li v-if="GET_PAGE_PERMISSION_MODULE('2')">
          <a href="javascript:;" @click="routerTo('/my/postList')">
            <i class="icon me_icon_post"></i>
            我的帖子
          </a>
        </li>
        <li>
          <a href="javascript:;" @click="routerTo('/my/messageList')">
            <i class="num">{{ myMesNum | msgFilter }}</i>
            我的消息
          </a>
        </li>
      </ul>
    </div>

    <div class="my_menuList box_wrapper">
      <ul>
        <!--<li v-if="showPostBar()">
          <nuxt-link :to="{path:'/my/messageList'}"><span v-if="myMesNum>0" class="num">{{myMesNum}}</span><em class="icon_post"></em>我的消息</nuxt-link>
        </li>-->
        <!--<li v-if="showPostBar()">
          <nuxt-link :to="{path:'/my/postList'}"><em class="icon_about"></em>我的帖子</nuxt-link>
        </li>-->
        <!-- <li>
          <nuxt-link :to="{path:'/my/about'}"><em class="icon_mes"></em>关于社区</nuxt-link>
        </li> -->
        <li v-if="comtyInfo.serviceUrl&&comtyInfo.serviceUrl!=''">
          <a :href="comtyInfo.serviceUrl"><em class="icon_service"></em>咨询客服</a>
        </li>
        <li>
          <nuxt-link :to="{path:'/my/recommend'}"><em class="icon_recommend"></em>我的邀请</nuxt-link>
        </li>
        <li>
          <nuxt-link :to="{path:'/instro/share'}"><em class="icon_mes"></em>关于社区</nuxt-link>
        </li>
      </ul>
    </div>
    <!-- <div class="logout" v-if="VX_is_login" @click="logout">
      <a href="javascript:;">退出登录</a>
    </div> -->
  </section>
</template>

<script>
  import { commonMixin, comtyIdValid } from "~/mixins";
  import header from "~/components/header.vue";
  import userService from "~/services/userService.js";
  import communityService from "~/services/communityService.js";
  export default {
    layout: "layout_nav",
    mixins: [commonMixin, comtyIdValid],
    components: {
      mHeader: header
    },
    async asyncData({ route, redirect, store, query }) {
      // 获取社区信息
      let comtyInfo = await comtyIdValid.getComtyInfo({ redirect, store, query });

      // 检查应用是否开放
      // let PAGE_APP_OBJ = await commonMixin.methods.SET_PAGE_PERMISSION("", { route, redirect, store });

      return {
        comtyInfo,
        // PAGE_APP_OBJ,
      };
    },
    data() {
      return {
        comtyInfo:{},
        fromTypeInfo: {
          fromType: "",
          doctorId: "",
        },
        myMesNum: "",
        userInfo: {},
      };
    },
    filters: {
      msgFilter(val) {
        if (!val) {
          return "0";
        }

        if (+val > 99) {
          return "99+";
        }

        return val;
      }
    },
    created() {
      if (this.VX_is_login) {
        this.userInfo = this.VX_userInfo;
        this.getUserinfo();
        this.getUserFromType();
        this.myMessageNum();
        this.getCommunityInstro();
      }
    },
    mounted() {
      $("body").eq(0).css({
        "background-color": "#fff",
        "height": "100%"
      });
    },
    destroyed() {
      $("body").eq(0).css({
        "background-color": "#F2F5F8",
        "height": "100%"
      });
    },
    methods: {
      getIdentity(userId){
        userService.getIdentity({
          key: "community:front:h5:fromType:" + this.VX_userInfo.id
        })
          .then((res) => {
            if (res.status == 200 && res.data) {
              let identityInfo = {
                type: "patient",
                doctorId: ""
              };
              if (res.data.fromType == "DOCTOR_APP") { //"CLIENT_H5"
                identityInfo.type = "doctor";
                identityInfo.doctorId = res.data.doctorId;
              }
              this.$store.commit("SET_IDENTITYINFO", identityInfo);
              this.$cookies.set("userIdentityInfo",identityInfo);
            }
          });
      },
      getCommunityInstro() { //社区简介
        communityService.getCommunityInstro({})
          .then((res) => {
            if (res.status == 200) {
              this.comtyInfo = res.data;
            }
          });
      },
      editMyInfo() {
        if (this.fromTypeInfo.doctorId) {
          return;
        }

        // 微信环境下，把push换成replace
        if (this.$platformInfo.isWx) {
          this.$router.replace("/my/edit");
        } else {
          this.$router.push("/my/edit");
        }
      },
      getUserFromType() {
        let data = {
          userId: this.VX_userInfo.id
        };
        userService.getUserFromType(data)
          .then(((res) => {
            if (res.status == 200 && res.data) {
              this.fromTypeInfo = res.data;
            }
          }));
      },
      async getUserinfo() {
        let res = await this.$store.dispatch("update_userinfo", this.VX_token);

        if (res.status == 200) {
          this.userInfo = res.data;
          this.getIdentity(res.data.id);

          if (res.data.status == 1) {
            this.$store.dispatch("user_logout");
            this.$router.replace({
              path: "/notFound",
              query: {
                statusCode: 410,
                message: "用户已被停用",
                showHeader: false
              }
            });
            return;
          }
        }

        /*let data = {
          token: this.VX_token
        };
        userService.getmyinfo(data)
          .then(((res) => {
            if (res.status == 200) {
              this.userInfo = res.data;
              this.getIdentity(res.data.id);
              this.$store.commit("SET_USERINFO", res.data);
              if (res.data.status == 1) {
                this.$store.dispatch("user_logout");
                this.$router.replace({
                  path: "/notFound",
                  query: {
                    statusCode: 410,
                    message: "用户已被停用",
                    showHeader: false
                  }
                });
                return;
              }
            }
          }));*/
      },
      myMessageNum() {
        let data = {};
        userService.myMessageNum(data)
          .then(((res) => {
            if (res.status == 200) {
              this.myMesNum = res.data;
            }
          }));
      },
      logout() {
        this.$store.dispatch("user_logout");
        this.$router.push({
          path: "/",
          query: {
            comtyId: this.$route.query.comtyId,
          }
        });
      },
      routerTo(url) {
        if (!url) {
          this.$toast.tip("功能暂未开放");
          return;
        }

        this.$router.push(url);
      }
    },
    head() {
      return {
        title: "我的",
      };
    }
  };

</script>

<style lang="less" scoped>
  .logout {
    background-color: #fff;
    text-align: center;
  }

  .logout a {
    padding: 15px;
    color: #999;
    display: block;
  }

  .container {
    // position:absolute;
    width: 100%;
    height: 100%;
    min-height: 600px;
    background-color: #fff;
    left: 0;
    top: 0;
  }

  .my_card {
    padding: 0 15px;
    background: url(../../assets/images/me_bg_bbs@2x.png) no-repeat right top #fff;
    background-size: auto calc(100% - 10px);
    a {
      display: flex;
      align-items: center;
      position: relative;
      padding: 40px 0;

      &.user {
        background: url(../../assets/images/btn_enter@2x.png) no-repeat right center;
        background-size: 20px;
      }
    }

    a.no-login {
      background-image: none;
    }

    .img {
      flex: none;
      width: 76px;
      height: 76px;
      border: 4px solid #fff;
      box-shadow: 0px 8px 10px 1px rgba(0,37,89,0.08);
      border-radius: 50%;

      img {
        display: block;
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
  }

  .my_card .my_info {
    box-flex: 1;
    flex: 1;
    width: 0;
    // line-height: 100%;
    font-size: 17px;
    color: #2D2D2D;
    padding-left: 15px;
    font-weight: bold;
    .content{
      position: relative;
      display: flex;
      flex-direction: column;
      .info {

      }
    }
    .identity{
      padding: 0px 8px;
      color:#2688FC;
      font-size: 12px;
      line-height: 12px;
      vertical-align: bottom;
      border:1px solid rgba(38,136,252,1);
      border-radius:10px;
    }
    .male,
    .female {
      display: inline-block;
      width: 20px;
      height: 20px;
      background: url(../../assets/images/icon_lady@2x.png) no-repeat;
      background-size: cover;
      position: relative;
      vertical-align: middle;
      margin-left: 5px;
      top: -2px;
    }

    .male {
      background-image: url(../../assets/images/icon_man@2x.png);
    }

    dl {
      line-height: 25px;
      padding: 10px 0;
    }

    dt {
      font-weight: bold;
      font-size: 17px;
      color: #2D2D2D;
    }

    dd {
      font-size: 13px;
      color: #999;
    }
  }

  .my_card .edit {
    position: absolute;
    right: 10px;
    top: 10px;
    display: inline-block;
    padding: 3px 8px;
    border: 1px solid #ddd;
    border-radius: 3px;
    color: #666;
    font-size: 12px;
  }

  .my_menuList {
    li {
      background-color: #fff;
      display: flex;
      line-height: 21px;
      & + li {
        border-top: 1px solid #EFEFEF;
      }
    }

    li a {
      display: flex;
      align-items: center;
      width: 100%;
      box-sizing: border-box;
      color: #333;
      padding: 17px 0;
      font-size: 15px;
      background: #fff url(../../assets/images/btn_enter@2x.png) no-repeat right center;
      background-size: 20px 20px;
      line-height: normal;
    }

    .num {
      float: right;
      height: 16px;
      min-width: 16px;
      padding: 0 3px;
      line-height: 16px;
      text-align: center;
      font-size: 10px;
      color: #fff;
      box-shadow: 0px 3px 6px 0px rgba(235, 28, 29, 0.3);
      background: rgba(235, 28, 29, 1);
      border-radius: 16px;
      margin: 2px 33px 0 0;
    }

    .icon_mes,
    .icon_post,
    .icon_about,
    .icon_recommend,
    .icon_service {
      display: inline-block;
      width: 20px;
      height: 20px;
      margin-right: 13px;
      background: url(../../assets/images/me_icon_community@2x.png) no-repeat;
      background-size: 20px 20px;
      position: relative;
      vertical-align: middle;
    }

    .icon_post {
      background-image: url(../../assets/images/me_icon_news@2x.png);
    }

    .icon_about {
      background-image: url(../../assets/images/me_icon_post@2x.png);
    }

    .icon_recommend {
      background-image: url(../../assets/images/me_icon_share@2x.png);
    }

    .icon_service {
      background-image: url(../../assets/images/me_icon_service@2x.png);
    }
  }

  .my-tool {
    margin: 0 15px 15px;
    box-shadow:0px 5px 6px 0px rgba(62,125,163,0.06);
    border-radius:5px;
    ul {
      display: flex;
      justify-content: space-between;
      align-items: center;
      li {
        width: 25%;
        a {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 12px 0;
          font-size: 12px;
          color: #666;
        }
        i {
          margin-bottom: 5px;
          height: 34px;
        }
        i.num {
          line-height: 34px;
          color: #282828;
          font-size: 24px;
        }
        i.icon {
          width: 34px;
          border-radius: 50%;
          &.me_icon_doctor {
            background:  url(../../assets/images/me_icon_doctor@2x.png) no-repeat center #F4FAFF;
            background-size: 20px;
          }
          &.me_icon_collect {
            background:  url(../../assets/images/me_icon_collect@2x.png) no-repeat center #F4FAFF;
            background-size: 20px;
          }
          &.me_icon_post {
            background:  url(../../assets/images/me_icon_post@2x.png) no-repeat center #F4FAFF;
            background-size: 20px;
          }
        }
      }
    }
  }
</style>
