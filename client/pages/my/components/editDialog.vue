<template>
  <div class="d-dialog" v-show="isShow" @click="close">
    <div class="container" @click.stop>
      <div class="title">{{ title }}</div>
      <div class="content">{{ content }}</div>
      <div class="bottom">
        <span class="primary" @click="confirm">{{ confirmBtn }}</span>
        <span @click="close">{{ cancelBtn }}</span>
      </div>
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
      confirmBtn: {
        type: String,
        default: "解除绑定"
      },
      cancelBtn: {
        type: String,
        default: "取消"
      },
      title: {
        type: String,
        default: ""
      },
      option: Object,
    },
    data() {
      return {
        isShow: false,
        content: ""
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
      open() {
        this.content = this.option.content;
        this.$emit("open");
      },
      close() {
        this.$emit("input", false);
        this.$emit("close");
        Object.assign(this.$data, this.$options.data());// 重置数据
      },
      confirm() {
        this.$emit("confirm");
      },
      cancel() {
        this.$emit("cancel");
      }
    }
  };

</script>

<style lang="less" scoped>
  .d-dialog {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 999;
    margin: 0 auto;
    max-width: 760px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, .3);
    .container {
      width: 80%;
      background: #fff;
      border-radius: 8px;
      overflow: hidden;
      font-size: 15px;
      text-align: center;
      .title {

      }
      .content {
        padding: 25px 10px;
        font-weight: bold;
      }
      .bottom {
        display: flex;
        border-top: 1px solid #E7E7E7;
        span {
          flex: 1;
          padding: 15px;
          + span {
            border-left: 1px solid #E7E7E7;
          }
          &.primary {
            color: #007AFF;
          }
        }
      }
    }
  }
</style>
