<template>
  <div v-if="dataList.length>0 && GET_PAGE_PERMISSION_MODULE('7')" class="box_wrapper subject video-row mt10">
    <div class="common_hd">
      <h3>{{ $store.getters.getCurrPermissionObj("7").label || "医医讲堂" }}</h3>
      <nuxt-link :to="{path:'/video'}" class="toMore"></nuxt-link>
    </div>

    <ul v-if="dataList.length > 0"  class="articleList">
      <li v-for="(item, index) in dataList" :key="index">
        <nuxt-link
          class="video"
          :to="{
               path: '/video/'+item.id
             }"
        >
          <div class="info_wrap">
            <div class="img icon">
              <img  v-lazy="item.cover" alt="">
              <label v-if="item.readStatus == 1 || item.isRecommend == 1" class="label" :class="{ isReaded: item.readStatus == 1 }">{{ item.readStatus == 1 ? "看过" : "推荐" }}</label>
              <label v-if="item.videoTime" class="time"><em>{{ item.videoTime }}</em></label>
            </div>
            <div class="title-box">
              <div class="title">{{ item.title }}</div>
              <div class="summary">{{ item.content }}</div>
            </div>
          </div>
        </nuxt-link>
      </li>
    </ul>
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
        dataList:[],
      };
    },
    filters: {
      timeFormat(val) {
        let time = Math.round(val / 1000); // 秒数
        let s = Math.round(time % 60);
        let m = parseInt(time / 60);

        function fix(num, limit) {
          if (num >= 100 && limit) {
            return parseInt(num/10);
          }
          if (num >= 10) {
            return num;
          }
          return "0" + num;
        }

        return fix(m) + ":" + fix(s, true);
      }
    },
    created(){
      this.getData();
    },
    methods:{
      getData(){
        let params = {
          page: 1,
          isComty: "1",
          size: 4,
          userId: this.VX_is_login ? this.VX_userInfo.id : ""
        };

        homeService.getVideoSet(params)
          .then( (res) => {
            if(res.status==200 && res.data){
              this.dataList = this.checkHistory(res.data);
            }
          });
      },
      checkHistory(arr) {
        // 未登录时，检查本地是否已看过
        if (!arr || arr.length == 0) { return []; }

        let history = localStorage.getItem("videoHistory") || {};
        history = typeof history == "string"
          ? JSON.parse(history)
          : history;

        if (!this.VX_is_login && history.length != 0) {
          return arr.map( item => {
            if (history[item.id]) {
              item.readStatus = 1;
            }
            return item;
          });
        } else {
          return arr;
        }
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
</style>
