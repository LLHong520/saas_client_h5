<template>
    <div v-if="articleList.length>0" class="box_wrapper mt10">
      <div class="common_hd">
        <h3>精选科普</h3>
        <nuxt-link class="toMore" :to="{path:'/article'}" :iw="`{desc:'精选科普-查看全部',id:'articleViewMore',ext:{path:'/article'}}`"></nuxt-link>
      </div>
      <article-list
        source="home"
        :list="articleList"
        :attr="{
          id: 'id',
          title: 'title',
          headPicUrl: 'icon',
          authorName: 'authorName',
          helpNum: 'helpNum',
          cover: 'cover',
          pv: 'virtualPv'
        }"
      >
      </article-list>

      <loadingPlaceHolder v-if="loading" v-for="n in 3" :key="n.key"/>

      <!--<m-page :loading="loading" :title="loading? '加载中...':'加载更多'" @loadFn="getData()" v-if="!isReachEnd"></m-page>
      <m-bottom v-if="isReachEnd && articleList.length>0"></m-bottom>
      <empty v-if="!loading && articleList.length == 0" :isFullScreen="true"></empty>-->

      <page-loading
        v-if="articleList.length > 0"
        :loading="loading"
        :end="isReachEnd"
        :empty="articleList.length == 0"
        :isFullScreen="true"
        bottomTxt="没有更多了~"
        @loadFn="getData"
      ></page-loading>
    </div>
</template>

<script>
  import { commonMixin} from "~/mixins";
  import homeService from "~/services/homeService.js";
  // import page from "~/components/page.vue";
  // import bottom from "~/components/bottom.vue";
  // import empty from "~/components/empty.vue";
  import articleList from "@/components/list_template/article.vue";
  import loadingPlaceHolder from "@/components/loading-place-holder/loading-place-holder";
  import pageLoading from "~/components/pageLoading.vue";

  export default {
    mixins:[commonMixin],
    components: {
      // mBottom: bottom,
      // mPage: page,
      // empty: empty,
      articleList,
      loadingPlaceHolder,
      pageLoading
    },
    data(){
      return {
        articleList:[],
        loading: false,
        currentPage: 0,
        pageCount: 1,
        pageSize: 5
      };
    },
    computed: {
      isReachEnd() {
        let count = this.pageCount > 10 ? 10 : this.pageCount;
        return this.currentPage >= count;
      }
    },
    created(){
      this.getData();
    },
    mounted() {
      this.windowScroll();
    },
    updated() {
      if (this.isReachEnd) {
        $(window).unbind("scroll");
      }
    },
    destroyed() {
      $(window).unbind("scroll");
    },
    methods:{
      windowScroll() {
        let vm = this;
        $(window).scroll(function(){
          let scrollTop = $(this).scrollTop();
          let scrollHeight = $(document).height();
          let clientHeight = $(this).height();

          if(scrollTop + clientHeight >= scrollHeight - 50){
            vm.getData();
          }
        });
      },
      getData(){
        if (this.loading) return;
        this.loading = true;

        let params = {
          page: this.currentPage + 1,
          size: this.pageSize,
        };

        homeService.getArticleSet(params)
          .then((res)=>{
            if(res.status==200 && res.data){
              this.articleList = this.articleList.concat(res.data);
              this.currentPage = this.currentPage + 1;
              this.pageCount = Math.ceil(res.total / this.pageSize) || this.currentPage;
            }
          }).finally(()=>{
            this.loading = false;
          });
      }
    }
  };
</script>
<style lang="less" scoped>

</style>
