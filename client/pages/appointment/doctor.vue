<template>
  <section class="container" :class="{ overflowHidden: isDialogShow }">
    <div class="cover">
      <div class="item">
        <div v-if="firstLoaded">
          <img v-if="computed_default_hospital_banner" :src="computed_default_hospital_banner">
          <img v-else-if="dataInfo.headImage && dataInfo.headImage.url" :src="dataInfo.headImage.url">
          <img v-else :src="default_doctor_banner">
        </div>
      </div>
    </div>

    <div class="d-content">
      <!-- 筛选 -->
      <div class="d-box filter-box">
        <div class="line">
          <div class="line-item" @click="openDialogArea">
            <i class="icon location"></i>
            <b iw="{desc:'我的位置',id:'myPosition',ext:{}}">{{ areaActiveName }}</b>
          </div>
          <div class="line-item flexUnset" @click="refresh">
            我的位置
            <i class="icon refresh"></i>
          </div>
        </div>

        <div class="line line-average">
          <div class="line-item" @click="openDialogTime()">
            <i class="icon date"></i>
            <b iw="{desc:'品牌',id:'choosePinPai',ext:{}}">{{ timeActiveName }}</b>
          </div>
          <div class="line-item" @click="openDialogFilter('service')">
            <i class="icon project"></i>
            <b iw="{desc:'项目',id:'chooseXiangmu',ext:{}}">{{ serviceActiveName }}</b>
          </div>
        </div>
      </div>

      <!-- 列表 -->
      <no-ssr>
        <ul class="list">
          <li v-for="(item) in dataList" :key="item.key" class="d-box">
            <div v-if="item.isRecommend == 0" class="top">推荐</div>

            <div class="list-item list-item-doctor">
              <div class="img">
                <img v-lazy="getDefault_img(item, 'doctor', 'headPic')">
                <i class="icon identification"></i>
              </div>
              <div class="content">
                <div class="title isTop">
                  <span class="name">{{ item.name }} <label>{{ item.title }}</label></span>
                </div>

                <div  v-if="item.hospital" class="info label">
                  <div class="left">
                     <label>{{ item.hospital }}</label>
                  </div>
                  <div class="right">
                    <rate v-model="item.score"></rate>
                  </div>
                </div>

                <div class="info">
                  <div class="left">
                    <span class="info-item">{{ item.address }}</span>
                  </div>
                  <span class="right">{{ item.distance | filtersDistance }}</span>
                </div>

                <div v-if="item.expertiseArea" class="expertiseArea">
                  <span>
                    {{ item.expertiseArea }}
                  </span>
                </div>
              </div>
            </div>

            <!-- 按钮 -->
            <div class="button" :iw="`{desc:'预约按钮',id:'yuyueButtom',ext:{doctorId:'${item.doctorId}'}}`" @click="openDialogFilter2(item, 'doctor')">{{ dataInfo.buttonAlias || "预约" }}</div>
          </li>
        </ul>
      </no-ssr>
    </div>

    <!-- 底部 -->
    <page-loading
      :class="{ 'is-null': dataList.length == 0 }"
      :loading="loading || isRefresh"
      :end="isEnd"
      :empty="dataList.length == 0"
      :isFullScreen="false"
      bottomTxt="没有更多了~"
      @loadFn="getData"
    ></page-loading>

    <!-- 底部备案信息 -->
    <bottom type="doctor"></bottom>

    <!-- dialog -->
    <dialogNone v-model="dialogNoneShow" :options="dialogNoneOptions" ></dialogNone>
    <dialogEdit v-model="dialogEditShow" :options="dialogEditOptions"></dialogEdit>
    <dialogFilter v-model="dialogFilterShow" :options="dialogFilterOptions" ref="dialogFilter" @confirm="filterCallbck"></dialogFilter>
    <dialogArea v-model="dialogAreaShow" :options="dialogAreaOptions" ref="dialogArea" @confirm="areaCallbck"></dialogArea>
    <dialogTime v-model="dialogTimeShow" :options="dialogTimeOptions" ref="dialogTime" @confirm="timeCallbck"></dialogTime>
  </section>
</template>

<script>
  import communityService from "~/services/communityService.js";
  import bottom from "./components/bottom";
  import dialogTime from "./components/dialog_time";
  import pageMixins from "./js/pageMixins";
  import default_doctor_banner from "@/assets/images/default/doctor_banner_new@2x.png";

  export default {
    name: "doctor",
    mixins: [pageMixins],
    components: {
      bottom,
      dialogTime,
    },
    data () {
      return {
        default_doctor_banner
      };
    },
    filters: {
      storeFilter(val) {
        return val ? `(${ val })` : "";
      },
    },
    created() {

    },
    methods: {
      getData(num) {
        console.log("这是加载数据的接口",num);
        if(num!=2){
          //2为定位加载
          //刷新页面的时候 会让页面滚动加载 优先于 定位 来getData,加上getdata的类型,定位的时候一定会拉取.
          if (this.loading) { return; }
        }
        console.log("这是加载数据的接口222");

        this.loading  = true;

        let otherParams = this.getOtherParams();
        //爱问统计脚本
        try {
          window._iwDataer.sendCustomData({
            id:"loadMoreButtom",
            desc:"加载下一页",
            ext:{
              pageNum:this.params.page + 1
            }
          });

        } catch (error) {
          console.log(error);
        }
        let params = {
          page: this.params.page + 1,
          size: this.params.size,
          ...otherParams
        };

        communityService.pageDoctorList(params).then( res => {
          if (res.status == 200 && res.data) {
            this.total = res.total;
            this.params.page = this.params.page + 1;
            if(num){
              this.dataList=[];
            }
            this.dataList = this.dataList.concat(res.data);
          }
        }).finally( () => {
          this.loading  = false;
          //注入公共页面加载打点
          this.injectDomLoadTime();
        });
      },
    }
  };
</script>

<style lang="less" scoped>
  @import "./css/style.less";
</style>
