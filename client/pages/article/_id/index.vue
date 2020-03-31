<template>
  <section class="container">
    <m-header
      :title="PAGE_APP_OBJ.label + '_文章详情'"
      :share_on="true"
      :isSuspension="true"
      readMoreLink="/article"
      @shareFn="onShare(false)"
    ></m-header>
     <!--<nuxt-link v-if="!isVideo" :to="`${ $route.params.id }/share`" class="testlink">测试：文章分享页</nuxt-link>
    <nuxt-link v-else :to="{ path: `/article/${ $route.params.id }/share`, query: $route.query }" class="testlink">测试：视频分享页</nuxt-link>-->

    <div class="article_box box_wrapper" :class="{ 'isVideo': isVideo }">
      <!-- 视频 -->
      <template v-if="isVideo">
        <div class="video-fixed" :class="{ inApp: isOtherAgent }">
          <no-ssr placeholder="Loading...">
            <video-player
              class="video-player-box"
              ref="videoPlayer"
              :options="playerOptions"
              @ready="setWexinVideo"
            >
            </video-player>
          </no-ssr>
        </div>
        <div class="video-content">
          <h3 :class="{ active: isIntro }">
            <span class="title">{{articleInfo.title}}</span>
            <span class="btn" @click="isIntro = !isIntro">简介</span>
          </h3>
          <div class="content" v-show="isIntro">
            <richText :richHtml="articleInfo.content" />
          </div>
        </div>
      </template>

      <!-- 文章 -->
      <template v-else>
        <div class="article_hd">
          <h3 class="tit">{{articleInfo.title}}</h3>
          <div class="author" v-if="authorInfo">
            <div class="img"><img :src="GET_IMG_URL(authorInfo.headImg,'doc')" alt=""></div>
            <div class="details">
              <h3>
                <span class="name">{{ authorInfo.nick }}</span>
                <span>{{ authorInfo.departName }}</span>
                <span>{{ authorInfo.title }} {{ authorInfo.title && authorInfo.hospitalName ? "|" : ""}}</span>
                <span class="hospital">{{ authorInfo.hospitalName }}</span>
              </h3>
              <p>{{new Date(articleInfo.publish_time).getTime() | dateFormat}}</p>
            </div>
          </div>
        </div>
        <div class="article_cont">
          <richText :richHtml="articleInfo.content" />
        </div>
      </template>

      <!-- 文章标签 -->
      <div class="d-flex-content">
        <div class="article_marks">
        <span v-for="(item,index) in articleInfo.tags" :key="index">{{ item }}</span>
        </div>

        <div class="other">
          <span class="pv">{{ articleInfo.virtualPv || 0 }}</span>
        </div>
      </div>

      <!-- 点赞&&点水 -->
      <div class="prise_box">
        <div class="prise_box_item" :class="{ 'active':ifUsed }">
          <div @click="saveAction('used')" class="favour_icon_wrapper">
            <p><em class="icon icon_favour_off" :class="{ 'icon_favour_on': ifUsed }" ></em></p>
            <p class="helpTotal">{{articleInfo.helpTotal || 0}}</p>
          </div>
          <p class="helpTotal">{{ ifUsed ? "感谢" : "有帮助"}}</p>
        </div>

        <div class="prise_box_item">
          <div @click="$toast.tip('暂未开放此功能')" class="favour_icon_wrapper">
            <p><em class="icon icon_collect_off"></em></p>
          </div>
          <p class="helpTotal">收藏</p>
        </div>
      </div>

      <!-- 医生卡片 -->
      <div v-if="authorInfo" class="author_card">
        <a @click="preventDoctorLink(authorInfo, authorInfo.doctorId)">
          <div class="author_img"><img :src="GET_IMG_URL(authorInfo.headImg,'doc')" alt=""></div>
          <div class="author_info">
            <dl>
              <dt><span class="author_name">{{authorInfo.nick}}</span>&nbsp;&nbsp;{{authorInfo.title}}</dt>
              <dd>{{authorInfo.hospitalName}}&nbsp;&nbsp;{{authorInfo.departName}}</dd>
              <dd class="introduce">{{authorInfo.goodAt}}</dd>
            </dl>
          </div>
        </a>
      </div>
    </div>

    <!-- 广告位 -->
    <div class="box_wrapper ad" v-for="(item, index) in articleListAd" :key="index">
      <a v-if="item.contentType == 'ad'" @click="addVisitor(item, 9)">
        <div class="img_box">
          <img :src="item.imgs[0]" alt="">
          <label>广告</label>
        </div>
      </a>
    </div>

    <!-- 相关文章列表 -->
    <!--<index-article></index-article>-->

    <!-- 相关帖子列表 -->
    <!--<index-post v-if="showPostBar()"></index-post>-->

    <!-- Ta的文章 -->
    <doc-article :id="authorInfo.doctorId"></doc-article>

    <!-- 底部 -->
    <div class="d-bottom">
      <p class="title">本站内容不代表爱问平台观点</p>
      <p class="details">内容不能替代执业医师当面诊断，请谨慎参阅</p>
    </div>

    <!-- 分享 -->
    <m-share :show.sync="isShare" :config="shareConfig"></m-share>
  </section>
