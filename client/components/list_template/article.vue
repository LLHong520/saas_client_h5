<template>
  <ul v-if="list.length > 0"  class="articleList">
    <li v-for="(item, index) in list" :key="index" :iw="getIw(item)">
      <!-- 视频 -->
      <nuxt-link
        class="video"
        v-if="item.contentType == 1 || isVideo2"
        :to="videoRouter(item)"
      >
        <div class="info_wrap">
          <div class="img icon">
            <div class="title"><span>{{ item[attr.title] }}</span></div>
            <img v-lazy="item[attr.cover]" alt="">
            <label v-if="isVideo2 && (item.readStatus == 1 || item.isRecommend == 1)" class="label" :class="{ isReaded: item.readStatus == 1 }">{{ item.readStatus == 1 ? "看过" : "推荐" }}</label>
            <label v-if="isVideo2 && item.videoTime" class="time"><em>{{ item.videoTime }}</em></label>
          </div>
          <div class="author_bar">
            <span class="face"><img v-lazy="GET_IMG_URL(item[attr.headPicUrl], 'u')" alt=""></span>
            <span class="author_name">{{ item[attr.authorName] }}</span>
            <span v-if="!isVideo2" class="helpNum">{{ item[attr.helpNum] || 0 }}</span>
            <span v-if="!isVideo2" class="pv">{{ item[attr.pv] }}</span>
            <span v-else class="fr">{{ item.createTime | dateFormat("YMD") }}</span>
          </div>
          <div class="tag" v-if="!isVideo2 && item.tags && getArray(item.tags).length > 0">
            <span v-for="(tag, i) in getArray(item.tags)" :key="i">{{ tag }}</span>
          </div>
        </div>
      </nuxt-link>

      <!-- 三张图 -->
      <nuxt-link v-else-if="item.art_images && item.art_images.length > 2 && multiple" :to="{ path: '/article/'+item.id }">
        <div class="info_wrap">
          <div class="tit">{{ item[attr.title] }}</div>
          <div class="img_list">
            <div class="img_item" v-for="(imgItem,i) in item.art_images" v-if="i <= 2" :key="i">
              <span><img v-lazy="GET_IMG_URL(imgItem,'article')" alt=""></span>
            </div>
          </div>
          <div class="author_bar">
            <span class="face"><img v-lazy="GET_IMG_URL(item[attr.headPicUrl], 'u')" alt=""></span>
            <span class="author_name">{{ item[attr.authorName] }}</span>
            <span class="helpNum">{{ item[attr.helpNum] || 0 }}</span>
            <span class="pv">{{ item[attr.pv] }}</span>
          </div>
          <div class="tag" v-if="item.tags && getArray(item.tags).length > 0">
            <span v-for="(tag, i) in getArray(item.tags)" :key="i">{{ tag }}</span>
          </div>
        </div>
      </nuxt-link>

      <!-- 一张图 -->
      <nuxt-link v-else :to="{ path:'/article/'+item.id }">
        <div class="info_wrap">
          <div class="tit">{{ item[attr.title] }}</div>
          <div class="author_bar">
            <span class="face"><img v-lazy="GET_IMG_URL(item[attr.headPicUrl], 'u')" alt=""></span>
            <span class="author_name">{{ item[attr.authorName] }}</span>
            <span class="helpNum">{{ item[attr.helpNum] || 0 }}</span>
            <span class="pv">{{ item[attr.pv] }}</span>
          </div>
          <div class="tag" v-if="item.tags && getArray(item.tags).length > 0">
            <span v-for="(tag, i) in getArray(item.tags)" :key="i">{{ tag }}</span>
          </div>
        </div>
        <div class="img_box" v-if="item.art_images && item.art_images.length > 0"><img :src="GET_IMG_URL(item.art_images[0],'article')" alt=""></div>
        <div class="img_box" v-else-if="item[attr.cover]"><img :src="GET_IMG_URL(item[attr.cover],'article')" alt=""></div>
      </nuxt-link>
    </li>
  </ul>
</template>

<script>
  import {APP_URL} from "@/config";
  import { commonMixin } from "~/mixins";

  export default {
    mixins:[commonMixin],
    props: {
      source: {
        type: String,
        default: ""
      },
      list: {
        type: Array,
        default: []
      },
      multiple: {
        type: Boolean,
        default: false
      },
      isVideo2: {
        type: Boolean,
        default: false
      },
      attr: {
        type: Object,
        default: {
          id: "id",
          title: "title",
          headPicUrl: "headPicUrl",
          authorName: "authorName",
          helpNum: "helpNum",
          cover: "cover",
          pv: "rv"
        }
      }
    },
    data(){
      return {
        APP_URL
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
      },
      // 阅读量公式
      rvFilter(val) {
        let retult = val ? val : 0;

        return (retult + 7) * 98 + 13;
      }
    },
    created(){

    },
    methods:{
      getArray(tags) {
        if (typeof tags == "string") {
          return [tags];
        }

        if (!tags) {
          return [];
        }

        return tags.filter( item => { return item; });
      },
      getIw(item){
        if(this.source == "home"){
          if (this.isVideo2) {
            return `{desc:"科普文章",id:"scienceArticle",ext:{path: ${APP_URL}/video/${item.id}}}`;
          }else{
            return `{desc:"科普文章",id:"scienceArticle",ext:{path: ${APP_URL}/article/${item.id}}}`;
          }
        }else{
          return "";
        }
      },
      videoRouter(item) {
        if (this.isVideo2) {
          return {
            path: "/video/"+item.id,
          };
        } else {
          return {
            path: "/article/"+item.id,
            query: {
              type: "video",
              sourceType: item.sourceType,
              authorId: item.authorId
            }
          };
        }
      }
    }
  };
</script>
<style lang="less" scoped>
  @import "~/assets/css/list.css";

  .text-overFlow(@n: 2) {
    display: -webkit-box;
    /* autoprefixer: ignore next */
    -webkit-box-orient: vertical;
    -webkit-line-clamp: @n;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .video {
    .img {
      position: relative;
      overflow: hidden;
      border-radius: 4px;
      img, video {
        display: block;
        height: 100%;
        background: #eaeaea;
        border-radius: 4px;
      }
      img {
        min-height: 150px;
        max-height: 220px;
        width: 100%;
      }
      &.icon {
        position: relative;
        &::after {
          content: "";
          position: absolute;
          top: 55%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 50px;
          height: 50px;
          background: url(../../assets/images/common_btn_play_big@2x.png) no-repeat;
          background-size: 100%;
          z-index: 2;
        }
      }
      .label {
        position: absolute;
        bottom: 8px;
        left: 8px;
        padding: 1px 5px;
        color: #fff;
        font-size: 12px;
        background: #FFB400;
        border-radius: 2px;
        &.isReaded {
          background: rgba(0,0,0,.6);
        }
      }
      .time {
        position: absolute;
        bottom: 8px;
        right: 8px;
        padding: 1px 8px;
        color: #fff;
        font-size: 12px;
        border-radius: 25px;
        background: rgba(0,0,0,.6);
        em {
          display: inline-block;
        }
      }
      .title{

        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        padding: 13px 13px;
        font-size: 16px;
        line-height: 21px;
        color: rgba(255, 255, 255);
        background: linear-gradient(180deg,rgba(0,0,0,.6) 0%,rgba(0,0,0,0) 99%);
        span {
          .text-overFlow();
        }
      }
    }
  }
</style>
