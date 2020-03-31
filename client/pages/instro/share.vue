<template>
  <section class="container">
    <m-header :title="comtyInfo.comtyName" :share_on="true" @shareFn="onShare(false)"></m-header>

    <div class="container">
      <!-- 介绍 -->
      <div class="box instro">
        <img :src="comtyInfo.comtyLogo" alt="logo">
        <div>
          <h2>{{ comtyInfo.comtyName }}</h2>
          <p>{{ comtyInfo.introduction }}</p>
        </div>
      </div>

      <!-- 介绍图片 -->
      <div class="box banner" v-if="comtyInfo.introduce || slideList.length > 0">
        <div v-if="slideList.length > 0" class="d-swiper">
          <div v-swiper:mySwiper="swiperOption">
            <div class="swiper-wrapper">
              <div class="swiper-slide swiper_banner" v-for="(item, index) in slideList" :key="index">
                <a href="javascript:;">
                  <img :src="GET_IMG_URL(item.url)">
                </a>
              </div>
            </div>
            <div class="swiper-pagination swiper-pagination-bullets"></div>
          </div>
        </div>

        <div v-if="comtyInfo.introduce" class="details" :class="{ up: isDetails }">
          简介： {{ comtyInfo.introduce }}
        </div>

        <div class="open-details" v-if="comtyInfo.introduce && comtyInfo.introduce.length > 20" @click="onDetails">
          <i class="icon" :class="{ up: isDetails }"></i>
          {{ isDetails ? "收起简介" : "展开全部" }}
        </div>
      </div>

      <!-- 优秀医生 -->
      <template v-if="doctorList.length > 0">
        <div class="horizontal"><span>明星医生</span></div>
        <div class="box doc">
          <div class="d-swiper" v-swiper:mySwiper2="swiperOption2">
            <div class="swiper-wrapper">
              <div class="swiper-slide" v-for="(item, index) in doctorList" :key="index">
                <a href="javascript:;">
                  <img :src="GET_IMG_URL(item.image.url)">
                  <div class="details">
                    <h3>{{ item.name }} <span>{{ item.professionName }}</span></h3>
                    <p><span>{{ item.hospital }}</span> <span>{{ item.depName }}</span></p>
                    <p class="icon honor">{{ item.honor }}</p>
                    <p class="icon describe">{{ item.field }}</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- 推荐产品 -->
      <template v-if="productList.length > 0">
        <div class="horizontal"><span>推荐产品</span></div>
        <div class="box recommend">
          <ul>
            <li v-for="(item, index) in productList" :key="index">
              <a href="javascript:;">
                <img :src="item.image.url">
                <div class="details">
                  <p class="name">{{ item.name }}</p>
                  <p class="other">
                    <span class="label">参考价:  &#165</span>
                    <span class="num">{{ item.price }}</span>
                  </p>
                </div>
              </a>
            </li>
          </ul>
        </div>
      </template>

      <!-- 联系我们 -->
      <div class="box us">
        <h3>联系我们</h3>
        <ul>
          <li v-for="(item, index) in channel" :key="index" @click="onDialog(item)">
            <img :src="item.icon">
            {{ item.channelName || item.channel }}
          </li>
        </ul>

        <nuxt-link v-if="comtyInfo.serviceUrl && $store.getters.getCurrPermission('9')" class="consult" to="/iframe?key=consulting_room">
          <img src="@/assets/images/me_icon_service@2x.png">
          在线咨询室
        </nuxt-link>
      </div>

      <div class="dialog" v-if="dialogView" @click="onDialog()">
        <div class="content" @click.stop="">
          <div class="name">
            <img :src="dialogOption.icon" alt="">
            <h3>{{ dialogOption.channelName || dialogOption.channel }}</h3>
          </div>

          <div class="code">
            <img :src="dialogOption.qrCode.url">
            <p>扫一扫 关注社区</p>
          </div>
        </div>
        <i class="close"></i>
      </div>
    </div>

    <div class="d-bottom">
      <p class="title">本站内容不代表爱问平台观点</p>
      <p class="details">内容不能替代执业医师当面诊断，请谨慎参阅</p>
    </div>

    <div class="d-suspension">
      <nuxt-link to="/" class="home"></nuxt-link>
      <a href="javascript:;" @click="openApp">
        <span>打开</span>
        <span>APP</span>
      </a>
    </div>

    <!--<div class="fixed bottom">
      <div>
        <img :src="comtyInfo.comtyLogo">
        <div class="content">
          <h3>{{ comtyInfo.comtyName }}</h3>
          <p>{{ comtyInfo.introduction }}</p>
        </div>

      </div>
      <nuxt-link to="/">进入社区</nuxt-link>
    </div>-->

    <m-share :show.sync="isShare" :config="shareConfig"></m-share>
  </section>
