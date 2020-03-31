<template>
  <section class="container">
    <m-header v-if="showHeader" :title="message||''" :back_on="true" :backNum="backNum"></m-header>
    <div class="introduce_card">
      <div class="community_logo" v-if="statusCode == 404"><img src="~/assets/images/default/bg_null_error@2x.png" alt=""></div>
      <div class="community_logo" v-if="statusCode == 400"><img src="~/assets/images/default/bg_null_error@2x.png" alt=""></div>
      <div class="community_logo" v-else-if="statusCode == 410"><img src="~/assets/images/default/bg_null_user@2x.png" alt=""></div>
      <div class="community_logo" v-else-if="statusCode == 504"><img src="~/assets/images/default/bg_null_bbs_out@2x.png" alt=""></div>
      <div class="community_logo" v-else><img src="~/assets/images/default/bg_null_error@2x.png" alt=""></div>
      <dl class="message" v-if="statusCode == 404">
        <dt v-if="message!=''">{{message}}</dt>
        <dt v-else>页面不存在</dt>
      </dl>
      <dl class="message" v-else-if="statusCode == 504">
        <dt>社区内容准备中...，敬请期待</dt>
      </dl>
      <dl class="message" v-else-if="statusCode == 400">
        <dt>{{message}}</dt>
      </dl>
      <dl class="message" v-else-if="statusCode == 410">
        <dt>您的账号已被停用</dt>
      </dl>
      <dl  class="message" v-else-if="statusCode == 604">
        <dt>该社区不存在圈子</dt>
      </dl>
      <dl v-else-if="error.statusCode === 704">
        <dt>{{error.message}}</dt>
      </dl>
      <dl v-else-if="error.statusCode === 804">
        <dt>{{error.message}}</dt>
      </dl>
      <dl  class="message" v-else>
        <dt>应用异常</dt>
      </dl>
    </div>
  </section>
</template>

<script>
  import { commonMixin} from "~/mixins";
  import header from "~/components/header.vue";
  export default {
    mixins: [commonMixin],
    components: {
      mHeader: header
    },
    data() {
      return {
        backNum:-1,
        statusCode:404,
        showHeader:false,
        message:"",
      };
    },
    created() {
      this.backNum = parseInt(this.$route.query.backNum);
      this.statusCode = this.$route.query.statusCode;
      this.message = this.$route.query.message;
      this.showHeader = this.$route.query.showHeader=="false"?false:true;
    },
    methods: {},
    head() {
      return {
        title: this.message||"",
      };
    }
  };

</script>
<style lang="less" scoped>
  .container {
    text-align: center;
    position:fixed;
    bottom:0;
    right:0px;
    left:0px;
    top:0px;
    background-color: #fff;
}

  h1 {
    padding: 15px 0;
  }

  .introduce_card {
    text-align: center;
    position:fixed;
    left:50%;
    top:50%;
    width:100%;
    transform:translate(-50%,-50%);

    .community_logo {
      img {
        display: block;
        width: 195px;
        height: 200px;
        margin: 0 auto;
      }
    }

    dl {
      font-size: 14px;
      line-height: 20px;
      color: #2D2D2D;
      padding: 10px 38px 0;
    }

    dt {
      font-size: 15px;
      font-weight: bold;
      color:#ccc;
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
