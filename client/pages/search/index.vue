<template>
  <section class="container d-search">
    <form action="javascript:void(0)" @submit="onSubmit" class="search-box">
      <nuxt-link to="/"></nuxt-link>
      <div class="input">
        <input
          type="search"
          v-model.trim="keywords"
          id="searchInput"
          ref="searchInput"
          @keyup.13="onSubmit"
          autofocus="autofocus"
          name="searchInput"
          placeholder="搜索医生/文章"
        />
        <span class="search-icon" @click="onSubmit"></span>
        <span v-if="keywords" class="clear" @click="keywords = ''"></span>
        <input type="text" style="display: none" />
      </div>
    </form>
    <div class="tab" v-show="afterFirstSearch&&!isEmpty">
      <ul>
        <li
          v-for="(item,index) in tabList"
          :key="index"
          v-if="item.list.length>0"
          :class="{ active: (tabActive-1) == index }"
          @click="onTab(index,item.idx)"
        >{{item.tabName}}</li>
      </ul>
    </div>
    <div class="box_wrapper">
      <div class="search_tab">
        <div
          class="swipert"
          v-swiper:mySwiper5="swiperOption"
          @slideChangeTransitionEnd="slideChange"
          @touchStart="touchStart"
        >
          <div class="swiper-wrapper">
            <div v-show="tabList[0].list.length>0" class="swiper-slide">
              <div
                class="swiperv"
                v-swiper:mySwiper1="swiperOption2"
                @reachEnd="swiperReachEndV(0)"
              >
                <div class="swiper-wrapper">
                  <div class="swiper-slide" v-for="item in tabList[0].list">
                    <article-list
                      :list="item"
                      :attr="{
                        id: 'id',
                        title: 'title',
                        headPicUrl: 'headImg',
                        authorName: 'auhorName',
                        helpNum: 'helpNum',
                        cover: 'coverimg',
                        pv: 'virtualPv'
                      }"
                    ></article-list>
                  </div>

                  <div class="swiper-slide">
                    <m-page
                    :loading="tabList[0].isLoading"
                    :title="tabList[0].isLoading? '加载中...':'加载更多'"
                    @loadFn="getData2(0)"
                    v-if="!isEmpty&&!tabList[0].isReachEnd"
                    ></m-page>
                    <m-bottom v-if="!isEmpty&&tabList[0].isReachEnd" :title="bottomText"></m-bottom>
                  </div>
                </div>
              </div>
            </div>
            <div v-show="tabList[1].list.length>0" class="swiper-slide">
              <div
                class="swiperv"
                v-swiper:mySwiper2="swiperOption2"
                @reachEnd="swiperReachEndV(1)"
              >
                <div class="swiper-wrapper">
                  <div class="swiper-slide" v-for="item in tabList[1].list">
                    <doctor-list :list="item"></doctor-list>
                  </div>
                  <div class="swiper-slide">
                    <m-page
                      :loading="tabList[1].isLoading"
                      :title="tabList[1].isLoading? '加载中...':'加载更多'"
                      @loadFn="getData2(1)"
                      v-if="!isEmpty&&!tabList[1].isReachEnd"
                    ></m-page>
                    <m-bottom v-if="!isEmpty&&tabList[1].isReachEnd" :title="bottomText"></m-bottom>
                  </div>
                </div>
              </div>
            </div>
            <div v-show="tabList[2].list.length>0" class="swiper-slide">
              <div
                class="swiperv"
                v-swiper:mySwiper3="swiperOption2"
                @reachEnd="swiperReachEndV(2)"
              >
                <div class="swiper-wrapper">
                  <div class="swiper-slide" v-for="item in tabList[2].list">
                    <news-list :list="item" :type="10" :reverse="true" class="big-img"></news-list>
                  </div>
                  <div class="swiper-slide">
                    <m-page
                      :loading="tabList[2].isLoading"
                      :title="tabList[2].isLoading? '加载中...':'加载更多'"
                      @loadFn="getData2(2)"
                      v-if="!isEmpty&&!tabList[2].isReachEnd"
                    ></m-page>
                    <m-bottom v-if="!isEmpty&&tabList[2].isReachEnd" :title="bottomText"></m-bottom>
                  </div>
                </div>
              </div>
            </div>
            <div v-show="tabList[3].list.length>0" class="swiper-slide">
              <div
                class="swiperv"
                v-swiper:mySwiper4="swiperOption2"
                @reachEnd="swiperReachEndV(3)"
              >
                <div class="swiper-wrapper">
                  <div class="swiper-slide" v-for="item in tabList[3].list">
                    <news-list :list="item" :type="11" :reverse="true" class="big-img"></news-list>
                  </div>
                  <div class="swiper-slide">
                    <m-page
                      :loading="tabList[3].isLoading"
                      :title="tabList[3].isLoading? '加载中...':'加载更多'"
                      @loadFn="getData2(3)"
                      v-if="!isEmpty&&!tabList[3].isReachEnd"
                    ></m-page>
                    <m-bottom v-if="!isEmpty&&tabList[3].isReachEnd"  :title="bottomText"></m-bottom>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <empty v-if="afterFirstSearch&&!loading&&isEmpty"></empty>
      <loading ref="loading"></loading>
    </div>
  </section>
