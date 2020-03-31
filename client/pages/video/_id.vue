<template>
  <section class="container">
    <m-header
      title="视频详情"
      :share_on="true"
      @shareFn="onShare(false)"
      :isSuspension="true"
      :readMoreLink="fromType ? '/video/indexApp' : '/video'"
    ></m-header>

    <div class="article_box box_wrapper" :class="{ 'isVideo': isVideo }">
      <!-- 视频 -->
      <div class="video-fixed" :class="{ inApp: isOtherAgent }">
        <no-ssr placeholder="Loading...">
          <video-player
            class="video-player-box"
            ref="videoPlayer"
            :options="playerOptions"
            @ready="setWexinVideo"
            @play="onPlayerPlay($event)"
            @ended="onPlayerEnded($event)"
            @pause="onPlayerPause($event)"
          >
          </video-player>
        </no-ssr>
      </div>

      <h2>{{ articleInfo.title }}</h2>

      <div class="article_hd">
        <div class="author" v-if="articleInfo">
          <div class="img"><img :src="GET_IMG_URL(articleInfo.icon,'doc')" alt=""></div>
          <div class="details">
            <h3>
              {{ articleInfo.authorName }}
              <i v-if="articleInfo.doctorTitle" class="dot"></i>
              {{ articleInfo.doctorTitle }}
            </h3>
            <p>{{ articleInfo.createTime | dateFormat }}<span class="rv-conut fr">{{articleInfo.pv||0}}播放</span></p>
          </div>

          <!--<a v-if="articleInfo.questionnaireUrl" href="javascript:;" @click="routerTo" class="praise">
            <i></i>答题
          </a>-->
        </div>
      </div>
    </div>

    <!-- 选项卡 -->
    <div class="tabs">
      <div class="tab-header" :class="{ inApp: isOtherAgent }">
        <div
          v-for="(item, index) in tabs"
          class="tab-header-item"
          :class="{ active: tabsActive === item.value }"
          :key="index"
          @click="tabsActive = item.value"
          v-if="item.field!='outline'||articleInfo.outline"
        >
          {{ item.name }}{{ item.sub ? pageTotal : "" }}
        </div>
      </div>

      <div class="tab-content">
        <!-- 课程介绍 -->
        <div class="tab-content-item" :class="{ active: tabsActive === 0 }">
          <div class="content">
            <richText :richHtml="articleInfo.intro" />
          </div>
        </div>

        <!-- 课程大纲 -->
        <div class="tab-content-item" :class="{ active: tabsActive === 1 }">
          <div class="content">
            <richText :richHtml="articleInfo.outline" />
          </div>
        </div>

        <!--<div class="tab-content-item" :class="{ active: tabsActive === 2 }">
          &lt;!&ndash; 评论列表 &ndash;&gt;
          <div class="point_box mt10">
            <div class="tab_cont">
              <div class="point_list">
                <ul v-if="replyList.length > 0">
                  <li v-for="(replyItem,index) in replyList" :key="index">
                    &lt;!&ndash; 有回复内容 &ndash;&gt;
                    <template v-if="replyItem.replyList && replyItem.replyList.length > 0">
                      <div class="img">
                        <img :src="GET_IMG_URL(articleInfo.icon, 'u')" width="40" height="40" alt="">
                      </div>
                      <div class="info">
                        <dl>
                          <dt>
                            <span class="name">{{ articleInfo.authorName }}</span>
                          </dt>
                          <dd>{{ replyItem.replyList[0].createTime | dateFormat }}</dd>
                        </dl>
                        <div class="reply_card">
                          <p class="reply_desc">回复<span class="blue">@{{ replyItem.userName }}
                    </span>发表的</p>
                          <div class="reply_txt">{{ replyItem.content }}</div>
                        </div>
                        <div v-if="replyItem.replyList[0].status == 0" class="point_txt">该评论已删除！</div>
                        <div v-else class="point_txt">{{ replyItem.replyList[0].content }}</div>
                      </div>
                    </template>

                    &lt;!&ndash; 无回复内容 &ndash;&gt;
                    <template v-else>
                      <div class="img">
                        <nuxt-link :to="userLink(replyItem.userId,replyItem.userType)">
                          <img :src="GET_IMG_URL(replyItem.userPhoto,'u')" width="40" height="40" alt="">
                        </nuxt-link>
                      </div>
                      <div class="info">
                        <dl>
                          <dt>
                            <span class="name">{{ replyItem.userName }}</span>
                          </dt>
                          <dd>{{ replyItem.commentTime | dateFormat }}</dd>
                        </dl>
                        <div v-if="replyItem.status == 0" class="point_txt">该评论已删除！</div>
                        <div v-else class="point_txt">{{ replyItem.content }}</div>
                      </div>
                    </template>
                  </li>
                </ul>

                <page-loading
                  :loading="loading"
                  :end="isReachEnd"
                  :empty="replyList.length == 0"
                  :isFullScreen="false"
                  @loadFn="getReplyList"
                ></page-loading>
              </div>
            </div>
          </div>
        </div>-->
      </div>
    </div>


    <!-- 评论 -->
    <!--<commentDialog
      v-model="content"
      ref="commentDialog"
      :articleInfo="articleInfo"
      :ifUsed="ifUsed"
      :loading="loading"
      :isSubmit="isSubmit"
      @submit="submit"
      @saveAction="saveAction"
      @shareSuccess="shareSuccess"
    ></commentDialog>-->

    <!-- 提示dialog -->
    <tipsDialog v-model="dialogShow" :option="dialogOption"></tipsDialog>

    <!-- 分享 -->
    <m-share ref="shareRef" :show.sync="isShare" :config="shareConfig" :isAutoFocus="false" @success="shareSuccess"></m-share>

    <!-- 底部 -->
    <m-bottom title=""></m-bottom>
    <div class="blank50" data-v-4216034c=""></div>
  </section>