</template>

<script>
  import { commonMixin, comtyIdValid, dataCollectMixin } from "~/mixins";
  import header from "~/components/header.vue";
  import bottom from "~/components/bottom.vue";
  import page from "~/components/page.vue";
  import richText from "~/components/rich_text.vue";
  import articleService from "~/services/articleService.js";
  import sysService from "~/services/sysService.js";

  // 模块
  import indexArticle from "./components/index_article.vue";
  import indexPost from "./components/index_post.vue";
  import docArticle from "./components/doc_article.vue";
  import share from "~/components/iwen/share.vue";

  export default {
    mixins: [commonMixin, dataCollectMixin],
    async asyncData({ route, redirect, store, query , error}) {
      // 获取社区信息
      let comtyInfo = await comtyIdValid.getComtyInfo({ redirect, store, query });

      // 检查应用是否开放
      let PAGE_APP_OBJ = await commonMixin.methods.SET_PAGE_PERMISSION("0", { route, redirect, store });

      // 获取文章详情articleInfo、authorInfo、subjectInfo
      let type = route.query.type || "";
      let article = await comtyIdValid.getArticleInfo({ redirect, store, route , error}, type);
      
      return {
        ...article,
        comtyInfo,
        PAGE_APP_OBJ,
      };
    },
    data() {
      return {
        isShare: false,
        shareConfig: {},
        isIntro: false,
        pid: 0,
        autoFocusAuthorWBTimer: null,
        saveActioning: false,
        authorInfo: "",
        articleInfo: {
          title:"--",
          isLinked:0,
          isUnLinked:0,
        },
        subjectInfo: [],
        ad: [],
        ifUsed: 0,
        // ifUnused: 0,
        dataCollectId: "",
        swiperOption: {
          observer:true,
          observeParents:true,
          loop: true,
          autoHeight: true,
          autoplay: {
            delay: 20000,
            stopOnLastSlide: false,
            disableOnInteraction: true
          },
          initialSlide: 0,
          spaceBetween: 0,
          pagination: {
            el: ".swiper-pagination"
          },
        },
        playerOptions: {
          playbackRates: [0.7, 1.0, 1.5, 2.0],
          sources: {
            type: "video/mp4",
            src: ""
          },
          poster: "", // 封面图
        }
      };
    },
    components: {
      mHeader: header,
      mBottom: bottom,
      mPage: page,
      mShare: share,
      richText:richText,
      indexArticle,
      indexPost,
      docArticle
    },
    computed: {
      isVideo() {
        return this.$route.query.type == "video";
      },
      isOtherAgent() {
        if (this.$platformInfo) {
          let os = this.$platformInfo.os;
          return os.isWx || os.isWeibo || os.isMp;
        } else {
          return false;
        }
      },
      articleListAd() {
        let result = [];
        let ad = this.ad.filter( item => { return item.pagePosition == 2; });

        if (ad.length != 0) {
          result.push(ad[0]);
        }

        return result;
      },
    },
    async created() {
      this.pid = this.$route.params.id;
      this.playerOptions.sources.src = this.articleInfo.videoUrl;
      this.playerOptions.poster = this.articleInfo.coverimg;
      this.dataCollectId = this.articleInfo.dataId || "";

      this.getAd();
      await this.getUsed();

      this.onShare(true);
    },
    beforeMount() {
      // 未登录时点赞，登录完调点赞接口
      this.checkSaveAction();
    },
    mounted() {
      // 打点
      this.dataCollectInit();
      this.addUserOperationRecord({
        operationType:0,
        objType:0,
        objTitle:this.articleInfo.title
      });
      //看文章15s就自动关注作者微博
      if(this.VX_is_login){
        this.countAutoFocusAuthorWB();
      }
    },
    destroyed(){
      window.clearTimeout(this.autoFocusAuthorWBTimer);
    },
    methods: {
      checkSaveAction() {
        // 未登录时点赞，登录完调点赞接口
        let isSaveAction = this.$storage.get("isSaveAction");
        if (isSaveAction && isSaveAction == this.pid) {
          this.saveAction();
        }
        this.$storage.remove("isSaveAction");
      },
      async getUsed() {
        // 获取点赞
        if (this.VX_is_login) {
          this.ifUsed = await this._getOperate({ contentId: this.dataCollectId, contentType: "2" });
        }
      },
      dataCollectInit() {
        this.dataPvUvcollect({
          businessType:"article",
          collectType:"cmty_h5_art_read",
          businessId:this.pid
        });
        this.dataCollectVisitor({
          type: "2",
          contentId:this.pid
        });
        this._dataCollect({
          contentId: this.dataCollectId,
          contentType: "2",
          operationType: "0",
          authorId: this.authorInfo.doctorId,
          contentCreateTime: this.articleInfo.createTime,
          title: this.articleInfo.title,
        });
      },
      getAd() {
        articleService.getAdvertiseMent().then(((res) => {
          if (res.status == 200) {
            let data = res.data || [];
            this.ad = data.map( item => {
              item.contentType = "ad";
              return item;
            }); // 用于区分文章、视频、广告
          }
        }));
      },
      addVisitor(item, type) {
        // 广告打点
        let params = {
          contentId: this.pid,
          type: type,
        };

        this.dataCollectVisitor(params);
        // articleService.addVisitor(params);

        if (item.url) {
          setTimeout( () => {
            window.location.href = item.url;
          }, 500);
        }
      },
      // 设置腾讯X5内核全屏问题
      setWexinVideo() {
        this.$nextTick( () => {
          if (this.isVideo) {
            let player = this.$refs.videoPlayer;
            let video = player.$refs.video;

            video.setAttribute("x-webkit-airplay", true);
            video.setAttribute("x5-playsinline", true);
            video.setAttribute("webkit-playsinline", true);
            video.setAttribute("playsinline", true);
            video.style.objectFit = "fill";
          }
        });
      },
      //自动关注作者微博
      autoFocusAuthorWBHandler() {
        sysService.weiboAddFocus({
          token:this.VX_token,
          userId:this.VX_userInfo.id,
          doctorId:this.authorInfo.doctorId,
        });
      },
      countAutoFocusAuthorWB() {
        this.autoFocusAuthorWBTimer = window.setTimeout(this.autoFocusAuthorWBHandler,15000);
      },
      ctxDataCollect(type) {
        // 点赞打点
        this.dataPvUvcollect({
          businessType:"article",
          collectType:"cmty_h5_art_help",
          businessId:this.pid,
          userId:this.VX_userInfo.id,
        });

        this._dataCollect({
          contentId: this.dataCollectId,
          contentType: "2",
          operationType: "2",
          authorId: this.authorInfo.doctorId,
          contentCreateTime: this.articleInfo.createTime,
          title: this.articleInfo.title,
        });
      },
      saveAction(act) {
        // 检查登录
        if (!this.CHECK_LOGIN()) {
          this.$storage.set("isSaveAction", this.pid);// 未登录时点赞，登录完调点赞接口
          return;
        }

        if(this.saveActioning) { return; }// 提交中

        if(this.ifUsed) { return; }//已点赞

        this.saveActioning = true;

        let params = {
          type: 0,
          reference: "20001",
          id: this.pid,
          userId: this.VX_userInfo.id,
        };

        articleService.saveAction(params)
          .then( res => {
            if (res.status == 200) {
              this.ifUsed = true;
              this.articleInfo.helpTotal += 1;
            } else {
              this.$toast.tip(res.message);
            }
          })
          .finally( () => {
            this.saveActioning = false;
          });

        // 添加打点
        this.ctxDataCollect("add");
      },
      onShare(isInit = false) {
        if (!isInit) {
          this.isShare = true;
        }

        let path = "";
        let articleId = this.$route.params.id;

        if (!this.isVideo) {
          path = `/article/${ articleId }/share?comtyId=${ this.VX_comtyId }`;
        } else {
          let { sourceType, authorId } = this.$route.query;
          path = `/article/${ articleId }/share?type=video&sourceType=${ sourceType }&authorId=${ authorId }&comtyId=${ this.VX_comtyId }`;
        }

        this.shareConfig = {
          id: this.dataCollectId,
          type: "article",
          title: this.articleInfo.title,
          content: this.articleInfo.content.replace(/<\/?.+?>/g,"").substring(0,100),
          path: path,
          imgUrl: this.articleInfo.coverimg
        };
      }
    },
    head() {
      return {
        title: `${this.articleInfo.title}_${this.authorInfo.nick}_${this.comtyInfo.comtyName}`,
        meta: [
          {
            name: "keywords",
            content: this.articleInfo.articleTags.join(",") + "," + this.authorInfo.nick
          },
          {
            hid: "description",
            name: "description",
            content: this.articleInfo.content.replace(/<\/?.+?>/g,"").substring(0,100)
          }
        ],
      };
    }
  };