</template>

<script>
  import {
    commonMixin,
    comtyIdValid,
    asyncDataMixin
  } from "~/mixins";
  import header from "~/components/header.vue";
  import share from "~/components/iwen/share.vue";

  // 接口
  import communityService from "~/services/communityService.js";
  import homeService from "~/services/homeService.js";

  // 图片
  import icon_weibo from "@/assets/images/icon_weibo@2x.png";
  import icon_gzh from "@/assets/images/icon_gzh@2x.png";
  import icon_wechat from "@/assets/images/icon_wechat@2x.png";

  export default {
    mixins: [commonMixin, comtyIdValid, asyncDataMixin],
    components: {
      mHeader: header,
      mShare: share
    },
    data() {
      return {
        isShare: false,
        shareConfig: {},
        comtyInfo: {},
        swiperOption: {
          loop: true,
          autoplay: {
            delay: 2000,
            stopOnLastSlide: false,
            disableOnInteraction: true
          },
          spaceBetween: 10,
          pagination: {
            el: ".swiper-pagination"
          }
        },
        swiperOption2: {
          loop: true,
          autoplay: {
            delay: 2000,
            stopOnLastSlide: false,
            disableOnInteraction: true
          },
          spaceBetween: 10,
        },
        slideList: [],
        channel: [],
        doctorList: [],
        productList: [],
        isDetails: false,
        dialogView: false,
        dialogOption: {
          url: "",
          name: "",
          icon: ""
        },
      };
    },
    async asyncData({ redirect, route, store, query }) {
      // 获取社区信息
      let slideList = [];
      let comtyInfo = await comtyIdValid.getComtyInfo({ redirect, store, query });

      // 介绍图片轮播图
      if (comtyInfo && comtyInfo.introductImages) {
        slideList = comtyInfo.introductImages || [];
      }

      return {
        comtyInfo,
        slideList
      };
    },
    created() {
      if (this.slideList.length == 1) {
        this.swiperOption.loop = false;
        this.swiperOption.autoplay = false;
      }

      this.getChannelSet();
      this.getRecommend();
      this.onShare(true);
    },
    methods: {
      openApp() {
        if (window.iwenJSNativeBridge) {
          iwenJSNativeBridge.openApp();
        } else {
          window.location.href = "https://health.sina.cn/zt/app/down";
        }
      },
      onDetails() {
        this.isDetails = !this.isDetails;
      },
      onDialog(item) {
        if (item) {
          if (!item.qrCode || !item.qrCode.url) {
            this.$toast.tip("推广渠道二维码未设置~");
            return;
          }

          this.dialogOption = item;
        }

        this.dialogView = !this.dialogView;
      },
      getChannelSet() {
        homeService.getChannelSet().then( res => {
          if (res.status == 200) {
            this.channel = res.data.map((item)=>{
              item.icon = this.getChannelIcon(item.channel);
              return item;
            });
          }
        });
      },
      getChannelIcon(channel) {
        let icon = "";
        switch (channel) {
          case "微信客服":
            icon = icon_wechat;
            break;
          case "微博":
            icon = icon_weibo;
            break;
          case "微信公众号":
            icon = icon_gzh;
            break;
        }
        return icon;
      },
      getRecommend() {
        communityService.getCommunityDocAndProInfo().then( res => {
          if (res.status == 200 && res.data) {
            this.doctorList = res.data.doctorList || [];
            this.productList = res.data.productList || [];

            this.doctorList.sort( (a, b) => { return b.sortNo - a.sortNo;});
            this.productList.sort( (a, b) => { return b.sortNo - a.sortNo;});
            /*.map( item => {
              item.url = !/http/.test(item.url)
                ? `http://${ item.url }`
                : item.url;

              return item;
            });*/
          }
        });
      },
      onShare(isInit = false) {
        if (!isInit) {
          this.isShare = true;
        }

        let title = `您好，您的朋友向您分享了[${ this.comtyInfo.comtyName }]健康社区，快来看看吧！`;
        this.shareConfig = {
          id: this.VX_comtyId,
          type: "community",
          title: title,
          content: this.comtyInfo.introduce,
          imgUrl: this.comtyInfo.logo.url
        };
      }
    },
    head() {
      return {
        title: this.comtyInfo.comtyName + "_社区介绍",
        script: [
          {
            src: "https://health.sina.cn/static/js/iwenJSNativeBridge.js"
          },
        ]
      };
    }
  };

