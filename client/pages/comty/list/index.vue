<template>
  <section class="container d-search">
    <form action="javascript:void(0)" @submit="onSubmit" class="search-box">
      <!-- <nuxt-link to="/"></nuxt-link> -->
      <div class="input">
        <input type="search" v-model.trim="keywords" id="searchInput" ref="searchInput" 
          name="searchInput" placeholder="输入社区名称" @input="changeHandler(viewModel)" />
        <span class="search-icon" @click="onSubmit"></span>
        <span v-if="keywords" class="clear" @click="clearKeyWordsHandler"></span>
        <input type="text" style="display: none" />
      </div>
      <div class="area" @click="toggleFilter">
        <!-- <label></label> -->
        <span>{{ areaInfo.city | limit(3)}}</span>
        <i class="icon" :class="{ up: isFilter }"></i>
      </div>
      <!-- 地区选择 -->
      <iwen-area v-model="isFilter" :is-city="true" ref="iwenArea" @callback="onArea"></iwen-area>
      <!-- /地区选择 -->
    </form>
    <div class="box_wrapper">
      <div v-show="tabList[0].list.length>0">
        <!-- 社区列表 -->
        <ul class="list">
          <!-- {{VX_location&&VX_location.lng}}{{VX_location&&VX_location.lat}} -->
          <li v-for="(item, index) in tabList[0].list" :key="item.key" class="d-box">
            <nuxt-link tag="div" :to="{path:'/',query:{comtyId:item.id}}" class="list-item">
              <div class="content">
                <div class="title isTop">
                  <span class="name">{{ item.comtyName }}</span>
                </div>  
                <div class="score">
                  <div class="rate_con"><rate v-model="item.doctorScore"></rate></div><span v-if="item.appointmentCount>0">{{item.appointmentCount||0}}次预约</span>
                </div>
                <div class="info">
                  <div class="left">
                    <span class="info-item">{{ item.address }}</span>
                  </div>
                  <span class="right">{{ item.distance | filtersDistance }}</span>
                </div>
              </div>
            </nuxt-link>
            <!-- 轮播图 -->
            <!-- <div v-if="item.introductImages && item.introductImages.length >= 3" class="swiper"
              :class="{ single: item.introductImages.length == 1 }" v-swiper="swiperOption"
              :instanceName="'mySwiper' + index">
              <div class="swiper-wrapper">
                <div class="swiper-slide" v-for="(cItem, cIndex) in item.introductImages" :key="cIndex">
                  <div class="img" @click="onPreview(item.introductImages, cIndex)">
                    <img v-if="cItem.url" v-lazy="cItem.url">
                    <img v-else :src="defaultImg">
                  </div>
                </div>
              </div>
            </div> -->
          
            <div v-if="item.introductImages && item.introductImages.length >= 3"  class="introductImages2 introductImages3">
              <div class="introductImages_con">
                <div class="base_img"></div>
                <div class="image_cut_con" :style="{'background-image':'url('+item.introductImages[0].url+')'}"  @click="onPreview(item.introductImages, 0)">
                  <!-- <img v-if="item.introductImages[0].url" v-lazy="item.introductImages[0].url">
                  <img v-else :src="defaultImg">  -->
                </div>
              </div>
              <div class="introductImages_con" >
                <div class="base_img"></div>
                <div class="image_cut_con" :style="{'background-image':'url('+item.introductImages[1].url+')'}"  @click="onPreview(item.introductImages, 1)">
                  <!-- <img v-if="item.introductImages[1].url" v-lazy="item.introductImages[1].url">
                  <img v-else :src="defaultImg">  -->
                  
                </div>
              </div>
              <div class="introductImages_con" >
                <div class="base_img"></div>
                <div class="image_cut_con" :style="{'background-image':'url('+item.introductImages[2].url+')'}" @click="onPreview(item.introductImages, 2)">
                  <!-- <img v-if="item.introductImages[2].url" v-lazy="item.introductImages[2].url">
                  <img v-else :src="defaultImg">  -->
                </div>
              </div>
            </div>
            <div v-if="item.introductImages && item.introductImages.length == 2"  class="introductImages2">
              <div class="introductImages_con">
                <div class="base_img"></div>
                <div class="image_cut_con" :style="{'background-image':'url('+item.introductImages[0].url+')'}" @click="onPreview(item.introductImages, 0)">
                  <!-- <img v-if="item.introductImages[0].url" v-lazy="item.introductImages[0].url">
                  <img v-else :src="defaultImg">  -->
                </div>
              </div>
              <div class="introductImages_con" >
                <div class="base_img"></div>
                <div class="image_cut_con" :style="{'background-image':'url('+item.introductImages[1].url+')'}" @click="onPreview(item.introductImages, 1)">
                  <!-- <img v-if="item.introductImages[1].url" v-lazy="item.introductImages[1].url">
                  <img v-else :src="defaultImg">  -->
                </div>
              </div>
            </div>
            <div v-if="item.introductImages && item.introductImages.length == 1" class="introductImages1">
              <div class="introductImages_con" >
                <!-- <img v-if="item.introductImages[0].url" v-lazy="item.introductImages[0].url">
                <img v-else :src="defaultImg"> -->
                <div class="base_img"></div>
                <div class="image_cut_con" :style="{'background-image':'url('+item.introductImages[0].url+')'}" @click="onPreview(item.introductImages, 0)">
                  <!-- <img v-if="item.introductImages[1].url" v-lazy="item.introductImages[1].url">
                  <img v-else :src="defaultImg">  -->
                </div>
              </div>
            </div>
            <div class="doc_con" v-if="item.doctorCount>0">
              <div class="doc_inner" >
                <div class="doctor " v-for="(doc,docidx) of item.doctorList" v-if="docidx<2">
                  <div class="img"><img v-lazy="GET_IMG_URL(doc.headPicUrl,'doc')" alt=""></div>
                  <a class="toMore info" @click="doctorLink(doc, item.id)">  
                    <span class="customerName">{{doc.customerName}}</span>
                    <span class="depName">{{doc.depName}}</span>
                    <span class="title">{{doc.title}}</span>
                  </a>
                </div>
              </div>
              <div class="go_doctor_list" v-if="item.doctorCount>2">
                <nuxt-link :to="{path:'/doctors',query:{comtyId:item.id}}" class="toMore"> <span>查看全部{{ item.doctorCount }}名医生</span></nuxt-link>
              </div>
            </div>
            <!-- 社区介绍 -->
            <!-- <div class="introduction">
              {{item.introduction}}
            </div> -->
            <!-- /社区介绍 -->
          </li>
        </ul>
        <!-- /社区列表 -->
        <!-- 分页 -->
        <m-page :loading="tabList[0].isLoading" :title="tabList[0].isLoading? '加载中...':'加载更多'" @loadFn="getData2(0)"
          v-if="!isEmpty&&!tabList[0].isReachEnd" :border_on="false"></m-page>
        <m-bottom v-if="!isEmpty&&tabList[0].isReachEnd" :title="bottomText"></m-bottom>
        <!-- 分页 -->
      </div>
      <empty title="暂无相关内容" v-show="!loading && isEmpty"></empty>
      <loading ref="loading"></loading>
    </div>
    <!-- 图片预览 -->
    <iwen-preview ref="imgPreview" v-model="imgPreview.show" :list="imgPreview.list"  :index="imgPreview.index" @close="imgPreview.show=false"></iwen-preview>
  </section>
