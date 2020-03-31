<template>
  <section class="container">
    <m-header title="好友推荐" :share_on="true" @shareFn="share"></m-header>
    <div class="recommend-wrapper">
      <div class="recommend-card">
        <div class="Qr-wrapper">
          <img :src="QrCode.url" alt="" />
          <p class="Qr-name">我的推广二维码</p>
        </div>
      </div>
      <div class="recommend-firends">
        <div class="recommend-tips">
          <p class="recommend-tips-title">温馨提示</p>
          <p class="recommend-tips-content">受邀者注册成功后才算是成功邀请.<span v-show="isInWx">长按可保存二维码</span></p>
        </div>
        <div class="recommend-content">
          <div class="recommend-number">
            <em></em>
            成功推荐<span class="num"> {{recommend.total}} </span>位{{VX_identityInfo.type=="doctor"?"患者":"朋友"}}
            <em></em>
          </div>
          <ul class="recommend-list">
            <li v-for="(item,index) in recommend.list" :key="index">
              <div class="recommend-avatar"><img :src="item.headPicUrl" width="34" height="34" alt=""></div>
              <div class="recommend-info">
                <span class="name">{{item.userName}}</span> 在 <span class="time">{{item.createTime|dateFormat('YMDHM')}}</span> 接收了邀请
              </div>
            </li>
          </ul>
          <loading-btn
            :loading="recommend.loading_content"
            :title="recommend.loading_text"
            @loadFn="getRecommend()">
          </loading-btn>
          <!-- <p class="none-more">木有更多了~</p> -->
        </div>
      </div>
      <!-- 分享 -->
      <div v-if="VX_isInApp" class="btn_share" @click="share">
        <span></span>
      </div>
      <!-- 分享 -->
    </div>
    <!-- 分享弹窗 -->
    <share
      :show.sync="show_menu_share"
      @cancel="cancelShare"
      @confirm="confirmShare">
    </share>
    <!-- 分享弹窗 -->
    <!-- 微博分享 -->
    <share-sina
      :show.sync="show_wbShare"
      @cancel="cancelShareWb"
      @confirm="confirmShareWb"
      :conInfo="shareSinaInfo">
    </share-sina>
    <!-- 微博分享 -->
    <!-- 微信分享 -->
    <share-wechat :show.sync="show_wechatShare"></share-wechat>
    <!-- /微信分享 -->
  </section>
</template>

