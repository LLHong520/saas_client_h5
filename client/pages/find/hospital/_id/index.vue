<template>
  <section class="container"  v-iwen-gesture="onGesture">
    <m-header
      :title="dataInfo.name"
      :border_on="false"
      :share_on="isShowShare"
      :isSuspension="true"
      :readMoreLink="`/find/hospital?comtyId=${$route.query.comtyId}`"
      @shareFn="onShare(false)"
    ></m-header>

    <div class="d-container">
      <!-- 详情封面 -->
      <div class="d-box d-content-header">
        <div
          v-if="slideList.length != 0"
          v-swiper:mySwiper="swiperOption"
          @slideChange="slideChange"
          @click="onPreview"
          class="d-swipe"
        >
          <div class="swiper-wrapper">
            <div class="swiper-slide" v-for="(item, index) in slideList" :key="item.id + index">
              <a href="javascript:;">
                <img v-if="item.isDefault" :src="item.url">
                <img v-else :src="GET_IMG_URL(item.url)">
              </a>
            </div>
          </div>
          <div class="current">
            {{ activeIndex }}/{{ swiperLenth }}
          </div>
        </div>

        <!-- 内容 -->
        <div class="d-content">
          <div class="img"><img v-if="dataInfo.hospitalCover" :src="GET_IMG_URL(dataInfo.hospitalCover.url, 'hospital')"></div>
          <h2>{{ dataInfo.name }}</h2>
          <div class="line color9" v-if="dataInfo.hospitalExpert && dataInfo.hospitalExpert.length > 0">
            <div  class="tag_con">
              <i class="icon good tag_icon"></i>
              <span v-for="tag in dataInfo.hospitalExpert" class="tag" :key="tag">{{tag}}</span>
            </div>
          </div>
          <div class="line color9" v-if="dataInfo.serviceHours">
            <i class="icon time"></i>
            <div class="details">
              <p href="jpvascript:;" > {{ dataInfo.serviceHours }}</p>

            </div>
          </div>
          <!--<p v-if="dataInfo.phone">
            <i class="icon phone"></i>
            {{ dataInfo.phone }}
          </p>-->
          <div class="line" v-if="dataInfo.address">
            <i class="icon address"></i>
            <div class="details">
              <a href="javascript:;" @click="openMap"> {{ dataInfo.address }}</a>
              <span v-if="dataInfo.phone && dataInfo.phone.length > 0" class="phone" @click="dialogShow = true"></span>
            </div>
          </div>
        </div>
      </div>

      <!-- 简介 -->
      <overflow
        v-if="dataInfo.hospitalIntroduce"
        :text="dataInfo.hospitalIntroduce"
        :title="aliaName(dataInfo.introduceAlias, '详情介绍')"
        :toggle="true"
        :line="5"
        :itemHeight="20"
        type="text"
        class="d-box d-msg"
      >
      </overflow>
      <!-- 医院医生 -->
      <div class="d-box" v-if="labelList.length > 0">
        <!--<h3>医院医生 {{ doctorList.length }</h3>-->
        <nuxt-link
          :to="{
            path: $route.path + '/doctor',
            query: {
              comtyId: VX_comtyId
            }
          }"
          class="h3"
        >
          {{ aliaName(dataInfo.doctorAlias, "医院医生" ) }}
          <i class="more"></i>
        </nuxt-link>

        <div class="details">
          <!-- 标签 -->
          <div v-swiper:mySwiperLabel="swiperOptionFree" class="d-swipe-label">
            <div class="swiper-wrapper">
              <div class="swiper-slide" v-for="(item) in labelList" :key="item.id">
                <label :class="{ active: departmentId == item.id }" @click="changeLabel(item.id)">{{ item.name }}</label>
              </div>
            </div>
          </div>

          <!-- 医生 -->
          <div v-swiper:mySwiperDoc="swiperOptionFree" class="d-swipe-doc">
            <div class="swiper-wrapper">
              <a
                class="swiper-slide"
                v-for="(item) in doctorList" :key="item.id"
                href="javascript:;"
                @click="routerTo(item)"
              >
                <div class="img">
                  <img v-lazy="GET_IMG_URL(item.image, 'doc')" alt="">
                  <i v-if="item.type == 0" class="icon"></i>
                </div>
                <div class="content">
                  <h3>{{ item.name }}</h3>
                  <p>{{ item.title }}</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="d-box d-box-flex" v-if="dataInfo.serviceHours">
        <div class="h3"> 服务时间</div>
        <div>
          {{dataInfo.serviceHours}}
        </div>
      </div> -->
      <!-- 点评 -->
      <overflow
        v-if="dataInfo.businessReview"
        title="点评"
        :toggle="true"
        :itemHeight="23"
        class="d-label-content"
      >
        <template slot-scope="slotProps">
          <ul :style="slotProps.styles">
            <li v-for="(item, index) in strToArray(dataInfo.businessReview)" :key="index">{{ item }}</li>
          </ul>
        </template>
      </overflow>

      <!-- 热门活动 -->
      <div v-if="activeList.length > 0" class="d-box d-activity">
        <h3>{{ aliaName(dataInfo.activeAlias, "最新活动") }}</h3>
        <div class="details">
          <ul class="subject_list">
            <li v-for="(item,index) in activeList" :key="index">
              <a :href="getActivityUrl(item)">
                <img :src="GET_IMG_URL(item.activityCover, 'b')" width="100%" alt="">
                <p class="tit">{{ item.title }}</p>
                <p v-if="item.introduction" class="describe">{{ item.introduction }}</p>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 浮层按钮-->
    <!--<no-ssr>
      <transition name="share">
        <div class="d-supernatant" v-if="isOtherAgent && isShowSupernatant">
          <div class="left ">
            <a href="javascript:;" @click="onShare(false)"><i class="icon share"></i>分享</a>
            <nuxt-link to="/"><i class="icon home"></i>首页</nuxt-link>
          </div>
          <div class="right">
            <nuxt-link to="/find/hospital">返回</nuxt-link>
          </div>
        </div>
      </transition>
    </no-ssr>-->

    <!-- 图片预览 -->
    <iwen-preview
      v-model="imgPreview.show"
      :list="imgPreview.list"
      :index="imgPreview.index"
      @close="onPreviewClose"
    ></iwen-preview>

    <!-- 电话选择dialog -->
    <phoneDialog v-model="dialogShow" :option="dialogOption"></phoneDialog>

    <!-- 底部 -->
    <page-loading
      v-if="activeList.length > 0"
      :loading="loading"
      :end="isEnd"
      :empty="activeList.length == 0"
      :isFullScreen="false"
      @loadFn="getActive"
    ></page-loading>

    <m-bottom v-else></m-bottom>

    <!-- 分享 -->
    <m-share :show.sync="isShare" :config="shareConfig" :isAutoFocus="false"></m-share>
  </section>
