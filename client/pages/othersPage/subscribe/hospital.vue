<template>
  <section class="container fixed">
    <div class="cover">
      <img src="./images/img_banner03@2x.jpg">
    </div>

    <div class="d-content">
      <!-- 筛选 -->
      <m-filter @area="onArea" @server="onServer"></m-filter>

      <!-- 列表 -->
      <no-ssr>
        <ul class="list">
          <li v-for="(item, index) in filterList" :key="item.key" class="d-box">
            <a href="javascript:;">
              <div class="img">
                <img v-lazy="item.url">
                <span class="right">{{ item.grade }}</span>
              </div>
              <div class="content">
                <div class="title">
                  <span class="name">{{ item.name }}{{ item.store | storeFilter }}</span>
                  <span class="subscribe" @click="openDialog(item)">预约</span>
                </div>

                <div class="label">
                  <label>经营{{ item.age }}年</label>
                  <!--<label>面积:{{ item.area }}m&sup2;</label>-->
                  <label>接待{{ item.accept }}人</label>
                </div>

                <div class="info">
                  <div class="left">
                    <em class="yellow">{{ item.docinfo.length }}名专业医师</em>
                    <em v-if="item.hasLicense == '有'">| 医疗执业许可</em>
                    <em v-if="item.project">| {{ item.project }}</em>
                  </div>

                  <!--<span class="right">{{ item.grade }}分</span>-->
                </div>
              </div>
            </a>

            <!-- 轮播图 -->
            <div class="swiper" :class="{ single: item.docinfo.length == 1 }" v-swiper="swiperOption" :instanceName="'mySwiper' + index">
              <div class="swiper-wrapper">
                <div class="swiper-slide" v-for="(cItem, cIndex) in item.docinfo" :key="cIndex">
                  <a href="javascript:;">
                    <div class="img">
                      <img v-if="cItem.image" v-lazy="cItem.image">
                      <img v-else :src="defaultImg">
                    </div>
                    <div class="content">
                      <h3>
                        {{ cItem.docName }}
                        <span>{{ cItem.level }}</span>
                        <span class="fRight">{{ cItem.docGrade }}分</span>
                      </h3>
                      <div class="info">
                        <span>从业{{ cItem.years }}年 | {{ cItem.fans }}粉丝 {{ cItem.count ? `| ${ cItem.count }` : "" }}</span>
                        <!--<span>{{ cItem.count }}</span>-->
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </no-ssr>
      <p class="no-more">没有更多了</p>
    </div>

    <!-- 底部 -->
    <bottom></bottom>

    <!-- dialog -->
    <editDialog v-model="dialogShow" :options="dialogOptions"></editDialog>
  </section>
</template>

<script>
  import defaultImg from "@/assets/images/default/img_doc_emp@2x.png";
  import imgLS from "./images/imgLS.png";
  import imgBB from "./images/imgBB.png";
  import imgSD from "./images/imgSD.png";
  import imgTB from "./images/imgTB.png";
  import mFilter from "./components/filter";
  import bottom from "./components/bottom";
  import editDialog from "./components/editDialog.vue";
  import hospitalData from "./js/hospital";
  import doctorData from "./js/doctor";

  export default {
    name: "hospital",
    components: {
      mFilter,
      bottom,
      editDialog
    },
    data () {
      return {
        dialogShow: false,
        dialogOptions: {},
        area: "",
        server: "",
        dataList: [],
        defaultImg: defaultImg,
        swiperOption: {
          spaceBetween: 6,
          centeredSlides: true
        },
        imgs: {
          imgLS,
          imgBB,
          imgSD,
          imgTB,
        }
      };
    },
    filters: {
      storeFilter(val) {
        return val ? `(${ val })` : "";
      }
    },
    computed: {
      filterList() {
        let area = this.area;
        let server = this.server;
        let result = this.dataList;

        if (area) {
          result = result.filter( a => { return a.region.indexOf(area) > -1; });
        }

        if (server) {
          result = result.filter( a => { return a.project.indexOf(server) > -1; });
        }

        return result;
      }
    },
    created() {
      this.dataList = this.delData();
    },
    methods: {
      delData() {
        let len = hospitalData.length;
        let result = hospitalData.map( (a, index) => {
          a.docinfo = doctorData.filter( b => { return b.cusomterId == a.cusomterId; });
          a.sort = Math.floor(Math.random() * len);
          a.key = a.sort + "." + index;
          return a;
        });

        return result.sort( (a, b) => a.sort - b.sort );
      },
      openDialog(item) {
        this.dialogShow = true;
        this.dialogOptions = {
          hospitalName: item.name + (item.store ? `(${ item.store })` : ""),
          doctorName: "",
        };
      },
      onArea(val) {
        this.area = val;
      },
      onServer(val) {
        this.server = val;
      }
    },
    head(){
      let innerHTML = "";

      if (this.$route.query && this.$route.query.form) {
        innerHTML = `
          ;(function(){
            var _third_ua = navigator.userAgent;
            var _third_app = navigator.appVersion;
            var _third_isMobile = !!_third_ua.match(/AppleWebKit.*Mobile.*/);
            if(!_third_isMobile) {
              location.href= "http://liugp.syqyzy.cn/"
            }
          })();
        `;
      }

      return {
        script:[
          {
            type: "text/javascript",
            innerHTML: innerHTML,
          }
        ],
        __dangerouslyDisableSanitizers: ["script"]
      };
    }
  };
</script>

<style lang="less" scoped>
  @import "./css/style.less";
</style>
