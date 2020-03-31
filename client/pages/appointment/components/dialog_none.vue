<template>
  <div class="d-dialog">
    <transition name="bg">
      <div v-show="isShow" class="d-dialog-bg" @click="close"></div>
    </transition>

    <transition name="bounce">
      <div class="d-dialog-container" v-show="isShow" @click="close">
        <div class="container" @click.stop>
          <div class="top">
            <span class="title">选择项目</span>
          </div>
          <div class="content">
              <p>
                  当前{{typeName}}未提供预约服务项目，请重新选择。
              </p>
          </div>
          <div class="bottom">
            <div class="button"   @click="close">确定</div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import { dataCollectMixin } from "~/mixins";
  export default {
    mixins: [dataCollectMixin],
    components: {
      
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
       
        isShow: false,
        type:"hospital"
      };
    },
    computed: {
      typeName() {
        return this.type == "hospital" ? "医院" : "医生";
      },
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
      open() {
        this.type = this.options.type;
        this.$emit("open");
      },
      close() {
        this.$emit("input", false);
        this.$emit("close");
      },
      
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
  .d-dialog-container{
      .content{
          p{
            padding: 30px 0;
            text-align: center;
          }
      }
  }
</style>
