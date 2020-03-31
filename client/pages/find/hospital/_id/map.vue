<template>
  <section class="container d-allmap">
    <div class="back" @click="$router.back()"></div>
    <div id="allmap" class="map"></div>
  </section>
</template>

<script>
  import { commonMixin, comtyIdValid } from "~/mixins";
  import doctorService from "~/services/doctorService.js";

  export default {
    mixins: [commonMixin],
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
        slideList = res.data.infoCover || [];
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
        dataInfo: {},
        map: null
      };
    },
    created() {
      this.$nextTick( () => {
        this.init();
      });
    },
    methods: {
      init() {
        if (process.client && !!BMap) {
          let lng = 116.404 && this.dataInfo.coordinate.coordinates[0];// 经度
          let lat = 39.915 && this.dataInfo.coordinate.coordinates[1];// 纬度

          this.map = new BMap.Map("allmap");// 创建地图实例
          let point = new BMap.Point(lng, lat);// 坐标点
          let ctrl_nav = new BMap.NavigationControl({ anchor: BMAP_ANCHOR_BOTTOM_RIGHT, type: BMAP_NAVIGATION_CONTROL_LARGE, });// 缩放控件
          let geolocationControl = new BMap.GeolocationControl();// 定位

          // 创建地图中心点、级别
          this.map.centerAndZoom(point, 15);
          // 地图拖拽事件
          this.map.enableDragging();
          // 地图滚轮放大缩小
          this.map.enableScrollWheelZoom();
          // 添加缩放控件
          this.map.addControl(ctrl_nav);
          // 添加定位
          this.map.addControl(geolocationControl);
          // 添加标注
          this.createdInfoWindow(lng, lat);
        }
      },
      createdInfoWindow(lng, lat) {
        // 标注 & 显示信息窗口
        let marker = new BMap.Marker(new BMap.Point(lng, lat));
        let link = "";

        if (this.$platformInfo.isiOS) {
          link = `<a href="iosamap://path?sourceApplication=applicationName&sid=BGVIS1&dname=${ this.dataInfo.address }&dev=0&t=0">${ this.dataInfo.address }</a>`;
        } else {
          link = `<a href="amapuri://route/plan/?sid=BGVIS1&dname=${ this.dataInfo.address }&dev=0&t=0">${ this.dataInfo.address }</a>`;
        }

        // 信息窗口内容
        let htmlContent = `
        <div class="map-msg-window">
          <h3>${ this.dataInfo.name }</h3>
          <p><label>地址：</label>${ link }</p>
        </div>
        `;

        // 信息窗口
        let infoWindow = new BMap.InfoWindow(htmlContent);

        // 添加标注
        this.map.addOverlay(marker);

        // 打开信息窗口
        marker.openInfoWindow(infoWindow);

        // 标注点击事件
        marker.addEventListener("click", function(){
          this.openInfoWindow(infoWindow);
        });
      }
    },
  };

</script>

<style lang="less" scoped>
  @import "~/assets/css/list.css";

  .d-allmap {
    position: fixed!important;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
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
      /deep/ .BMap_Marker {
        & > div {
          width: 39px!important;
        }
      }
      /deep/ .anchorBL {
        a {
          display: none;
        }
      }
    }
  }
</style>
