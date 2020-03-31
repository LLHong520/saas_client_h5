<template>
  <section class="container">
    <m-header title="修改手机号码"></m-header>

    <div class="d-list">
      <div class="ipt_wrapper">
        <label>手机号</label>
        <input type="text" class="ipt_nickName" v-model="params.mobile" placeholder="请输入手机号">
        <em v-show="params.mobile" class="delete" @click="params.mobile=''"></em>
      </div>
      <div class="ipt_wrapper">
        <label>验证码</label>
        <input type="text" class="ipt_nickName" v-model="yzm" placeholder="请输入验证码">
        <countDown v-model="isWaiting" :time="90" @click="getYZM"></countDown>
      </div>
    </div>

    <div class="btn_box">
      <button class="btn_ok" :disabled="isSubmit || !yzm || !params.mobile" @click="onSubmit">{{ isSubmit ? "正在发送..." : "确定修改"}}</button>
    </div>
  </section>
</template>

<script>
  // import tools from "~/utils/tools.js";
  import { commonMixin } from "~/mixins";
  import header from "~/components/header.vue";
  import countDown from "~/components/iwen/countDown.vue";
  import userService from "~/services/userService.js";
  import sysService from "~/services/sysService.js";

  export default {
    mixins: [commonMixin],
    components: {
      mHeader: header,
      countDown
    },
    middleware: ["checkLogin"],
    data() {
      return {
        yzm: "",
        loading: false,
        isWaiting: false, // 等待验证码
        isSubmit: false,
        params: {
          mobile: ""
        }
      };
    },
    watch: {
      "params.mobile"(val) {
        // ios复制粘贴时会带有其他格式或unicode
        this.params.mobile = val.replace(/[^\d]/g, "");
      }
    },
    methods: {
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

        userService.updateMobile(this.params).then( res => {
          if (res.status == 200 && res.data) {
            this.$toast.tip("修改手机号成功！");
            this.$router.go(-1);
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
      }
    },
    head() {
      return {
        title: "修改手机号码",
      };
    }
  };

</script>

<style lang="less" scoped>
  .d-list {
    padding: 0 15px;
    background: #fff;

    .ipt_wrapper {
      position: relative;
      display: flex;
      align-items: center;
      font-size: 15px;
      & + .ipt_wrapper {
        border-top: 1px solid #F3F4F5;
      }
      label, span {
        flex: none;
        word-break: keep-all;
      }
      input {
        flex: 1;
        color: #282828;
      }
      span {
        padding: 3px 10px;
        font-size: 12px;
        border: 1px solid #EFEFEF;
        border-radius: 25px;
        &.disabled {
          color: #999;
        }
      }
      .delete {
        display: block;
        width: 19px;
        height: 19px;
        background: url(../../assets/images/btn_delete_s@2x.png) no-repeat;
        background-size: cover;
        position: absolute;
        right: 15px;
        top: 17px;
      }
    }
  }

  .ipt_nickName {
    box-sizing: border-box;
    background-color: #fff;
    border: 0;
    height: 53px;
    padding: 15px 20px;
    width: 100%;
    line-height: 23px;
    font-size: 15px;
  }

  .btn_box {
    padding: 10px;
  }

  .btn_ok {
    width: 100%;
    height: 40px;
    line-height: 40px;
    color: #fff;
    font-size: 16px;
    text-align: center;
    background-color: #2688FC;
    display: block;
    border-radius: 4px;
    &:disabled {
      opacity:0.3;
    }
  }

</style>
