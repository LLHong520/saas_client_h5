<template>
  <div class="d-dialog">
    <transition name="bg">
      <div v-show="isShow" class="d-dialog-bg" @click="close"></div>
    </transition>

    <transition name="bounce">
      <div class="d-dialog-container" v-show="isShow" @click="close">
        <div class="container" @click.stop>
          <div class="top top-btn">
            <span class="cancel" @click="close">取消</span>
            <span class="title">选择地址</span>
            <span class="confirm-text" @click="confirm">确定</span>
          </div>

          <div class="content d-dialog-filter-area">
            <!--<div class="d-filter">
              <div class="area">
                <label>地区：</label>
                <span>{{ areaInfo.name }}</span>
                <i class="icon" :class="{ up: isFilter }"></i>
              </div>
              <form  action="javascript:void(0)" @submit="reGetData" class="search">
                <input v-model="params.name" type="search" name="search" placeholder="请输入关键字" @keyup.13="reGetData">
              </form>
            </div>-->

            <iwen-area
              ref="iwenArea"
              v-model="isFilter"
              :autoClose="false"
              :feedback="true"
              :isCity="true"
              @feedback="onFeedback"
              @callback="onArea"
            ></iwen-area>
          </div>

        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import iwenArea from "~/components/iwen/area.vue";

  export default {
    components: {
      iwenArea
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      options: {
        type: Object,
      }
    },
    data() {
      return {
        isFirst: true,
        isShow: false,
        isFilter: false,
        areaInfo: {
          name: "全国"
        },
      };
    },
    watch: {
      value() {
        this.isShow = this.value;
      },
      isShow(val) {
        val ? this.open() : this.close();
      }
    },
    created() {
      this.isShow = this.value;
    },
    methods: {
      reGetData() {

      },
      onArea(location) {
        this.areaInfo = location;
        if (this.isFirst) {
          this.confirm();
        }
      },
      onFeedback(location) {
        this.areaInfo = location;
      },
      refresh() {
        this.isFirst = true;
      },
      open() {
        /*document.body.addEventListener("touchmove", function (e) {
          let className = e.target.className;
          let pareant = e.target.parentElement;
          let pareantClassaNme = pareant.className;
          let oHeight = pareant.offsetHeight;
          let sHeight = pareant.scrollHeight;

          if (className.indexOf("ios-touchmove") > -1 || pareantClassaNme.indexOf("city") > -1) {
            if (sHeight > oHeight) {
              pareant.classList.add("touchmove-scroll");
              pareant.classList.remove("touchmove-auto");
            } else {
              e.preventDefault();
              pareant.classList.add("touchmove-auto");
              pareant.classList.remove("touchmove-scroll");
            }

            // e.preventDefault(); //阻止默认的处理方式(阻止下拉滑动的效果)
          }
        }, {passive: false});*/

        this.isFilter = true;
        this.$emit("open");
      },
      close() {
        this.$emit("input", false);
        this.$emit("close");
        // Object.assign(this.$data, this.$options.data());// 重置数据
      },
      confirm() {
        this.isFirst = false;
        this.$emit("confirm", this.areaInfo);
        this.close();
      },
      cancel() {
        this.$emit("cancel");
        this.close();
      }
    }
  };

</script>

<style lang="less" scoped>
  @import "../css/style.less";
  @m: 15px;
  @p: 15px;
  @br: 4px;
  @color: #2d2d2d;
  @borderColor: #efefef;
  @filterH: 40px;

  .d-filter {
    .flex-center;
    position: fixed;
    top: 44px;
    left: 0;
    right: 0;
    z-index: 995;
    margin: 0 auto;
    max-width: 760px;
    height: @filterH;
    line-height: @filterH;
    background: #fff;
    border-bottom: 1px solid @borderColor;
    box-sizing: border-box;
    .area {
      .flex-center;
      justify-content: normal;
      padding: 0 @p;
      width: 50%;
      color: #999;
      label {
        word-break: keep-all;
      }
      span {
        .text-overFlow(1);
        max-width: 90%;
        color: @color;
        line-height: normal;
      }
      i {
        flex: none;
        margin-left: @m/2;
        width: 10px;
        height: 10px;
        background: url(~assets/images/btn_down@2x.png) no-repeat center;
        background-size: 100%;
        transition: all .3s;
        &.up {
          transform: rotate(180deg);
        }
      }
    }
    .search {
      .flex-center;
      margin: 0 @p;
      padding: 0 @p/2 0 30px;
      flex: 1;
      border-radius: 25px;
      border: 1px solid #EFF2F7;
      background: url(~assets/images/icon_search@2x.png) no-repeat left #F6F8FB;
      background-size: 15px;
      background-position: 8px;
      overflow: hidden;
      input {
        flex: 1;
        height: 26px;
        line-height: 26px;
        background: transparent;
        font-size: 12px;
        &::-webkit-input-placeholder {
          color: #999;
        }
      }
      input[type="search"]::-webkit-search-cancel-button {
        display: none;
      }
    }
  }
</style>

