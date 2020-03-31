<template>
  <div class="d-dialog">
    <transition name="bg">
      <div v-show="isShow" class="d-dialog-bg" @click="close"></div>
    </transition>

    <transition name="bounce">
      <div class="d-dialog-container" v-show="isShow" @click="close">
        <div class="container" @click.stop>
          <div class="top">
            <span class="title">预约</span>
          </div>

          <div class="content">
            <p v-html="appointmentInfo"></p>

            <div class="input-line">
              <div class="input">
                <input v-model="params.name" type="text" placeholder="请输入您的姓名" maxlength="8">
              </div>

              <div class="radio">
                <label><input v-model="params.gender" type="radio" value="1">先生</label>
                <label><input v-model="params.gender" type="radio" value="2">女士</label>
              </div>
            </div>

            <div class="input encrypt">
              <p v-show="params.phone" v-html="formatEncrypt(params.phone, 11)" @click="inputFocus"></p>
              <input v-model="params.phone" ref="encrypt" type="number" placeholder="请输入您的手机号码" oninput="if(value.length>11)value=value.slice(0,11)" pattern="[0-9]*">
              <!-- number 和 maxlength同时用时，maxlength会失效 -->
              <!--<input v-model="params.phone" type="number" placeholder="请输入您的手机号码" maxlength="11" pattern="[0-9]*">-->
            </div>

            <div class="input"  v-if="this.dataInfo.isCheckPhone && this.dataInfo.isCheckPhone == 1">
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
            <div class="tips">您的个人信息我们将进行加密处理，请放心填写</div>
            <div class="button"  iw="{desc:'预约表单-立即预约',id:'yuyueSubmitButtom'}" :class="{ disabled: isSubmit }" @click="onSubmit">{{ isSubmit ? "提交预约中..." : "立即预约" }}</div>
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
      typeName() {
        return this.type == "hospital" ? "医院" : "医生";
      },
      appointmentInfo() {
        let { target, dataInfo, time,service } = this.options;
        if (target && dataInfo) {
          if (this.type == "hospital") {
            //1.6.4 不显示时间
            // let times = [
            //   "09:00-10: 00",
            //   "10:00-11: 00",
            //   "11:00-12: 00",
            //   "14:00-15: 00",
            //   "15:00-16: 00",
            //   "16:00-17: 00",
            //   "17:00-18: 00",
            // ];

            let list = target.appointmentDoctorList || [];
            let doctor = list.length > 0 ? (list[0].name || "") : "";
            // let random = Math.floor(Math.random() * times.length);
            // let doctorTime = times[random];
            if(doctor){
              return `您预约了 <b>${ target.name }</b> 医院 <b>${ doctor }</b> 医生的 <b>${service[0]? service[0].name:"门诊" }</b> 项目，请填写姓名、联系方式，方便后续医生与您联系。`;
            }else{
              return `您预约了 <b>${ target.name }</b> 医院的 <b>${service[0]? service[0].name:"门诊" }</b> 项目，请填写姓名、联系方式，方便后续医生与您联系。`;
            }
           
          } else  {
            return `您预约了 <b>${ target.name }</b> 医生 <b>${ time.name }</b> 的 <b>${service[0]? service[0].name:"门诊" }</b> 项目，请填写姓名、联系方式，方便后续医生与您联系。`;
          }
        }
      }
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
        if(this.loading){
          return;
        }
        this.loading = true;
        let verify = await this.verify();
        if (!verify) { 
          this.loading=false;
          return; 
        }

        if (this.isSubmit) { return; }

        this.isSubmit = true;

        let params = this.getSubmitParams();

        communityService.addPlanForm(params).then( res => {
          this.loading=false;
          if (res.status == 200) {
            window._agl && window._agl.push(["track", ["success", {t: 3}]]); // 百度收集表单统计
            this.$emit("success");
            this.close();
            this.$toast.tip("预约成功^^工作人员将会在近期与您取得联系，请保持电话通畅");
            //打点提交成功
            this._dataCollect({
              contentId: this.$route.query.planId,
              contentType: "13",
              operationType: "5"
            });
          } else {
            this.$toast.tip(res.message);
          }
        }).finally( () => {
          this.isSubmit = false;
          this.loading=false;

          //打点提交
          this._dataCollect({
            contentId: this.$route.query.planId,
            contentType: "13",
            operationType: "4"
          });
        });
      },
      async verify(type) {
        let reg = /^1[0-9]\d{9}$/; // 手机号正则
        let status = this.options.dataInfo ? this.options.dataInfo.status : 0;
        status = Number(status);

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

        if ([0, 1, 2, 3].includes(status)) {
          this.$toast.tip("活动暂未开始");
          return false;
        }

        if (!type && this.options.dataInfo.isCheckPhone == 1 && !this.yzm) {
          this.$toast.tip("请输入验证码");
          return false;
        }

        return true;
      },
      getSubmitParams() {
        let { target, location, dataInfo, time ,service} = this.options;
        let { query } = this.$route;

        return {
          name: this.params.name,
          phone: this.params.phone,
          sendCode: this.yzm,
          channel: query.channel || "",
          city: location.city,
          comtyId: target.comtyId,
          doctorId: target.doctorId,
          hospitalId: target.hospitalId,
          projectId:service[0]?service[0].id:"",
          projectName:service[0]?service[0].name:"",
          planId: dataInfo.id,
          planName: dataInfo.name,
          templeteType: dataInfo.templeteType,
          type: dataInfo.templeteType == "hospital" ? "0" : "1",
          weiboUid: this._getThird("id"),
          ip:  this._getIP(),
          appointmentTime:  time.appointmentTime || "",
          gender: this.params.gender || "1",// 字符串：  1.男 2.女
        };
      },
      open() {
        this.type = this.options.type;
        this.dataInfo = this.options.dataInfo;
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

  .input-line {
    display: flex;
    margin-top: 20px;
    .input {
      margin-top: 0!important;
    }
    .radio {
      flex: none;
      display: flex;
      align-items: center;
      margin-left: 30px;
      label {
        display: flex;
        align-items: center;

        min-width: 50px;
        font-weight: normal;
        & + label {
          margin-left: 20px;
        }
        input[type="radio"], input[type="checkbox"] {
          margin-right: 5px;
          width: 20px;
          height: 20px;
          flex: none;
        }
        input[type="radio"] {
          background: url(~assets/images/btn_chb_normal.png) no-repeat center;
          background-size: 100%;
          &:checked {
            background: url(~assets/images/btn_chb_normal_on.png) no-repeat center;
            background-size: 100%;
          }
        }
      }
    }
  }

  .bottom {
    flex-direction: column;
    .tips {
      padding: 8px 0;
      font-size: 12px;
      text-align: center;
      color: #E8A705;
      background:rgba(255,248,212,1);
      border-radius:0px 0px 2px 2px;
    }
  }
</style>
