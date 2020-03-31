<template>
  <section class="container">
    <m-header
      :title="PAGE_APP_OBJ.label"
      :border_on="false"
      :isSuspension="true"
    ></m-header>

    <!-- 文章列表 -->
    <div class="box_wrapper">
      <ul class="video-ul">
        <li v-for="(item, index) in articleList" :key="index">
          <nuxt-link :to="{path:'/video/' + item.id }">
            <div v-if="item.cover" class="img">
              <img v-lazy="item.cover">
              <!--<div class="comty" v-if="VX_isInApp">
                <span class="name">{{ item.communityName }}</span>
              </div>-->
            </div>
            <div class="content">
              <h3>{{ item.title }}</h3>

              <div class="msg">
                <div class="doc">
                  <span>{{ item.authorName }}</span>
                  <span v-if="item.doctorTitle">· {{ item.doctorTitle }}</span>
                </div>

                <div class="info">
                  <span class="icon msg">{{ item.comments || 0 }}</span>
                  <span class="icon good">{{ item.good || 0 }}</span>
                  <span class="icon video">{{ item.pv || 0 }}</span>
                </div>
              </div>
            </div>
          </nuxt-link>
        </li>
      </ul>

      <!-- 模块占位 -->
      <section class="loadingPlaceHolder" v-show="loading">
        <loadingPlaceHolder  v-for="n in 10" :key="n.key"/>
      </section>

      <page-loading
        :loading="loading"
        :end="isReachEnd"
        :empty="articleList.length == 0"
        @loadFn="getArticle"
      ></page-loading>
    </div>
  </section>
</template>

<script>
  import { commonMixin, comtyIdValid } from "~/mixins";
  import header from "~/components/header.vue";
  import loadingPlaceHolder from "@/components/loading-place-holder/loading-place-holder";
  import pageLoading from "~/components/pageLoading.vue";
  import articleService from "~/services/articleService.js";

  export default {
    mixins: [commonMixin, comtyIdValid],
    components: {
      mHeader: header,
      loadingPlaceHolder,
      pageLoading
    },
    async asyncData({ route, redirect,store,query}) {
      // 获取社区信息
      let comtyInfo = await comtyIdValid.getComtyInfo({ redirect, store, query });
      let PAGE_APP_OBJ = {};

      // 检查应用是否开放
      if (!store.state.isInApp) {
        PAGE_APP_OBJ = await commonMixin.methods.SET_PAGE_PERMISSION("7", { route, redirect, store });
      }

      return {
        comtyInfo,
        PAGE_APP_OBJ
      };
    },
    data() {
      return {
        articleList: [],
        loading: false,
        isReachEnd: false,
        currentPage: 0,
        pageCount: 2,
        pageSize: 10,
      };
    },
    mounted() {
      this.getArticle();
    },
    methods: {
      reloadList() {
        this.articleList = [];
        this.currentPage = 0;
        this.pageCount = 2;
        this.getArticle();
      },
      getArticle() {
        if (this.loading) return;
        this.loading = true;

        let params = {
          type: "",
          page: this.currentPage + 1,
          size: this.pageSize,
          userId: this.VX_is_login ? this.VX_userInfo.id : "",
          isComty: "1"
        };

        // app内嵌页查全部社区、非app查当前
        /*if (!this.VX_isInApp) {
          params.isComty = "1";// 查当前社区
        }*/

        articleService.findVideoForApp(params)
          .then((res) => {
            if (res.status == 200 && res.data) {
              this.articleList = this.articleList.concat(res.data);
              this.currentPage = this.currentPage + 1;
              this.pageCount = Math.ceil(res.total / this.pageSize);
              this.isReachEnd = this.currentPage + 1 > this.pageCount;
            }
          })
          .finally(() => {
            this.loading = false;
          });
      },
    },
    head() {
      return {
        title: `${ this.PAGE_APP_OBJ.label }_${this.comtyInfo.comtyName}`
      };
    }
  };

</script>

<style lang="less" scoped>
  @import "~assets/css/config.less";

  .blank40 {
    height: 40px;
  }

  .video-ul {
    li {
      border-bottom: 1px solid #EFEFEF;
      &:last-child {
        border-bottom: none;
      }
      a {
        .flex-center;
        justify-content: normal;
        align-items: normal;
        padding: @p13 0;
        &.reverse {
          flex-direction: row-reverse;
        }
        .img {
          position: relative;
          flex: none;
          margin-right: @p13;
          width: 160px;
          height: 90px;
          border-radius: @br;
          overflow: hidden;
          img {
            display: block;
            width: 100%;
            height: 100%;
            background: @moduleBg;
          }
          .comty {
            position: absolute;
            left: 3px;
            right: 3px;
            bottom: 3px;
            display: flex;
            margin-top: 5px;
            .name {
              .text-overFlow(1);
              padding: 2px 5px;
              padding-left: 22px;
              background: url(~assets/images/box_icon_bbs@2x.png) no-repeat left rgba(255,255,255,0.9);
              background-position: 5px 50%;
              background-size: 12px;
              border-radius:2px;
              line-height: normal;
              color: @activeC;
              font-size: 12px;
            }
          }
        }
        .content {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          flex: 1;
          min-height: 60px;
          h3 {
            .text-overFlow(2);
            color: @color3;
            font-size: @h4;
            font-weight: bold;
            line-height: normal;
          }
          .msg {
            margin-top: 5px;
            color: @color9;
            font-size: 12px;

            .info {
              .icon {
                padding-left: 18px;
                font-size: 12px;
                line-height: 17px;
                & + .icon {
                  margin-left: 10px;
                }
                &.msg {
                  background: url(~assets/images/icon_comment@2x.png) no-repeat left;
                  background-size: 14px;
                }
                &.good {
                  padding-left: 20px;
                  background: url(~assets/images/icon_good@2x.png) no-repeat left;
                  background-size:  14px;
                }
                &.video {
                  background: url(~assets/images/icon_videos@2x.png) no-repeat left;
                  background-size: 14px;
                }
              }
            }
          }
        }
      }
    }
  }
</style>
