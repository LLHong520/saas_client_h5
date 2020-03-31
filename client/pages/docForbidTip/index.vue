<template>
  <section class="container">
    <div class="check_doctor">
      <div class="check_doctor_wrap">
        <div class="check_doctor_tip">
          <p class="tips_title">温馨提醒</p>
          <p>您还未成为新浪健康爱问医生,</p>
          <p v-clipboard:copy="customerService" v-clipboard:success="onCopy">请联系微信健康医学酱 (<span class="check_doctor_customer">{{customerService}}</span>)</p>
          <p>进行注册吧</p>
        </div>
        <div class="check_doctor_login">
          <div class="cancel_btn gray" v-clipboard:copy="customerService" v-clipboard:success="onCopy">点击复制健康医学酱微信</div>
          <div class="cancel_btn" @click="cancelCover">我已完成注册，点击登录</div>
          <!-- <div class="cancel_tips">健康医学酱</div> -->
        </div>
      </div>
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
        customerService: "aiwenyisheng-1"
      };
    },
    created() {
      this.backNum = parseInt(this.$route.query.backNum);
      this.statusCode = this.$route.query.statusCode;
      this.message = this.$route.query.message;
      this.showHeader = this.$route.query.showHeader=="false"?false:true;
    },
    methods: {
      cancelCover(){
        this.$router.push("/login");
      },
      onCopy(){
        this.$toast.tip("已复制到您的剪切板~");
      }
    },
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
    background: url("./login_bg_base.jpg") no-repeat;
}

.check_doctor{
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  overflow: hidden;
  box-sizing: border-box;
}
.check_doctor_wrap{
  width: 100%;
  position: absolute;
  top:50%;
  transform:translate(0,-50%);
  box-sizing:border-box;
  height:auto;
  padding: 15px 0;
}
.check_doctor_tip{
  width: 100%;
  box-sizing:border-box;
  text-align: center;
  color: #282828;
  font-size: 14px;
  white-space: normal;
  word-break: break-all;
  line-height: normal;
}
.check_doctor_tip p {
  font-size: 14px;
  color: #282828;
  margin-bottom: 5px;
}
.check_doctor_tip p:last-child{
  margin-bottom: 0;
}
.check_doctor_customer{
  display: inline;
  white-space: normal;
  color: #2688FC;
  line-height: normal;
}
.check_doctor_login{
  padding:  50px 30px 0;
  text-align: center;
}

.cancel_btn{
  height: 45px;
  line-height: 45px;
  background: #2688FC;
  text-align: center;
  box-sizing: border-box;
  border-radius:23px;
  font-size: 15px;
  color: #fff;
  margin-bottom: 10px;

  &.gray{
    background-color: #C7C7C7;
  }
}
.cancel_tips{
  font-size: 13px;
  color: #C7C7C7;
  word-break: break-all;
  white-space: normal;
}

</style>
