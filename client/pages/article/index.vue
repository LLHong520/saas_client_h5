<template>
  <section class="container">
    <m-header
      :title="PAGE_APP_OBJ.label"
      :border_on="false"
      :isSuspension="true"
    ></m-header>
    <!-- 文章tab -->
    <no-ssr>
      <m-filter v-model="tabIndex" :list="filters" ref="tabFilters" @change="reloadList"></m-filter>
    </no-ssr>
    <div class="blank40"></div>
    <!-- 文章tab end-->

    <!-- 文章列表 -->
    <div class="box_wrapper">
      <article-list
        :list="articleList"
        :multiple="true"
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

      <!-- 模块占位 -->
      <section class="loadingPlaceHolder" v-show="loading">
        <loadingPlaceHolder  v-for="n in 10" :key="n.key"/>
      </section>

      <page-loading
        :loading="loading"
        :end="isReachEnd"
        :empty="articleList.length == 0"
        @loadFn="getArticle"
      ></page-loading>
    </div>
  </section>
</template>

<script>
  import { commonMixin,comtyIdValid,asyncDataMixin} from "~/mixins";
  import header from "~/components/header.vue";
  import articleList from "@/components/list_template/article.vue";
  import loadingPlaceHolder from "@/components/loading-place-holder/loading-place-holder";
  import filter from "~/components/iwen/filter.vue";
  import pageLoading from "~/components/pageLoading.vue";
  import articleService from "~/services/articleService.js";

  export default {
    mixins: [commonMixin,comtyIdValid,asyncDataMixin],
    components: {
      mHeader: header,
      mFilter: filter,
      articleList,
      loadingPlaceHolder,
      pageLoading
    },
    async asyncData({ route, redirect,store,query }) {
      // 获取社区信息
      let comtyInfo = await comtyIdValid.getComtyInfo({ redirect, store, query });

      // 检查应用是否开放
      let PAGE_APP_OBJ = await commonMixin.methods.SET_PAGE_PERMISSION("0", { route, redirect, store });

      // 分类
      let filters = [
        { name: "全部", type: "" },
        { name: "热门", type: "hot"}
      ];

      let articleType = await articleService.queryAllArticleTypes({})
        .then((res) => {
          if (res.status == 200 && res.data && res.data.length > 0) {
            let list = res.data || [];
            return list.sort((a, b) => a.sort - b.sort );
          } else {
            return [];
          }
        })
        .catch(() => {
          return [];
        });

      if (articleType.length > 0) {
        filters.push({ name: "分类", type: "type", children: articleType });
      }

      return {
        comtyInfo,
        filters,
        PAGE_APP_OBJ
      };
    },
    data() {
      return {
        tabIndex: "",
        articleList: [],
        loading: false,
        isReachEnd: false,
        currentPage: 0,
        pageCount: 2,
        pageSize: 10,
        loadTxt: "查看更多",
        filters: [
          {
            name: "全部",
            type: ""
          },
          {
            name: "热门",
            type: "hot",
          },
          /*{
            name: "分类",
            type: "type",
            children: list
          }*/
        ]
      };
    },
    watchQuery: ["comtyId"],
    computed: {},
    mounted() {
      this.getArticle();
      // articleService.queryAllArticleTypes({});
    },
    methods: {
      reloadList() {
        this.articleList = [];
        this.currentPage = 0;
        this.pageCount = 2;
        this.getArticle();
      },
      getContent(ctx) {
        // 获取富文本图片
        if (!ctx) { return []; }

        let imgArr = [];
        let imgReq = /<img.*?(?:>|\/>)/gi;
        let srcReq = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;

        // 处理图片
        if (ctx.match(imgReq)) {
          ctx = ctx.match(imgReq);
          ctx.forEach( item => {
            if (!item) { return; }

            let url = item.match(srcReq)[1];
            imgArr.push(url);
          });
        }

        return imgArr;
      },
      getArticle() {
        if (this.loading) return;
        this.loading = true;

        let data = {
          type: this.tabIndex,
          page: this.currentPage + 1,
          size: this.pageSize,
        };

        articleService.queryListPaged(data)
          .then((res) => {
            if (res.status == 200 && res.data) {
              res.data = res.data.map( item => {
                return {
                  ...item,
                  art_images: this.getContent(item.content)
                };
              });

              this.articleList = this.articleList.concat(res.data);
              this.currentPage = this.currentPage + 1;
              this.pageCount = Math.ceil(res.total / this.pageSize);
              this.isReachEnd = this.currentPage + 1 > this.pageCount;
            }
          })
          .finally(() => {
            this.loading = false;
          });
      }
    },
    head() {
      return {
        title: `医疗科普文章_${this.comtyInfo.comtyName}`,
        meta: [
          {
            name: "keywords",
            content: `专家团队_${this.comtyInfo.comtyName}`
          },
          {
            hid: "description",
            name: "description",
            content: "专家团队,由大牌专家亲自领衔,专业团队撰写医疗科普文章,为广大患者用户普及医疗知识,解决日常医疗疑难问题"
          }
        ],
      };
    }
  };

</script>

<style lang="less" scoped>
  .blank40 {
    height: 40px;
  }
</style>
