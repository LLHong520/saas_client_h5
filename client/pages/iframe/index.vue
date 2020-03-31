<template>
  <section class="container">
    <m-header :title="PAGE_APP_OBJ.label" :share_on="true" @shareFn="onShare(false)"></m-header>

    <div class="fixed header" :style="{ top: navBarheight + 'px' }">
      <div>
        <img :src="comtyInfo.comtyLogo">
        <div class="content">
          <h3>{{ comtyInfo.comtyName }}</h3>
          <p>{{ comtyInfo.introduction }}</p>
        </div>

      </div>
      <nuxt-link to="/">进入社区</nuxt-link>
    </div>

    <div class="container iframe"  :style="{ top: navBarheight + 44 + 'px' }">
      <iframe v-if="content" :src="content.url" frameborder="0"></iframe>
    </div>

    <div class="suspend" v-if="weiboId" :class="{ hidden:  !isSuspend}">
      <a href="#" @click.prevent="onSuspend">
        <img :src="weiboInfo.photoPicUrl || comtyInfo.comtyLogo">
        去微博逛逛
      </a>
    </div>

    <m-share :show.sync="isShare" :config="shareConfig"></m-share>
  </section>
</template>

<script>
  import {
    commonMixin,
    comtyIdValid,
    asyncDataMixin
  } from "~/mixins";
  const jumpOutIds = [
    "5c52c5ca3b3af500089322be"
    ,"5c2d6f433b3af50009ce2949"
    ,"5c52c2a43b3af50008932294"
    //以下为测试ids
    ,"5c0489e68a1e0e0008118bf1",
    ,"5c810a2c37face00089fd37b"
  ];
  import articleService from "~/services/articleService.js";
  import header from "~/components/header.vue";
  import share from "~/components/iwen/share.vue";

  export default {
    mixins: [commonMixin, comtyIdValid, asyncDataMixin],
    components: {
      mHeader: header,
      mShare: share
    },
    async asyncData({ req,redirect, route, store, query }) {
      let UA = process.server ? req.headers["user-agent"] : navigator.userAgent;
      let isWb = UA.toLowerCase().match(/WeiBo/i) == "weibo";
      let isAndroid = UA.toLowerCase().indexOf("android") > 0 ? true : false;
      console.log("isWb");
      console.log(isWb);
      console.log("isAndroid");
      console.log(isAndroid);
      console.log(jumpOutIds);
      let configInfoRes = await articleService.getCommunityConfig({
        key: query.key
      });
      let configContent = {};
      if (configInfoRes.status == 200 && configInfoRes.data &&  configInfoRes.data.value) {
        configContent = configInfoRes.data.value;
      }
      //是否在需要跳出框架的社区中
      let isInJumpOutIds = jumpOutIds.some((item)=>{
        return item == query.comtyId;
      });
      //是否是百度商桥链接
      configContent.url = configContent.url || "";
      let isBaidu_Q_Url = configContent.url.indexOf("p.qiao.baidu.com")>=0? true:false;
      //如果是百度商桥或在社区id中 则直达第三方
      let isNeedJumpOut = (isBaidu_Q_Url||isInJumpOutIds);
      // iframe中无法打开链接时，直接跳到第三方链接
      if (isWb && isNeedJumpOut) {
        return redirect(configContent.url);
      }
      // 获取社区信息
      let comtyInfo = await comtyIdValid.getComtyInfo({ redirect, store, query });

      // 检查应用是否开放
      let PAGE_APP_OBJ = await commonMixin.methods.SET_PAGE_PERMISSION("9", { route, redirect, store });

      return {
        comtyInfo,
        PAGE_APP_OBJ,
        content:configContent
      };
    },
    data() {
      return {
        title: "",
        comtyInfo: {},
        content: {},
        isSuspend: false,
        isShare: false,
        shareConfig: {},
        isSuspendTime: "",
        weiboId: "",
        weiboInfo: {
          photoPicUrl: ""
        },
        navBarheight: 44,
      };
    },
    computed: {
      isOtherAgent() {
        if (this.$platformInfo) {
          let os = this.$platformInfo.os;
          return os.isWx || os.isWeibo || os.isMp;
        } else {
          return false;
        }
      },
    },
    created() {
      this.title = this.$route.query.key == "consulting_room" ? "咨询室" : "调查问卷";
      if (this.isOtherAgent) {
        this.navBarheight = 0;
      }
    },
    mounted() {
      this.getData();
      this.getWeibo();

      if (this.content && !this.content.url) {
        this.$toast.tip("配置异常！");
      }
    },
    methods: {
      getData() {
        /*
        @key
        * consulting_room  咨询室
        * question_naire  调查问卷
        * blue_add_fans  蓝V id
        * */

        articleService.getCommunityConfig({
          key: this.$route.query.key
        }).then( res => {
          if (res.status == 200 && res.data &&  res.data.value) {
            this.content = res.data.value;

            if (!/http/.test(this.content.url)) {
              this.content.url = `https://${ this.content.url }`;
            }

            // 直接跳转到第三方
            this.fixedIframe(this.content.url);
          }
        });
      },
      async getWeibo() {
        // 获取微博蓝V id
        let res = await articleService.getCommunityConfig({ key: "blue_add_fans" });

        if (res.status == 200 && res.data &&  res.data.value) {
          this.weiboId = res.data.value;
        } else {
          return;
        }

        // 根据 uid 获取微博用户信息
        articleService.getWeiBoInfo({ weiBoUid: this.weiboId }).then( res => {
          if (res.status == 200) {
            this.weiboInfo = res.data;
          }
        });
      },
      onSuspend() {
        if (this.isSuspend) {
          // this.$router.push("/");
          window.location.href = `https://weibo.com/u/${ this.weiboId }`;
          return;
        }

        this.isSuspend = !this.isSuspend;
        this.isSuspendTime = setTimeout( () => {
          this.isSuspend = false;
        }, 3000);
      },
      onShare() {
        this.isShare = true;
        this.shareConfig = {
          id: this.VX_comtyId,
          type: "consulting_room",
          title: "",
        };
      },
      fixedIframe(link) {
        // iframe中无法打开链接时，直接跳到第三方链接
        link = link || "";
        //是否在需要跳出框架的社区中
        let isInJumpOutIds = jumpOutIds.some((item)=>{
          return item == this.$route.query.comtyId;
        });
        //是否是百度商桥链接
        let isBaidu_Q_Url = link.indexOf("p.qiao.baidu.com")>=0? true:false;
        //如果是百度商桥或在社区id中 则直达第三方
        let isNeedJumpOut = (isBaidu_Q_Url||isInJumpOutIds);
        // let isScene = this.$platformInfo.os.isAndroid && this.$platformInfo.os.isWeibo;
        let isScene = this.$platformInfo.os.isWeibo;

        if (isScene && isNeedJumpOut) {
          try {
            // alert("跳出顶层框架");
            window.top.location.href = link;
          } catch (error) {
            // alert("跳出顶层框架失败");
            try {
              window.top.location.href = link;
            } catch (error) {
              window.location.href = link;
            }
          }
        }
      }
    },
    head() {
      return {
        title: this.comtyInfo.comtyName + "_" + this.PAGE_APP_OBJ.label,
      };
    }
  };