<script>
  import LOGO_URL from "@/assets/images/icon_weibo@2x.png";
  import shareFns from "~/plugins/share.js";
  import share from "~/components/share.vue";
  import shareSina from "~/components/share-sina.vue";
  import shareWechat from "~/components/share-wechat.vue";
  import header from "~/components/header.vue";
  import loadingBtn from "~/components/loading-btn/loading-btn";
  import { commonMixin,comtyIdValid,asyncDataMixin} from "~/mixins";
  import {APP_URL} from "~/config";
  import sysService from "~/services/sysService.js";
  import communityService from "~/services/communityService.js";
  export default {
    mixins: [commonMixin,comtyIdValid,asyncDataMixin],
    components: {
      mHeader: header,
      loadingBtn,
      share: share,
      shareSina: shareSina,
      shareWechat: shareWechat
    },
    data() {
      return {
        id:"",
        APP_URL,
        comtyId:"",//当前社区id
        comtyInfo:{},
        QrCode:{},//二维码
        sharePath:"",//分享路径
        channel:"SQSHARE0002",//分享渠道号
        recommend:{
          list:[],
          total:0,
          showLoadMore:true,
          loading_content:false,
          loading_text:"加载更多",
          show_noResult:false,
          nowPage:1,
        },
        //分享--
        show_menu_share:false,
        show_wbShare:false,
        show_wechatShare:false,
        shareSinaInfo:{
          sharedContent:"",
          sharedImg:"",
          sharedUrl:"",
        },
        //--分享
      };
    },
    computed: {
      isInWx(){
        let isWx = false;
        if (process.client) {
          isWx = this.$platformInfo.os.isWx;
        }
        return isWx;
      }
    },
    mounted() {
      this.init();

      // console.log("aaaa");
      // console.log(this.$route.fullPath);
      // console.log(this.VX_identityInfo);
    },
    methods: {
      init(){
        if(this.CHECK_LOGIN()){
          if(this.VX_identityInfo.type=="doctor"){
            this.id = this.VX_identityInfo.doctorId;
          }else{
            this.id = this.VX_userInfo.id;
          }
          this.comtyId = this.$route.query.comtyId;
          this.sharePath = "/invite?comtyId="+this.comtyId+"&userId="+this.id+"&userType="+this.VX_identityInfo.type+"&channel="+this.channel+"&businessType=share";
          this.getCommunityInstro();
          this.getQrCode();
          this.setShareInfo();
          this.getRecommend();
        }
      },
      /*分享开始*/
      setShareInfo(){
        let This=this;
        var lineLink =window.location.href.split("#")[0];
        var fd = {
          shareURL:lineLink
        };
        sysService.getWxConfig(fd)
          .then(res=>{
            // res = {
            //   "appId":"wxc9772e3fed88a7d2",
            //   "nonceStr":"232b5da3cb344a9e9ea58fb63d4a89c9",
            //   "signature":"0015a141c26d0334be047759fcf1a9abfc0d1e4a",
            //   "timestamp":1547776663,
            //   "url":"https://health.sina.cn/zt/doc/539eaec4e4b03c88184318b1"
            // };
            console.log(res);
            if(res&&res.appId){
              shareFns.setConfig(res);
              return true;
            }else{
            //签名失败
              return false;
            }
          }).then((isConfig)=>{
            console.log("isConfig=================");
            console.log(isConfig);
            if(isConfig){
              // let url=This.$route.fullPath;
              let url = This.APP_URL+This.sharePath;
              shareFns.setShareInfo({
                lineLink:url,
                imgUrl:LOGO_URL,
                shareTitle:`您好，您的朋友向您分享了[${this.comtyInfo.comtyName}]健康社区，快来看看吧！`,
                descContent:`您好，您的朋友向您分享了[${this.comtyInfo.comtyName}]健康社区，快来看看吧！`
              });
            }
          });
      },
      cancelShare(){
        this.show_menu_share=false;
      },
      share(){
        //设置分享信息
        let sharedContent = `您好，您的朋友向您分享了[${this.comtyInfo.comtyName}]健康社区，快来看看吧！`;
        if(sharedContent.length>120){
          this.shareSinaInfo.sharedContent=sharedContent.slice(0,117)+"...";
        }else{
          this.shareSinaInfo.sharedContent=sharedContent;
        }
        this.shareSinaInfo.sharedImg = LOGO_URL;
        this.shareSinaInfo.sharedUrl=encodeURIComponent(this.APP_URL+this.sharePath);//this.$route.fullPath
        //判断平台
        if(this.$platformInfo.os.isWx){
          this.show_menu_share=true;
        }else{
          this.shareByLink();
          return;

          //已经登录则展示绑定
          if(this.CHECK_LOGIN()){
            if(!this.VX_isBindWeibo){
              this.$refs.confirm_bind.show();
              return;
            }
            this.show_wbShare=true;
          }else{
            //未登录则跳转至链接分享
            this.shareByLink();
          }
        }
      },
      shareByLink(){
        let shareUrl=this.GET_WB_SHAREURL({
          url:this.shareSinaInfo.sharedUrl,
          title:this.shareSinaInfo.sharedContent,
          pic:this.shareSinaInfo.sharedImg,
        });
        window.location.href=shareUrl;
      },
      confirmShare(params){
        //微信分享直接显示微信分享提示
        if(params.type=="wx"){
          this.show_wechatShare=true;
        }else if(params.type=="wb"){

          this.shareByLink();return;

          //微博分享判断是否登录
          if(!this.CHECK_LOGIN()){
            return;
          }else{
            this.show_menu_share=false;
            this.show_wbShare=true;
          }
        }
      },
      cancelShareWb(){
        this.show_wbShare=false;
      },
      confirmShareWb(){
        let This=this;
        let url=this.APP_URL+This.sharePath;//This.$route.fullPath
        sysService.wbShare({
          sharedContent:this.shareSinaInfo.sharedContent,
          sharedUrl:encodeURIComponent(url),
          sharedImg:this.shareSinaInfo.sharedImg
        })
          .then(res=>{
            if(res.code==0){
              This.$toast.tip("分享成功");
            }else{
              This.$toast.tip("分享失败");
            }
          })
          .catch(()=>{
            This.$toast.tip("分享失败");
          });
      },
      /*分享结束*/
      getQrCode() {//获取二维码信息
        let queryParams = {
          content:this.APP_URL + this.sharePath,
          userId:this.id,
          channel:this.channel,
          businessType:"share"
        };
        sysService.getQrCodeImage(queryParams)
          .then(((res) => {
            if (res.status == 200 && res.data) {
              this.QrCode = res.data;
            }
          }));
      },
      getRecommend(){
        if (this.recommend.loading_content||!this.recommend.showLoadMore) return;
        let queryParams = {
          page:this.recommend.nowPage,
          size:10,
          comtyId:this.comtyId,
          userId:this.id,
          userType:this.VX_identityInfo.type,
          channel:this.channel
        };
        this.recommend.loading_content = true;
        sysService.getChannelCollect(queryParams)
          .then(((res) => {
            this.recommend.loading_content=false;
            if (res.status == 200 && res.data) {
              this.recommend.list = this.recommend.list.concat(res.data);
              this.recommend.total = res.total;
              this.recommend.nowPage += 1;
              // if(res.data.length<5||Math.ceil(res.total/data.pageSize)==this.recommend.nowPage-1){
              let pageCount=Math.ceil(res.total/10);
              if(this.recommend.nowPage>pageCount){
                this.recommend.showLoadMore=false;
                this.recommend.loading_text="没有更多了";
              }
            }else{
              this.recommend.loading_content=false;
              this.recommend.loading_text="";
            }
          }),function(){
            this.recommend.loading_content=false;
            this.recommend.loading_text="加载失败";
          });
      },
      getCommunityInstro() { //社区简介
        communityService.getCommunityInstro({})
          .then((res) => {
            if (res.status == 200) {
              this.comtyInfo = res.data;
            }
          });
      },
    },
    // beforeRouteEnter(to, from, next) {
    // // XXX: 修复iOS版微信HTML5 History兼容性问题
    //   console.log("=============");
    //   console.log(process);
    //   if (process.client) {
    //     console.log("client");
    //     var UA = navigator.userAgent;
    //     let isiOS = (function () {
    //       return UA.toLowerCase().indexOf("iphone") > 0 ? true : false;
    //     })();
    //     let isWx = (function () {
    //       return UA.toLowerCase().match(/MicroMessenger/i) == "micromessenger" ? true : false;
    //     })();
    //     // console.log(isiOS);
    //     // console.log(isWx);
    //     console.log("0000000");
    //     if (isiOS && isWx && to.path !== location.pathname) {
    //       console.log("aaaaaaaaa");
    //       // 此处不可使用location.replace
    //       location.assign(to.fullPath);
    //     } else {
    //       console.log("bbbb");
    //       next();
    //     }
    //   }else{
    //     console.log("no client");
    //   }
    // },
    head() {
      return {
        title: "好友推荐",
      };
    }
  };

