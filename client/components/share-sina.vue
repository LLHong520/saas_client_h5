<template>
<div>
<transition name="share">
  <div class="action_mask" v-show="show" @click="hideAction"></div>
</transition>
<transition name="bounce">
  <div class="action share" v-show="show">
    <div class="cont-top">
      <span @click="cancel" class="cancel">{{cancelBtnText}}</span>
      <span class="title">{{title}}</span>
      <span @click="confirm" class="confirm">{{confirmBtnText}}</span>
    </div>
    <div class="share-wrapper clearfix">
      <p class="share-content">{{conInfo.sharedContent}}</p>
      <div class="share-img">
        <img :src="GET_IMG_URL(conInfo.sharedImg)" />
        <p class="content-len">{{conInfo.sharedContent.length}}/120</p>
      </div>
    </div>
  </div>
</transition>
</div>

</template>
<script>
import { commonMixin } from "@/mixins";
export default {
  mixins: [commonMixin],
  props:{
    title:{
      type:String,
      default:"新浪微博",
    },
    confirmBtnText: {
      type: String,
      default: "确定"
    },
    cancelBtnText: {
      type: String,
      default: "取消"
    },
    show:{
      type:Boolean,
      default:false,
    },
    conInfo:{
      type: Object,
      default:{}
    }
  },
  computed:{},
  data(){
    return {};
  },
  methods: {
    hideAction(){
      this.$emit("cancel");
      this.$emit("update:show",false);
    },
    cancel() {
      this.$emit("cancel");
    },
    confirm() {
      this.$emit("confirm");
      this.$emit("update:show",false);
    },
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
    top:10px;
    // top:10/@r;
  }
}
.action{
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  // height: 300px;
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
      font-size:16px;//.font_xl
      border-bottom: 1px solid #efefef;
      line-height: 2.6;
      background-color: #fff;
      text-align: center;
    }
  }
  .action_btn{
    font-size:16px;//.font_xl
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

.cont-top{
  position: relative;
  height: 45px;
  line-height: 45px;
  padding:0 20px;
  border-bottom: 1px solid #EEEEEE ;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  .cancel{
    color: #999;
  }
  .confirm{
    color:#4B8CE7;
  }
  .title{
    color:#555;
  }
  span{
    display:inline-block;
  }
}
.share-wrapper{
  padding:20px;
  position: relative;
  .share-content{
    float: left;
    width:70%;
    padding:5px 10px 5px 0;
    color:#555555;
    font-size: 14px;
    a{
      color:#4B8CE7;
    }
  }
  .content-len{
    text-align:center;
    margin:0 auto;
    // padding:70/@r 0 10/@r;
    padding:35px 0 5px;
  }
  .share-img{
    float: right;
    width:25%;
    text-align:center;
  }
  .share-img img{
    margin:0 auto
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

@media screen and(min-device-width:760px){
  .share{
    width: 760px;
    left: 50%;
    margin-left: -380px;
    /*top: 50%;*/
    /*transform: translate(-50%,-50%);*/
    /*bottom: auto;*/
  }
}
</style>
