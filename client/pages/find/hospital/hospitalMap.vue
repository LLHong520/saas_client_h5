<template>
  <section class="container d-allmap"><!--  :class="{ isHidden: isShowEle }" -->
    <!-- 搜索框 -->
    <transition name="bounce-up">
      <form v-show="!isShowEle" action="javascript:void(0)" class="search-box">
        <a href="javascript:;" class="nav-back" @click="$router.go(-1)"></a>
        <div class="input">
          <input v-model.trim="params.name" type="search" id="search" @focus="onFocus" placeholder="请输入医院名称" name="search">
          <span v-if="params.name" class="clear" @click="params.name = ''"></span>
        </div>
      </form>
    </transition>

    <!-- 地图 -->
    <div id="allmap" class="map"></div>

    <!-- 轮播图 -->
    <transition name="bounce">
      <div v-show="!isShowEle" class="d-result is-fixed">
        <div
          v-if="swiperList.length > 0"
          v-swiper:mySwiper="swiperOption"
          @slideChangeTransitionEnd="slideChange"
          @touchStart="touchStart"
        >
          <div class="swiper-wrapper">
            <nuxt-link
              class="swiper-slide"
              v-for="(item, index) in swiperList"
              :to="`/find/hospital/${ item.sourceData.id }`"
              :key="item.sourceData.id"
            >
              <div class="img">
                <img v-if="item.sourceData.infoCover && item.sourceData.infoCover.length > 0" :src="item.sourceData.infoCover[0].url">
                <img v-else :src="bg_hospital_img">
              </div>
              <div class="details">
                <h3>{{ item.sourceData.name }}</h3>
                <p class="address">
                  <span>{{ item.sourceData.cityName }} {{ item.sourceData.districtName }}</span>
                  <span v-if="item.sourceData.distance" class="distance">{{ item.sourceData.distance | filtersDistance(item.sourceData.coordinate.coordinates) }}</span>
                </p>
                <p v-if="item.sourceData.hospitalExpert" class="speciality">{{ item.sourceData.hospitalExpert | filtersGoodAt }}</p>
              </div>
            </nuxt-link>
          </div>
        </div>
      </div>
    </transition>

    <!-- 关键字高亮 -->
    <transition name="bg">
      <div class="d-highlight" v-if="showHighlight" @click="showHighlight = false">
        <ul @click.stop>
          <!--<li @click="hlSearch(params.name)"><span>搜索：</span><b>{{ params.name }}</b></li>-->
          <li v-show="highlightList.length == 0 && !loading" class="null">暂无内容</li>
          <li v-for="(item, index) in highlightList" :key="index" v-html="item.highlight" @click="toMarkerPos(item)"></li>
        </ul>
      </div>
    </transition>


  </section>
</template>

