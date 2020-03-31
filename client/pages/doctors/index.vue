<template>
  <section class="container">
    <m-header
      :title="hackDoctorName"
      :border_on="false"
      :isSuspension="true"
    ></m-header>
    <!-- 筛选 -->
    <div class="doc_select" :class="{'inApp': isHideHeader}">
      <ul>
        <li @click="toggleDepart" :class="{open:depart.departIsShow}">
          <label for="">科室：</label>
          <span class="depart_result">{{depart.departName}}
          </span><em></em>
        </li>
        <li @click="toggleDistrict" :class="{open:district.districtIsShow}">
          <label for="">地区：</label>
          <span class="depart_result">{{resultCity}}</span>
          <em></em>
        </li>
      </ul>
    </div>
    <div class="blank40"></div>
    <!-- 科室列表 -->
    <div class="depart_list" :class="{'inApp': isHideHeader}" v-show="depart.departIsShow">
      <ul v-if="depart.departList.length>0">
        <li v-for="(item,index) in depart.departList" :key="index">
          <span @click="changeData(item.name,index)" :class="{active:item.identify==queryDepId}">
            {{item.name}}</span>
        </li>
      </ul>
    </div>
    <!-- 科室列表 end-->

    <!-- 地区列表 -->
    <div class="district_box" :class="{'inApp': isHideHeader}" v-show="district.districtIsShow">
      <div class="myDistrict">
        <span>
          <em class="icon_distiric"></em>
          {{district.cityItem? district.cityItem.full_name:VX_location.city}}
        </span>
        <a href="javascript:;" @click="refreshLocation" class="refresh">
          {{locationUserIng?"定位中...":"重新定位"}}<em class="icon_refresh"></em>
        </a>
      </div>
      <div class="district_list">
        <div class="province">
          <ul>
            <li @click="changeProvince(index)" v-for="(item ,index) in regionList" :key="index"
                :class="{'active':district.provinceIndex==index}">
              {{item.full_name}}
            </li>
          </ul>
        </div>
        <div class="city">
          <ul>
            <li @click="changeCity(index)" v-for="(city ,index) in district.cityList" :key="index"
                :class="{'active':district.cityIndex==city.identify}">
              {{city.full_name}}
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 地区列表 end-->

    <div class="select_shadow" v-show="depart.departIsShow||district.districtIsShow"
         @click="depart.departIsShow=false,district.districtIsShow=false"></div><!-- 遮罩-->
    <!-- 筛选 end -->

    <div class="box_wrapper">
      <div v-show="isShowDocTip" class="doctor_tip">{{doctorNum}}位{{ hackDoctorName }}为您的健康保驾护航 <span
        @click="closeDocTip" class="cancel-tip"></span></div>
      <!-- 医生列表 -->
      <div class="doctor_list" v-if="doctorList.length > 0">
        <ul>
          <li v-for="(item,index) in doctorList" :key="index">
            <a @click="preventDoctorLink(item, item.customerId)">
              <div class="img"><img v-lazy="GET_IMG_URL(item.headPicUrl,'doc')" alt=""></div>
              <div class="info">
                <dl>
                  <dt><span class="name">{{item.customerName}}</span>&nbsp;&nbsp;{{item.title}}</dt>

                  <dd>{{item.depName}}&nbsp;&nbsp;{{item.hospital}}</dd>
                  <dd class="goodat singleLine"><em class="icon_circle"></em>{{item.expertiseArea}}</dd>
                </dl>
              </div>
            </a>
          </li>
        </ul>
        <m-page :loading="loading" :title="loading? '加载中...':'加载更多'" @loadFn="docList" v-if="!isReachEnd"></m-page>
      </div>
      <!-- 医生列表end -->
      <!-- 模块占位 -->
      <section class="loadingPlaceHolder" v-show="locationUserIng">
        <loadingPlaceHolder v-for="n in 10" :key="n.key"/>
      </section>
      <!-- 模块占位 -->
    </div>
    <empty v-if="!loading && doctorList.length==0"></empty>
    <m-bottom v-if="isReachEnd && doctorList.length>0"></m-bottom>
  </section>
</template>

