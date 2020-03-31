<template>
  <section class="container">
    <m-header title="回复" :back_on="false"></m-header>
    <!-- 圈主 -->
    <div class="master">
      <textarea v-model="content"></textarea>
      <div>
        <a href="javascript:;" class="master_name">
          提交
        </a>
      </div>
    </div>
    <!-- 圈主end -->
  </section>
</template>

<script>
  import {
    commonMixin,
    comtyIdValid
  } from "~/mixins";
  import postBarService from "~/services/postBarService.js";
  import header from "~/components/header.vue";
  export default {
    mixins: [commonMixin, comtyIdValid],
    layout: "layout_nav",
    components: {
      mHeader: header,
    },
    data() {
      return {
        content: "",
        postsId: "",
      };
    },
    created() {
      this.postsId = this.$route.query.postsId;
      console.log(this.postsId);
    },
    mounted() {
      this.dataPvUvcollect({
        businessType: "post",
        collectType: "cmty_h5_postbar_index",
        businessId: this.postBarId
      });
    },
    methods: {
      getPostBarPostlist() {
        if (this.loading) return;
        this.loading = true;
        let _this = this;
        let params = {
          postBarId: this.postBarId,
          isTop: this.postQuery.isTop,
          isRecommend: this.postQuery.isRecommend,
          isEssence: this.postQuery.isEssence,
          postTags: this.postQuery.postTags,
          page: this.postQuery.pageIndex + 1,
          size: this.postQuery.pageSize,
        };
        postBarService.getPostsByPage(params).then(res => {
          _this.loading = false;
          if (res.status == 200) {
            _this.postList = _this.postList.concat(res.data || []);
            _this.postQuery.pageIndex = _this.postQuery.pageIndex + 1;
            _this.pageCount = Math.ceil(res.total / _this.postQuery.pageSize);
            if (_this.postQuery.pageIndex + 1 > _this.pageCount) {
              _this.isReachEnd = true;
            } else {
              _this.isReachEnd = false;
            }
          }
        });
      }
    },
    head() {
      return {
        title: "回复",
      };
    }
  };

</script>

<style lang="less" scoped>
.master textarea{
  background-color: #f8f8f8;
  width: 100%;
  height: 150px;
}
.master a{
  display: block;
  text-align: center;
  line-height: 50px;
}
</style>
