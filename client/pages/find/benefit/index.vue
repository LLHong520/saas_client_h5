<template>
  <section class="container">
    <m-header :title="PAGE_APP_OBJ.label" ></m-header>
    <div class="box_wrapper">
      <ul class="articleList benefit">
        <li v-for="(item, index) in dataList" :key="index">
          <nuxt-link to="/">
            <div class="info">
              <h3>{{ item.title }}</h3>
              <div class="img">
                <img :src="GET_IMG_URL(item.coverUrl, 'news')" alt="">
                <label :class="{ over: index == 1 }">{{ index == 1 ? "已结束" : "火热进行中" }}</label>
                <div class="tips">
                  <span>活动时间：{{ item.publishTime | dateFormat("YMD")}}</span>
                  <span class="num">10086</span>
                </div>
              </div>
            </div>
          </nuxt-link>
        </li>

        <!--<li v-for="(item,index) in dataList" :key="index">
          <nuxt-link :to="{path:'/news/'+item.id}">
            <div class="info">
              <dl>
                <dt>{{item.title}}</dt>
                <dd class="author_bar">{{item.publishTime | dateFormat("YMD")}}</dd>
              </dl>
            </div>
            <div v-if="item.coverUrl!=''" class="img_box"><img :src="GET_IMG_URL(item.coverUrl, 'news')" alt=""></div>
          </nuxt-link>
        </li>-->
      </ul>
      <m-page :loading="loading" :title="loading? '加载中...':'加载更多'" @loadFn="getNewsAndNotices" v-if="!isReachEnd"></m-page>
    </div>
    <m-bottom v-if="isReachEnd&&dataList.length>0"></m-bottom>
    <!-- 内容为空 -->
    <empty v-if="!loading&&dataList.length==0" :isFullScreen="true"></empty>
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
  import sysServices from "~/services/sysService";
  import empty from "~/components/empty.vue";

  export default {
    mixins: [commonMixin, comtyIdValid],
    components: {
      mHeader: header,
      mBottom: bottom,
      mPage: page,
      empty: empty,
    },
    async asyncData({route, store, redirect, query}){
      // 检查应用是否开放
      let PAGE_APP_OBJ = await commonMixin.methods.SET_PAGE_PERMISSION("15", { route, redirect, store });

      return {
        PAGE_APP_OBJ,
      };
    },
    data() {
      return {
        dataList: [],
        loading: false,
        currentPage: 0,
        isReachEnd: false,
        pageCount: 2,
        pageSize: 10,
      };
    },
    mounted() {
      this.getNewsAndNotices();
      this.dataPvUvcollect({
        businessType:"news",
        collectType: "cmty_h5_news_index",
        businessId: this.VX_comtyId
      });
    },
    methods: {
      getNewsAndNotices() {
        if (this.loading) return;
        this.loading = true;
      
        let data = {
          page: this.currentPage + 1,
          size: this.pageSize,
        };
        
        sysServices.getNewsAndNotices(data)
          .then((res) => {
            this.loading = false;
            if (res.status == 200 && res.data) {
              this.dataList = this.dataList.concat(res.data);
              this.currentPage = this.currentPage + 1;
              this.pageCount = Math.ceil(res.total / this.pageSize);
              if (this.currentPage + 1 > this.pageCount) {
                this.isReachEnd = true;
              } else {
                this.isReachEnd = false;
              }
            } else {
              this.isReachEnd = true;
            }
          }).catch(() => {
            this.loading = false;
          });
      }
    },
    head() {
      return {
        title: this.PAGE_APP_OBJ.label || "公益咨询",
      };
    }
  };

</script>

<style lang="less" scoped>
  @import "~/assets/css/list.css";
  @m: 10px;
  @p: 10px;
  @color: #2D2D2D;
  @br: 4px;
  @imgHeight: 140px;

  .text-overFlow(@n: 2) {
    display: -webkit-box;
    /* autoprefixer: ignore next */
    -webkit-box-orient: vertical;
    -webkit-line-clamp: @n;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .benefit {
    li {
      a {
        color: @color;
        .info {
          h3 {
            .text-overFlow;
            margin-bottom: @m;
            font-size: 16px;
          }
          .img {
            position: relative;
            height: @imgHeight;
            border-radius: @br;
            overflow: hidden;
            img {
              width: 100%;
              height: 100%;
            }
            label {
              position: absolute;
              top: @m;
              right: @m/2;
              padding: 2px 6px;
              font-size: 12px;
              color: #fff;
              background: #2688FC;
              border-radius: 2px;
              transform:scale(.8);
              &.over {
                background: #000000;
              }
            }
            .tips {
              position: absolute;
              left: 0;
              right: 0;
              bottom: 0;
              z-index: 2;
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: @p/2 @p;
              font-size: 12px;
              color: #fff;
              background: rgba(0, 0, 0, .4);
              .num {
                padding-left: 20px;
                background: url(../../../assets/images/icon_crowd_w@2x.png) no-repeat;
                background-size: 15px;
                background-position: 0 50%;
              }
            }
          }
        }
      }
    }
  }
</style>
