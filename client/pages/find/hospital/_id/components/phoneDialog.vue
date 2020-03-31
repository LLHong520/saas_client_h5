<template>
  <div class="d-dialog" v-show="isShow" @click="close">
    <div class="container" @click.stop>
      <div v-if="isBabyTree" class="content">
        <a v-for="(item, index) in list" href="javascript:;" @click="tel(item)" :key="index">{{ item }}</a>
      </div>
      <div v-else class="content">
        <a v-for="(item, index) in list" :href="`tel:${ item }`" :key="index">{{ item }}</a>
      </div>
    </div>
  </div>
</template>

<script>
  import { commonMixin } from "~/mixins";

  export default {
    mixins: [commonMixin],
    props: {
      value: {
        type: Boolean,
        default: false
      },
      title: {
        type: String,
        default: ""
      },
      option: Object,
    },
    data() {
      return {
        isShow: false,
        list: []
      };
    },
    computed:{
      //是否是宝宝树APP中打开
      isBabyTree(){
        let is = false;
        if(process.client){
          is = window.nativeCallByNumber != undefined;
        }
        return is;
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
      open() {
        this.list = this.option.list;
        this.$emit("open");
      },
      close() {
        this.$emit("input", false);
        this.$emit("close");
        Object.assign(this.$data, this.$options.data());// 重置数据
      },
      tel(number){
        try {
          window.nativeCallByNumber(number);
        } catch (error) {
          console.log("调用宝宝树失败~");
        }
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
    margin: 0 auto;
    max-width: 760px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, .3);
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
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        a {
          flex: 1;
          display: block;
          padding: 15px;
          width: 100%;
          color: #007AFF;
          font-size: 16px;
          line-height: 22px;
          word-break: break-all;
          & + a {
            border-top: 1px solid #EFEFEF;
          }
        }
      }
    }
  }
</style>