</script>

<style lang="less" scoped>
  @m: 9px;
  @p: 9px;
  @br: 3px;
  @activeC: #2688FC;

  .container {
    background: #F2F5F8;
  }

  .text-overFlow(@n: 2) {
    display: -webkit-box;
    /* autoprefixer: ignore next */
    -webkit-box-orient: vertical;
    -webkit-line-clamp: @n;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .iframe {
    position: fixed;
    top: 88px;
    left: 0;
    right: 0;
    bottom: 0;
    margin: 0 auto;
    max-width: 760px;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    iframe {
      width: 100%;
      height: 100%;
    }
  }

  .fixed {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 auto;
    padding: 0 @p;
    max-width: 760px;
    height: 44px;
    color: #333;
    background: linear-gradient(360deg,rgba(243,248,254,1) 0%,rgba(226,240,254,1) 100%);
    z-index: 2;
    &.header {
      top: 44px;
      bottom: unset;
    }
    &.bottom {
      top: unset;
      bottom: 0;
    }
    a {
      margin-left: @m;
      padding: 5px 10px;
      color: #fff;
      background: @activeC;
      border-radius: @br;
      font-size: 12px;
      line-height: normal;
      word-break: keep-all;
    }
    div {
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        margin-right: @m;
        width: 36px;
        height: 36px;
        border-radius: 3px;
      }
    }
    &::after {
      content: "";
      position: absolute;
      top: 0;
      right: 10%;
      bottom: 0;
      background: url(../../assets/images/box_bg_bbs@2x.png) no-repeat;
      background-position: 0 -15px;
      background-size: 100%;
      width: 120px;
      z-index: -1;
    }
    .content {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      font-size: 12px;
      color: #96B5CD;
      h3 {
        font-size: 14px;
        color: #0E3A6A;
      }
      p {
        transform: scale(.9);
        -webkit-transform-origin-x: 0;
      }
      h3, p {
        .text-overFlow(1);
      }
    }
  }

  .suspend {
    position: fixed;
    right: 0;
    bottom: 30%;
    background: rgba(0, 0, 0, .6);
    font-size: 14px;
    overflow: hidden;
    border-top-left-radius: 25px;
    border-bottom-left-radius: 25px;
    transition: all .3s;
    &.hidden {
      transform: translateX(70%);
    }
    a {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: @p/2 @p;
      padding-right: 3*@p;
      color: #fff;
      background: url(../../assets/images/box_icon_enter@2x.png) no-repeat;
      background-size: 10%;
      background-position: 95% 50%;
    }
    img {
      margin-right: @m;
      width: 28px;
      height: 28px;
      border-radius: 50%;
    }
  }
</style>
