<template>
  <section class="container d-theme-bg">
    <m-header :border_on="false"></m-header>
    <h3 class="tit">您好，请绑定手机号！</h3>
    <div class="login_box">
      <div class="login_item">
        <label>手机号</label>
        <div class="ipt_wrapper">
          <input type="text" maxlength="11" class="ipt_txt" placeholder="" v-model="params.mobile">
        </div>
      </div>
      <div class="login_item">
        <label>验证码</label>
        <div class="ipt_wrapper">
          <input type="text"  maxlength="6" class="ipt_txt" placeholder="" v-model="yzm">
          <countDown v-model="isWaiting" @click="getYZM" class="ipt_sent"></countDown>
        </div>
      </div>
    </div>
    <div class="login_btn">
      <a href="javascript:;" class="btn_login" :class="{disabled: isSubmit || !yzm || !params.mobile}" @click="onSubmit">
        {{isSubmit ? "正在发送...":"立即绑定"}}
      </a>

      <span @click="routerTo">已有手机号登录</span>
    </div>
  </section>
</template>

<script>
  import { mapState } from "vuex";
  import header from "~/components/header.vue";
  import countDown from "~/components/iwen/countDown.vue";
  import userService from "~/services/userService.js";
  import sysService from "~/services/sysService.js";
  import communityService from "~/services/communityService.js";

  export default {
    components: {
      mHeader: header,
      countDown
    },
    data() {
      return {
        yzm: "",
        loading: false,
        isWaiting: false,
        isSubmit: false,
        commtyName: "",
        params: {
          mobile: ""
        }
      };
    },
    computed: {
      ...mapState({
        VX_userInfo: "userInfo",
        VX_is_login: "is_login",
        VX_token: "token",
      }),
    },
    created() {
      this.getCommunityInstro();
    },
    methods: {
      getCommunityInstro() {
        //社区简介
        communityService.getCommunityInstro({})
          .then((res) => {
            if (res.status == 200 && res.data) {
              this.commtyName = res.data.comtyName;
            };
          });
      },
      async getYZM() {
        let verify = await this.verify(true);
        if (!verify) { return; }

        if (this.loading) { return; }
        this.loading = true;

        if (this.isWaiting) { return; }

        userService.sendCode({
          mobile: this.params.mobile
        }).then( res => {
          if (res.status == 200) {
            this.isWaiting = true;
            this.$toast.tip("发送验证码成功！");
          } else {
            this.isWaiting = false;
            this.$toast.tip(res.message);
          }
        }).catch( () => {
          this.isWaiting = false;
        }).finally( () => {
          this.loading = false;
        });
      },
      async onSubmit() {
        let verify = await this.verify();
        if (!verify) { return; }

        this.isSubmit = true;

        userService.thirdBindMobile(this.params).then( res => {
          if (res.status == 200) {
            this.$store.dispatch("update_userinfo",this.VX_token);
            this.$toast.tip("绑定手机号成功！");
            // this.$router.replace("/");
            this.$router.replace("/login_setting");
          } else {
            this.$toast.tip(res.message);
          }
        }).finally( () => {
          this.isSubmit = false;
        });
      },
      async verify(type) {
        let reg = /^1[0-9]\d{9}$/; // 手机号正则

        if (!this.params.mobile) {
          this.$toast.tip("请输入手机号码");
          return false;
        }

        if (!reg.test(this.params.mobile)) {
          this.$toast.tip("请输入正确的手机号码");
          return false;
        }

        // 检查手机号是否存在
        let isPhone = await userService.checkMobile({
          mobile: this.params.mobile
        }).then( res => {
          if (res.status == 200) {
            return res.data;
          } else {
            this.$toast.tip(res.message);
          }
        });
        if (isPhone) {
          this.$toast.tip("手机号已存在");
          return false;
        }

        if (!type) {
          // 校验验证码是否正确
          let isRight = await sysService.judgeCheckNum({
            checkNum: this.yzm,
            phoneNum: this.params.mobile
          }).then( res => {
            let result = res.status == 200
              && res.data
              && res.data.result
              && res.data.result == "isTrue";

            return result;
          });
          if (!isRight) {
            this.$toast.tip("验证码不正确");
            return false;
          }
        }

        return true;
      },
      routerTo() {
        // 跳转到登录界面
        this.$router.push("/login");
      }
    },
    head() {
      return {
        title: "绑定手机号",
      };
    }
  };

</script>

<style lang="less" scoped>
  .d-theme-bg {
    .container,  /deep/ .header header {
      background-color: #F2F5F8;
    }
    .login_box .login_item .ipt_txt {
      background-color: inherit;
    }
    .login_box .login_item {
      border-bottom: 1px solid #ddd
    }
  }

  .container {
    width: 100%;
    height: 100%;
    min-height: 600px;
    left: 0;
    top: 0;
  }

  .tit {
    font-size: 20px;
    color: #282828;
    padding: 26px 35px 0;
  }

  .login_box {
    padding: 0 35px;

    .login_item {
      padding-top: 30px;
      border-bottom: 1px solid #EFEFEF;

      label {
        font-size: 12px;
        color: #999;
        line-height: 17px;
      }

      .ipt_wrapper {
        display: flex;
      }

      .ipt_txt {
        flex: 1;
        box-flex: 1;
        overflow: hidden;
        font-size: 17px;
        color: #282828;
        line-height: 24px;
        padding: 4px 0;
        border: 0;
      }

      .ipt_sent {
        color: #2688FC;
        font-size: 13px;
        line-height: 24px;
        padding: 4px 0;
      }

      .ipt_sent.disabled {
        color: #999;
        font-size: 13px;
      }
    }
  }

  .login_btn {
    text-align: center;
    padding: 40px 35px 0;

    .btn_login {
      display: block;
      width: 100%;
      height: 40px;
      line-height: 40px;
      text-align: center;
      font-size: 15px;
      background-color: #2688FC;
      color: #fff;
      border-radius: 20px;
    }

    .btn_login.disabled {
      background-color: #CFCFCF;
    }

    span {
      display: block;
      margin-top: 10px;
      padding: 5px;
      text-align: right;
      text-decoration: underline;
      font-size: 12px;
      color: #999;
    }
  }

  .login_fast {
    text-align: center;
    width: 100%;
    margin-top:150px;
  }

</style>
