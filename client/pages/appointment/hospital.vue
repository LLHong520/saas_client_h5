<template>
  <section class="container" :class="{ overflowHidden: isDialogShow }">
    <div class="cover">
      <div class="item">
        <div v-if="firstLoaded">
          <img v-if="computed_default_hospital_banner" :src="computed_default_hospital_banner">
          <img v-else-if="dataInfo.headImage && dataInfo.headImage.url" :src="dataInfo.headImage.url">
          <img v-else :src="default_hospital_banner">
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
          <div class="line-item" @click="openDialogFilter('brand')">
            <i class="icon brand"></i>
            <b iw="{desc:'品牌',id:'choosePinPai',ext:{}}">{{ brandActiveName }}</b>
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
          <li v-for="(item, index) in dataList" :key="item.key" class="d-box">
            <div v-if="item.isRecommend == 0" class="top">推荐</div>

            <div class="list-item">
              <div class="img">
                <img v-lazy="getDefault_img(item, 'hospital')">
                <i class="icon identification"></i>
              </div>
              <div class="content">
                <div class="title isTop">
                  <span class="name">{{ item.name }}</span>
                </div>

                <div class="label" v-if=" _getLabel(item).length > 0">
                  <label v-for="(cItem) in _getLabel(item)" :class="{ active: cItem.isActive }" :key="cItem.id">{{ cItem.name }}</label>
                </div>

                <div class="info">
                  <div class="left">
                    <span class="info-item" v-if="item.doctorCount>0"><em class="active-color">{{ item.doctorCount }}</em>专业医生&nbsp;|&nbsp;</span>
                    <span class="info-item"><em class="active-color">{{ item.appointmentCount }}</em>人预约</span>
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
              </div>
            </div>

            <!-- 轮播图 -->
            <div
              v-if="item.hospitalImage && item.hospitalImage.length > 0"
              class="swiper"
              :class="{ single: item.hospitalImage.length == 1 }"
              v-swiper="swiperOption"
              :instanceName="'mySwiper' + index"
            >
              <div class="swiper-wrapper">
                <div class="swiper-slide" v-for="(cItem, cIndex) in item.hospitalImage" :key="cIndex">
                  <div class="img" @click="onPreview(item.hospitalImage, cIndex)">
                    <img v-if="cItem.url" v-lazy="cItem.url">
                    <img v-else :src="defaultImg">
                  </div>
                </div>
              </div>
            </div>

            <!-- 按钮 -->
            <div class="button"
              :iw="`{desc:'预约按钮',id:'yuyueButtom',ext:{hospitalId:'${item.hospitalId}'}}`" @click="openDialogFilter2(item, 'hospital')">
              {{ dataInfo.buttonAlias || "预约" }}
            </div>
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
    <bottom></bottom>

    <!-- dialog -->
    <dialogEdit v-model="dialogEditShow" :options="dialogEditOptions" @success="successDialogEdit"></dialogEdit>
    <dialogNone v-model="dialogNoneShow" :options="dialogNoneOptions" ></dialogNone>
    <dialogFilter v-model="dialogFilterShow" :options="dialogFilterOptions" ref="dialogFilter" @confirm="filterCallbck"></dialogFilter>
    <dialogArea v-model="dialogAreaShow" :options="dialogAreaOptions" ref="dialogArea" @confirm="areaCallbck"></dialogArea>

    <!-- 图片预览 -->
    <iwen-preview
      v-model="imgPreview.show"
      :list="imgPreview.list"
      :index="imgPreview.index"
    ></iwen-preview>
  </section>
</template>

<script>
  import communityService from "~/services/communityService.js";
  import iwenPreview from "~/components/iwen/preview.vue";
  import bottom from "./components/bottom";
  import pageMixins from "./js/pageMixins";
  import default_hospital_banner from "@/assets/images/default/hospital_banner_new@2x.png";

  export default {
    name: "hospital",
    mixins: [pageMixins],
    components: {
      bottom,
      iwenPreview,
    },
    data () {
      return {
        default_hospital_banner,
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
    filters: {
      storeFilter(val) {
        return val ? `(${ val })` : "";
      }
    },
    created() {
    },
    mounted(){
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

        let params = {
          page: this.params.page + 1,
          size: this.params.size,
          ...otherParams
        };
        communityService.pageHospitalList(params).then( res => {
          if (res.status == 200 && res.data) {
            this.total = res.total;
            this.params.page = this.params.page + 1;
            let data = res.data.map((item,index)=>{
              //生成预约模拟数据
              if(this.params.page == 1){
                item.appointmentCount += 110 - index*10;
                let rnum=Math.floor(Math.random()*10);
                item.appointmentCount +=rnum;
              }else{
                item.appointmentCount += 10;
                let rnum=Math.floor(Math.random()*10);
                item.appointmentCount +=rnum;
              }
              return item;
            });
            if(num){
              this.dataList=[];
            }
            this.dataList = this.dataList.concat(data);
          }
        }).finally( () => {
          this.loading  = false;
          //注入公共页面加载打点
          this.injectDomLoadTime();
        });
      },
      onPreview(list, index) {
        this.imgPreview.show = true;
        this.imgPreview.list = JSON.parse(JSON.stringify(list));
        this.imgPreview.index = index + 1;
      },
      limitArr(arr, num = 3) {
        if (!arr) {
          return [];
        }

        if (arr.length > num) {
          return arr.slice(0, num);
        }

        return arr;
      },
      _getLabel(item, slice = 4) {
        let result = [];
        let serviceArr = item.securityService;
        let projectArr = item.project;

        if (serviceArr) {
          serviceArr = this.limitArr(serviceArr, 1);
          serviceArr.forEach( a => {
            result.push({
              id: a,
              name: this.filtersLabel(a, 0),
              isActive: true
            });
          });
        }

        if (projectArr){
          projectArr = this.limitArr(projectArr);
          projectArr.forEach( a => {
            result.push({
              id: a,
              name: this.filtersLabel(a, 1),
              isActive: false
            });
          });
        }

        result = result.map( a => {
          if (a.name.length > slice) {
            a.name = a.name.slice(0, slice) + "...";
          }
          return a;
        });

        return result;
      }
    }
  };
</script>

<style lang="less" scoped>
  @import "./css/style.less";
</style>
