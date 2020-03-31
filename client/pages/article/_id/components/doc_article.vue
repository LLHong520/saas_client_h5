<template>
  <div class="box_wrapper mt10" v-if="dataList.length > 0">
    <div class="common_hd">
      <h3>{{ title }}</h3>
    </div>
    <article-list
      :list="dataList"
      :attr="{
          id: 'id',
          title: 'title',
          headPicUrl: 'headImg',
          authorName: 'auhorName',
          helpNum: 'helpNum',
          cover: 'coverimg',
          pv: 'virtualPv'
        }"
    >
    </article-list>
  </div>
</template>

<script>
  import { commonMixin } from "~/mixins";
  import doctorService from "~/services/doctorService.js";
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
        default: "Ta的文章"
      },
      id: {
        type: String,
      }
    },
    data() {
      return {
        dataList: []
      };
    },
    mounted() {
      console.log(this.id);
      this.getData();
    },
    methods: {
      getData() {
        doctorService.docArticleList({
          id: this.$route.params.id,
          docId: this.id,
          page: 1,
          size: 3,
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
