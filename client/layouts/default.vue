<template>
  <div class="layout_wrapper">
    <nuxt />
  </div>
</template>
<script>
  import pageMixins from "./pageMixins";

  export default {
    mixins: [pageMixins],
    data() {
      return {
        setHeightTimer:null,
        timerCount:0,
      };
    },
    beforeCreate() {
      // if (process.client) {
      //   try {
      //     let UA = navigator.userAgent;
      //     let isIos = UA.toLowerCase().indexOf("iphone") > 0 ? true : false;
      //     let isPC = window.screen.width>780;
      //     if (window.parent !== window && (isIos||isPC)) {
      //       console.log("被iframe嵌套");
      //       window.top.location.href = window.location.href;
      //     } else {
      //       console.log("没有被嵌套");
      //       console.log(window.location.href);
      //     }
      //   } catch (error) {
      //     console.log("error");
      //   }
      // }
    },
    mounted(){
      // this.setHeightTimer = setInterval(() => {
      //   let pageHeight = $("#__nuxt").eq(0).height();
      //   if(this.timerCount < 9){
      //     try {
      //       App.trigger("setPageHeight", pageHeight);
      //     } catch (error) {
      //       console.log("调用微博api失败");
      //     }
      //   }
      // }, 10000);
    },
    created() {

    },
    methods: {

    }
  };

</script>

<style>
  html {
    font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
      Roboto, 'Helvetica Neue', Arial, sans-serif;
    font-size: 16px;
    word-spacing: 1px;
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    box-sizing: border-box;
  }

  *,
  *:before,
  *:after {
    box-sizing: border-box;
    margin: 0;
  }

  @media only screen and (min-width: 768px),
  @media screen and(min-device-width:760px) {
    #__nuxt {
      position: relative;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      height: 100%;
      overflow-y: auto;
      overflow-x: hidden;
      -webkit-overflow-scrolling: touch;
      width: 760px;
      margin: 0 auto;
    }
  }

</style>