<script>
  import { commonMixin, comtyIdValid } from "~/mixins";
  import doctorService from "~/services/doctorService.js";
  import bg_hospital_img from "@/assets/images/default/bg_hospital@2x.png";
  import img_hos_emp from "@/assets/images/default/img_hos_emp@2x.png";
  import map_hospital_nomal from "@/assets/images/map_hospital_nomal.png";
  import map_hospital_selected from "@/assets/images/map_hospital_selected.png";
  import map_location_me from "@/assets/images/map_location_me@2x.png";

  if (process.client) {
    require("./js/MarkerClusterer_min.js");
  }


  export default {
    mixins: [commonMixin],
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
        isMarkerClick: false,
        showHighlight: false,
        highlightList: [],
        bg_hospital_img,
        img_hos_emp,
        map_hospital_nomal,
        map_hospital_selected,
        map_location_me,
        isShowEle: false,
        keywords: "",
        dataInfo: {},
        targetMarker: null,
        map: null,
        markerClusterer: null,
        swiperList: [],
        markers: [],
        dataList: [],
        loading: false,
        total: 1,// 初始化为1
        params: {
          page: 0,
          size: 5000,
          name: ""
        },
        swiperLimit: 30, // 轮播图数量
        swiperOption: {
          // loop: true,
          spaceBetween: 5,
          centeredSlides: true,
        },
        iconMin: [30, 30],
        iconMax: [72, 72],
        shadowmin: [56, 62],
        shadowMax: [100, 106],
      };
    },
    computed: {
      /*swiperList() {
        if (this.markers.length > 30) {
          return this.markers.slice(0, 30);
        }

        return this.markers;
      }*/
    },
    watch: {
      "params.name"(val) {
        if (val) {
          this.showHighlight = true;
          this.getHighlight();
        } else {
          this.showHighlight = false;
        }
      }
    },
    filters: {
      filtersDistance(val, arr) {
        if (arr && arr.length != 0 && arr[0] === 0 && arr[1] === 0) {
          return "";
        }

        if (!val) {
          return "";
        }

        if (val > 1) {
          return val.toFixed(1) + "km";
        } else {
          return Math.floor(val * 1000) + "m";
        }

      },
      filtersGoodAt(val) {
        if (val.length > 0) {
          return val.join(" ");
        }
      }
    },
    async created() {
      if (process.client) {
        await this.$store.dispatch("update_city");
        this.init();

        let localData = this.$storage.session.get("hospitalMap");
        if (localData) {
          this.dataList = JSON.parse(localData);
          this.$nextTick( () => {
            this.initMarker();
          });

        } else {
          this.getData();
        }
      }
    },
    async beforeMount() {

    },
    methods: {
      async init() {
        if (process.client && !!BMap) {
          const vm = this;

          let coordinate = null;
          let lng = this.VX_location ? this.VX_location.lng : 116.404;// 经度
          let lat = this.VX_location ? this.VX_location.lat : 39.915;// 纬度

          if (this.dataList.length > 0) {
            coordinate = this.dataList[0].coordinate;
            [ lng, lat ] = coordinate.coordinates;
          }

          this.map = new BMap.Map("allmap");// 创建地图实例
          let point = new BMap.Point(lng, lat);// 坐标点
          // let ctrl_nav = new BMap.NavigationControl({ anchor: BMAP_ANCHOR_BOTTOM_RIGHT, type: BMAP_NAVIGATION_CONTROL_LARGE, });// 缩放控件
          // let geolocationControl = new BMap.GeolocationControl();// 定位

          // 创建地图中心点、级别
          this.map.centerAndZoom(point, 15);

          // 地图拖拽事件
          this.map.enableDragging();

          // 地图滚轮放大缩小
          this.map.enableScrollWheelZoom();

          // 添加缩放控件
          // this.map.addControl(ctrl_nav);

          // 地图点击事件
          this.map.addEventListener("click", vm.toggleEle);
          // 添加定位
          // this.map.addControl(geolocationControl);
          this.mineMarker();
        }
      },
      initMarker() {
        // 添加标注
        this.markers = this.dataList.map( (item, index) => {
          return this.addMarker(item, index);
        });

        // 轮播图
        if (this.markers.length > this.swiperLimit) {
          this.swiperList = this.markers.slice(0, this.swiperLimit);
        } else {
          this.swiperList = this.markers;
        }

        // 点聚合
        this.markerClusterer = new BMapLib.MarkerClusterer(this.map, { markers: this.markers });

        // 默认显示第一个
        if (this.swiperList.length > 0) {
          this.markerActive(this.swiperList[0], true);
          this.targetMarker = this.swiperList[0];
          this.setZoom(this.swiperList[0].sourceData);
        }
      },
      setZoom(target) {
        // 设置用户位置与第一个点的缩放级别
        if (this.VX_location) {
          let result = 15;
          let zoom = ["50","100","200","500","1000","2000","5000","10000","20000","25000","50000","100000","200000","500000","1000000","2000000"];// 级别18到3

          // 用户位置
          let { lng, lat } =  this.VX_location;
          let pointA = new BMap.Point(lng, lat);

          // 目标marker位置
          let pos = target.coordinate.coordinates;
          let pointB = new BMap.Point(pos[0], pos[1]);

          // 距离
          let centerLng = (lng + pos[0]) / 2;
          let centerLat = (lat + pos[1]) / 2;
          let centerPoint = new BMap.Point(centerLng, centerLat);
          let distance = this.map.getDistance(pointA,pointB).toFixed(1);

          for (var i = 0,zoomLen = zoom.length; i < zoomLen; i++) {
            if(zoom[i] - distance > 0){
              result = 18 - i + 2;
              break;
            }
          };

          this.map.centerAndZoom(centerPoint, result);
        }
      },
      mineMarker() {
        // 创建用户当前位置marker
        if (this.VX_location) {
          let { lng, lat} =  this.VX_location;
          let point = new BMap.Point(lng, lat);
          let icon = new BMap.Icon(this.map_location_me, new BMap.Size(28, 28));
          let marker = new BMap.Marker(point, { icon: icon });
          this.map.addOverlay(marker);
        }
      },
      addMarker(item, index) {
        if (!item || !item.coordinate || !item.coordinate.coordinates) {
          return;
        }

        // 标注
        const vm = this;
        let [ lng, lat ] = item.coordinate.coordinates;
        let img = (item.infoCover && item.infoCover.length > 0)
          ? item.infoCover[0].url
          : this.img_hos_emp;
        // console.log("是否收到f",img);
        // 创建标注
        let point = new BMap.Point(lng, lat);
        let icon = new BMap.Icon(this.img_hos_emp, new BMap.Size(...vm.iconMin));
        let shadow = new BMap.Icon(this.map_hospital_nomal, new BMap.Size(...vm.shadowmin), { imageOffset: new BMap.Size(0, 7) });
        let marker = new BMap.Marker(point, { icon: icon, shadow: shadow });
        marker.setShadow(shadow);

        // 添加标注
        marker.sourceData = item;
        marker.sourceIndex = index;
        marker.sourceImg = img;
        marker.sourceShadow = this.map_hospital_nomal;
        // this.map.addOverlay(marker);

        // 标注点击事件
        marker.addEventListener("click", function(e){
          e.domEvent.preventDefault();

          // 放大当前marker，缩小上一个marker
          vm.markerActive(this);
          vm.targetMarker = this;

          // 滑动到当前marker
          vm.isMarkerClick = true;
          vm.isShowEle = true;
          vm.map.panTo(point);

          vm.toMarkerPos(this.sourceData);

          // let slideIndex = this.sourceSlideIndex || index;
          // vm.mySwiper.slideTo(slideIndex);
        });

        return marker;
      },
      markerActive(marker, zoom) {
        if (!marker) {
          return;
        }

        const vm = this;
        // 还原上一个marker
        if (vm.targetMarker) {
          let pre_marker = vm.targetMarker;
          let pre_icon = new BMap.Icon(this.img_hos_emp, new BMap.Size(...vm.iconMin));
          let pre_shadow = new BMap.Icon(pre_marker.sourceShadow, new BMap.Size(...vm.shadowmin), { imageOffset: new BMap.Size(0, 7) });
          pre_marker.setIcon(pre_icon);
          pre_marker.setShadow(pre_shadow);
          pre_marker.setZIndex(999);
        }

        // 放大当前marker
        let icon = new BMap.Icon(marker.sourceImg, new BMap.Size(...vm.iconMax));
        let shadow = new BMap.Icon(vm.map_hospital_selected, new BMap.Size(...vm.shadowMax), { imageOffset: new BMap.Size(0, 7) });
        marker.setIcon(icon);
        marker.setShadow(shadow);
        marker.setZIndex(1000);

        // 首次加载时，放太大会看不见“我的”和当前marker
        if (!zoom) {
          this.map.setZoom(18);
        }

      },
      getData() {
        if (this.loading) { return; }
        this.loading  = true;

        let params = {
          name: this.params.name,
          page: this.params.page + 1,
          size: this.params.size,
          latitude: this.VX_location ? this.VX_location.lat : "", // 纬度
          longitude: this.VX_location ? this.VX_location.lng : "", // 经度
          searchType: "map",
        };

        doctorService.pageConsultaionMap(params).then( res => {
          if (res.status == 200 && res.data) {
            this.total = res.total;
            this.params.page = this.params.page + 1;
            this.dataList = [...this.dataList, ...res.data];
            this.$storage.session.set("hospitalMap", JSON.stringify(this.dataList));

            this.initMarker();
          }
        }).finally( () => {
          this.loading  = false;
        });
      },
      onFocus() {
        if (this.params.name) {
          this.showHighlight = true;
        }
      },
      toggleEle(e) {
        // 点击地图显示隐藏元素
        this.isShowEle = !this.isShowEle;
      },
      touchStart() {
        this.isMarkerClick = false;
      },
      slideChange() {
        if (this.isMarkerClick) {
          return;
        }

        const len = this.swiperList.length;
        let activeIndex = this.mySwiper.activeIndex;
        let previousIndex = this.mySwiper.previousIndex;
        let index = 0;
        // previousIndex -= 1;

        if (previousIndex >= len) {
          index = 0;
        } else if (previousIndex < 0) {
          index = len - 1;
        } else {
          index = previousIndex;
        }

        // 从搜索结果点击时
        if (activeIndex >= len) {
          activeIndex = len - 1;
        }

        this.targetMarker = this.swiperList[index];
        this.markerActive(this.swiperList[activeIndex]);
        this.map.panTo(this.swiperList[activeIndex].point);
        this.targetMarker = this.swiperList[activeIndex];
      },
      toMarkerPos(item) {
        this.isMarkerClick = true;

        let len = this.markers.length;
        let target = this.markers.filter( a => { return a.sourceData.id == item.id; });
        let slideItem = this.swiperList.filter( a => { return a.sourceData.id == item.id; });

        // 如果markers有，直接跳转，没有则创建
        if (target && target.length > 0) {
          this.markerActive(target[0]);
          this.map.panTo(target[0].point);
        } else {
          let newMarker = this.addMarker(item, len);
          this.markers.push(newMarker);
          this.swiperList.push(newMarker);

          this.$nextTick( () => {
            this.markerActive(newMarker);
            this.map.panTo(newMarker.point);
            this.mySwiper.update();
            this.mySwiper.slideTo(this.swiperList.length + 1);
          });
        }

        // 如果轮播图有，直接跳转，没有则创建
        target = this.markers.filter( a => { return a.sourceData.id == item.id; });
        slideItem = this.swiperList.filter( a => { return a.sourceData.id == item.id; });

        if (slideItem && slideItem.length > 0) {
          let index = slideItem[0].sourceSlideIndex || slideItem[0].sourceIndex;
          this.mySwiper.slideTo(index);
        } else if (target && target.length > 0) {
          let newSlide = target[0];
          newSlide.sourceSlideIndex = this.swiperList.length;
          this.swiperList.push(newSlide);

          this.$nextTick( () => {
            this.mySwiper.update();
            this.mySwiper.slideTo(newSlide.sourceSlideIndex + 1);
          });
        }

        this.showHighlight = false;
      },
      getHighlight() {
        // 模糊查询匹配
        if (this.loading) return;
        this.loading = true;

        let params = {
          name: this.params.name,
          page: 1,
          size: 10,
          latitude: this.VX_location ? this.VX_location.lat : "", // 纬度
          longitude: this.VX_location ? this.VX_location.lng : "", // 经度
          searchType: "map",
        };

        doctorService.pageConsultaionMap(params)
          .then((res)=>{
            if(res.status == 200 && res.data){
              this.highlightList = this.regStr([...res.data]);
            }
          }).finally(()=>{
            this.loading = false;
          });
      },
      regStr(arr) {
        let str = this.params.name.trim();
        let attr = "name";

        return arr.map( item => {
          item.highlight = Object.values(item[attr]).map( item => {
            if (Object.values(str).indexOf(item) > -1) {
              item = `<b>${ item }</b>`;
            }
            return item;
          }).join("");

          return item;
        });
      },
    },
    head() {
      return {
        title :this.comtyInfo.comtyName,
        script: [
          /*{
            src: "http://api.map.baidu.com/library/TextIconOverlay/1.2/src/TextIconOverlay_min.js"
          },
          {
            src: "http://api.map.baidu.com/library/MarkerClusterer/1.2/src/MarkerClusterer_min.js"
          },*/
        ]
      };
    }
  };

