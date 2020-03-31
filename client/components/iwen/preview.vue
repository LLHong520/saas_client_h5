<template>
  <div class="iwen-img-preview" v-show="value">
    <div class="header">
      <span class="close" @click="close"></span>
    </div>
    <div class="content">
      <div v-if="dataList.length != 0" v-swiper:imgPreview="swiperOption" @slideChange="slideChange">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="(item, index) in dataList" :key="index">
            <div class="swiper-zoom-container">
              <img :src="item.url">
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      {{ activeIndex }}/{{ swiperLenth }}
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      value: {
        type: Boolean,
        default: false
      },
      list: {
        type: Array,
        default: []
      },
      index: {
        type: Number,
        default: 1
      }
    },
    data() {
      return {
        dataList: [],
        activeIndex: 1,
        swiperOption: {
          loop: true,
          centeredSlides: true,
          zoom: {
            maxRatio: 3
          }
        },
      };
    },
    computed: {
      swiperLenth() {
        return this.list.length;
      },
    },
    watch: {
      value(val) {
        if (val) {
          this.open();

          if (this.swiperLenth == 1) {
            this.swiperOption.loop = false;
            this.swiperOption.autoplay = false;
          }
        } else {
          this.dataList = [];
        }
      }
    },
    created() {
      this.activeIndex = this.index;
      this.dataList = this.list;
    },
    methods: {
      open() {
        this.dataList = this.list;
        this.activeIndex = this.index;
        this.$nextTick( () => {
          // console.log(this.activeIndex,"士大夫士大夫士大夫");
          this.imgPreview.slideTo(this.activeIndex, 0);
        });

        this.$emit("open");
        this.pushHistory();
        this.addEventListener();
      },
      close() {
        this.dataList = [];
        this.activeIndex = 1;

        if (this.imgPreview && this.imgPreview.zoom) {
          this.imgPreview.zoom.out();
        }

        this.$emit("input", false);
        this.$emit("close");
        window.history.go(-1);
      },
      slideChange() {
        let index = this.imgPreview.activeIndex;
        const len = this.swiperLenth;

        if (index > len) {
          this.activeIndex = 1;
        } else if (index < 1) {
          this.activeIndex = len;
        } else {
          this.activeIndex = index;
        }
      },
      pushHistory() {
        let route = this.$route.fullPath;
        let state = {
          title: "title",
          url: "#imgPreview"
        };

        window.history.pushState(state, null, route);
      },
      addEventListener() {
        window.addEventListener("popstate", (e) => {
          // 打开图片预览时，监听返回事件
          this.removeEventListener();
        }, false);

        window.addEventListener("beforeunload", (e) => {
          // 打开图片预览时，监听刷新事件
          this.removeEventListener();
        }, false);
      },
      removeEventListener() {
        if (this.imgPreview && this.imgPreview.zoom) {
          this.imgPreview.zoom.out();
        }

        this.$emit("input", false);
        this.$emit("close");
        window.removeEventListener("popstate", null);
      }
    }
  };
</script>
<style scoped lang="less">
  .iwen-img-preview {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #000;
    z-index: 2000;
    .header {
      .close {
        position: absolute;
        top: 10px;
        right: 10px;
        width: 40px;
        height: 40px;
        background: url(../../assets/images/btn_icon_cancel_pure1@2x.png) no-repeat ;
        background-size: 100%;
        border-radius: 50%;
        z-index: 2;
      }
    }
    .content {
      display: flex;
      align-items: center;
      height: 100%;
      /deep/ .swiper-container {
        width: 100%;
        height: 100%;
        .swiper-slide {
          display: flex;
          align-items: center;
        }
      }
    }
    .footer {
      position: absolute;
      left: 50%;
      bottom: 17px;
      transform: translateX(-50%);
      padding: 0 10px;
      color: #fff;
      background: rgba(0, 0, 0, .4);
      border-radius: 25px;
      font-size: 14px;
      line-height: 24px;
      z-index: 2;
    }
  }
</style>
