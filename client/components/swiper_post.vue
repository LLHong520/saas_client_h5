<template>
  <!-- You can find this swiper instance object in current component by the "mySwiper"  -->
  <div class="posts" v-swiper:mySwiper="swiperOption" v-if="postList.length>0">
    <div class="swiper-wrapper">
      <div class="swiper-slide" v-for="(item,index) in postList" :key="index">
        <div class="post_card">
          <nuxt-link :to="{path:'/tieba/'+item.id}">
           <dl>
             <dt>{{item.title}}</dt>
             <dd>
               <span class="img"><img :src="GET_IMG_URL(item.userPhoto,'u')" alt=""></span>
               <span class="name">{{item.userName}}</span>
               <span class="num">{{item.comments}}评论</span>
             </dd>
           </dl>
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {commonMixin} from "~/mixins";
export default {
  mixins:[commonMixin],
  props: {
    postList:{
      type: Array,
      default:[]
    }
  },
  data () {
    return {
      swiperOption: {
        observer:true,
        observeParents:true,
        loop: true,
        autoplay: false,
        slidesPerView: "auto",
        slidesPerColumn: 1,
        spaceBetween: 0,
        on: {
          slideChange() {
          //  console.log("onSlideChangeEnd", this);
          },
          tap() {
          //  console.log("onTap", this);
          }
        }
      }
    };
  },
  mounted() {
  }
};
</script>


<style lang="less" scoped>
.show_n_lines(@num) {
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: @num;
  -webkit-box-orient: vertical;
}
.my-swiper {
  width: 100%;
}
.swiper-wrapper{
  position: relative;
  margin-left: 13px;
}
.swiper-slide{
  height: 83px;
  width: 60%;
}
.posts{
  padding: 0 0 15px;
  margin: 0 -15px;
}
.post_card{
  height: 83px;
  padding: 10px 20px 0 13px;
  // background-color: #f6f8fb;
  // border:1px solid #eff2f7;
  background: url(../assets/images/home_bg_post_first@2x.png) no-repeat;
  background-size: 100% 100%;
  dt{
    .show_n_lines(2);
    height: 38px;
    font-size: 14px;
    line-height: 20px;
    color: #282828;
  }
  dd{
    height: 15px;
    line-height: 15px;
    font-size: 11px;
    color: #999;
    margin-top: 8px;
  }
  .img{
    width: 15px;
    height: 15px;
    border-radius: 15px;
    margin-right: 6px;
  }
  .img img{
    display: block;
    width:15px;
    height: 15px;
    border-radius: 15px;
  }
  .img,.name{
    float: left;
  }
  .num{
    float:right;
  }
}
.swiper-slide-next .post_card{
  height: 68px;
  margin-top: 11px;
  padding: 7px 15px 0 11px;
  dt{
    font-size: 12px;
    line-height: 17px;
  }
  dd{
    font-size: 10px;
    margin-top: 5px;
  }
}
</style>