</template>

<script>
  import { commonMixin, comtyIdValid, dataCollectMixin } from "~/mixins";
  import header from "~/components/header.vue";
  import bottom from "~/components/bottom.vue";
  import share from "~/components/iwen/share.vue";
  import pageLoading from "~/components/pageLoading.vue";
  import richText from "~/components/rich_text.vue";
  import iwenPreview from "~/components/iwen/preview.vue";
  import doctorService from "~/services/doctorService.js";
  import overflow from "./components/overflow.vue";
  import phoneDialog from "./components/phoneDialog.vue";
  import gcoord from "gcoord";
  import bg_hospital_img from "@/assets/images/default/bg_hospital@2x.png";

  export default {
    mixins: [commonMixin, dataCollectMixin],
    components: {
      mHeader: header,
      mBottom: bottom,
      mShare: share,
      pageLoading,
      richText,
      overflow,
      iwenPreview,
      phoneDialog
    },
    async asyncData({route,store,redirect,query}){
      // 获取社区信息
      let comtyInfo = await comtyIdValid.getComtyInfo({ redirect, store, query });

      // 检查应用是否开放
      let PAGE_APP_OBJ = await commonMixin.methods.SET_PAGE_PERMISSION("11", { route, redirect, store });

      // 获取诊室信息
      let dataInfo = {}, slideList = [];
      let res = await doctorService.getConsultationInfo({ id: route.params.id });

      if (res.status == 200 && res.data) {
        dataInfo = res.data;
        let list=res.data.infoCover?res.data.infoCover.filter((item)=>{if(item.id){return item;}}):[];
        slideList = list;
      }else{
        return redirect({
          path: "/notFound",
          query: {
            statusCode: 404,
            message: "页面不存在"
          }
        });
      }

      return {
        comtyInfo,
        PAGE_APP_OBJ,
        dataInfo,
        slideList
      };
    },
    data() {
      return {
        bg_hospital_img,
        isShowSupernatant: true,
        isShare: false,
        shareConfig: {},
        dialogShow: false,
        dialogOption: {
          list: []
        },
        imgPreview: {
          show: false,
          list: [],
          index: 1
        },
        pid: "",
        comtyInfo: {},
        dataInfo: {},
        activeIndex: 1,
        slideList: [],
        labelList: [],
        doctorList: [],
        doctorTotal: 0,
        activeList: [],
        departmentId: "",
        loading: false,
        activeTotal: 1,// 初始化为1
        params: {
          page: 0,
          size: 5,
          name: ""
        },
        swiperOption: {
          loop: true,
          autoplay: {
            delay: 2000,
            stopOnLastSlide: false,
            disableOnInteraction: false
          },
          spaceBetween: 13,
          centeredSlides: true
        },
        swiperOptionFree: {
          slidesPerView: "auto",
          spaceBetween: 10,
          freeMode: true,
        },
      };
    },
    computed: {
      swiperLenth() {
        return this.slideList.length;
      },
      isEnd() {
        return this.params.page >= Math.ceil(this.activeTotal / this.params.size);
      },
      isOtherAgent() {
        if (this.$platformInfo) {
          let os = this.$platformInfo.os;
          return os.isWx || os.isWeibo || os.isMp || this.VX_isInApp;
        } else {
          return false;
        }
      },
      isShowShare(){
        let is = true;
        if(process.client){
          //宝宝树孕育APP种隐藏H5分享按钮
          if(/pregnancy/.test(window.navigator.userAgent.toLowerCase())) {
            is = false;
          }
        }
        return is;
      }
    },
    // filters: {
    //   filtersGoodAt(val) {
    //     if (val.length > 0) {
    //       return val.join(" ");
    //     }
    //   }
    // },
    created() {
      this.pid = this.$route.params.id;
      this.dialogOption.list = this.dataInfo.phone;

      this.getDepart();
      this.getDoctor();
      this.getActive();
      this.onShare(true);

      if (this.slideList.length == 0) {
        this.slideList.unshift({
          id: new Date().getTime(),
          url: this.bg_hospital_img,
          isDefault: true,
        });
      }

      if (this.swiperLenth == 1) {
        this.swiperOption.loop = false;
        this.swiperOption.autoplay = false;
      }
    },
    mounted() {
      this.$store.dispatch("update_city");
      this.windowScroll();
      /*this.dataCollectVisitor({
        type: "12",
        contentId:this.pid
      });*/
      this.addUserOperationRecord({
        operationType:0,
        objType:4,
        objTitle:this.dataInfo.name
      });
      this._dataCollect({
        contentId: this.pid,
        contentType: "12",
        operationType: "0"
      });
      this.showBabyTreeShareIcon();
    },
    updated() {
      if (this.isEnd) {
        $(window).unbind("scroll");
      }
    },
    destroyed() {
      $(window).unbind("scroll");
    },
    methods: {
      getActivityUrl(item){
        let url = item.url;
        /*
        * 根据上海同事的需求描述，若是药店地图中配置的活动链接为老百姓大药房的链接 则 在其链接后拼接上经纬度 地址定位 省市区信息
        */
        let LBXDRUGSLinks = [
          "http://wechattest.lbxdrugs.com/lbxdrugs-weoffacc-uat/pages/html/medicine/medicineHome.html",//测试环境链接
          "http://wx.lbxdrugs.com/lbxdrugs-weoffacc/pages/html/medicine/medicineHome.html",//正式环境链接
        ];
        let LBXDRUGSComtyids = ["5e4dec6c24aa9a00082ec989","5c0489e68a1e0e0008118bf1","5d009fbc3cdea20006e9ba37"];
        let isLBXDRUGSLinks = LBXDRUGSComtyids.indexOf(this.$route.query.comtyId) >= 0? true:false;
        let isLBXDRUGSComty = LBXDRUGSLinks.some((link)=>{
          return link.startsWith(LBXDRUGSLinks[0]) || link.startsWith(LBXDRUGSLinks[0]);
        });
        if(isLBXDRUGSLinks && this.VX_location && isLBXDRUGSComty){
          let memberid = "1";
          let latitude = this.VX_location.lat;
          let longitude = this.VX_location.lng;
          let queryString = `memberid=${memberid}&latitude=${latitude}&longitude=${longitude}`;
          if(url.indexOf("?") >= 0){
            url += `&${queryString}`;
          }else{
            url += `?${queryString}`;
          }
        }
        return url;
      },
      showBabyTreeShareIcon(){
        let channel = new Date().getTime();
        let path = `https://health.sina.cn/linkcard/saas/community_biz/13/${ this.pid }.htm?channel=${ channel }`;
        //判断是否是宝宝树app 如果是 调用宝宝树的分享api
        if (/pregnancy/.test(window.navigator.userAgent.toLowerCase())) {
          window.share = {
            "share_title" : this.dataInfo.name,
            "share_content" : this.dataInfo.info,
            "image_base64" :  (this.dataInfo.infoCover && this.dataInfo.infoCover.length > 0) ? this.dataInfo.infoCover[0].url : "",
            "share_url" : path
          };
          try {
            window.showShareButton("yes");
          } catch (error) {
            console.log("尝试显示宝宝树APP分享失败");
          }
        }
      },
      routerTo(item) {
        if (item.doctorId) {
          window.location.href = `https://health.sina.cn/zt/doc/${ item.doctorId }`;
        } else {
          this.$router.push({
            path: this.$route.path + "/doctorDetails",
            query: {
              comtyId: this.VX_comtyId,
              id: item.id
            }
          });
        }
      },
      aliaName(alias, name) {
        return (alias && alias != "--") ? alias : name;
      },
      openMap() {
        // 微信内打开微信内置地图
        if (this.$platformInfo.os.isWx && wx) {
          let vm = this;
          // let lng = this.dataInfo.coordinate.coordinates[0];// 经度
          // let lat = this.dataInfo.coordinate.coordinates[1];// 纬度
          let [lng, lat] = gcoord.transform(vm.dataInfo.coordinate.coordinates, gcoord.BMap, gcoord.GCJ02);

          lng = parseFloat(lng);
          lat = parseFloat(lat);

          wx.openLocation({
            latitude: lat, // 纬度，浮点数，范围为90 ~ -90
            longitude: lng, // 经度，浮点数，范围为180 ~ -180。
            name: vm.dataInfo.name, // 位置名
            address:  vm.dataInfo.address, // 地址详情说明
            scale: 18, // 地图缩放级别,整形值,范围从1~28。默认为最大
            infoUrl: "", // 在查看位置界面底部显示的超链接,可点击跳转
            fail: function (res) {
              vm.$router.push({
                path: vm.$route.path + "/map",
                query: {
                  comtyId: vm.VX_comtyId,
                  msg: res.errMsg
                }
              });
            }
          });
        } else {
          this.$router.push({
            path: this.$route.path + "/map",
            query: {
              comtyId: this.VX_comtyId
            }
          });
        }
      },
      onGesture(type) {
        if (type === "none") {
          return;
        }
        this.isShowSupernatant = type !== "up";
      },
      onShare(isInit = false) {
        let channel = new Date().getTime();
        let path = `https://health.sina.cn/linkcard/saas/community_biz/13/${ this.pid }.htm?channel=${ channel }`;
        if (!isInit) {
          //显示H5的分享框
          this.isShare = true;
        }
        this.shareConfig = {
          id: this.pid,
          type: "hospital",
          title: this.dataInfo.name,
          path: path,
          content: this.dataInfo.info,
          imgUrl: (this.dataInfo.infoCover && this.dataInfo.infoCover.length > 0) ? this.dataInfo.infoCover[0].url : ""
        };
      },
      windowScroll() {
        let vm = this;
        $(window).scroll(function(e){
          let scrollTop = $(this).scrollTop();
          let scrollHeight = $(document).height();
          let clientHeight = $(this).height();

          if(scrollTop + clientHeight >= scrollHeight - 50){
            vm.getActive();
          }
        });
      },
      onPreview() {
        // 暂停自动轮播
        this.mySwiper.autoplay.stop();

        this.imgPreview.show = true;
        this.imgPreview.list = this.slideList;
        this.imgPreview.index = this.activeIndex;
      },
      onPreviewClose() {
        // 开启自动轮播
        this.mySwiper.autoplay.start();
      },
      slideChange() {
        let index = this.mySwiper.activeIndex;
        const len = this.swiperLenth;

        if (index > len) {
          this.activeIndex = 1;
        } else if (index < 1) {
          this.activeIndex = len;
        } else {
          this.activeIndex = index;
        }
      },
      strToArray(str) {
        if (!str) { return []; }
        return str.split(";");
      },
      getDoctor() {
        doctorService.getClinicDoctorList({
          clinicId: this.pid,
          page: 1,
          size: 10,
          departmentId: this.departmentId,
          source: "h5",
        }).then( res => {
          if (res.status == 200 && res.data) {
            this.doctorList = res.data || [];

            if (!this.departmentId) {
              this.doctorTotal = res.total;
            }
          }
        });
      },
      getActive() {
        if (this.loading) { return; }
        this.loading  = true;

        let params = {
          page: this.params.page + 1,
          size: this.params.size,
          source: "h5",
          clinicId: this.pid,
        };

        doctorService.getClinicActivityList(params).then( res => {
          if (res.status == 200 && res.data) {
            this.activeList = [...this.activeList, ...res.data];
            this.activeTotal = res.total;
            this.params.page = this.params.page + 1;
          }
        }).finally( () => {
          this.loading  = false;
        });
      },
      getDepart() {
        doctorService.getHospitalDepart({ clinicId: this.pid }).then( res => {
          if (res.status == 200 && res.data) {
            this.labelList = Object.keys(res.data).map( item => {
              return {
                id: item,
                name: res.data[item]
              };
            });
            // this.labelList = res.data || [];
          }
        });
      },
      changeLabel(id) {
        this.departmentId = this.departmentId === id ? "" : id;
        this.getDoctor();
      },

    },
    head() {
      return {
        title: this.dataInfo.name + "_" + this.comtyInfo.comtyName,
        meta: [
          {
            name: "keywords",
            content: this.dataInfo.name
          },
          {
            name: "format-detection",
            content: "telephone=yes"
          }
        ]
      };
    }
  };

