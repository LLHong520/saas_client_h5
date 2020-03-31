<template>
  <div class="box_wrapper mt10" v-if="dataList.length > 0">
    <div class="common_hd">
      <h3>{{ title }}</h3>
    </div>
    <!--<ul class="articleList">
      <li v-for="(item,index) in dataList" :key="index">
        &lt;!&ndash; 视频 &ndash;&gt;
        <nuxt-link
          class="video"
          v-if="item.contentType == 1"
          :to="{
               path: '/article/'+item.id,
               query: {
                 type: 'video',
                 sourceType: item.sourceType,
                 authorId: item.userId
               }
             }"
        >
          <div class="info_wrap">
            <div class="img icon">
              <div class="title">{{ item.title }}</div>
              <img :src="item.cover" alt="">
            </div>
            <div class="author_bar">
              <span class="face"><img :src="GET_IMG_URL(item.headImg,'u')" alt=""></span>
              <span class="author_name">{{ item.auhorName }}</span>
              <span class="helpNum">{{ item.helpNum || 0 }}鼓励</span>
            </div>
          </div>
        </nuxt-link>

        &lt;!&ndash; 文章 &ndash;&gt;
        <nuxt-link v-else :to="{path:'/article/'+item.id}">
          <div class="info">
            <dl>
              <dt>{{item.title}}</dt>
              <dd class="author_bar">
                <span class="face"><img :src="GET_IMG_URL(item.headPicUrl,'u')" alt=""></span>
                <span class="author_name">{{item.auhorName||"作者名字"}}</span>
                <span class="helpNum">{{item.helpNum}}鼓励</span>
              </dd>
            </dl>
          </div>
          <div class="img_box"><img :src="GET_IMG_URL(item.cover,'article')" alt=""></div>
        </nuxt-link>
      </li>
    </ul>-->

    <article-list
      :list="dataList"
      :attr="{
          id: 'id',
          title: 'title',
          headPicUrl: 'headPicUrl',
          authorName: 'auhorName',
          helpNum: 'helpNum',
          cover: 'cover',
          pv: 'virtualPv'
        }"
    >
    </article-list>
  </div>
</template>

<script>
  import { commonMixin } from "~/mixins";
  import articleService from "~/services/articleService.js";
  import articleList from "@/components/list_template/article.vue";

  export default {
    name: "index_article",
    mixins: [commonMixin],
    components: {
      articleList
    },
    props: {
      title: {
        type: String,
        default: "相关文章"
      }
    },
    data() {
      return {
        dataList: []
      };
    },
    created() {
      this.getData();
    },
    methods: {
      getData() {
        articleService.relativeArticleList({
          id: this.$route.params.id
        }).then( res => {
          if (res.status == 200) {
            this.dataList = res.data || [];
          }
        });
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
      img {
        display: block;
        min-height: 150px;
        max-height: 220px;
        width: 100%;
        background: #eaeaea;
        border-radius: 4px;
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
         background: url(../../../../assets/images/common_btn_play_big@2x.png) no-repeat;
         background-size: 100%;
         z-index: 2;
       }
    }
    .title{
      .text-overFlow();
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        padding: 13px 13px 0;
        font-size: 15px;
        font-weight: 300;
        line-height: 21px;
        color: rgba(255, 255, 255, .8);
        background: linear-gradient(180deg,rgba(0,0,0,.4) 0%,rgba(0,0,0,0) 99%);
      }
    }
  }
</style>
