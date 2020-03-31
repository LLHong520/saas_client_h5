<template>
  <div>
    <transition name="share">
      <div class="action_mask" v-show="show" @click="hideAction"></div>
    </transition>
    <transition name="bounce">
      <div class="action share" v-show="show">
        <p class="title">分享到</p>
        <div class="share-list">
          <ul class="clearfix">
            <li v-show="isInWx">
              <a href="javascript:void(0);" @click="shareWx"><!-- v-clipboard:copy="fullPath" v-clipboard:success="onCopy" -->
                <img src="~/assets/images/share_icons/login_btn_wechat@2x.png"  />
                <p>微信</p>
              </a>
            </li>
            <li  v-show="isInWx">
              <a href="javascript:void(0);" @click="shareWx"><!-- v-clipboard:copy="fullPath" v-clipboard:success="onCopy" -->
                <img src="~/assets/images/share_icons/login_btn_pyq@2x.png" alt="爱问医联" />
                <p>朋友圈</p>
              </a>
            </li>
            <li>
              <a href="javascript:;" @click="shareSina()">
                <img src="~/assets/images/share_icons/login_btn_weibo@2x.png" alt="爱问医联" />
                <p>新浪微博</p>
              </a>
            </li>
          </ul>
        </div>
        <div class="action_btn" @click="hideAction">取消</div>
      </div>
    </transition>

    <!-- 微信 -->
    <div class="wechatImg" v-show="showWx" @click="shareWx">
      <img src="~/assets/images/share_icons/wechat-share-tips.png" alt="爱问医联" />
    </div>

  </div>
</template>
<script>
  import LOGO_URL from "@/assets/images/icon_weibo@2x.png";
  import DEFAULT_IMG from "@/assets/images/66x66.png";
  import shareFns from "~/plugins/share.js";
  import { APP_URL } from "~/config";
  import sysService from "~/services/sysService.js";
  import articleService from "~/services/articleService.js";
  import jsCallSinaHealth from "~/native/jsCallSinaHealth.js";

  export default {
    props:{
      title:{
        type:String,
        default:"",
      },
      cancel:{
        type:Function,
        default:()=>{},
      },
      confirm:{
        type:Function,
        default:()=>{},
      },
      show:{
        type:Boolean,
        default:false,
      },
      contorl_skin:{
        type:Boolean,
        default:false,
      },
      isAutoFocus: {
        type:Boolean,
        default:true,
      },
      config: Object
      /*{
        id: "",
        type: "",
        title: "",
        path: "",
        content: "",
        imgUrl: "",
        appHidden: "",
      }*/
    },
    data(){
      return {
        setTimeouter: null,
        showWx: false,
        sharePath: "",
        fullPath: "",
        comtyInfo: {
          comtyName: "社区标题"
        },
        sinaConfig:{
          title:"",
          img:"",
          url:"",
        },
      };
    },
    computed: {
      isInWx() {
        let isWx = process.client
          ? this.$platformInfo.os.isWx
          : false;

        return isWx;
      }
    },
    created() {
      this.sharePath = this.$route.fullPath;
      this.fullPath = APP_URL + this.sharePath;
    },
    beforeMount() {
      if (this.isInWx) {
        this.setWxConfig();
      }
    },
    mounted() {
      window.shareFinish = this.shareCallback;// 爱问诊室分享回调

      if (this.config.appHidden != undefined && this.config.appHidden === false) {
        this.appShare();
      }

      this.autoFocusWeibo();
    },
    beforeDestroy() {
      if (this.setTimeouter) {
        clearTimeout(this.setTimeouter);
      }
    },
    methods: {
      getWeiboConfig() {
        let title = this.config.title.length > 50
          ? this.config.title.slice(0,50) + "..."
          : this.config.title;

        let path = this.config.path
          ? APP_URL + this.config.path
          : this.fullPath;

        let map = {
          "community": 1,
          "article": 2,
          "subject": 3,
          "post": 4,
          "consulting_room": 5,
          "question_naire": 6,
          "community_intro": 7,
          "health": 10,
          "notice": 11,
          "video": 12,
          "hospital": 13,
        };

        return {
          img: LOGO_URL,
          url: encodeURIComponent(path),
          title: title,
          type: map[this.config.type],
          id: this.config.id || this.$store.state.comtyId,
        };
      },
      hideAction() {
        this.$emit("cancel");
        this.$emit("update:show",false);
      },
      confirmAction(type) {
        this.$emit("confirm",{ type:type });
        this.$emit("update:show",false);
      },
      setWxConfig() {
        let requestUrl = "https://health.sina.cn/weixin/v1/getJsApiTick";
        let params = {
          shareURL:this.fullPath
        };

        sysService.getWxConfig(params, requestUrl)
          .then(res=>{
            if(res && res.appId){
              shareFns.setConfig(res);
              return true;
            }else{
              //签名失败
              return false;
            }
          }).then((isConfig)=>{
            if(isConfig){
              let path = this.config.path
                ? APP_URL + this.config.path
                : this.fullPath;

              shareFns.setShareInfo({
                lineLink: path,
                imgUrl: this.config.imgUrl || DEFAULT_IMG,
                shareTitle: this.config.title,
                descContent: this.config.content
              }, this.shareCallback);
            }
          });

        // 本地测试
        /*let res = {
          "appId":"wxc9772e3fed88a7d2",
          "nonceStr":"17b24887cf4e42c99d54ed384cd869d4",
          "signature":"2013aff309199455d9e0d5fb3e16b652e422db86",
          "timestamp":1560498941,
          "url":"https://health.sina.cn/c/?comtyId=5c0489e68a1e0e0008118bf1"
        };
        shareFns.setConfig(res);
        let path = this.config.path
          ? APP_URL + this.config.path
          : this.fullPath;

        shareFns.setShareInfo({
          lineLink: path,
          imgUrl: this.config.imgUrl || DEFAULT_IMG,
          shareTitle: this.config.title,
          descContent: this.config.content
        });*/
      },
      shareWx() {
        this.$emit("update:show",false);
        this.showWx = !this.showWx;
      },
      shareSina() {
        this.shareCallback();
        setTimeout( () => {
          window.location.href = this.GET_WB_SHAREURL(this.sinaConfig);
        }, 500);
      },
      GET_WB_LINKCARD_URL(config) {
        let channel = new Date().getTime(); // 必须
        let linkcard = `https://health.sina.cn/linkcard/community_biz/${ config.type }/${ config.id }.htm?channel=${ channel }`;
        // let linkcard = `https://health.sina.cn/linkcard/saas/community_biz/${ config.type }/${ config.id }.htm?channel=${ channel }`;// 新（测试中7.16
        return linkcard;
      },
      GET_WB_SHAREURL() {
        let config = this.getWeiboConfig();

        // h5分享到微博linkcard
        let linkcard = this.GET_WB_LINKCARD_URL(config);

        // 暂时 - 7.19
        if (config.type == 13) {
          linkcard = this.config.path;
        }

        return `https://service.weibo.com/share/mobile.php?
        language=zh_cn&title=${ linkcard }
        &searchPic=true`;
        /*url=${ config.url }*/
      },
      onCopy() {
        this.$toast.tip("链接已复制，可以去粘贴分享啦！");
      },
      appShare() {
        let config = this.getWeiboConfig();
        let path = this.GET_WB_LINKCARD_URL(config);

        jsCallSinaHealth.hiddenShare({
          hidden: this.config.appHidden,
          share: {
            title: this.config.title,
            url: path,
            img: this.config.imgUrl || DEFAULT_IMG,
            content: this.config.content,
            linkcardURL: path,
            sourceURL: this.fullPath,
          }
        });
      },
      shareCallback() {
        // 分享回调
        console.log("###share success");
        this.$emit("success");
      },
      autoFocusWeibo() {
        if (!this.isAutoFocus) {
          return;
        }
        if (!this.$platformInfo.os.isWeibo) {
          return;
        }
        // 自动关注微博
        if (this.$store.getters.isLogin) {
          this.setTimeouter = setTimeout( () => {
            articleService.addFocusForLanV({
              userId: this.$store.state.userInfo.id,
              type:this.config.type
            });
          }, 5000);
        }

      }
    }
  };