<script>
  import {
    commonMixin,
    comtyIdValid,
    hackMixin
  } from "~/mixins";
  import header from "~/components/header.vue";
  import bottom from "~/components/bottom.vue";
  import page from "~/components/page.vue";
  import empty from "~/components/empty.vue";
  import doctorService from "~/services/doctorService.js";
  import communityService from "~/services/communityService.js";
  import loadingPlaceHolder from "@/components/loading-place-holder/loading-place-holder";

  export default {
    mixins: [commonMixin, comtyIdValid, hackMixin],
    components: {
      mHeader: header,
      mBottom: bottom,
      mPage: page,
      empty: empty,
      loadingPlaceHolder: loadingPlaceHolder,
    },
    data() {
      return {
        isShowDocTip: true,
        locationUserIng: true,
        regionList: [{
          identify: "",
          full_name: "全国",
          children: [{
            identify: "",
            full_name: "全国",
          }]
        }],
        doctorList: [],
        queryDepId: "",
        doctorNum: 0,
        loading: false,
        currentPage: 0,
        isReachEnd: false,
        pageCount: 2,
        pageSize: 10,
        depart: {
          departList: [],
          departIsShow: false,
          activeIndex: -1,
          departName: "全部",
          depId: "",
        },
        district: {
          districtIsShow: false,
          provinceIndex: 0,
          cityIndex: 0,
          cityItem: {
            identify: "",
            full_name: "全国",
          },
          cityList: [],
        }
      };
    },
    computed: {
      isInApp() {
        let isApp = false;
        if (process.client) {
          isApp = this.$platformInfo.iaskApp.isApp == 1 ? true : false;
        }
        return isApp;
      },
      resultCity() {
        let resultCity = "全国";
        if (this.district.cityItem) {
          resultCity = this.district.cityItem.full_name;
        } else if (this.VX_location && this.VX_location.city) {
          resultCity = this.VX_location.city;
        }
        return resultCity;
      },
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
    async asyncData({route, store, redirect, query}) {
      if (query && query.comtyId) {
        store.commit("SET_COMTYID", query.comtyId);
      }
      let comtyInfoRes = await communityService.getCommunityInstro({});
      let comtyInfo = {};
      if (comtyInfoRes.status == 200 && comtyInfoRes.data && comtyInfoRes.data.status == 1) {
        comtyInfo = comtyInfoRes.data;
        store.commit("SET_ORGID", comtyInfo.bId);
        store.commit("SET_COMTYINFO", comtyInfo);
      } else {
        return redirect("/notFound", {
          statusCode: 504,
          message: "社区内容准备中...",
          showHeader: false
        });
      }
      return {
        comtyInfo: comtyInfo,
      };
    },
    created() {
      this.departList();
      this.getDoctorRegionList();
      // this.enrolledDoctorInfo();
    },
    mounted() {
      // this.refreshLocation();
      // 显示全国
      this.locationUserIng = false;
      this.district.districtIsShow = false;
      this.district.cityItem = this.regionList[0].children[0];
      this.doctorList = [];
      this.currentPage = 0;
      // this.district.cityItem = null;
      this.docList();
    },
    methods: {
      closeDocTip() {
        this.isShowDocTip = false;
      },
      queryLocationDocs() {
        let citys = [];
        this.regionList.map((item) => {
          citys = citys.concat(item.children);
        });
        let targetCity = citys.filter((item) => {
          return item.full_name == this.VX_location.city;
        });
        if (targetCity.length > 0) {
          this.district.cityItem = targetCity[0];
          this.district.cityIndex = this.district.cityItem.identify;
        }
        this.district.provinceIndex = (() => {
          let provinceIdentify = this.district.cityItem ? this.district.cityItem.parent_identify : 0;
          let index = 0;
          this.regionList.map((item, itemIndex) => {
            if (item.identify == provinceIdentify) {
              index = itemIndex;
            }
          });
          return index > 0 ? index : 0;
        })();
        this.district.cityList = this.regionList[this.district.provinceIndex].children;
        this.docList();
      },
      refreshLocation() {
        this.locationUserIng = true;
        this.$store.dispatch("update_city")
          .then((res) => {
            // this.$toast.tip("定位成功");
            this.locationUserIng = false;
            this.district.districtIsShow = false;
            if (res.success) {
              //定位成功
              this.doctorList = [];
              this.currentPage = 0;
              this.queryLocationDocs();
            } else {
              //定位失败 显示全国
              this.district.cityItem = this.regionList[0].children;
              this.doctorList = [];
              this.currentPage = 0;
              this.docList();
            }
          })
          .catch((res) => {
            //定位失败 显示全国
            this.district.cityItem = this.regionList[0].children;
            this.doctorList = [];
            this.currentPage = 0;
            this.district.cityItem = null;
            this.docList();
          });
      },
      enrolledDoctorInfo() {
        //入驻医生列表
        let queryParams = {
          page: 1,
          size: 10,
        };
        communityService.enrolledDoctorInfo(queryParams)
          .then((res) => {
            if (res.status == 200 && res.total) {
              this.doctorNum = res.total;
            }
          });
      },
      getDoctorRegionList() {
        //入驻医生列表
        let queryParams = {
          page: 1,
          size: 10,
        };
        doctorService.getDoctorRegionList(queryParams)
          .then((res) => {
            if (res.status == 200 && res.data) {
              this.regionList = this.regionList.concat(res.data);
            }
          });
      },
      docList() {
        if (this.loading) return;
        console.log("！！！！！！！");

        this.loading = true;
        let _this = this;
        console.log("qing qiu fanhui ", _this.currentPage);
        console.log("qing qiu fanhui ", _this.pageSize);
        console.log(_this.district.cityItem);

        console.log("qing qiu fanhui ", _this.district.cityItem.identify);
        console.log("qing qiu fanhui ", _this.queryDepId);
        let data = {
          page: _this.currentPage + 1,
          size: _this.pageSize,
          // provinceId: _this.district.cityItem.parent_identify,
          cityId: _this.district.cityItem.identify,
          depId: _this.queryDepId,
        };
        communityService.enrolledDoctorInfo(data)
          .then((res) => {

            _this.loading = false;
            if (res.status == 200 && res.data) {
              if(_this.doctorNum==0){
                _this.doctorNum=res.total;
              }
              _this.doctorList = _this.doctorList.concat(res.data);
              _this.currentPage = _this.currentPage + 1;
              _this.pageCount = Math.ceil(res.total / _this.pageSize);
              if (_this.currentPage + 1 > _this.pageCount) {
                _this.isReachEnd = true;
              } else {
                _this.isReachEnd = false;
              }
            } else {
              _this.isReachEnd = true;
            }
          })
          .catch(() => {
            _this.loading = false;
          });
      },
      departList() {
        doctorService.docDepartList({})
          .then(((res) => {
            if (res.status == 200) {
              res.data.reverse();
              res.data.push({
                name: "全部",
                identify: "",
              });
              this.depart.departList = res.data.reverse();
            }
          }));
      },
      changeData(item, i) { //选择分类
        this.depart.activeIndex = i;
        this.depart.departName = item;
        this.depart.departIsShow = false;
        this.queryDepId = this.depart.departList[i].identify;
        this.doctorList = [];
        this.currentPage = 0;
        this.docList();
      },
      toggleDepart() {
        if (this.depart.departList.length == 0) {
          this.$toast.tip("该社区目前没有科室");
          return;
        }
        this.depart.departIsShow = !this.depart.departIsShow;
        this.district.districtIsShow = false;
      },
      toggleDistrict() {
        this.district.districtIsShow = !this.district.districtIsShow;
        this.depart.departIsShow = false;
      },
      changeProvince(index) {
        this.district.provinceIndex = index;
        this.district.provinceId = this.regionList[index].identify;
        this.district.cityList = this.regionList[index].children;
      },
      changeCity(index) {
        this.district.cityIndex = this.regionList[this.district.provinceIndex].children[index].identify;
        this.district.cityItem = this.regionList[this.district.provinceIndex].children[index];
        this.toggleDistrict();
        this.doctorList = [];
        this.currentPage = 0;
        this.docList();
      }
    },
    head() {
      return {
        title: this.hackDoctorName + "团队_" + this.comtyInfo.comtyName,
        meta: [
          {
            name: "keywords",
            content: this.comtyInfo.introduction + "，专家团队，" + this.comtyInfo.comtyName
          },
          {
            hid: "description",
            name: "description",
            content: this.comtyInfo.comtyName + "，专家团队，由大牌专家亲自领衔，专业团队帮您解答问题！专业团队协作，回复更快更全面。"
          }
        ]
      };
    }
  };

</script>
<style lang="less" scoped>
  .select_shadow {
    position: fixed;
    width: 100%;
    height: 100%;
    max-width: 760px;
    margin: 0 auto;
    top: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 995;
  }
  .doc_select {
    height: 40px;
    line-height: 39px;
    border-bottom: 1px solid #EFEFEF;
    background-color: #fff;
    position: fixed;
    z-index: 996;
    top: 44px;
    max-width: 760px;
    margin: 0 auto;
    width: 100%;
    font-size: 14px;
    &.inApp {
      top: 0px;
    }
    ul {
      display: flex;
      li {
        flex: 1;
        box-flex: 1;
        text-align: center;
        label {
          color: #999;
        }
        em {
          display: inline-block;
          width: 10px;
          height: 10px;
          background: url(../../assets/images/btn_down@2x.png) no-repeat center center;
          background-size: 10px 10px;
          margin-left: 5px;
        }
      }
      li.open em {
        transform-origin: center center;
        transform: rotate(180deg);
        -webkit-transform: rotate(180deg);
        -moz-transform: rotate(180deg);
        -ms-transform: rotate(180deg);
        -o-transform: rotate(180deg);
        transition: transform 0.2s;
        -moz-transition: -moz-transform 0.2s;
        -moz-transition: -moz-transform 0.2s;
        -o-transition: -o-transform 0.2s;
        -ms-transition: -ms-transform 0.2s;
      }
    }
  }
  .depart_list {
    position: fixed;
    background-color: #fff;
    top: 84px;
    width: 100%;
    max-width: 760px;
    margin: 0 auto;
    box-sizing: border-box;
    padding: 15px 15px 5px 4px;
    z-index: 996;
    li {
      float: left;
      width: 33.333%;
      margin: 0 0 10px 0;
    }
    li span {
      display: block;
      margin-left: 11px;
      line-height: 37px;
      height: 37px;
      border-radius: 4px;
      border: 1px solid #D6D6D6;
      text-align: center;
      box-sizing: border-box;
    }
    li .active {
      color: #2688FC;
    }
  }
  .doctor_tip {
    position: relative;
    height: 37px;
    line-height: 37px;
    color: #2688FC;
    font-size: 13px;
    text-align: center;
    border-radius: 4px;
    background-color: rgba(237, 245, 255, 1);
    margin-top: 15px;
    margin-bottom: 15px;
    .cancel-tip {
      background: url("./images/btn_icon_cancel_s@2x.png") center no-repeat;
      background-size: contain;
      display: inline-block;
      width: 25px;
      height: 25px;
      line-height: 37px;
      position: absolute;
      right: 10px;
      top: 6px;
    }
  }
  .doctor_list {
    li {
      padding: 15px 0;
      border-bottom: 1px solid #EFEFEF;
    }
    li:last-child {
      border: 0;
    }
    a {
      display: flex;
    }
    .img {
      width: 48px;
      height: 48px;
      background-color: #f2f2f2;
      border-radius: 48px;
      margin-right: 10px;
    }
    .img img {
      display: block;
      width: 48px;
      height: 48px;
      border-radius: 48px;
    }
    .info {
      flex: 1;
      box-flex: 1;
      width: 0;
      line-height: 22px;
      font-size: 12px;
      color: #666;
      dt {
        color: #282828;
      }
      .name {
        font-size: 16px;
        font-weight: 700;
      }
      .goodat {
        font-size: 11px;
        color: #999;
        .icon_circle {
          display: inline-block;
          width: 14px;
          height: 10px;
          background: url(../../assets/images/icon_speciality@2x.png) no-repeat;
          background-size: 14px 10px;
          margin-right: 12px;
        }
      }
    }
  }
  .district_box {
    position: fixed;
    width: 100%;
    top: 84px;
    margin: 0 auto;
    max-width: 760px;
    background-color: #fff;
    z-index: 996;
    .myDistrict {
      height: 40px;
      line-height: 40px;
      padding: 0 15px;
      font-size: 14px;
      color: #282828;
      background-color: #F6F8FB;
      display: flex;
      span {
        flex: 1;
        box-flex: 1;
        overflow: hidden;
      }
      .refresh {
        display: block;
        font-size: 12px;
        color: #999;
      }
    }
    .icon_distiric {
      display: inline-block;
      width: 12px;
      height: 14px;
      background: url(../../assets/images/icon_location@2x.png) no-repeat;
      background-size: cover;
      position: relative;
      vertical-align: middle;
      top: -2px;
      margin-right: 5px;
    }
    .icon_refresh {
      display: inline-block;
      width: 20px;
      height: 20px;
      background: url(../../assets/images/icon_refresh@2x.png) no-repeat;
      background-size: cover;
      position: relative;
      vertical-align: middle;
      top: -2px;
      margin-left: 8px;
    }
    .district_list {
      display: flex;
      max-height: 459px;
      overflow-y: auto;
    }
    .province {
      width: 83px;
      background-color: #EBF0F7;
      li {
        background-color: #EBF0F7;
        font-size: 14px;
        color: #282828;
        line-height: 51px;
        padding-left: 15px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      li.active {
        background-color: #fff;
      }
    }
    .city {
      flex: 1;
      box-flex: 1;
      padding-left: 25px;
      width: 0;
      li {
        line-height: 50px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding-right: 15px;
        font-size: 14px;
        border-bottom: 1px solid #EFEFEF;
      }
      li.active {
        color: #2688FC;
      }
    }
  }
  .depart_list.inApp, .district_box.inApp {
    top: 40px;
  }
</style>
