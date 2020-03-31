<template>
  <section class="container">
    <m-header title="医生详情"></m-header>

    <div class="article_box box_wrapper">
      <div class="title">
        <img v-lazy="GET_IMG_URL(articleInfo.image, 'doc')" alt="">
        <h3>{{ articleInfo.name }}</h3>
        <p>{{ articleInfo.title }} {{ articleInfo.departmentName }}</p>
      </div>

      <div class="article_cont">
        <richText :richHtml="articleInfo.field" />
      </div>
    </div>
    <m-bottom class="white-bg"></m-bottom>
  </section>
</template>

<script>
  import { commonMixin, comtyIdValid } from "~/mixins";
  import doctorService from "~/services/doctorService.js";
  import header from "~/components/header.vue";
  import richText from "~/components/rich_text.vue";
  import bottom from "~/components/bottom.vue";

  export default {
    mixins: [commonMixin],
    components: {
      mHeader: header,
      richText: richText,
      mBottom: bottom,
    },
    async asyncData({route,store,redirect,query}){
      // 获取社区信息
      let comtyInfo = await comtyIdValid.getComtyInfo({ redirect, store, query });

      // 检查应用是否开放
      let PAGE_APP_OBJ = await commonMixin.methods.SET_PAGE_PERMISSION("11", { route, redirect, store });

      let articleInfo = await doctorService.findClinicDoctorByQuery({ id: route.query.id })
        .then((res) => {
          if (res.status == 200 && res.data) {
            return res.data;
          } else {
            return {};
          }
        }).catch( () => {
          return {};
        });

      return {
        comtyInfo,
        PAGE_APP_OBJ,
        articleInfo,
      };
    },
    data() {
      return {
        pid: 0,
        articleInfo: {},
      };
    },
    created() {
      this.pid = this.$route.params.id;
    },
    mounted() {
      this.addUserOperationRecord({
        operationType:0,
        objType:3,
        objTitle:this.articleInfo.name
      });
      $("body").eq(0).css({
        "background-color": "#fff",
        "height": "100%"
      });
    },
    destroyed() {
      $("body").eq(0).css({
        "background-color": "#F2F5F8",
        "height": "100%"
      });
    },
    head() {
      return {
        title: "医生详情",
      };
    }
  };

</script>

<style lang="less" scoped>
  @m: 13px;

  .white-bg {
    background: #fff;
  }

  .article_box {
    background-color: #fff;
    padding-bottom: 15px;
    min-height: 400px;
    .title {
      padding: 30px 30px;
      text-align: center;
      font-size: 12px;
      color: #666;
      line-height: normal;
      img {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        border:2px solid rgba(255,255,255,1);
        box-sizing: content-box;
      }
      h3 {
        margin: 10px 0 5px;
        font-size: 17px;
        font-weight: bold;
        color: #282828;
      }
    }
    .article_cont {
      font-size: 16px;
      line-height: 27px;
      padding: 0 0 15px;
      color: #424242;

      /deep/img {
        max-width: 100%;
        margin: 0 auto;
        display: block;
      }
    }
  }

</style>
