<template>
    <div v-if="postList.length>0 && GET_PAGE_PERMISSION_MODULE('2')" class="box_wrapper mt10">
    <!-- <div  class="box_wrapper mt10"> -->
      <div class="common_hd">
        <h3>{{ $store.getters.getCurrPermissionObj("2").label || "热门帖子" }}</h3>
        <nuxt-link :to="{path:'/tieba'}" class="toMore"></nuxt-link>
      </div>
      <m-post :postList="postList"></m-post>
    </div>
</template>

<script>
import {commonMixin} from "~/mixins";
import post from "~/components/swiper_post.vue";
import homeService from "~/services/homeService.js";
export default {
  mixins:[commonMixin],
  components: {
    mPost:post
  },
  data(){
    return {
      postList:[],
    };
  },
  created(){
    this.getPostbarSet();
  },
  methods:{
    getPostbarSet(){
      let queryParams = {};
      homeService.getPostbarSet(queryParams)
        .then(((res)=>{
          if(res.status==200&&res.data){
            this.postList=res.data;
          }
        }));
    }
  }
};
</script>
<style scoped>
</style>