</script>

<style scoped lang="less">
  .wechatImg{
    position:fixed;
    left:0;
    top:0;
    right:0;
    bottom: 0;
    z-index: 9998;
    background-color:rgba(0,0,0,.7);
    img{
      width:200px;
      position: absolute;
      right: 0;
      top:0;
    }
  }

  .contorl-skin{
    // color:@main_c;
    b{
      width:30px;
      height:20px;
      line-height: 20px;
      font-size:36px;
      display: inline-block;
      position: relative;
      // top:10/@r;
      top:5px;
    }
  }
  .action{
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: #F6F8FB;
    z-index: 9999;
    .action_title{
      padding: 0 20px;
      color: #888;
      border-bottom: 1px solid #efefef;
      height: 40px;
      background-color: #fff;
      line-height: 40px;
      text-align: center;
      color:#4A90E2
    }
    .action_content{
      color: #666;
      .item{
        padding: 0 20px;
        font-size:16px; //.font_xl;
        border-bottom: 1px solid #efefef;
        line-height: 2.6;
        background-color: #fff;
        text-align: center;
      }
    }
    .action_btn{
      font-size:15px; //.font_xl;
      height: 50px;
      line-height: 50px;
      margin-top: 25px;
      background-color: #fff;
      text-align: center;
      color: #2D2D2D;
      background: #fff;
    }
  }

  .action_mask{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #000;
    opacity: 0.5;
    z-index: 8;
  }
  .share{
    .title{
      padding:20px;
      color:#999;
      font-size:12px; //.font_xl;
      text-align: center;
    }
  }

  .share-list ul {
    display: flex;
    justify-content: center;
    padding: 0 20px;
  }
  .share-list ul li{
    float: left;
    width: 33%;
    text-align: center;
    img{
      width:50px;
      height:50px;
      margin: 0 auto;
    }
    p{
      color:#282828;
      font-size:12px; //.font_xl;
      padding-top:10px;
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
      transform: translateY(300px);
    }

    100% {
      transform: translateY(0px);
    }
  }
  @keyframes bounce-out {
    0% {
      transform: translateY(0px);
    }

    100% {
      transform: translateY(300px);
    }
  }
</style>
