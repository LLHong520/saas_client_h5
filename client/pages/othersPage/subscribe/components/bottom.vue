<template>
  <div class="d-bottom" :class="{ isHidden: isHidden }">
    <p class="title">还没找到合适的{{ typeName }}？</p>
    <a
      href="javascript:;"
      class="btn"
      v-clipboard:copy="'aiwenyikang123'"
      v-clipboard:success="onCopy"
    ><i class="icon"></i>联系客服</a>
    <p>点击按钮将自动复制微信客户公众号， 添加成功后会有专人联系您</p>
    <p v-if="!isHidden" class="info">爱问医联科技（深圳）有限公司版权所有 <br/>粤ICP备16042002号-1</p>
  </div>
</template>

<script>
  export default {
    name: "bottom",
    props: {
      type: {
        type: String,
        default: "hospital"
      }
    },
    computed: {
      typeName() {
        return this.type == "hospital" ? "医院" : "医生";
      },
      isHidden() {
        return this.$route.query && !!this.$route.query.form;
      }
    },
    methods: {
      onCopy() {
        this.$toast.tip("已复制，请打开微信添加");
      },
    }
  };
</script>

<style lang="less" scoped>
  @import "../css/style.less";

  .isHidden {
    margin-bottom: 50px!important;
  }
</style>