</script>

<style lang="less" scoped>
  @m: 15px;
  @p: 15px;
  @br: 4px;
  @color: #2d2d2d;
  @borderColor: #efefef;
  @filterH: 40px;
  @activeC: #2688FC;

  .text-overFlow(@n: 2) {
    display: -webkit-box;
    /* autoprefixer: ignore next */
    -webkit-box-orient: vertical;
    -webkit-line-clamp: @n;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .flex-center {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .color9 {
    color: #999;
  }

  .d-box {
    margin-top: 10px;
    padding: 0 @p @p;
    color: @color;
    background: #fff;
    &.d-box-flex{
      display: flex;
      .h3{
        flex: none;
        padding-top:15px;
      }
    }
    &:first-child {
      margin-top: 0;
    }
    .h3, h3 {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: @m 0;
      color: @color;
      font-size: 15px;
      font-weight: bold;
      .more {
        flex: none;
        width: 20px;
        height: 20px;
        background: url(~assets/images/btn_enter@2x.png) no-repeat right;
        background-size: 100%;
      }
    }
  }

  .d-swipe-label {
    font-size: 12px;
    .swiper-slide {
      width: auto;
      label {
        display: block;
        padding: 3px 10px;
        color: @color;
        line-height: normal;
        background: #F6F8FB;
        border-radius: 25px;
        border: 1px solid #EFF2F7;
        min-width: 70px;
        text-align: center;
        &.active {
          color: @activeC;
          background: #DCECFF;
          border: 1px solid #CCE3FF;
        }
      }
    }
  }

  .d-swipe-doc {
    margin-top: 20px;
    .swiper-slide {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: @p 10px;
      width: 94px;
      text-align: center;
      line-height: normal;
      border: 1px solid @borderColor;
      border-radius: @br;
      overflow: hidden;
      .img {
        position: relative;
        width: 36px;
        height: 36px;
        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: #B6B6B6;
          overflow: hidden;
        }
        .icon {
          position: absolute;
          right: -5px;
          bottom: 0;
          width: 14px;
          height: 14px;
          background: url(~assets/images/tag_icon_vip@2x.png) no-repeat;
          background-size: 100%;
        }
      }
      h3 {
        .text-overFlow(1);
        margin: 10px 0 5px;
        padding: 0;
        color: @color;
        font-size: 14px;
        font-weight: bold;
      }
      p {
        .text-overFlow(1);
        color: #999;
        font-size: 12px;
      }
    }
  }

  .d-content-header {
    padding: 0;
    .d-swipe {
      position: relative;
      height: 234px;
      .current {
        position: absolute;
        right: 10px;
        bottom: 10px;
        z-index: 2;
        padding: 0 10px 0 27px;
        font-size: 12px;
        color: #fff;
        background: url(~assets/images/icon_img_s@2x.png) no-repeat rgba(0, 0, 0, .4);
        background-position: 10px;
        background-size: 12px;
        border-radius: 25px;
      }
      img {
        width: 100%;
        height: 100%;
      }
      /deep/ .swiper-slide {
        transition: all .3s;
        &.swiper-slide-prev:not(.swiper-slide-active),
        &.swiper-slide-next:not(.swiper-slide-active) {
          transform: scaleY(0.9);
        }
      }
    }

    .d-content {
      position: relative;
      padding: 0 @p @p;
      .img {
        position: absolute;
        top: -29px;
        left: 50%;
        transform: translateX(-50%);
        border: 3px solid #fff;
        border-radius: 50%;
        background: #B6B6B6;
        overflow: hidden;
        z-index: 2;
        img {
          width: 58px;
          height: 58px;
        }
      }
      h2 {
        margin: 0 auto;
        padding: 44px 0 30px;
        width: 70%;
        font-size: 17px;
        font-weight: bold;
        line-height: 24px;
        text-align: center;
      }
      .line {
        .tag_con{
          padding-left:26px;
          position: relative;
          .tag_icon{
            position: absolute;
            top:0;
            left: 0;
          }
          .tag{
            color: #666;
            line-height:16px;
            border-radius:2px;
            border:1px solid rgba(214,214,214,1);
            padding: 0 5px;
            margin-right: 8px;
            margin-bottom: 8px;
            display: inline-block;
          }
        }

        .flex-center;
        justify-content: unset;
        align-items: center;
        font-size: 12px;
        line-height: normal;
        & + .line {
          margin-top: 10px;
        }
        i {
          margin-right: 10px;
          width: 16px;
          height: 16px;
          flex: none;
          &.phone {
            background: url(~assets/images/icon_phone_s@2x.png) no-repeat;
            background-size: 100%;
          }
          &.time {
            background: url(~assets/images/icon_time_s@2x.png) no-repeat;
            background-size: 100%;
          }
          &.address {
            background: url(~assets/images/icon_location_s@2x.png) no-repeat;
            background-size: 100%;
          }
          &.good {
            background: url(~assets/images/icon_good_s@2x.png) no-repeat;
            background-size: 100%;
          }
        }
        .details {
          flex: 1;
          display: flex;
          justify-content: space-between;
          align-items: center;
          p{
            color: #2d2d2d;
          }
          a {
            .text-overFlow();
            flex: 1;
            margin-right: 7px;
            padding-right: 25px;
            color: @color;
            line-height: 17px;
            background: url(~assets/images/btn_enter@2x.png) no-repeat right;
            background-size: 20px;
          }
          .phone {
            position: relative;
            flex: none;
            padding-left: 12px;
            width: 34px;
            height: 34px;
            box-sizing: content-box;
            background: url(~assets/images/btn_phone@2x.png) no-repeat right;
            background-size: 26px;
            background-position: 16px 50%;
            &::before {
              content: "";
              position: absolute;
              top: 50%;
              left: 0;
              transform: translateY(-50%);
              width: 1px;
              height: 35px;
              background: @borderColor;
            }
          }
        }
      }
    }
  }

  .d-label-content {
    ul {
      position: relative;
      margin-bottom: -10px;
      transition: all .3s;
    }
    li {
      display: inline-block;
      margin: 0 10px 10px 0;
      padding: 0 8px;
      color: #999;
      font-size: 12px;
      background: #EFF2F7;
      border: 1px solid @borderColor;
      border-radius: 25px;
    }
    label {
      display: block;
      height: 30px;
      background: url(../../../../assets/images/btn_down@2x.png) no-repeat center;
      background-size: 15px;
      transition: all .3s;
      &.up {
        transform: rotate(180deg);
      }
    }
  }

  .d-msg {
    .details {
      line-height: 22px;
      font-size: 13px;
      color: #424242;
    }
    /deep/ .rich_text {
      .text-overFlow(5);
    }
  }

  .d-activity {
    padding-bottom: 0;
  }

  .subject_list {
    position: relative;
    li {
      padding-bottom: 15px;
      border-bottom: 1px solid #EFEFEF;
      & + li {
        margin-top: 15px;
      }
    }

    li:last-child {
      border-bottom: 0;
    }

    a {
      display: block;
      position: relative;
    }

    img {
      display: block;
      height: 140px;
      border-radius: 4px;
      background-color: #f2f2f2;
    }

    .tit {
      .text-overFlow(1);
      font-size: 16px;
      font-weight: normal;
      color: #282828;
      line-height: normal;
      padding: 10px 0 0 0;
    }

    .describe {
      .text-overFlow(1);
      margin-top: 5px;
      color: #999;
      font-size: 12px;
      line-height: normal;
    }
  }

  .d-supernatant {
    position: relative;
    z-index: 10;
    .left, .right {
      position: fixed;
      bottom: 32px;
      left: @p;
      z-index: 2;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 42px;
      color: #fff;
      font-size: 12px;
      background: rgba(40,40,40,0.8);
      border-radius: 25px;
      a {
        display: flex;
        align-items: center;
        color: inherit;
        width: 100%;
        height: 100%;
      }
    }

    .left {
      bottom: 34px;
      padding: 0 13px;
      height: 38px;
      a + a {
        margin-left: 20px;
      }
    }

    .right {
      left: unset;
      right: @p;
      border-radius: 50%;
      width: 42px;
      a {
        justify-content: center;
      }
    }

    .icon {
      flex: none;
      margin-right: 5px;
      width: 24px;
      height: 24px;
      &.share {
        background: url(~assets/images/icon_share_w@2x.png) no-repeat center;
        background-size: 100%;
      }
      &.home {
        background: url(~assets/images/icon_home_w@2x.png) no-repeat center;
        background-size: 100%;
      }
    }
  }

  .share-enter-active {
    animation: share-in .3s;
  }
  .share-leave-active {
    animation: share-out .3s;
  }
  @keyframes share-in {
    0% {
      opacity: 0;
    }

    100% {
      opacity: 1;
    }
  }
  @keyframes share-out {
    0% {
      opacity: 1;
    }

    100% {
      opacity: 0;
    }
  }

</style>