</script>

<style lang="less" scoped>
  .recommend-wrapper {
    background-color: #fff;
    min-height: 800px;
    // padding-bottom: 40px;
  }
  .recommend-card{
    width:100%;
    height:272px;
    background: url(../../assets/images/share_bg_main@2x.png) no-repeat;
    background-size: 100% auto;
    padding-top: 90px;
    vertical-align: middle;
    text-align: center;
    .Qr-wrapper{
      margin: 0 auto;
      width:168px;
      height:215px;
      background: #fff;
      box-shadow:0px 4px 10px 0px rgba(0,89,166,0.07);
      border-radius:8px;
      img{
        width: 100%;
        height: auto;
        border-radius:8px;
      }
      .Qr-name{
        margin: 5px 12px 12px 12px;
        line-height: 30px;
        text-align: center;
        font-size: 13px;
        color: #666;
        background: #F4F4F4;
      }
    }
  }
  .recommend-firends{
    padding: 20px 25px;
    .recommend-tips{
      margin: 30px 7px 30px;
      font-size:12px;
      color:#999999;
      line-height:23px;
      text-align: center;
    }
  }
  .recommend-number{
    font-size:16px;
    color:#2D2D2D;
    text-align: center;
    margin-bottom: 10px;
    em{
      width:82px;
      height:1px;
      border-top:1px solid #666666;
      color:#666;
      display: inline-block;
      position: relative;
      top:-5px;
    }
    .num{
      color:#2688FC;
      font-size:16px;
      font-weight: 600;
    }
  }
  .recommend-list li{
    display: flex;
    align-items: center;
    padding: 20px 0;
    border-bottom: 1px solid #EFEFEF;
    .recommend-avatar{
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: #f2f2f2;
      img{
        width: 34px;
        height: 34px;
        border-radius: 50%;
      }
    }
    .recommend-info{
      margin-left: 10px;
      font-size: 13px;
      flex:1;
      // word-wrap: nowrap;
      // overflow: hidden;
      // text-overflow: ellipsis;
      // display: -webkit-box;
      // -webkit-line-clamp: 1;
      // -webkit-box-orient: vertical;
      .name{
        color:#2D2D2D;
        // font-size: 13px;
        font-weight:600;
      }
      .time{
        color:#2688FC;
      }
    }
  }
  .none-more{
    margin-top: 10px;
    line-height: 40px;
    color:#999;
    font-size:15px;
    text-align: center;
  }
  .btn_share {
    width: 74px;
    height: 74px;
    box-sizing: border-box;
    padding: 7px 12px 17px 12px;
    position: fixed;
    bottom: 100px;
    right: 0px;
    background: url(../../assets/images/post_btn_share@2x.png) no-repeat;
    background-size: cover;

    span {
      display: block;
      width: 50px;
      height: 50px;
    }
  }

</style>