</template>

<script>
  import tools from "~/utils/tools.js";
  import { commonMixin, comtyIdValid, dataCollectMixin } from "~/mixins";
  import header from "~/components/header.vue";
  import bottom from "~/components/bottom.vue";
  import richText from "~/components/rich_text.vue";
  import pageLoading from "~/components/pageLoading.vue";
  import commentDialog from "./components/commentDialog.vue";
  import tipsDialog from "./components/tipsDialog.vue";
  import articleService from "~/services/articleService.js";
  import share from "~/components/iwen/share.vue";

  export default {
    mixins: [commonMixin, dataCollectMixin],
    components: {
      mHeader: header,
      mBottom: bottom,
      mShare: share,
      richText:richText,
      pageLoading,
      commentDialog,
      tipsDialog
    },
    async asyncData({ route, redirect, store, query}) {
      // 获取社区信息
      let comtyInfo = await comtyIdValid.getComtyInfo({ redirect, store, query });

      // 检查应用是否开放
      let PAGE_APP_OBJ = await commonMixin.methods.SET_PAGE_PERMISSION("7", { route, redirect, store });

      // 获取用户是否点赞
      // let ifUsed = await dataCollectMixin._getOperate({ contentId: route.id, contentType: "0"  });
      let ifUsed = 0;
      if (store.getters.isLogin) {
        ifUsed = await dataCollectMixin.methods._getOperate({ contentId: route.params.id, contentType: "0" }, store);
      }

      // 获取视频详情
      let articleInfo = {};
      let res = await articleService.findVideoById({ id: route.params.id });

      if (res.status == 200 && res.data) {
        articleInfo = res.data;
      } else {
        return redirect({
          path:"/notFound",
          query:{
            statusCode:404,
            message:"内容找不到了",
            comtyId: query.comtyId || ""
          }
        });
      }

      return {
        articleInfo,
        comtyInfo,
        PAGE_APP_OBJ,
        ifUsed,
      };
    },
    data() {
      return {
        isShare: false,
        shareConfig: {},
        dialogShow: false,
        dialogOption: {},
        dialogConfirmBtn: "",
        loading: false,
        isReachEnd: false,
        currentPage: 0,
        pageCount: 2,
        pageSize: 10,
        pageTotal: 0,
        isSubmit: false,
        replyIsShow: false,
        pid: 0,
        ifUsed: 0,
        authorInfo: "",
        content: "",
        articleInfo: {},
        playerOptions: {
          playbackRates: [0.7, 1.0, 1.5, 2.0],
          sources: {
            type: "video/mp4",
            src: ""
          },
          poster: "", // 封面图
        },
        replyList: [],
        tabsActive: 0,
        tabs: [
          { value: 0, name: "课程介绍" ,field:"intro"},
          { value: 1, name: "课程大纲" ,field:"outline"},
          // { value: 2, name:  "评论 ", sub: true,field:"replyList" },
        ],
        videoPlayer: null,
        startCounter: null,
        recordDoctor: {
          endWatchTime: 0,
          totalWatchTime: 0,
          watchProgress : "",
          count : 0,
        }
      };
    },
    computed: {
      player() {
        this.$nextTick( () => {
          return this.$refs.videoPlayer;
        });
      },
      isVideo() {
        // return this.$route.query.type == "video";
        return true;
      },
      isOtherAgent() {
        if (this.$platformInfo) {
          let os = this.$platformInfo.os;
          return os.isWx || os.isWeibo || os.isMp || this.VX_isInApp;
        } else {
          return false;
        }
      },
      fromType() {
        return this.$route.query && this.$route.query.from && this.$route.query.from == "app";
      }
    },
    watch: {
      "recordDoctor.count"(val) {
        if (val == 5) {
          this.getRecordParams();
          this.recordDoctorView();
        }
      }
    },
    async created() {
      this.pid = this.$route.params.id;
      this.playerOptions.sources.src = this.articleInfo.url;
      this.playerOptions.poster = this.articleInfo.cover;
      this.pageTotal = this.articleInfo.comments;
      this.onShare(true);
      await this.getUsed();

      // 检查是否登录回来，不是医生，则弹出提示
      if (process.client && this.VX_is_login && localStorage.getItem("videoMsg")) {
        localStorage.removeItem("videoMsg");
        this.toCheckDoctor();
      }

      // 记录医生观看进度
      if (this.VX_is_login && this.VX_isDoctor) {
        this.recordDoctorView();
      }

      this.$nextTick( () => {
        this.videoPlayer = this.$refs.videoPlayer;
      });
    },
    mounted() {
      this.recordHistory();
      this.getReplyList();
      this.addUserOperationRecord({
        operationType:0,
        objType:1,
        objTitle:this.articleInfo.title
      });
      this._dataCollect(this.getUserData("0"));
    },
    methods: {
      onShare(isInit = false) {
        if (!isInit) {
          this.isShare = true;
        }

        this.shareConfig = {
          id: this.$route.params.id,
          type: "video",
          title: this.articleInfo.title,
          content: this.articleInfo.content,
          imgUrl: this.articleInfo.cover || "",
          appHidden: false
        };
      },
      getVideoDetails() {
        articleService.findVideoById({ id: this.pid }).then( res => {
          if (res.status == 200 && res.data) {
            this.articleInfo = res.data;
            this.pageTotal = this.articleInfo.comments;
          }
        });
      },
      onPlayerPlay(e) {
        if (this.VX_is_login && this.VX_isDoctor) {
          // this.videoPlayer.player.currentTime(this.recordDoctor.endWatchTime);
          // this.recordDoctorView();
          this.startCount();
        }
      },
      onPlayerPause() {
        clearTimeout(this.startCounter);
      },
      onPlayerEnded() {
        clearTimeout(this.startCounter);
        this.getRecordParams();
        this.recordDoctorView();
      },
      getRecordParams() {
        let player = this.videoPlayer.player;
        let currentTime = player.currentTime();
        let duration = player.duration();

        this.recordDoctor.endWatchTime = Math.floor(currentTime);
        this.recordDoctor.totalWatchTime += 5;

        let precent = Math.floor(this.recordDoctor.totalWatchTime / duration * 100) / 100;

        if (precent > 1) {
          precent = 1;
        }

        this.recordDoctor.watchProgress = precent * 100 + "%";
      },
      startCount(type) {
        clearTimeout(this.startCounter);
        this.startCounter = setTimeout(this.startCount, 1000);
        this.recordDoctor.count += 1;
      },
      recordDoctorView() {
        if (!this.VX_userInfo) {
          return;
        }

        // 记录医生观看记录，首次加载传0：endWatchTime、totalWatchTime、watchProgress
        let params = this.recordDoctor;
        articleService.updateDoctorVideo({
          endWatchTime: params.endWatchTime,
          totalWatchTime: params.totalWatchTime,
          watchProgress : params.watchProgress ,
          userId: this.VX_userInfo.id,
          videoId: this.pid,
          phone: this.VX_userInfo.phoneNum,
        }).then( res => {
          if (res.status == 200 && res.data) {
            this.recordDoctor.endWatchTime = res.data.endWatchTime;
            this.recordDoctor.totalWatchTime = res.data.totalWatchTime;
            this.recordDoctor.watchProgress = res.data.watchProgress;
          }
        }).finally( () => {
          this.recordDoctor.count = 0;
        });
      },
      shareSuccess() {
        // 分享成功
        this._dataCollect(this.getUserData("3"));
      },
      routerTo() {
        if (!this.toCheckDoctor()) { return; }
        window.location.href = this.articleInfo.questionnaireUrl;
      },
      toCheckDoctor() {
        if (!this.VX_is_login) {
          this.dialogShow = true;
          this.dialogOption = {
            content: "参与互动需要登录并认证医生身份",
            type: "login"
          };
          return false;
        }

        if (!this.VX_isDoctor) {
          this.dialogShow = true;
          this.dialogOption = {
            content: "参与互动需要认证医生身份",
            type: "doctor"
          };
          return false;
        }

        return true;
      },
      setWexinVideo() {
        // 设置腾讯X5内核全屏问题
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
      async getUsed() {
        // 获取点赞
        if (this.VX_is_login) {
          this.ifUsed = await this._getOperate({ contentId: this.$route.params.id, contentType: "0"  });
        }
      },
      userLink(id, type = "0") {
        //医生跳转医生主页 用户跳转用户主页
        let link = ["0", "2"].indexOf(type) >= 0 ? `/users/${ id }` : `/doctors/${ id }`;
        return link;
      },
      closeComment() {
        this.content = "";
        this.$refs.commentDialog.close();
      },
      saveAction() {
        // 点赞
        if (!this.toCheckDoctor()) { return; }

        if(this.ifUsed) { return; }

        this._dataCollect(this.getUserData("2"), () => {
          this.getUsed();
          this.getVideoDetails();
        }).then( res => {
          if (res.status == 200) {
            this.articleInfo.helpNum += 1;
            this.ifUsed = true;
          }
        });
      },
      recordHistory() {
        // 记录用户是否已看过（已登录：接口， 未登录：本地）
        if (this.VX_is_login) {
          articleService.addLabelToVideoForUser({
            id: this.pid,
            labelName: "看过",
            userId: this.VX_userInfo.id || "",
          });
        } else {
          let history = localStorage.getItem("videoHistory") || {};

          if (typeof history == "string") {
            history = JSON.parse(history);
          }

          history[this.pid] = 1;
          localStorage.setItem("videoHistory", JSON.stringify(history));
        }
      },
      submit() {
        if (!this.toCheckDoctor()) { return; }

        if (this.isSubmit) { return; }

        if (!this.verify()) { return; }

        let params = {
          // id: "",// 评论id（修改时必传）
          content: tools.delHtmlTag(this.content),
          userId: this._getUserAttr("id"),
          videoId: this.pid,
        };

        this.isSubmit = true;

        // 发表评论
        articleService.addOrUpdateComment(params).then( res => {
          if (res.status == 200) {
            this.$toast.tip("评论成功！");
            this.currentPage = 0;
            this.pageCount = 2;
            this.replyList = [];
            this.closeComment();
            this._dataCollect(this.getUserData("1"), () => {
              this.getVideoDetails();
              this.getReplyList();
            });
          } else {
            this.$toast.tip("评论失败！");
          }
        }).finally( () => {
          this.isSubmit = false;
        });
      },
      verify() {
        let content = tools.trim(this.content);

        if (tools.isEmpty(content)) {
          this.$toast.tip("请输入评论内容~");
          return false;
        }
        if (content.length > 1000) {
          this.$toast.tip("内容不能超过1000个字");
          return false;
        }

        return true;
      },
      getReplyList() {
        if (this.loading) return;
        this.loading = true;

        let params = {
          id: this.pid,
          page: this.currentPage + 1,
          size: this.pageSize,
        };

        // 获取评论列表
        articleService.findVideoCommentPage(params).then( res => {
          if (res.status == 200 && res.data) {
            this.replyList = this.replyList.concat(res.data);
            this.currentPage = this.currentPage + 1;
            this.pageCount = Math.ceil(res.total / this.pageSize);
            this.isReachEnd = this.currentPage + 1 > this.pageCount;
          }
        }).finally(() => {
          this.loading = false;
        });
      },
      getUserData(type) {
        // 打点 0：浏览；1：评论；2：点赞；3：分享
        return {
          contentId: this.pid,
          contentType: "0",
          operationType: type,
          authorId: this.articleInfo.authorId,
          contentCreateTime: this.articleInfo.createTime,
          title: this.articleInfo.title,
        };
      }
    },
    head() {
      return {
        title: `${this.articleInfo.title}_${this.comtyInfo.comtyName}`,
        meta: [
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
  @m: 13px;
  @p: 13px;
  @videoHeight: 210px;

  .text-overFlow(@n: 2) {
    display: -webkit-box;
    /* autoprefixer: ignore next */
    -webkit-box-orient: vertical;
    -webkit-line-clamp: @n;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .testlink {
    position: fixed;
    top: 10px;
    right: 10px;
    z-index: 999;
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
      background: url(../../assets/images/common_btn_play_big@2x.png) no-repeat;
      background-size: 100%;
      span {
        display: none;
      }
    }
  }

  .video-content {
    margin: @p 0 ;
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
        background:  url(../../assets/images/btn_down@2x.png) no-repeat right;
        background-size: auto 50%;
      }
      &.active {
        .title {
          .text-overFlow(2);
        }
        .btn {
          background:  url(../../assets/images/btn_up@2x.png) no-repeat right;
          background-size: auto 50%;
        }
      }
    }
    .content {
      margin-top: @p/2;
      font-size: 13px;
      color: #999;
      transition: all .3s;
    }
  }

  .article_box {
    background-color: #fff;
    padding-bottom: 15px;
    min-height: 100px;

    h2 {
      margin: 15px 0;
      font-size: 17px;
      font-weight: bold;
      line-height: 24px;
    }

    .article_hd {
      .author {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
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
            // position: relative;
            .dot{
              display: inline-block;
              position: relative;
              width: 2px;
              height: 2px;
              border-radius:50%;
              background-color: #000;
              top: -4px;
            }
            span {
              margin-left: 5px;
              font-size: 12px;
              color: #666;
            }
          }
          .rv-conut{
              margin-left: 10px;
              color: #CFCFCF;
          }
        }
        .img + .details{
          margin-left: @m;
        }
      }
      .praise {
        color: #666;
        font-size: 12px;
        text-align: center;
        line-height: normal;
        i {
          display: block;
          width: 28px;
          height: 28px;
          background: url(~assets/images/btn_icon_list@2x.png) no-repeat center;
          background-size: 100%;
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

  .author_card {
    margin-top: 30px;
    background-color: #F6F8FB;
    border-radius: 6px;
    border: 1px solid #EFF2F7;

    a {
      padding: 12px;
      display: flex;
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
      padding-right: 15px;
      background: url(../../assets/images/btn_enter@2x.png) no-repeat right center;
      background-size: 20px 20px;
      &.noLink {
        padding-right: 0;
        background: unset;
      }
    }

    .author_info dt {
      color: #282828;
    }

    .author_name {
      font-size: 16px;
      font-weight: bold;
    }
  }

  .point_box {
    background-color: #fff;

    .common_hd {
      padding: 15px 15px 3px;
    }
    .tab_box ul {
      display: flex;
      padding: 0 15px;
      border-bottom: 1px solid #EFEFEF;

      li {
        flex: 1;
        box-flex: 1;
        font-size: 15px;
        height: 51px;
        line-height: 46px;
        text-align: center;
      }

      .current {
        background: url(../../assets/images/current_line.gif) no-repeat center 46px;
        font-weight: bold;
      }
    }

    .point_list {
      li {
        display: flex;
      }

      .img {
        width: 55px;
        height: 55px;
        border-radius: 40px;
        margin-right: 10px;
        padding: 15px 0 0 15px;

        img {
          display: block;
          background-color: #f2f2f2;
          width: 40px;
          height: 40px;
          border-radius: 40px;
        }
      }

      .info {
        flex: 1;
        box-flex: 1;
        width: 0;
        padding: 15px 15px 15px 0;
        border-bottom: 1px solid #F3F4F5;
      }

      li:last-child .info {
        border-bottom: 0;
      }

      dl {
        line-height: 20px;
        font-size: 12px;
        color: #999;
      }

      .name {
        font-size: 13px;
        color: #666;
      }

      .blue {
        color: #2688FC;
      }

      .orange {
        color: #FFBA00;
      }

      dd em {
        color: #CFCFCF;
        font-style: normal;
      }

      .point_txt {
        font-size: 14px;
        color: #282828;
        line-height: 22px;
        padding-top: 4px;
        word-break: break-all;
        word-wrap:break-word;
      }

      .reply_card {
        padding: 12px;
        background-color: #F6F8FB;
        border-radius: 6px;
        font-size: 13px;
        line-height: 21px;
        margin: 15px 0 11px 0;
      }

      .reply_desc {
        color: #666;
      }

      .reply_txt {
        color: #282828;
        word-wrap: break-word;
        word-break: break-all;
      }
    }
  }

  .tabs {
    margin-top: 10px;
    background: #fff;
    .tab-header {
      position: sticky;
      top: @videoHeight + 44px;
      display: flex;
      align-items: center;
      background: #fff;
      border-bottom: 1px solid #EFEFEF;
      &.inApp {
        top: @videoHeight;
      }
      .tab-header-item {
        flex: 1;
        position: relative;
        color: #666;
        font-size: 14px;
        line-height: 44px;
        text-align: center;
        transition: all .3s;
        &.active {
          color: #282828;
          font-weight: bold;
          font-size: 15px;
          &:after {
            content: "";
            position: absolute;
            bottom: 3px;
            left: 50%;
            transform: translateX(-50%);
            width: 12px;
            height: 2px;
            background: #2688FC;
          }
        }
      }
    }

    .tab-content {
      .tab-content-item {
        display: none;
        min-height: 200px;
        &.active {
          display: block;
        }
        .content {
          padding: 15px;
          padding-bottom: 60px;
        }
      }
    }
  }

</style>
