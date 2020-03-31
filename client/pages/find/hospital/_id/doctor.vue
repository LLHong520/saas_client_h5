<template>
  <section class="container">
    <m-header
      title="医生列表"
      :border_on="false"
      :isSuspension="true"
    ></m-header>

    <div class="d-container" :class="{ inApp: isOtherAgent }">
      <div v-swiper:mySwiperLabel="swiperOptionFree" class="d-swipe-label">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="(item, index) in labelList" :key="item.id">
            <label :class="{ active: departmentId == item.id }" @click="changeLabel(item.id)">{{ item.name }}</label>
          </div>
        </div>
      </div>

      <!-- 搜索结果页 -->
      <div class="d-result">
        <li v-for="(item, index) in doctorList" :key="item.id">
          <a href="javascript:;" @click="routerTo(item)">
            <div class="img">
              <img v-lazy="GET_IMG_URL(item.image, 'doc')" alt="">
            </div>
            <div class="details">
              <h3>
                <span>{{ item.name }} </span>
                <i v-if="item.type == 0" class="icon"></i>
              </h3>
              <p class="address">
                <span>{{ item.title }} {{ item.departmentName }}</span>
                <!--<span class="distance">0.5km</span>-->
              </p>
              <!--<p class="speciality">{{ item.field | filtersRichText }}</p>-->
              <p class="speciality" v-html="filtersRichText(item.field)"></p>
            </div>
          </a>
        </li>
      </div>

      <!-- 底部 -->
      <page-loading
        :loading="loading"
        :end="isEnd"
        :empty="doctorList.length == 0"
        :isFullScreen="false"
        bottomTxt="没有更多了~"
        @loadFn="getDoctor"
      ></page-loading>
    </div>
  </section>
</template>

<script>
  import { commonMixin, comtyIdValid } from "~/mixins";
  import header from "~/components/header.vue";
  import pageLoading from "~/components/pageLoading.vue";
  import doctorService from "~/services/doctorService.js";
  import utils from "@/utils/tools.js";

  export default {
    mixins: [commonMixin],
    components: {
      mHeader: header,
      pageLoading,
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
        comtyInfo: {},
        doctorList: [],
        labelList: [],
        departmentId: "",
        loading: false,
        total: 1,// 初始化为1
        params: {
          page: 0,
          size: 10,
          name: ""
        },
        swiperOptionFree: {
          slidesPerView: "auto",
          spaceBetween: 10,
          freeMode: true,
        },

      };
    },
    computed: {
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
    filters: {
      filtersSpeciality(val) {
        if (val.length > 0) {
          return val.replace(/\;/g, " ");
        }
      },
      /*filtersRichText(val) {
        // 获取富文本内容
        if (!val) { return; }
        val.replace(/<\/?.+?>/g, "");
        val = utils.delHtmlTag(val);

        return val.slice(0, 50);
      }*/
    },
    created() {
      this.pid = this.$route.params.id;
      this.getDepart();
      this.getDoctor();
    },
    mounted() {
      this.windowScroll();
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
      filtersRichText(val) {
        // 获取富文本内容
        if (!val) { return; }
        val.replace(/<\/?.+?>/g, "");
        val = utils.delHtmlTag(val);

        return val.slice(0, 50);
      },
      routerTo(item) {
        if (item.doctorId) {
          window.location.href = `https://health.sina.cn/zt/doc/${ item.doctorId }`;
        } else {
          this.$router.push({
            path: this.$route.path + "Details",
            query: {
              comtyId: this.VX_comtyId,
              id: item.id
            }
          });
        }
      },
      windowScroll() {
        let vm = this;
        $(window).scroll(function(){
          let scrollTop = $(this).scrollTop();
          let scrollHeight = $(document).height();
          let clientHeight = $(this).height();

          if(scrollTop + clientHeight >= scrollHeight - 50){
            console.log("windowScroll");
            vm.getDoctor();
          }
        });
      },
      getDoctor() {
        if (this.loading) { return; }
        this.loading  = true;

        let params = {
          page: this.params.page + 1,
          size: this.params.size,
          source: "h5",
          clinicId: this.pid,
          departmentId: this.departmentId,
        };

        doctorService.getClinicDoctorList(params).then( res => {
          if (res.status == 200 && res.data) {
            this.total = res.total;
            this.params.page = this.params.page + 1;
            this.doctorList = [...this.doctorList, ...res.data];
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
          }
        });
      },
      changeLabel(id) {
        this.departmentId = this.departmentId === id ? "" : id;
        this.doctorList = [];
        this.params.page = 0;
        this.getDoctor();
      }
    },
    head() {
      return {
        title: "医生列表",
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
  @activeC: #2688FC;

  .text-overFlow(@n: 2) {
    display: -webkit-box;
    /* autoprefixer: ignore next */
    -webkit-box-orient: vertical;
    -webkit-line-clamp: @n;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .d-container {
    margin: 0 auto;
    max-width: 760px;
    overflow-y: auto;
    overflow-x: hidden;
    &.hidden {
      overflow-y: hidden;
    }
  }

  .flex-center {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .d-result {
    margin: 0 auto;
    padding: 40px @p 0;
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
        width: 48px;
        height: 48px;
        border-radius: 50%;
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
        margin-left: 10px;
        color: @color;
        line-height: normal;
        flex: 1;
        h3 {
          display: flex;
          align-items: center;
          font-size: 16px;
          font-weight: bold;
          span {
            .text-overFlow(1);
          }
          .icon {
            flex: none;
            width: 63px;
            height: 18px;
            background: url(~assets/images/list_tag_vip@2x.png) no-repeat;
            background-size: 100%;
          }
        }
        p {
          .text-overFlow(1);
          margin-top: 5px;
          font-size: 12px;
          color: #999;
          &.address {
            display: flex;
            justify-content: space-between;
            color: #666;
            span {
              .text-overFlow(1);
              flex: 1;
            }
            .distance {
              flex: none;
              margin-left: @m;
            }
          }
          &.speciality {
            .text-overFlow(1);
            padding-left: 20px;
            background: url(~assets/images/icon_speciality@2x.png) no-repeat;
            background-size: 14px;
            background-position: 0 3px;
          }
        }
      }
    }
  }

  .d-swipe-label {
    position: fixed;
    top: 44px;
    left: 0;
    right: 0;
    max-width: 760px;
    margin: 0 auto;
    padding: 0 @p;
    font-size: 12px;
    background: #fff;
    border-bottom: 1px solid @borderColor;
    .swiper-slide {
      margin: @p/2 0;
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

  .d-container.inApp {
    top: 0;
    .d-swipe-label {
      top: 0;
    }
  }
</style>
