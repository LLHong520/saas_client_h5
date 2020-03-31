<template>
  <section class="container">
    <m-header
      :title="PAGE_APP_OBJ.label"
      :border_on="false"
      :isSuspension="true"
    ></m-header>  
    <!-- 筛选 -->
    <div class="d-filter" :class="{  inApp: isOtherAgent }">
      <div class="area" @click="toggleFilter">
        <label>地区：</label>
        <span>{{ areaInfo.name }}</span>
        <i class="icon" :class="{ up: isFilter }"></i>
      </div>
      <form  action="javascript:void(0)" @submit="reGetData" class="search">
        <input v-model="params.name" type="search" name="search" placeholder="请输入关键字" @keyup.13="reGetData">
      </form>

      <nuxt-link to="/find/hospital/hospitalMap" class="map"></nuxt-link>
    </div>
    <!-- 地区选择 -->
    <iwen-area :class="{  inApp: isOtherAgent }" :allProviceName="allProviceName" :isShowHk="isShowHk" v-model="isFilter" ref="iwenArea" @callback="onArea"></iwen-area>

    <div class="d-container" :class="{ hidden: isFilter, inApp: isOtherAgent }">
  
     
      <!-- 搜索结果页 -->
      <div class="d-result">
        <li v-for="(item, index) in dataList" :key="index">
          <nuxt-link :to="`/find/hospital/${ item.id }`">
            <div class="img">
              <img v-if="item.infoCover && item.infoCover.length > 0 && item.infoCover[0].url" v-lazy="item.infoCover[0].url">
              <img v-else :src="bg_hospital_img">
            </div>
            <div class="details">
              <h3>{{ item.name }}</h3>
              <p class="address">
                <span>{{ item.cityName }} {{ item.districtName }}</span>
                <span v-if="item.distance" class="distance">{{ item.distance | filtersDistance(item.coordinate.coordinates) }}</span>
              </p>
              <div v-if="item.hospitalExpert" class="speciality"><span v-for=" expert in item.hospitalExpert" :key="expert">{{expert}}</span> </div>
            </div>
          </nuxt-link>
        </li>
      </div>

      <!-- 底部 -->
      <page-loading
        :loading="loading || isRefresh"
        :end="isEnd"
        :empty="dataList.length == 0"
        bottomTxt="没有更多了~"
        @loadFn="getData"
      ></page-loading>
    </div>
  </section>
</template>

