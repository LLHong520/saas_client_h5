<template>
  <section class="container">
    <!-- <m-header title="提示" :back_on="false"></m-header> -->
    <div class="introduce_card">
      <div class="community_logo" v-if="error.statusCode == 404"><img src="~/assets/images/default/bg_null_error@2x.png" alt=""></div>
      <div class="community_logo" v-else-if="error.statusCode == 410"><img src="~/assets/images/default/bg_null_user@2x.png" alt=""></div>
      <div class="community_logo" v-else-if="error.statusCode == 504"><img src="~/assets/images/default/bg_null_bbs_out@2x.png" alt=""></div>
      <div class="community_logo" v-else><img src="~/assets/images/default/bg_null_error@2x.png" alt=""></div>
      <dl v-if="error.statusCode === 404">
        <dt>您访问的页面弄丢了</dt>
      </dl>
      <dl v-else-if="error.statusCode === 504">
        <dt>社区不存在</dt>
      </dl>
      <dl v-else-if="error.statusCode === 604">
        <dt>该社区不存在圈子</dt>
      </dl>
      <dl v-else-if="error.statusCode === 704">
        <dt>{{error.message}}</dt>
      </dl>
      <dl v-else-if="error.statusCode === 804">
        <dt>{{error.message}}</dt>
      </dl>
      <dl v-else>
        <dt>应用异常</dt>
      </dl>
    </div>
  </section>
</template>

<script>
  // import sysServices from "~/services/sysService.js";
  import { commonMixin} from "~/mixins";
  import header from "~/components/header.vue";
  export default {
    mixins: [commonMixin],
    props: ["error"],
    components: {
      mHeader: header
    },
    data() {
      return {};
    },
    created() {},
    methods: {},
    head() {
      return {
        title: "温馨提示",
      };
    }
  };

</script>
<style lang="less" scoped>
  .container {
    text-align: center;
  }

  h1 {
    padding: 15px 0;
  }

  .introduce_card {
    padding-top: 20px;
    background-color: #fff;
    text-align: center;
    padding-bottom: 40px;

    .community_logo {
      img {
        display: block;
        width: 195px;
        height: 195px;
        margin: 0 auto;
      }
    }

    dl {
      font-size: 14px;
      line-height: 20px;
      color: #999;
      padding: 10px 38px 0;
    }

    dt {
      font-size: 15px;
      font-weight: bold;
    }

    dd {
      padding-top: 20px;
    }

    .user_list {
      text-align: center;
      font-size: 13px;
      color: #999;

      .blue {
        color: #4B9BC5;
      }

      .faces {
        text-align: center;
        padding-top: 30px;
      }

      span {
        display: inline-block;

        a {
          width: 24px;
          height: 24px;
          display: inline-block;
          margin-left: -5px;

          img {
            display: inline-block;
            width: 24px;
            height: 24px;
            border-radius: 24px;
            border: 1px solid #fff;
          }
        }
      }
    }
  }

  .btn_box {
    padding: 40px 0;
    background-color: #fff;

    a {
      display: block;
      width: 110px;
      height: 40px;
      border-radius: 4px;
      line-height: 40px;
      text-align: center;
      color: #fff;
      font-size: 14px;
      background-color: #2688FC;
      margin: 0 auto;
    }
  }

</style>
