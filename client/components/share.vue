<template>
<div>
<transition name="share">
  <div class="action_mask" v-show="show" @click="hideAction"></div>
</transition>
<transition name="bounce">
  <div class="action share" v-show="show">
      <p class="title">分享是一种美德</p>
      <div class="share-list">
        <ul class="clearfix">
          <li v-show="isInWx"  @click="confirmAction('wx')">
            <a href="javascript:void(0);">
              <img src="~/assets/images/share_icons/login-wechat@2x.png"  />
              <p>微信</p>
            </a>
          </li>
          <li  v-show="isInWx"  @click="confirmAction('wx')">
            <a href="javascript:void(0);">
              <img src="~/assets/images/share_icons/icon-piaoquan@2x.png" alt="爱问医联" />
              <p>朋友圈</p>
            </a>
          </li>
          <li>
            <a href="javascript:;" @click="confirmAction('wb')">
              <img src="~/assets/images/share_icons/login-others@2x.png" alt="爱问医联" />
              <p>新浪微博</p>
            </a>
          </li>
        </ul>
      </div>
      <div class="action_btn" @click="hideAction">取消</div>
  </div>
</transition>
</div>

</template>
<script>
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
    }
  },
  data(){
    return {};
  },
  computed: {
    isInWx() {
      let isWx = false;
      if (process.client) {
        isWx = this.$platformInfo.os.isWx;
      }
      return isWx;
    }
  },
  methods: {
    hideAction(){
      this.$emit("cancel");
      this.$emit("update:show",false);
    },
    confirmAction(type){
      this.$emit("confirm",{
        type:type
      });
      this.$emit("update:show",false);
    }
  }
};
</script>
<style scoped lang="less">
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
  background-color: #fff;
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
    font-size:16px; //.font_xl;
    height: 40px;
    margin-top: 20px;
    background-color: #fff;
    line-height: 40px;
    text-align: center;
    color: #4A90E2;
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
    color:#555;
    font-size:16px; //.font_xl;
    padding:20px;
  }
}
.share-list ul li{
  float: left;
  width: 33%;
  text-align: center;
  img{
    width:44px;
    height:44px;
    margin: 0 auto;
  }
  p{
    color:#555;
    font-size:16px; //.font_xl;
    padding-top:10px;
  }
}



.bounce-enter-active {
  animation: bounce-in .5s;
}
.bounce-leave-active {
  animation: bounce-out .5s;
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
