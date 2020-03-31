<template>
  <!-- You can find this swiper instance object in current component by the "mySwiper"  -->
  <div class="doctors" v-swiper:mySwiper="swiperOption" v-if="doctorList.length>0">
    <div class="swiper-wrapper">
      <div class="swiper-slide" v-for="(item,index) in doctorList" :key="index">
        <div class="doc_card">
          <a @click="preventDoctorLink(item, item.doctorId)">
            <div class="img"><img :src="GET_IMG_URL(item.faceimage,'doc')" alt=""></div>
            <div class="info">
              <dl>
                <dt class="singleLine"><span class="name">{{item.doctorName}}</span>&nbsp;&nbsp;{{item.title}}</dt>
                <dd class="singleLine">{{item.hospitalName}}&nbsp;&nbsp;{{item.departName}}</dd>
                <dd class="goodat singleLine">{{item.goodAt}}</dd>
              </dl>
            </div>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { commonMixin} from "~/mixins";
export default {
  mixins: [commonMixin],
  props: {
    doctorList:{
      type: Array,
      default:[]
    }
  },
  data () {
    return {
      swiperOption: {
        observer:true,
        observeParents:true,
        loop: false,
        autoplay: false,
        slidesPerView: 1.05,
        slidesPerColumn: 2,
        spaceBetween: 10,
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
.my-swiper {
  width: 100%;
}
.swiper-wrapper{
  position: relative;
}
.swiper-slide{
  height: 90px;
}
.doctors{
  padding: 15px 15px 15px 15px;
  margin:0 -15px;
  overflow: visible;
}
.doc_card{
  height: 90px;
  border-radius: 10px;
  background-color: #EFF2F7;
  a{
    display: flex;
    padding: 12px 12px 0;
  }
  
  .img{
    width: 48px;
    height: 48px;
    border-radius: 48px;
    border: 2px solid #fff;
    margin-right: 10px;
  }
  img{
    display: block;
    width: 44px;
    height: 44px;
    border-radius: 44px;
  }
  .info{
    flex:1;
    box-flex: 1;
    width: 0;
    font-size: 12px;
    line-height: 22px;
  }
  dt{
    color: #282828;
  }
  dd{
    color: #666;
  }
  .name{
    font-size: 16px;
    font-weight: bold;
  }
  .goodat{
    font-size: 11px;
    color: #999;
    padding-left: 22px;
    background: url(../assets/images/icon_speciality@2x.png) no-repeat left center;
    background-size: 14px 10px;
  }
}

</style>
