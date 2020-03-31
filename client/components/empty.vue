<template>
  <div class="empty_box vMiddle" :class="{full:isFullScreen}">
    <dl>
      <dt><img src="~/assets/images/default/bg_null_normal@3x.png" alt=""></dt>
      <dd>{{title}}</dd>
    </dl>
  </div>
</template>

<script>
export default {
  props: {
    isFullScreen: {
      //是否满屏显示
      type: Boolean,
      default: false
    },
    title: {
      //提示文字
      type: String,
      default: "暂无内容"
    }
  },
  computed: {},
  updated() {},
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="less" scoped>
.empty_box {
  font-size: 14px;
  color: #ccc;
  text-align: center;
  padding: 10px 0 50px 0;
  background-color: #fff;
  img {
    width: 195px;
    height: 200px;
  }
  dl {
    margin: 0 auto;
  }
}
.empty_box.full {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  max-width: 760px;
  margin: 0 auto;
  z-index: 99;
  dl {
    position: absolute;
    width: 100%;
    left: 0;
    top: 50%;
    margin-top: -120px;
  }
}
</style>
