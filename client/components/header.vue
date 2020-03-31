<template>
  <div class="header">
    <header v-show="!isHideHeader" :class="{'border_on':border_on}">
      <a href="javascript:;" class="back" v-if="back_on" @click="router_back"></a>
      <slot name="header"><h2 class="tit">{{title}}</h2></slot>
      <a href="javascript:;" class="icon-share" v-if="share_on" @click="share"></a>
    </header>
    <div v-show="!isHideHeader" class="blank44">&nbsp;</div>

    <!-- 咨询室浮窗-->
    <!--<m-consult></m-consult>-->

    <!-- 微信、微博客户端导航 -->
    <no-ssr>
      <template v-if="isHideHeader && isSuspension">
        <!-- 全部按钮 -->
        <div class="d-supernatant" v-if="isShowSuspensionAll">
          <div class="left ">
            <a href="javascript:;" @click="share"><i class="icon share"></i>分享</a>
            <!-- <nuxt-link to="/"><i class="icon home"></i>首页</nuxt-link> -->
            <a href="javascript:;" v-show="isShowHomeIcon" @click="toHomeRoute"><i class="icon home"></i>首页</a>
          </div>
          <div class="right">
            <nuxt-link v-if="readMoreLink" :to="readMoreLink">
              <span>浏览</span>
              <span>更多</span>
            </nuxt-link>
          </div>
        </div>

        <!-- 一个或两个按钮 -->
        <div v-else class="d-suspension">
          <a href="javascript:;" v-show="isShowHomeIcon" class="home" @click="toHomeRoute"></a>
          <nuxt-link v-if="readMoreLink" :to="readMoreLink">
            <span>浏览</span>
            <span>更多</span>
          </nuxt-link>
        </div>
      </template>
    </no-ssr>
  </div>
</template>

<script>
  import {mapGetters} from "vuex";
  import consult from "~/components/overlays/consult.vue";

  export default {
    name: "mHeader",
    components: {
      mConsult: consult
    },
    props: {
      title: {
        type: String,
        default: ""
      },
      homePageUrl: {
        type: String,
        default: ""
      },
      back_on: {
        type: Boolean,
        default: true
      },
      share_on: {
        type: Boolean,
        default: false
      },
      backNum: {
        type: Number,
        default: -1
      },
      border_on: {
        type: Boolean,
        default: true
      },
      isSuspension: {
        type: Boolean,
        default: false
      },
      readMoreLink: {
        type: String,
      }
    },
    data() {
      return {};
    },
    mounted() {

    },
    computed: {
      ...mapGetters({
        VX_isInApp: "isInApp",
      }),
      isOtherAgent() {
        if (this.$platformInfo) {
          let os = this.$platformInfo.os;
          return os.isWx || os.isWeibo || os.isMp;
        } else {
          return false;
        }
      },
      isHideHeader() {
        return this.isOtherAgent || this.VX_isInApp;
      },
      isShowSuspensionAll() {
        // 展示全部悬浮按钮
        return this.isSuspension && this.share_on;
      },
      isShowHomeIcon(){
        /*
        * 如果当前社区为 默沙东HPV社区 则修改返回首页icon跳转链接为 科普主场125号专题
        * 上海运营同事提出的特殊需求
        */
        //需要过滤掉港澳台地区的社区id列表
        let hpvComtyId = "5d5cd63dc44e7800089eaa3e";
        const filterComtyIds = ["5d009fbc3cdea20006e9ba37","5c0489e68a1e0e0008118bf1",hpvComtyId];
        let is = true;
        if(filterComtyIds.indexOf(this.$store.state.comtyId) >= 0){
          is = false;
        }
        return is;
      }
    },
    methods: {
      toHomeRoute(){
        let to = {
          path:"/",
          query:{}
        };
        if(this.$route.query.comtyId||this.$store.state.comtyId){
          to.query.comtyId = this.$route.query.comtyId||this.$store.state.comtyId;
        }
        this.$router.push(to);
      },
      router_back() {
        if (window.history.length <= 1) {
          this.$router.push({
            path: "/"
          });
        } else {
          this.$router.back(parseInt(this.backNum));
        }
      },
      share(){
        this.$emit("shareFn");
      }
    }
  };

</script>

<style lang="less" scoped>
  @p: 15px;

  .d-supernatant {
    position: relative;
    z-index: 10;
    .left, .right {
      position: fixed;
      bottom: 55px;
      left: @p;
      z-index: 2;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 42px;
      color: #fff;
      font-size: 12px;
      background: rgba(40,40,40,0.8);
      border-radius: 25px;
      a {
        display: flex;
        align-items: center;
        color: inherit;
        width: 100%;
        height: 100%;
      }
    }

    .left {
      bottom: 55px;
      padding: 0 13px;
      height: 38px;
      a + a {
        margin-left: 20px;
      }
    }

    .right {
      left: unset;
      right: @p;
      border-radius: 50%;
      width: 42px;
      a {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        line-height: 16px;
      }
    }

    .icon {
      flex: none;
      margin-right: 5px;
      width: 24px;
      height: 24px;
      &.share {
        background: url(~assets/images/icon_share_w@2x.png) no-repeat center;
        background-size: 100%;
      }
      &.home {
        background: url(~assets/images/icon_home_w@2x.png) no-repeat center;
        background-size: 100%;
      }
    }
  }
</style>

<style scoped>
  .header header {
    position: fixed;
    top: 0;
    z-index: 996;
    margin: 0 auto;
    height: 44px;
    width: 100%;
    max-width: 760px;
    background-color: #fff;
    box-sizing: border-box;
  }

  .header .blank44 {
    height: 44px;
  }

  .back {
    position: absolute;
    left: 5px;
    top: 2px;
    display: block;
    width: 40px;
    height: 40px;
    background: url(../assets/images/nav_back@2x.png) no-repeat center center;
    background-size: 40px 40px;
  }
  .icon-share {
    position: absolute;
    right: 5px;
    top: 2px;
    display: block;
    width: 40px;
    height: 40px;
    background: url(../assets/images/nav_share@2x.png) no-repeat center center;
    background-size: 36px;
  }

  .header {
    margin: 0 auto;
    max-width: 760px;
  }

  .header h2 {
    width: 100%;
    padding: 0 50px;
    box-sizing: border-box;
    line-height: 43px;
    text-align: center;
    font-size: 16px;
    font-weight: 700;
    color: #282828;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .header .border_on {
    border-bottom: 1px solid #EFEFEF;
  }
  @media only screen and (min-width: 760px) ,@media screen and(min-device-width:760px){
    .header{
      z-index: 996;
      height: 44px;
      background-color: #fff;
      box-sizing: border-box;
    }
    .header header{
      position: fixed;
      top: 0;
      z-index: 996;
      height: 44px;
      background-color: #fff;
      box-sizing: border-box;
    }
  }
</style>