</script>

<style lang="less" scoped>
  @m: 13px;
  @p: 13px;
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

  .box {
    margin: 3.47vw;
    padding: 3.47vw;
    background: #fff;
    border-radius: @br;
  }

  .instro {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: none;
    margin: 0;
    padding-top: 90px;
    background: url(../../assets/images/referral_bg@2x.png) no-repeat;
    background-size: 100% 120px;
    border-radius: unset;
    img {
      margin-bottom: 15px;
      width: 68px;
      height: 68px;
      border-radius: 5px;
      box-shadow:0px 2px 8px 2px rgba(54,166,255,0.1);
    }
    div {
      text-align: center;
      h2 {
        font-size: 16px;
        font-weight: bold;
      }
      p {
        margin-top: 8px;
        padding: 0 @p;
        color: #666;
        font-size: 12px;
      }
    }
  }

  .banner {
    .d-swiper {
      height: 53.833vw;
      border-radius: @br;
      overflow: hidden;
      .swiper_banner{
        height: 53.833vw;
        width: 100%;
        position: relative;
      }
      img {
        display: block;
        width: 100%;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        border-radius: @br;
      }
      /deep/ .swiper-pagination {
        padding-right: 5px;
        text-align: right;
        .swiper-pagination-bullet {
          margin: 0 3px;
          width: 9px;
          height: 2px;
          background: #fff;
          opacity: .6;
          border-radius: unset;
        }
        .swiper-pagination-bullet-active {
          opacity: 1;
        }
      }
    }

    .details {
      .text-overFlow(1);
      font-size: 12px;
      color: #666;
      transition: all .3s;
      &.up {
        -webkit-line-clamp: unset;
      }
    }

    .d-swiper + .details {
      margin-top: 10px;
    }

    .open-details {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: @p 0 0;
      color: #999;
      font-size: 12px;
      i {
        margin-right: 5px;
        width: 20px;
        height: 20px;
        background: url(../../assets/images/btn_down@2x.png) no-repeat center;
        background-size: 100%;
        background-size: 75%;
        &.up {
          background: url(../../assets/images/btn_up@2x.png) no-repeat center;
          background-size: 100%;
          background-size: 75%;
        }
      }
    }
  }

  .doc {
    margin: @m 0;
    padding: 0;
    background: unset;

    .d-swiper {
      border-radius: @br;
      padding: 0 30px;
      overflow: auto;
      .swiper-slide {
        transition: all .3s;
        a {
          display: flex;
          flex-direction: row;
          padding: @p;
          height: 130px;
          color: #333;
          background: #fff;
          border:1px solid rgba(239,242,247,1);
          border-radius: @br;
          img {
            width: 48px;
            height: 48px;
            border-radius: 100%;
            background: #EBECF0;
          }
          .details {
            margin-left: @m;
            flex: 1;
            h3 {
              font-size: 16px;
              font-weight: bold;
              span {
                margin-left: 5px;
                font-size: 12px;
                font-weight: normal;
              }
            }
            p {
              margin-top: 5px;
              color: #666;
              font-size: 12px;
              line-height: normal;
              span + span {
                margin-left: 5px;
              }
            }
            .icon {
              .text-overFlow(1);
              padding-left: 20px;
              color: #999;
              background: url(../../assets/images/icon_speciality@2x.png) no-repeat left;
              background-size: 14px;
              background-position: 0 50%;
              &.honor {
                background: url(../../assets/images/icon_honor@2x.png) no-repeat left;
                background-size: 14px;
                background-position: 0 50%;
              }
            }
          }
        }
      }
      .swiper-slide-prev, .swiper-slide-next {
        transform: rotateX(30deg);
      }
    }
  }

  .recommend {
    padding: 0;
    background: unset;
    ul {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: space-between;
      li {
        margin-bottom: @p;
        width: calc(50% - @p/2);
        a {
          display: block;
          height: 100%;
          color: #333;
          background: #fff;
          border-radius: @br;
          overflow: hidden;
          img {
            width: 100%;
            height: 140px;
          }
          p {
            &.name {
              .text-overFlow;
              font-size: 14px;
              height: 3em;
              line-height: 1.5em;
            }
            &.other {
              display: flex;
              flex-direction: row;
              align-items: baseline;
              color: #EB1C1D;
              .label {
                font-size: 12px;
                white-space:nowrap;
              }
              .num {
                .text-overFlow(1);
                font-size: 18px;
              }
            }
            & + p {
              margin-top: 10px;
            }
          }
          .details {
            padding: @p;
          }
        }
      }
    }
  }

  .us {
    margin: @m 0;
    padding: 20px 0;
    border-radius: unset;
    h3 {

      text-align: center;
      font-size: 16px;
    }
    ul {
      display: flex;
      flex-direction: row;
      margin: 25px auto;
      width: 75%;
      li {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: calc( 100% / 3);
        color: #999;
        font-size: 12px;
        img {
          margin-bottom: @m;
          width: 50px;
          height: 50px;
          border-radius: 100%;
        }
      }
    }
    .consult {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      margin: 0 auto;
      padding: @p 0;
      width: 70%;
      font-size: 14px;
      color: #999;
      background: #F6F8FB;
      border-radius: 25px;
      img {
        margin-right: @m/2;
        width: 24px;
        height: 24px;
      }
    }
  }

  .dialog {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0 22px;
    background: rgba(0, 0, 0, .4);
    .content {
      padding: 3*@p;
      width: 100%;
      background: #fff;
      border-radius: 8px;
      .name {
        text-align: center;
        img {
          width: 50px;
          height: 50px;
          border-radius: 100%;
        }
        h3 {
          .text-overFlow(1);
          margin-top: @m;
          font-size: 15px;
          font-weight: bold;
        }
      }
      .code {
        margin: 3*@p auto 0;
        padding: 10px;
        padding-bottom: 0;
        width: 200px;
        border: 1px solid #EFEFEF;
        border-radius: 8px;
        text-align: center;
        color: #999;
        font-size: 15px;
        img {
          width: 180px;
          height: 180px;
        }
        p {
          margin: @m 0;
        }
      }
    }
    .close {
      margin-top: @m;
      width: 40px;
      height: 40px;
      background: url(../../assets/images/btn_icon_cancel_pure1@2x.png) no-repeat center;
      background-size: 100%;
    }
  }

  .horizontal {
    position: relative;
    margin: 40px 13px 25px;
    height: 1px;
    span {
      position: absolute;
      top: -10px;
      left: 50%;
      -webkit-transform: translateX(-50%);
      transform: translateX(-50%);
      padding: 0 10px;
      background: #f2f5f8;
      color: #333;
      font-size: 16px;
      &::before, &::after {
        content: "";
        position: absolute;
        top: 0;
        bottom: 0;
        right: 100%;
        width: 50px;
        background: url(../../assets/images/title_line_left@2x.png) no-repeat right;
        background-size: 100%;
      }
      &::after {
        left: 100%;
        background: url(../../assets/images/title_line_right@2x.png) no-repeat left;
        background-size: 100%;
      }
    }
  }

  .d-bottom {
    margin: 40px 0 80px;
    font-size: 12px;
    color: #AFAFAF;
    text-align: center;
    .details {
      color: #CFCFCF;
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
</style>