</script>

<style lang="less" scoped>
  @import "~/assets/css/list.css";

  @m: 13px;
  @p: 13px;
  @br: 4px;
  @activeC: #2688FC;
  @videoHeight: 210px;

  .text-overFlow(@n: 2) {
    display: -webkit-box;
    /* autoprefixer: ignore next */
    -webkit-box-orient: vertical;
    -webkit-line-clamp: @n;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .box_wrapper {
    &.ad {
      position: relative;
      margin: @m 0;
      padding: @p;
      background-color: #fff;
      overflow: hidden;
      padding: 0;
      a {
        position: relative;
        display: block;
        img {
          width: 100%;
          height: 125px;
        }
        .img_box {
          label {
            position: absolute;
            bottom: 5px;
            right: 5px;
            padding: 0 8px;
            color: rgba(255, 255, 255, 1);
            border: 1px solid rgba(255, 255, 255, 1);
            border-radius: 4px;
            font-size: 10px;
            -webkit-transform: scale(0.8);
            -webkit-transform-origin-x: 0;
            z-index: 2;
          }
        }
      }
    }
    .articleList li a {
      padding: @p 0;
    }
  }

  .testlink {
    position: fixed;
    top: 10px;
    right: 50px;
    z-index: 999;
    color: #ff0000;
  }

  .isVideo {
    padding-top: @videoHeight;
  }

  .video-fixed {
    position: fixed;
    top: 44px;
    left: 0;
    right: 0;
    margin: 0 auto;
    max-width: 760px;
    height: @videoHeight;
    background: #000;
    z-index: 10;

    &.inApp {
      top: 0;
    }

    .video-player-box {
      height: 100%;
      height: 100%;
    }

    /deep/ .video-js {
      width: 100%;
      height: 100%;
    }

    /deep/.vjs-big-play-button {
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      border: none;
      width: 50px;
      height: 50px;
      background: url(../../../assets/images/common_btn_play_big@2x.png) no-repeat;
      background-size: 100%;
      span {
        display: none;
      }
    }
  }

  .video-content {
    padding: @p 0 ;
    color: #2D2D2D;
    h3 {
      display: flex;
      justify-content: space-around;
      align-items: center;
      .title {
        .text-overFlow(1);
        font-size: 16px;
        flex: 1;
      }
      .btn {
        padding: 0 15px 0 10px;
        font-size: 12px;
        background:  url(../../../assets/images/btn_down@2x.png) no-repeat right;
        background-size: auto 50%;
      }
      &.active {
        .title {
          .text-overFlow(2);
        }
        .btn {
          background:  url(../../../assets/images/btn_up@2x.png) no-repeat right;
          background-size: auto 50%;
        }
      }
    }
    .content {
      margin-top: @p;
      font-size: 13px;
      color: #999;
      transition: all .3s;
    }
  }

  .article_box {
    background-color: #fff;
    padding-bottom: 15px;
    min-height: 100px;

    .article_hd {
      padding: 15px 0;
      .author {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin-top: @m;
        .img {
          flex: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .details {
          flex: 1;
          font-size: 12px;
          color: #999;
          h3 {
            .text-overFlow(1);
            font-size: 14px;
            color: #999;
            span {
              margin-left: 5px;
              font-size: 12px;
              color: #666;
            }
            .name {
              margin-left: 0;
              color: #286EC2;
              font-size: 14px;
            }
            .hospital {
              margin-left: 0;
              color: #999;
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

  .article_marks {
    padding-top: 5px;
  }

  .article_marks span {
    display: inline-block;
    padding: 0 8px;
    border: 1px solid #EFF2F7;
    border-radius: 24px;
    margin-right: 10px;
    line-height: 24px;
    background-color: #F6F8FB;
    white-space: nowrap;
    font-size: 12px;
    color: #999;
  }

  .author_card {
    background-color: #F6F8FB;
    border-radius: 3px;
    border: 1px solid #EFF2F7;

    a {
      position: relative;
      padding: 12px;
      display: flex;
      .label {
        position: absolute;
        top: 10px;
        right: 0;
        padding: 2px 8px;
        font-size: 12px;
        color: @activeC;
        border: 1px solid @activeC;
        border-radius: @br;
        line-height: normal;
        -webkit-transform: scale(.8);
        -webkit-transform-origin-x: 0;
      }
    }

    .author_img {
      width: 48px;
      height: 48px;
      margin-right: 12px;
    }

    .author_img img {
      display: block;
      width: 48px;
      height: 48px;
      border-radius: 48px;
      box-sizing: border-box;
      border: 3px solid #fff;
    }

    .author_info {
      flex: 1;
      box-flex: 1;
      line-height: 24px;
      color: #999;
      font-size: 12px;
    }

    .author_info dt {
      color: #282828;
      & + dd {
        margin-top: 5px;
      }
    }

    .author_info dd{
      color: #666;
      line-height: normal;
      &.introduce {
        .text-overFlow(1);
        padding-left: 20px;
        color: #999;
        background: url(../../../assets/images/icon_speciality@2x.png) no-repeat left;
        background-size: 14px;
        background-position: 0 50%;

      }
      & + dd {
        margin-top: 5px;
      }
    }

    .author_name {
      font-size: 16px;
      font-weight: bold;
    }
  }

  .prise_box {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    padding: 35px 0;
    .prise_box_item {
      text-align: center;
      font-size: 12px;
      &.active{
        color:#999;
      }
    }
    h3 {
      font-size: 16px;
      line-height: 20px;
    }
    p {
      padding-top: 10px;
    }
    span {
      display: inline-block;
      box-sizing: border-box;
      width: 125px;
      height: 37px;
      line-height: 35px;
      border: 1px solid #D6D6D6;
      border-radius: 37px;
      text-align: center;
      font-size: 14px;
      margin: 0 8px;
    }
    .favour_icon_wrapper{
      position:relative;
      border:1px solid rgba(239,239,239,1);
      width:70px;
      height:70px;
      margin:0 auto;
      color:#999;
      border-radius:50%;
      p{
        width:70px;
        margin:0 auto;
        padding:0px;
      }
      p.helpTotal{
        padding:0;
        bottom:2px;
        position:absolute;
      }
    }
    .icon {
      margin:11px 14px;
      display: inline-block;
      width: 42px;
      height: 42px;
    }
    .icon_favour_off{
      background: url(../imgs/btn_favour_big@2x.png) no-repeat;
      background-size: cover;
    }
    .icon_favour_on{
      background: url(../imgs/btn_favour_big_pre@2x.png) no-repeat;
      background-size: cover;
    }
    .icon_collect_off {
      background: url(../imgs/btn_collect_big@2x.png) no-repeat;
      background-size: cover;
    }
    .icon_collect_on {
      background: url(../imgs/btn_collect_big_pre@2x.png) no-repeat;
      background-size: cover;
    }

    .icon_used,
    .icon_unused {
      display: inline-block;
      width: 23px;
      height: 23px;
      background: url(../../../assets/images/icon_helpful@2x.png) no-repeat;
      background-size: cover;
      position: relative;
      vertical-align: middle;
      margin-right: 10px;
      top: -2px;
    }
    .icon_unused {
      background-image: url(../../../assets/images/icon_helpless@2x.png);
    }
    .active {
      .icon_used {
        background-image: url(../../../assets/images/icon_helpful_pre@2x.png);
      }
      .icon_unused {
        background-image: url(../../../assets/images/icon_helpless_pre@2x.png);
      }
    }
  }

  .subject_list_mark {
    position: relative;
    display:inline-block;
    padding:0 5px;
    z-index:111;
    background: #282828;
    color: #fff;
    font-size: 11px;
    line-height: 20px;
    border-radius: 3px;
    left: 10px;
    top: 10px;
  }

  .subject_list {
    position: relative;
    border: 1px solid #EFEFEF;
    border-radius: 6px;

    li {
      display: flex;
      padding: 12px 12px;
      border-bottom: 1px solid #EFEFEF;
    }

    li:last-child {
      border-bottom: 0;
    }

    .img_box {
      width: 119px;
      height: 68px;
      margin-left: 16px;
    }

    .img_box img {
      display: block;
      width: 119px;
      height: 68px;
      border-radius: 4px;
    }

    .info {
      font-size: 13px;
      padding: 5px 0px;
      line-height: 18px;
      color: #282828;
      flex:1;
    }
  }

  //收录专题轮播
  .swiper-pagination{
    text-align: center;
    padding-right: 15px;
    bottom:0px;
    /deep/.swiper-pagination-bullet{
      width: 9px;
      height: 2px;
      background-color: rgba(0,0,0,.5);
      border-radius: 0;
      margin: 0 0 0 4px;
    }
    /deep/.swiper-pagination-bullet-active{
      background-color: #8c8989;
    }
  }

  .d-flex-content {
    display: flex;
    justify-content: space-between;
    .article_marks {

    }
    .other {
      padding-top: 5px;
      span {
        display: inline-block;
        font-size: 12px;
        line-height: 26px;
        color: #999;
      }
      .pv {
        padding-left: 20px;
        background: url(../../../assets/images/icon_view@2x.png) no-repeat left;
        background-size: 16px 14px;
      }
    }
  }

  .d-bottom {
    margin: 50px 0 100px;
    font-size: 12px;
    color: #AFAFAF;
    text-align: center;
    .details {
      color: #CFCFCF;
    }
  }
</style>