</script>

<style lang="less" scoped>
  @import "~assets/css/config.less";
  @import "~assets/css/animation.less";

  /deep/ .BMap_Marker {
    > div {
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
      }
    }
  }

  .d-highlight {
    position: fixed;
    top: 44px;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 100;
    margin: 0 auto;
    max-width: 760px;
    background: rgba(0, 0, 0,.4);
    font-size: 12px;
    ul {
      padding: 0 15px;
      background: #fff;
      li {
        .text-overFlow(1);
        height: 40px;
        line-height: 40px;
        & + li {
          border-top: 1px solid #EFF2F7;
        }
        &.null {
          height: 100px;
          line-height: 100px;
          text-align: center;
          color: #999;
        }
        span {
          font-weight: bold;
        }
        /deep/ b {
          color: #EB1C1D;
          font-weight: normal;
        }
      }
    }
  }

  .nav-back {
    margin-left: -@m;
    padding-left: 0;
    width: 40px;
    height: 40px;
    background: url(~assets/images/nav_back@2x.png) no-repeat center center;
    background-size: 40px 40px;
  }

  .class-search-input{
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
    height: 28px;
    color: @color9;
    font-size: 12px;
    background: @moduleBg;
    border: 1px solid @borderC;
    border-radius: 25px;
    i {
      margin-right: 5px;
      width: 16px;
      height: 16px;
      background: url(~assets/images/icon_search@2x.png) no-repeat;
      background-size: 100%;
    }
  }

  .d-result {
    margin: 0 auto;
    background: #fff;
    box-sizing: border-box;
    max-width: 760px;
    &.is-fixed {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 99;
      background: none;
      overflow: hidden;
    }
    /deep/ .swiper-container {
      padding: 0 20px;
    }
    li {
      border-bottom: 1px solid @borderC-light;
      &:last-child {
        border-bottom: none;
      }
    }
    a {
      .flex-center;
      justify-content: left;
      align-items: unset;
      margin: 15px 0;
      padding: 10px;
      width: calc(100% - 40px);
      background: #fff;
      border-radius: @br;
      box-shadow:0px 4px 9px 1px rgba(0,0,0,0.2);
      transition: all .3s;
      .img {
        flex: none;
        width: 120px;
        height: 75px;
        border-radius: @br;
        overflow: hidden;
        background: @borderC-light;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .details {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin-left: 10px;
        color: @color3;
        line-height: normal;
        flex: 1;
        h3 {
          .text-overFlow(1);
          font-size: 16px;
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
          &.speciality {
            margin-top: @m/2;
            padding-left: 20px;
            background: url(~assets/images/icon_speciality@2x.png) no-repeat left;
            background-size: 14px;
            background-position: 0 50%;
          }
        }
      }
    }
    .swiper-slide-prev, .swiper-slide-next {
      margin-top: 20px;
      transform: rotateX(30deg);
    }
  }

  .search-box {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 100;
    margin: 0 auto;
    max-width: 760px;
    height: 44px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 @p;
    border-bottom: 1px solid #EFF2F7;
    background: #fff;
    .input {
      .class-search-input;
      position: relative;
      padding: 0 35px;
      background: url(~assets/images/icon_search@2x.png) no-repeat  @moduleBg;
      background-position: 10px 50%;
      background-size: 16px;
    }
    input {
      flex: 1;
      height: 100%;
      color: @color3;
      background-color: inherit;
      &::-webkit-input-placeholder {
        color: @color9;
      }
    }
    input[type="search"]::-webkit-search-cancel-button {
      display: none;
    }
    .clear {
      position: absolute;
      top: 50%;
      right: 5px;
      transform: translateY(-50%);
      width: 30px;
      height: 100%;
      background: url(~assets/images/btn_s_close_normal@2x.png) no-repeat center;
      background-size: 14px;
    }
    a {
      padding-left: @p;
      height: @searchH;
      line-height: @searchH;
      color: @color3;
      font-size: 15px;
    }
  }

  .d-allmap {
    position: fixed!important;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    margin: 0 auto;
    max-width: 760px;
    height: 100%;
    overflow: hidden;
    z-index: 2;
    .back {
      position: absolute;
      top: 15px;
      left: 15px;
      width: 42px;
      height: 42px;
      border-radius: 50%;
      background: url(~assets/images/box_icon_enter@2x.png) no-repeat center rgba(40,40,40,.8);
      background-size: 45%;
      transform: rotateY(180deg);
      box-shadow: 0px 5px 12px 0px rgba(0,0,0,0.3);
      z-index: 99;
    }
    .map {
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      height: 100%;
      /deep/ .map-msg-window {
        max-width: 300px;
        color: #282828;
        font-size: 12px;
        h3 {
          font-size: 14px;
          font-weight: bold;
        }
        p {
          display: flex;
          label {
            flex: none;
          }
          a {
            color: #2688FC;
          }
        }
      }
      /deep/ .anchorBL {
        a {
          display: none;
        }
      }
    }
    /deep/ .BMap_cpyCtrl {
      display: none;
    }
  }

  .isHidden {
    .search-box, .d-result, d-highlight {
      z-index: -1;
    }
  }
</style>
