<template>
  <!-- You can find this swiper instance object in current component by the "mySwiper"  -->
  <div class="confirm_wrapper" v-if="isShow">
    <div class="layer_confirm">
      <dl>
        <dt>{{title}}</dt>
        <dd>{{content}}</dd>
      </dl>
      <div class="btn_box">
        <a href="javascript:;" class="cancel" @click="close">{{cancelTxt}}</a>
        <a href="javascript:;" @click="confirmFnCallback">{{confirmTxt}}</a>
      </div>
    </div>
    <div class="shadow" @click="close"></div>
  </div>
</template>

<script>
export default {
  props: {
    title:{
      type: String,
      default:""
    },
    content:{
      type: String,
      default:""
    },
    confirmTxt:{
      type: String,
      default:"删除"
    },
    cancelTxt:{
      type: String,
      default:"取消"
    },
    isShow:{
      type:Boolean,
      default:false
    }
  },
  data () {
    return {
      confirmIsShow:this.isShow,
    };
  },
  watch:{
    isShow(val){
      this.confirmIsShow=val;
    },
    confirmIsShow(val){
      this.$emit("on-change-show",val);
    }
  },
  methods:{
    confirmFnCallback(){
      console.log("确认");
      this.$emit("confirmFn");
    },
    close(){
      this.$emit("cancelFn");
      this.confirmIsShow=false;
    }
  }
};
</script>


<style lang="less" scoped>
.pt20{
  padding-top: 20px;
}
.confirm_wrapper{
  padding: 0 22px;
  position: fixed;
  width: 100%;
  height:100%;
  left: 0;
  top:0;
  z-index: 1000;
  .shadow{
    position: absolute;
    width: 100%;
    height:100%;
    left: 0;
    top:0;
    background:rgba(0,0,0,0.4);
    z-index: 999;
  }
  dl{
    padding: 15px 0 25px 0;
    dt{
      font-size: 16px;
      color: #333;
      line-height: 25px;
      padding-top: 10px;
    }
    dd{
      font-size: 14px;
      color: #999;
      line-height:20px;
      padding-top: 10px;
    }
  }
  .layer_confirm{
    position: relative;
    width:100%;
    top: 50%;
    margin-top: -85px;
    background-color: #fff;
    border-radius: 8px;
    z-index: 1000;
    text-align: center;
  }
  .btn_box{
    display: flex;
    border-top: 1px solid #F3F4F5;
    a{
      flex: 1;
      text-align: center;
      line-height: 45px;
      color: #2688FC;
      border-right: 1px solid #F3F4F5;
      font-size: 15px;
      &.cancel{
        color: #999;
      }
    }
    a:last-child{
      border:0;
    }
  }
}
</style>
