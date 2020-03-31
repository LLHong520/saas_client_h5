<template>
	<div class="wechatImg" v-show="show" @click="hideWarrp">
		<img src="~/assets/images/share_icons/wechat-share-tips.png" alt="爱问医联" />
	</div>
</template>
<script>
  export default {
    props:{
      show:{
        type:Boolean,
        default:false
      }
    },
    methods:{
      hideWarrp(){
      	this.$emit("update:show",false);
      }
    }
  };
 </script>
<style scoped lang="less" rel="stylesheet/less">
  .wechatImg{
  	position:fixed;
    left:0;
    top:0;
    right:0;
    bottom: 0;
    z-index: 9998;
    background-color:rgba(0,0,0,.7);
    img{
      width:200px;
      position: absolute;
      right: 0;
      top:0;
    }
  }
</style>
