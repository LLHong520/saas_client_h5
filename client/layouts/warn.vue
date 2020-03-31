<template>
  <div class="empty_box vMiddle" :class="{full:isFullScreen}">
    <dl v-if="status===1">
      <dt><img src="~/assets/images/default/bg_null_error@2x.png" alt=""></dt>
      <dd>文章/专题/帖子已删除</dd>
    </dl>
    <dl v-if="status===2">
      <dt><img src="~/assets/images/default/bg_null_user@2x.png" alt=""></dt>
      <dd>您的账号已被停用</dd>
    </dl>
    <dl v-if="status===3">
      <dt><img src="~/assets/images/default/bg_null_bbs_out@2x.png" alt=""></dt>
      <dd>社区内容准备中，敬请期待</dd>
    </dl>
  </div>
</template>

<script>
export default {
  props: {
    isFullScreen: {  //是否满屏显示
      type: Boolean,
      default: true
    },
    status:{ 
      type: Number,
      default: "1"
    }
  },
  computed:{
  },
  updated(){},
  data(){
    return {
    };
  },
  methods:{
  }
};
</script>

<style lang="less" scoped>
.empty_box{
  font-size: 14px;
  color: #ccc;
  text-align: center;
  padding: 10px 0 50px 0;
  background-color: #fff;
  img{
    width: 195px;
    height: 200px;
  }
}
.empty_box.full{
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 99;
  dl{
    position: absolute;
    width: 100%;
    left: 0;
    top: 50%;
    margin-top: -120px;
  }
}
</style>
