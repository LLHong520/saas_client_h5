<template>
  <section class="container">
    <!--<m-header :title="PAGE_APP_OBJ.label" :border_on="false"></m-header>-->
    <div v-if="!isNull && dataInfo" class="questionnaire">
      <div v-if="showHeader" class="d-header" :style="headerBg">
        <div class="content" :class="{ cover: dataInfo.cover && dataInfo.cover == 1 }">
          <h1  v-if="dataInfo.titleHide && dataInfo.titleHide=='1'">{{ dataInfo.title }}</h1>
          <p  v-if="dataInfo.summaryHide && dataInfo.summaryHide=='1'">{{ dataInfo.summary }}</p>
        </div>
      </div>

      <div class="d-content" :class="{ btnFixed: isFixedSubmitBtn }">
        <div v-for="(item, index) in dataList" :key="index" class="mb20">
          <!-- 单选 -->
          <template v-if="item.type == 1">
            <div class="d-box">
              <h4>{{ item.number }}.{{ item.title }}</h4>
              <div class="d-options" v-if="item.options && item.options.length > 0" :class="{ 'd-options-img':  item.options[0].imgUrl }">
                <label class="d-item" v-for="(cItem, cIndex) in item.options" :key="cIndex">
                  <i v-if="cItem.imgUrl" class="preview" @click="onPreview(cItem.imgUrl, $event)"></i>
                  <img v-if="cItem.imgUrl" v-lazy="cItem.imgUrl">
                  <span><input v-model="item.answer" type="radio" :name="item.title" :value="cItem.id">{{ cItem.summary }}</span>
                </label>
              </div>
            </div>
          </template>

          <!-- 多选 -->
          <template v-if="item.type == 2">
            <div class="d-box">
              <h4>{{ item.number }}.{{ item.title }}</h4>
              <div class="d-options" v-if="item.options && item.options.length > 0" :class="{ 'd-options-img':  item.options[0].imgUrl }">
                <label class="d-item" v-for="(cItem, cIndex) in item.options" :key="cIndex">
                  <i v-if="cItem.imgUrl" class="preview" @click="onPreview(cItem.imgUrl, $event)"></i>
                  <img v-if="cItem.imgUrl" v-lazy="cItem.imgUrl">
                  <span><input v-model="item.answer" type="checkbox" :name="item.title" :value="cItem.id">{{ cItem.summary }}</span>
                </label>
              </div>
            </div>
          </template>

          <!-- 图片 -->
          <template v-if="item.type == 3">
            <div class="d-box showImg">
              <img v-if="item.imgUrl" v-lazy="item.imgUrl">
              <p v-if="item.summary">{{ item.summary }}</p>
            </div>
          </template>

          <!-- 文本 -->
          <template v-if="item.type == 4">
            <div class="d-box">
              <h4>{{ item.number }}.{{ item.title }}</h4>
              <div class="d-options d-options-input">
                <div class="d-item">
                  <div class="content" v-if="item.summary || item.imgUrl">
                    <p>{{ item.summary }}</p>
                    <img v-if="item.imgUrl" v-lazy="item.imgUrl">
                  </div>
                  <input v-model="item.answer" type="text" :placeholder=" item.markedWords || '请输入内容'">
                </div>
              </div>
            </div>
          </template>

          <!-- 多行文本 -->
          <template v-if="item.type == 5">
            <div class="d-box">
              <h4>{{ item.number }}.{{ item.title }}</h4>
              <div class="d-options d-options-input">
                <div class="d-item">
                  <div class="content" v-if="item.summary || item.imgUrl">
                    <p>{{ item.summary }}</p>
                    <img v-if="item.imgUrl" v-lazy="item.imgUrl">
                  </div>
                  <textarea rows="5" v-model="item.answer" :placeholder=" item.markedWords || '请输入内容'"></textarea>
                </div>
              </div>
            </div>
          </template>

          <!-- 富文本 -->
          <template v-if="item.type == 6">
            <div class="d-box">
              <div class="d-options d-options-input">
                <richText :richHtml="item.summary" />
              </div>
            </div>
          </template>

          <!-- 提交表单按钮 -->
          <template v-if="item.type == 7">
            <div class="d-box" :class="{ fixed: isFixedSubmitBtn }">
              <div class="d-button">
                <button @click="onSubmit" :disabled="isSubmit">{{ item.title }}</button>
              </div>
            </div>
          </template>

          <!-- card -->
          <template v-if="item.type == 8">
            <div class="d-box card">
              <img v-if="item.imgUrl" v-lazy="item.imgUrl">
              <img v-else :src="defaultCardImg">
              <p
                v-clipboard:copy="item.summary"
                v-clipboard:success="onCopy"
                :style="{ color: item.color }"
              >
                {{ item.title }}
              </p>
            </div>
          </template>

          <!-- 医生card -->
          <template v-if="item.type == 9">
            <div class="author_card">
              <a href="javascript:;">
                <div class="author_img"><img :src="GET_IMG_URL(item.docCard.docImg.url,'doc')" alt=""></div>
                <div class="author_info">
                  <dl>
                    <dt><span class="author_name">{{ item.docCard.docName }}</span>&nbsp;&nbsp;{{ item.docCard.docTitle }}</dt>
                    <dd>{{ item.docCard.hospital }}</dd>
                    <dd class="introduce">{{ item.docCard.docLabels.replace(/;/g," ") }}</dd>
                  </dl>
                </div>
                <div class="btn" @click="openDialog(item)">{{ item.docCard.butText || "立即咨询" }}</div>
              </a>
            </div>
          </template>
        </div>
      </div>

      <!-- 默认提交按钮 -->
      <div class="d-bottom" v-if="!hasSubmitBtn && dataInfo.id">
        <button @click="onSubmit" :disabled="isSubmit">{{ isSubmit ? "提交中..." : "提交" }}</button>
      </div>
    </div>

    <!-- 问卷为空 -->
    <div v-if="isNull && !loading" class="d-null" :class="{ success: isRepeat }">
      <i></i>
      <p>{{ isRepeat ? "您已成功提交问卷，谢谢参与！" : "您所访问的问卷已停止收集" }}</p>
      <nuxt-link to="/">进入社区</nuxt-link>
      <p class="tips"><span>{{ countTime }}s</span>后自动跳转</p>
    </div>

    <!-- 图片预览 -->
    <iwen-preview
      v-model="imgPreview.show"
      :list="imgPreview.list"
      :index="imgPreview.index"
    ></iwen-preview>

    <!-- 弹窗 -->
    <editDialog v-model="dialogShow" :options="dialogOptions" type="doctor"></editDialog>

    <!-- 分享 -->
    <m-share :show.sync="isShare" :config="shareConfig"></m-share>

  </section>
