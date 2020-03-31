<template>
  <!-- You can find this swiper instance object in current component by the "mySwiper"  -->
  <div class="ewm" v-if="isShow">
    <div class="layer_ewm">
      <dl>
        <dt><img :src="logo" width="50" height="50" alt=""></dt>
        <dd>{{title}}</dd>
      </dl>
      <div class="ewm_box">
        <img :src="ewmUrl" alt="">
        <p>扫一扫 关注社区</p>
      </div>
      <a href="javascript:;" class="close" @click="close"></a>
    </div>
    <div class="shadow" @click="close"></div>
  </div>
</template>

<script>
export default {
  props: {
    logo:{
      type: String,
      default:""
    },
    ewmUrl:{
      type: String,
      default:""
    },
    title:{
      type: String,
      default:""
    },
    isShow:{
      type:Boolean,
      default:false
    }
  },
  data () {
    return {
      ewmIsShow:this.isShow,
    };
  },
  watch:{
    isShow(val){
      this.ewmIsShow=val;
    },
    ewmIsShow(val){
      this.$emit("on-change-show",val);
    }
  },
  methods:{
    close(){
      this.ewmIsShow=false;
    }
  }
};
</script>


<style lang="less" scoped>
.ewm{
  padding: 78px 22px;
  position: fixed;
  width: 100%;
  height:100%;
  left: 0;
  top:0;
  z-index: 997;
  .shadow{
    position: absolute;
    width: 100%;
    height:100%;
    left: 0;
    top:0;
    background:rgba(0,0,0,0.4);
    z-index: 995;
  }
  .close{
    position: absolute;
    left: 50%;
    bottom: -50px;
    margin-left: -20px;
    display: block;
    width: 40px;
    height: 40px;
    background: url(../assets/images/btn_icon_cancel_pure1@2x.png) no-repeat;
    background-size: cover;
    z-index: 996;
  }
  dl{
    padding: 40px 0 30px 0;
    img{
      display:block;
      width: 50px;
      height: 50px;
      margin: 0 auto;
    }
    dd{
      font-size: 15px;
      color: #2D2D2D;
      line-height: 21px;
      padding-top: 11px;
      font-weight: bold;
    }
  }
  .layer_ewm{
    position: relative;
    width:100%;
    height: 100%;
    max-height: 470px;
    background-color: #fff;
    border-radius: 8px;
    z-index: 996;
    text-align: center;
  }
  .ewm_box{
    width: 200px;
    height: 240px;
    margin: 0 auto;
    border:1px solid #EFEFEF;
    border-radius: 8px;
    padding: 10px;
    font-size: 15px;
    line-height: 50px;
    color: #999;
    img{
      display: block;
      width: 180px;
      height: 180px;
    }
  }
}
</style>
