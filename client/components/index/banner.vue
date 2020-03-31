<template>
  <!-- You can find this swiper instance object in current component by the "mySwiper"  -->
  <div class="banner" v-swiper:mySwiper="swiperOption" v-if="slideList.length>0">
    <div class="swiper-wrapper">
      <div class="swiper-slide" v-for="(item,index) in slideList" :key="index"  :iw="`{desc:'首页banner',id:'banner',ext:{url:'${item.bannerImages[0].url}'}}`">
        <img v-if="item.bannerImages && item.bannerImages.length > 0" :src="GET_IMG_URL(item.bannerImages[0].url)">
      </div>
    </div>
    <div class="swiper-pagination swiper-pagination-bullets"></div>
  </div>
</template>

<script>
import {commonMixin} from "~/mixins";
export default {
  mixins:[commonMixin],
  props: {
    slideList:{
      type: Array,
      default:[]
    }
  },
  data () {
    var _this=this;
    return {
      swiperOption: {
        observer:true,
        observeParents:true,
        loop: true,
        autoHeight: true,
        autoplay: {
          delay: 2000,
          stopOnLastSlide: false,
          disableOnInteraction: true
        },
        initialSlide: 0,
        spaceBetween: 0,
        pagination: {
          el: ".swiper-pagination"
        },
        on: {
          slideChange() {
            console.log("onSlideChangeEnd", this);
          },
          tap() {
            console.log("onTap", this.activeIndex);
            let index =this.activeIndex-1;
            if(this.activeIndex>_this.slideList.length){
              index=0;
            }
            if(this.activeIndex==0){
              index=_this.slideList.length-1;
            }
            _this.jumpHandler(_this.slideList[index]);
          }
        }
      }
    };
  },
  created() {
    if (this.slideList.length == 1) {
      this.swiperOption.loop = false;
      this.swiperOption.autoplay = false;
    }
  },
  methods:{
    jumpHandler(item){
      console.log("ds");
      // return;
      let bannerType = item.bannerType;
      let businessType = item.businessType;
      let businessId = item.businessId;
      let url = item.url;

      if (!businessId && !url) {
        return;
      }

      if(bannerType == 1){
        if(url == "") return;
        // window.open(url);
        window.location.href = url;
      } else if (bannerType == 2) {
        return;
      } else{
        // 'businessType':'内容类型（专题:0、文章:1、帖子:2、医生:3、新闻:4、医医课堂:5、健康知识:6、资讯公告:7）.
        if(businessType == 0 ){
          this.$router.push({ path:"/subjects/"+businessId });// 专题
        }else if(businessType == 1){
          this.$router.push({ path:"/article/"+businessId });// 文章
        }else if(businessType == 2){
          this.$router.push({ path:"/tieba/"+businessId });// 帖子
        }else if(businessType == 6){
          this.$router.push({ path:"/news/"+businessId, query: { type: 10 } });// 健康知识
        }else if(businessType == 7){
          this.$router.push({ path:"/news/"+businessId, query: { type: 11 } });// 资讯公告
        }
      }
    }
  }
};
</script>

<style lang="less" scoped></style>