</template>

<script>
  import { LOGIN_URL } from "~/config";
  import { commonMixin } from "~/mixins";
  import header from "~/components/header.vue";
  import richText from "~/components/rich_text.vue";
  import iwenPreview from "~/components/iwen/preview.vue";
  import articleService from "~/services/articleService.js";
  import defaultCardImg from "~/assets/images/default/box_bg_wechat.png";
  import editDialog from "./components/editDialog.vue";
  import share from "~/components/iwen/share.vue";

  export default {
    mixins: [commonMixin],
    components: {
      mHeader: header,
      mShare: share,
      richText,
      iwenPreview,
      editDialog
    },
    async asyncData({route, store, redirect, query}){
      // 获取社区信息
      // let comtyInfo = await comtyIdValid.getComtyInfo({ redirect, store, query });

      // 检查应用是否开放
      // let PAGE_APP_OBJ = await commonMixin.methods.SET_PAGE_PERMISSION("4", { route, redirect, store });

      // 获取调查问卷信息
      /*let dataInfo = {};

      if (route.params.id != "preview") {
        let res = await articleService.getQuestionnaireDetails({ id: route.params.id });

        if (res.status == 200 && res.data) {
          dataInfo = res.data;
        }
      }*/

      /*let isRepeat = false;

      // 检查用户
      if (store.getters.isLogin) {
        let res = await articleService.getUserIsQuestionAnswer({
          questionnaireId: route.params.id,
          userId: store.state.userInfo.id,
        });

        if (res.status == 200 && res.data) {
          isRepeat = true;
        }
      }*/

      return {
        // comtyInfo,
        // PAGE_APP_OBJ,
        // dataInfo,
        // isRepeat : isRepeat,
      };
    },
    data(){
      return {
        isShare: false,
        shareConfig: {},
        defaultCardImg: defaultCardImg,
        imgPreview: {
          show: false,
          list: [],
          index: 1
        },
        eventid:"",
        comtyInfo: {},
        dataInfo: {},
        dataList: [],
        loading: false,
        isNull: false,
        isRepeat: false,
        isSubmit: false,
        startTime: "",
        pid: "",
        interval: "",
        countTime: 5,
        dialogShow: false,
        dialogOptions: {},
        exclude: ["3", "6", "7", "8", "9"],   // 纯图片、富文本、提交按钮、card、医生card不需要返回
      };
    },
    computed: {
      headerBg() {
        if (this.dataInfo.imgUrl) {
          return `background: url(${ this.dataInfo.imgUrl }) center center / 100% 100% no-repeat;`;
        } else {
          return "";
        }
      },
      ifPreview() {
        return this.pid == "preview";
      },
      showHeader() {
        return (this.dataInfo.titleHide && this.dataInfo.titleHide=="1") || (this.dataInfo.summaryHide && this.dataInfo.summaryHide=="1");
      },
      hasSubmitBtn() {
        let btn = this.dataList.filter( a => { return a.type == 7; });
        return btn.length > 0;
      },
      isFixedSubmitBtn() {
        let btn = this.dataList.filter( a => { return a.type == 7; });

        if (btn.length > 0) {
          btn = btn[0];

          return btn.fixBottom == 1;
        }

        return false;
      }
    },
    watch: {
      isNull(val) {
        if (val) {
          this.autoRoute();
        }
      }
    },
    async created() {
      (function(root) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.crossOrigin = "anonymous";
        script.src = "https://cheka.biz.weibo.com/index";
        script.onerror = function () {
          var request = new XMLHttpRequest();
          var web_url = window.encodeURIComponent(window.location.href);
          var url = "https://cheka.biz.weibo.com/v1/error";
          var data = {
            "error":{
              "url": web_url,
              "message": "404",
              "name": "__SDK_CDN__",
              "detail": {}
            }
          };
          request.open("POST", url, true);
          request.send("param=" + encodeURIComponent(data));
        };
        console.log("nowOCPX");
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.appendChild(script);
      })(window);
      
      // this.pid = this.$route.query.id;
      this.pid = this.$route.params.id;
      // await this.checkRepeat();

      if (this.ifPreview) {
        this.isRepeat = false;
        this.getPreViewData();
        return;
      }

      if (!this.isRepeat) {
        this.getData();
      } else {
        this.isNull = true;
      }

      this.onShare(true);
    },
    mounted() {
      // localStorage.removeItem("questionRecord");
      this.startTime = new Date().getTime();
 
      this.dataCollectVisitor({
        type: 6,
        contentId: this.pid
      });

      // this.wexinAutoLogin();
    },
    destroyed() {
      clearInterval(this.interval);
    },
    methods:{
      onShare(isInit = false) {
        if (!isInit) {
          this.isShare = true;
        }
        this.shareConfig = {
          id: this.pid,
          type: "question_naire",
          title: this.dataInfo.title,
          content: this.dataInfo.summary,
          imgUrl: this.dataInfo.imgUrl
        };
      },
      openDialog(item) {
        if (item.docCard.url) {
          window.location.href = item.docCard.url;
        } else {
          this.dialogShow = true;
          this.dialogOptions = item;
        }
      },
      onCopy() {
        this.$toast.tip("已复制成功！");
      },
      onPreview(url, e) {
        e.preventDefault();
        this.imgPreview.show = true;
        this.imgPreview.list = [{ url }];
      },
      autoRoute() {
        this.interval = setInterval( () => {
          this.countTime--;
        }, 1000);

        // 清除定时器，跳转到首页
        setTimeout( () => {
          clearInterval(this.interval);
          this.$router.push("/");
        }, 5000);
      },
      wexinAutoLogin() {
        // 微信环境时弹出微信登录
        if (!this.VX_is_login && (this.$platformInfo.os.isMp || this.$platformInfo.os.isWx)) {
          let referer = encodeURIComponent(this.$route.fullPath);
          let url = LOGIN_URL + "/auth/h5Login?cmtyId=" + this.$store.state.comtyId;
          url += "&referer="+encodeURIComponent(referer);

          // PS:微信判断未完全加载完网页时，拒绝授权时会直接关闭网页
          setTimeout( () => {
            this.$nextTick( () => {
              window.location.replace(url);
            });
          }, 500);
        }
      },
      wexinPostMessage() {
        // 向微信小程序发送消息
        if (wx && wx.miniProgram) {
          wx.miniProgram.reLaunch({ url: "/pages/web_view/main?isReload=true" });
          wx.miniProgram.postMessage({ data: "foo" });
        }
      },
      getData() {
        this.loading = true;
        articleService.getQuestionnaireDetails({ id: this.pid }).then( res => {
          if (res.status == 200 && res.data && res.data.questionnaire) {
            this.dataInfo = res.data;

            this.dataList = this.setAnswer(res.data.questionnaire);
            this.eventid = res.data.ocpx || "";
            this.isNull = res.data.status == 1 ? false : true;
          } else {
            this.isNull = true;
          }
        }).finally( () => {
          this.loading = false;
        });
      },
      getPreViewData() {
        articleService.findRedisByKey({ key: this.$route.query.key }).then( res => {
          if (res.status == 200 && res.data) {
            this.dataInfo = JSON.parse(res.data);
            this.dataList = this.setAnswer(this.dataInfo.questionnaire);
          } else {
            this.isNull = true;
          }
        }).finally( () => {
          this.loading = false;
        });
      },
      setAnswer(arr) {
        return arr.map( item => {
          item.answer = item.type == 2
            ? []
            : "";

          return item;
        });
      },
      getAnswer(arr, attr){
        let newArr = JSON.parse(JSON.stringify(arr));
        let result = [];
        let exclude = this.exclude;

        newArr.forEach( item => {
          if (exclude.indexOf(item.type) < 0) {
            let obj = {
              questionId: item.questionId,
              answer: item.type == 2
                ? item.answer.join(",")
                : item.answer,
            };

            if (attr) {
              obj[attr] = item.number + "." + item[attr];
            }
            result.push(obj);
          }
        });
        return result;
      },
      getAnswerText(arr) {
        let newArr = JSON.parse(JSON.stringify(arr));
        let answerText = "";
        let exclude = this.exclude;

        newArr.forEach( item => {
          if (exclude.indexOf(item.type) < 0) {
            if (item.type == 1) {
              item.answer = item.options.filter( a => a.id == item.answer )[0].summary;
            }

            if (item.type == 2) {
              let answer = "";

              item.answer.forEach( b => {
                answer += "," + item.options.filter( a => a.id == b )[0].summary;
              });

              item.answer = answer.substring(1);
            }

            answerText += `,[${ item.answer }]`;
          }
        });

        return answerText.substring(1);
      },
      onSubmit() {
        if (!this.verify()) { return; }

        if (this.ifPreview) { return; }

        if (process.browser) {
          console.log("ocpxsubmit");
          window.wbadmt.send({"eventid":this.eventid ,"eventtype":"form","eventvalue":""});
        };
        this.isSubmit = true;

        let question = this.getAnswer(this.dataList);
        let answerText = this.getAnswerText(this.dataList);
        let time = new Date().getTime();
        let params = {
          startTime: this.startTime,
          endTime: time,
          userId: this.VX_is_login ? this.VX_userInfo.id : `tourist${ this.startTime }`,
          question: question,
          answerText: answerText,
          questionnaireId: this.pid,
        };

        if (this.VX_is_login && this.VX_userInfo.accountBinding) {
          params.openUId = this.VX_userInfo.accountBinding.weiboUid || "";
          params.openUType = 1;
        }

        articleService.addCommunityQuestionAnswer(params).then( res => {
          if (res.status == 200) {
            this.isNull = this.isRepeat = true;
            this.$toast.tip("提交成功");
            this.toLocalStorage("set");
          }
        }).finally( () => {
          this.isSubmit = false;
        });
      },
      verify() {
        let question = this.getAnswer(this.dataList, "title");
        let result = true;

        for(let index in question) {
          if (!question[index].answer) {
            this.$toast.tip(`请补充问题“${ question[index].title }”的答案`);
            result = false;
            break;
          }
        }

        return result;
      },
      toLocalStorage(type) {
        let questionRecord = JSON.parse(localStorage.getItem("questionRecord")) || {};

        if (type == "set") {
          questionRecord[this.pid] = true;
          localStorage.setItem("questionRecord", JSON.stringify(questionRecord));
        }
        if (type == "get"){
          return questionRecord;
        }
      },
      async checkRepeat() {
        // 判断游客是否已填写过问卷
        if (!this.VX_is_login) {
          let local = this.toLocalStorage("get");
          if (local[this.pid]) {
            this.isRepeat = true;
          }
        }
      }
    },
    head(){
      return {
        title: this.dataInfo.title || this.PAGE_APP_OBJ.label || "调查问卷",
      };
    }
  };
