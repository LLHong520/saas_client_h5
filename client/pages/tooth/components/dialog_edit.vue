<template>
  <div class="d-dialog" v-show="isShow">
    <transition name="bg">
      <div v-show="isShow" class="d-dialog-bg" @click="close"></div>
    </transition>

    <transition name="bounce">
      <div class="d-dialog-container" v-show="isShow" @click.stop>
        <div @click.stop>
          <div class="top">
            <span class="title">快速预约</span>
          </div>

          <div class="content-form">
            <div class="input-line input-line-name">
              <div class="input">
                <input v-model="params.name" type="text" placeholder="请输入姓名" maxlength="8">
              </div>

              <div class="radio">
                <label><input v-model="params.gender" type="radio" value="1">先生</label>
                <label><input v-model="params.gender" type="radio" value="2">女士</label>
              </div>
            </div>

            <div class="input-line encrypt input-form-phone">
              <p v-show="params.phone" v-html="formatEncrypt(params.phone, 11)" @click="inputFocus"></p>
              <input v-model="params.phone" ref="encrypt" type="number" placeholder="请输入您的手机号码" oninput="if(value.length>11)value=value.slice(0,11)" pattern="[0-9]*">
              <!-- number 和 maxlength同时用时，maxlength会失效 -->
              <!--<input v-model="params.phone" type="number" placeholder="请输入您的手机号码" maxlength="11" pattern="[0-9]*">-->
            </div>

            <div class="input"  v-if="isCheckPhone">
            <!-- <div class="input" v-if="this.dataInfo.isCheckPhone && this.dataInfo.isCheckPhone == 1"> -->
              <input v-model="yzm" type="number" placeholder="请输入验证码" maxlength="6" pattern="[0-9]*">
              <countDown
                v-model="isWaiting"
                :time="90"
                @click="getYZM"
                iw="{id:'yuyueDailogYzm',desc:'预约弹框验证码'}"
                class="yzm"></countDown>
            </div>
          </div>

          <div class="bottom">
            <div class="button" :class="{ disabled: isSubmit }" @click="onSubmit">{{ isSubmit ? "提交预约中..." : "立即预约" }}</div>
            <div class="tips"><span>*</span>您的个人信息将进行加密处理，请放心填写</div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import { dataCollectMixin } from "~/mixins";
  import sysService from "~/services/sysService.js";
  // import userService from "~/services/userService.js";
  import communityService from "~/services/communityService.js";
  import countDown from "~/components/iwen/countDown.vue";

  export default {
    mixins: [dataCollectMixin],
    components: {
      countDown
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      options: {
        type: Object,
      },
      isCheckPhone:{
        type:Boolean,
        default: false
      }
    },
    data() {
      return {
        type: "",
        yzm: "",
        loading:false,
        isWaiting: false,
        isSubmit: false,
        isShow: false,
        dataInfo: {},
        params: {
          phone: "",
          name: "",
          gender: "1",
        }
      };
    },
    computed: {
    },
    watch: {
      value() {
        this.isShow = this.value;
      },
      isShow(val) {
        val ? this.open() : this.close();
      }
    },
    created() {
      this.isShow = this.value;
    },
    methods: {
      async getYZM() {
        let verify = await this.verify(true);
        if (!verify) { return; }

        if (this.loading) { return; }
        this.loading = true;

        if (this.isWaiting) { return; }

        sysService.sendSms({
          name: this.params.name,
          phone: this.params.phone,
          type: "appointment"
        }).then( res => {
          if (res.status == 200) {
            try {
              //爱问统计脚本
              if(window._iwDataer != undefined) {
                window._iwDataer.sendCustomData({
                  id:"YzmSendSuccess",
                  desc:"验证码发送成功",
                  ext:{
                    phone:this.params.phone
                  }
                });
              }
            } catch (error) {
              console.log("发送验证码数据收集失败");
            }
            this.isWaiting = true;
            this.$toast.tip("验证码已发送！");
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

        if (this.isSubmit) { return; }

        this.isSubmit = true;

        let params = this.getSubmitParams();

        communityService.addUserInfo(params).then( res => {
          if (res.status == 200) {
            this.$emit("success");
            this.close();
            this.$toast.tip("预约成功^^工作人员将会在近期与您取得联系，请保持电话通畅");
          } else {
            this.$toast.tip(res.message);
          }
        }).finally( () => {
          this.isSubmit = false;
        });
      },
      async verify(type) {
        let reg = /^1[0-9]\d{9}$/; // 手机号正则

        if (!this.params.name) {
          this.$toast.tip("请输入正确姓名");
          return false;
        }

        if (!this.params.phone) {
          this.$toast.tip("请输入有效手机号码");
          return false;
        }

        if (!reg.test(this.params.phone)) {
          this.$toast.tip("请输入正确的手机号码");
          return false;
        }

        if (!type && this.isCheckPhone && !this.yzm) {
          this.$toast.tip("请输入验证码");
          return false;
        }

        return true;
      },
      getSubmitParams() {
        let { type, id} = this.options;
        // let { query } = this.$route;
        const { channel } = this.$route.query;
        return {
          name: this.params.name,
          phone: this.params.phone,
          hospitalId: `${type}_${id}`,
          weiboUid: this._getThird("id"),
          ip:this._getIP(),
          sex: this.params.gender || "1",// 字符串：  1.男 2.女
          channel
        };
      },
      open() {
        console.log(this.options);
        this.$emit("open");
      },
      close() {
        this.$emit("input", false);
        this.$emit("close");
        Object.assign(this.$data, this.$options.data());// 重置数据
      },
      confirm() {
        this.$emit("confirm");
      },
      cancel() {
        this.$emit("cancel");
      },
      formatEncrypt(str, max) {
        let result = "";
        let len = str.length;
        let isIOS = this.$platformInfo ? this.$platformInfo.os.isiOS : false;

        if (max && max < str.length) {
          len = max;
        }

        for (let i = 0; i < len; i++) {
          if (i > 2 && i < 7) {
            result += `<b class="${ isIOS ? "is-ios" : "" }">*</b>`;
          } else {
            result += str[i];
          }
        }

        return result;
      },
      inputFocus() {
        this.$refs.encrypt.focus();
      }
    }
  };

</script>

<style lang="less" scoped>
  @import "../css/style.less";

  .content-form{
    margin-bottom: 34px;
  }
  .input-line {
    display: flex;
    box-sizing: border-box;
    margin-bottom: 22px;
    height:38px;
    opacity:0.63;
    border-radius:19px;
    padding-left: 47px;
    padding-right: 23px;
    &.input-line-name{
      background: url("../images/name_icon@2x.png") no-repeat 13px center rgba(255,233,219,1);
      background-size: 17px 19px;
      .input{
        flex: 1;
      }
      input{
        height: 100%;
        background-color: transparent;
        width: 100%;
        &::placeholder{
          color: #F7A87D;
        }
      }
    }
    &.input-form-phone{
      background: url("../images/mobile_phone_icon@2x.png") no-repeat 13px center rgba(255,233,219,1);
      background-size: 16px 19px;
      height:38px;
      opacity:0.63;
      border-radius:19px;
      position: relative;
      margin-bottom: 0;
      input{
        height: 100%;
        background-color: transparent;
        &::placeholder{
          color: #F7A87D;
        }
      }
      p{
        position: absolute;
        left:47px;
        display: flex;
        align-items: center;
        height: 100%;
        z-index: 9999;
        background-color: #ffe9db;
        padding-right: 13px;
        letter-spacing: 1px;
      }
    }
    .input {
      margin-top: 0!important;
    }
    .radio {
      flex: none;
      display: flex;
      align-items: center;
      color: #FF7338;
      font-size: 13px;
      label {
        display: flex;
        align-items: center;
        min-width: 50px;
        font-weight: normal;
        & + label {
          margin-left: 15px;
        }
        input[type="radio"], input[type="checkbox"] {
          margin-right: 3px;
          width: 13px;
          height: 13px;
          flex: none;
        }
        input[type="radio"] {
          background: url("../images/radio_box-unchecked@2x.png") no-repeat center;
          background-size: 13px;
          &:checked {
            background: url("../images/radio_box-selected@2x.png") no-repeat center;
            background-size:  13px;
          }
        }
      }
    }
  }
  .bottom {
    flex-direction: column;
    .button{
      width:244px;
      height:38px;
      background:rgba(255,115,56,1);
      box-shadow:0px 8px 11px 0px rgba(255,115,56,0.26);
      border-radius:19px;
      line-height: 38px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: auto;
      font-size:15px;
      font-weight:400;
      color:rgba(255,255,255,1);
    }
    .tips {
      font-size:13px;
      font-weight:400;
      color:#787878;
      line-height:5px;
      text-align: center;
      margin-top: 16px;
      span{
        font-size: 8px;
        color: #FF7338;
      }
    }
  }
</style>