<script>
  import { commonMixin, comtyIdValid } from "~/mixins";
  import header from "~/components/header.vue";
  import iwenArea from "~/components/iwen/area.vue";
  import pageLoading from "~/components/pageLoading.vue";
  // import communityService from "~/services/communityService.js";
  import doctorService from "~/services/doctorService.js";
  import bg_hospital_img from "@/assets/images/default/bg_hospital@2x.png";
  //需要过滤掉港澳台地区的社区id列表
  const filterComtyIds = ["5d009fbc3cdea20006e9ba37","5c0489e68a1e0e0008118bf1","5d5cd63dc44e7800089eaa3e","5d63ab7a352df30008352f8b"];

  export default {
    mixins: [commonMixin],
    components: {
      mHeader: header,
      pageLoading,
      iwenArea
    },
    async asyncData({route,store,redirect,query}){
      // 获取社区信息
      let comtyInfo = await comtyIdValid.getComtyInfo({ redirect, store, query });

      // 检查应用是否开放
      let PAGE_APP_OBJ = await commonMixin.methods.SET_PAGE_PERMISSION("11", { route, redirect, store });

      return {
        comtyInfo,
        PAGE_APP_OBJ,
      };
    },
    data() {
      return {
        bg_hospital_img,
        comtyInfo: {},
        areaInfo: {
          name: "全国"
        },
        dataList: [],
        loading: false,
        isFilter: false,
        isRefresh: false,
        total: 1,// 初始化为1
        params: {
          page: 0,
          size: 10,
          name: ""
        }
      };
    },
    computed: {
      isShowHk(){
        let is = true;
        let comtyIds = filterComtyIds;
        // console.log("comtyIds.indexOf(this.VX_comtyId)====");
        if(comtyIds.indexOf(this.VX_comtyId) >= 0){
          is = false;
        }
        return is;
      },
      allProviceName(){
        let name = "全国";
        let comtyIds = filterComtyIds;
        if(comtyIds.indexOf(this.VX_comtyId) >= 0){
          name = "其他地区";
        }
        return name;
      },
      isEnd() {
        return this.params.page >= Math.ceil(this.total / this.params.size);
      },
      isOtherAgent() {
        if (this.$platformInfo) {
          let os = this.$platformInfo.os;
          return os.isWx || os.isWeibo || os.isMp || this.VX_isInApp;
        } else {
          return false;
        }
      },
    },
    watch: {
      "params.name"(val) {
        this.reGetData();
      }
    },
    filters: {
      filtersDistance(val, arr) {
        if (arr && arr.length != 0 && arr[0] === 0 && arr[1] === 0) {
          return "";
        }

        if (val > 1) {
          return val.toFixed(1) + "km";
        } else {
          return Math.floor(val * 1000) + "m";
        }

      },
     
    },
    created() {
      this.getData();
    },
    mounted() {
      if (this.$refs.iwenArea) {
        this.isRefresh = this.$refs.iwenArea.isRefresh;
      }
      this.windowScroll();
    },
    updated() {
      // if (this.isEnd) {
      //   $(window).unbind("scroll");
      // }
    },
    destroyed() {
      $(window).unbind("scroll");
    },
    methods: {
      windowScroll() {
        let vm = this;
        $(window).scroll(function(){
          let scrollTop = $(this).scrollTop();
          let scrollHeight = $(document).height();
          let clientHeight = $(this).height();

          if(scrollTop + clientHeight >= scrollHeight - 50){
            if (!vm.isEnd) {
              vm.getData();
            }
          }
        });
      },
      getData() {
        if (this.loading) { return; }
        this.loading  = true;

        let params = {
          name: this.params.name,
          page: this.params.page + 1,
          size: this.params.size,
          provinceId: this.areaInfo.provinceId || "", // 省
          cityId: this.areaInfo.cityId || "", // 市
          districtId: this.areaInfo.districtId, // 区（暂时不需要）
          // bdId: this.areaInfo.bdId || "", // 商圈
          latitude: this.VX_location ? this.VX_location.lat : "", // 纬度
          longitude: this.VX_location ? this.VX_location.lng : "", // 经度
        };

        doctorService.pageConsultaion(params).then( res => {
          if (res.status == 200 && res.data) {
            this.total = res.total;
            this.params.page = this.params.page + 1;
            this.dataList = [...this.dataList, ...res.data];
          }
        }).finally( () => {
          this.loading  = false;
        });
      },
      toggleFilter () {
        this.isFilter = !this.isFilter;
      },
      onArea(obj) {
        this.areaInfo = obj;
        this.isRefresh = false;
        this.reGetData();
      },
      reGetData() {
        // 重置查询条件
        this.isFilter = false;
        this.dataList = [];
        this.params.page = 0;
        this.params.size = 10;
        this.getData();
      }
    },
    head() {
      return {
        title: this.PAGE_APP_OBJ.label + "_" + this.comtyInfo.comtyName,
        meta: [
          {
            name: "keywords",
            content: this.PAGE_APP_OBJ.label
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

  .text-overFlow(@n: 2) {
    display: -webkit-box;
    /* autoprefixer: ignore next */
    -webkit-box-orient: vertical;
    -webkit-line-clamp: @n;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .d-container {
    /*position: fixed;
    top: 44px;
    left: 0;
    right: 0;
    // bottom: 0;*/
    // overflow-y: auto;
    // overflow-x: hidden;
    &.hidden {
      overflow-y: hidden;
    }
  }

  .flex-center {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .d-select-area{
    z-index: 995;
  }
  .d-filter {
    .flex-center;
    position: fixed;
    top: 44px;
    left: 0;
    right: 0;
    z-index: 996;
    margin: 0 auto;
    max-width: 760px;
    height: @filterH;
    line-height: @filterH;
    background: #fff;
    border-bottom: 1px solid @borderColor;
    box-sizing: border-box;
    .area {
      .flex-center;
      justify-content: normal;
      padding: 0 @p;
      width: 50%;
      color: #999;
      label {
        word-break: keep-all;
      }
      span {
        .text-overFlow(1);
        max-width: 90%;
        color: @color;
        line-height: normal;
      }
      i {
        flex: none;
        margin-left: @m/2;
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
    .search {
      .flex-center;
      margin: 0 @p;
      padding: 0 @p/2 0 30px;
      flex: 1;
      border-radius: 25px;
      border: 1px solid #EFF2F7;
      background: url(../../../assets/images/icon_search@2x.png) no-repeat left #F6F8FB;
      background-size: 15px;
      background-position: 8px;
      overflow: hidden;
      input {
        flex: 1;
        height: 26px;
        line-height: 26px;
        background: transparent;
        font-size: 12px;
        &::-webkit-input-placeholder {
          color: #999;
        }
      }
      input[type="search"]::-webkit-search-cancel-button {
        display: none;
      }
    }
    .map {
      margin-right: 10px;
      width: 30px;
      height: 30px;
      background: url(~assets/images/btn_icon_map@2x.png) no-repeat center center;
      background-size: 100%;
    }
  }

  .d-result {
    margin: 0 auto;
    padding: @filterH @p 0;
    background: #fff;
    box-sizing: border-box;
    max-width: 760px;
   
    li {
      border-bottom: 1px solid @borderColor;
      &:last-child {
        border-bottom: none;
      }
    }
    a {
      .flex-center;
      justify-content: left;
      align-items: unset;
      padding: @p 0;
      .img {
        flex: none;
        width: 120px;
        height: 75px;
        border-radius: @br;
        overflow: hidden;
        background: @borderColor;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .details {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin-left: @m;
        color: @color;
        line-height: normal;
        flex: 1;
        h3 {
          .text-overFlow(1);
          font-size: 16px;
        }
        .speciality {
          margin-top: @m/2;
          overflow: hidden;
          height: 20px;
          color:#666;
          span{
            height:18px;
            margin-bottom: 2px;
            margin-right: 8px;
            display: inline-block;
            font-size:10px;
            padding: 0 4px;
            line-height: 18px;
            border-radius:2px;
            border:1px solid rgba(214,214,214,1);
          }
        }
        p {
          .text-overFlow(1);
          font-size: 12px;
          color: #999;
          &.address {
            display: flex;
            justify-content: space-between;
            flex: auto;
            margin-top: 8px;
            span {
              .text-overFlow(1);
              flex: 1;
            }
            .distance {
              color: #CFCFCF;
              flex: none;
              margin-left: @m;
            }
          }
      
        }
      }
    }
  }

  .d-filter.inApp {
    top: 0;
  }
  .d-select-area.inApp {
    top: 40px;
  }
  
</style>
