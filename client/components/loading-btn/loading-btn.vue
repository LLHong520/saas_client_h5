<!--
loading ==>加载中
loadFn ==>点击或滚动加载时执行的函数
title ==>未加载时的按钮文字
scroll_load ==>是否开启滚动加载 开启则滚动到页面底部就会加载，否则点击才会加载
 -->
<template>
  <div class="load-btn" @click='clickFn'>
     <div class="loading" v-if="loading">
       <img width="24" height="24" src="./loading.gif">
       <!-- <span></span>正在加载内容 -->
     </div>
      <div class="loading" v-if="!loading">{{title}}<span v-if="title=='加载更多'" class="icon-up"></span></div>
  </div>
</template>
<script>
  export default {
    name:"loading-btn",
    props: {
      loading: {
        type: Boolean,
        default: false
      },
      loadFn: {
        type: Function,
        default: function(){}
      },
      title:{
        type:String,
        default:"加载更多"
      },
      scroll_load:{
        type:Boolean,
        default:false
      }
    },
    created (){
      let This=this;
      if(this.scroll_load){
        This.$nextTick(function(){
          let wrapper_inner = $(this.getScrollEle());
          wrapper_inner.scroll(function(){
            if($(".load-btn").size()>0){
              let btn_top=$(".load-btn").eq(0).offset().top;
              let scrollTop=wrapper_inner.scrollTop();
              if(btn_top<(platformInfo.deviceInfo.height+scrollTop)){
                // console.log('加载');
                This.$emit("loadFn");
              }
            }
          });
        });
      }
    },
    methods: {
      clickFn() {
        this.$emit("loadFn");
      },//获取添加滚动事件的元素
      getScrollEle() {
        var u = navigator.userAgent;
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        var scrollEle=null;
        if(isiOS){
          scrollEle="#wrapper__inner";
        }else{
          scrollEle=window;
        }
        return scrollEle;
      }
    }
  };
</script>
<style scoped lang="less" rel="stylesheet/less">
  .load-btn{
    padding:10px;
  }
  .loading{
    width: 100%;
    text-align: center;
    color:#999;
    cursor: pointer;
    font-size:14px;
    border-radius:4px;
    .desc{
      line-height: 20px;
      font-size:12px;
      color:#ccc;
      padding: 15px 0;
    }
    img{
      margin: 0 auto;
    }
  }
  .icon-up{
    display: inline-block;
    margin: 0 auto;
    width:12px;
    height:8px;
    background:url(~assets/images/arrow_down_gray.png) no-repeat;
    background-size:12px auto;
    position: relative;
    left:3px;
  }
</style>
