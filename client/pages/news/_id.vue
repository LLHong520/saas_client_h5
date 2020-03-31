<template>
  <section class="container">
    <m-header
      title=""
      :share_on="true"
      :isSuspension="true"
      readMoreLink="/news"
      @shareFn="onShare(false)"
    ></m-header>

    <div class="article_box box_wrapper">
      <!-- 文章标题&&发布时间 -->
      <div class="article_hd">
        <h3 class="tit">{{ articleInfo.title }}</h3>
        <div class="author">
          <div class="img" v-if="articleInfo.pic && articleInfo.pic.url"><img :src="GET_IMG_URL(articleInfo.pic.url,'doc')" alt=""></div>
          <div class="details">
            <h3>{{ articleInfo.publisher }}</h3>
            <p>{{ new Date(articleInfo.createTime).getTime() | dateFormat }}</p>
          </div>
        </div>
        <!--<span v-if="articleInfo.startTime" class="publishtime">
          {{articleInfo.startTime  | dateFormat}}
        </span>-->
      </div>
      <!-- 文章标题&&发布时间 end-->
      <div class="article_cont">
       <richText :richHtml="articleInfo.content" />
      </div>
    </div>
    <m-bottom></m-bottom>

    <!-- 分享 -->
    <m-share :show.sync="isShare" :config="shareConfig"></m-share>
  </section>
</template>

<script>
  import { commonMixin, comtyIdValid } from "~/mixins";
  import homeService from "~/services/homeService.js";
  import header from "~/components/header.vue";
  import richText from "~/components/rich_text.vue";
  import bottom from "~/components/bottom.vue";
  import share from "~/components/iwen/share.vue";

  export default {
    mixins: [commonMixin, comtyIdValid],
    components: {
      mHeader: header,
      richText: richText,
      mBottom: bottom,
      mShare: share,
    },
    async asyncData({ route, redirect, store, query  }) {
      // 获取社区信息
      let comtyInfo = await comtyIdValid.getComtyInfo({ redirect, store, query });

      // 检查应用是否开放
      let type = route.query.type == 10 ? "5" : "6"; // 10 健康知识, 11 资讯公告
      let PAGE_APP_OBJ = await commonMixin.methods.SET_PAGE_PERMISSION(type, { route, redirect, store });

      let articleInfo = await homeService.findHealthInfo({ id: route.params.id })
        .then((res) => {
          if (res.status == 200 && res.data) {
            return res.data;
          } else {
            redirect({
              path:"/notFound",
              query:{
                statusCode:404,
                message:"内容找不到了",
                comtyId: query.comtyId || ""
              }
            });
            return {
              title:"······",
              content:"······",
              createTime: 1577280378853
            };
          }
        }).catch( () => {
          return {
            title:"······",
            content:"······",
            createTime: 1577280378853
          };
        });

      return {
        comtyInfo,
        PAGE_APP_OBJ,
        articleInfo,
        title: articleInfo.title || ""
      };
    },
    data() {
      return {
        isShare: false,
        shareConfig: {},
        pid: 0,
        articleInfo: {},
      };
    },
    created() {
      this.pid = this.$route.params.id;
      this.onShare(true);
    },
    mounted() {
      this.addUserOperationRecord({
        operationType:0,
        objType:0,
        objTitle:this.articleInfo.title
      });
      this.dataPvUvcollect({
        businessType:"news",
        collectType: "cmty_h5_news_read",
        businessId: this.pid
      });
      this.dataCollectVisitor({
        type: this.$route.query.type,
        contentId: this.pid
      });
      // homeService.findHealthInfo({ id: this.$route.params.id })
      //   .then((res) => {
      //     if (res.status == 200 && res.data) {
      //       this.articleInfo = res.data;
      //     } else {
      //       this.articleInfo = {};
      //     }
      //   }).catch( () => {
      //     console.log("error");
      //   });
    },
    methods: {
      onShare(isInit = false) {
        if (!isInit) {
          this.isShare = true;
        }

        let type = this.$route.query.type == 10 ? "health" : "notice"; // 10 健康知识, 11 资讯公告
        let data = this.articleInfo;

        this.shareConfig = {
          id: this.pid,
          type: type,
          title: data.title,
          content: (data.content||"").replace(/<\/?.+?>/g,"").substring(0,100),
          imgUrl: data.cover && data.cover.url ?data.cover.url : ""
        };
      }
    },
    head() {
      return {
        title: this.title,
        meta: [{
          hid: "description",
          name: "description",
          content: `${ this.title }`
        }]
      };
    }
  };

</script>

<style lang="less" scoped>
  @m: 13px;

  .article_box {
    background-color: #fff;
    padding-bottom: 15px;
    min-height: 400px;

    .article_hd {
      padding: 20px 5px 15px;
      .author {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin-top: @m;
        .img {
          img {
            width: 40px;
            height: 40px;
            border-radius: 50%;
          }
        }
        .details {
          flex: 1;
          font-size: 12px;
          color: #999;
          h3 {
            font-size: 14px;
            color: #333;
            span {
              margin-left: 5px;
              font-size: 12px;
              color: #666;
            }
          }
        }
        .img + .details{
          margin-left: @m;
        }
      }
    }

    .tit {
      font-size: 20px;
      color: #2D2D2D;
      line-height: 28px;
    }

    .publishtime {
      font-size: 12px;
      color: #999;
      line-height: 17px;
      margin-top: 8px;
      display: block;
    }

    .article_cont {
      font-size: 16px;
      line-height: 27px;
      padding: 0 0 15px;
      color: #424242;

      /deep/img {
        max-width: 100%;
        margin: 0 auto;
        display: block;
      }
    }
  }

</style>
