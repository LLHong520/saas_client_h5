<template>
  <!-- 地区选择 -->
  <div class="d-select-area" v-show="show" @click="close">
    <div class="min-height" @click.stop>
      <no-ssr>
        <div class="top">
          <span class="location">{{ addressDetails }}</span>
          <span class="refresh" @click="refresh(true)">
          重新定位
            <!--<i class="icon refresh1" :class="{ rotate: isRefresh }"></i>-->
          <i class="icon refresh2"></i>
        </span>
        </div>
      </no-ssr>

      <div class="content">
        <ul class="province" ref="province" @mousemove.prevent>
          <li
            v-for="(item, index) in province"
            :key="item.id"
            :class="{ active: provinceIndex.id == item.id }"
            @click="changeIndex('province', item)"
            class="ios-touchmove"
          >{{ item.name }}</li>
        </ul>

        <ul class="city" ref="city" @mousemove.prevent>
          <li
            v-for="(item, index) in city"
            :key="item.id"
            :class="{ active: cityIndex.id == item.id }"
            @click="changeIndex('city', item)"
            class="ios-touchmove"
          >{{ item.name }}</li>
        </ul>

        <ul class="area" v-if="district.length != 0 " ref="area" @mousemove.prevent>
          <li
            v-for="(item, index) in district"
            :key="item.id"
            :class="{ active: districtIndex.id == item.id }"
            @click="changeIndex('district', item)"
            class="ios-touchmove"
          >{{ item.name }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import doctorService from "~/services/doctorService.js";

  export default {
    props: {
      allProviceName: {
        type: String,
        default: "全国"
      },
      value: {
        type: Boolean,
        default: false
      },
      autoClose: { // 选中后自动关闭
        type: Boolean,
        default: true
      },
      feedback: { // 选中反馈
        type: Boolean,
        default: false
      },
      isCity: { // 是否只选择到市
        type: Boolean,
        default: false
      },
      isShowHk: {
        // 是否显示港澳台
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        province: [],
        city: [],
        district: [],
        provinceIndex: {},
        cityIndex: {},
        districtIndex: {},
        location: {}, // 定位
        isRefresh: false
      };
    },
    computed: {
      show() {
        return this.value;
      },
      addressDetails() {
        let province = this.provinceIndex;
        let city = this.cityIndex;
        let district = this.districtIndex;

        if (!this.checkEquality("provinceIndex", "cityIndex")) {
          return province.name;
        } else if (!this.checkEquality("cityIndex", "districtIndex")) {
          return province.name + " " + city.name;
        } else {
          return province.name + " " + city.name + " " + district.name;
        }
      }
    },
    watch: {
      provinceIndex(item) {
        console.log(item,"provinceIndex");
        this.city = this.district = [];
        this.cityIndex = this.districtIndex = {};

        if (!item.search) {
          this.getArea("city", item);
        } else {
          this.callback();
        }

        if (this.feedback) {
          this.callback(true);
        }
      },
      cityIndex(item) {
        if (item.id) {
          this.district = [];
          this.districtIndex = {};
          if (!item.search && !this.isCity) {
            this.getArea("district", item);
          } else {
            this.callback();
          }
        }

        if (this.feedback) {
          this.callback(true);
        }
      },
      districtIndex(item) {
        if (item.id) {
          this.callback();
        }
      }
    },
    beforeMount() {
      // this.getArea("province");
      this.refresh();
    },
    methods: {
      filterProvince(province){
        if(this.isShowHk) return province;
        let arr = [];
        let filterArr = ["710000","810000","820000"];
        province.map((item)=>{
          if(filterArr.indexOf(item.id) < 0){
            arr.push(item);
          }
        });
        return arr;
      },
      callback(isFeedback) {
        let location = {
          name: this.addressDetails || this.allProviceName,
          province: this.provinceIndex.name || "",
          provinceId: this.provinceIndex.id || "",
          city: this.cityIndex.name || "",
          cityId: this.cityIndex.id || "",
          districtName: this.districtIndex.name || "",
          districtId: this.districtIndex.id || "",
        };

        // 判断是否重复
        if (location.provinceId == location.cityId) {
          location.cityId = "";
        }
        if (location.cityId == location.districtId) {
          location.districtId = "";
        }

        // 回调
        if (isFeedback) {
          this.$emit("feedback", location);
        } else {
          this.location = {};
          this.$emit("callback", location);
        }

        if (this.autoClose) {
          this.close();
        }
      },
      close() {
        this.$emit("input", false);
        this.$emit("close");
      },
      changeIndex(type, item) {
        this[type + "Index"] = item;
      },
      async getArea(type, obj = {}) {
        let allArea = {};
        const level = {
          province: 30001, // 省
          city: 40001, // 城市
          district: 50001,// 行政区
          bdId: 60001, // 商圈
        };

        if (obj.id) {
          allArea = {
            name: "全" + obj.name,
            id: obj.id,
            search: true
          };
        } else {
          allArea = {
            name: this.allProviceName,
            id: "",
            search: true
          };
        }

        await doctorService.getPlaceList({
          level: level[type],
          parentIdentify: obj.id || ""
        }).then( res => {
          if (res.status == 200 && res.data) {
            this[type] = this.objToArray(res.data);
            this[type] = this.filterProvince(this.objToArray(res.data));
            this[type].unshift(allArea);

            // 默认第一个全国
            if (type == "province") {
              this[type + "Index"] = this[type][0];
            }

            this.currentArea(type);
          } else {
            this[type].unshift(allArea);
          }
        }).catch( () => {
          this[type].unshift(allArea);
        });
      },
      currentArea(type) {
        if (this.location.city && type == "district") {
          this.changeIndex("district", { ...this.cityIndex, search: true });
          return;
        }

        // 如果有定位城市
        if (this.location[type]) {
          // 匹配全字段
          let city = this[type].filter( item => { return item.name == this.location[type]; });

          // 匹配两位字符
          if (city.length == 0) {
            city = this[type].filter( item => {
              let location = this.location[type].slice(0, 2);
              return item.name.indexOf(location) > -1;
            });
          }

          if (city.length > 0) {
            this[type + "Index"] = city[0];
            this.scrollToActive(this.$refs[type]);

            if (type == "city") {
              this.changeIndex("district", city[0]);
            }
          }
        }
      },
      objToArray(obj) {
        return Object.keys(obj)
          .map( (item) => {
            return {
              name: obj[item],
              id: item
            };
          })
          .sort((a, b) => a - b);
      },
      checkEquality(a, b) {
        let aValue = this[a].id;
        let bValue = this[b].id;
        return aValue && bValue && aValue != bValue;
      },
      async refresh(isClick) {
        /*let userLocation = this.$storage.get("userLocation");

        if (!isClick && userLocation ) {
          this.location = JSON.parse(userLocation);
          this.getArea("province");
          return;
        }*/

        this.isRefresh = true;
        let res = await this.$store.dispatch("update_city");
        this.isRefresh = false;

        if (res.success && res.address && res.address.province){
          this.$toast.tip("定位成功","",1500);
          this.location = {...res.address, ...res.point};
          this.getArea("province");
          this.$storage.set("userLocation", JSON.stringify(this.location));
        } else {
          this.$toast.tip("定位失败");
          this.getArea("province");
          this.callback();
        }
      },
      scrollToActive(target) {
        if (process.server) {
          return;
        }

        this.$nextTick( () => {
          let targetHieght = target.clientHeight; // 容器可视高度
          let scrollTop = target.scrollTop; // 容器滑动高度
          let offsetTop = target.querySelector(".active").offsetTop; // 当前活动高度

          if (scrollTop > offsetTop) {
            target.scrollTop = offsetTop / 2;
            return;
          }

          if (offsetTop > targetHieght) {
            target.scrollTop = offsetTop - targetHieght / 2;
          }
        });
      }
    }
  };
</script>

<style lang="less" scoped>
  @m: 13px;
  @p: 13px;
  @br: 4px;
  @color: #2d2d2d;
  @borderColor: #efefef;
  @filterH: 40px;

  @keyframes rotate {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }

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

  .d-select-area {
    position: fixed;
    top: calc( @filterH + 44px);
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 995;
    margin: 0 auto;
    max-width: 760px;
    background: rgba(0, 0, 0, .4);
    font-size: 13px;
    .min-height {
      height: 70%;

    }
    .top {
      .flex-center;
      padding: 0 @p;
      height: @filterH;
      background: #F6F8FB;
      span {
        .text-overFlow(1);
        height: 100%;
        line-height: 40px;
        font-size: 14px;
        &.location {
          padding: 0 18px;
          background: url(../../assets/images/icon_location@2x.png) no-repeat;
          background-position: 0 50%;
          background-size: 12px 14px;
          flex: 1;
        }
        &.refresh {
          display: flex;
          align-items: center;
          color: #999;
          font-size: 12px;
          .icon {
            margin-left: 5px;
            width: 20px;
            height: 20px;
            &.refresh1 {
              background: url(../../assets/images/icon_refresh@2x.png) no-repeat right;
              background-size: 100%;
            }
            &.refresh2 {
              background: url(../../assets/images/common_refresh@2x.png) no-repeat right;
              background-size: 100%;
            }
            &.rotate {
              animation: rotate 1s infinite linear;
            }
          }
        }
      }
    }
    .content {
      .flex-center;
      justify-content: normal;
      align-items: normal;
      height: 100%;
      background: #fff;
      overflow: hidden;
      -webkit-overflow-scrolling: touch;
      ul {
        position: static;
        z-index: 1;
        min-height: 101%;
        overflow: auto;
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch;
        &.touchmove-scroll {
          -webkit-overflow-scrolling: touch;
        }
        &.touchmove-auto {
          -webkit-overflow-scrolling: auto;
        }
        &::after {
          content: "";
          min-height: calc(100% + 1px);
        }
      }
      .province {
        width: 25%;
        background: #EBF0F7;
      }
      .city {
        flex: 1;
      }
      .area {
        flex: 2;
        border-left: 1px solid #EFEFEF;
      }
      .city, .area {
        padding-left: @p;
        li {
          padding-left: 0;
          & + li {

            border-top: 1px solid #EFEFEF;
          }
        }
      }
      li {
        .text-overFlow(1);
        padding: 0 @p;
        height: 40px;
        line-height: 40px;
        &.active {
          color: #2688FC;
          background: #fff;
        }
      }
    }
  }
</style>
