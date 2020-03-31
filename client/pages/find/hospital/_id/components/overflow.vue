<template>
  <div class="d-box">
    <h3>{{ title }}</h3>

    <div v-if="!isText" class="_content">
      <slot :styles="domStyle"></slot>
    </div>

    <div
      v-else
      v-html="text"
      class="html-overFlow"
      :style="`-webkit-line-clamp:${ isShow ? 'unset' : line }`"
    ></div>

    <label v-if="isToggle" :class="{ up: isShow }" @click="onShow"></label>
  </div>
</template>

<script>
  export default {
    name: "overflow",
    props: {
      text: String,
      type: {
        type:String,
        default: "line" // line、text
      },
      title: {
        type: String,
        default: ""
      },
      line: {
        type: Number,
        default: 2
      },
      require: {
        type: Boolean,
        default: false
      },
      toggle: {
        type: Boolean,
        default: false
      },
      itemHeight: {
        type: Number | String,
        default: 0
      }
    },
    data() {
      return {
        isShow: false,
        isOverFlow: false,
        domOverflow: false,
        domHeight: "",
      };
    },
    computed: {
      domStyle() {
        if (!this.isShow) {
          return {
            maxHeight: this.domHeight + "px",
            overflow: "hidden"
          };
        } else {
          return {
            maxHeight: "unset",
            overflow: "auto"
          };
        }
      },
      isToggle() {
        if (this.toggle) {
          return this.isOverFlow;
        } else {
          return !this.isShow && this.isOverFlow;
        }
      },
      isText() {
        return this.type === "text";
      }
    },
    created() {
      if (this.itemHeight) {
        this.domHeight = this.line * (this.itemHeight + 10);
      }
    },
    mounted() {
      if (this.isText) {
        this.textInit();
      } else {
        this.init();
      }
    },
    methods: {
      textInit() {
        let scrollHeight = this.$el.querySelector(".html-overFlow").scrollHeight;
        let limitHeight = this.line * this.itemHeight;

        this.isOverFlow = scrollHeight > limitHeight;
      },
      init() {
        this.$nextTick( () => {
          let dom = this.$el.querySelector("._content").firstElementChild; // 获取目标元素
          // let H = dom.offsetHeight;
          let cH = dom.firstElementChild.offsetHeight; // 获取子元素高度
          let lastChildH = dom.lastElementChild.offsetTop; // 获取最后一个子元素相对父级的高度
          let rowH = this.line * ((this.itemHeight || cH) + 10); // 计算n行高度

          this.domHeight = rowH;
          this.isOverFlow = rowH <= lastChildH;
        });
      },
      onShow() {
        this.isShow = !this.isShow;
        this.$emit("callback", this.isShow);
      }
    }
  };
</script>

<style lang="less" scoped>
  @m: 15px;
  @p: 15px;
  @color: #2d2d2d;

  .html-overFlow {
    display: -webkit-box;
    /* autoprefixer: ignore next */
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 20px;
  }

  .d-box {
    margin-top: @m;
    padding: 0 @p @p;
    color: @color;
    background: #fff;
    &:first-child {
      margin-top: 0;
    }
    h3 {
      padding: @m 0;
      font-size: 15px;
      font-weight: bold;
    }
    label {
      display: block;
      margin-top: 10px;
      height: 20px;
      background: url(~assets/images/btn_down@2x.png) no-repeat center;
      background-size: 15px;
      transition: all .3s;
      &.up {
        transform: rotate(180deg);
      }
    }
  }
</style>
