<template>
  <section class="container">
    <m-header
      :title="PAGE_APP_OBJ.label"
      :isSuspension="true"
    ></m-header>

    <div class="box_wrapper">
      <ul class="subject_list">
        <li v-for="(item,index) in subjectList" :key="index">
          <nuxt-link :to="{path:'/subjects/'+item.id}">
            <em class="top" v-if="item.isTop"></em>
            <em class="recommend" v-if="item.isRecommend"></em>
            <img v-lazy="item.coverUrl" width="100%" alt="">
            <p class="tit">{{item.title}}</p>
          </nuxt-link>
        </li>
      </ul>
      <m-page :loading="loading" :title="loading? '加载中...':'加载更多'" @loadFn="getSubjectList" v-if="!isReachEnd"></m-page>
    </div>
    <m-bottom v-if="isReachEnd&&subjectList.length>0"></m-bottom>
    <!-- 内容为空 -->
    <empty v-if="!loading&&subjectList.length==0" :isFullScreen="false"></empty>
    <!-- 内容为空 -->
  </section>
</template>

<script>
  import { commonMixin, comtyIdValid } from "~/mixins";
  import header from "~/components/header.vue";
  import page from "~/components/page.vue";
  import bottom from "~/components/bottom.vue";
  import empty from "~/components/empty.vue";
  import subjectService from "~/services/subjectService.js";

  export default {
    mixins: [commonMixin, comtyIdValid],
    components: {
      mHeader: header,
      mBottom: bottom,
      mPage: page,
      empty: empty
    },
    async asyncData({ route, redirect, store, query }) {
      // 获取社区信息
      let comtyInfo = await comtyIdValid.getComtyInfo({ redirect, store, query });

      // 检查应用是否开放
      let PAGE_APP_OBJ = await commonMixin.methods.SET_PAGE_PERMISSION("1", { route, redirect, store });

      return {
        comtyInfo,
        PAGE_APP_OBJ,
      };

    },
    data() {
      return {
        subjectList: [],
        loading: false,
        currentPage: 0,
        isReachEnd: false,
        pageCount: 2,
        pageSize: 10,
      };
    },
    created() {
      this.getSubjectList();
    },
    methods: {
      getSubjectList() {
        if (this.loading) return;
        this.loading = true;
        let _this = this;
        let data = {
          page: _this.currentPage + 1,
          size: _this.pageSize
        };
        subjectService.subjectList(data)
          .then((res) => {
            _this.loading = false;
            if (res.status == 200) {
              _this.subjectList = _this.subjectList.concat(res.data);
              _this.currentPage = _this.currentPage + 1;
              _this.pageCount = Math.ceil(res.total / _this.pageSize);
              if (_this.currentPage + 1 > _this.pageCount) {
                _this.isReachEnd = true;
              } else {
                _this.isReachEnd = false;
              }
            }
          }).catch(() => {
            _this.loading = false;
          });
      }
    },
    head() {
      return {
        title: `医疗科普专题-${this.comtyInfo.comtyName}`,
        meta: [
          {
            name: "keywords",
            content: "专家团队" + "，" + this.comtyInfo.comtyName
          },
          {
            hid: "description",
            name: "description",
            content: "专家团队" + "，" + this.comtyInfo.introduction
          }
        ],
      };
    }
  };

</script>

<style lang="less" scoped>
  @import "~/assets/css/list.css";

  .subject_list {
    li {
      border-bottom: 1px solid #EFEFEF;
      padding-top: 15px;
    }

    li:last-child {
      border-bottom: 0;
    }

    a {
      display: block;
      position: relative;
    }

    img {
      display: block;
      height: 200px;
      border-radius: 6px;
      background-color: #f2f2f2;
    }

    .tit {
      font-size: 16px;
      font-weight: bold;
      color: #282828;
      line-height: 20px;
      padding: 10px 0 15px 0;
    }

    .top,
    .recommend {
      position: absolute;
      right: 15px;
      top: 0;
      display: block;
      width: 36px;
      height: 34px;
      background: url(../../assets/images/tag_top@2x.png) no-repeat;
      background-size: cover;
    }

    .recommend {
      background-image: url(../../assets/images/tag_recomm@2x.png);
    }
  }

</style>