</template>

<script>
  import Vue from "vue";
  import {
    commonMixin
  } from "~/mixins";
  import default_img_doc from "@/assets/images/default/img_doc_emp@2x.png";
  import default_img_hospital from "@/assets/images/default/img_hos_emp@2x.png";
  import iwenArea from "~/components/iwen/area.vue";
  import communityService from "~/services/communityService.js";
  import iwenPreview from "~/components/iwen/preview.vue";
  import page from "~/components/page.vue";
  import bottom from "~/components/bottom.vue";
  import loading from "~/components/loading.vue";
  import rate from "../../appointment/components/rate";
  import empty from "~/components/empty.vue";
  import utils from "@/utils/index.js";

  export default {
    mixins: [commonMixin],
    name: "comty_list",
    layout: "layout_search",
    components: {
      mBottom: bottom,
      mPage: page,
      empty: empty,
      loading,
      iwenPreview,
      iwenArea,
      rate
    },
    data() {
      return {
        keywords: "",
        areaInfo: {
          name: "全国",
          city: "全国",
        },
        isFilter: false,
        viewModel: this,
        label: "",
        bottomText: "沒有更多了~",
        afterFirstSearch: false,
        loading: false,
        currentPage: 0,
        pageCount: 0,
        pageSize: 10,
        isEmpty: true,
        tabList: [{
          tabName: "健康科普",
          tabType: "article",
          pageCount: 2,
          currentPage: 0,
          list: [],
          idx: 0,
          isLoading: false,
          isReachEnd: false
        }],
        swiperOption: {
          slidesPerView: "auto",
          spaceBetween: 10,
          freeMode: true,
          slidesOffsetBefore: 60,
        },
        imgPreview: {
          show: false,
          list: [],
          index: 1
        },
      };
    },
    computed: {},
    filters: {
      filtersDistance(val, arr) {
        if (arr && arr.length != 0 && arr[0] === 0 && arr[1] === 0) {
          return "";
        }

        if (val > 1) {
          let hasDecimal = val.toString().indexOf(".") > -1;

          if (hasDecimal) {
            val = Math.floor(val * 100) / 100;
          }

          return val + "km";
        } else {
          return Math.floor(val * 1000) + "m";
        }

      }
    },
    watch: {},
    created() {
      this.keywords = this.$route.query.comtyName || "";
    },
    mounted() {
      // console.log(this.$route);
      console.log(Vue.cookies);
      this.windowScroll();
    },
    methods: {
      windowScroll() {
        let vm = this;
        $(window).scroll(function(){
          let scrollTop = $(this).scrollTop();
          let scrollHeight = $(document).height();
          let clientHeight = $(this).height();

          if(scrollTop + clientHeight >= scrollHeight - 50){
            if (!vm.loading) {
              vm.getData2();
            }
            
          }
        });
      },
      doctorLink(item, id) {
        if (item.customerSource && item.customerSource == "famousDoctorOnline") {
          return;
        }
        this.$router.push(`/doctors/${ item.customerId }?comtyId=${id}`);
      },
      changeHandler: utils.debounce((viewModel)=>{
        viewModel.onSubmit();
      }, 500),
      clearKeyWordsHandler() {
        this.keywords = "";
        this.onSubmit();
      },
      getDefault_img(item, type, attr = "logo") {
        if (item[attr] && item[attr].url) {
          return item[attr].url;
        } else {
          const defaultImg = {
            "doctor": default_img_doc,
            "hospital": default_img_hospital,
          };
          return defaultImg[type];
        }
      },
      onPreview(list, index) {
        this.imgPreview.show = true;
        this.imgPreview.list = JSON.parse(JSON.stringify(list));
        this.imgPreview.index = index + 1;
        // this.$refs.imgPreview.open();
      },
      toggleFilter() {
        this.isFilter = !this.isFilter;
      },
      onArea(obj) {
        this.loading = true;
        if(obj.name == "全国"){
          obj.city = "全国";
        }
        this.areaInfo = obj;
        this.reset();
        this.searchInit();
      },
      onSubmit() {
        this.reset();
        this.$router.replace({
          path: "/comty/list",
          query: {
            comtyName: this.keywords
          }
        });
        this.searchInit();
      },
      reset() {
        this.isEmpty = true;
        window.scroll(0,0);
        // console.log(this.tabList[0].list,1111111);
        this.tabList = [{
          tabName: "健康科普",
          tabType: "article",
          pageCount: 2,
          currentPage: 0,
          list: [],
          idx: 0,
          isLoading: false,
          isReachEnd: false
        }];
        // console.log(this.tabList,22222222222222);
      },
      searchInit() {
        
        this.$refs.loading.start();
     
        let params = {
          page: this.tabList[0].currentPage + 1,
          size: this.pageSize,
          comtyName: this.keywords.trim(),
          provinceId: this.areaInfo.provinceId,
          cityId: this.areaInfo.cityId,
          districtId: this.areaInfo.districtId,
          latitude: this.VX_location ? this.VX_location.lat : "22.54605355", // 纬度
          longitude: this.VX_location ? this.VX_location.lng : "114.02597366", // 经度
          type: "1", //1:医院 2:机构/集团 3:医生团体 4:项目型
        };
       
        communityService
          .findComtyListBySearch(params)
          .then(res => {
            if (res.status == 200 && res.data) {
              let scrollIdx = 0;
              this.tabList[0].list = this.tabList[0].list.concat(res.data);
              this.tabList[0].idx = ++scrollIdx;
              this.tabList[0].currentPage = this.tabList[0].currentPage + 1;
              this.tabList[0].pageCount = Math.ceil(res.total / this.pageSize);
              if (this.tabList[0].currentPage >= this.tabList[0].pageCount) {
                this.tabList[0].isReachEnd = true;
              }
              this.isEmpty = this.tabList[0].list.length == 0;
            }
          })
          .finally(() => {
            this.loading = false;
            this.$refs.loading.finish();
          });
      },
      getData2() {
        let params;
        params = {
          page: this.tabList[0].currentPage + 1,
          size: this.pageSize,
          comtyName: this.keywords.trim(),
          provinceId: this.areaInfo.provinceId,
          cityId: this.areaInfo.cityId,
          latitude: this.VX_location ? this.VX_location.lat : "22.54605355", // 纬度
          longitude: this.VX_location ? this.VX_location.lng : "114.02597366", // 经度
          districtId: this.areaInfo.districtId,
          type: "1", //1:医院 2:机构/集团 3:医生团体 4:项目型
        };
        this.getHealthScienceByTitle(params, 0);
      },
      getHealthScienceByTitle(params, idx) {
        if (this.tabList[0].isLoading) return;
        this.tabList[0].isLoading = true;
        communityService
          .findComtyListBySearch(params)
          .then(res => {
            if (res.status == 200 && res.data) {
              if (res.data.length > 0) {
                this.tabList[0].list = this.tabList[0].list.concat(res.data);
                this.tabList[0].currentPage = this.tabList[0].currentPage + 1;
                this.tabList[0].pageCount = Math.ceil(res.total / this.pageSize);
                if (this.tabList[0].currentPage >= this.tabList[0].pageCount) {
                  this.tabList[0].isReachEnd = true;
                }
              } else {
                this.tabList[0].isReachEnd = true;
              }
              this.afterFirstSearch = true;
            }
          })
          .finally(() => {
            this.tabList[0].isLoading = false;
          });
      }
    }
  };