</template>

<script>
import { commonMixin } from "~/mixins";
import homeService from "~/services/homeService.js";
import articleService from "~/services/articleService.js";
import communityService from "~/services/communityService.js";
import page from "~/components/page.vue";
import bottom from "~/components/bottom.vue";
import loading from "~/components/loading.vue";
import empty from "~/components/empty.vue";
import doctorList from "@/components/list_template/doctor.vue";
import articleList from "@/components/list_template/article.vue";

import newsList from "@/components/list_template/news.vue";
export default {
  mixins: [commonMixin],
  name: "search",
  layout: "layout_search",
  components: {
    mBottom: bottom,
    mPage: page,
    empty: empty,
    loading,
    newsList,
    doctorList,
    articleList
  },
  data() {
    return {
      keywords: "",
      label: "",
      swiperOption: {
        observer: true, //修改swiper自己或子元素时，自动初始化swiper
        observeParents: false //修改swiper的父元素时，自动初始化swiper
      },
      swiperOption2: {
        direction: "vertical",
        slidesPerView: "auto",
        freeMode: true,
        resistanceRatio: 0,
        resistance: false,
        touchReleaseOnEdges: true,
        observer: true, //修改swiper自己或子元素时，自动初始
        observeParents: true //修改swiper的父元素时，自动初始化swiper化swiper
      },
      bottomText:"沒有更多了~",
      afterFirstSearch: false,
      loading: false,
      currentPage: 0,
      pageCount: 0,
      pageSize: 10,
      isEmpty: true,
      tabActive: 0, //激活的标签index ，当没有任何tab的时候 没有激活的标签
      tabList: [
        {
          tabName: "健康科普",
          tabType: "article",
          pageCount: 2,
          currentPage: 0,
          list: [],
          idx: 0,
          isLoading: false,
          isReachEnd: false
        },
        {
          tabName: "社区医生",
          tabType: "doctor",
          pageCount: 2,
          currentPage: 0,
          list: [],
          idx: 0,
          isLoading: false,
          isReachEnd: false
        },
        {
          tabName: "健康知识",
          tabType: "news1",
          pageCount: 2,
          currentPage: 0,
          list: [],
          idx: 0,
          isLoading: false,
          isReachEnd: false
        },
        {
          tabName: "资讯公告",
          tabType: "news2",
          pageCount: 2,
          currentPage: 0,
          idx: 0,
          list: [],
          isLoading: false,
          isReachEnd: false
        }
      ]
    };
  },
  computed: {},
  watch: {},
  created() {},

  deactivated() {},
  activated() {},
  methods: {
    swiperReachEndV(index) {
      console.log("end");
      if (this.loading) {
        return;
      }
      if (!this.tabList[index].isReachEnd) {
        this.getData2(index);
      }
    },
    touchStart() {},
    slideChange() {
      let index = this.tabList.findIndex(item => {
        return this.mySwiper5.activeIndex + 1 == item.idx;
      });

      this.tabActive = index + 1;
    },
    onTab(index, tabidx) {
      this.tabActive = index + 1;
      // console.log(this.tabList[this.tabActive - 1].list);
      this.mySwiper5.slideTo(tabidx - 1);
      if (this.tabList[this.tabActive - 1].list.length < 1) {
        this.getData2(this.tabActive - 1);
      }
    },

    onSubmit() {
      if (this.keywords) {
        this.reset();
        this.searchInit();
      } else {
        this.reset();
      }
    },
    reset() {
      this.tabActive = 0;
      this.isEmpty = true;
      this.tabList.forEach(item => {
        item.list = [];
        item.pageCount = 2;
        item.idx = 0;
        item.currentPage = 0;
        item.isReachEnd = false;
        item.isLoading = false;
      });
    },
    searchInit() {
      this.loading = true;
      this.$refs.loading.start();
      let params = {
        size: this.pageSize,
        title: this.keywords.trim() // 关键字
      };
      console.log(params.title);
      homeService
        .getIndexContentByTitle(params)
        .then(res => {
          if (res.status == 200 && res.data) {
            this.$refs.searchInput.blur();

            let scrollIdx = 0;
            var isEmpty = true;
            if (res.data.healthScienceList) {
              // if (res.data.healthScienceList.length < 10) {
              //   this.tabList[0].pageCount = 1;
              //   this.tabList[0].isReachEnd = true;
              // }
              if (res.data.healthScienceList.length > 0) {
                this.tabList[0].list.push(res.data.healthScienceList);
                this.tabList[0].idx = ++scrollIdx;
                isEmpty = false;
                if (!this.tabActive) {
                  this.tabActive = 1;
                }
              }
            }
            if (res.data.doctorList) {
              // if (res.data.doctorList.length < 10) {
              //   this.tabList[1].pageCount = 1;
              //   this.tabList[1].isReachEnd = true;
              // }
              if (res.data.doctorList.length > 0) {
                this.tabList[1].list.push(res.data.doctorList);
                this.tabList[1].idx = ++scrollIdx;
                isEmpty = false;
                if (!this.tabActive) {
                  this.tabActive = 2;
                }
              }
            }
            if (res.data.healthKnowList) {
              // if (res.data.healthKnowList.length < 10) {
              //   this.tabList[2].pageCount = 1;
              //   this.tabList[2].isReachEnd = true;
              // }
              if (res.data.healthKnowList.length > 0) {
                this.tabList[2].list.push(res.data.healthKnowList);
                this.tabList[2].idx = ++scrollIdx;
                isEmpty = false;
                if (!this.tabActive) {
                  this.tabActive = 3;
                }
              }
            }
            if (res.data.announceList) {
              // if (res.data.announceList.length < 10) {
              //   this.tabList[3].pageCount = 1;
              //   this.tabList[3].isReachEnd = true;
              // }
              if (res.data.announceList.length > 0) {
                this.tabList[3].list.push(res.data.announceList);
                this.tabList[3].idx = ++scrollIdx;
                isEmpty = false;
                if (!this.tabActive) {
                  this.tabActive = 4;
                }
              }
            }

            this.isEmpty = isEmpty;
            for(let idx in this.tabList){
              if(this.tabList[idx].list.length>0){
                this.getData2(Number(idx));
              }
            }
            this.$nextTick(() => {
              if (!this.isEmpty) {
                this.mySwiper5.slideTo(0);
                this.mySwiper5.update();
              }

              if (this.tabList[0].list.length > 0) {
                this.mySwiper1.update();
              }
              if (this.tabList[1].list.length > 0) {
                this.mySwiper2.update();
              }
              if (this.tabList[2].list.length > 0) {
                this.mySwiper3.update();
              }
              if (this.tabList[3].list.length > 0) {
                this.mySwiper4.update();
              }
            });
          }
        })
        .finally(() => {
          this.loading = false;
          this.afterFirstSearch = true;
          this.$refs.loading.finish();
        });
    },
    getData2(index) {
      let params;
      if (!this.keywords) {
        return;
      }
      switch (index) {
        case 0:
          params = {
            page: this.tabList[this.tabActive - 1].currentPage + 1,
            size: this.pageSize,
            isDistinct: true, //代码去重
            label: this.label, // 标签
            title: this.keywords.trim() // 关键字
          };
          this.getHealthScienceByTitle(params, 0);
          break;
        case 1:
          params = {
            page: this.tabList[this.tabActive - 1].currentPage + 1,
            size: this.pageSize,
            customerName: this.keywords.trim(),
            cityId: "",
            depId: ""
          };
          this.enrolledDoctorInfo(params, 1);
          break;
        case 2:
          params = {
            page: this.tabList[this.tabActive - 1].currentPage + 1,
            size: this.pageSize,
            title: this.keywords.trim(), // 关键字
            type: 1
          };
          this.pageHealthInfo(params, 2);
          break;
        case 3:
          params = {
            page: this.tabList[this.tabActive - 1].currentPage + 1,
            size: this.pageSize,
            title: this.keywords.trim(), // 关键字
            type: 2
          };
          this.pageHealthInfo(params, 3);
          break;
      }
    },
    pageHealthInfo(params, idx) {
      if (this.tabList[idx].isLoading) return;
      this.tabList[idx].isLoading = true;
      homeService
        .pageHealthInfo(params)
        .then(res => {
          if (res.status == 200 && res.data) {
            if (res.data.length > 0){
              if(this.tabList[idx].currentPage==0){
                this.tabList[idx].list.splice(0,1,res.data);
              }else{
                this.tabList[idx].list.push(res.data);

              }
              this.tabList[idx].currentPage = this.tabList[idx].currentPage + 1;
              this.tabList[idx].pageCount = Math.ceil(res.total / this.pageSize);
              if (this.tabList[idx].currentPage >= this.tabList[idx].pageCount) {
                this.tabList[idx].isReachEnd = true;
              }
            }else{
              this.tabList[idx].isReachEnd = true;
            }

            this.afterFirstSearch = true;
          }
        })
        .finally(() => {
          this.tabList[idx].isLoading = false;
        });
    },
    enrolledDoctorInfo(params, idx) {
      if (this.tabList[idx].isLoading) return;
      this.tabList[idx].isLoading = true;
      let _this = this;
      communityService
        .enrolledDoctorInfo(params)
        .then(res => {
          if (res.status == 200 && res.data) {
            if (res.data.length > 0) {

              if(this.tabList[1].currentPage==0){
                this.tabList[1].list.splice(0,1,res.data);
              }else{
                this.tabList[1].list.push(res.data);

              }

              this.tabList[1].currentPage = this.tabList[1].currentPage + 1;
              this.tabList[1].pageCount = Math.ceil(res.total / this.pageSize);
              if (this.tabList[1].currentPage >= this.tabList[1].pageCount) {
                this.tabList[1].isReachEnd = true;
              }
            }else{
              this.tabList[1].isReachEnd = true;
            }
            this.afterFirstSearch = true;
          }
        })
        .finally(() => {
          _this.tabList[idx].isLoading = false;
        });
    },
    getHealthScienceByTitle(params, idx) {
      if (this.tabList[idx].isLoading) return;
      this.tabList[idx].isLoading = true;
      articleService
        .queryListPaged(params)
        .then(res => {
          if (res.status == 200 && res.data) {
            if (res.data.length > 0) {


              if(this.tabList[0].currentPage==0){
                this.tabList[0].list.splice(0,1,res.data);
              }else{
                this.tabList[0].list.push(res.data);

              }
              this.tabList[0].currentPage = this.tabList[0].currentPage + 1;
              this.tabList[0].pageCount = Math.ceil(res.total / this.pageSize);
              if (this.tabList[0].currentPage >= this.tabList[0].pageCount) {
                this.tabList[0].isReachEnd = true;
              }
            }else{
              this.tabList[0].isReachEnd = true;
            }
            this.afterFirstSearch = true;
          }
        })
        .finally(() => {
          this.tabList[idx].isLoading = false;
        });
    }
  }
};
</script>

<style lang="less">
html,
body {
  background: #fff;
}
</style>

<style lang="less" scoped>
.box_wrapper{
  padding: 0;

}
.swipert{
  .swiper-slide {
    padding: 0 15px;
  }
}
.swiperv {
  height: calc(100vh - 90px);

  .swiper-slide {
    padding:0;
    height: auto;
    box-sizing: border-box;
  }
}
</style>