</script>

<style>
  html, body {
    background: #fff;
  }
</style>

<style lang="less" scoped>
  @themeBg: #F2F5F8;
  @moduleBg: #F6F8FB;
  @m: 15px;
  @p: 15px;
  @br: 4px;
  @borderC: #ECECEC;
  @activeC: #2688FC;
  @color3: #282828;
  @color6: #666;
  @color9: #999;
  @h1: 20px;
  @h3: 17px;
  @h4: 15px;


  html, body, .container {
    background: @themeBg;
  }

  .mb20 {
    margin-bottom: 10px;
  }

  .flex-center {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .text-overFlow(@n: 2) {
    display: -webkit-box;
    /* autoprefixer: ignore next */
    -webkit-box-orient: vertical;
    -webkit-line-clamp: @n;
    overflow: hidden;//
    text-overflow: ellipsis;
  }

  .questionnaire {
    font-size: 14px;
    background: #fff;
    .d-header {
      margin: 0 @p;
      margin-top: @p;
      background: #2E3E51;
      border-radius: @br;
      overflow: hidden;
      .content {
        .flex-center;
        flex-direction: column;
        padding: @p;
        color: #fff;
        text-align: center;
        min-height: 150px;
        &.cover {
          background: rgba(0, 0, 0, .4);
        }
      }


      h1 {
        font-size: @h1;
        font-weight: bold;
        line-height: normal;
        & + p {
          margin-top: @m;
          text-align: left;
          word-break: break-word;
        }
      }
    }

    .d-content {
      padding: @p;
      &.btnFixed {
        padding-bottom: 80px;
      }
      .d-box {
        &.showImg {
          padding: 0;
          border: 1px solid @borderC;
          img {
            width: 100%;
          }
          p {
            padding: 10px;
            text-align: center;
          }
        }
        &.fixed {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 0;
          background: #fff;
          z-index: 10;
          .d-button {
            max-width: 760px;
            margin: 0 auto;
          }
        }
        &.card {
          position: relative;
          img {
            width: 100%;
          }
          p {
            position: absolute;
            top: 50%;
            right: 15px;
            padding: 5px 15px;
            transform: translateY(-50%);
            font-size: 14px;
            text-align: center;
            line-height: normal;
            color: #1AAD19;
            background: #fff;
            border-radius: 3px;
          }
        }
        h4 {
          font-weight: bold;
        }
        input[type="text"], textarea {
          display: block;
          padding: 10px;
          width: 100%;
          font-size: 12px;
          border: 1px solid #D6D6D6;
          border-radius: @br;
        }
        input[type="radio"], input[type="checkbox"] {
          margin-right: 10px;
          width: 16px;
          height: 16px;
          flex: none;
        }
        input[type="radio"] {
          background: url(../../../assets/images/selection_box_08.png) no-repeat center;
          background-size: 100%;
          &:checked {
            background: url(../../../assets/images/selection_box_11.png) no-repeat center;
            background-size: 100%;
          }
        }
        input[type="checkbox"] {
          background: url(../../../assets/images/selection_box_05.png) no-repeat center;
          background-size: 100%;
          &:checked {
            background: url(../../../assets/images/selection_box_03.png) no-repeat center;
            background-size: 100%;
          }
        }
        .d-options {
          .d-item {
            display: flex;
            align-items: center;
            padding: 10px 0 0;
            span {
              display: flex;
              flex: 1;
              align-items: center;
              font-size: 12px;
            }
          }
        }
        .d-options-img {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          .d-item {
            position: relative;
            padding: 0;
            flex-direction: column;
            width: calc( (100% - @m) / 2 );
            border: 1px solid @borderC;
            border-radius: @br;
            overflow: hidden;
            &:nth-of-type(n+3) {
              margin-top: @p;
            }
            .preview {
              position: absolute;
              top: 0;
              right: 0;
              width: 24px;
              height: 24px;
              background: url(../../../assets/images/magnifier@2x.png) no-repeat center rgba(255, 255, 255, .8);
              background-size: 15px;
              z-index: 2;
            }
            img {
              width: 100%;
              height: 150px;
            }
            span {
              margin: @m - 5px 0;
              padding: 0 @p/2;
            }
          }
        }
        .d-options-input {
          .d-item {
            padding: 0;
            flex-direction: column;
            .content {
              width: 100%;
              img {
                width: auto;
              }
              p {
                margin-top: 5px;
                font-size: 12px;
                & + img {
                  margin-top: 5px;
                }
              }
            }
          }
          input, textarea {
            display: block;
            margin-top: @m - 5px;
            resize: none;
          }
        }
        .d-button {
          padding: @p;
          button {
            padding: 10px 2*@p;
            width: 100%;
            color: #fff;
            background: @activeC;
            border: none;
            border-radius: @br;
            letter-spacing: 5px;
            &:disabled {
              background: #999;
            }
          }
        }
      }
    }

    .d-bottom {
      .flex-center;
      padding: 2*@p @p 4*@p;
      button {
        padding: 10px 2*@p;
        width: 100%;
        color: #fff;
        background: @activeC;
        border: none;
        border-radius: @br;
        letter-spacing: 5px;
        &:disabled {
          background: #999;
        }
      }
    }
  }

  .d-null {
    .flex-center;
    flex-direction: column;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #fff;
    &.success {
      i {
        background: url(../../../assets/images/end_of_questionnaire@2x.png) no-repeat center;
        background-size: 100%;
      }
    }
    i {
      width: 200px;
      height: 200px;
      background: url(../../../assets/images/closed@2x.png) no-repeat center;
      background-size: 100%;
    }
    p {
      margin-top: @m;
      color: @color9;
      font-size: 12px;
    }
    a {
      margin-top: 25px;
      padding: 5px 25px;
      color: @activeC;
      font-size: 12px;
      border: 1px solid @borderC;
      border-radius: @br;
    }
    p.tips {
      margin-top: 10px;
      font-size: 12px;
      span {
        margin-right: 3px;
        color: @activeC;
      }
    }
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
      .btn {
        margin-left: 5px;
        padding: 0 15px;
        height: 30px;
        line-height: 30px;
        align-self: center;
        font-size: 12px;
        color: #fff;
        background: @activeC;
        border-radius: 2px;
      }
    }

    .author_img {
      width: 54px;
      height: 54px;
      margin-right: 12px;
    }

    .author_img img {
      display: block;
      width: 54px;
      height: 54px;
      border-radius: 50%;
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
      .text-overFlow(1);
      color: #666;
      line-height: normal;
      &.introduce {
        .text-overFlow(1);
        padding-left: 20px;
        color: #999;
        background: url(~assets/images/icon_speciality@2x.png) no-repeat left;
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
</style>

