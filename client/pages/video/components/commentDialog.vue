<template>
  <div class="d-comment">
    <div class="d-comment-box">
      <input type="text" class="ipt_reply" @click.prevent="show" placeholder="谈谈你的想法…" readonly>
      <span v-if="!VX_isInApp" @click="onShare(false)"><i class="icon share"></i><em>分享</em></span>
      <span @click="saveAction" :class="{ active: ifUsed }"><i class="icon good"></i><em>{{ articleInfo.helpNum || "赞" }}</em></span>
    </div>

    <!-- 评论弹窗 -->
    <transition name="share">
      <div v-show="isShow" class="dialogBG"></div>
    </transition>

    <transition name="bounce">
      <div class="dialog" v-show="isShow" @click="close">
        <div class="container" @click.stop>
          <div class="top">
            <span class="cancel" @click="close">取消</span>
            <span class="title">发表评论</span>
            <span
              class="confirm"
              :class="{ disabled: !isSubmit && content.length == 0 }"
              @click="submit"
            >
            {{ isSubmit ? "发送中" : "发送" }}
          </span>
          </div>

          <div class="content">
            <textarea ref="textarea" v-model="content" @blur.prevent="handelScrollTop" placeholder="请输入内容..." :maxlength="maxlength"></textarea>
            <p class="word_limit">{{ maxlength - content.length }}</p>
          </div>
          <!--<div class="bottom"></div>-->
        </div>
      </div>
    </transition>

    <!-- 分享 -->
    <m-share ref="shareRef" :show.sync="isShare" :config="shareConfig" @success="shareSuccess"></m-share>
  </div>
</template>

<script>
  import { commonMixin } from "~/mixins";
  import share from "~/components/iwen/share.vue";

  export default {
    name: "commentDialog",
    mixins: [commonMixin],
    components: {
      mShare: share,
    },
    props: {
      value: {
        type: String
      },
      maxlength: {
        type: Number,
        default: 1000
      },
      articleInfo: Object,
      ifUsed: {
        type: [Boolean, Number],
      },
      loading: {
        type: Boolean,
        default: false
      },
      isSubmit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        isShare: false,
        shareConfig: {},
        isShow: false,
        content: ""
      };
    },
    watch: {
      value(val) {
        this.content = val;
      },
      content(val) {
        this.$emit("input", val);
      }
    },
    created() {
      this.onShare(true);
    },
    methods: {
      submit() {
        this.$emit("submit");
      },
      saveAction() {
        this.$emit("saveAction");
      },
      handelScrollTop(){
        window.scrollTo(0,0);
      },
      show() {
        if (!this.$parent.toCheckDoctor()) { return; }
        this.isShow = true;
        this.$emit("open");
        this.$nextTick(() => {
          this.handelScrollTop();
        });
      },
      close() {
        this.isShow = false;
        this.handelScrollTop();
        this.$emit("close");
      },
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
      shareSuccess() {
        this.$emit("shareSuccess");
      }
    }
  };
</script>

<style lang="less" scoped>
  @import "~assets/css/config.less";

  .d-comment {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    margin: 0 auto;
    max-width: 760px;
    background-color: #fff;
    color: #2688FC;
    box-shadow: 0 0 8px #f2f2f2;
    z-index: 998;

    .d-comment-box {
      display: flex;
      align-items: center;
      padding: 0 10px;
      height: 47px;
      border-top: 1px solid @borderC-light;
      background: #fff;
      input {
        flex: 1;
        padding: 0 @p;
        height: 32px;
        line-height: 32px;
        font-size: 14px;
        border-radius: 25px;
        border: 1px solid @borderC-light;
        background: @moduleBg;
        &::-webkit-input-placeholder {
          color: @color9;
          font-size: 14px;
        }
      }
      span {
        flex: none;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-left: 10px;
        height: 42px;
        line-height: normal;
        color: @color9;
        font-size: 12px;
        em {
          margin-top: -5px;
          -webkit-transform: scale(0.83);
          line-height: normal;
        }
        &.active {
          color: @activeC;
          .good{
            background: url(~assets/images/toolbar_icon_favour_pre@2x.png) no-repeat center;
            background-size: auto 100%;
          }
        }
      }
      .icon {
        flex: none;
        width: 30px;
        height: 30px;
        &.share{
          background: url(~assets/images/toolbar_icon_share@2x.png) no-repeat center;
          background-size: auto 100%;
        }
        &.good{
          background: url(~assets/images/toolbar_icon_favour@2x.png) no-repeat center;
          background-size: auto 100%;

        }
      }
    }

    .dialogBG {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      margin: 0 auto;
      max-width: 760px;
      background: rgba(0, 0, 0, .4);
      z-index: 998;
    }

    .dialog {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      margin: 0 auto;
      max-width: 760px;
      /*background: rgba(0, 0, 0, .4);*/
      z-index: 999;
      .container {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        flex-direction: column;
        border-radius:6px 6px 0px 0px;
        background: #fff;
        overflow: hidden;
        .top {
          .flex-center;
          padding: 0 10px;
          height: 47px;
          line-height: 47px;
          color: @color3;
          font-size: 14px;
          background: @moduleBg;
          span {
            flex: none;
            text-align: center;
            min-width: 50px;
          }
          .cancel {
            text-align: left;
          }
          .title {
            flex: 1;
            font-weight: bold;
          }
          .confirm {
            padding: 0 @p;
            height: 27px;
            line-height: 27px;
            color: #fff;
            background: @activeC;
            border-radius: 25px;
            &.disabled {
              opacity: .3;
            }
          }
        }
        .content {
          display: flex;
          flex-direction: column;
          height: 100%;
          textarea {
            display: block;
            padding: @m;
            width: 100%;
            min-height: 180px;
            font-size: 16px;
            border: none;
            resize: none;
            &::-webkit-input-placeholder {
              color: @color9;
              font-size: 16px;
            }
          }
          .word_limit {
            padding: @p;
            font-size: 13px;
            color: @color9;
            text-align: right;
          }
        }
      }
    }
  }

  .bounce-enter-active {
    animation: bounce-in .3s;
  }
  .bounce-leave-active {
    animation: bounce-out .3s;
  }
  @keyframes bounce-in {
    0% {
      transform: translateY(80%);
      opacity: 0;
    }

    100% {
      transform: translateY(0);
      opacity: 1;
    }
  }
  @keyframes bounce-out {
    0% {
      transform: translateY(100%);
      opacity: 1;
    }

    100% {
      transform: translateY(80%);
      opacity: 0;
    }
  }

  .share-enter-active {
    animation: share-in .3s;
  }
  .share-leave-active {
    animation: share-out .3s;
  }
  @keyframes share-in {
    0% {
      opacity: 0;
    }

    100% {
      opacity: 1;
    }
  }
  @keyframes share-out {
    0% {
      opacity: 1;
    }

    100% {
      opacity: 0;
    }
  }
</style>