</script>
<style lang="less" scoped>
  @m: 10px;
  @p: 15px;
  @br: 4px;
  @color: #2d2d2d;
  @borderColor: #efefef;
  @filterH: 40px;
  @color3: #282828;
  @color6: #666;
  @color9: #999;
  @borderC: #E6E6E6;
  @active: #2688FC;
  @borderC-light: #EFEFEF;

  .text-overFlow-single {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap
  }

  .text-overFlow(@n: 2) {
    display: -webkit-box;
    /* autoprefixer: ignore next */
    -webkit-box-orient: vertical;
    -webkit-line-clamp: @n;
    overflow: hidden;
    text-overflow: ellipsis;
  }


  .introduction {
    color: #999;
    padding-left: 76px;
    padding-bottom: 10px;
  }

  .container {
    background-color: #F2F5F8;
  }

  .box_wrapper {
    padding: 0;
    min-height: calc(100vh - 44px);
    overflow: auto;
    background-color: initial;
  }

  .d-search {
    padding-top: 50px;
    width: 100%;
    overflow: hidden;
    .input{
      padding-right: 15px;
    }
  }

  .search-box /deep/ .d-select-area{
    top: 44px;

  }
  .d-search .search-box {
    width: 100vw;
    box-sizing: border-box;
  }
  .area {
    justify-content: normal;
    // padding: 0 0 0 @p;
    margin-left: 15px;
    box-sizing: border-box;
    color: #999;
    flex: none;
    // min-width: 125px;
    label {
      word-break: keep-all;
    }

    span {
      color: @color;
      line-height: normal;
    }

    i {
      margin-left: @m/2;
      display: inline-block;
      width: 10px;
      height: 10px;
      background: url(../../../assets/images/btn_down@2x.png) no-repeat center;
      background-size: 100%;
      transition: all .3s;

      &.up {
        transform: rotate(180deg);
      }
    }
  }


  .list {
    padding: 15px 15px 1px;

    .d-box {
      margin-bottom: 15px ;
      background-color: #fff;
      box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.04);
      border-radius: 5px;

      .top {
        position: absolute;
        top: 0;
        right: 0;
        padding-right: 5px;
        width: 40px;
        height: 25px;
        line-height: 23px;
        color: #fff;
        background: url(~assets/images/list_tag_bg@2x.png) no-repeat;
        background-size: 100%;
        text-align: right;
        font-size: 12px;
      }
      .introductImages1{
        padding:0 12px 12px;
        position: relative;
        display: inline-block;
        box-sizing: border-box;
        width: 100%;
        flex: 1;
        overflow: hidden;
        
        .introductImages_con{
          position: relative;
          display: inline-block;   
          border: 1px solid #f3f3f3;
          width: 100%;
          overflow: hidden;
          .base_img{
            position: absolute;
            z-index: 0;
            height:0;
            padding-bottom:40%; 
            width: 100%;
            background-color: rgba(232,236,239,1);
            background-repeat: no-repeat;
            background-position:center;
            background-size: 50%;
            border: 1px solid #f3f3f3;
            background-image: url(~@/assets/images/img_loading.png);
            border-radius:2px;
          }
          .image_cut_con{
            position: relative;
            border-radius:2px;
            width: 100%;
            box-sizing: border-box;
            border: 1px solid #f3f3f3;
            height:0;
            background-repeat: no-repeat;
            background-size: cover;
            background-position:center;
            padding-bottom:40%; 
          }

        }

      }
      .introductImages3{
        .introductImages_con{
          &:nth-child(2){
            margin-right:3px;
          }
        }
      }
      .introductImages2{
        padding:0 12px 12px;
        display: flex;
        .introductImages_con{
          position: relative;
          display: inline-block;
          flex: 1;
          overflow: hidden;
          .base_img{
            position: absolute;
            z-index: 0;
            height:0;
            padding-bottom:62.5%; 
            width: 100%;
            background-color: rgba(232,236,239,1);
            background-repeat: no-repeat;
            background-position:center;
            background-size: 50%;
            border: 1px solid #f3f3f3;
            background-image: url(~@/assets/images/img_loading.png);
            border-radius:2px;
          }
          &:nth-child(1){
            // padding-right: 2px;
             margin-right:3px;
          }
          .image_cut_con{
            position: relative;
            border-radius:2px;
            width: 100%;
            box-sizing: border-box;
            border: 1px solid #f3f3f3;
            height:0;
            background-repeat: no-repeat;
            background-size: cover;
            background-position:center;
            padding-bottom:62.5%; 
          }
        }
      }
      .doc_con{
        padding:0 12px 12px;
        .doc_inner{
          border-top: 1px solid #EFEFEF;
          line-height: 45px;
          .doctor{
            display: flex;
            .toMore{
              background: url(~@/assets/images/btn_enter@2x.png) no-repeat center center;
              background-size: 16px 16px;
              background-position: 100%;
            }
            .info{

              font-size:12px;
              color:#282828;
              flex: 1;
              span{
                margin-right: 10px
              }
              .customerName{
                font-weight: bold;
              }
              .depName{
                font-size:10px;
              }
              .title{
                font-size:10px;
              }
            }
          }
          
        }
        .go_doctor_list{
          text-align: center;
          padding-top:12px; 
          border-top: 1px solid #EFEFEF;
          font-size: 12px;
          .toMore{
            background: url(~@/assets/images/btn_enter@2x.png) no-repeat center center;
            padding-bottom: 2px;
            background-size: 18px 18px;
            background-position: 100%;
            padding-right:24px; 
            color:#999999;
            vertical-align: top;
          }
        }
      }
    }
    .list-item {
      display: flex;
      padding: 12px ;
      color: @color3;

      .img {
        position: relative;
        flex: none;
        width: 48px;
        height: 48px;

        .identification {
          position: relative;
          display: inline-block;
          flex: none;
          width: 54px;
          height: 16px;
          background: url(~assets/images/list_tag_vip@2x.png) no-repeat;
          background-size: 100%;
          left: -5px;
          top: -6px;
        }

        img {
          border-radius: 50%;
          overflow: hidden;
          width: 100%;
          height: 100%;
        }
      }

      .content {
        flex: 1;
        .title {
          display: flex;
          align-items: center;
          font-size: 16px;
          font-weight: bold;

          &.isTop {
            padding-right: 35px;
          }

          span {
            &.name {
              padding-right: @p/2;

              // .text-overFlow(1);
              label {
                font-size: 12px;
                font-weight: normal;
                color: @color6;
              }
            }
          }
        }
        .score{
          margin-top:7px;
          .rate_con{
            display: inline-block;
            width: 90px;
            vertical-align: text-bottom;
          }
          font-size: 10px;
          color:rgba(153,153,153,1);
          line-height: 1;
        }
        .label {
          .text-overFlow(1);
          margin-top: 5px;

          label {
            .text-overFlow-single();
            display: inline-flex;
            padding: 1px 4px;
            color: @color9;
            font-size: 12px;
            line-height: normal;
            border: 1px solid @borderC;
            border-radius: 1px;

            &.active {
              color: @active;
              border: 1px solid @active;
            }

            +label {
              margin-left: 5px;
            }
          }
        }

        .info {
          display: flex;
          align-items: flex-start;
          margin-top: 7px;
          color: @color9;
          font-size: 12px;
          line-height: normal;

          .left {
            flex: 1;
            display: flex;
            align-items: center;
            margin-right: 15px;

            .info-item {
              flex: initial;
              // .text-overFlow(1);
            }

            em {
              margin-right: 2px;
            }
          }

          .right {
            flex: none;
            color: @color9;
            text-align: right;
          }
        }
      }
      
    }

    .list-item-doctor {
      padding: @p @p 20px @p;
    }
    .doc_con{
      .img {
        width: 24px;
        height: 24px;
        background-color: #f2f2f2;
        border: 1px solid #f3f3f3;
        border-radius: 22px;
        margin-right: 10px;
        margin-top: 12px;
      }
      .img img {
        display: block;
        width: 22px;
        height: 22px;
        border-radius: 22px;
      }
    }
  }

  .swiper {
    padding: @p;
    padding-top: 0;

    .swiper-slide {
      width: 60px;
      height: 60px;
    }

    &.single {
      padding-right: @p;
    }

    .img {
      width: 100%;
      height: 100%;
      overflow: hidden;
      border: 1px solid @borderC-light;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }

</style>
