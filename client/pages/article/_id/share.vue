<template>
  <section class="container">
    <m-header :title="PAGE_APP_OBJ.label + '_科普文章'"></m-header>
    <div class="article_box box_wrapper" :class="{ 'over-height': isHidden, 'isVideo': isVideo }">
      <!-- 视频 -->
      <template v-if="isVideo">
        <div class="video-fixed">
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
          <h3>
            <span class="title">{{articleInfo.title}}</span>
          </h3>
          <div class="content">
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
        <div class="article_cont" >
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
            <p><em class="icon icon_favour_off" :class="{'icon_favour_on': ifUsed }" ></em></p>
            <p class="helpTotal">{{ articleInfo.helpTotal || 0 }}</p>
          </div>
          <p class="helpTotal">{{ ifUsed ? "感谢" : "有帮助" }}</p>
        </div>

        <div class="prise_box_item">
          <div @click="$toast.tip('暂未开放此功能')" class="favour_icon_wrapper">
            <p><em class="icon icon_collect_off" ></em></p>
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
          <label v-if="!isVideo" class="label">图文咨询</label>
        </a>
      </div>

      <!-- 展开 -->
      <div class="other">
        <div class="linear-gradient"></div>
        <i class="more" @click="openDetails"></i>
        <a v-if="articleAd" @click="addVisitor(articleAd, 8)">{{ articleAd.describe }}</a>
      </div>
    </div>

    <!-- 水平线 -->
    <div class="horizontal" v-if="articleListAd.length > 0">
      <span>大家都在看</span>
    </div>

    <!-- 广告位 -->
    <!--<div class="box_wrapper ad" v-for="(item, index) in articleListAd">
      <a v-if="item.contentType == 'ad'" @click="addVisitor(item, 9)">
        <div class="img_box">
          <img :src="item.imgs[0]" alt="">
          <label>广告</label>
        </div>
      </a>
    </div>-->

    <!-- 相关文章列表 -->
    <div class="box_wrapper recommend">
      <ul class="articleList">
        <li v-for="(item,index) in articleListAd" :key="index" :class="{ad: item.contentType == 'ad'}">
          <!-- 广告 -->
          <a v-if="item.contentType == 'ad'" @click="addVisitor(item, 9)">
            <div class="img_box">
              <img :src="item.imgs[0]" alt="">
              <label>广告</label>
            </div>
          </a>

          <!-- 视频 -->
          <nuxt-link
            class="video"
            v-else-if="item.url"
            :to="{
               path: '/article/'+item.id,
               query: {
                 type: 'video',
                 sourceType: item.sourceType,
                 authorId: item.authorId
               }
             }"
          >
            <div class="info_wrap">
              <div class="img icon">
                <div class="title">{{ item.title }}</div>
                <!--<video width="100%" height="240">
                  <source :src="item.url"  type="video/mp4">
                </video>-->
                <img :src="item.cover" alt="">
              </div>
              <div class="author_bar">
                <span class="face"><img :src="GET_IMG_URL(item.headImg,'u')" alt=""></span>
                <span class="author_name">{{ item.authorName }}</span>
                <span class="helpNum">{{ item.helpNum || 0 }}</span>
              </div>
            </div>
          </nuxt-link>

          <!-- 文章 -->
          <nuxt-link :to="{path:'/article/'+item.id}" v-else>
            <div class="info">
              <dl>
                <dt>
                  <h3>{{item.title}}</h3>
                  <p>{{item.content}}</p>
                </dt>
                <dd class="author_bar">
                  <span class="face"><img :src="GET_IMG_URL(item.headPicUrl,'u')" alt=""></span>
                  <span class="author_name">{{item.authorName||"作者名字"}}</span>
                  <span class="helpNum">{{item.helpNum}}</span>
                  <span class="pv">{{ item.rv | rvFilter }}</span>
                </dd>
              </dl>
            </div>
            <div v-if="item.cover" class="img_box"><img :src="GET_IMG_URL(item.cover,'article')" alt=""></div>
          </nuxt-link>
        </li>
      </ul>
    </div>

    <!-- 视频 -->
    <!--<div class="box_wrapper video-list">
      <ul class="articleList">
        <li >
          <nuxt-link to="/abc">
            <div class="info">
              <dl>
                <dt>
                  <div class="title">视频 - 标题标题标题标题标题标题标题标标题标题标题标题标题标题标题标标题标题标题标题标题标题标题标</div>
                  <div class="img icon"><img src="https://wenwo-img-bucket-test.oss-cn-beijing.aliyuncs.com/79430d5970510b6a96eed2feeb9223cc" alt=""></div>
                </dt>
                <dd class="author_bar">
                  <span class="face"><img src="https://wenwo-img-bucket-test.oss-cn-beijing.aliyuncs.com/79430d5970510b6a96eed2feeb9223cc" alt=""></span>
                  <span class="author_name">作者名字</span>
                  <span class="helpNum">10086</span>
                </dd>
              </dl>
            </div>
          </nuxt-link>
        </li>
      </ul>
    </div>-->

    <!-- 进入社区 -->
    <!--<div class="box_wrapper instro">
      <img :src="comtyInfo.comtyLogo" alt="">
      <div>
        <h3>{{ comtyInfo.comtyName || "社区名称" }}</h3>
        <p>{{ comtyInfo.introduction }}</p>
        <nuxt-link to="/">进入社区</nuxt-link>
      </div>
    </div>-->

    <div class="d-suspension">
      <nuxt-link to="/" class="home"></nuxt-link>
      <a href="javascript:;" @click="openApp">
        <span>打开</span>
        <span>APP</span>
      </a>
    </div>

    <div class="d-bottom">
      <p class="title">本站内容不代表爱问平台观点</p>
      <p class="details">内容不能替代执业医师当面诊断，请谨慎参阅</p>
    </div>
  </section>
