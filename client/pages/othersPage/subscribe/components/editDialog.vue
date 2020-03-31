<template>
  <div class="d-dialog" v-show="isShow" @click="close">
    <div class="container" @click.stop>
      <div class="content">
        <h3>预约</h3>
        <p>预约{{ typeName }}：{{ type == "hospital" ? params.hospitalName : params.doctorName }}</p>

        <h4>手机号码</h4>
        <input v-model="params.phone" type="text" placeholder="请输入手机号码" maxlength="50">

        <h4>姓名</h4>
        <input v-model="params.userName" type="text" placeholder="请输入姓名" maxlength="50">
      </div>
      <div class="bottom">
        <span @click="close">{{ cancelBtn }}</span>
        <span class="primary" :class="{ disabled: isSubmit || !params.phone || !params.userName }" @click="onSubmit">{{ isSubmit ? `${ confirmBtn }中...` : confirmBtn }}</span>
      </div>
    </div>
  </div>
</template>

<script>
  import communityService from "~/services/communityService.js";

  export default {
    props: {
      value: {
        type: Boolean,
        default: false
      },
      confirmBtn: {
        type: String,
        default: "预约"
      },
      cancelBtn: {
        type: String,
        default: "取消"
      },
      type: {
        type: String,
        default: "hospital"
      },
      options: {
        type: Object,
      }
    },
    data() {
      return {
        isSubmit: false,
        isShow: false,
        params: {
          phone: "",
          userName: "",
        }
      };
    },
    computed: {
      typeName() {
        return this.type == "hospital" ? "医院" : "医生";
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
      onSubmit() {
        if (!this.verify()) { return; }

        if (this.isSubmit) { return; }

        this.isSubmit = true;

        communityService.addAppointment(this.params).then( res => {
          if (res.status == 200) {
            this.close();
            this.$toast.tip("工作人员将在1~2个工作日内联系您^^");
          } else {
            this.$toast.tip(res.message);
          }
        }).finally( () => {
          this.isSubmit = false;
        });
      },
      verify() {
        if (!this.params.phone) {
          this.$toast.tip("请输入手机号码");
          return false;
        }
        if (!this.params.userName) {
          this.$toast.tip("请输入姓名");
          return false;
        }

        return true;
      },
      open() {
        this.params.hospitalName = this.options.hospitalName;
        this.params.doctorName = this.options.doctorName;
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
      }
    }
  };

</script>

<style lang="less" scoped>
  .d-dialog {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, .4);
    z-index: 999;
    .container {
      width: 80%;
      background: #fff;
      border-radius: 8px;
      overflow: hidden;
      font-size: 15px;
      text-align: center;
      .title {

      }
      .content {
        padding: 22px 15px;
        font-weight: bold;
        text-align: left;
        color: #2D2D2D;
        h3 {
          font-size: 17px;
          font-weight: bold;
        }
        p {
          margin-top: 5px;
          color: #999;
          font-size: 12px;
          font-weight: normal;
        }
        h4 {
          margin-top: 18px;
          font-size: 13px;
        }
        input {
          display: block;
          margin-top: 5px;
          padding: 10px;
          width: 100%;
          font-size: 13px;
          background:rgba(243,244,245,1);
          border-radius:5px;
        }
      }
      .bottom {
        display: flex;
        border-top: 1px solid #E7E7E7;
        font-size: 17px;
        span {
          flex: 1;
          padding: 13px;
          + span {
            border-left: 1px solid #E7E7E7;
          }
          &.primary {
            color: #007AFF;
            &.disabled {
              color:rgba(0, 122, 255, .5)
            }
          }
        }
      }
    }
  }
</style>
