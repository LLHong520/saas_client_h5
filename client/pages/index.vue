<template>
  <section v-if="comtyInfo" class="container d-index">
    <!--<m-header :title="comtyInfo.comtyName" :back_on="false"></m-header>-->
    <div class="search">
      <nuxt-link to="/instro/share" class="img" :iw="`{desc:'社区资料',id:'communityInstro',ext:{url:'${APP_URL}/instro/share'}}`">
        <!--<img :src="(comtyInfo.logo && comtyInfo.logo.url) ? GET_IMG_URL(comtyInfo.logo.url) : comtyInfo.comtyLogo" alt="">-->
        <img :src="comtyInfo.comtyLogo" />
      </nuxt-link>
      <nuxt-link to="/search" class="input" :iw="`{desc:'搜索框',id:'homeSearch',ext:{url:'${APP_URL}/search'}}`"><i></i>搜索医生/文章</nuxt-link>
      <a v-show="!isHideHeader" href="javascript:;" class="icon-share" @click="onShare(false)"></a>
    </div>

    <!-- 轮播banner -->
    <div v-if="slideList.length>0" class="banner_wrapper">
      <m-banner :slideList="slideList"></m-banner>
    </div>

    <!-- 推荐功能位 -->
    <div class="recommond_items" v-if="recommendPosSet14 && recommendPosSet14.length > 0">
      <a href="javascript:;" v-for="(item,index) in recommendPosSet14" :key="index" @click="jumpUrl(item)">
        <img :src="item.icon">
        <p>{{ item.label }}</p>
      </a>
    </div>
    <div class="recommond_items recommond_items2" v-if="recommendPosSet48.length > 0">
      <a href="javascript:;" v-for="(item,index) in recommendPosSet48" :key="index" @click="jumpUrl(item)" :iw="`{desc:'工具卡位',id:'homeTools',ext:{path:'${item.path}'}}`">
        <img :src="item.icon">
        <p>{{ item.label }}</p>
      </a>
    </div>

    <!-- 社区动态 -->
    <!--<m-notice></m-notice>-->

    <!-- 医医讲堂 -->
    <!--<m-video></m-video>-->

    <!-- 模块排序 -->
    <template v-for="module in finalModuleSort">
      <component :is="module.component" :key="module.key"></component>
    </template>

    <!-- 健康科普 -->
    <m-article v-if="articleShow"></m-article>

    <!-- 模块占位 -->
    <section class="loadingPlaceHolder" v-show="loadingModuleSort">
      <loadingPlaceHolder v-for="n in 10" :key="n.key" />
    </section>

    <!-- 分享 -->
    <m-share ref="shareRef" :show.sync="isShare" :config="shareConfig" @success="collectData"></m-share>
  </section>
</template>