</template>

<script>
  import { commonMixin, comtyIdValid, dataCollectMixin } from "~/mixins";
  import header from "~/components/header.vue";
  import bottom from "~/components/bottom.vue";
  import page from "~/components/page.vue";
  import richText from "~/components/rich_text.vue";
  import articleService from "~/services/articleService.js";

  export default {
    mixins: [commonMixin, dataCollectMixin],
    async asyncData({ route, redirect, store, query}) {
      // 获取社区信息
      let comtyInfo = await comtyIdValid.getComtyInfo({ redirect, store, query });

      // 检查应用是否开放
      let PAGE_APP_OBJ = await commonMixin.methods.SET_PAGE_PERMISSION("0", { route, redirect, store });

      // 获取文章详情articleInfo、authorInfo、subjectInfo
      let type = route.query.type || "";
      let article = await comtyIdValid.getArticleInfo({ redirect, store, route }, type);

      return {
        ...article,
        comtyInfo,
        PAGE_APP_OBJ
      };
    },
    data() {
      return {
        pid: 0,
        saveActioning: false,
        authorInfo: "",
        articleInfo: {
          title:"--",
          isLinked:0,
          isUnLinked:0,
        },
        ifUsed: 0,
        ifUnused: 0,
        comtyInfo: "",
        isHidden: true,
        articleList: [],
        video: [],
        ad: [],
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
      richText:richText
    },
    computed: {
      isVideo() {
        return this.$route.query.type == "video";
      },
      articleAd() {
        if (this.ad.length == 0) { return; }

        let result = this.ad.filter( item => { return item.pagePosition == 1; });

        if (result.length > 0) {
          return result[0];
        } else {
          return;
        }
      },
      articleListAd() {
        let result = this.articleList;
        let ad = this.ad.filter( item => { return item.pagePosition == 2; });

        if (ad.length != 0) {
          result.splice(1, 0, ad[0]);
        }

        return result;
      },
      /*videoListAd() {
        return this.ad.filter( item => { return item.pagePosition == 3; });
      }*/
    },
    async created() {
      this.playerOptions.sources.src = this.articleInfo.videoUrl;
      this.playerOptions.poster = this.articleInfo.coverimg;
      this.dataCollectId = this.articleInfo.dataId || "";

      this.getArticleList();
      this.getAd();
      await this.getUsed();
    },
    mounted() {
      this.pid = this.$route.params.id;
      // this.ifUsed = this.articleInfo.isLinked>0?1:0;
      // this.ifUnused = this.articleInfo.isUnLiked||0;

      // 打点
      this.dataCollectInit();

      if(this.VX_is_login){
        this.addFocusForLanV();
      }
    },
    methods: {
      openApp() {
        if (window.iwenJSNativeBridge) {
          iwenJSNativeBridge.openApp();
        } else {
          window.location.href = "https://health.sina.cn/zt/app/down";
        }
      },
      async getUsed() {
        // 获取点赞
        if (this.VX_is_login) {
          this.ifUsed = await this._getOperate({ contentId: this.dataCollectId, contentType: "2" });
        }
      },
      dataCollectInit() {
        this.dataPvUvcollect({
          token:this.VX_token,
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
      addFocusForLanV() {
        // 关注蓝V微博
        articleService.addFocusForLanV({ userId: this.$store.state.userInfo.id,type:"article" });
      },
      ctxDataCollect(type) {
        // 添加点赞打点
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
        if (!this.CHECK_LOGIN()) { return; }// 检查登录

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

        // 添加点赞打点
        this.ctxDataCollect("add");
      },
      openDetails() {
        this.isHidden = !this.isHidden;
      },
      getArticleList() {
        articleService.getArticleList().then(((res) => {
          if (res.status == 200) {
            this.articleList = this.getContent(res.data);
          }
        }));
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
      getContent(arr) {
        // 获取富文本内容、图片
        if (!arr || arr.length == 0) { return []; }

        let ctxReq = /<\/?.+?>/g;

        return arr.map( item => {
          if (item.content) {
            item.content = item.content.replace(ctxReq, "");
          }
          return item;
        });
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
        script: [
          {
            src: "https://health.sina.cn/static/js/iwenJSNativeBridge.js"
          },
        ]
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

  .container {
    background: #F2F5F8;
  }

  @keyframes animation-more {
    0% {
      transform: translate(0px, 0px);
    }
    50% {
      transform: translate(0px, -10px);
    }
    100% {
      transform: translate(0px, 0px);
    }
  }

  .text-overFlow(@n: 2) {
    display: -webkit-box;
    /* autoprefixer: ignore next */
    -webkit-box-orient: vertical;
    -webkit-line-clamp: @n;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .box_wrapper {
    position: relative;
    margin: @m;
    padding: @p;
    background-color: #fff;
    overflow: hidden;
    border-radius: @br;
    &.ad {
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

  .over-height {
    position: relative;
    height: 400px;
    overflow: hidden;
    .other {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      padding: @p;
      background: #fff;
      .linear-gradient {
        display: block!important;
        position: absolute;
        top: -50px;
        left: 0;
        right: 0;
        width: 100%;
        height: 50px;
        background: linear-gradient(180deg,rgba(255,255,255,0) 0%,rgba(255,255,255,1) 100%);
      }
      .more {
        display: block!important;
      }
      .more + a {
        margin-top: 15px;
      }
    }
  }

  .instro {
    display: flex;
    margin: @m 0;
    padding: @p;
    background: url(../../../assets/images/box_bg_bbs@2x.png) no-repeat #fff;
    background-position: 100% 0;
    background-size: 35%;
    img {
      width: 50px;
      height: 50px;
      border-radius: @br;
    }
    div {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding-left: 10px;
      padding-right: 80px;
      width: 100%;
      h3 {
        .text-overFlow(1);
        font-size: 14px;
      }
      p {
        .text-overFlow(1);
        margin-top: 5px;
        font-size: 12px;
        color: #666;
      }
      a {
        position: absolute;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
        padding: 3px 10px;
        color: #fff;
        background: @activeC;
        border-radius: @br;
        font-size: 12px;
        line-height: normal;
      }
    }
  }

  .horizontal {
    position: relative;
    margin: 26px 13px;
    border-bottom: 1px solid #D6D6D6;
    span {
      position: absolute;
      top: -10px;
      left: 50%;
      -webkit-transform: translateX(-50%);
      transform: translateX(-50%);
      padding: 0 10px;
      background: #f2f5f8;
      color: #C2C2C2;
    }
  }

  .recommend {
    padding: 0;
    background: none;
    .articleList {
      li {
        border: none;
        &.ad {
          a {
            padding: 0;
          }
          .img_box {
            position: relative;
            margin-left: 0;
            width: 100%;
            height: auto;
            img {
              width: 100%;
              height: 110px;
            }
            label {
              position: absolute;
              bottom: 5px;
              right: 5px;
              padding: 0 8px;
              color: rgba(255, 255, 255, .5);
              border: 1px solid rgba(255, 255, 255, .5);
              border-radius: @br;
              font-size: 10px;
              -webkit-transform:scale(.8);
              -webkit-transform-origin-x: 0;
              z-index: 2;
            }
          }
        }
        & + li {
          margin-top: @m;
        }
        .info {
          dl {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 84px;
            dt {
              height: auto;
              h3 {
                .text-overFlow(1);
              }
              p {
                .text-overFlow(1);
                margin-top: 5px;
                font-size: 12px;
                color: #999;
              }
            }
            .author_bar {
              margin-top: 0;
              .helpNum {
                padding-left: 18px;
                background: url(../../../assets/images/icon_good@2x.png) no-repeat;
                background-size: 15px;
                background-position: 0 50%;
              }
              .pv {
                margin-right: 15px;
                padding-left: 18px;
                background: url(../../../assets/images/icon_view@2x.png) no-repeat;
                background-size: 16px 14px;
                background-position: 0 50%;
              }
            }
          }
        }
        a {
          padding: @p;
          border-radius: @br;
          overflow: hidden;
          background: #fff;
          .img_box {
            margin-left: @m;
          }
          &.video {
            padding: 0;
            .author_bar {
              margin: @m;
            }
          }
        }
      }
    }
  }

  .video-list {
    padding: 0;
    li {
      a {
        padding: 0!important;
      }
      .info {
        dt {
          position: relative;
          height: auto;
          .title {
            .text-overFlow;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            padding: @p @p 0;
            width: 100%;
            color: rgba(255, 255, 255, .8);
            font-size: 15px;
            font-weight: 400;
            background: linear-gradient(180deg,rgba(0,0,0,.4) 0%,rgba(0,0,0,0) 99%);
            line-height: 22px;
            z-index: 2;
          }
          .img {
            &.icon {
              position: relative;
              &::after {
                content: "";
                position: absolute;
                top: 55%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 50px;
                height: 50px;
                background: url(../../../assets/images/common_btn_play_big@2x.png) no-repeat;
                background-size: 100%;
                z-index: 2;
              }
            }
            img {
              height: 180px;
            }
          }
        }
        .author_bar {
          margin: @m;
          .helpNum {
            padding-left: 18px;
            background: url(../../../assets/images/icon_good@2x.png) no-repeat;
            background-size: 15px;
            background-position: 0 50%;
          }
          .pv {
            margin-right: 15px;
            padding-left: 18px;
            background: url(../../../assets/images/icon_view@2x.png) no-repeat;
            background-size: 16px 14px;
            background-position: 0 50%;
          }
        }
      }
    }
  }

  .video {
    .img {
      position: relative;
      overflow: hidden;
      img, video {
        display: block;
        height: 100%;
        background: #eaeaea;
      }
      img {
        min-height: 200px;
        max-height: 220px;
        width: 100%;
      }
      &.icon {
        position: relative;
        &::after {
          content: "";
          position: absolute;
          top: 55%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 50px;
          height: 50px;
          background: url(../../../assets/images/common_btn_play_big@2x.png) no-repeat;
          background-size: 100%;
          z-index: 2;
        }
      }
      .title{
        .text-overFlow();
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        padding: 13px 13px 0;
        font-size: 15px;
        font-weight: 300;
        line-height: 21px;
        color: rgba(255, 255, 255, .8);
        background: linear-gradient(180deg,rgba(0,0,0,.4) 0%,rgba(0,0,0,0) 99%);
      }
    }
  }

  .article_box {
    background-color: #fff;
    padding-top: 0;
    min-height: 100px;
    &.isVideo {
      padding-top: @videoHeight + 10px;
    }
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
      margin: 0 0 25px;
      color: #424242;

      /deep/img {
        max-width: 100%;
        margin: 0 auto;
        display: block;
      }
    }

    .other {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      .linear-gradient {
        display: none;
      }
      .more {
        display: none;
        width: 20px;
        height: 20px;
        background: url(../../../assets/images/btn_drop_all@2x.png) no-repeat center;
        background-size: 100%;
        animation: animation-more 1s infinite;
      }
      a {
        display: block;
        padding: 10px 0;
        border: none;
        color: @activeC;
        background: #fff;
        border: 1px solid @activeC;
        border-radius: 3px;
        width: 100%;
      }
    }
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
    margin-bottom: 15px;
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

  .video-fixed {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: @videoHeight;
    background: #000;
    .video-player-box {
      height: 100%;
      height: 100%;
    }

    /deep/ .video-js {
      width: 100%;
      height: 100%;
      background: #fff;
      overflow: hidden;
      .vjs-tech {
        display: block;
        background: #000;
      }
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
    margin: 40px 0;
    font-size: 12px;
    color: #AFAFAF;
    text-align: center;
    .details {
      color: #CFCFCF;
    }
  }
</style>
