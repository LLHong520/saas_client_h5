<template>
  <section class="container">
    <m-header :isSuspension="true">
      <h2 slot="header" class="d-header-tab">
        <!--<span @click="onTab(1)" :class="{ active: tabActive == 1 }">健康知识</span>
        <span @click="onTab(2)" :class="{ active: tabActive == 2 }">资讯公告</span>-->
        <span
          v-for="(item, index) in tab"
          :key="index"
          :class="{
            active: tabActive == item.index,
            single: tab.length < 2
          }"
          @click="onTab(item.index)"
        >
          {{ item.name }}
        </span>
      </h2>
    </m-header>
    <div class="box_wrapper">
      <news-list :list="newsList" :type="tabActive == 1 ? 10 : 11" :reverse="true" class="big-img"></news-list>
      <m-page :loading="loading" :title="loading? '加载中...':'加载更多'" @loadFn="getData(tabActive)" v-if="!isReachEnd"></m-page>
    </div>
    <m-bottom v-if="isReachEnd && newsList.length>0"></m-bottom>
    <!-- 内容为空 -->
    <empty v-if="!loading && newsList.length == 0" :isFullScreen="true"></empty>
    <!-- 内容为空 -->
  </section>
</template>

<script>
  import {
    commonMixin,
    comtyIdValid
  } from "~/mixins";
  import header from "~/components/header.vue";
  import page from "~/components/page.vue";
  import bottom from "~/components/bottom.vue";
  import homeService from "~/services/homeService";
  import empty from "~/components/empty.vue";
  import newsList from "@/components/list_template/news.vue";

  export default {
    mixins: [commonMixin, comtyIdValid],
    components: {
      mHeader: header,
      mBottom: bottom,
      mPage: page,
      empty: empty,
      newsList
    },
    async asyncData({ route, redirect, store, query }) {
      // 获取社区信息
      let comtyInfo = await comtyIdValid.getComtyInfo({ redirect, store, query });

      // 检查应用是否开放
      let type = route.query.type == 1 ? "5" : "6"; // 1 健康知识, 2 资讯公告
      let PAGE_APP_OBJ = await commonMixin.methods.SET_PAGE_PERMISSION(type, { route, redirect, store });

      return {
        comtyInfo,
        PAGE_APP_OBJ
      };
    },
    data() {
      return {
        newsList: [],
        loading: false,
        currentPage: 0,
        pageCount: 2,
        pageSize: 10,
        tabActive: 1,
        tabActiveName: "",
        tab: [
          /*{
            name: "健康知识",
            index: 1,
            data: []
          },
          {
            name: "资讯公告",
            index: 2,
            data: []
          }*/
        ],
        tab1: "健康知识",
        tab2: "资讯公告",
      };
    },
    computed: {
      isReachEnd() {
        return this.currentPage >= this.pageCount;
      }
    },
    created() {
      if (this.GET_PAGE_PERMISSION_MODULE("5")) {
        this.tab1 = this.$store.getters.getCurrPermissionObj("5").label || this.tab1;
        this.initTab(1);
      }

      if (this.GET_PAGE_PERMISSION_MODULE("6")) {
        this.tab2 = this.$store.getters.getCurrPermissionObj("6").label || this.tab2;
        this.initTab(2);
      }

      if (this.tab.length != 0) {
        this.tabActive = this.$route.query.type || 1;
        this.getData(this.tabActive);
      }
    },
    mounted() {
      this.tabActiveName = this.tabActive == 1 ? this.tab1 : this.tab2;
      this.dataPvUvcollect({
        businessType:"news",
        collectType: "cmty_h5_news_index",
        businessId: this.VX_comtyId
      });
    },
    methods: {
      getData(type) {
        if (this.loading) return;
        this.loading = true;
        let params = {
          page: this.currentPage + 1,
          size: this.pageSize,
          type: type
        };
        homeService.pageHealthInfo(params)
          .then((res) => {
            this.loading = false;
            if (res.status == 200 && res.data) {
              this.newsList = this.newsList.concat(res.data);
              this.currentPage = this.currentPage + 1;
              this.pageCount = Math.ceil(res.total / this.pageSize);
            }
          }).finally(() => {
            this.loading = false;
          });
      },
      onTab(type) {
        if (this.tab.length < 2) {
          return;
        }
        this.tabActive = type;
        this.pageCount = 2;
        this.currentPage = 0;
        this.newsList = [];
        this.getData(type);
      },
      initTab(type) {
        let name = type == 1 ? this.tab1 : this.tab2;
        this.tab.push({
          name: name,
          index: type,
          data: []
        });
      }
    },
    head() {
      return {
        title: this.tabActiveName,
      };
    }
  };

</script>

<style lang="less" scoped>
  @import "~/assets/css/list.css";

</style>
