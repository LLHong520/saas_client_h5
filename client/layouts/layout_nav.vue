<template>
  <div class="layout_wrapper">
    <nuxt />
    <!-- 底导 -->
    <m-fnav :activeIndex="1"></m-fnav>
    <!-- 底导 end-->
  </div>
</template>
<script>
  import pageMixins from "./pageMixins";
  import fnav from "~/components/f_nav.vue";

  export default {
    mixins: [pageMixins],
    components: {
      mFnav: fnav
    },
    data() {
      return {};
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
    mounted() {

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
    width: 100%;
    height: 100%;
  }

  *,
  *:before,
  *:after {
    box-sizing: border-box;
    margin: 0;
  }

  @media (-webkit-min-device-pixel-ratio:2),
  (min-device-pixel-ratio:2) {

    div,
    section,
    li,
    header,
    * {
      border-width: 0.5px;
    }
  }

  @media (-webkit-min-device-pixel-ratio:3),
  (min-device-pixel-ratio:3) {

    div,
    section,
    li,
    header,
    * {
      border-width: 0.3px;
    }
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
