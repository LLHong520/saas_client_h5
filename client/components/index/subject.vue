<template>
    <div v-if="subjectList.length>0 && GET_PAGE_PERMISSION_MODULE('1')" class="box_wrapper subject mt10">
    <!-- <div v-if="subjectList.length>0" class="box_wrapper mt10"> -->
      <div class="common_hd">
        <h3>{{ $store.getters.getCurrPermissionObj("1").label || "热门专题" }}</h3>
        <nuxt-link :to="{path:'/subjects'}" class="toMore" :iw="`{desc:'热门专题-查看全部',id:'subHotViewMore',ext:{path:'/subjects'}}`"></nuxt-link>
      </div>
      <div v-if="subjectList.length>0" class="relativeSubject" >
        <ul :class="{single:subjectList.length<2}">
          <li v-for="(item,index) in subjectList" :key="index">
            <nuxt-link :to="{path:'/subjects/'+item.subjectId}" :iw="`{desc:'热门专题-${item.title}',id:'subjectHot',ext:{id:'${item.subjectId}'}}`">
              <!-- <div class="img"><img  v-lazy="GET_IMG_URL(item.coverUrl)" alt=""></div> -->
              <div class="images_con img" >
                <div class="base_img"></div>
                <div class="image_cut_con" :style="{'background-image':'url('+item.coverUrl+')'}" @click="onPreview(item.coverUrl, 0)"></div>
              </div>
              <div class="shadow" v-if="subjectList.length<2"></div>
              <p class="subject-title">{{item.title}}</p>
            </nuxt-link>
          </li>
        </ul>
      </div>
    </div>
</template>

<script>
import {commonMixin} from "~/mixins";
import homeService from "~/services/homeService.js";
export default {
  mixins:[commonMixin],
  components: {},
  data(){
    return {
      subjectList:[],
    };
  },
  created(){
    this.getSubjectSet();
  },
  methods:{
    getSubjectSet(){
      homeService.getSubjectSet({})
        .then(((res)=>{
          if(res.status==200 && res.data){
            this.subjectList = res.data.filter( item => { return item.subjectId != "";} );
          }
        }));
    }
  }
};
</script>
<style lang="less" scoped>
@import "~/assets/css/list.css";
.show_n_lines(@num) {
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: @num;
  /* autoprefixer: ignore next */
  -webkit-box-orient: vertical;
}
.relativeSubject li .subject-title{
  .show_n_lines(2);
}

.images_con{
  position: relative;
  display: inline-block;   
  border: 1px solid #f3f3f3;
  width: 100%;
  border-radius: 10px;
  overflow: hidden;
  .base_img{
    position: absolute;
    z-index: 0;
    height:0;
    padding-bottom:56.25%; 
    width: 100%;
    background-color: rgba(232,236,239,1);
    background-repeat: no-repeat;
    background-position:center;
    background-size: 50%;
    border: 1px solid #f3f3f3;
    background-image: url(~@/assets/images/img_loading.png);
    border-radius:2px;  
  }
  .image_cut_con{
    position: relative;
    border-radius:2px;
    width: 100%;
    box-sizing: border-box;
    border: 1px solid #f3f3f3;
    height:0;
    background-repeat: no-repeat;
    background-size: cover;
    background-position:center;
    padding-bottom:56.25%; 
  }

}
</style>