<script>
  import {
    commonMixin,
    comtyIdValid,
    asyncDataMixin
  } from "~/mixins";

  import loadingPlaceHolder from "@/components/loading-place-holder/loading-place-holder";
  import header from "~/components/header.vue";
  import banner from "~/components/index/banner.vue";
  import notice from "~/components/index/notice.vue";
  import doctor from "~/components/index/doc.vue";
  import post from "~/components/index/post.vue";
  import subject from "~/components/index/subject.vue";
  import video from "~/components/index/video.vue";
  // import user from "~/components/index/user.vue";
  import article from "~/components/index/article.vue";
  import homeService from "~/services/homeService.js";
  import sysService from "~/services/sysService.js";
  import articleService from "~/services/articleService.js";
  import {
    defaultModuleSort
  } from "~/consts/defaultSettings.js";
  // import appsConfig from "~/consts/apps.js";
  import find_icon_all_on from "~/assets/images/app_icons/find_icon_all@2x.png";
  import pic_banner_normal from "~/assets/images/pic_banner_normal@2x.png";
  import share from "~/components/iwen/share.vue";

  export default {
    watchQuery: true,
    layout: "layout_nav",
    mixins: [commonMixin, comtyIdValid, asyncDataMixin],
    components: {
      mHeader: header,
      mBanner: banner,
      // mNotice: notice,
      mDoctor: doctor,
      mArticle: article,
      mPost: post,
      mSubject: subject,
      mVideo: video,
      loadingPlaceHolder: loadingPlaceHolder,
      mShare: share
    },
    async asyncData({
      route,
      redirect,
      store,
      query
    }) {
      // 获取社区信息
      let comtyInfo = await comtyIdValid.getComtyInfo({
        redirect,
        store,
        query
      });
      console.log("》》》》》》》》comtyInfo");
      console.log(comtyInfo);
      if(comtyInfo == undefined){
        return redirect(400,"/notFound", {
          statusCode: 400,
          message: "您的网址有误，请查正后继续访问~",
          showHeader: false
        });
      }

      // 检查应用是否开放
      let PAGE_APP_OBJ = await commonMixin.methods.SET_PAGE_PERMISSION("", {
        route,
        redirect,
        store
      });

      //获取banner
      let slideList = await homeService.getBannerPosSet({})
        .then(res => {
          if (res.status == 200 && res.data) {
            // 添加默认图片
            if (res.data.length == 0) {
              res.data.push({
                bannerImages: [{
                  url: pic_banner_normal
                }]
              });
            }

            return res.data.filter(item => {
              return item.businessId != "" || item.bannerImages.length > 0;
            });
          }
        });

      //获取模块排序
      let moduleSort = await homeService.getModuleSort({})
        .then((res) => {
          if (res.status == 200 && res.data) {
            return res.data;
          } else {
            return defaultModuleSort;
          }
        }).catch(() => {
          return defaultModuleSort;
        });

      // 获取模块开关
      let https = [];
      let articleShow = true;
      let moduleSwitch = [{
        name: "DOC_POSTION",
        on: true
      },
      {
        name: "SUBJECT_POSTION",
        on: true
      },
      {
        name: "HEALTH_KNOWLEGE",
        on: true
      },
      {
        name: "DOCTOR_VIDEO",
        on: true
      },
      {
        name: "ARTICLE_POSTION",
        on: true
      },
      {
        name: "HOT_POST_POSTION",
        on: true
      },
      ];

      moduleSwitch.map((item) => {
        let http = articleService.findRedisByKey({
          key: item.name + "_" + route.query.comtyId
        });
        https.push(http);
      });
      await Promise.all(https).then(res => {
        res.map((item, index) => {
          if (item.status == 200 && item.data && item.data.length > 0) {
            moduleSwitch[index].on = JSON.parse(item.data);
          }
        });
      });
      articleShow = moduleSwitch[4].on;


      // 推荐位设置
      let appsConfigArr = store.state.permission_list;

      let keyRes = await sysService.getChannelKey({
        key: "channelNum_" + route.query.comtyId
      }); // 获取产品体验
      let roomRes = await articleService.getCommunityConfig({
        key: "consulting_room"
      }); // 获取咨询室
      let setAppOnline = function (posType, params = "") {
        appsConfigArr = appsConfigArr.map(item => {
          if (item.posType == posType) {
            item.isOnline = true;
            item.path += params;
          }
          return item;
        });
      };

      if (keyRes.status == 200 && keyRes.data) {
        setAppOnline(10, keyRes.data);
      }

      if (roomRes.status == 200 && roomRes.data && roomRes.data.value) {
        setAppOnline(9);
      }

      //获取首页推荐位设置
      let recommendPosSet = appsConfigArr
        .filter(a => {
          return a.pagePermission && a.isOnline && a.switchStatus == 1;
        })
        .sort((a, b) => a.sort - b.sort)
        .slice(0, 7);
      recommendPosSet.push({
        icon: find_icon_all_on,
        label: "全部",
        path: "/find",
        isOnline: true,
      });
      let recommendPosSet14 = recommendPosSet.slice(0, 4);
      let recommendPosSet48 = recommendPosSet.slice(4, 9);
      setAppOnline = null;
      return {
        comtyInfo,
        PAGE_APP_OBJ,
        recommendPosSet,
        recommendPosSet14,
        recommendPosSet48,
        slideList,
        moduleSort,
        moduleSwitch,
        articleShow,
      };
    },
    data() {
      return {
        isShare: false,
        shareConfig: {},
        comtyInfo: {
          comtyName: "",
          introduction: "",
        },
        loadingModuleSort: true,
        moduleSort: [],
        finalModuleSort: [],
        slideList: [],
        recommendPosSet: [],
        articleShow: true,
        moduleSwitch: [{
          name: "DOC_POSTION",
          on: true,
          value: doctor
        },
        {
          name: "SUBJECT_POSTION",
          on: true,
          value: subject
        },
        {
          name: "HEALTH_KNOWLEGE",
          on: true,
          value: notice
        },
        {
          name: "DOCTOR_VIDEO",
          on: true,
          value: video
        },
        {
          name: "HOT_POST_POSTION",
          on: true,
          value: post
        },
        ]
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
      isHideHeader() {
        return this.isOtherAgent || this.VX_isInApp;
      }
    },
    created() {},
    mounted() {
      this.onShare(true);
      this.getModuleSort();
      this.dataPvUvcollect({
        businessType: "index",
        collectType: "cmty_h5_index",
        businessId: this.VX_comtyId
      });
    },
    methods: {

      onShare(isInit = false) {
        if (!isInit) {
          this.isShare = true;
        }

        let path = `?comtyId=${ this.VX_comtyId }`;
        let title = `您好，您的朋友向您分享了[${ this.comtyInfo.comtyName }]健康社区，快来看看吧！`;
        this.shareConfig = {
          id: this.VX_comtyId,
          type: "community",
          title: title,
          path: path,
          content: this.comtyInfo.introduce,
          imgUrl: this.comtyInfo.logo.url || "",
          appHidden: false,
        };
      },
      collectData(){
        //爱问统计脚本
        try {
          window._iwDataer.sendCustomData({
            desc:"首页分享",
            id:"homeShare",
            ext:{
              shareConfig:this.shareConfig
            }
          });

        } catch (error) {
          console.log(error);
        }
      },
      getModuleConponment(name) {
        let map = {
          "DOC_POSTION": doctor,
          "SUBJECT_POSTION": subject,
          "HEALTH_KNOWLEGE": notice,
          "DOCTOR_VIDEO": video,
          // "ARTICLE_POSTION": article,
          // "USER_NUM_POSTION": user,
          "HOT_POST_POSTION": post,
        };

        let obj = this.moduleSwitch.filter(item => {
          return item.name == name;
        })[0];

        if (!obj) {
          return;
        }

        if (obj.on) {
          return map[name];
        } else {
          return undefined;
        }
      },
      getModuleSort() {
        let moduleSort = this.moduleSort;

        this.loadingModuleSort = false;
        this.finalModuleSort = moduleSort
          .sort((a, b) => a.sortValue - b.sortValue)
          .map(item => {
            item.component = this.getModuleConponment(item.moduleType);
            return item;
          });
      },
      jumpUrl(item) {
        if (!item.isOnline) {
          this.$toast.tip("敬请期待新功能");
          return;
        }

        if (item.path.indexOf("http") >= 0) {
          window.location.href = item.path;
        } else {
          this.$router.push({
            path: item.path
          });
        }
      }
    },
    head() {
      return {
        title: this.comtyInfo.comtyName + "_" + this.comtyInfo.introduction,
        meta: [{
          name: "keywords",
          content: this.comtyInfo.comtyName + "，" + (this.comtyInfo.labelName ? this.comtyInfo.labelName.join(",") :
            "")
        },
        {
          hid: "description",
          name: "description",
          content: this.comtyInfo.introduction
        }
        ]
      };
    }
  };

</script>

<style lang="less" scoped>
  @import "~/assets/css/list.css";

  .loadingPlaceHolder {
    background-color: #F2F5F8;
    padding: 10px 0px;
  }

  .icon-share {
    display: block;
    width: 32px;
    height: 32px;
    background: url("./../assets/images/nav_share@2x.png") no-repeat center;
    background-size: 32px;
    background-position: 5px;
  }

  .recommond_items2 {
    padding-top: 0;

    a {
      width: 25%;
      flex: none;
    }
  }

</style>
